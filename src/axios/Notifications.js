import { ref, computed, onMounted, onBeforeUnmount  } from 'vue';
import axios from 'axios';
import dayjs from 'dayjs';


export function Notifications() {
  const notifications = ref([]);
  const showNotifications = ref(false);
  const showDeleteNotificationModal = ref(false);
  const deleteIndex = ref(null);
  const deleteId = ref(null);

 

    // SSE 연결
    const connectSSE = () => {
      const eventSource = new EventSource("http://localhost:8080/notifications/subscribe");
      console.log("Connected to EventSource");
      eventSource.onmessage = (event) => {
        const notification = JSON.parse(event.data);
        console.log("Received notification:", notification);
        notifications.value.unshift(notification);
      };
    };

    // 읽지 않은 알림 개수 체크
    const unreadCount = computed(() => {
      return notifications.value.filter(n => !n.notiReadOrNot).length;
   });
  
    // 알림창 토글
    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value;
    };

    // 초기 알림 데이터 가져오기
    const fetchInitialNotifications = async () => {
      try {
        const response = await axios.get('http://localhost:8080/notifications');
        notifications.value = response.data;
        console.log("notifications.value:", notifications.value);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    // 알림 읽음 상태 변경
    const changeReadStatus = (index, id) => {
      console.log("changeReadStatus notification index:", index);
      console.log("changeReadStatus notification id:", id); 
             if(notifications.value[index].notiReadOrNot === false) {
         notifications.value[index].notiReadOrNot = true;
        // axios.patch(`http://localhost:8080/notifications/${id}`)
        // .catch(error => {
        //   console.error("Failed to change read status:", error);
        // });
      }
    };

    // 개별 알림 삭제 index,id
    const deleteNotification = () => {
      console.log("Deleting notificationIndex:", deleteIndex.value);
      console.log("Deleting notificationId:", deleteId.value);
      axios.delete(`http://localhost:8080/notifications/${deleteId.value}`)
        .then(() => {
          notifications.value.splice(deleteIndex.value, 1);
          closeDeleteModal();
        })
        .catch(error => {
          console.error("Failed to delete notification:", error);
        });
    };
  
    // 전체 알림 삭제
    const deleteAllNotifications = () => {
      console.log("Deleting all notifications");
      // axios.delete('http://localhost:8080/notifications')
      // .catch(error => {
      //   console.error("Failed to delete all notifications:", error);
      // });
      notifications.value = [];
    };

    const handleClickOutside = (event) => {
      if (!event.target.closest('.modal') && !event.target.closest('.notification-button')) {
        showNotifications.value = false;
        closeDeleteModal();
      }
    };


    // 시간 포맷 변경
    const formatTime = (time) => {
      return dayjs(time).format('YYYY-MM-DD');
    }



    // 삭제확인창 열기
    const openDeleteModal = (index, id) => {
      console.log("index:", index);
      console.log("id:", id);
      deleteIndex.value = index;
      deleteId.value = id;
      showDeleteNotificationModal.value = true;
    };

    //삭제확인창 닫기
    const closeDeleteModal = () => {
      showDeleteNotificationModal.value = false;
      deleteIndex.value = null;
      deleteId.value = null;
    };



    onMounted(() => {
      fetchInitialNotifications();
      connectSSE();
      document.addEventListener('click', handleClickOutside);
    });
  
    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside);
    });
    

  return {
    unreadCount,
    notifications,
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

  };
}
