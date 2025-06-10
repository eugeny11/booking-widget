import { generateMockWeek } from "./generateMockWeek";

export const transformEventsToWeek = (events, startDateStr) => {
  const baseWeek = generateMockWeek(startDateStr); // возьмём слоты по времени

  for (const event of events) {
    const date = event.date_start.slice(0, 10);
    const time = event.date_start.slice(11, 16);

    baseWeek.forEach(day => {
      if (day.date === date) {
        day.slots.forEach(slot => {
          if (slot.time === time) {
            slot.status = "occupied";
          }
        });
      }
    });
  }

  return baseWeek;
};