import useScreenSize from '@/modules/ui/component-level/carousel/useScreenSize';

import { DesktopReturnType, MobileAndTabletReturnType, useCarouselContext as carouselContext } from './useCarousel';

import styles from './carousel-container.module.scss';

type ComponentReturnType = MobileAndTabletReturnType | DesktopReturnType;
type RenderComponentParams = { withGap: boolean; withExtraGap: boolean; } & ComponentReturnType;

type CarouselProps = {
    renderComponent: ({ withGap, withExtraGap, ...carouselProps } : RenderComponentParams) => JSX.Element;
    withGap: boolean;
    withExtraGap: boolean;
    title: string;
}

export const CarouselContainer = ({ renderComponent, withGap, withExtraGap, title }: CarouselProps) => {
    const isMobileOrTablet = useScreenSize().isMobileOrTablet;

    const carouselProps = carouselContext({ withGap, withExtraGap, withTouch: isMobileOrTablet });

    const Component = renderComponent({ ...carouselProps, withGap, withExtraGap });

    return (
        <div
            className={styles.container}
            ref={(containerRef: HTMLDivElement) => carouselProps.getContainerRef(containerRef)}
            onTouchStart={(e) => (carouselProps as MobileAndTabletReturnType).onTouchStart(e)}
            onTouchMove={(e) => (carouselProps as MobileAndTabletReturnType).onTouchMove(e)}
            onTouchEnd={(carouselProps as MobileAndTabletReturnType).onTouchEnd}
        >
            <div className={styles.title}>{title}</div>
            {carouselProps.state.clickNumber.nextClickNumber >= 1 && !isMobileOrTablet && (
                <button
                    className={styles['icon-left-container']}
                    onClick={(carouselProps as DesktopReturnType).handleScrollPrevious}
                >
                    <div className={styles['icon-previous']} />
                </button>
            )}
            <div className={styles.component}>
                {Component}
            </div>
            {!carouselProps.state.isAtLastChild && !isMobileOrTablet && (
                <button
                    className={styles['icon-right-container']}
                    onClick={(carouselProps as DesktopReturnType).handleScrollNext}
                >
                    <div className={styles['icon-next']} />
                </button>
            )}
        </div>
    );
};

export default CarouselContainer;
