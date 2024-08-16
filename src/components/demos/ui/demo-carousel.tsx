import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function DemoCarousel() {
  return (
    <div className='px-14 py-4'>
      <Carousel
        opts={{
          align: 'start',
        }}
        className='w-full  max-w-[250px] md:max-w-[350px] lg:max-w-[500px]'
      >
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className='md:basis-1/2 lg:basis-1/3'>
              <div className='p-1'>
                <Card>
                  <CardContent className='flex aspect-square items-center justify-center p-6'>
                    <span className='text-3xl font-semibold'>{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
