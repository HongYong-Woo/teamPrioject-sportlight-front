<script setup>
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import {computed, ref} from "vue";

const prop = defineProps({
  schedules: {
    type: Array,
    required: true,
    default: () => {
      return [];
    }
  }
})


const selectTab = ref("INDIVIDUAL");

const onChangeTap = () => {
  startTime.value = null;
  endTime.value = null;
  date.value = null;
  dateList.value = [];
};

const schedules = ref(prop.schedules);
const date = ref(null);
const dateList = ref([]);
const startTime = ref(null);
const endTime = ref(null);

const today = new Date();

const handleDate = (modelData) => {
  date.value = modelData ? modelData.toISOString().split('T')[0] : null;
};

const getDateString = computed(() => {
  if(!date.value) {
    return "날짜를 선택해주세요";
  }
  else {
    const temp = date.value.split('-');
    return `${temp[0]}년 ${temp[1]}월 ${temp[2]}일`;
  }
});

const registerSchedule = () => {
  if(!date.value) {
    alert("날짜를 선택해주세요");
    return;
  } else if(!startTime.value) {
    alert("시작 시간을 설정해주세요");
    return;
  } else if(!endTime.value) {
    alert("종료 시간을 설정해주세요");
    return;
  }
  const startTimeString = formatTimeString(startTime.value);
  const endTimeString = formatTimeString(endTime.value);
  if(startTimeString >= endTimeString) {
    alert("종료 시간은 시작 시간 이후로 설정해주세요");
    return;
  }
  schedules.value.push({
    'startTime': date.value + " " + startTimeString,
    'endTime': date.value + " " + endTimeString
  });
};

const registerScheduleList = () => {
  if(!dateList.value || dateList.value.length === 0) {
    alert("날짜를 선택해주세요");
    return;
  } else if(!startTime.value) {
    alert("시작 시간을 설정해주세요");
    return;
  } else if(!endTime.value) {
    alert("종료 시간을 설정해주세요");
    return;
  }
  const startTimeString = formatTimeString(startTime.value);
  const endTimeString = formatTimeString(endTime.value);
  if(startTimeString >= endTimeString) {
    alert("시작 시간은 종료 시간 이전으로 설정해주세요");
    return;
  }
  dateList.value.forEach(date => {
    let offset = date.getTimezoneOffset() * 60000; //ms단위라 60000곱해줌
    let dateOffset = new Date(date.getTime() - offset);
    schedules.value.push({
      'startTime': dateOffset.toISOString().split('T')[0] + " " + startTimeString,
      'endTime': dateOffset.toISOString().split('T')[0] + " " + endTimeString
    });
  });
};

const timeTable = computed(() => {
  if(schedules.value.length === 0) {
    return {};
  }
  schedules.value.sort((schedule1, schedule2) => {
    if (schedule1.startTime > schedule2.startTime) return 1;
    else if (schedule1.startTime < schedule2.startTime) return -1;
    else return 0;
  });
  return Object.groupBy(schedules.value, ({ startTime }) => startTime.split(' ')[0]);
});

const scheduleToTimeRange = schedule => {
  if(!schedule && !schedule.startTime && !schedule.endTime) {
    return '';
  }
  return `${schedule.startTime.split(' ')[1]} - ${schedule.endTime.split(' ')[1]}`;
};

const handleStartTime = (modelData) => {
  if(endTime.value === null) {
    endTime.value = modelData ? modelData : null;
  }
};

const formatTimeString = time => {
  return `${String(time.hours).padStart(2, '0')}:${String(time.minutes).padStart(2, '0')}`;
};

const removeSchedule = schedule => {
  schedules.value = schedules.value.filter((s) => s !== schedule);
}

