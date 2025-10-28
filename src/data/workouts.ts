import { db, workouts } from '@/db';
import { eq, and, gte, lte } from 'drizzle-orm';
import { startOfDay, endOfDay } from 'date-fns';

/**
 * Get all workouts for a specific user on a specific date
 * @param userId - The authenticated user's ID from Clerk
 * @param date - The date to filter workouts by
 * @returns Array of workouts with their exercises and sets
 */
export async function getWorkoutsByDate(userId: string, date: Date) {
  const startOfDayDate = startOfDay(date);
  const endOfDayDate = endOfDay(date);

  // Query workouts with their related exercises and sets
  const userWorkouts = await db.query.workouts.findMany({
    where: and(
      eq(workouts.userId, userId),
      gte(workouts.date, startOfDayDate),
      lte(workouts.date, endOfDayDate)
    ),
    with: {
      workoutExercises: {
        with: {
          exercise: true,
          sets: true,
        },
        orderBy: (workoutExercises, { asc }) => [
          asc(workoutExercises.orderIndex),
        ],
      },
    },
    orderBy: (workouts, { desc }) => [desc(workouts.date)],
  });

  return userWorkouts;
}

/**
 * Get a specific workout by ID for a user
 * @param workoutId - The workout ID
 * @param userId - The authenticated user's ID from Clerk
 * @returns The workout with exercises and sets if it belongs to the user, null otherwise
 */
export async function getWorkoutById(workoutId: string, userId: string) {
  const workout = await db.query.workouts.findFirst({
    where: and(eq(workouts.id, workoutId), eq(workouts.userId, userId)),
    with: {
      workoutExercises: {
        with: {
          exercise: true,
          sets: true,
        },
        orderBy: (workoutExercises, { asc }) => [
          asc(workoutExercises.orderIndex),
        ],
      },
    },
  });

  return workout ?? null;
}

/**
 * Get all workouts for a specific user
 * @param userId - The authenticated user's ID from Clerk
 * @returns Array of all workouts belonging to the user
 */
export async function getAllWorkouts(userId: string) {
  const userWorkouts = await db.query.workouts.findMany({
    where: eq(workouts.userId, userId),
    with: {
      workoutExercises: {
        with: {
          exercise: true,
          sets: true,
        },
        orderBy: (workoutExercises, { asc }) => [
          asc(workoutExercises.orderIndex),
        ],
      },
    },
    orderBy: (workouts, { desc }) => [desc(workouts.date)],
  });

  return userWorkouts;
}
