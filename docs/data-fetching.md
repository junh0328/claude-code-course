# Data Fetching Standards

This document outlines the **CRITICAL** data fetching standards and security requirements for this project.

## CRITICAL RULE: Server Components Only

**ALL data fetching in this application MUST be done via Server Components.**

### ✅ ALLOWED: Server Components
```tsx
// app/dashboard/page.tsx
import { getWorkouts } from "@/data/workouts";
import { auth } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const workouts = await getWorkouts(userId);

  return <div>{/* Render workouts */}</div>;
}
```

### ❌ FORBIDDEN: Route Handlers
```tsx
// ❌ DO NOT DO THIS
// app/api/workouts/route.ts
export async function GET() {
  // Never fetch data via API routes
}
```

### ❌ FORBIDDEN: Client Components with useEffect
```tsx
// ❌ DO NOT DO THIS
"use client";
import { useEffect, useState } from "react";

export default function Page() {
  useEffect(() => {
    // Never fetch data in client components
    fetch("/api/workouts");
  }, []);
}
```

### ❌ FORBIDDEN: Any Other Method
- No Server Actions for data fetching (use them for mutations only)
- No middleware for data fetching
- No client-side data libraries (SWR, React Query, etc.)
- No direct database calls from anywhere except `/data` directory

## Database Query Helper Functions

### Location
All database queries **MUST** be defined as helper functions in the `/data` directory.

### Structure
```
data/
  workouts.ts       # Workout-related queries
  exercises.ts      # Exercise-related queries
  users.ts          # User-related queries
```

### Requirements

1. **Use Drizzle ORM**: All queries MUST use Drizzle ORM
2. **NO RAW SQL**: Never use raw SQL queries
3. **User Isolation**: ALWAYS filter by userId to ensure users can only access their own data

### Example: Correct Implementation

```typescript
// data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq, and } from "drizzle-orm";

/**
 * Get all workouts for a specific user
 * @param userId - The authenticated user's ID
 * @returns Array of workouts belonging to the user
 */
export async function getWorkouts(userId: string) {
  return await db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, userId));
}

/**
 * Get a specific workout by ID for a user
 * @param workoutId - The workout ID
 * @param userId - The authenticated user's ID
 * @returns The workout if it belongs to the user, null otherwise
 */
export async function getWorkoutById(workoutId: number, userId: string) {
  const [workout] = await db
    .select()
    .from(workouts)
    .where(
      and(
        eq(workouts.id, workoutId),
        eq(workouts.userId, userId) // CRITICAL: Always filter by userId
      )
    );

  return workout ?? null;
}
```

### ❌ WRONG: Missing User Isolation

```typescript
// ❌ DO NOT DO THIS - Missing userId filter
export async function getWorkouts() {
  return await db.select().from(workouts); // SECURITY VULNERABILITY!
}

// ❌ DO NOT DO THIS - Using raw SQL
export async function getWorkouts(userId: string) {
  return await db.execute(sql`SELECT * FROM workouts WHERE user_id = ${userId}`);
}
```

## Security Requirements

### CRITICAL: User Data Isolation

**Every database query MUST ensure that users can ONLY access their own data.**

#### Implementation Checklist

- ✅ Always require `userId` as a parameter in data helper functions
- ✅ Always include `eq(table.userId, userId)` in WHERE clauses
- ✅ Verify `userId` comes from authenticated session (Clerk's `auth()`)
- ✅ Never trust client-provided user IDs
- ✅ Use Drizzle's type-safe query builder
- ✅ Test that users cannot access other users' data

#### Authentication Flow

```typescript
// app/dashboard/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getWorkouts } from "@/data/workouts";

export default async function DashboardPage() {
  // 1. Get authenticated user ID from Clerk
  const { userId } = await auth();

  // 2. Redirect if not authenticated
  if (!userId) {
    redirect("/sign-in");
  }

  // 3. Pass userId to data helper function
  const workouts = await getWorkouts(userId);

  // 4. Render data
  return <div>{/* ... */}</div>;
}
```

### NEVER Do This

```typescript
// ❌ SECURITY VULNERABILITY - Don't accept userId from client
"use client";
export default function Page() {
  const userId = localStorage.getItem("userId"); // Never trust client data
  // ...
}

// ❌ SECURITY VULNERABILITY - Don't fetch all users' data
export async function getAllWorkouts() {
  return await db.select().from(workouts); // No userId filter!
}

// ❌ SECURITY VULNERABILITY - Don't use URL params as userId
export default async function Page({ params }: { params: { userId: string } }) {
  const workouts = await getWorkouts(params.userId); // Can be manipulated!
}
```

## Summary

1. **Data Fetching**: ONLY in Server Components
2. **Database Queries**: ONLY via helper functions in `/data` directory
3. **Query Method**: ONLY Drizzle ORM (no raw SQL)
4. **Security**: Users can ONLY access their own data (always filter by userId)
5. **Authentication**: Always use Clerk's `auth()` to get the trusted userId

### Violation Consequences

Violating these standards can result in:
- Security vulnerabilities (unauthorized data access)
- Inconsistent data access patterns
- Performance issues
- Difficult-to-maintain code

**Follow these standards strictly for every feature you build.**
