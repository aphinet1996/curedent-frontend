// import { defineStore } from 'pinia';
// import type { CalendarState, Appointment, Doctor, CalendarViewType } from '~/types/calendar';
// import { format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval, addDays, isSameDay } from 'date-fns';

// // Mock data for initial store state
// const mockDoctors: Doctor[] = [
//   { id: 'ice', name: 'Doctor Ice', color: 'bg-blue-100', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random().toString(36).substring(2,%208)}' },
//   { id: 'aric', name: 'Doctor Aric', color: 'bg-teal-100', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random().toString(36).substring(2,%208)}' },
//   { id: 'pob', name: 'Doctor Pob', color: 'bg-yellow-100', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random().toString(36).substring(2,%208)}' },
//   { id: 'pong', name: 'Doctor Pong', color: 'bg-purple-100', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random().toString(36).substring(2,%208)}' },
//   { id: 'jane', name: 'Doctor Jane', color: 'bg-pink-100', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random().toString(36).substring(2,%208)}' },
//   { id: 'meen', name: 'Doctor Meen', color: 'bg-sky-100', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random().toString(36).substring(2,%208)}' },
// ];

// // Generate mock appointments for the next 30 days
// // const generateMockAppointments = (): Appointment[] => {
// //   const appointments: Appointment[] = [];
// //   const today = new Date();

// //   for (let i = 0; i < 50; i++) {
// //     const doctorId = mockDoctors[Math.floor(Math.random() * mockDoctors.length)].id;
// //     const dayOffset = Math.floor(Math.random() * 30);
// //     const date = new Date(today);
// //     date.setDate(date.getDate() + dayOffset);

// //     const startHour = 8 + Math.floor(Math.random() * 8); // Between 8 AM and 4 PM
// //     const startMinute = Math.random() > 0.5 ? 0 : 30; // Either 0 or 30 minutes

// //     // Format as YYYY-MM-DD
// //     const dateString = format(date, 'yyyy-MM-dd');

// //     // Format start time
// //     const startTimeString = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;

// //     // End time is 30 mins after start time
// //     const endHour = startMinute === 30 ? startHour + 1 : startHour;
// //     const endMinute = startMinute === 30 ? 0 : 30;
// //     const endTimeString = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;

// //     appointments.push({
// //       id: `appointment-${i}`,
// //       doctorId,
// //       patientName: `Patient ${i + 1}`,
// //       date: dateString,
// //       startTime: startTimeString,
// //       endTime: endTimeString,
// //       status: 'scheduled',
// //       description: 'คิวนัดตรวจฟัน',
// //     });
// //   }

// //   return appointments;
// // };

// const generateMockAppointments = (): Appointment[] => {
//   const appointments: Appointment[] = [];
//   const today = new Date();

//   // สร้างตัวแปรเพื่อเก็บข้อมูลเวลาที่ถูกจองแล้วของแต่ละหมอในแต่ละวัน
//   // โครงสร้าง: { 'วันที่-รหัสหมอ': Set ของเวลาที่ถูกจองแล้ว (ในรูปแบบนาที) }
//   const bookedTimeSlots: Record<string, Set<number>> = {};

//   // ฟังก์ชันช่วยตรวจสอบว่าช่วงเวลานั้นว่างหรือไม่
//   const isTimeSlotAvailable = (
//     dateStr: string,
//     doctorId: string,
//     startHour: number,
//     startMinute: number,
//     endHour: number,
//     endMinute: number
//   ): boolean => {
//     const key = `${dateStr}-${doctorId}`;

//     if (!bookedTimeSlots[key]) {
//       bookedTimeSlots[key] = new Set<number>();
//     }

//     // แปลงเวลาเริ่มต้นและสิ้นสุดเป็นนาที (นับจากเริ่มวัน)
//     const startTimeInMinutes = startHour * 60 + startMinute;
//     const endTimeInMinutes = endHour * 60 + endMinute;

//     // ตรวจสอบว่ามีนาทีใดในช่วงเวลานี้ถูกจองไปแล้วหรือไม่
//     for (let minute = startTimeInMinutes; minute < endTimeInMinutes; minute += 5) {
//       if (bookedTimeSlots[key].has(minute)) {
//         return false; // พบว่ามีการจองในช่วงเวลานี้แล้ว
//       }
//     }

//     return true; // ช่วงเวลานี้ว่าง
//   };

