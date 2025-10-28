"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { formatProjectDate } from "@/lib/date-utils";
import { CalendarIcon } from "lucide-react";

// Mock workout data structure (for UI display only)
const mockWorkouts = [
	{
		id: 1,
		name: "Morning Run",
		duration: "30 mins",
		type: "Cardio",
		notes: "5K run at the park",
	},
	{
		id: 2,
		name: "Upper Body Strength",
		duration: "45 mins",
		type: "Strength",
		notes: "Bench press, overhead press, pull-ups",
	},
	{
		id: 3,
		name: "Evening Yoga",
		duration: "20 mins",
		type: "Flexibility",
		notes: "Relaxing flow session",
	},
];

export default function DashboardPage() {
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());

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
				<Card>
					<CardHeader>
						<CardTitle>Select Date</CardTitle>
					</CardHeader>
					<CardContent>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									className="w-full justify-start text-left font-normal"
								>
									<CalendarIcon className="mr-2 h-4 w-4" />
									{formatProjectDate(selectedDate)}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0" align="start">
								<Calendar
									mode="single"
									selected={selectedDate}
									onSelect={(date) => date && setSelectedDate(date)}
									initialFocus
								/>
							</PopoverContent>
						</Popover>
					</CardContent>
				</Card>

				{/* Workouts List */}
				<div>
					<h2 className="text-2xl font-semibold mb-4">
						Workouts for {formatProjectDate(selectedDate)}
					</h2>

					{mockWorkouts.length === 0 ? (
						<Card>
							<CardContent className="p-6">
								<p className="text-center text-muted-foreground">
									No workouts logged for this date
								</p>
							</CardContent>
						</Card>
					) : (
						<div className="space-y-4">
							{mockWorkouts.map((workout) => (
								<Card key={workout.id}>
									<CardHeader>
										<div className="flex items-start justify-between">
											<div>
												<CardTitle>{workout.name}</CardTitle>
												<div className="flex gap-3 mt-2 text-sm text-muted-foreground">
													<span>{workout.type}</span>
													<span>•</span>
													<span>{workout.duration}</span>
												</div>
											</div>
										</div>
									</CardHeader>
									{workout.notes && (
										<CardContent>
											<p className="text-sm">{workout.notes}</p>
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
