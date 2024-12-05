<script setup>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import koLocale from '@fullcalendar/core/locales/ko'
import bootstrapPlugin from '@fullcalendar/bootstrap'
import "@/styles/fullcalendar.css";
import { useAPI } from "@/axios/useAPI.js";
import {onMounted, ref} from "vue";

const { get } = useAPI()

const handleDayCellContent = arg => {
  return arg.date.getDate();
};

const fetchSchedules = async () => {
  try {
    const response = await get('/hosts/schedules');
    const schedules = response.data.data;
    const events = schedules.map(schedule => {
      return {
        title: schedule.courseTitle,
        start: schedule.startTime,
        end: schedule.endTime,
      };
    });
    calendarOptions.value.events = events;
  } catch (error) {
    console.log(error);
  }
}

onMounted(() => {
  fetchSchedules();
})

const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin, bootstrapPlugin],
  initialView: 'dayGridMonth',
  locale: koLocale,
  headerToolbar: {
    start: 'prev,next',
    center: 'title',
    end: 'dayGridMonth,dayGridWeek,dayGridDay',
  },
  eventColor: '#378006',
  firstDay: 1, // 주의 첫 번째 날을 월요일로 설정
  navLinks: true,
  weekends: true,
  dayMaxEvents: true,
  themeSystem: 'bootstrap5',
  views: {
    dayGridMonth: {
      dayMaxEventRows: 3,
      buttonText: '월간'
    },
    dayGridWeek: {
      buttonText: '주간'
    },
    dayGridDay: {
      buttonText: '일간'
    }
  },
  dayCellContent: handleDayCellContent,
});

</script>

<template>
  <FullCalendar ref="fullCalendar" :options="calendarOptions" />
</template>

<style scoped>

</style>