//   // ฟังก์ชันช่วยบันทึกเวลาที่ถูกจอง
//   const bookTimeSlot = (
//     dateStr: string,
//     doctorId: string,
//     startHour: number,
//     startMinute: number,
//     endHour: number,
//     endMinute: number
//   ): void => {
//     const key = `${dateStr}-${doctorId}`;

//     if (!bookedTimeSlots[key]) {
//       bookedTimeSlots[key] = new Set<number>();
//     }

//     // แปลงเวลาเริ่มต้นและสิ้นสุดเป็นนาที (นับจากเริ่มวัน)
//     const startTimeInMinutes = startHour * 60 + startMinute;
//     const endTimeInMinutes = endHour * 60 + endMinute;

//     // บันทึกทุกนาทีในช่วงเวลาที่จอง (ทุก 5 นาที เพื่อประหยัด memory)
//     for (let minute = startTimeInMinutes; minute < endTimeInMinutes; minute += 5) {
//       bookedTimeSlots[key].add(minute);
//     }
//   };

//   // สร้างข้อมูลสำหรับการนัดทั่วไป (นัด 30 นาที)
//   for (let day = 0; day < 30; day++) {
//     const date = addDays(today, day);
//     const dateString = format(date, 'yyyy-MM-dd');

//     // สร้างการนัดแบบสุ่ม 5-10 นัดต่อวัน
//     const numAppointments = 5 + Math.floor(Math.random() * 6);

//     for (let i = 0; i < numAppointments; i++) {
//       // พยายามหาช่วงเวลาที่ว่างไม่เกิน 10 ครั้ง
//       let attempts = 0;
//       let appointmentCreated = false;

//       while (attempts < 10 && !appointmentCreated) {
//         const doctorId = mockDoctors[Math.floor(Math.random() * mockDoctors.length)].id;
//         const startHour = 8 + Math.floor(Math.random() * 8); // Between 8 AM and 4 PM
//         const startMinute = Math.random() > 0.5 ? 0 : 30; // Either 0 or 30 minutes

//         // End time is 30 mins after start time
//         const endHour = startMinute === 30 ? startHour + 1 : startHour;
//         const endMinute = startMinute === 30 ? 0 : 30;

//         if (isTimeSlotAvailable(dateString, doctorId, startHour, startMinute, endHour, endMinute)) {
//           // Format start and end time
//           const startTimeString = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
//           const endTimeString = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;

//           appointments.push({
//             id: `appointment-${appointments.length}`,
//             doctorId,
//             patientName: `Patient ${appointments.length + 1}`,
//             date: dateString,
//             startTime: startTimeString,
//             endTime: endTimeString,
//             status: 'scheduled',
//             description: 'คิวนัดตรวจฟัน',
//           });

//           // บันทึกช่วงเวลาที่ถูกจองแล้ว
//           bookTimeSlot(dateString, doctorId, startHour, startMinute, endHour, endMinute);
//           appointmentCreated = true;
//         }

//         attempts++;
//       }
//     }
//   }

//   // สร้างการนัดที่ตรงกันพอดี (นัดยาว 1 ชั่วโมง สำหรับหมอหลายคน)
//   const specialDays = [1, 3, 5, 7, 10, 12, 15, 18, 20, 25]; // วันที่จะมีการนัดพิเศษ

//   for (const dayOffset of specialDays) {
//     const date = addDays(today, dayOffset);
//     const dateString = format(date, 'yyyy-MM-dd');

//     // เลือกเวลาที่จะมีการนัดพิเศษ - เช่น 9:00, 12:00, 15:00
//     const specialHours = [9, 12, 15];

//     for (const hour of specialHours) {
//       // เลือกหมอ 2-4 คนที่จะมีการนัดในเวลาเดียวกัน
//       const numDoctors = 2 + Math.floor(Math.random() * 3);
//       const doctorIndices: number[] = [];

//       // เลือกหมอไม่ซ้ำกันและต้องว่างในช่วงเวลานั้น
//       const availableDoctorIndices = mockDoctors
//         .map((_, index) => index)
//         .filter(index => {
//           const doctorId = mockDoctors[index].id;
//           return isTimeSlotAvailable(dateString, doctorId, hour, 0, hour + 1, 0);
//         });

//       // สลับลำดับหมอแบบสุ่ม
//       availableDoctorIndices.sort(() => Math.random() - 0.5);

//       // เลือกจำนวนหมอตามที่ต้องการหรือเท่าที่มี
//       const selectedDoctorIndices = availableDoctorIndices.slice(0, numDoctors);

