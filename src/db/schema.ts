import {
  pgTable,
  uuid,
  text,
  varchar,
  timestamp,
  integer,
  decimal,
  boolean,
  pgEnum,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const weightUnitEnum = pgEnum('weight_unit', ['kg', 'lbs', 'bodyweight']);

// Exercises table (user-created exercise library)
export const exercises = pgTable(
  'exercises',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: varchar('user_id', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    muscleGroup: varchar('muscle_group', { length: 100 }),
    equipment: varchar('equipment', { length: 100 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('exercises_user_id_idx').on(table.userId),
  })
);

// Workout templates table
export const workoutTemplates = pgTable(
  'workout_templates',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: varchar('user_id', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('workout_templates_user_id_idx').on(table.userId),
  })
);

// Workouts table (individual workout sessions)
export const workouts = pgTable(
  'workouts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: varchar('user_id', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }),
    date: timestamp('date').notNull().defaultNow(),
    templateId: uuid('template_id').references(() => workoutTemplates.id, {
      onDelete: 'set null',
    }),
    notes: text('notes'),
    durationMinutes: integer('duration_minutes'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('workouts_user_id_idx').on(table.userId),
    dateIdx: index('workouts_date_idx').on(table.date),
    templateIdIdx: index('workouts_template_id_idx').on(table.templateId),
  })
);

// Workout exercises junction table (links workouts to exercises)
export const workoutExercises = pgTable(
  'workout_exercises',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    workoutId: uuid('workout_id')
      .notNull()
      .references(() => workouts.id, { onDelete: 'cascade' }),
    exerciseId: uuid('exercise_id')
      .notNull()
      .references(() => exercises.id, { onDelete: 'cascade' }),
    orderIndex: integer('order_index').notNull(),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    workoutIdIdx: index('workout_exercises_workout_id_idx').on(table.workoutId),
    exerciseIdIdx: index('workout_exercises_exercise_id_idx').on(table.exerciseId),
  })
);

// Sets table (individual sets within workout exercises)
export const sets = pgTable(
  'sets',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    workoutExerciseId: uuid('workout_exercise_id')
      .notNull()
      .references(() => workoutExercises.id, { onDelete: 'cascade' }),
    setNumber: integer('set_number').notNull(),
    reps: integer('reps').notNull(),
    weight: decimal('weight', { precision: 10, scale: 2 }).notNull(),
    weightUnit: weightUnitEnum('weight_unit').notNull().default('kg'),
    completed: boolean('completed').notNull().default(false),
    rpe: integer('rpe'), // Rate of Perceived Exertion (1-10)
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    workoutExerciseIdIdx: index('sets_workout_exercise_id_idx').on(table.workoutExerciseId),
  })
);

// Workout template exercises junction table (links templates to exercises)
export const workoutTemplateExercises = pgTable(
  'workout_template_exercises',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    templateId: uuid('template_id')
      .notNull()
      .references(() => workoutTemplates.id, { onDelete: 'cascade' }),
    exerciseId: uuid('exercise_id')
      .notNull()
      .references(() => exercises.id, { onDelete: 'cascade' }),
    orderIndex: integer('order_index').notNull(),
    targetSets: integer('target_sets'),
    targetReps: integer('target_reps'),
    targetWeight: decimal('target_weight', { precision: 10, scale: 2 }),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    templateIdIdx: index('workout_template_exercises_template_id_idx').on(table.templateId),
    exerciseIdIdx: index('workout_template_exercises_exercise_id_idx').on(table.exerciseId),
  })
);

// Relations
export const exercisesRelations = relations(exercises, ({ many }) => ({
  workoutExercises: many(workoutExercises),
  workoutTemplateExercises: many(workoutTemplateExercises),
}));

export const workoutTemplatesRelations = relations(workoutTemplates, ({ many }) => ({
  workouts: many(workouts),
  workoutTemplateExercises: many(workoutTemplateExercises),
}));

export const workoutsRelations = relations(workouts, ({ one, many }) => ({
  template: one(workoutTemplates, {
    fields: [workouts.templateId],
    references: [workoutTemplates.id],
  }),
  workoutExercises: many(workoutExercises),
}));

export const workoutExercisesRelations = relations(workoutExercises, ({ one, many }) => ({
  workout: one(workouts, {
    fields: [workoutExercises.workoutId],
    references: [workouts.id],
  }),
  exercise: one(exercises, {
    fields: [workoutExercises.exerciseId],
    references: [exercises.id],
  }),
  sets: many(sets),
}));

export const setsRelations = relations(sets, ({ one }) => ({
  workoutExercise: one(workoutExercises, {
    fields: [sets.workoutExerciseId],
    references: [workoutExercises.id],
  }),
}));

export const workoutTemplateExercisesRelations = relations(
  workoutTemplateExercises,
  ({ one }) => ({
    template: one(workoutTemplates, {
      fields: [workoutTemplateExercises.templateId],
      references: [workoutTemplates.id],
    }),
    exercise: one(exercises, {
      fields: [workoutTemplateExercises.exerciseId],
      references: [exercises.id],
    }),
  })
);
