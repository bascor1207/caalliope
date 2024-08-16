'use client';

import { format } from 'date-fns';
import { forwardRef } from 'react';

import { cn } from '@/lib/utils/core/cn';
import CalendarIcon from '@/components/icons/calendar';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export const DatePicker = forwardRef<
  HTMLDivElement,
  {
    date?: Date;
    setDate: (date?: Date) => void;
  }
>(({ date, setDate }, ref) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-gray-500 dark:text-gray-400',
          )}
        >
          <CalendarIcon className='mr-2 size-4' />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' ref={ref}>
        <Calendar mode='single' selected={date} onSelect={setDate} />
      </PopoverContent>
    </Popover>
  );
});
DatePicker.displayName = DatePicker.name;
