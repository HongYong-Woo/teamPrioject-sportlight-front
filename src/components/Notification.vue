<script setup>
import { computed, ref } from 'vue';
import { Notifications } from '../axios/Notifications';
import  formatRelativeTime from '../util/relativeTimeFormatter';
import { ca } from 'date-fns/locale';

const {
  notifications,
  unreadCount,
  showNotifications,
  showDeleteNotificationModal,
  deleteIndex,
  toggleNotifications,
  deleteNotification,
  deleteAllNotifications,
  changeReadStatus,
  formatTime,
  handleClickOutside,
  openDeleteModal,
  closeDeleteModal
} = Notifications();



var notificationType = ref('ALL');

  // 필터링된 알림
  const filterNotifications = computed(() => {
    if(notificationType.value === 'ALL') {
      return notifications.value;
    } 
    else {
      return notifications.value.filter(n => n.notiType === notificationType.value);
    }
   });

   //카테고리 배열 생성
  const notiCatregorys = computed(() => {
    const categories = []; // 새로운 배열 생성
    categories.push('ALL'); // 전체 카테고리 추가
    notifications.value.forEach((notification) => {
      if (!categories.includes(notification.notiType)) {
        categories.push(notification.notiType); // 중복되지 않도록 추가
      }
  });
  return categories;
});

const selectNotiType = (category) => {
  notificationType.value = category;
  selectedCategory.value = category;
};

const categoriyFormatter = (category) => {
  switch (category) {
    case 'ALL':
      return '전체';
    case 'COURSE':
      return '클래스';
    case 'REVIEW':
      return '리뷰';
    case 'COUPON':
      return '쿠폰';
    case 'QUESTION':
      return '문의';
    case 'ADJUSTMENT':
      return '정산';
    case 'INTEREST':
      return '찜';
    case 'MEMBER':
      return '회원';
    default:
      return category;
  }
}

const selectedCategory = ref('ALL');


</script>

<template>
  <div @click="handleClickOutside" style="position: relative">
    <!-- 알림 버튼 -->
      <span @click.stop="toggleNotifications" class="notification-button">
      <img src="../assets/img/alram.png" class="button-img"/>
      <span v-show="unreadCount > 0" class="red-dot">{{ unreadCount }}</span>
    </span>

    <!-- 알림 모달 -->
    <Transition name="slide-fade">
    <div v-if="showNotifications" class="modal" id="noti-modal">
      <div class="modal-header">
        <span style="color: black; padding-left: 2px; padding-top: 2px; font-size:x-large; font: bolder;">알림
          
        </span>
        <button @click="deleteAllNotifications" class="delete-all-button">
          모두 삭제
          </button>
      </div>

      <!-- 메시지 필터링 -->
      <div class="category-body">   
        <span v-for="(categoriy) in notiCatregorys" class="category-list">
          <button @click="selectNotiType(categoriy)"
          class="category-button"
          :class="{'selected' : selectedCategory === categoriy}">{{ categoriyFormatter(categoriy) }}</button>
        </span> 
      </div>

      <div class="modal-content">
        <!-- 스크롤 가능한 알림 리스트 -->
        <div class="notification-list">
          <div
            v-for="(notification, index) in filterNotifications"
            :key="notification.notificationId"
            class="notification-item"
            :class="{ 'read': notification.notiReadOrNot}" @click="changeReadStatus(index, notification.notificationId)">
            <div style="flex-direction: row;">
            <span  class="notiMessage-title">{{ notification.notiTitle }}</span>
            <span class="notification-date">· {{ formatRelativeTime(notification.createdAt)}}</span>
            <button @click.stop="openDeleteModal(index, notification.notificationId)" class="notification-delete">
              <img src="../assets/img/delete.svg" class="deleteImg">
            </button>
            </div>
            <span  class="notiMessage">{{ notification.notiContent }}</span>
            
          </div>
        </div>
      </div>
      <div class="space"></div>

      <!-- 삭제 확인 모달 -->
      <div v-if="showDeleteNotificationModal" class="delete-modal-overlay" @click.stop="closeDeleteModal">
        <div class="delete-modal-target-content-container">
        <div class="delete-modal-targetContent">
            <p>
              <span  class="notiMessage">{{ notifications[deleteIndex].notiTitle }}</span>
              <span class="notification-date">{{ formatRelativeTime(notifications[deleteIndex].createdAt)}}</span>
            </p>
            <span  class="notiMessage">{{ notifications[deleteIndex].notiContent }}</span>
          
        </div>
      </div>    
        <div class="delete-modal" >
              <button @click.stop="deleteNotification" class="confirm-delete-button">
                <img src="../assets/img/delete.svg" class="deleteImg">
                삭제하기
              </button>
              <button @click.stop="closeDeleteModal" class="cancel-delete-button">취소</button>
          </div>
        </div>
    </div>
  </Transition>

</div>
</template>

