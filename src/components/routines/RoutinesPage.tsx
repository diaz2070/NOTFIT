'use client';

import { Routine, RoutineExercise, Exercise } from '@prisma/client';
import { useState, useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Edit, Trash2, Target, Search } from 'lucide-react';
import Link from 'next/link';
import useRoutines from '@/hooks/useRoutines';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination';

type RoutineWithExercises = Routine & {
  exercises: (RoutineExercise & {
    exercise: Exercise;
  })[];
};

const ITEMS_PER_PAGE = 6;

export default function RoutinesPage({ userId }: { userId: string }) {
  const { routines, isPending } = useRoutines(userId);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDay, setFilterDay] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);

  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  const filteredAndSortedRoutines = useMemo(() => {
    const filtered = routines.filter((routine: RoutineWithExercises) => {
      const matchesSearch = routine.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesDay =
        filterDay === 'all' || routine.daysOfWeek.includes(filterDay);
      return matchesSearch && matchesDay;
    });

    filtered.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'exercises')
        return b.exercises.length - a.exercises.length;
      return 0;
    });

    return filtered;
  }, [routines, searchTerm, filterDay, sortBy]);

  const totalPages = Math.ceil(
    filteredAndSortedRoutines.length / ITEMS_PER_PAGE,
  );
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRoutines = filteredAndSortedRoutines.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const handleFilterChange =
    (setter: (value: string) => void) => (value: string) => {
      setter(value);
      setCurrentPage(1);
    };

  const emptyMessage =
    routines.length === 0
      ? 'No tienes rutinas creadas'
      : 'No se encontraron rutinas';

  let content;
  if (isPending) {
    content = <p className="text-center">Cargando rutinas...</p>;
  } else if (filteredAndSortedRoutines.length === 0) {
    content = (
      <Card className="text-center py-12">
        <CardContent>
          <div className="mb-4">
            <Target className="h-12 w-12 text-gray-400 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold mb-2">{emptyMessage}</h3>
          <p className="text-gray-500 mb-4">
            Intenta ajustar los filtros de búsqueda
          </p>
          <Button asChild>
            <Link href="/routines/new">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Rutina
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  } else {
    content = (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {paginatedRoutines.map((routine) => (
            <Card
              key={routine.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{routine.name}</CardTitle>
                    <CardDescription>
                      {routine.daysOfWeek.join(', ')}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/routines/${routine.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      {routine.exercises.length} ejercicios
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      asChild
                    >
                      <Link href={`/routines/${routine.id}`}>Ver Detalles</Link>
                    </Button>
                    <Button size="sm" className="flex-1" asChild>
                      <Link href={`/workout/log?routine=${routine.id}`}>
                        Usar Rutina
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={i + 1 === currentPage}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Mis Rutinas
            </h1>
            <p className="text-muted-foreground">
              Gestiona tus rutinas de entrenamiento
            </p>
          </div>
          <Button asChild>
            <Link href="/routines/new">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Rutina
            </Link>
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Buscar y Filtrar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Buscar rutina</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Buscar por nombre..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="filter-day">Día de la semana</Label>
                <Select
                  value={filterDay}
                  onValueChange={handleFilterChange(setFilterDay)}
                >
                  <SelectTrigger id="filter-day" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los días</SelectItem>
                    {days.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sort-by">Ordenar por</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger id="sort-by" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Nombre</SelectItem>
                    <SelectItem value="exercises">
                      Número de ejercicios
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="invisible">Resultados</Label>
                <div className="text-sm text-muted-foreground pt-2">
                  {filteredAndSortedRoutines.length} rutina(s) encontrada(s)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {content}
      </main>
    </div>
  );
}
