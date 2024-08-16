import { motion } from 'framer-motion';
import { clx } from '@/lib/utils/clx/clx-merge';

export function Loader() {
    const RIPPLE_VARIANTS = {
        start: {
            opacity: 1,
            scale: 0,
        },
        end: {
            opacity: 0,
            scale: 3,
        },
    };

    const RIPPLE_TRANSITION$ = {
        duration: 2,
        ease: 'easeInOut',
        repeat: Number.POSITIVE_INFINITY,
        repeatDelay: 1,
    };

    return (
        <Container>
            <div className='relative w-10 h-10'>
                <motion.div
                    className='absolute w-full h-full rounded-full opacity-0 bg-neutral-500'
                    variants={RIPPLE_VARIANTS}
                    initial='start'
                    animate='end'
                    transition={RIPPLE_TRANSITION$}
                />
                <motion.div
                    className='absolute w-full h-full rounded-full opacity-0 bg-neutral-500'
                    variants={RIPPLE_VARIANTS}
                    initial='start'
                    animate='end'
                    transition={{ ...RIPPLE_TRANSITION$, delay: 0.5 }}
                />
                <motion.div
                    className='absolute w-full h-full rounded-full opacity-0 bg-neutral-500'
                    variants={RIPPLE_VARIANTS}
                    initial='start'
                    animate='end'
                    transition={{ ...RIPPLE_TRANSITION$, delay: 1 }}
                />
            </div>
        </Container>
    );
}

const Container = clx.div(
    'relative w-full h-full h-[110px] p-4 border rounded-lg flex items-center justify-center',
);
