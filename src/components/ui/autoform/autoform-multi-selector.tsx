'use client';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Command as CommandPrimitive, useCommandState } from 'cmdk';
import * as React from 'react';
import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from 'react';

import { cn } from '@/lib/utils/core/cn';
import X from '@/components/icons/x';
import { Badge } from '@/components/ui/badge';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';

// TODO UI Autoform

export interface Option {
  value: string;
  label: string;
  disable?: boolean;
  /** fixed option that can't be removed. */
  fixed?: boolean;
}

interface AutoFormMultiSelectorProps {
  value?: Option[];
  defaultOptions?: Option[];
  /** manually controlled options */
  options?: Option[];
  placeholder?: string;
  /** Loading component. */
  loadingIndicator?: React.ReactNode;
  /** Empty component. */
  emptyIndicator?: React.ReactNode;
  /** Debounce time for async search. Only work with `onSearch`. */
  delay?: number;
  /**
   * Only work with `onSearch` prop. Trigger search when `onFocus`.
   * For example, when user click on the input, it will trigger the search to get initial options.
   **/
  triggerSearchOnFocus?: boolean;
  /** async search */
  onSearch?: (value: string) => Promise<Option[]>;
  onChange?: (options: Option[]) => void;
  /** Limit the maximum number of selected options. */
  maxSelected?: number;
  /** When the number of selected options exceeds the limit, the onMaxSelected will be called. */
  onMaxSelected?: (maxLimit: number) => void;
  /** Hide the placeholder when there are options selected. */
  hidePlaceholderWhenSelected?: boolean;
  disabled?: boolean;
  className?: string;
  badgeClassName?: string;
  /**
   * First item selected is a default behavior by cmdk. That is why the default is true.
   * This is a workaround solution by add a dummy item.
   *
   * @reference: https://github.com/pacocoursey/cmdk/issues/171
   */
  selectFirstItem?: boolean;
  /** Allow user to create option when there is no option matched. */
  creatable?: boolean;
  /** Props of `Command` */
  commandProps?: React.ComponentPropsWithoutRef<typeof Command>;
  /** Props of `CommandInput` */
  inputProps?: Omit<
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>,
    'value' | 'placeholder' | 'disabled'
  >;
  /** hide the clear all button. */
  hideClearAllButton?: boolean;
}

export interface AutoFormMultiSelectorRef {
  selectedValue: Option[];
  input: HTMLInputElement;
}

/**
 * This hook can be used when using ref inside useCallbacks
 *
 * Usage
 * ```ts
 * const [toggle, refCallback, myRef] = useRefWithCallback<HTMLSpanElement>();
 * const onClick = useCallback(() => {
    if (myRef.current) {
      myRef.current.scrollIntoView({ behavior: "smooth" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toggle]);
  return (<span ref={refCallback} />);
  ```
 * @returns
 */
function useRefWithCallback<
  T extends HTMLSpanElement | HTMLDivElement | HTMLParagraphElement,
>(): [boolean, (node: any) => void, RefObject<T>] {
  const ref = useRef<T | null>(null);
  const [toggle, setToggle] = useState(false);
  const refCallback = useCallback((node: any) => {
    ref.current = node;
    setToggle((val) => !val);
  }, []);

  return [toggle, refCallback, ref];
}

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

function removePickedOption(
  options: Option[],
  picked: Option[],
  debouncedSearchTerm: string,
): Option[] {
  return options
    .filter((val) => !picked.find((p) => p.value === val.value))
    .filter((option) =>
      option.value.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
    )
    .map((val) => ({ value: val.value, label: val.label }));
}

function isOptionsExist(options: Option[], targetOption: Option[]): boolean {
  return options.some((option) =>
    targetOption.some(
      (target) => target.value.toLowerCase() === option.value.toLowerCase(),
    ),
  );
}

/**
 * The `CommandEmpty` of shadcn/ui will cause the cmdk empty not rendering correctly.
 * So we create one and copy the `Empty` implementation from `cmdk`.
 *
 * @reference: https://github.com/hsuanyi-chou/shadcn-ui-expansions/issues/34#issuecomment-1949561607
 **/
const CommandEmpty = forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof CommandPrimitive.Empty>
>(({ className, ...props }, forwardedRef) => {
  const render = useCommandState((state) => state.filtered.count === 0);
  if (!render) return null;

  return (
    <div
      ref={forwardedRef}
      className={cn('py-6 text-center text-sm', className)}
      cmdk-empty=''
      role='presentation'
      {...props}
    />
  );
});

