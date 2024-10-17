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

export const getFormattedSpeechData = (speechData: {
  medicine: string[];
  diagnosis: string;
  advice: string;
}): String => {
  const medicine = speechData.medicine.join("\n");

  let formattedSpeechData = `Diagnosing for, ${speechData.diagnosis}.`;
  formattedSpeechData += ` Medicines prescribed, ${medicine}. `;
  formattedSpeechData += speechData.advice.length
    ? `Advice, ${speechData.advice}`
    : "";
  return formattedSpeechData;
};
