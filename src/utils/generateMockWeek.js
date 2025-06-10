export const generateMockWeek = (startDateStr) => {
    const daysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
    const startDate = new Date(startDateStr);
    const timeSlots = [...Array(12).keys()].map(i => `${i + 8}:00`);

    const week = [];

    for (let i = 0; i < 7; i++){
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        const dateStr = currentDate.toISOString().split("T")[0];
        const dayLabel = daysOfWeek[i % 7];

        const slots = timeSlots.map((time, index) => {
            let status = 'free';

            if (i === 2 && time === "10:00") status = "occupied";
            if (i === 2 && time === "11:00") status = "occupied";
            if (i === 2 && time === "12:00") status = "occupied";

            return {
                time,
                price: 1600,
                status
            }
        });

        week.push({
            day:dayLabel,
            date:dateStr,
            slots
        })
    }

    return week
}