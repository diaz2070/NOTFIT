import { Input } from '../ui/input';
import { Label } from '../ui/label';

type Props = Readonly<{
  id: string;
  label: string;
  name: string;
  type: string;
  required: boolean;
  disabled: boolean;
  placeholder: string;
}>;

export default function InputField({
  id,
  label,
  name,
  type = 'text',
  required = false,
  disabled = false,
  placeholder = '',
}: Props) {
  return (
    <div className="flex flex-col space-y-2">
      <Label htmlFor={id} className="gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={id}
        type={type}
        name={name}
        disabled={disabled}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}
InputField.displayName = 'InputField';
