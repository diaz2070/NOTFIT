import { render, screen } from '@testing-library/react';
import SelectRoutine from '@/components/log/SelectRoutine';

jest.mock('@/components/ui/select', () => ({
  Select: ({
    onValueChange,
    children,
  }: Readonly<{
    onValueChange: (value: string) => void;
    children: React.ReactNode;
  }>) => (
    <div data-testid="select-mock">
      {children}
      <button
        type="button"
        data-testid="select-value-button"
        onClick={() => onValueChange('1')}
      >
        Select first option
      </button>
    </div>
  ),
  SelectContent: ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => <div data-testid="select-content">{children}</div>,
  SelectItem: ({
    children,
    value,
  }: Readonly<{
    children: React.ReactNode;
    value: string;
  }>) => <div data-testid={`select-item-${value}`}>{children}</div>,
  SelectTrigger: ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => <div data-testid="select-trigger">{children}</div>,
  SelectValue: ({
    placeholder,
  }: Readonly<{
    placeholder: string;
  }>) => <div data-testid="select-value">{placeholder}</div>,
}));

describe('SelectRoutine', () => {
  const mockHandleRoutineSelect = jest.fn();
  const routines = [
    { id: '1', name: 'Push Day', days: ['Monday', 'Thursday'] },
    { id: '2', name: 'Pull Day', days: ['Tuesday', 'Friday'] },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title and description', () => {
    render(
      <SelectRoutine
        handleRoutineSelect={mockHandleRoutineSelect}
        availableRoutines={routines}
      />,
    );

    expect(screen.getByText('Selecciona una Rutina')).toBeInTheDocument();
    expect(
      screen.getByText(`Select today's routine from the list below.`),
    ).toBeInTheDocument();
  });

  it('renders select with placeholder', () => {
    render(
      <SelectRoutine
        handleRoutineSelect={mockHandleRoutineSelect}
        availableRoutines={routines}
      />,
    );

    expect(screen.getByText('Select a routine')).toBeInTheDocument();
  });

  it('calls handleRoutineSelect when selecting an option', () => {
    render(
      <SelectRoutine
        handleRoutineSelect={mockHandleRoutineSelect}
        availableRoutines={routines}
      />,
    );

    const selectButton = screen.getByTestId('select-value-button');
    selectButton.click();

    expect(mockHandleRoutineSelect).toHaveBeenCalledWith('1');
  });
});