CommandEmpty.displayName = 'CommandEmpty';

const CommandGroupContent = forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof CommandPrimitive.Item> & {
    container: HTMLDivElement | null;
    selectables: Option[];
    onSelect: (option: Option) => void;
    selectFirstItem: boolean;
    EmptyItem: () => React.ReactNode;
    CreatableItem: () => React.ReactNode;
  }
>(
  (
    {
      className,
      container,
      selectables,
      onSelect,
      selectFirstItem,
      EmptyItem,
      CreatableItem,
      ...props
    },
    ref,
  ) => {
    const virtualizer = useVirtualizer({
      count: selectables.length,
      getScrollElement: () => container,
      estimateSize: () => 35,
      overscan: 5,
    });

    const virtualOptions = virtualizer.getVirtualItems();

    return (
      <>
        {EmptyItem()}
        {CreatableItem()}
        {!selectFirstItem && <CommandItem value='-' className='hidden' />}
        <div
          ref={ref}
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualOptions.map((virtualOption) => {
            const option = selectables[virtualOption.index];
            return (
              <CommandItem
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualOption.size}px`,
                  transform: `translateY(${virtualOption.start}px)`,
                }}
                key={virtualOption.index}
                value={option.value}
                disabled={option.disable}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onSelect={() => onSelect(option)}
                className={cn(
                  'cursor-pointer',
                  option.disable && 'cursor-default text-gray-500 dark:text-gray-400',
                )}
                {...props}
              >
                {option.label}
              </CommandItem>
            );
          })}
        </div>
      </>
    );
  },
);

const AutoformMultiSelector = React.forwardRef<
  AutoFormMultiSelectorRef,
  AutoFormMultiSelectorProps
>(
  (
    {
      value,
      onChange,
      placeholder,
      defaultOptions: arrayDefaultOptions = [],
      options: arrayOptions,
      delay,
      onSearch,
      loadingIndicator,
      emptyIndicator,
      maxSelected = Number.MAX_SAFE_INTEGER,
      onMaxSelected,
      hidePlaceholderWhenSelected,
      disabled,
      className,
      badgeClassName,
      selectFirstItem = true,
      creatable = false,
      triggerSearchOnFocus = false,
      commandProps,
      inputProps,
      hideClearAllButton = false,
    }: AutoFormMultiSelectorProps,
    ref: React.Ref<AutoFormMultiSelectorRef>,
  ) => {
    const [toggle, refCallback, parentRef] = useRefWithCallback<HTMLDivElement>();

    const inputRef = React.useRef<HTMLInputElement>(null);
    const [open, setOpen] = React.useState(false);
    const mouseOn = React.useRef<boolean>(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const [selected, setSelected] = React.useState<Option[]>(value || []);
    const [options, setOptions] = React.useState<Option[]>(arrayDefaultOptions);

    const [inputValue, setInputValue] = React.useState('');
    const debouncedSearchTerm = useDebounce(inputValue, delay || 250);

    // HACK for now:: using new key on every open for virtulizer content since it has weird behavior a
    // and not resetting when selectables change.
    const [contentId, setContentId] = React.useState<string>('');

    React.useImperativeHandle(
      ref,
      () => ({
        selectedValue: [...selected],
        input: inputRef.current as HTMLInputElement,
        focus: () => inputRef.current?.focus(),
      }),
      [selected],
    );

    const handleUnselect = React.useCallback(
      (option: Option) => {
        const newOptions = selected.filter((s) => s.value !== option.value);
        setSelected(newOptions);
        onChange?.(newOptions);
      },
      [onChange, selected],
    );

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        const input = inputRef.current;
        if (input) {
          if (e.key === 'Delete' || e.key === 'Backspace') {
            if (input.value === '' && selected.length > 0) {
              const lastSelectOption = selected[selected.length - 1];
              // If last item is fixed, we should not remove it.
              if (!lastSelectOption.fixed) {
                handleUnselect(selected[selected.length - 1]);
              }
            }
          }
          // This is not a default behavior of the <input /> field
          if (e.key === 'Escape') {
            input.blur();
          }
        }
      },
      [handleUnselect, selected],
    );

    useEffect(() => {
      if (value) {
        setSelected(value);
      }
    }, [value]);

    useEffect(() => {
      /** If `onSearch` is provided, do not trigger options updated. */
      if (!arrayOptions || onSearch) {
        return;
      }
      const newOption = arrayOptions || [];
      if (JSON.stringify(newOption) !== JSON.stringify(options)) {
        setOptions(newOption);
      }
    }, [arrayDefaultOptions, arrayOptions, onSearch, options]);

    useEffect(() => {
      const doSearch = async () => {
        setIsLoading(true);
        const res = await onSearch?.(debouncedSearchTerm);
        setOptions(res || []);
        setIsLoading(false);
      };

      const exec = async () => {
        if (!onSearch || !open) return;

        if (triggerSearchOnFocus) {
          await doSearch();
        }

        if (debouncedSearchTerm) {
          await doSearch();
        }
      };

      void exec();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchTerm, open, triggerSearchOnFocus]);

    const CreatableItem = () => {
      if (!creatable) return undefined;
      if (
        isOptionsExist(options, [{ value: inputValue, label: inputValue }]) ||
        selected.find((s) => s.value.toLowerCase() === inputValue.toLowerCase())
      ) {
        return undefined;
      }

      const Item = (
        <CommandItem
          value={inputValue}
          className='cursor-pointer'
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onSelect={(value: string) => {
            if (selected.length >= maxSelected) {
              onMaxSelected?.(selected.length);
              return;
            }
            setInputValue('');
            const newOptions = [...selected, { value, label: value }];
            setSelected(newOptions);
            onChange?.(newOptions);
          }}
        >
          {`Create "${inputValue}"`}
        </CommandItem>
      );

      // For normal creatable
      if (!onSearch && inputValue.length > 0) {
        return Item;
      }

      // For async search creatable. avoid showing creatable item before loading at first.
      if (onSearch && debouncedSearchTerm.length > 0 && !isLoading) {
        return Item;
      }

      return undefined;
    };

    const EmptyItem = React.useCallback(() => {
      if (!emptyIndicator) return undefined;

      // For async search that showing emptyIndicator
      if (onSearch && !creatable && Object.keys(options).length === 0) {
        return (
          <CommandItem value='-' disabled>
            {emptyIndicator}
          </CommandItem>
        );
      }

      return <CommandEmpty>{emptyIndicator}</CommandEmpty>;
    }, [creatable, emptyIndicator, onSearch, options]);

    /** Avoid Creatable Selector freezing or lagging when paste a long string. */
    const commandFilter = React.useCallback(() => {
      if (commandProps?.filter) {
        return commandProps.filter;
      }

      if (creatable) {
        return (value: string, search: string) => {
          return value.toLowerCase().includes(search.toLowerCase()) ? 1 : -1;
        };
      }
      // Using default filter in `cmdk`. We don't have to provide it.
      return undefined;
    }, [creatable, commandProps?.filter]);

    const handleSearch = useCallback(
      (search: string) => {
        setInputValue(search);
        inputProps?.onValueChange?.(search);
      },
      [inputProps?.onValueChange, toggle],
    );

    const handleOpen = useCallback(
      (state: boolean) => {
        const newKey = Date.now().toString();
        setContentId(newKey);
        setOpen(state);
      },
      [toggle],
    );

    const selectables = React.useMemo<Option[]>(
      () =>
        removePickedOption(
          options,
          selected,
          // For async search avoid client filtering.
          onSearch ? '' : debouncedSearchTerm,
        ),
      [options, selected, debouncedSearchTerm, onSearch],
    );

    return (
      <Popover open={open}>
        <Command
          {...commandProps}
          onKeyDown={(e) => {
            handleKeyDown(e);
            commandProps?.onKeyDown?.(e);
          }}
          className={cn('h-auto bg-transparent', commandProps?.className)}
          shouldFilter={false}
          filter={commandFilter()}
        >
          <PopoverTrigger asChild>
            <div
              className={cn(
                'min-h-10 rounded-md border border-gray-200 text-sm ring-offset-white focus-within:ring-2 focus-within:ring-gray-950 focus-within:ring-offset-2 dark:border-gray-800 dark:ring-offset-gray-950 dark:focus-within:ring-gray-300',
                {
                  'px-3 py-2': selected.length !== 0,
                  'cursor-text': !disabled && selected.length !== 0,
                },
                className,
              )}
              onClick={() => {
                if (disabled) return;
                inputRef.current?.focus();
              }}
            >
              <div className='relative flex flex-wrap gap-1'>
                {selected.map((option) => {
                  return (
                    <Badge
                      key={option.value}
                      className={cn(
                        'data-[disabled]:bg-gray-500 data-[disabled]:text-gray-100 data-[disabled]:hover:bg-gray-500 dark:data-[disabled]:bg-gray-400 dark:data-[disabled]:text-gray-800 dark:data-[disabled]:hover:bg-gray-400',
                        'data-[fixed]:bg-gray-500 data-[fixed]:text-gray-100 data-[fixed]:hover:bg-gray-500 dark:data-[fixed]:bg-gray-400 dark:data-[fixed]:text-gray-800 dark:data-[fixed]:hover:bg-gray-400',
                        badgeClassName,
                      )}
                      data-fixed={option.fixed}
                      data-disabled={disabled || undefined}
                    >
                      {option.label}
                      <button
                        className={cn(
                          'ml-1 rounded-full outline-none ring-offset-white focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 dark:ring-offset-gray-950 dark:focus:ring-gray-300',
                          (disabled || option.fixed) && 'hidden',
                        )}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleUnselect(option);
                          }
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onClick={() => handleUnselect(option)}
                      >
                        <X className='size-3 text-gray-500 hover:text-gray-950 dark:text-gray-400 dark:hover:text-gray-50' />
                      </button>
                    </Badge>
                  );
                })}
                {/* Avoid having the "Search" Icon */}
                <CommandPrimitive.Input
                  {...inputProps}
                  ref={inputRef}
                  value={inputValue}
                  disabled={disabled}
                  onValueChange={handleSearch}
                  onBlur={(event) => {
                    if (mouseOn.current === false) {
                      handleOpen(false);
                    }
                    inputProps?.onBlur?.(event);
                  }}
                  onFocus={(event) => {
                    handleOpen(true);
                    triggerSearchOnFocus && onSearch?.(debouncedSearchTerm);
                    inputProps?.onFocus?.(event);
                  }}
                  placeholder={
                    hidePlaceholderWhenSelected && selected.length !== 0
                      ? ''
                      : placeholder
                  }
                  className={cn(
                    'flex-1 bg-transparent outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400',
                    {
                      'w-full': hidePlaceholderWhenSelected,
                      'px-3 py-2': selected.length === 0,
                      'ml-1': selected.length !== 0,
                    },
                    inputProps?.className,
                  )}
                />
                <button
                  type='button'
                  onClick={() => {
                    setSelected(selected.filter((s) => s.fixed));
                    onChange?.(selected.filter((s) => s.fixed));
                  }}
                  className={cn(
                    'absolute right-0 h-6 w-6 p-0',
                    (hideClearAllButton ||
                      disabled ||
                      selected.length < 1 ||
                      selected.filter((s) => s.fixed).length === selected.length) &&
                      'hidden',
                  )}
                >
                  <X />
                </button>
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent
            className='popover-content-width-full top-1 p-0'
            onOpenAutoFocus={(e) => {
              e.preventDefault();
            }}
            onCloseAutoFocus={(e) => {
              e.preventDefault();
            }}
            asChild
          >
            <div className='relative'>
              <CommandList
                onMouseLeave={() => {
                  mouseOn.current = false;
                }}
                onMouseEnter={() => {
                  mouseOn.current = true;
                }}
                onMouseUp={() => {
                  inputRef.current?.focus();
                }}
              >
                {isLoading ? (
                  <>{loadingIndicator}</>
                ) : (
                  <ScrollArea className='h-72'>
                    <div>
                      <CommandGroup
                        className='h-full overflow-hidden'
                        ref={refCallback}
                        key={`${contentId}-result-virtulizer`}
                      >
                        <CommandGroupContent
                          onSelect={(option) => {
                            if (selected.length >= maxSelected) {
                              onMaxSelected?.(selected.length);
                              return;
                            }
                            setInputValue('');
                            const newOptions = [...selected, option];
                            setSelected(newOptions as Option[]);
                            onChange?.(newOptions as Option[]);
                          }}
                          container={parentRef.current}
                          selectFirstItem={selectFirstItem}
                          selectables={selectables}
                          EmptyItem={EmptyItem}
                          CreatableItem={CreatableItem}
                        />
                      </CommandGroup>
                    </div>
                  </ScrollArea>
                )}
              </CommandList>
            </div>
          </PopoverContent>
        </Command>
      </Popover>
    );
  },
);

AutoformMultiSelector.displayName = 'AutoFormMultiSelector';
export { AutoformMultiSelector };
