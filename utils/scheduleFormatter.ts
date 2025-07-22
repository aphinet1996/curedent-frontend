interface TimetableEntry {
  day?: string;           // สำหรับ Assistant (day: "monday")
  date?: string;         // สำหรับ Doctor (date: "2024-01-15")
  time: string[];
}

interface Branch {
  branchId?: string;
  name?: string;
  timetable: TimetableEntry[];
}

interface Person {
  branches: Branch[];
}

// วันในสัปดาห์ตามลำดับ
const DAYS_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

// แปลงชื่อวันเป็นภาษาไทย
const DAY_NAMES_TH = {
  monday: 'จันทร์',
  tuesday: 'อังคาร',
  wednesday: 'พุธ',
  thursday: 'พฤหัสบดี',
  friday: 'ศุกร์',
  saturday: 'เสาร์',
  sunday: 'อาทิตย์'
} as const;

// แปลงชื่อวันเป็นภาษาอังกฤษแบบสั้น
const DAY_NAMES_EN = {
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
  saturday: 'Sat',
  sunday: 'Sun'
} as const;

/**
 * แปลง date string เป็นชื่อวัน
 */
function getWeekdayFromDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    return weekday;
  } catch {
    return 'monday'; // fallback
  }
}

/**
 * แปลง timetable entry เป็น normalized format
 */
function normalizeTimetableEntry(entry: TimetableEntry): { day: string; time: string[] } {
  let day: string;
  
  if (entry.day) {
    // Assistant format: มี day property
    day = entry.day.toLowerCase();
  } else if (entry.date) {
    // Doctor format: มี date property
    day = getWeekdayFromDate(entry.date);
  } else {
    // Fallback
    day = 'monday';
  }
  
  return {
    day,
    time: entry.time || []
  };
}

export function formatTimeRange(times: string[]): string {
  if (!times || times.length === 0) return '';

  if (times.length === 1) return times[0];

  // เรียงเวลาตามลำดับ
  const sortedTimes = times.sort();

  // แปลงเป็นชั่วโมง
  const hours = sortedTimes.map(time => parseInt(time.split(':')[0]));

  // ตรวจสอบว่าเวลาต่อเนื่องกันหรือไม่
  let isConsecutive = true;
  for (let i = 1; i < hours.length; i++) {
    if (hours[i] - hours[i - 1] !== 1) {
      isConsecutive = false;
      break;
    }
  }

  if (isConsecutive && hours.length > 1) {
    // ถ้าต่อเนื่องกัน แสดงเป็น range
    const startTime = sortedTimes[0];
    const endHour = hours[hours.length - 1] + 1; // +1 เพราะต้องการเวลาสิ้นสุด
    const endTime = `${endHour.toString().padStart(2, '0')}:00`;
    return `${startTime} - ${endTime}`;
  } else {
    // ถ้าไม่ต่อเนื่องกัน แสดงทุกเวลา (แบบย่อ)
    if (sortedTimes.length <= 3) {
      return sortedTimes.join(', ');
    } else {
      return sortedTimes.slice(0, 2).join(', ') + `... (+${sortedTimes.length - 2})`;
    }
  }
}

/**
 * แปลงวันให้เป็น range ถ้าต่อเนื่องกัน
 * เช่น ["monday", "tuesday", "wednesday"] -> "Mon - Wed"
 */
export function formatDayRange(days: string[], language: 'th' | 'en' = 'en'): string {
  if (!days || days.length === 0) return '';

  const dayNames = language === 'th' ? DAY_NAMES_TH : DAY_NAMES_EN;

  if (days.length === 1) {
    return dayNames[days[0] as keyof typeof dayNames] || days[0];
  }

  // เรียงวันตามลำดับในสัปดาห์
  const sortedDays = days.sort((a, b) =>
    DAYS_ORDER.indexOf(a) - DAYS_ORDER.indexOf(b)
  );

  // ตรวจสอบว่าวันต่อเนื่องกันหรือไม่
  const dayIndices = sortedDays.map(day => DAYS_ORDER.indexOf(day));

  let isConsecutive = true;
  for (let i = 1; i < dayIndices.length; i++) {
    if (dayIndices[i] - dayIndices[i - 1] !== 1) {
      isConsecutive = false;
      break;
    }
  }

  if (isConsecutive && sortedDays.length > 2) {
    // ถ้าต่อเนื่องกันและมีมากกว่า 2 วัน แสดงเป็น range
    const firstDay = dayNames[sortedDays[0] as keyof typeof dayNames];
    const lastDay = dayNames[sortedDays[sortedDays.length - 1] as keyof typeof dayNames];
    return `${firstDay} - ${lastDay}`;
  } else {
    // ถ้าไม่ต่อเนื่องกันหรือมีแค่ 2 วัน แสดงทุกวัน
    return sortedDays
      .map(day => dayNames[day as keyof typeof dayNames])
      .join(', ');
  }
}

/**
 * จัดกลุ่ม timetable ที่มีเวลาเหมือนกัน
 */
