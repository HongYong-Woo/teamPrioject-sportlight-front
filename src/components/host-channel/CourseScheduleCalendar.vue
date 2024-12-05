<script setup>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import koLocale from '@fullcalendar/core/locales/ko'
import bootstrapPlugin from '@fullcalendar/bootstrap'
import "@/styles/fullcalendar.css";
import { useAPI } from "@/axios/useAPI.js";
import {computed, onMounted, ref} from "vue";

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
  views: { // 특정 뷰에 대한 설정을 세부적으로 조정
    dayGridMonth: {
      dayMaxEventRows: 3, // 하루에 최대 3개의 이벤트 행 표시 (초과되는 건 +more 로 표시됨)
      buttonText: '월간' // 월간 뷰 버튼 텍스트 설정
    },
    dayGridWeek: {
      buttonText: '주간' // 주간 뷰 버튼 텍스트 설정
    },
    dayGridDay: {
      buttonText: '일간' // 일간 뷰 버튼 텍스트 설정
    }
  },
  dayCellContent: handleDayCellContent,
});


</script>

<template>
  {{ events }}
  <FullCalendar ref="fullCalendar" :options="calendarOptions" />
</template>

<style scoped>

</style>
