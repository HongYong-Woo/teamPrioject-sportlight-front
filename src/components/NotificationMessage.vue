<script setup>
import { ref, defineProps, computed, onMounted } from 'vue';
import axios from 'axios';
import { Notifications } from '../axios/Notifications';

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


const notiTitle = ref('');
const notiContent = ref('');

  // 필터링된 알림
  const filterNotifications = computed(() => {
    if(props.notificationType === '') {
      return notifications.value;
    } 
    else {
      return notifications.value.filter(n => n.notiType === props.notificationType);
    }
   });

   const props = defineProps({
  notificationType: String, // notificationType은 String 타입으로 정의
});


</script>

<template>
  <div class="background">
 <div class="modal-list" id="noti-list">
    <!-- 알림 모달 -->
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
            <span class="notification-date">· {{ formatTime(notification.createdAt)}}</span>
            <button @click.stop="openDeleteModal(index, notification.notificationId)" class="notification-delete">
              <img src="../assets/img/delete.svg" class="deleteImg">
            </button>
            </div>
            <span  class="notiMessage">{{ notification.notiContent }}</span>
            
            {{ notification.notiReadOrNot }}   
            {{ notification.notiType }}
    
          </div>
        </div>
      </div>

      <!-- 삭제 확인 모달 -->
      <div v-if="showDeleteNotificationModal" class="delete-modal-overlay" @click.stop="closeDeleteModal">
            
        <div class="delete-modal" >
              <button @click.stop="deleteNotification" class="confirm-delete-button">
                <img src="../assets/img/delete.svg" class="deleteImg">
                삭제하기
              </button>
              <button @click.stop="closeDeleteModal" class="cancel-delete-button">취소</button>
          </div>
        </div>
      </div>
    </div>

</template>

<style scoped>

.background {
  position: relative;
  border: 1px solid red;
  height: 200px;
  border-radius: 10px;
}

.modal-list {
  height: 100%;
  background: rgb(230, 230, 230);
  
  border-radius: 10px;
  display:grid;
  flex-direction: column;
  overflow-y: auto;
}


.delete-all-button {
  float:right;
  background: red;
  color: white;
  border: none;
  padding: 5px;
  border-radius: 10px;
  margin-top: 0px;
  margin-right: 5px;
  align-items: center;

  cursor: pointer;

  
}

.modal-content {
  padding: 10px;
  height: 440px;
  width: 98%;
  border-radius: 10px;
  overflow-y: auto;
  background-color: transparent;
  border: none;
}

.notification-list {
  margin-top: 20px;
  
}

.notification-item {
  color: black;
  padding: 10px;
  border-radius: 10px;
  background-color: white;
  margin-bottom: 10px;
  box-shadow: 1px 1px 5px rgba(0,0,0,0.5);

}

.notification-item:hover {
  background: rgb(230, 230, 230);
}

.notification-item.read {
  color: gray;
}
.notiMessage-title{
  background-color: transparent;
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
  border: none;
}

.notification-delete:hover {
  background: rgb(190, 190, 190);
}

.deleteImg {
  width: 20px;
  height: 20px;
  border: none;
  outline: none;
}

/* 삭제 확인 모달 스타일 */
.delete-modal-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(85, 85, 85, 0.5);
  border-radius: 10px;
  z-index: 1100;

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
.modal::-webkit-scrollbar {
  width: 10px; /* 스크롤바 너비 */
}

.modal::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.5); /* 스크롤바 색상 */
  border-radius: 10px; /* 스크롤바 모서리 둥글게 */
}

.modal::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.1); /* 스크롤바 트랙 색상 */
}


</style>
