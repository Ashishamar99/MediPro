export function generateSlots(
  availabilityId: number,
  doctorId: string,
  startTime: Date,
  endTime: Date,
  interval: number = 60,
) {
  const slots = [];
  let currentStartTime = new Date(startTime);
  let currentEndTime = new Date(currentStartTime);
  currentEndTime.setMinutes(currentEndTime.getMinutes() + interval);

  while (currentEndTime <= endTime) {
    slots.push({
      availabilityId,
      doctorId,
      startTime: new Date(currentStartTime),
      endTime: new Date(currentEndTime),
    });

    currentStartTime.setMinutes(currentStartTime.getMinutes() + interval);
    currentEndTime.setMinutes(currentEndTime.getMinutes() + interval);
  }

  return slots;
}
