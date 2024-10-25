import {
 Button, Input, Select, SelectItem
} from '@nextui-org/react';
import React from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { twMerge } from 'tailwind-merge';

import type { AppAsyncThunk } from '@/modules/app/core/store/create-app-thunk';
import type { AppDispatch } from '@/modules/app/core/store/create-store';
import type { UnknownAction } from '@reduxjs/toolkit';
import type { FieldValues, Path } from 'react-hook-form';
import type { ZodObject } from 'zod';

import { CustomModal } from '@/modules/app/ui/component-level/custom.modal';
import { useCustomForm } from '@/modules/app/ui/component-level/use-custom-form';

type ModalFormProps = {
    formType: 'modal';
    modalTitle: string;
    onCustomClose: () => void;
    visibilityTrigger: boolean;
};

type PlainFormProps = {
    formType: 'plain';
    modalTitle?: never;
    visibilityTrigger?: never;
    onCustomClose?: never;
};

type Item<TFormValues extends FieldValues> = {
    id: string; name: Path<TFormValues>; label: string; type: string; options?: { value: string; label: string }[];
}

type CommonFormProps<TFormValues extends FieldValues, A, ReturnType> = {
    items: Item<TFormValues>[];
    schema: ZodObject<TFormValues>;
    action?: UnknownAction | AppAsyncThunk<ReturnType, A>;
    className?: string;
};

type CustomFormProps<TFormValues extends FieldValues, A, ReturnType> =
    (ModalFormProps & CommonFormProps<TFormValues, A, ReturnType>) |
    (PlainFormProps & CommonFormProps<TFormValues, A, ReturnType>);

export const CustomForm = <TFormValues extends FieldValues, ReturnType, A>(
    { items, schema, action, formType, modalTitle, visibilityTrigger, onCustomClose, className }: CustomFormProps<TFormValues, ReturnType, A>
) => {
    const dispatch = useDispatch<AppDispatch>();
    const { t } = useTranslation();
    const validator = useCustomForm({ schema, action, dispatch, onCustomClose });

    const formContent = (
        <form onSubmit={validator.handleSubmit(validator.onSubmit)} className={twMerge('space-y-4 z-0 text-base', className)}>
            {items.map((item) => (
                <div key={item.id}>
                    <Controller
                        name={item.name}
                        control={validator.control}
                        render={({ field }) => {
                            if (item.type === 'select') {
                                return (
                                    <Select
                                        label={t(item.label)}
                                        classNames={validator.classNames}
                                        isRequired={validator.isRequired(item.id)}
                                        {...validator.props}
                                        onChange={validator.handleSelectChange(field)}
                                        selectedKeys={[field.value]}
                                    >
                                        {item.options ? (
                                            item.options.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <div>{"Pas d'options"}</div>
                                        )}
                                    </Select>
                                );
                            }
                            if (item.type === 'date') {
                                const dateObject = new Date(field.value);
                                const isoDateString = dateObject.toISOString().split('T')[0];
                                return (
                                    <Input
                                        value={isoDateString}
                                        classNames={validator.classNames}
                                        onChange={validator.handleChange(field, item.type)}
                                        isRequired={validator.isRequired(item.id)}
                                        label={item.label}
                                        id={item.id}
                                        type='date'
                                        variant={validator.props.variant}
                                    />
                                );
                            }
                            if (item.type === 'file') {
                                return (
                                    <Input
                                        type='file'
                                        classNames={validator.classNames}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            field.onChange(file);
                                        }}
                                        isRequired={validator.isRequired(item.id)}
                                        label={item.label}
                                        id={item.id}
                                        variant={validator.props.variant}
                                    />
                                );
                            }
                            return (
                                <Input
                                    defaultValue={validator.defaultValues[item.name] || field.value}
                                    value={field.value}
                                    classNames={validator.classNames}
                                    className='text-base'
                                    onClear={() => validator.resetField(field.name)}
                                    onChange={validator.handleChange(field, item.type)}
                                    isRequired={validator.isRequired(item.id)}
                                    label={item.label}
                                    id={item.id}
                                    {...validator.props}
                                    type={item.type}
                                />
                            );
                        }}
                    />
                    {validator.errors[item.name] && <p className='text-red-500'>{String(validator.errors[item.name]?.message)}</p>}
                </div>
            ))}
            {formType ==='plain' && (
                <Button variant='light' type='submit' isDisabled={!validator.isSubmittable()} onClick={validator.handleSubmit(validator.onSubmit)}>Submit</Button>
            )}
        </form>
    );

    if (formType === 'modal') {
        return (
            <CustomModal
                hideModal={validator.onClose}
                isShown={visibilityTrigger}
                modalTitle={modalTitle}
                modalContent={formContent}
                modalFooter={
                    <>
                        <Button variant='light' onClick={validator.onClose}>Close</Button>
                        <Button variant='light' type='submit' onClick={validator.handleSubmit(validator.onSubmit)}>Submit</Button>
                    </>
                }
            />
        );
    }

    return formContent;
};