//       // สร้างการนัดสำหรับแต่ละหมอ ในเวลาเดียวกัน (นัดยาว 1 ชั่วโมง)
//       for (const doctorIdx of selectedDoctorIndices) {
//         const doctorId = mockDoctors[doctorIdx].id;
//         const startTimeString = `${hour.toString().padStart(2, '0')}:00`;
//         const endTimeString = `${(hour + 1).toString().padStart(2, '0')}:00`;

//         appointments.push({
//           id: `appointment-${appointments.length}`,
//           doctorId,
//           patientName: `VIP Patient ${appointments.length + 1}`,
//           date: dateString,
//           startTime: startTimeString,
//           endTime: endTimeString,
//           status: 'scheduled',
//           description: 'คิวนัดตรวจพิเศษ (1 ชั่วโมง)',
//         });

//         // บันทึกช่วงเวลาที่ถูกจองแล้ว
//         bookTimeSlot(dateString, doctorId, hour, 0, hour + 1, 0);
//       }
//     }
//   }

//   // สร้างการนัดต่อเนื่องกันสำหรับหมอบางคน (เพื่อทดสอบฟีเจอร์ merge)
//   const consecutiveAppointmentDays = [2, 6, 9, 13, 17, 22, 28]; // วันที่จะมีการนัดต่อเนื่อง

//   for (const dayOffset of consecutiveAppointmentDays) {
//     const date = addDays(today, dayOffset);
//     const dateString = format(date, 'yyyy-MM-dd');

//     // เลือกหมอ 2-3 คนที่จะมีการนัดต่อเนื่อง
//     const numDoctors = 2 + Math.floor(Math.random() * 2);

//     for (let doctorIndex = 0; doctorIndex < numDoctors; doctorIndex++) {
//       const doctorId = mockDoctors[Math.floor(Math.random() * mockDoctors.length)].id;

//       // เลือกเวลาเริ่มต้นสำหรับการนัดต่อเนื่อง
//       const startHour = 10 + Math.floor(Math.random() * 4); // Between 10 AM and 1 PM
//       let currentStartHour = startHour;
//       let currentStartMinute = 0;

//       // สร้างการนัดต่อเนื่อง 2-3 นัดติดกัน
//       const numConsecutiveAppointments = 2 + Math.floor(Math.random() * 2);

//       for (let i = 0; i < numConsecutiveAppointments; i++) {
//         // แต่ละนัดใช้เวลา 30 นาที
//         let currentEndHour = currentStartMinute === 30 ? currentStartHour + 1 : currentStartHour;
//         let currentEndMinute = currentStartMinute === 30 ? 0 : 30;

//         // ตรวจสอบว่าช่วงเวลานี้ว่างหรือไม่
//         if (isTimeSlotAvailable(dateString, doctorId, currentStartHour, currentStartMinute, currentEndHour, currentEndMinute)) {
//           const startTimeString = `${currentStartHour.toString().padStart(2, '0')}:${currentStartMinute.toString().padStart(2, '0')}`;
//           const endTimeString = `${currentEndHour.toString().padStart(2, '0')}:${currentEndMinute.toString().padStart(2, '0')}`;

//           appointments.push({
//             id: `appointment-${appointments.length}`,
//             doctorId,
//             patientName: `K.Patient ${i + 1}`,
//             date: dateString,
//             startTime: startTimeString,
//             endTime: endTimeString,
//             status: 'scheduled',
//             description: 'คิวนัดต่อเนื่อง',
//           });

//           // บันทึกช่วงเวลาที่ถูกจองแล้ว
//           bookTimeSlot(dateString, doctorId, currentStartHour, currentStartMinute, currentEndHour, currentEndMinute);

//           // เลื่อนเวลาเริ่มต้นไปที่เวลาสิ้นสุดของการนัดปัจจุบัน (เพื่อสร้างการนัดต่อเนื่อง)
//           currentStartHour = currentEndHour;
//           currentStartMinute = currentEndMinute;
//         } else {
//           // ถ้าช่วงเวลานี้ไม่ว่าง ให้ข้ามไป
//           break;
//         }
//       }
//     }
//   }

//   return appointments;
// };

// export const useCalendarStore = defineStore('calendar', {
//   state: (): CalendarState => ({
//     doctors: mockDoctors,
//     appointments: generateMockAppointments(),
//     selectedDate: format(new Date(), 'yyyy-MM-dd'),
//     currentView: 'day',
//     filteredDoctors: mockDoctors.map(doctor => doctor.id), // Initially show all doctors
//   }),

//   getters: {
//     getDoctor: (state) => (doctorId: string) => {
//       return state.doctors.find(doctor => doctor.id === doctorId);
//     },

