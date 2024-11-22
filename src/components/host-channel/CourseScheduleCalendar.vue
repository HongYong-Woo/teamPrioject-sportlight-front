<script setup>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import koLocale from '@fullcalendar/core/locales/ko'
import bootstrapPlugin from '@fullcalendar/bootstrap'

const handleDayCellContent = arg => {
  return arg.date.getDate();
};

const calendarOptions = {
  plugins: [ dayGridPlugin, interactionPlugin, bootstrapPlugin ],
  initialView: 'dayGridMonth',
  locale: koLocale,
  headerToolbar: {
    start: 'prev,next today',
    center: 'title',
    end: 'dayGridMonth,dayGridWeek,dayGridDay',
  },
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
  eventColor: '#76c3c5', // 이벤트 기본 색상 설정
  eventTextColor: '#089196', // 이벤트 텍스트 색상 설정
  eventBackgroundColor: '#76c3c577', // 이벤트 배경 색상 설정
  eventBorderColor: '#76c3c5', // 이벤트 테두리 색상 설정
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

/* 달력부분 */

/* 일요일 날짜: 빨간색 */
.fc .fc-day-sun a {
  color: red;
}

/* 토요일 날짜: 파란색 */
.fc .fc-day-sat a {
  color: blue;
}

/* 제목 볼드 빼기 */
.fc .fc-toolbar-title {
  font-weight: normal;
}

/* 일정표 툴 바  */
.fc .fc-toolbar .fc-header-toolbar {
  margin: 0;
  padding: 0 40px;
  background-color: #76c3c5;
  height: 60px;

  font-size: 12px;
  line-height: 30px;
  color: white;
  border-radius: 20px 20px 0px 0px;
}

/* 툴바의 버튼 */
.fc .fc-toolbar-chunk .fc-button {
  background-color: transparent;
  border: none;
  font-size: 14px;
}

/* 툴바 사용 불가 버튼 스타일 */
.fc .fc-toolbar-chunk .fc-button:disabled {
  color: #e8e8e8;
}
/* 툴바 사용 불가 버튼 hover 시 스타일 주지 않기 */
.fc .fc-toolbar-chunk .fc-button:disabled:hover {
  background-color: transparent;
}

/* 툴바 버튼 포커스 시 그림자 제거 */
.fc .fc-toolbar-chunk .fc-button:focus {
  box-shadow: none;
}

/* 툴바 버튼 hover 시 배경색 변경 */
.fc .fc-toolbar-chunk .fc-button:hover {
  background-color: #87cdcf;
}

/* 날짜변경 화살표 아이콘 */
.fc .fc-button-primary span {
  font-weight: 500;
  font-size: 28px;
}

/* 요일의 높이 */
.fc-theme-standard th {
  height: 40px;
  background: #f5f5f5;
  border: 1px solid #e8e8e8;
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;
  color: #7b7b7b;
  vertical-align: middle;
}

/* Tody Cell에 배경색 주기 */
.fc .fc-daygrid-day.fc-day-today {
  background-color: #e6895724;
}

/* 날짜 Cell 프레임 */
.fc .fc-daygrid-day-frame {
  padding: 10px;
}

/* 월간,주간 view의 Cell이 시작하는 위치 */
.fc .fc-daygrid-day-top {
  flex-direction: row;
  height: 30px;
  margin-bottom: 3px;
}

/* 날짜 숫자 z-index 초기화 */
.fc .fc-daygrid-day-number {
  z-index: auto !important;
}

/* 이벤트 막대 스타일 */
.fc-event {
  padding: 5px 10px;
  margin-bottom: 5px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 14px;
}

</style>
