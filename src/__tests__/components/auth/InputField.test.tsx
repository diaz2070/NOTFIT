/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { useForm, FormProvider } from 'react-hook-form';
import '@testing-library/jest-dom';
import InputField from '@/components/auth/InputField';

// Mock subcomponents if they have internal logic you don’t want to test here
jest.mock('@/components/ui/form', () => ({
  FormField: ({
    name,
    render: renderProp,
  }: {
    control: unknown;
    name: string;
    render: (props: {
      field: { name: string; onChange: () => void; value: string };
    }) => React.ReactNode;
  }) => renderProp({ field: { name, onChange: jest.fn(), value: '' } }),
  FormItem: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),

  FormLabel: ({
    children,
    htmlFor,
  }: {
    children: React.ReactNode;
    htmlFor: string;
  }) => <label htmlFor={htmlFor}>{children}</label>,
  FormControl: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),

  FormMessage: () => <div data-testid="form-message" />,
}));

jest.mock('@/components/ui/input', () => ({
  Input: ({ ...props }) => <input {...props} />,
}));

function renderWithForm(children: React.ReactNode) {
  function Wrapper({
    children: wrapperChildren,
  }: {
    readonly children: React.ReactNode;
  }) {
    const methods = useForm({
      defaultValues: {
        email: '',
      },
    });

    return <FormProvider {...methods}>{wrapperChildren}</FormProvider>;
  }

  return render(<Wrapper>{children}</Wrapper>);
}

describe('InputField component', () => {
  it('renders correctly with required props', () => {
    renderWithForm(
      <InputField
        control={
          undefined as unknown as import('react-hook-form').Control<
            Record<string, unknown>
          >
        }
        name="email"
        id="email"
        label="Email"
        placeholder="Enter your email"
        type="email"
        disabled={false}
        required
      />,
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument(); // required asterisk
  });

  it('disables the input when disabled is true', () => {
    renderWithForm(
      <InputField
        control={
          undefined as unknown as import('react-hook-form').Control<
            Record<string, unknown>
          >
        }
        name="email"
        id="email"
        label="Email"
        placeholder="Enter your email"
        type="email"
        disabled
        required={false}
      />,
    );

    expect(screen.getByPlaceholderText('Enter your email')).toBeDisabled();
  });
});
