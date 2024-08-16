'use client';
import { useState, type ChangeEvent } from 'react';
import { useFieldArray, useFormContext, type useForm } from 'react-hook-form';
import * as z from 'zod';

import { cn } from '@/lib/utils/core/cn';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import {
    DEFAULT_ZOD_HANDLERS,
    INPUT_COMPONENTS,
} from '@/components/ui/autoform/autoform.config';
import { resolveDependencies } from '@/components/ui/autoform/autoform.dependencies';
import {
    AutoformMultiSelector,
    type Option,
} from '@/components/ui/autoform/autoform-multi-selector';
import type {
    AutoFormInputComponentProps,
    AutoFormLabelProps,
    Dependency,
    FieldConfig,
    FieldConfigItem,
} from '@/components/ui/autoform/autoform.types';
import {
    beautifyObjectName,
    getBaseSchema,
    getBaseType,
    zodToHtmlInputProps,
} from '@/components/ui/autoform/autoform.utils';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { TextArea } from '@/components/ui/text-area';

// TODO UI: Replace by Slot ?
function DefaultParent({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

// 1. AUTO FORM OBJECT
export function AutoFormObject<SchemaType extends z.ZodObject<any, any>>({
                                                                             schema,
                                                                             form,
                                                                             fieldConfig,
                                                                             path = [],
                                                                             dependencies = [],
                                                                         }: {
    schema: SchemaType | z.ZodEffects<SchemaType>;
    form: ReturnType<typeof useForm>;
    fieldConfig?: FieldConfig<z.infer<SchemaType>>;
    path?: string[];
    dependencies?: Dependency<z.infer<SchemaType>>[];
}) {
    const { watch } = useFormContext(); // Use useFormContext to access the watch function

    if (!schema) {
        return null;
    }
    const { shape } = getBaseSchema<SchemaType>(schema) || {};

    if (!shape) {
        return null;
    }

    const handleIfZodNumber = (item: z.ZodAny) => {
        const isZodNumber = (item as any)._def.typeName === 'ZodNumber';
        const isInnerZodNumber = (item._def as any).innerType?._def?.typeName === 'ZodNumber';

        if (isZodNumber) {
            (item as any)._def.coerce = true;
        } else if (isInnerZodNumber) {
            (item._def as any).innerType._def.coerce = true;
        }

        return item;
    };

    function isZodPrimitiveArray(item: z.ZodTypeAny) {
        let isPrimitiveArray = false;
        let isEnumOfPrimitives = false;
        let innerType = item;

        // get the innertype of the ZodAnyType when its parent is a default
        while ('innerType' in innerType._def && (innerType as any)._def.innerType) {
            innerType = innerType._def.innerType;
        }

        // Now check if it is an array and the type of the elements
        if (innerType instanceof z.ZodArray) {
            innerType = innerType._def.type;

            // Check for basic primitives
            isPrimitiveArray =
                innerType instanceof z.ZodString ||
                innerType instanceof z.ZodNumber ||
                innerType instanceof z.ZodBoolean;

            // Check if its enum array
            isEnumOfPrimitives = innerType instanceof z.ZodEnum;
        }

        return { isPrimitiveArray, isEnumOfPrimitives, innerType };
    }

    return (
        <Accordion type='multiple' className='space-y-5 border-none'>
            {Object.keys(shape).map((name) => {
                let item = shape[name] as z.ZodAny;
                item = handleIfZodNumber(item) as z.ZodAny;
                const zodBaseType = getBaseType(item);
                const itemName = item._def.description ?? beautifyObjectName(name);
                const key = [...path, name].join('.');

                const {
                    isHidden,
                    isDisabled,
                    isRequired: isRequiredByDependency,
                    overrideOptions,
                } = resolveDependencies(dependencies, name, watch);
                if (isHidden) {
                    return null;
                }

                if (zodBaseType === 'ZodObject') {
                    return (
                        <AccordionItem value={name} key={key} className='border-none'>
                            <AccordionTrigger>{itemName}</AccordionTrigger>
                            <AccordionContent className='p-2'>
                                <AutoFormObject
                                    schema={item as unknown as z.ZodObject<any, any>}
                                    form={form}
                                    fieldConfig={
                                        (fieldConfig?.[name] ?? {}) as FieldConfig<z.infer<typeof item>>
                                    }
                                    path={[...path, name]}
                                />
                            </AccordionContent>
                        </AccordionItem>
                    );
                }

                let overrideFieldConfig = undefined as FieldConfigItem | undefined;

                if (zodBaseType === 'ZodArray') {
                    const { isPrimitiveArray, isEnumOfPrimitives, innerType } =
                        isZodPrimitiveArray(item);
                    if (isPrimitiveArray || isEnumOfPrimitives) {
                        // override item and fieldConfig for primitive array
                        item = innerType as z.ZodAny;
                        overrideFieldConfig = {
                            ...fieldConfig?.[name],
                            fieldType: 'selectmultiinput',
                            inputProps: {
                                ...fieldConfig?.[name]?.inputProps,
                                creatable: !isEnumOfPrimitives,
                            },
                        };
                    } else {
                        return (
                            <AutoFormArray
                                key={key}
                                name={name}
                                item={item as unknown as z.ZodArray<any>}
                                form={form}
                                fieldConfig={fieldConfig?.[name] ?? {}}
                                path={[...path, name]}
                            />
                        );
                    }
                }

                const fieldConfigItem: FieldConfigItem =
                    overrideFieldConfig ?? fieldConfig?.[name] ?? {};
                const zodInputProps = zodToHtmlInputProps(item);
                const isRequired =
                    isRequiredByDependency ||
                    zodInputProps.required ||
                    fieldConfigItem.inputProps?.required ||
                    false;

                if (overrideOptions) {
                    item = z.enum(overrideOptions) as unknown as z.ZodAny;
                }

                return (
                    <FormField
                        control={form.control}
                        name={key}
                        key={key}
                        render={({ field }) => {
                            const inputType =
                                fieldConfigItem.fieldType ??
                                DEFAULT_ZOD_HANDLERS[zodBaseType] ??
                                'fallback';

                            const InputComponent =
                                typeof inputType === 'function' ? inputType : INPUT_COMPONENTS[inputType];

                            const ParentElement = fieldConfigItem.renderParent ?? DefaultParent;

                            const defaultValue = fieldConfigItem.inputProps?.defaultValue;
                            const value = field.value ?? defaultValue ?? '';

                            const fieldProps = {
                                ...zodToHtmlInputProps(item),
                                ...field,
                                ...fieldConfigItem.inputProps,
                                disabled: fieldConfigItem.inputProps?.disabled || isDisabled,
                                ref: undefined,
                                value: value,
                            };

                            if (InputComponent === undefined) {
                                return <></>;
                            }

                            return (
                                <ParentElement key={`${key}.parent`}>
                                    <InputComponent
                                        zodInputProps={zodInputProps}
                                        field={field}
                                        fieldConfigItem={fieldConfigItem}
                                        label={itemName}
                                        isRequired={isRequired}
                                        zodItem={item}
                                        fieldProps={fieldProps}
                                        className={fieldProps.className}
                                    />
                                </ParentElement>
                            );
                        }}
                    />
                );
            })}
        </Accordion>
    );
}

// 2. DATE
export function AutoFormDate({
                                 label,
                                 isRequired,
                                 field,
                                 fieldConfigItem,
                                 fieldProps,
                             }: AutoFormInputComponentProps) {
    return (
        <FormItem>
            <AutoFormLabel label={fieldConfigItem?.label || label} isRequired={isRequired} />
            <FormControl>
                <DatePicker date={field.value} setDate={field.onChange} {...fieldProps} />
            </FormControl>
            <AutoFormTooltip fieldConfigItem={fieldConfigItem} />

            <FormMessage />
        </FormItem>
    );
}

// 3. ENUM MULTI INPUT
export function AutoFormEnumMultiInput({
                                           label,
                                           isRequired,
                                           field,
                                           fieldConfigItem,
                                           zodItem,
                                           fieldProps,
                                       }: AutoFormInputComponentProps) {
    const { emptyIndicator, creatable, placeholder, ...fieldPropsWithoutEmptyIndicator } =
        fieldProps;
    let options: Option[] = [];

    // if its not creatable, then it would mean the field is primitive enum array type
    if (!creatable) {
        const baseValues = (getBaseSchema(zodItem) as unknown as z.ZodEnum<any>)._def.values;
        if (!Array.isArray(baseValues)) {
            for (const [, v] of Object.entries(baseValues || {})) {
                const val = v as string;
                options.push({ value: val, label: val });
            }
        } else {
            options = baseValues.map((val) => ({ value: val, label: val }));
        }
    }

    const handleOnChange = (options: Option[]) => {
        const values = options.map((option) => option.value);
        field.onChange(values);
    };

    return (
        <div className='flex flex-row items-center space-x-2'>
            <FormItem className='flex w-full flex-row items-center justify-start space-x-2'>
                <div className='flex w-full flex-col gap-2'>
                    <AutoFormLabel label={label} isRequired={isRequired} />
                    <FormControl>
                        <AutoformMultiSelector
                            {...field}
                            {...fieldPropsWithoutEmptyIndicator}
                            value={(field.value || []).map((val: any) => ({
                                value: val,
                                label: val,
                            }))}
                            onChange={handleOnChange}
                            defaultOptions={options}
                            creatable={creatable}
                            placeholder={placeholder || creatable ? 'Type to create' : 'Search...'}
                            emptyIndicator={
                                <p className='text-center text-lg leading-10 text-gray-600 dark:text-gray-400'>
                                    {emptyIndicator || creatable
                                        ? 'Start typing to create an option'
                                        : 'No options found'}
                                </p>
                            }
                        />
                    </FormControl>
                    <AutoFormTooltip fieldConfigItem={fieldConfigItem} />
                    <FormMessage />
                </div>
            </FormItem>
        </div>
    );
}

// 4. ENUM
export function AutoFormEnum({
                                 label,
                                 isRequired,
                                 field,
                                 fieldConfigItem,
                                 zodItem,
                                 fieldProps,
                             }: AutoFormInputComponentProps) {
    const baseValues = (getBaseSchema(zodItem) as unknown as z.ZodEnum<any>)._def.values;

    let values: [string, string][] = [];
    if (!Array.isArray(baseValues)) {
        values = Object.entries(baseValues);
    } else {
        values = baseValues.map((value) => [value, value]);
    }

    function findItem(value: any) {
        return values.find((item) => item[0] === value);
    }

    return (
        <FormItem>
            <AutoFormLabel label={fieldConfigItem?.label || label} isRequired={isRequired} />
            <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value} {...fieldProps}>
                    <SelectTrigger className={fieldProps.className}>
                        <SelectValue placeholder={fieldConfigItem.inputProps?.placeholder}>
                            {field.value ? findItem(field.value)?.[1] : 'Select an option'}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {values.map(([value, label]) => (
                            <SelectItem value={label} key={value}>
                                {label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </FormControl>
            <AutoFormTooltip fieldConfigItem={fieldConfigItem} />
            <FormMessage />
        </FormItem>
    );
}

// 5. FILE
export function AutoFormFile({
                                 label,
                                 isRequired,
                                 fieldConfigItem,
                                 fieldProps,
                                 field,
                             }: AutoFormInputComponentProps) {
    const { showLabel: _showLabel, ...fieldPropsWithoutShowLabel } = fieldProps;
    const showLabel = _showLabel === undefined ? true : _showLabel;
    const [file, setFile] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFile(reader.result as string);
                setFileName(file.name);
                field.onChange(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveClick = () => {
        setFile(null);
    };

    return (
        <FormItem>
            {showLabel && (
                <AutoFormLabel label={fieldConfigItem?.label || label} isRequired={isRequired} />
            )}
            {!file && (
                <FormControl>
                    <Input
                        type='file'
                        {...fieldPropsWithoutShowLabel}
                        onChange={handleFileChange}
                        value={''}
                    />
                </FormControl>
            )}
            {file && (
                <div className='flex h-[40px] w-full flex-row items-center justify-between space-x-2 rounded-sm border p-2 text-black focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-white dark:text-black dark:focus-visible:ring-0 dark:focus-visible:ring-offset-0'>
                    <p>{fileName}</p>
                    <button onClick={handleRemoveClick} aria-label='Remove image'>
                         Remove
                    </button>
                </div>
            )}
            <AutoFormTooltip fieldConfigItem={fieldConfigItem} />
            <FormMessage />
        </FormItem>
    );
}

// 6. INPUT
export function AutoFormInput({
                                  label,
                                  isRequired,
                                  fieldConfigItem,
                                  fieldProps,
                              }: AutoFormInputComponentProps) {
    const { showLabel: _showLabel, ...fieldPropsWithoutShowLabel } = fieldProps;
    const showLabel = _showLabel === undefined ? true : _showLabel;
    const type = fieldProps.type || 'text';

    return (
        <div className='flex flex-row  items-center space-x-2'>
            <FormItem className='flex w-full flex-col justify-start'>
                {showLabel && (
                    <AutoFormLabel
                        label={fieldConfigItem?.label || label}
                        isRequired={isRequired}
                    />
                )}
                <FormControl>
                    <Input type={type} {...fieldPropsWithoutShowLabel} />
                </FormControl>
                <AutoFormTooltip fieldConfigItem={fieldConfigItem} />
                <FormMessage />
            </FormItem>
        </div>
    );
}

// 7. NUMBER
export function AutoFormNumber({
                                   label,
                                   isRequired,
                                   fieldConfigItem,
                                   fieldProps,
                               }: AutoFormInputComponentProps) {
    const { showLabel: _showLabel, ...fieldPropsWithoutShowLabel } = fieldProps;
    const showLabel = _showLabel === undefined ? true : _showLabel;

    return (
        <FormItem>
            {showLabel && (
                <AutoFormLabel label={fieldConfigItem?.label || label} isRequired={isRequired} />
            )}
            <FormControl>
                <Input type='number' {...fieldPropsWithoutShowLabel} />
            </FormControl>
            <AutoFormTooltip fieldConfigItem={fieldConfigItem} />
            <FormMessage />
        </FormItem>
    );
}

// 8. CHECKBOX
export function AutoFormCheckbox({
                                     label,
                                     isRequired,
                                     field,
                                     fieldConfigItem,
                                     fieldProps,
                                 }: AutoFormInputComponentProps) {
    return (
        <div>
            <FormItem>
                <div className='mb-3 flex items-center gap-3'>
                    <FormControl>
                        <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            {...fieldProps}
                        />
                    </FormControl>
                    <AutoFormLabel
                        label={fieldConfigItem?.label || label}
                        isRequired={isRequired}
                    />
                </div>
            </FormItem>
            <AutoFormTooltip fieldConfigItem={fieldConfigItem} />
        </div>
    );
}

// 9. RADIO GROUP
export function AutoFormRadioGroup({
                                       label,
                                       isRequired,
                                       field,
                                       zodItem,
                                       fieldProps,
                                       fieldConfigItem,
                                   }: AutoFormInputComponentProps) {
    const baseValues = (getBaseSchema(zodItem) as unknown as z.ZodEnum<any>)._def.values;

    let values: string[] = [];
    if (!Array.isArray(baseValues)) {
        values = Object.entries(baseValues).map((item) => item[0]);
    } else {
        values = baseValues;
    }

    return (
        <div>
            <FormItem>
                <AutoFormLabel label={fieldConfigItem?.label || label} isRequired={isRequired} />
                <FormControl>
                    <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        {...fieldProps}
                    >
                        {values?.map((value: any) => (
                            <FormItem key={value} className='mb-2 flex items-center gap-3 space-y-0'>
                                <FormControl>
                                    <RadioGroupItem value={value} />
                                </FormControl>
                                <FormLabel className='font-normal'>{value}</FormLabel>
                            </FormItem>
                        ))}
                    </RadioGroup>
                </FormControl>
                <FormMessage />
            </FormItem>
            <AutoFormTooltip fieldConfigItem={fieldConfigItem} />
        </div>
    );
}

// 10. SWITCH
export function AutoFormSwitch({
                                   label,
                                   isRequired,
                                   field,
                                   fieldConfigItem,
                                   fieldProps,
                               }: AutoFormInputComponentProps) {
    return (
        <div>
            <FormItem>
                <div className='flex items-center gap-3'>
                    <FormControl>
                        <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            {...fieldProps}
                        />
                    </FormControl>
                    <AutoFormLabel
                        label={fieldConfigItem?.label || label}
                        isRequired={isRequired}
                    />
                </div>
            </FormItem>
            <AutoFormTooltip fieldConfigItem={fieldConfigItem} />
        </div>
    );
}

// 11. TEXT AREA
export function AutoFormTextarea({
                                     label,
                                     isRequired,
                                     fieldConfigItem,
                                     fieldProps,
                                 }: AutoFormInputComponentProps) {
    const { showLabel: _showLabel, ...fieldPropsWithoutShowLabel } = fieldProps;
    const showLabel = _showLabel === undefined ? true : _showLabel;
    return (
        <FormItem>
            {showLabel && (
                <AutoFormLabel label={fieldConfigItem?.label || label} isRequired={isRequired} />
            )}
            <FormControl>
                <TextArea {...fieldPropsWithoutShowLabel} />
            </FormControl>
            <AutoFormTooltip fieldConfigItem={fieldConfigItem} />
            <FormMessage />
        </FormItem>
    );
}

// 12. ARRAY

function isZodArray(item: z.ZodArray<any> | z.ZodDefault<any>): item is z.ZodArray<any> {
    return item instanceof z.ZodArray;
}

function isZodDefault(
    item: z.ZodArray<any> | z.ZodDefault<any>,
): item is z.ZodDefault<any> {
    return item instanceof z.ZodDefault;
}

export function AutoFormArray({
                                  name,
                                  item,
                                  form,
                                  path = [],
                                  fieldConfig,
                              }: {
    name: string;
    item: z.ZodArray<any> | z.ZodDefault<any>;
    form: ReturnType<typeof useForm>;
    path?: string[];
    fieldConfig?: any;
}) {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name,
    });
    const title = item._def.description ?? beautifyObjectName(name);

    const itemDefType = isZodArray(item)
        ? item._def.type
        : isZodDefault(item)
            ? item._def.innerType._def.type
            : null;

    return (
        <AccordionItem value={name} className='border-none'>
            <AccordionTrigger>{title}</AccordionTrigger>
            <AccordionContent>
                {fields.map((_field, index) => {
                    const key = _field.id;
                    return (
                        <div className='mt-4 flex flex-col' key={`${key}`}>
                            <AutoFormObject
                                schema={itemDefType as z.ZodObject<any, any>}
                                form={form}
                                fieldConfig={fieldConfig}
                                path={[...path, index.toString()]}
                            />
                            <div className='my-4 flex justify-end'>
                                <Button
                                    variant='secondary'
                                    size='icon'
                                    type='button'
                                    className='hover:bg-zinc-300 hover:text-black focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-white dark:text-black dark:hover:bg-zinc-300 dark:hover:text-black dark:hover:ring-0 dark:hover:ring-offset-0 dark:focus-visible:ring-0 dark:focus-visible:ring-offset-0'
                                    onClick={() => remove(index)}
                                >
                                    Remove
                                </Button>
                            </div>

                            <Separator />
                        </div>
                    );
                })}
                <Button
                    type='button'
                    variant='secondary'
                    onClick={() => append({})}
                    className='mt-4 flex items-center'
                >
                    Add
                </Button>
            </AccordionContent>
        </AccordionItem>
    );
}

/*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
/*                 ✨ SHARED COMPONENTS ✨                    */
/*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

// 1. LABEL
function AutoFormLabel({ label, isRequired, className }: AutoFormLabelProps) {
    return (
        <FormLabel className={cn(className)}>
            {label}
            {isRequired && <span className='text-destructive'> *</span>}
        </FormLabel>
    );
}

// 2. TOOLTIP
function AutoFormTooltip({ fieldConfigItem }: { fieldConfigItem: any }) {
    return (
        <>
            {fieldConfigItem?.description && (
                // TODO UI
                <p className='text-sm text-gray-500 dark:text-white'>
                    {fieldConfigItem.description}
                </p>
            )}
        </>
    );
}