//     getFilteredDoctors: (state) => {
//       return state.doctors.filter(doctor => state.filteredDoctors.includes(doctor.id));
//     },

//     getDailyAppointments: (state) => (date: string) => {
//       return state.appointments.filter(appointment => 
//         appointment.date === date && 
//         state.filteredDoctors.includes(appointment.doctorId)
//       );
//     },

//     getWeeklyAppointments: (state) => {
//       const selectedDate = parseISO(state.selectedDate);
//       const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Week starts on Monday
//       const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });

//       const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

//       return daysInWeek.map(day => {
//         const formattedDate = format(day, 'yyyy-MM-dd');
//         return {
//           date: formattedDate,
//           dayOfWeek: format(day, 'EEE'),
//           dayOfMonth: format(day, 'd'),
//           appointments: state.appointments.filter(appointment => 
//             appointment.date === formattedDate && 
//             state.filteredDoctors.includes(appointment.doctorId)
//           )
//         };
//       });
//     },

//     getMonthlyAppointments: (state) => {
//       // This would return a structure for the month view
//       // Implementation would be similar to weekly but with a month range
//       return [];
//     },

//     getUpcomingAppointments: (state) => {
//       const today = format(new Date(), 'yyyy-MM-dd');
//       return state.appointments
//         .filter(appointment => 
//           appointment.date >= today && 
//           state.filteredDoctors.includes(appointment.doctorId)
//         )
//         .sort((a, b) => {
//           // Sort by date and time
//           if (a.date !== b.date) return a.date.localeCompare(b.date);
//           return a.startTime.localeCompare(b.startTime);
//         })
//         .slice(0, 10); // Get only the next 10 appointments
//     }
//   },

//   actions: {
//     setCurrentView(view: CalendarViewType) {
//       this.currentView = view;
//     },

//     setSelectedDate(date: string) {
//       this.selectedDate = date;
//     },

//     toggleDoctorFilter(doctorId: string) {
//       if (this.filteredDoctors.includes(doctorId)) {
//         this.filteredDoctors = this.filteredDoctors.filter(id => id !== doctorId);
//       } else {
//         this.filteredDoctors.push(doctorId);
//       }
//     },

//     resetDoctorFilters() {
//       this.filteredDoctors = this.doctors.map(doctor => doctor.id);
//     },

//     async createAppointment(appointment: Omit<Appointment, 'id'>) {
//       // In a real app, this would make an API call
//       const newAppointment: Appointment = {
//         ...appointment,
//         id: `appointment-${Date.now()}`,
//       };

//       this.appointments.push(newAppointment);
//       return newAppointment;
//     },

//     async updateAppointment(appointment: Appointment) {
//       // In a real app, this would make an API call
//       const index = this.appointments.findIndex(a => a.id === appointment.id);
//       if (index !== -1) {
//         this.appointments[index] = appointment;
//       }
//     },

//     async deleteAppointment(appointmentId: string) {
//       // In a real app, this would make an API call
//       this.appointments = this.appointments.filter(a => a.id !== appointmentId);
//     },

//     // This would be replaced with an API call in a real app
//     async fetchAppointments() {
//       // Simulate API call
//       return new Promise<void>((resolve) => {
//         setTimeout(() => {
//           this.appointments = generateMockAppointments();
//           resolve();
//         }, 500);
//       });
//     }
//   }
// });

import { defineStore } from 'pinia';
import type { CalendarState, Appointment, Doctor, CalendarViewType } from '~/types/calendar';
import { format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval, addDays, isSameDay } from 'date-fns';

// Mock data for initial store state
const mockDoctors: Doctor[] = [
  { id: 'ice', name: 'Doctor Ice', color: 'bg-blue-100', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random().toString(36).substring(2,%208)}' },
  { id: 'aric', name: 'Doctor Aric', color: 'bg-teal-100', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random().toString(36).substring(2,%208)}' },
  { id: 'pob', name: 'Doctor Pob', color: 'bg-yellow-100', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random().toString(36).substring(2,%208)}' },
  { id: 'pong', name: 'Doctor Pong', color: 'bg-purple-100', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random().toString(36).substring(2,%208)}' },
  { id: 'jane', name: 'Doctor Jane', color: 'bg-pink-100', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random().toString(36).substring(2,%208)}' },
  { id: 'meen', name: 'Doctor Meen', color: 'bg-sky-100', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random().toString(36).substring(2,%208)}' },
];

