import { Children, MutableRefObject, ReactNode, useRef } from 'react';

import styles from './carousel-slides.module.scss';

type CarouselSlidesProps = {
    children: ReactNode[];
    directionAndStyle: Record<string, unknown>;
    getChildrenRefs: (refs: MutableRefObject<HTMLDivElement>[], index: number) => void;
    withGap: boolean;
    withExtraGap: boolean;
    state: { flexStyle: { flex: string } };
}
export const CarouselSlides = ({children, directionAndStyle, getChildrenRefs, withGap, withExtraGap, state}: CarouselSlidesProps) => {
    const childrenRefs = useRef(Array(Children.count(children)).fill(null));

    const className = [
        withGap && styles.containerWithGap,
        withExtraGap && styles.containerWithExtrapGap,
        !withGap && !withExtraGap && styles.containerWithoutGap
    ].filter(Boolean).join(' ');

    return (
        <div className={className}>
            {children.map((child, index) => (
                <div
                    key={index}
                    style={{ ...directionAndStyle, ...state.flexStyle }}
                    ref={(element) => {
                        childrenRefs.current[index] = element;
                        getChildrenRefs(childrenRefs.current[index], index);
                    }}
                >
                    {child}
                </div>
            ))}
        </div>
    );
};

export default CarouselSlides;
