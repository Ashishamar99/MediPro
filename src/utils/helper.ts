import { CustomSlot } from "./types";

export function generateTimeSlots(
  date: Date,
  startTime: Date,
  endTime: Date,
  interval: number,
  doctorId: string,
): CustomSlot[] {
  const slots = [];
  let currentStartTime = new Date(startTime);

  while (currentStartTime < endTime) {
    const currentEndTime = new Date(
      currentStartTime.getTime() + interval * 60000,
    ); // Add interval in minutes

    if (currentEndTime > endTime) break; // Do not create a slot that exceeds the endTime

    slots.push({
      startTime: new Date(currentStartTime),
      endTime: currentEndTime,
      status: "available",
      doctorId,
      date,
    });

    currentStartTime = currentEndTime; // Move to the next slot start time
  }

  return slots;
}
