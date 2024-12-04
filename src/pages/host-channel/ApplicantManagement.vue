<script setup>
import { useRoute } from 'vue-router';
import { onMounted, ref } from "vue";
import { useAPI } from '@/axios/useAPI';
import { formatYMDString } from '@/util/DateFormatter';
import { formatLocalDateString, formatLocalTimeString, formatDateString } from '@/util/LocalDateTimeFormatter';
import {createPagingParam} from "@/util/PagingParam.js";
import PagingBar from "@/components/common/PagingBar.vue";
import { formatPhoneNumber } from '@/util/PhoneFormatter.js';

const route = useRoute();
const id = route.params.id;

console.log(id);

const { get } = useAPI();
const scheduledDateList = ref([]);
const selectedDate = ref(null);


const getDateAfterDays = day => {
  const date = new Date();
  return date.setDate(date.getDate() + day);
};

const startDate = ref(new Date());
const endDate = ref(getDateAfterDays(7));

const scheduleList = ref([]);
const scheduleId = ref(null);

onMounted(() => {
  fetchScheduledDate()
});

const fetchScheduledDate = async () => {
  const param = {
    startDate: startDate.value ? formatYMDString(startDate.value) : formatYMDString(new Date()),
    endDate: endDate.value ? formatYMDString(endDate.value) : formatYMDString(new Date()),
  }
  try {
    const response = await get(`/hosts/courses/${id}/scheduled-date`, param);

    scheduledDateList.value = response.data.data;
  } catch (error) {
    console.error('Failed to fetch Details', error);
  }
};

const fetchSchedules = async () => {
  if(selectedDate.value) {
    try {
      const response = await get(`/hosts/courses/${id}/schedules?date=${selectedDate.value}`);
      scheduleList.value = response.data.data;
    } catch (error) {
      console.error('Failed to fetch Details', error);
    }
  }
};

const status = ref(null);
const searchWord = ref('');
const pagingParam = ref({});
const applicantList = ref([]);

const fetchApplicantList = async (page) => {
  const param = {
    page: page ? page : 1,
    size: 10,
    status: status.value ? status.value : null,
    keyword: searchWord.value ? searchWord.value : null,
  };
  try {
    const response = await get(`/hosts/schedules/${scheduleId.value}/users`, param);
    pagingParam.value = createPagingParam(response.data);
    applicantList.value = response.data.data;
  } catch (error) {
    console.error('Failed to fetch Details', error);
  }
};

const clickSearchBtn = () => {
  if(scheduleId.value) {
    fetchApplicantList();
  } else {
    alert("클래스 일정을 선택해주세요.")
  }
};

const reloadPage = page => {
  fetchApplicantList(page, pagingParam.value.size);
};

const getStatusString = status => {
  switch (status) {
    case 'APPROVED':
      return '완료';
    case 'REJECTED':
      return '취소';
    default: return '';
  }
}
</script>

<template>
신청자 내역
<div class="filter-condition-area">

  <div class="row mb-3">
    <div class="col">
      <label class="form-label" for="scheduled-date-select">클래스 일정 날짜</label>
      <select class="form-select" v-model="selectedDate" @change="fetchSchedules" id="scheduled-date-select">
        <option :value="null" disabled>선택</option>
        <option v-for="(date, index) in scheduledDateList" :key="index" :value="formatLocalDateString(date)">{{ formatLocalDateString(date) }}</option>
      </select>
    </div>
    <div class="col">
      <label class="form-label" for="course-schedule-select">클래스 일정</label>
      <select class="form-select" v-model="scheduleId" id="course-schedule-select">
        <option :value="null" disabled>선택</option>
        <option v-for="(schedule, index) in scheduleList" :key="index" :value="schedule.id">{{ formatLocalTimeString(schedule.startTime) }} - {{ formatLocalTimeString(schedule.endTime)}}  (잔여 정원: {{ schedule.remainedNum }})</option>
      </select>
    </div>
  </div>
  <div class="row">
    <div class="col-2">
      <label class="form-label" for="status-select">신청 상태</label>
      <select class="form-select" v-model="status" id="status-select">
        <option :value="null">전체</option>
        <option value="APPROVED">완료</option>
        <option value="REJECTED">취소</option>
      </select>
    </div>
    <div class="col-3">
      <label class="form-label" for="applicant-name">신청자 이름</label>
      <input class="form-control" type="text" v-model.trim="searchWord" id="applicant-name">
    </div>
    <div class="col-1">
        <button class="btn search-btn" type="button" @click="clickSearchBtn">검색</button>
    </div>
  </div>

</div>
  <div class="applicant-list" v-if="applicantList.length > 0">
    <div class="applicant-table-container">
      <table class="table table-hover">
        <thead>
        <tr>
          <th>회원명</th>
          <th>회원 닉네임</th>
          <th>연락처</th>
          <th>인원(명)</th>
          <th>신청 일시</th>
          <th>상태</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(applicant, index) in applicantList" :key="index">
          <td>{{ applicant.userName }}</td>
          <td>{{ applicant.userNickname }}</td>
          <td>{{ formatPhoneNumber(applicant.userPhone) }}</td>
          <td>{{ applicant.participantNum }}</td>
          <td>{{ formatDateString(applicant.requestDate) }}</td>
          <td>{{ getStatusString(applicant.status) }}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <PagingBar :paging-param="pagingParam" @change-page="reloadPage"></PagingBar>
  </div>
  <div v-else>
    <h6>검색 결과가 없습니다.</h6>
  </div>
</template>

<style scoped>
.filter-condition-area {
  padding: 3% 5%;
  background-color: rgb(239, 239, 239);
  border: none;
  margin-bottom: 20px;
}
.search-btn {
  width: 100px;
  background-color: #FF9300;
  color: white;
  margin-top: 30px
}
tr {
  text-align: center;
}
.applicant-table-container {
  min-height: 400px;
}
</style>
