import {
    TouchEvent,
    MutableRefObject,
    useCallback,
    useEffect,
    useMemo,
    useReducer,
    useRef,
    useState
} from 'react';

import useScreenSize from './useScreenSize';

const MIN_SWIPE_DISTANCE = 50;
const LARGE_BREAKPOINT = 1200;
const MEDIUM_BREAKPOINT = 864;
const SMALL_BREAKPOINT = 528;

const calculateDistanceInPixels = (
    { state, withExtraGap, toFirstChild, toLastChild, fromLastChild }:
        {state: typeof initialState, withExtraGap?: boolean, toFirstChild?: boolean, toLastChild?: boolean, fromLastChild?: boolean}
) => {
    const isFirstNextClick = state.clickNumber.nextClickNumber < 1;
    const slidePercentageTransition = withExtraGap ? (
        (isFirstNextClick || toFirstChild) ? 0.5 : 0.25
    ) : (
        (isFirstNextClick || toFirstChild) ? 0.3 : 0.15
    );
    const fixedSlidePercentageTransition = withExtraGap ? 0.75 : 0.85;

    const distanceInPixels = toLastChild || fromLastChild ?
        state.childrenWidth * slidePercentageTransition :
        state.childrenWidth * slidePercentageTransition + state.gap + state.childrenWidth * fixedSlidePercentageTransition;

    console.log(state.childrenWidth, state.gap, slidePercentageTransition, fixedSlidePercentageTransition, distanceInPixels);

    return Math.round(distanceInPixels);
};

const getSlidesConfig = ({ withGap, withExtraGap }: {withGap: boolean, withExtraGap: boolean}) => ({
    largeScreens: { slidesToDisplay: 5 },
    mediumScreens: { slidesToDisplay: 4 },
    smallScreens: { slidesToDisplay: 3 },
    verySmallScreens: { slidesToDisplay: 2 },
    baseCroppedSlidePercentage: withGap && 0.3 || withExtraGap && 0.5 || 0,
});

const initialState = {
    gap: 0,
    config: {},
    flexStyle: {},
    containerRef: {},
    childrenRefs: [],
    childrenWidth: 0,
    containerWidth: 0,
    childrenNumber: 0,
    slidesToDisplay: 0,
    direction: {
        position: 0,
        toRight: false,
        toLeft: false
    },
    toRight: {
        transform: 'translateX(0px)',
        transition: 'transform 1s'
    },
    toLeft: {
        transform: 'translateX(0px)',
        transition: 'transform 1s'
    },
    clickNumber: {
        nextClickNumber: 0,
        previousClickNumber: 0
    },
    isAtFirstChild: true,
    isAtLastChild: false,
};

//eslint-disable-next-line @typescript-eslint/no-explicit-any
const reducer = (state: typeof initialState, action: any) => {
    switch (action.type) {
        case 'GET_CHILDREN_REFS':
            return { ...state, childrenRefs: action.childrenRefs };
        case 'SET_CHILDREN_NUMBER':
            return { ...state, childrenNumber: action.childrenNumber };
        case 'SET_SLIDES_TO_DISPLAY':
            return { ...state, slidesToDisplay: action.slidesToDisplay };
        case 'SET_CHILDREN_WIDTH':
            return { ...state, childrenWidth: action.childrenWidth };
        case 'SET_CONTAINER_WIDTH':
            return { ...state, containerWidth: action.containerWidth };
        case 'SET_CONTAINER_REF':
            return { ...state, containerRef: action.containerRef };
        case 'SET_CONFIG':
            return { ...state, config: action.config };
        case 'SET_STYLE':
            return { ...state, flexStyle: action.flexStyle };
        case 'SET_SLIDER_GAP':
            return { ...state, gap: action.gap };
        case 'TO_RIGHT':
            return {
                ...state,
                direction: { position: action.payload, toRight: true, toLeft: false },
                toRight: { ...state.toRight, transform: `translateX(-${action.payload}px)` },
                clickNumber: {
                    previousClickNumber: state.clickNumber.previousClickNumber <= 1 ?
                        state.clickNumber.previousClickNumber : state.clickNumber.previousClickNumber - 1,
                    nextClickNumber: action.number
                }
            };
        case 'TO_LEFT':
            return {
                ...state,
                direction: { position: action.payload, toRight: false, toLeft: true },
                toLeft: { ...state.toLeft, transform: `translateX(-${action.payload}px)` },
                clickNumber: { nextClickNumber: state.clickNumber.nextClickNumber - 1, previousClickNumber: action.number }
            };
        case 'IN_BETWEEN':
            return { ...state, isAtLastChild: false, isAtFirstChild: false, displayNext: true, displayPrevious: true };
        case 'SET_AT_FIRST_CHILD':
            return { ...state, isAtFirstChild: true, isAtLastChild: false };
        case 'SET_AT_LAST_CHILD':
            return { ...state, isAtLastChild: action.payload, isAtFirstChild: false };
        default:
            return {
                ...initialState, gap: state.gap, childrenRefs: state.childrenRefs, slidesToDisplay: state.slidesToDisplay,
                childrenNumber: state.childrenNumber, childrenWidth: state.childrenWidth, config: state.config, flexStyle: state.flexStyle
            };
    }
};