export function groupTimetableByTime(timetable: TimetableEntry[]): Array<{
  days: string[];
  times: string[];
  timeRange: string;
  dayRange: string;
  scheduleKey: string;
}> {
  const groups: { [key: string]: string[] } = {};

  // แปลง timetable entries และจัดกลุ่มตามเวลา
  timetable.forEach(entry => {
    const normalized = normalizeTimetableEntry(entry);
    const timeKey = normalized.time.sort().join(',');
    
    if (!groups[timeKey]) {
      groups[timeKey] = [];
    }
    groups[timeKey].push(normalized.day);
  });

  // แปลงเป็น array และจัดรูปแบบ
  return Object.entries(groups).map(([timeKey, days]) => {
    const times = timeKey === '' ? [] : timeKey.split(',');
    const timeRange = formatTimeRange(times);
    const dayRange = formatDayRange(days, 'en');

    return {
      days,
      times,
      timeRange,
      dayRange,
      scheduleKey: `${dayRange}: ${timeRange}`
    };
  }).sort((a, b) => {
    // เรียงตาม index ของวันแรกในกลุ่ม
    const aFirstDay = DAYS_ORDER.indexOf(a.days.sort((x, y) => DAYS_ORDER.indexOf(x) - DAYS_ORDER.indexOf(y))[0]);
    const bFirstDay = DAYS_ORDER.indexOf(b.days.sort((x, y) => DAYS_ORDER.indexOf(x) - DAYS_ORDER.indexOf(y))[0]);
    return aFirstDay - bFirstDay;
  });
}

/**
 * สร้างข้อความแสดงตารางเวลาแบบสั้น (สำหรับการ์ด)
 * รองรับทั้ง Assistant และ Doctor
 */
export function getFormattedScheduleShort(person: Person): string {
  if (!person.branches || person.branches.length === 0) {
    return 'ไม่ระบุตารางเวลา';
  }

  const allTimetables = person.branches.flatMap(branch => branch.timetable || []);

  if (allTimetables.length === 0) {
    return 'ไม่ระบุตารางเวลา';
  }

  // จัดกลุ่ม timetable
  const groups = groupTimetableByTime(allTimetables);

  if (groups.length === 0) {
    return 'ไม่ระบุตารางเวลา';
  }

  // ถ้ามีแค่กลุ่มเดียว แสดงแบบปกติ
  if (groups.length === 1) {
    const group = groups[0];
    return `${group.dayRange}\n${group.timeRange}`;
  }

  // ถ้ามีหลายกลุ่ม แสดงแค่ 2 กลุ่มแรก
  const displayGroups = groups.slice(0, 2);
  const scheduleLines = displayGroups.map(group => group.scheduleKey);

  if (groups.length > 2) {
    scheduleLines.push(`+${groups.length - 2} more...`);
  }

  return scheduleLines.join('\n');
}

/**
 * สร้างข้อความแสดงตารางเวลาแบบละเอียด (สำหรับ tooltip หรือ modal)
 * รองรับทั้ง Assistant และ Doctor
 */
export function getFormattedScheduleDetailed(person: Person): Array<{
  dayRange: string;
  timeRange: string;
  branch?: string;
  scheduleKey: string;
  days: string[];
  times: string[];
}> {
  if (!person.branches || person.branches.length === 0) {
    return [];
  }

  const result: Array<{
    dayRange: string;
    timeRange: string;
    branch?: string;
    scheduleKey: string;
    days: string[];
    times: string[];
  }> = [];

  person.branches.forEach(branch => {
    if (branch.timetable && branch.timetable.length > 0) {
      const groups = groupTimetableByTime(branch.timetable);

      groups.forEach(group => {
        result.push({
          dayRange: group.dayRange,
          timeRange: group.timeRange,
          scheduleKey: group.scheduleKey,
          days: group.days,
          times: group.times,
          branch: branch.name
        });
      });
    }
  });

  return result;
}

/**
 * ตรวจสอบว่าตารางเวลาซับซ้อนหรือไม่ (มีหลายกลุ่มเวลา)
 * รองรับทั้ง Assistant และ Doctor
 */
export function isComplexSchedule(person: Person): boolean {
  if (!person.branches || person.branches.length === 0) {
    return false;
  }

  const allTimetables = person.branches.flatMap(branch => branch.timetable || []);
  const groups = groupTimetableByTime(allTimetables);

  return groups.length > 1;
}

/**
 * สร้างข้อความแสดงตารางเวลาแบบสั้นพิเศษสำหรับหมอ (ใช้รูปแบบ slots)
 */
export function getFormattedScheduleShortForDoctor(doctor: Person): string {
  if (!doctor.branches || doctor.branches.length === 0) {
    return 'ไม่ระบุตารางเวลา';
  }

  const allTimetables = doctor.branches.flatMap(branch => branch.timetable || []);

  if (allTimetables.length === 0) {
    return 'ไม่ระบุตารางเวลา';
  }

  // สำหรับหมอ เราจะแสดงในรูปแบบ "วัน: จำนวน slots"
  const scheduleTexts: string[] = [];
  
  allTimetables.slice(0, 3).forEach(entry => {
    const normalized = normalizeTimetableEntry(entry);
    const dayName = DAY_NAMES_EN[normalized.day as keyof typeof DAY_NAMES_EN] || normalized.day;
    const slotCount = normalized.time.length;
    scheduleTexts.push(`${dayName}: ${slotCount} slot${slotCount > 1 ? 's' : ''}`);
  });

  if (allTimetables.length > 3) {
    scheduleTexts.push(`+${allTimetables.length - 3} more days`);
  }

  return scheduleTexts.join('\n');
}