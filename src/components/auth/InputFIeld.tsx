'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control, FieldPath, FieldValues } from 'react-hook-form';

type InputFieldProps<T extends FieldValues> = Readonly<{
  control: Control<T>;
  name: FieldPath<T>;
  id: string;
  label: string;
  placeholder: string;
  type: string;
  disabled: boolean;
  required: boolean;
}>;

export default function InputField<T extends FieldValues>({
  control,
  id,
  name,
  label,
  placeholder = '',
  type = 'text',
  disabled = false,
  required = false,
}: InputFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              id={id}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
