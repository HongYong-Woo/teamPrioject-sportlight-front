<script setup>
import { ref, defineProps } from 'vue';
import axios from 'axios';
import { Notifications } from '../axios/Notifications';

const {
  notifications,
  unreadCount,
  showNotifications,
  showDeleteNotificationModal,
  deleteId,
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
const { notificationType } = defineProps({notificationType: String});

const createNotification = async () => {
  try {
    const response = await axios.post('http://localhost:8080/notifications/test', {
      notiTitle: notiTitle.value,
      notiContent: notiContent.value,
    });
    console.log("post : " + response);
    notiTitle.value = '';
    notiContent.value = '';
  } catch (error) {

    console.error("Failed to create notification:", error);
  }
};

</script>

<template>
  <div @click="handleClickOutside">

 <div>
    <!-- 알림 버튼 -->
      <span @click.stop="toggleNotifications" class="notification-button">
      <img src="../assets/img/alram.png" class="button-img"></img>
      <span v-show="unreadCount > 0" class="red-dot">{{ unreadCount }}</span>
    </span>

    <!-- 알림 모달 -->
    <Transition name="slide-fade">
    <div v-if="showNotifications" class="modal">
      <div class="modal-header">
        <h2 style="color: black; padding-left: 10px; padding-top: 10px;">알림
          <button @click="deleteAllNotifications" class="delete-all-button">
          모두 삭제
          </button>
        </h2>
      </div>

      <div class="modal-content">
        <!-- 스크롤 가능한 알림 리스트 -->
        <div class="notification-list">
          <div
            v-for="(notification, index) in notifications"
            :key="notification.notificationId"
            class="notification-item"
            :class="{ 'read': notification.notiReadOrNot}" @click="changeReadStatus(index, notification.notificationId)">
            <div>
            <span  class="notiMessage">{{ notification.notiTitle }}</span>
            <span class="notification-date">{{ formatTime(notification.createdAt)}}</span>
            <button @click.stop="openDeleteModal(index, notification.notificationId)" class="notification-delete">
              <img src="../assets/img/delete.svg" class="deleteImg">
            </button>
            </div>
            <span  class="notiMessage">{{ notification.notiContent }}</span>
            
            {{ notification.notiReadOrNot }}   
    
          </div>
        </div>
      </div>

      <!-- 삭제 확인 모달 -->
      <div v-if="showDeleteNotificationModal" class="delete-modal-overlay" @click.stop="closeDeleteModal">
        <div class="delete-modal-target-content-container">
        <div class="delete-modal-targetContent">
            <p>
              <span  class="notiMessage">{{ notifications[deleteIndex].notiTitle }}</span>
              <span class="notification-date">{{ formatTime(notifications[deleteIndex].createdAt)}}</span>
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
</div>
   <!-- 알림 생성 폼 -->
   <form @submit.prevent="createNotification" class="inputform">
            <div>
              <label for="notiTitle">제목:</label>
              <input id="notiTitle" v-model="notiTitle" required />
            </div>
            <div>
              <label for="notiContent">내용:</label>
              <textarea id="notiContent" v-model="notiContent" required></textarea>
            </div>
            <button type="submit">생성</button>
          </form>
        
 <p>{{ notificationType }}</p> 
</template>

<style scoped>
.inputform{
  position: fixed;
  top: 550px;
}

/* 알림창 버튼 */
.notification-button {
  position: relative;
  background : none;
  cursor: pointer;

   left: 220px;

}

.button-img {
  position: relative;
  border-radius: 50%;
  background: none;
  outline: none;
  width: 50px;
}


.red-dot {
  bottom: 35px;
  right: 0px;
  width: 17px;
  height: 17px;
  background: red;
  border-radius: 50%;
  font-size: 70%;
  text-align: center;
  position: absolute;
  float: right;
  color: white;
}

.modal {
  position: fixed;
  top: 60px;
  right: 350px;
  width: 323px;
  height: 503px;
  background: rgb(230, 230, 230);
  box-shadow: 5px 5px 5px rgba(0,0,0,0.5);
  z-index: 1000;
  /* overflow-y: auto; */
 
  /* outline-style: solid;
  outline-width: medium; */
  /* outline-color: fuchsia; */

  border-radius: 10px;
  /* border: 3px solid transparent;  */
  /* border-image: linear-gradient(#ffffff, #fff), linear-gradient(to right, #FF9500, #008CFF);*/
  /* background-origin: border-box; */
  /* background-clip: content-box, border-box; */
  /* border-image: linear-gradient(to right, #FF9500, #008CFF) 1; */
}

.modal-header {
background: white;
height: 50px;
z-index: 1000;
border-top-left-radius: 10px;
border-top-right-radius: 10px;
flex-direction: column;

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

.notiMessage {

}

.notification-date {
  margin-left:120px;
  font-size: 80%;
  text-align: center;
  display: inline-block;
  justify-content: center;
  background-color: none;
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