</script>
<template>
  <div class="row">
    <div class="col">
      <div class="button-group" role="group">
        <input type="radio" id="individualBtn" class="btn-check" v-model="selectTab" value="INDIVIDUAL" autocomplete="off" @change="onChangeTap">
        <label class="btn btn-outline-secondary tap-btn" for="individualBtn">개별 등록</label>

        <input type="radio" id="cycleBtn" class="btn-check" v-model="selectTab" value="CYCLE" autocomplete="off" @change="onChangeTap">
        <label class="btn btn-outline-secondary tap-btn" for="cycleBtn">반복 등록</label>
      </div>
      <div v-show="selectTab === 'INDIVIDUAL'">
        <div class="datepicker-container">
          <Datepicker
              v-model="date"
              class="datetime-picker"
              locale="ko"
              :enableTimePicker="false"
              :autoApply="true"
              :inline="true"
              :minDate="today"
              :monthChangeOnScroll="false"
              @update:model-value="handleDate"
          />
        </div>
        <div class="mb-3">
          <div class="form-text text-muted">클래스 진행 날짜</div>
          <div class="select-date-box">
            {{ getDateString }}
          </div>
        </div>
        <div class="row mb-3">
          <div class="col">
            <div class="form-text text-muted">클래스 시작 시간</div>
            <Datepicker v-model="startTime" time-picker :autoApply="false" @update:model-value="handleStartTime"/>
          </div>
          <div class="col">
            <div class="form-text text-muted">클래스 종료 시간</div>
            <Datepicker v-model="endTime" time-picker :autoApply="false"/>
          </div>
        </div>
        <div class="text-end">
          <button type="button" class="btn add-btn" style="width: 100px" @click="registerSchedule">일정 추가</button>
        </div>
      </div>
      <div v-show="selectTab === 'CYCLE'">
        <div class="datepicker-container">
          <Datepicker
              multi-dates
              v-model="dateList"
              class="datetime-picker"
              locale="ko"
              :enableTimePicker="false"
              :autoApply="true"
              :inline="true"
              :minDate="today"
              :monthChangeOnScroll="false"
          />
        </div>
        <div class="mb-3">
          <div class="form-text text-muted">동일한 스케줄을 등록할 날짜를 다중 선택해주세요.</div>
          <div class="select-date-box">
            선택된 날짜: {{ dateList.length }}개
          </div>
        </div>
        <div class="row mb-3">
          <div class="col">
            <div class="form-text text-muted">클래스 시작 시간</div>
            <Datepicker v-model="startTime" time-picker :autoApply="false" @update:model-value="handleStartTime"/>
          </div>
          <div class="col">
            <div class="form-text text-muted">클래스 종료 시간</div>
            <Datepicker v-model="endTime" time-picker :autoApply="false"/>
          </div>
        </div>
        <div class="text-end">
          <button type="button" class="btn add-btn" style="width: 100px" @click="registerScheduleList">일정 추가</button>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="schedule-list-area">
        <div class="top-section">
          <div class="schedule-list-title" style="font-weight: bold">
            등록된 일정
          </div>
        </div>
        <div class="bottom-section">
          <div class="schedule-list-content">
            <div v-for="(date, index) in Object.keys(timeTable)" :key="index">
              <div class="schedule-date-area form-text">
                {{ date }}
              </div>
              <div v-for="(schedule, index) in timeTable[date]" :key="index">
                <div class="schedule-tag">
                  <div class="form-text" style="color: #1e1e1e">
                    {{ scheduleToTimeRange(schedule) }}
                  </div>
                  |
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-circle" viewBox="0 0 16 16" @click="removeSchedule(schedule)">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                      <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"/>
                    </svg>
                  </div>
                </div>
              </div>
              <hr>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.tap-btn {
  width: 50%;
  border-radius: 0;
}
.schedule-list-area {
  height: 580px;
  border: 2px solid #c4c4c4;
  border-radius: 10px;
  overflow-y: auto;
}
.top-section {
  height: 30px;
  margin-bottom: 20px;
}
.schedule-list-title{
  text-align: center;
  align-content: center;
  padding-top: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid #c4c4c4;
}
.schedule-date-area {
  font-weight: bold;
  padding-bottom: 10px;

}
.schedule-list-content{
  padding-left: 10px;
  padding-right: 10px;
}

.select-date-box {
  border: 1px solid #c4c4c4;
  border-radius: 5px;
  padding: 10px;
}
.schedule-tag {
  display: flex;
  justify-content: space-between;
  width: 150px;
  padding: 5px 12px;
  border-radius: 7px;
  margin-bottom: 5px;
  background-color: #ffd59d;
}
.bi-dash-circle {
  margin-bottom: 2px;
}
.dp__main > div {
  width: 500px;
}
.add-btn {
  color: #FF9300;
  border: #FF9300 solid 1px;
}
</style>
