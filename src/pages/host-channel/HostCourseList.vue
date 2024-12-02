<script setup>
import router from "@/routers/index.js";
import { useAPI } from '@/axios/useAPI';
import {onMounted, ref} from "vue";
import CourseCard from "@/components/host-channel/CourseCard.vue";

const { get, patch } = useAPI();
const courseList = ref([]);
const fetchCourseList = async () => {
  try {
    const response = await get('/hosts/courses');
    courseList.value = response.data.data;
  } catch (error) {
    console.error('Failed to fetch Details', error);
  }
};

onMounted(() => {
  fetchCourseList();
});

const isVisible = ref(null);
const changeVisible = (id, value) => {
  if(value) {
    isVisible.value = id;
  } else {
    isVisible.value = null;
  }
};

const changeCourseStatus = async (course, request) => {
  try {
    switch (request) {
      case 'ACTIVE': {
        if (!confirm(`'${course.title}' 클래스를 활성화하시겠습니까?`)) return;
        await modifyCourseStatus(course.id, 'APPROVED');
        alert(`'${course.title}' 클래스가 활성화 되었습니다.`);
        break;
      }
      case 'DORMANCY': {
        if (!confirm(`'${course.title}' 클래스를 휴면 상태로 변경하시겠습니까?\n휴면 상태가 되면 목록에서 숨김 처리되고 수강 신청이 중지됩니다.\n휴면 상태의 클래스는 언제든지 활성화 상태로 변경할 수 있습니다.`)) return;
        await modifyCourseStatus(course.id, 'DORMANCY');
        alert(`'${course.title}' 클래스가 휴면 상태로 변경되었습니다.`);
        break;
      }
      case 'DELETE': {
        if(course.status === 'APPROVAL_REQUEST' || course.status === 'REJECTED') {
          if (!confirm(`'${course.title}' 클래스를 삭제하시겠습니까?\n클래스 삭제 시 복구가 불가합니다.`)) return;
          await modifyCourseStatus(course.id, 'DELETED');
          alert(`'${course.title}' 클래스가 삭제되었습니다.`);
        } else {
          if (!confirm(`'${course.title}' 클래스를 삭제하시겠습니까?\n이미 개설된 클래스는 관리자 승인 후 삭제되며 해당 요청은 되돌릴 수 없습니다.\n삭제 요청된 클래스는 잔여 수강 신청이 있는 경우 승인이 지연될 수 있습니다.`)) return;
          await modifyCourseStatus(course.id, 'DELETION_REQUEST');
          alert(`'${course.title}' 클래스가 삭제 요청되었습니다.`);
        }
        break;;
      }
      default: {
        alert("잘못된 요청입니다.");
        return;
      }
    }
  } catch (error) {
    alert("상태 변경을 실패했습니다.");
    return;
  }
  router.go(0);
};

const modifyCourseStatus = async (id, status) => {
  try {
    await patch(`/hosts/courses/${id}/status`, status);
  } catch (error) {
    console.error('Failed to fetch Details', error);
    throw error;
  }
}

const moveToCourseRegisterForm = () => {
  router.push({
    name: 'CourseRegisterForm',
  });
}
</script>

<template>
  <div class="mb-4">
    <h2>개설 클래스</h2>
  </div>
  <div class="text-end">
    <button class="btn register-btn" type="button" @click="moveToCourseRegisterForm">클래스 개설</button>
  </div>
  <div class="course-list row">
    <div class="col-4" v-for="(item, index) in courseList" :key="index">
      <CourseCard :item="item" :isVisible="isVisible === item.id" @update:is-visible="changeVisible" @handle-dropdown="changeCourseStatus"></CourseCard>
    </div>
  </div>
</template>

<style scoped>
.register-btn {
  background-color: #0096FF;
  color: white;
}
</style>
