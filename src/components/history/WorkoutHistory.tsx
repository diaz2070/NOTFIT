'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Calendar,
  Clock,
  Target,
  TrendingUp,
  Filter,
  Search,
  Loader2,
  CircleX,
  Trash2,
  Edit,
} from 'lucide-react';
import getWorkoutHistory from '@/actions/workoutHistory';
import { Workout, GroupedExercise } from '@/types/workout';

import Link from 'next/link';
import useDeleteWorkoutLog from '@/hooks/useDeleteWorkoutLog';
import DeleteWorkoutLogModal from './DeleteWorkoutLogModal';

export default function HistoryPage({ userId }: { userId: string }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRoutine, setFilterRoutine] = useState('all');
  const [filterMonth, setFilterMonth] = useState('all');
  const [workoutHistory, setWorkoutHistory] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(
    null,
  );
  const [isModalOpen, setModalOpen] = useState(false);

  const { deleteWorkoutLog } = useDeleteWorkoutLog(() => {
    setWorkoutHistory((prev) => prev.filter((w) => w.id !== selectedWorkoutId));
    setModalOpen(false);
    setSelectedWorkoutId(null);
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await getWorkoutHistory();
        setWorkoutHistory(res);
      } catch (e) {
        if (e instanceof Error) {
          setError(e);
        } else {
          setError(new Error('Unknown error'));
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const routines = Array.from(new Set(workoutHistory.map((w) => w.routine)));
  const months = Array.from(
    new Set(
      workoutHistory.map((w) =>
        new Date(w.date).toLocaleString('en-US', {
          month: 'long',
          year: 'numeric',
        }),
      ),
    ),
  );

  const filteredWorkouts = workoutHistory.filter((workout) => {
    const matchesSearch =
      workout.routine.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workout.exercises.some((ex) =>
        ex.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    const matchesRoutine =
      filterRoutine === 'all' || workout.routine === filterRoutine;
    const monthLabel = new Date(workout.date).toLocaleString('en-US', {
      month: 'long',
      year: 'numeric',
    });
    const matchesMonth = filterMonth === 'all' || monthLabel === filterMonth;

    return matchesSearch && matchesRoutine && matchesMonth;
  });

  const getStats = () => {
    const totalWorkouts = workoutHistory.length;
    const totalTime = workoutHistory.reduce((acc, workout) => {
      const minutes = Number.parseInt(
        workout.duration?.split(' ')[0] || '0',
        10,
      );
      return acc + minutes;
    }, 0);
    const avgDuration = totalWorkouts
      ? Math.round(totalTime / totalWorkouts)
      : 0;

    return { totalWorkouts, totalTime, avgDuration };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="p-8 text-center text-muted-foreground min-h-[90dvh] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin" />
        Loading history...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[90dvh] flex flex-col items-center justify-center text-2xl p-8 text-center text-red-500 gap-2">
        <CircleX className="h-12 w-12" />
        <p>Error while loading</p>
        <p>Try again later</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Workout history
          </h1>
          <p className="text-muted-foreground">
            Check your progress and past trainings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total workouts
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalWorkouts}</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(stats.totalTime / 60)}h {stats.totalTime % 60}m
              </div>
              <p className="text-xs text-muted-foreground">
                Time spent training
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Duration
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgDuration} min</div>
              <p className="text-xs text-muted-foreground">
                Per training session
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search routine</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search routine or exercise..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="routine">Routine</Label>
                <Select value={filterRoutine} onValueChange={setFilterRoutine}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All routines</SelectItem>
                    {routines.map((routine) => (
                      <SelectItem key={routine} value={routine}>
                        {routine}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="month">Month</Label>
                <Select value={filterMonth} onValueChange={setFilterMonth}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All months</SelectItem>
                    {months.map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workout History */}
        <div className="space-y-6">
          {filteredWorkouts.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No training found
                </h3>
                <p className="text-gray-500">
                  Try adjusting the filters or do your first workout
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredWorkouts.map((workout) => (
              <Card
                key={workout.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {workout.routine}
                        <Badge variant="secondary">{workout.duration}</Badge>
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(workout.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Link
                        href={`/log/${workout.id}/edit`}
                        aria-label="Edit workout"
                      >
                        <Edit className="w-5 h-5 text-muted-foreground hover:text-blue-500 transition" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedWorkoutId(workout.id);
                          setModalOpen(true);
                        }}
                        aria-label="Delete workout"
                        className="text-red-500 hover:text-red-600 transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Exercises performed:</h4>
                      {(() => {
                        Object.values(
                          workout.exercises.reduce<
                            Record<string, GroupedExercise>
                          >((acc, curr) => {
                            const key = `${curr.name}-${curr.reps}-${curr.weight}`;
                            if (!acc[key]) {
                              acc[key] = {
                                name: curr.name,
                                reps: curr.reps,
                                weight: curr.weight,
                                sets: 1,
                              };
                            } else {
                              acc[key].sets += 1;
                            }
                            return acc;
                          }, {}),
                        );
                        return (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {workout.exercises.map((exercise, index) => (
                              <div
                                key={index}
                                className="flex justify-between items-center p-2 bg-base-100 border border-base-300 rounded"
                              >
                                <span className="text-sm">
                                  {exercise.name.charAt(0).toUpperCase() +
                                    exercise.name.slice(1)}
                                </span>
                                <div className="flex gap-2">
                                  <Badge
                                    variant="outline"
                                    className="bg-primary text-white text-xs"
                                  >
                                    Set {exercise.sets}x{exercise.reps}
                                  </Badge>
                                  {exercise.weight !== '0lbs' && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs text-white bg-primary"
                                    >
                                      {exercise.weight}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                    {workout.notes && (
                      <div>
                        <h4 className="font-medium mb-1">Notes:</h4>
                        <p className="text-sm text-gray-600 italic">
                          &quot;{workout.notes}&quot;
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        <DeleteWorkoutLogModal
          isOpen={isModalOpen}
          onCancel={() => setModalOpen(false)}
          onConfirm={() => {
            if (selectedWorkoutId) deleteWorkoutLog(selectedWorkoutId, userId);
          }}
        />
      </main>
    </div>
  );
}