type BaseReturnType = {
    state: typeof initialState;
    containerWidth: number;
    getChildrenRefs: (childRef: HTMLDivElement, index: number) => void;
    getContainerRef: (element: HTMLDivElement) => void;
    directionAndStyle: object;
};

export type MobileAndTabletReturnType = {
    onTouchStart: (e: TouchEvent<HTMLDivElement>) => void;
    onTouchEnd: () => void;
    onTouchMove: (e: TouchEvent<HTMLDivElement>) => void;
} & BaseReturnType;

export type DesktopReturnType = {
    handleScrollNext: () => void;
    handleScrollPrevious: () => void;
} & BaseReturnType

type UseCarouselContextProps = {
    withGap: boolean;
    withExtraGap: boolean;
    withTouch: boolean;
}
export const useCarouselContext = ({ withGap, withExtraGap, withTouch }: UseCarouselContextProps): MobileAndTabletReturnType | DesktopReturnType => {
    const closedState = () => initialState;
    const [state, dispatch] = useReducer(reducer, closedState());
    const [touchStart, setTouchStart] = useState<number>();
    const [touchEnd, setTouchEnd] = useState<number>();
    const childrenRefs = useRef<Array<HTMLDivElement>>([]);
    const containerRef = useRef() as MutableRefObject<HTMLDivElement>;
    const screenSize = useScreenSize().screenSize;

    const { largeScreens, mediumScreens, smallScreens, verySmallScreens, baseCroppedSlidePercentage } =
        getSlidesConfig({ withGap, withExtraGap });

    const getChildrenRefs = useCallback((childRef: HTMLDivElement, index: number) => {
        childrenRefs.current[index] = childRef;
    }, []);

    const getContainerRef = useCallback((container: HTMLDivElement) => {
        containerRef.current = container;
    }, []);

    const containerWidth = useMemo(() => containerRef?.current?.offsetWidth, [state.containerRef]);
    const config = useMemo(() => {
        if (!containerWidth) return null;
        if (containerWidth >= LARGE_BREAKPOINT) return largeScreens;
        if (containerWidth >= MEDIUM_BREAKPOINT) return mediumScreens;
        if (containerWidth >= SMALL_BREAKPOINT) return smallScreens;
        return verySmallScreens;
    }, [containerWidth, screenSize]);

    const computeChildrenWidth = useMemo(() => (
        containerWidth - ((config?.slidesToDisplay as number - 1) * state.gap)) / (config?.slidesToDisplay as number - baseCroppedSlidePercentage
    ), [containerWidth, config, state.gap, screenSize]);

    console.log(computeChildrenWidth, childrenRefs.current.map((ref) => ref.offsetWidth) , 'ici');

    const flexStyle = useMemo(() => {
        if (!containerWidth) return {};
        return { flex: `0 0 ${Math.round(computeChildrenWidth)}px` };
    }, [computeChildrenWidth, screenSize]);

    const setGap = useCallback(() => {
        if (withGap) dispatch({ type: 'SET_SLIDER_GAP', gap: 32 });
        if (withExtraGap) dispatch({ type: 'SET_SLIDER_GAP', gap: 48 });
    }, [withGap, withExtraGap]);

    const setChildrenWidth = useCallback(() => {
        dispatch({ type: 'SET_CHILDREN_WIDTH', childrenWidth: Math.round(computeChildrenWidth) });
    }, [computeChildrenWidth, screenSize]);

    const setContainerRef = useCallback(() => {
        dispatch({ type: 'SET_CONTAINER_REF', containerRef });
    }, [containerRef, screenSize]);

    const setContainerWidth = useCallback(() => {
        dispatch({ type: 'SET_CONTAINER_WIDTH', containerWidth });
    }, [containerWidth, screenSize]);

    const setConfig = useCallback(() => {
        dispatch({ type: 'SET_CONFIG', config });
    }, [config, screenSize]);

    const setStyle = useCallback(() => {
        dispatch({ type: 'SET_STYLE', flexStyle });
    }, [flexStyle, screenSize]);

    useEffect(() => {
        if (state.isAtFirstChild) {
            dispatch({});
        }
    }, [state.isAtFirstChild]);

    useEffect(() => {
        setGap();
    }, [setGap]);

    useEffect(() => {
        if (!containerRef) return;
        setContainerRef();
        setContainerWidth();
    }, [setContainerRef, setContainerWidth]);

    useEffect(() => {
        dispatch({ type: 'GET_CHILDREN_REFS', payload: { childrenRefs: childrenRefs.current } });
        dispatch({ type: 'SET_CHILDREN_NUMBER', childrenNumber: childrenRefs.current.length });
        dispatch({ type: 'SET_SLIDES_TO_DISPLAY', slidesToDisplay: config?.slidesToDisplay });
    }, [childrenRefs.current, config]);

    useEffect(() => {
        setConfig();
        setStyle();
    }, [setConfig, setStyle]);

    useEffect(() => {
        setChildrenWidth();
    }, [setChildrenWidth]);

    const directionAndStyle = state.direction.toRight ? state.toRight : state.toLeft;

    const baseReturnedObject = { state, containerWidth, getChildrenRefs, getContainerRef, directionAndStyle };

    const handleScrollNext = () => {
        const toLastChild = state.clickNumber.nextClickNumber === state.childrenNumber - state.slidesToDisplay;
        const distanceToScroll = calculateDistanceInPixels({ state, toLastChild, withExtraGap });

        dispatch({
            type: 'TO_RIGHT',
            payload: state.direction.position + distanceToScroll,
            number: state.clickNumber.nextClickNumber + 1
        });

        if (!toLastChild) {
            return dispatch({ type: 'IN_BETWEEN' });
        }

        dispatch({ type: 'SET_AT_LAST_CHILD', payload: true });
    };

    const handleScrollPrevious = () => {
        const fromLastChild = state.isAtLastChild;
        const toFirstChild = state.clickNumber.nextClickNumber === 1 && state.clickNumber.previousClickNumber >= 0;
        const distanceToScroll = calculateDistanceInPixels({ state, toFirstChild, fromLastChild, withExtraGap });

        dispatch({
            type: 'TO_LEFT',
            payload: state.direction.position - distanceToScroll,
            number: state.clickNumber.previousClickNumber + 1
        });

        if (fromLastChild) {
            dispatch({ type: 'SET_AT_LAST_CHILD', payload: false });
        }

        if (state.clickNumber.nextClickNumber >= 1) {
            return dispatch({ type: 'IN_BETWEEN' });
        }

        return dispatch({ type: 'SET_AT_FIRST_CHILD' });
    };

    if (withTouch) {
        const onTouchStart = (e: TouchEvent) => {
            setTouchEnd(undefined); // otherwise the swipe is fired even with usual touch events
            setTouchStart(e.targetTouches[0]['clientX']);
        };

        const onTouchMove = (e: TouchEvent) => setTouchEnd(e.targetTouches[0]['clientX']);

        const onTouchEnd = () => {
            if (!touchStart || !touchEnd) return;

            const distance = touchStart - touchEnd;
            const isNextSwipe = distance > MIN_SWIPE_DISTANCE;
            const isPreviousSwipe = distance < -MIN_SWIPE_DISTANCE;

            if (isNextSwipe && !state.isAtLastChild) {
                handleScrollNext();
            }
            if (isPreviousSwipe && !state.isAtFirstChild) {
                handleScrollPrevious();
            }
        };

        return { onTouchStart, onTouchEnd, onTouchMove, ...baseReturnedObject };
    }

    return { handleScrollNext, handleScrollPrevious, ...baseReturnedObject };
};
