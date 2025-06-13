import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  nextPage: () => void;
  prevPage: () => void;
}

export default function PaginationControls({
  page,
  totalPages,
  nextPage,
  prevPage,
}: Readonly<PaginationControlsProps>) {
  return (
    <Pagination className="w-full">
      <PaginationContent className="w-full flex items-center justify-between">
        <PaginationItem>
          <Button
            variant="outline"
            size="sm"
            onClick={prevPage}
            disabled={page === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </PaginationItem>
        <PaginationItem>
          <span className="text-sm text-muted-foreground">{`Page ${page} of ${totalPages}`}</span>
        </PaginationItem>
        <PaginationItem>
          <Button
            variant="outline"
            size="sm"
            onClick={nextPage}
            disabled={page === totalPages}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
