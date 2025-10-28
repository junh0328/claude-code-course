"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

export function DatePickerCard() {
	const router = useRouter();
	const searchParams = useSearchParams();

	// Get date from URL or default to today
	const dateParam = searchParams.get("date");
	const initialDate = dateParam ? new Date(dateParam) : new Date();

	const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
	const [isOpen, setIsOpen] = useState(false);

	const handleDateSelect = (date: Date | undefined) => {
		if (!date) return;

		setSelectedDate(date);

		// Update URL with new date
		const params = new URLSearchParams(searchParams);
		params.set("date", date.toISOString());
		router.push(`/dashboard?${params.toString()}`);

		// Close the popover
		setIsOpen(false);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Select Date</CardTitle>
			</CardHeader>
			<CardContent>
				<Popover open={isOpen} onOpenChange={setIsOpen}>
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
							onSelect={handleDateSelect}
							initialFocus
						/>
					</PopoverContent>
				</Popover>
			</CardContent>
		</Card>
	);
}
