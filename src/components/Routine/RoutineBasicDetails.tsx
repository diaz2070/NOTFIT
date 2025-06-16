'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import InputField from '@/components/auth/InputField';
import { UseFormReturn } from 'react-hook-form';
import { RoutineFormFields } from '@/utils/validators/routineSchema';

const DayOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

type Props = {
  form: UseFormReturn<RoutineFormFields>;
};

export default function RoutineBasicDetails({ form }: Readonly<Props>) {
  const selectedDays = form.watch('selectedDays');
  const sortedDays = [...selectedDays].sort(
    (a, b) => DayOfWeek.indexOf(a) - DayOfWeek.indexOf(b),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          Basic Details
        </CardTitle>
        <CardDescription>
          Set the name and days of the week for this routine
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <InputField
          control={form.control}
          id="routineName"
          label="Name of your routine"
          name="routineName"
          type="text"
          placeholder="E.g.: Upper Day, Leg Day..."
          required
          disabled={false}
        />

        <div className="space-y-3">
          <Label>
            Week Days <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {DayOfWeek.map((day) => (
              <div key={day} className="flex items-center space-x-2">
                <Checkbox
                  id={day}
                  checked={selectedDays.includes(day)}
                  onCheckedChange={() => {
                    const current = form.getValues('selectedDays');
                    form.setValue(
                      'selectedDays',
                      current.includes(day)
                        ? current.filter((d) => d !== day)
                        : [...current, day],
                    );
                  }}
                />
                <Label htmlFor={day} className="text-sm font-normal">
                  {day}
                </Label>
              </div>
            ))}
          </div>
          {sortedDays.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {sortedDays.map((day) => (
                <Badge key={day} variant="secondary">
                  {day}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
