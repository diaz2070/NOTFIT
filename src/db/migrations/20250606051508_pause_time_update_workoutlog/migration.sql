/*
  Warnings:

  - You are about to drop the column `duration` on the `WorkoutLog` table. All the data in the column will be lost.
  - Added the required column `completedSets` to the `WorkoutLogEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WorkoutLog" DROP COLUMN "duration",
ADD COLUMN     "pausedAt" TIMESTAMP(3),
ADD COLUMN     "totalPaused" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "WorkoutLogEntry" ADD COLUMN     "completedSets" JSONB NOT NULL;
