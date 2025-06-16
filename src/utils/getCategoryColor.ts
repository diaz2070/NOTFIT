const categoryColors: Record<string, string> = {
  // Exercise category colors
  Chest: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  Back: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  Upper_Legs:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  Lower_Legs:
    'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  Shoulders:
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  Upper_Arms:
    'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  Lower_Arms: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  Waist: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  Cardio: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  Neck: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',

  // Muscle target colors
  Abductors:
    'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  Abs: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  Adductors: 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200',
  Biceps: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
  Calves: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
  Cardiovascular_System:
    'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200',
  Delts:
    'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200',
  Forearms:
    'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-200',
  Glutes: 'bg-blue-200 text-blue-900 dark:bg-blue-950 dark:text-blue-100',
  Hamstrings:
    'bg-green-200 text-green-900 dark:bg-green-950 dark:text-green-100',
  Lats: 'bg-orange-200 text-orange-900 dark:bg-orange-950 dark:text-orange-100',
  Levator_Scapulae:
    'bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200',
  Pectorals:
    'bg-stone-100 text-stone-800 dark:bg-stone-900 dark:text-stone-200',
  Quads: 'bg-red-200 text-red-900 dark:bg-red-950 dark:text-red-100',
  Serratus_Anterior:
    'bg-amber-200 text-amber-900 dark:bg-amber-950 dark:text-amber-100',
  Spine: 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200',
  Traps: 'bg-gray-200 text-gray-900 dark:bg-gray-950 dark:text-gray-100',
  Triceps:
    'bg-neutral-100 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200',
  Upper_Back:
    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
};

export default function getCategoryColor(category: string): string {
  return (
    categoryColors[category] ??
    'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  );
}
