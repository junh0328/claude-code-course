import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatProjectDate } from "@/lib/date-utils";
import { getWorkoutsByDate } from "@/data/workouts";
import { DatePickerCard } from "./_components/date-picker-card";

type SearchParams = Promise<{
	date?: string;
}>;

export default async function DashboardPage(props: {
	searchParams: SearchParams;
}) {
	// Get authenticated user
	const { userId } = await auth();

	// Redirect to sign-in if not authenticated
	if (!userId) {
		redirect("/sign-in");
	}

	// Get date from search params or default to today
	const searchParams = await props.searchParams;
	const dateParam = searchParams.date;
	const selectedDate = dateParam ? new Date(dateParam) : new Date();

	// Fetch workouts for the selected date
	const workouts = await getWorkoutsByDate(userId, selectedDate);

	return (
		<div className="container mx-auto p-6 max-w-4xl">
			<div className="space-y-6">
				{/* Header */}
				<div>
					<h1 className="text-3xl font-bold">Workout Dashboard</h1>
					<p className="text-muted-foreground mt-2">
						Track and view your daily workouts
					</p>
				</div>

				{/* Date Picker */}
				<DatePickerCard />

				{/* Workouts List */}
				<div>
					<h2 className="text-2xl font-semibold mb-4">
						Workouts for {formatProjectDate(selectedDate)}
					</h2>

					{workouts.length === 0 ? (
						<Card>
							<CardContent className="p-6">
								<p className="text-center text-muted-foreground">
									No workouts logged for this date
								</p>
							</CardContent>
						</Card>
					) : (
						<div className="space-y-4">
							{workouts.map((workout) => (
								<Card key={workout.id}>
									<CardHeader>
										<div className="flex items-start justify-between">
											<div>
												<CardTitle>
													{workout.name || "Unnamed Workout"}
												</CardTitle>
												<div className="flex gap-3 mt-2 text-sm text-muted-foreground">
													{workout.durationMinutes && (
														<>
															<span>{workout.durationMinutes} mins</span>
															<span>•</span>
														</>
													)}
													<span>
														{workout.workoutExercises.length}{" "}
														{workout.workoutExercises.length === 1
															? "exercise"
															: "exercises"}
													</span>
												</div>
											</div>
										</div>
									</CardHeader>
									{workout.notes && (
										<CardContent>
											<p className="text-sm">{workout.notes}</p>
										</CardContent>
									)}
									{workout.workoutExercises.length > 0 && (
										<CardContent className="pt-0">
											<div className="space-y-2">
												<p className="text-sm font-medium">Exercises:</p>
												<ul className="text-sm text-muted-foreground space-y-1">
													{workout.workoutExercises.map((we) => (
														<li key={we.id}>
															• {we.exercise.name} ({we.sets.length}{" "}
															{we.sets.length === 1 ? "set" : "sets"})
														</li>
													))}
												</ul>
											</div>
										</CardContent>
									)}
								</Card>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
