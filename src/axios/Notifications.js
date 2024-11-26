import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useAPI } from './useAPI.js';
import { useAuthStore }  from '../stores/auth.js';


export function Notifications() {
  const notifications = ref([]);
  const showNotifications = ref(false);
  const showDeleteNotificationModal = ref(false);
  const deleteIndex = ref(null);
  const deleteId = ref(null);

  const { remove,
    get,
    patch
   } = useAPI();

   const { isAuthenticated,  
    } = useAuthStore();
  const isLogin = ref(isAuthenticated());
   let eventSource = null;

    // SSE 연결
    const connectSSE = () => {
      if(!eventSource) {
        eventSource = new EventSource("http://localhost:8080/notifications/subscribe");
        console.log("Connected to EventSource");
        eventSource.onmessage = (event) => {
          const notification = JSON.parse(event.data);
          console.log("Received notification:", notification);
          notifications.value.unshift(notification);
        };

        eventSource.onerror = (error) => {
          console.error("EventSource failed:", error);
          eventSource.close();
          eventSource = null;
        };
      }
    };

    // 읽지 않은 알림 개수 체크
    const unreadCount = computed(() => {
      return notifications.value.filter(n => !n.notiReadOrNot).length;
   });
   
  
    // 알림창 토글
    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value;      
    };

    // 초기 모든 알림 데이터 가져오기
    const fetchInitialNotifications = async () => {
      try {
        const response = await get('/notifications');
        notifications.value = response.data;
        console.log("Fetched notifications:", notifications.value);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };


    // 알림 읽음 상태 변경
    const changeReadStatus = (index, id) => {
      if(notifications.value[index].notiReadOrNot === false) {
         notifications.value[index].notiReadOrNot = true;
         patch(`/notifications/${id}`);
      }
    };

    // 개별 알림 삭제 index,id
    const deleteNotification = async () => {
      await remove(`/notifications/${deleteId.value}`);
      closeDeleteModal();

    };
  
    // 전체 알림 삭제
    const deleteAllNotifications = async () => {
      await remove('/notifications');

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
   
      const timestr = time[1] + "월" + time[2] + "일";
      return timestr;
    };



    // 삭제확인창 열기
    const openDeleteModal = (index, id) => {
      // console.log("index:", index);
      // console.log("id:", id);
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

    watch(isLogin, (newVal) => {
      if(newVal) {
        console.log("로그인 됨");
        // fetchInitialNotifications();
        // connectSSE();
      } else {
        console.log("로그아웃 됨");
        notifications.value = [];
        eventSource.close();
        eventSource = null;
      }
    });
    

  return {
    unreadCount,
    notifications,
    showNotifications,
    showDeleteNotificationModal,
    deleteId,
    deleteIndex,
    isLogin,
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
