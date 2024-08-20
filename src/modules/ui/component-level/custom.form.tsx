import { Controller, Path } from 'react-hook-form';
import { Input } from '@nextui-org/react';
import { useCustomForm } from '@/modules/ui/component-level/use-custom-form';
import { ZodSchema } from 'zod';


type CustomFormProps<T> = {
    items: {name: keyof T, id: string, label: string}[];
    schema: ZodSchema<T>
}

export const CustomForm= <T extends Record<string, any>>({ items, schema }: CustomFormProps<T>) => {
    const validator = useCustomForm(schema);
    return items.map((item) => (
        <div key={item.id}>
            <Controller
                name={item.name as Path<T>}
                control={validator.control}
                render={({ field }) => (
                    <Input
                        classNames={validator.classNames} onClear={() => validator.resetField(field.name)}
                        label={item.label} id={item.id} {...validator.props} {...field} />
                )}
            />
            {validator.errors[item.name as keyof T] && <p className='text-red-500'>{String(validator.errors[item.name as keyof T]?.message)}</p>}
        </div>
    ))
}
