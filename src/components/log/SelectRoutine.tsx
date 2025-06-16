import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';

interface SelectRoutineProps {
  handleRoutineSelect: (value: string) => void;
  availableRoutines: { id: string; name: string; days: string[] }[];
}

function SelectRoutine({
  handleRoutineSelect,
  availableRoutines,
}: Readonly<SelectRoutineProps>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Selecciona una Rutina</CardTitle>
        <CardDescription>
          Select today&apos;s routine from the list below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select onValueChange={handleRoutineSelect}>
            <SelectTrigger className="w-full" data-testid="select-trigger">
              <SelectValue placeholder="Select a routine" />
            </SelectTrigger>
            <SelectContent>
              {availableRoutines.map((routine) => (
                <SelectItem key={routine.id} value={routine.id}>
                  {routine.name} - {routine.days.join(', ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}

export default SelectRoutine;
