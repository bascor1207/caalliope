'use client';
import { zodResolver } from '@hookform/resolvers/zod'; // pnpm i @hookform/resolvers
import type React from 'react';
import { useEffect } from 'react';
import { useForm, type DefaultValues, type FormState } from 'react-hook-form';
import type { z } from 'zod';

import { cn } from '@/lib/utils/core/cn';
import { AutoFormObject } from '@/components/ui/autoform/autoform.fields';
import type { Dependency, FieldConfig } from '@/components/ui/autoform/autoform.types';
import {
    getDefaultValues,
    getObjectFormSchema,
    type ZodObjectOrWrapped,
} from '@/components/ui/autoform/autoform.utils';
import { Form } from '@/components/ui/form';

const MODES = {
    onBlur: 'onBlur',
    onChange: 'onChange',
    onSubmit: 'onSubmit',
    onTouched: 'onTouched',
} as const;
type Tmode = (typeof MODES)[keyof typeof MODES];

export function AutoForm<SchemaType extends ZodObjectOrWrapped>({
                                                                    formSchema,
                                                                    values: valuesProp,
                                                                    onValuesChange: onValuesChangeProp,
                                                                    onParsedValuesChange,
                                                                    onSubmit: onSubmitProp,
                                                                    fieldConfig,
                                                                    children,
                                                                    className,
                                                                    dependencies,
                                                                    mode,
                                                                    resetOnSubmit = true,
                                                                }: {
    formSchema: SchemaType;
    values?: Partial<z.infer<SchemaType>>;
    onValuesChange?: (values: Partial<z.infer<SchemaType>>) => void;
    onParsedValuesChange?: (values: Partial<z.infer<SchemaType>>) => void;
    onSubmit?: (values: z.infer<SchemaType>) => void;
    fieldConfig?: FieldConfig<z.infer<SchemaType>>;
    children?:
        | React.ReactNode
        | ((formState: FormState<z.infer<SchemaType>>) => React.ReactNode);
    className?: string;
    dependencies?: Dependency<z.infer<SchemaType>>[];
    mode?: Tmode; // onBlur, onChange, onSubmit, onTouched
    resetOnSubmit?: boolean; // reset the Form
}) {
    const objectFormSchema = getObjectFormSchema(formSchema);
    const defaultValues: DefaultValues<TObjectFormSchema> | null = getDefaultValues(
        objectFormSchema,
        fieldConfig,
    );

    type TObjectFormSchema = z.infer<typeof objectFormSchema>;
    type TFormSchema = z.infer<typeof formSchema>;

    const form = useForm<TObjectFormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues ?? undefined,
        values: valuesProp,
        mode: mode || undefined,
    });

    const onSubmit = (values: TFormSchema) => {
        const parsedValues = formSchema.safeParse(values);
        if (parsedValues.success) {
            onSubmitProp?.(parsedValues.data);
        }
        if (resetOnSubmit) {
            form.reset();
        }
    };

    const values = form.watch();
    // valuesString is needed because form.watch() returns a new object every time
    const valuesString = JSON.stringify(values);

    useEffect(() => {
        onValuesChangeProp?.(values);
        const parsedValues = formSchema.safeParse(values);
        if (parsedValues.success) {
            onParsedValuesChange?.(parsedValues.data);
        }
    }, [valuesString]);

    const renderChildren =
        typeof children === 'function'
            ? children(form.formState as FormState<z.infer<SchemaType>>)
            : children;

    return (
        <Form {...form}>
            <form
                noValidate
                onSubmit={(e) => {
                    form.handleSubmit(onSubmit)(e);
                }}
                className={cn('space-y-5', className)}
            >
                <AutoFormObject
                    schema={objectFormSchema}
                    form={form}
                    dependencies={dependencies}
                    fieldConfig={fieldConfig}
                />

                {renderChildren}
            </form>
        </Form>
    );
}
