export interface ScheduleItem {
  start: number; // HHMM format
  end: number;   // HHMM format
  activity: string;
  color: string;
}

export const WEEKLY_SCHOOL_SCHEDULE: Record<number, { start: number; end: number }> = {
  1: { start: 900, end: 1600 },  // Monday
  2: { start: 1000, end: 1500 }, // Tuesday
  3: { start: 900, end: 1400 },  // Wednesday
  4: { start: 1100, end: 1600 }, // Thursday
  5: { start: 900, end: 1500 },  // Friday
  6: { start: 0, end: 0 },       // Saturday (No school)
  0: { start: 0, end: 0 },       // Sunday (No school)
};

export const getDailySchedule = (date: Date) => {
  const day = date.getDay();
  const school = WEEKLY_SCHOOL_SCHEDULE[day];
  
  const schedule = [
    { time: "00:00 - 07:00", activity: "Sleeping 🌙", color: "text-slate-500" },
  ];

  if (school.start > 0) {
    const formatTime = (t: number) => {
      const h = Math.floor(t / 100);
      const m = t % 100;
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };

    schedule.push({ 
      time: `${formatTime(school.start)} - ${formatTime(school.end)}`, 
      activity: "At School 🏫", 
      color: "text-amber-500" 
    });

    // Add breaks if school is long enough
    if (school.end - school.start > 400) {
      schedule.push({ time: "12:30 - 13:20", activity: "Lunch Break 🍱", color: "text-rose-500" });
    }
  } else {
    schedule.push({ time: "Day Off", activity: "Relaxing at Home 🏠", color: "text-green-500" });
  }

  const schoolEnd = school.end || 1600;
  schedule.push({ time: `${Math.floor(schoolEnd/100)}:00 - 18:00`, activity: "Baking 🍰", color: "text-rose-500" });
  schedule.push({ time: "18:00 - 21:00", activity: "Studying 📖", color: "text-blue-500" });
  schedule.push({ time: "21:00 - 00:00", activity: "Relaxing ✨", color: "text-purple-500" });

  return schedule;
};