<style scoped>
/* 알림창 버튼 */
.notification-button {
  background : none;
  cursor: pointer;

}

.button-img {
  position: relative;
  border-radius: 50%;
  background: none;
  outline: none;
  width: 40px;
}


.red-dot {
  bottom: 25px;
  right: -3px;
  width: 15px;
  height: 15px;
  background: red;
  border-radius: 50%;
  font-size: 70%;
  text-align: center;
  position: absolute;
  float: right;
  color: white;
}

.modal {
  position: absolute;
  top: 4rem;
  left: -263px;
  width: 330px;
  height: 503px;
  background: rgb(230, 230, 230);
  box-shadow: 5px 5px 5px rgba(0,0,0,0.2);
  z-index: 1000;
  /* overflow-y: auto; */
 
  /* outline-style: solid;
  outline-width: 2px;
  outline-color: rgb(255, 147, 0); */
  border-radius: 10px;
  
  
  display:flex;
  flex-direction: column;
}

.modal-header {
background: white;
z-index: 1000;
border-top-left-radius: 10px;
border-top-right-radius: 10px;
height: 3rem;

}


.delete-all-button {
  float:right;
  background: white;
  padding: 5px;
  border-radius: 10px;
  font-size: 10px;
  align-items: center;
  outline-width: 2px;
  border: 1px solid #d9d9d9;
  color : #767676;
  
  cursor: pointer;
}

.delete-all-button:hover {
  float:right;
  background: red;
  color: white;
  border: none;
  padding: 5px;
  border-radius: 10px;
  font-size: 10px;
  align-items: center;

  cursor: pointer;
}

.category-body{
  background: rgb(230, 230, 230);
  overflow-x: auto;
  height: 50px;
  margin-left: 5px;
  z-index: 1001;
}

.category-list{

}

.category-button{
  display: inline-block; /* 버튼 내부 텍스트를 가로로 */
  font-size: 0.9rem;
  border-radius: 4px;
  border: 0;
  margin: 3px;
  padding: 3px 5px;
  background: white;
  
}

.category-button.selected{
  display: inline-block; /* 버튼 내부 텍스트를 가로로 */
  font-size: 0.9rem;
  border-radius: 4px;
  border: 0;
  margin: 3px;
  padding: 3px 5px;
  color: white;
  
  background: rgb(255, 147, 0);
}

.modal-content {
  /* flex-grow: 2; */
  height: calc(100% - 50px - 3rem);
  /* width: 100%; */
  background-color: transparent;
  border: none;

}

.notification-list{
  overflow-y:auto;
  padding: 0.6rem;
}

.space {
  height: 0.5rem;
}

.notification-item {
  color: black;
  padding: 10px;
  border-radius: 10px;
  background-color: white;
  margin-bottom: 10px;
  box-shadow: 2px 2px 2px rgba(0,0,0,0.5);

}

.notification-item:hover {
  background: rgb(230, 230, 230);
}

.notification-item.read {
  color: gray;
}
.notiMessage-title{
  background-color: transparent;
  font: bolder;
}

.notiMessage {
  background-color: transparent ;
}

.notification-date {
  margin-left: 5px;
  font-size: 80%;
  text-align: center;
  display: inline-block;
  justify-content: center;
  background-color: transparent;
}


.notification-delete {
  float:right;
  background: none;
  cursor: pointer;
  border-radius: 25%;
  flex-direction: column;
}

.notification-delete:hover {
  background: rgb(190, 190, 190);
}

.deleteImg {
  width: 20px;
  height: 20px;
}

/* 삭제 확인 모달 스타일 */
.delete-modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(85, 85, 85, 0.5);
  border-radius: 10px;
  z-index: 1100;

  display: flex;
  flex-direction: column;
  align-content: center;
}
.delete-modal-target-content-container{
  flex-grow: 1;
  align-content: center;
}

.delete-modal-targetContent {
  border-radius: 20px;
  background-color: white;
  padding: 10px;
  height: 100px;

  display: flex;
  flex-direction: column;
}

.delete-modal {
  background: none;
  padding: 20px;
  z-index: 1200;
  width: 100%;

  display: flex;
  flex-direction: column;
}


.confirm-delete-button {
  background: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cancel-delete-button {
  background: white;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  height: 30px;
  font-size: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
}


/* 스크롤바 스타일 */
.notification-list::-webkit-scrollbar {
  width: 10px; /* 스크롤바 너비 */
}

.notification-list::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.5); /* 스크롤바 색상 */
  border-radius: 10px; /* 스크롤바 모서리 둥글게 */
}

.notification-list::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.1); /* 스크롤바 트랙 색상 */
}


/*
  진입/진출 애니메이션은 다른 지속 시간과
  타이밍 함수를 사용할 수 있습니다.
*/
.slide-fade {
  top: 20%;
    left: 50%;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  /* transform: translateX(20px); */
  transform: translate(20px, -10px);
  opacity: 0;
}
</style>