const generateManualAppointments = (): Appointment[] => {
  // สร้างวันที่สำหรับ 7 วันต่อจากวันนี้
  const today = new Date();
  const dates: string[] = [];

  for (let i = 0; i < 10; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(format(date, 'yyyy-MM-dd'));
  }

  // วันที่ในตัวแปร
  const todayStr = dates[0];
  const tomorrowStr = dates[1];
  const day3 = dates[2];
  const day4 = dates[3];
  const day5 = dates[4];
  const day6 = dates[5];
  const day7 = dates[6];
  const day8 = dates[7];
  const day9 = dates[8];
  const day10 = dates[9];
  // สร้างข้อมูล appointments
  return [
    // --- วันนี้ ---

    // Doctor Aric - 2 appointments back-to-back
    {
      id: 'app-1',
      doctorId: 'aric',
      patientName: 'Patient 1',
      date: todayStr,
      startTime: '09:00',
      endTime: '09:30',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },
    {
      id: 'app-2',
      doctorId: 'aric',
      patientName: 'Patient 2',
      date: todayStr,
      startTime: '09:30',
      endTime: '10:00',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },

    // Doctor Jane - 2 appointments back-to-back
    {
      id: 'app-3',
      doctorId: 'jane',
      patientName: 'Patient 3',
      date: todayStr,
      startTime: '11:00',
      endTime: '11:30',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },
    {
      id: 'app-4',
      doctorId: 'jane',
      patientName: 'Patient 4',
      date: todayStr,
      startTime: '11:30',
      endTime: '12:00',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },

    // Doctor Meen - 3 appointments back-to-back
    {
      id: 'app-5',
      doctorId: 'meen',
      patientName: 'Patient 5',
      date: todayStr,
      startTime: '13:00',
      endTime: '13:30',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },
    {
      id: 'app-6',
      doctorId: 'meen',
      patientName: 'Patient 6',
      date: todayStr,
      startTime: '13:30',
      endTime: '14:00',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },
    {
      id: 'app-7',
      doctorId: 'meen',
      patientName: 'Patient 7',
      date: todayStr,
      startTime: '14:00',
      endTime: '14:30',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },

    // Doctor Pob - non-consecutive appointments
    {
      id: 'app-8',
      doctorId: 'pob',
      patientName: 'Patient 8',
      date: todayStr,
      startTime: '10:00',
      endTime: '10:30',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },
    {
      id: 'app-9',
      doctorId: 'pob',
      patientName: 'Patient 9',
      date: todayStr,
      startTime: '11:00',
      endTime: '11:30',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },

    // Doctor Pong - odd time appointment that spans an hour boundary
    {
      id: 'app-10',
      doctorId: 'pong',
      patientName: 'Patient 10',
      date: todayStr,
      startTime: '09:45',
      endTime: '10:15',
      status: 'scheduled',
      description: 'คิวนัดตรวจพิเศษ',
    },

    // Doctor Ice - 4 consecutive appointments
    {
      id: 'app-11',
      doctorId: 'ice',
      patientName: 'Patient 11',
      date: todayStr,
      startTime: '15:00',
      endTime: '15:30',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },
    {
      id: 'app-12',
      doctorId: 'ice',
      patientName: 'Patient 12',
      date: todayStr,
      startTime: '15:30',
      endTime: '16:00',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },
    {
      id: 'app-13',
      doctorId: 'ice',
      patientName: 'Patient 13',
      date: todayStr,
      startTime: '16:00',
      endTime: '16:30',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },
    {
      id: 'app-14',
      doctorId: 'ice',
      patientName: 'Patient 14',
      date: todayStr,
      startTime: '16:30',
      endTime: '17:00',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },

    // --- วันพรุ่งนี้ ---

    // Doctor Aric - 2 appointments back-to-back
    {
      id: 'app-15',
      doctorId: 'aric',
      patientName: 'Patient 15',
      date: tomorrowStr,
      startTime: '10:00',
      endTime: '10:30',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },
    {
      id: 'app-16',
      doctorId: 'aric',
      patientName: 'Patient 16',
      date: tomorrowStr,
      startTime: '10:30',
      endTime: '11:00',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },

    // Doctor Meen - 2 appointments back-to-back
    {
      id: 'app-17',
      doctorId: 'meen',
      patientName: 'Patient 17',
      date: tomorrowStr,
      startTime: '13:00',
      endTime: '13:30',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },
    {
      id: 'app-18',
      doctorId: 'meen',
      patientName: 'Patient 18',
      date: tomorrowStr,
      startTime: '13:30',
      endTime: '14:00',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },

    // Doctor Jane - appointments with a gap
    {
      id: 'app-19',
      doctorId: 'jane',
      patientName: 'Patient 19',
      date: tomorrowStr,
      startTime: '09:00',
      endTime: '09:30',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },
    {
      id: 'app-20',
      doctorId: 'jane',
      patientName: 'Patient 20',
      date: tomorrowStr,
      startTime: '10:00',
      endTime: '10:30',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },

    // Doctor Pob - odd time spanning two hours
    {
      id: 'app-21',
      doctorId: 'pob',
      patientName: 'VIP Patient 1',
      date: tomorrowStr,
      startTime: '14:15',
      endTime: '15:45',
      status: 'scheduled',
      description: 'คิวนัดตรวจพิเศษ (90 นาที)',
    },

    // Doctor Ice - multiple appointments throughout the day
    {
      id: 'app-22',
      doctorId: 'ice',
      patientName: 'Patient 22',
      date: tomorrowStr,
      startTime: '08:30',
      endTime: '09:00',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },
    {
      id: 'app-23',
      doctorId: 'ice',
      patientName: 'Patient 23',
      date: tomorrowStr,
      startTime: '11:00',
      endTime: '11:30',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },
    {
      id: 'app-24',
      doctorId: 'ice',
      patientName: 'Patient 24',
      date: tomorrowStr,
      startTime: '15:00',
      endTime: '15:30',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },

    // --- วันที่ 3 ---

    // Doctor Pob - 2 appointments back-to-back
    {
      id: 'app-25',
      doctorId: 'pob',
      patientName: 'Patient 25',
      date: day3,
      startTime: '14:00',
      endTime: '14:30',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },
    {
      id: 'app-26',
      doctorId: 'pob',
      patientName: 'Patient 26',
      date: day3,
      startTime: '14:30',
      endTime: '15:00',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },

    // Doctor Pong - 3 appointments back-to-back
    {
      id: 'app-27',
      doctorId: 'pong',
      patientName: 'Patient 27',
      date: day3,
      startTime: '10:00',
      endTime: '10:30',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },
    {
      id: 'app-28',
      doctorId: 'pong',
      patientName: 'Patient 28',
      date: day3,
      startTime: '10:30',
      endTime: '11:00',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },
    {
      id: 'app-29',
      doctorId: 'pong',
      patientName: 'Patient 29',
      date: day3,
      startTime: '11:00',
      endTime: '11:30',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },

    // --- วันที่ 4 ---

    // Doctor Jane - all day appointments
    {
      id: 'app-30',
      doctorId: 'jane',
      patientName: 'Patient 30',
      date: day4,
      startTime: '09:00',
      endTime: '09:30',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },
    {
      id: 'app-31',
      doctorId: 'jane',
      patientName: 'Patient 31',
      date: day4,
      startTime: '09:30',
      endTime: '10:00',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },
    {
      id: 'app-32',
      doctorId: 'jane',
      patientName: 'Patient 32',
      date: day4,
      startTime: '10:30',
      endTime: '11:00',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },
    {
      id: 'app-33',
      doctorId: 'jane',
      patientName: 'Patient 33',
      date: day4,
      startTime: '11:00',
      endTime: '11:30',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },
    {
      id: 'app-34',
      doctorId: 'jane',
      patientName: 'Patient 34',
      date: day4,
      startTime: '13:00',
      endTime: '13:30',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },
    {
      id: 'app-35',
      doctorId: 'jane',
      patientName: 'Patient 35',
      date: day4,
      startTime: '14:00',
      endTime: '14:30',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },
    {
      id: 'app-36',
      doctorId: 'jane',
      patientName: 'Patient 36',
      date: day4,
      startTime: '14:30',
      endTime: '15:00',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },

    // Doctor Aric - long appointment
    {
      id: 'app-37',
      doctorId: 'aric',
      patientName: 'VIP Patient 2',
      date: day4,
      startTime: '10:00',
      endTime: '12:00',
      status: 'scheduled',
      description: 'คิวนัดตรวจพิเศษ (2 ชั่วโมง)',
    },

    // --- วันที่ 5 ---

    // Doctor Ice - 5 consecutive appointments
    {
      id: 'app-38',
      doctorId: 'ice',
      patientName: 'Patient 38',
      date: day5,
      startTime: '09:00',
      endTime: '09:30',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },
    {
      id: 'app-39',
      doctorId: 'ice',
      patientName: 'Patient 39',
      date: day5,
      startTime: '09:30',
      endTime: '10:00',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },
    {
      id: 'app-40',
      doctorId: 'ice',
      patientName: 'Patient 40',
      date: day5,
      startTime: '10:00',
      endTime: '10:30',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },
    {
      id: 'app-41',
      doctorId: 'ice',
      patientName: 'Patient 41',
      date: day5,
      startTime: '10:30',
      endTime: '11:00',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },
    {
      id: 'app-42',
      doctorId: 'ice',
      patientName: 'Patient 42',
      date: day5,
      startTime: '11:00',
      endTime: '11:30',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },

    // Multiple doctors in the same hour
    {
      id: 'app-43',
      doctorId: 'aric',
      patientName: 'Patient 43',
      date: day5,
      startTime: '13:00',
      endTime: '13:30',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },
    {
      id: 'app-44',
      doctorId: 'jane',
      patientName: 'Patient 44',
      date: day5,
      startTime: '13:00',
      endTime: '13:30',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },
    {
      id: 'app-45',
      doctorId: 'pob',
      patientName: 'Patient 45',
      date: day5,
      startTime: '13:00',
      endTime: '13:30',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },
    {
      id: 'app-46',
      doctorId: 'pong',
      patientName: 'Patient 46',
      date: day5,
      startTime: '13:00',
      endTime: '13:30',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },
    {
      id: 'app-47',
      doctorId: 'meen',
      patientName: 'Patient 47',
      date: day5,
      startTime: '13:00',
      endTime: '13:30',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },

    // --- วันที่ 6 ---

    // Doctor Meen - multiple short appointments all day
    {
      id: 'app-48',
      doctorId: 'meen',
      patientName: 'Patient 48',
      date: day6,
      startTime: '09:00',
      endTime: '09:30',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },
    {
      id: 'app-49',
      doctorId: 'meen',
      patientName: 'Patient 49',
      date: day6,
      startTime: '10:00',
      endTime: '10:30',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },
    {
      id: 'app-50',
      doctorId: 'meen',
      patientName: 'Patient 50',
      date: day6,
      startTime: '11:00',
      endTime: '11:30',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },
    {
      id: 'app-51',
      doctorId: 'meen',
      patientName: 'Patient 51',
      date: day6,
      startTime: '13:00',
      endTime: '13:30',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },
    {
      id: 'app-52',
      doctorId: 'meen',
      patientName: 'Patient 52',
      date: day6,
      startTime: '14:00',
      endTime: '14:30',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },
    {
      id: 'app-53',
      doctorId: 'meen',
      patientName: 'Patient 53',
      date: day6,
      startTime: '15:00',
      endTime: '15:30',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },
    {
      id: 'app-54',
      doctorId: 'meen',
      patientName: 'Patient 54',
      date: day6,
      startTime: '16:00',
      endTime: '16:30',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },

    // --- วันที่ 7 ---

    // Each doctor has at least one appointment
    {
      id: 'app-55',
      doctorId: 'aric',
      patientName: 'Patient 55',
      date: day7,
      startTime: '09:00',
      endTime: '09:30',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },
    {
      id: 'app-56',
      doctorId: 'jane',
      patientName: 'Patient 56',
      date: day7,
      startTime: '10:00',
      endTime: '10:30',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },
    {
      id: 'app-57',
      doctorId: 'pob',
      patientName: 'Patient 57',
      date: day7,
      startTime: '11:00',
      endTime: '11:30',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },
    {
      id: 'app-58',
      doctorId: 'pong',
      patientName: 'Patient 58',
      date: day7,
      startTime: '13:00',
      endTime: '13:30',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },
    {
      id: 'app-59',
      doctorId: 'meen',
      patientName: 'Patient 59',
      date: day7,
      startTime: '14:00',
      endTime: '14:30',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },
    {
      id: 'app-60',
      doctorId: 'ice',
      patientName: 'Patient 60',
      date: day7,
      startTime: '15:00',
      endTime: '15:30',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },

    // ตัวอย่างการนัดหมายที่มีเวลาไม่ปกติ
    {
      id: 'app-61',
      doctorId: 'aric',
      patientName: 'VIP Patient 3',
      date: day7,
      startTime: '11:45',
      endTime: '12:45',
      status: 'scheduled',
      description: 'คิวนัดตรวจพิเศษ (1 ชั่วโมง)',
    },

    // 2 การนัดหมายต่อเนื่องกัน
    {
      id: 'app-62',
      doctorId: 'jane',
      patientName: 'Patient 62',
      date: day7,
      startTime: '15:00',
      endTime: '15:30',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },
    {
      id: 'app-63',
      doctorId: 'jane',
      patientName: 'Patient 63',
      date: day7,
      startTime: '15:30',
      endTime: '16:00',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },
    {
      id: 'app-64',
      doctorId: 'jane',
      patientName: 'Patient 64',
      date: day10,
      startTime: '10:00',
      endTime: '11:00',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },
    {
      id: 'app-65',
      doctorId: 'jane',
      patientName: 'Patient 65',
      date: day10,
      startTime: '11:00',
      endTime: '12:00',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },
    {
      id: 'app-66',
      doctorId: 'jane',
      patientName: 'Patient 66',
      date: day10,
      startTime: '12:00',
      endTime: '13:00',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },
    {
      id: 'app-67',
      doctorId: 'jane',
      patientName: 'Patient 67',
      date: day10,
      startTime: '13:00',
      endTime: '14:00',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน',
    },
  ];
};

