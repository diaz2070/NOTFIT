'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface Props {
  notes: string;
  onChange: (value: string) => void;
}

export default function WorkoutNotesCard({ notes, onChange }: Readonly<Props>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Workout Notes</CardTitle>
        <CardDescription>
          Add notes about your workout, how you felt, any improvements, or
          challenges you faced. This can help track your progress over time
          (optional)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="E.g.: I felt full of energy, increased the weight on bench press..."
          value={notes}
          onChange={(e) => onChange(e.target.value)}
        />
      </CardContent>
    </Card>
  );
}
