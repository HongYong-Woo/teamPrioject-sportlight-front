<script setup>
import {computed, defineEmits, onMounted, onUnmounted, ref} from "vue";
import router from "@/routers/index.js";

const prop = defineProps({
  item: {
    type: Object,
    required: true,
    default: () => {
      return {
        id: null,
        title: "",
        thumbImg: "@/assets/logo.png",
        regDate: "",
        status: null,
      }
    }
  },
  isVisible: {
    type: Boolean,
    required: true,
  }
});

const emit = defineEmits(['update:is-visible', 'handle-dropdown']);
const courseItem = ref(prop.item);

const visible = computed(() => {
  return prop.isVisible;
});

const visibleDetailShortcut = ref(prop.item.status === 'APPROVED' || prop.item.status === 'DORMANCY');
const visibleMenuIcon = ref(prop.item.status !== 'DELETION_REQUEST')
const menuIconRef = ref(null);

const toggleDropdown = (event) => {
  event.stopPropagation();
  emit('update:is-visible', prop.item.id, !prop.isVisible);
};

const handleDropdownChange = (selectedValue) => {
  emit('handle-dropdown', prop.item, selectedValue);
};

const handleClickOutside = (event) => {
  if (menuIconRef.value && !menuIconRef.value.contains(event.target)) {
    emit('update:is-visible', prop.item.id, false);
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});


const moveToCourseDetail = id => {
  router.push({
    name: 'CourseDetail',
    params: {
      id: id,
    }
  })
};

const moveToCourseAdminPage = id => {

};

const getTagClass = status => {
  switch (status) {
    case 'APPROVAL_REQUEST': return '';
    case 'APPROVED': return 'active';
    case 'REJECTED': return 'reject';
    case 'DORMANCY': return 'dormancy';
    case 'DELETION_REQUEST': return 'delete';
    default: return '';
  }
}

const getStatus = status => {
  switch (status) {
    case 'APPROVAL_REQUEST': return '승인 요청';
    case 'APPROVED': return '활성';
    case 'REJECTED': return '승인 거절';
    case 'DORMANCY': return '휴면';
    case 'DELETION_REQUEST': return '삭제 요청';
    case 'DELETED': return '삭제 완료';
    default: return 'ERROR';
  }
};

const getDateString = dateTime => {
  const temp = dateTime.split("T");
  const date = temp[0].split("-").join(".");
  const time = temp[1].split(":");
  return `${date} ${time[0]}:${time[1]}`;
};

</script>

<template>
  <div class="card">
    <div class="img-container">
      <div class="top-banner">
        <div class="reg-date-text">
          {{ getDateString(courseItem.regDate) }} 생성
        </div>
        <div class="menu-dropdown-container" v-if="visibleMenuIcon">
          <svg @click="toggleDropdown" ref="menuIconRef" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
          </svg>
          <Transition name="menu-fade">
            <div v-show="visible" class="menu-wrapper">
              <div class="menu-container">
                <div class="menu-items">
                  <div
                      v-if="courseItem.status === 'DORMANCY'"
                      class="menu-item"
                      @click="() => handleDropdownChange('ACTIVE')"
                  >
                    활성화
                  </div>
                  <div
                      v-if="courseItem.status === 'APPROVED'"
                      class="menu-item"
                      @click="() => handleDropdownChange('DORMANCY')"
                  >
                    휴면
                  </div>
                  <div
                      v-if="courseItem.status !== 'DELETION_REQUEST'"
                      class="menu-item"
                      style="color: red;"
                      @click="() => handleDropdownChange('DELETE')"
                  >
                    삭제
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
      <img :src="courseItem.thumbImg" height="200" width="100%" alt="Card image">
    </div>
    <div class="card-body">
      <div class="card-title">{{ courseItem.title }}</div>
      <div class="card-content">
        <div :class="`status-tag ${getTagClass(courseItem.status)}`">
          {{ getStatus(courseItem.status) }}
        </div>
        <div v-if="visibleDetailShortcut">
          <button class="btn btn-link" @click="moveToCourseDetail(courseItem.id)">클래스 바로가기</button>
        </div>
      </div>

      <button @click="moveToCourseAdminPage(courseItem.id)" class="btn setting-btn">관리 및 설정</button>
    </div>
  </div>
</template>

<style scoped>
.card {
  width: 100%;
  margin-bottom: 20px;
}
.btn-link {
  color: #b6b6b6;
  font-size: small;
}
.status-tag {
  text-align: center;
  font-size: x-small;
  font-weight: bold;
  background-color: white;
  border: 3px solid #606060;
  border-radius: 5px;
  padding: 3px;
  width: 65px;
}
.active {
  border: 3px solid #FF9300;
}
.dormancy {
  border: 3px solid #d8d8d8;
}
.reject {
  border: 3px solid #EA551A;
}
.delete {
  border: 3px solid #c4c4c4;
  background-color: #ededed;
}
.setting-btn {
  width: 100%;
  color: white;
  font-weight: bold;
  background-color: #0096FF;
}
.img-container {
  position : relative;
}
.top-banner {
  position : absolute;
  width: 100%;
  height: 35px;
  background-color: rgba(255, 255, 255, 0.79);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 10px;
  padding-right: 10px;
}
.reg-date-text {
  font-size: small;
}

.menu-dropdown-container {
  position: relative;
  display: inline-block;
}

.menu-wrapper {
  position: absolute;
  top: calc(100% + 5px);
  right: 0;
  z-index: 1000;
  min-width: 80px;
}

.menu-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid #eee;
}

.menu-items {
  padding: 4px 0;
}

.menu-item {
  padding: 10px 16px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;
  text-align: left;
}

.menu-item:hover {
  background-color: #f5f5f5;
}

@media (max-width: 768px) {

  .menu-item {
    padding: 8px 14px;
    font-size: 13px;
  }
}

@media (max-width: 640px) {
  .menu-item {
    padding: 6px 12px;
    font-size: 12px;
  }
}

.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: all 0.2s ease;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.card-content {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}
.btn-link {
  padding: 0;
}
</style>
