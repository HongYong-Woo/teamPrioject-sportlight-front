<script setup>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import koLocale from '@fullcalendar/core/locales/ko'
import bootstrapPlugin from '@fullcalendar/bootstrap'
import "@/styles/fullcalendar.css";

const handleDayCellContent = arg => {
  return arg.date.getDate();
};

const calendarOptions = {
  plugins: [ dayGridPlugin, interactionPlugin, bootstrapPlugin ],
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
  events: [
    {
      title: 'All Day Event',
      start: '2024-01-01',
    },
    {
      title: 'Long Event',
      start: '2024-01-07',
      end: '2024-01-10'
    },
    {
      groupId: 999,
      title: 'Repeating Event',
      start: '2024-01-09T16:00:00'
    },
    {
      groupId: 999,
      title: 'Repeating Event',
      start: '2024-01-16T16:00:00'
    },
    {
      title: 'Conference',
      start: '2024-01-11',
      end: '2024-01-13'
    },
    {
      title: 'Meeting',
      start: '2024-01-12T10:30:00',
      end: '2024-01-12T12:30:00'
    },
    {
      title: 'Lunch',
      start: '2024-01-12T12:00:00'
    },
    {
      title: 'Meeting',
      start: '2024-01-12T14:30:00'
    },
    {
      title: 'Happy Hour',
      start: '2024-01-12T17:30:00'
    },
    {
      title: 'Dinner',
      start: '2024-01-12T20:00:00'
    },
    {
      title: 'Birthday Party',
      start: '2024-01-13T07:00:00'
    },
    {
      title: 'Click for Google',
      url: 'http://google.com/',
      start: '2024-01-28'
    }
  ]
};


</script>

<template>
  <FullCalendar ref="fullCalendar" :options="calendarOptions" />
</template>

<style scoped>

</style>
