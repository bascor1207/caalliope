import useScreenSize from "@/modules/ui/component-level/carousel/useScreenSize";

import { DesktopReturnType, MobileAndTabletReturnType, useCarouselContext as carouselContext } from './useCarousel';

import styles from './carousel-container.module.scss';

type CarouselProps = {
    renderComponent: any;
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
                <div
                    className={styles['icon-left-container']}
                    onClick={(carouselProps as DesktopReturnType).handleScrollPrevious}
                >
                    <div className={styles['icon-previous']} />
                </div>
            )}
            <div className={styles.component}>
                {Component}
            </div>
            {!carouselProps.state.isAtLastChild && !isMobileOrTablet && (
                <div
                    className={styles['icon-right-container']}
                    onClick={(carouselProps as DesktopReturnType).handleScrollNext}
                >
                    <div className={styles['icon-next']} />
                </div>
            )}
        </div>
    );
};

export default CarouselContainer;
