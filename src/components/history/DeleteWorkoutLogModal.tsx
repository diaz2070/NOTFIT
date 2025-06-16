'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Props {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

function DeleteWorkoutLogModal({ isOpen, onCancel, onConfirm }: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm delete</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete this workout? This action is
          irreversible.
        </p>
        <DialogFooter className="mt-4">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={onConfirm}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteWorkoutLogModal;
