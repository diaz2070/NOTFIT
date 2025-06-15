// components/routines/id/delete/DeleteRoutineModal.tsx

'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface Routine {
  id: string;
  name: string;
  days: string[];
  exercises: number;
  estimatedTime?: string;
  lastUsed?: string;
  category?: string;
}

interface DeleteRoutineModalProps {
  isOpen: boolean;
  routine: Routine | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteRoutineModal({
  isOpen,
  routine,
  onConfirm,
  onCancel,
}: DeleteRoutineModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-500" />
            Delete Routine
          </DialogTitle>
          <DialogDescription className='mt-3'>
            Are you sure you want to delete the routine{' '}
            <span className="font-semibold">&quot;{routine?.name}&quot;</span>?
          </DialogDescription>
        </DialogHeader>

        {routine && (
          <div className="py-1">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
              <div className=" text-sm">
                <span className="text-muted-foreground">Exercises: </span>
                <span className="font-medium">{routine.exercises}</span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Days: </span>
                <span className="font-medium">{routine.days.join(', ')}</span>
              </div>
            </div>
              <DialogDescription className="text-sm text-red-800 text-red-400 mt-3">
                All data related to this routine will be lost.
              </DialogDescription>
          </div>
        )}

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onConfirm} className="bg-red-600 hover:bg-red-700 text-white">
            <Trash2 className="h-4 w-4" />
            Delete Routine
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
