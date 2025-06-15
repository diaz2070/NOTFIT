// app/history/page.tsx
import React from 'react';
import HistoryPage from '@/components/history/WorkoutHistory';

export const metadata = {
  title: 'Historial de Entrenamientos',
  description: 'Revisa tu historial de entrenamientos en NotFit',
};

export default function HistoryRoutePage() {
  return <HistoryPage />;
}