export const useCalendarStore = defineStore('calendar', {
  state: (): CalendarState => ({
    doctors: mockDoctors,
    appointments: generateManualAppointments(), // ใช้ข้อมูลแบบ manual แทน
    selectedDate: format(new Date(), 'yyyy-MM-dd'),
    currentView: 'day',
    filteredDoctors: mockDoctors.map(doctor => doctor.id), // Initially show all doctors
  }),

  getters: {
    getDoctor: (state) => (doctorId: string) => {
      return state.doctors.find(doctor => doctor.id === doctorId);
    },

    getFilteredDoctors: (state) => {
      return state.doctors.filter(doctor => state.filteredDoctors.includes(doctor.id));
    },

    getDailyAppointments: (state) => (date: string) => {
      return state.appointments.filter(appointment =>
        appointment.date === date &&
        state.filteredDoctors.includes(appointment.doctorId)
      );
    },

    getWeeklyAppointments: (state) => {
      const selectedDate = parseISO(state.selectedDate);
      const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Week starts on Monday
      const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });

      const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

      return daysInWeek.map(day => {
        const formattedDate = format(day, 'yyyy-MM-dd');
        return {
          date: formattedDate,
          dayOfWeek: format(day, 'EEE'),
          dayOfMonth: format(day, 'd'),
          appointments: state.appointments.filter(appointment =>
            appointment.date === formattedDate &&
            state.filteredDoctors.includes(appointment.doctorId)
          )
        };
      });
    },

    getMonthlyAppointments: (state) => {
      // This would return a structure for the month view
      // Implementation would be similar to weekly but with a month range
      return [];
    },

    getUpcomingAppointments: (state) => {
      const today = format(new Date(), 'yyyy-MM-dd');
      return state.appointments
        .filter(appointment =>
          appointment.date >= today &&
          state.filteredDoctors.includes(appointment.doctorId)
        )
        .sort((a, b) => {
          // Sort by date and time
          if (a.date !== b.date) return a.date.localeCompare(b.date);
          return a.startTime.localeCompare(b.startTime);
        })
        .slice(0, 10); // Get only the next 10 appointments
    }
  },

  actions: {
    setCurrentView(view: CalendarViewType) {
      this.currentView = view;
    },

    setSelectedDate(date: string) {
      this.selectedDate = date;
    },

    toggleDoctorFilter(doctorId: string) {
      if (this.filteredDoctors.includes(doctorId)) {
        this.filteredDoctors = this.filteredDoctors.filter(id => id !== doctorId);
      } else {
        this.filteredDoctors.push(doctorId);
      }
    },

    resetDoctorFilters() {
      this.filteredDoctors = this.doctors.map(doctor => doctor.id);
    },

    async createAppointment(appointment: Omit<Appointment, 'id'>) {
      // In a real app, this would make an API call
      const newAppointment: Appointment = {
        ...appointment,
        id: `appointment-${Date.now()}`,
      };

      this.appointments.push(newAppointment);
      return newAppointment;
    },

    async updateAppointment(appointment: Appointment) {
      // In a real app, this would make an API call
      const index = this.appointments.findIndex(a => a.id === appointment.id);
      if (index !== -1) {
        this.appointments[index] = appointment;
      }
    },

    async deleteAppointment(appointmentId: string) {
      // In a real app, this would make an API call
      this.appointments = this.appointments.filter(a => a.id !== appointmentId);
    },

    // This would be replaced with an API call in a real app
    async fetchAppointments() {
      // Simulate API call
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          this.appointments = generateManualAppointments(); // ใช้ข้อมูลแบบ manual แทน
          resolve();
        }, 500);
      });
    }
  }
});