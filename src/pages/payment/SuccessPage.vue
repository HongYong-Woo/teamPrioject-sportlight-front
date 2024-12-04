<script setup>
import { useAPI } from "@/axios/useAPI";
import { ref, onMounted } from "vue";
import { usePaymentStore } from "../../stores/payment";
import numberFormatter from "../../util/numberFormatter";
import Button from "../../components/common/Button.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import router from "@/routers";

const { get, post } = useAPI();
const paymentStore = usePaymentStore();

const isLoading = ref(true);

// 결제 데이터 참조 변수 선언
const paymentKey = ref("");
const orderId = ref("");
const amount = ref("");
const paymentData = ref(null);
const responseData = ref("");
const courseInfo = ref("");

// URL의 쿼리 파라미터 값을 가져오는 함수
const urlParams = new URLSearchParams(window.location.search);

// 서버로 결제 승인 요청을 보내는 함수
const confirmPayment = async () => {
  try {
    const requestData = {
      paymentKey: urlParams.get("paymentKey"),
      orderId: urlParams.get("orderId"),
      amount: urlParams.get("amount"),
      scheduleId: paymentData.value?.scheduleId || null,
      userId: paymentData.value?.userId || null,
      userCouponId: paymentData.value?.userCouponId || null,
      participantNum: paymentData.value?.participantNum || null,
      finalAmount: paymentData.value?.finalAmount || null,
    };

    console.log(requestData);
    const response = await post("/payments/confirm/widget", requestData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // 서버 응답 데이터를 저장
    responseData.value = response.data;
  } catch (err) {
    // 실패 시 실패 페이지로 이동
    window.location.href = `/widget/fail?message=${err.message}&code=${err.code}`;
  }
};

const fetchCourseInfo = async () => {
  try {
    const response = await get(`/schedules/${paymentData.value.scheduleId}`);
    courseInfo.value = response.data.data;
  } catch (err) {
    console.log('Failed to fetch course info', err);
  }
}

// 컴포넌트가 마운트될 때 실행
onMounted(async () => {
  paymentKey.value = urlParams.get("paymentKey");
  orderId.value = urlParams.get("orderId");
  amount.value = urlParams.get("amount");

  paymentData.value = paymentStore.paymentData || JSON.parse(localStorage.getItem("paymentData"));
  if (!paymentData.value) {
    console.error("No payment data available");
    window.location.href = `/widget/fail`;
  } else {
    await confirmPayment();
    await fetchCourseInfo();
  }

  isLoading.value = false;
});

function formatDateTime(input) {
    const date = new Date(input);
    const month = date.toLocaleString('ko-KR', { month: '2-digit' });
    const day = date.toLocaleString('ko-KR', { day: '2-digit' });
    const hour = date.getHours();
    const minute = date.getMinutes();

    const period = hour < 12 ? '오전' : '오후';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;

    return `${parseInt(month)}월 ${parseInt(day)}일 ${period} ${formattedHour}:${minute.toString().padStart(2, '0')}`;
}

function goToHomePage() {
    router.push({ name: 'Home' })
}

</script>

<template>
    <div v-if="isLoading" class="loading-container">
      <div class="loading">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <span>결제가 진행중입니다. 잠시만 기다려주세요</span>
    </div>
    <!-- 결제 완료 섹션 -->
    <div v-else class="container">
      <FontAwesomeIcon :icon="faCircleCheck" class="check-img"/>
      <span class="order-complete">결제를 완료했어요</span>

      <!-- 주문번호 정보 -->
      <span class="order-id">주문번호 {{ orderId }}</span>

      <p class="complete-ment">수강 신청이 정상적으로 완료되었습니다. 🎉 {{ formatDateTime(courseInfo.startTime) }} 에 만나요 😆</p>
      <div class="course-info-container">
        <div class="img-wrapper">
          <img :src="courseInfo.imgUrl" alt="Course Image" class="course-image">
        </div>
        <div class="title-container">
          <div class="title">{{ courseInfo.courseTitle }}</div>
          <div class="host-name">{{ courseInfo.hostNickname }}</div>
        </div>
      </div>

      <Button class="go-home-btn" @click="goToHomePage">홈으로 가기</Button>

    </div>
</template>

<style scoped>
.container {
  position: fixed;
  top: 0;
  width: 100vh;
  height: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.check-img {
  color: var(--primary-orange-color);
  font-size: 100px;
}

.order-complete {
  margin-top: 2rem;
  font-size: 2rem;
  font-weight: bold;
}

.order-id {
  color: #a0a0a0;
  font-size: 0.8rem;
}

.complete-ment {
  padding: 1.5rem 0;
}

.course-info-container {
  width: 80%;
  display: flex;
  flex-direction: row;
}

.img-wrapper {
  width: 220px;
  aspect-ratio: 3 / 2;
  border-radius: 0.25rem;
  margin-right: 0.5rem;
}

.course-image {
    width: 100%;
    aspect-ratio: 3 / 2;
    object-fit: cover;
    border-radius: 0.25rem;
  }

.title-container {
  flex-grow: 1;
  padding: 0.25rem 0;
}

.title {
  font-weight: bold;
  font-size: 1.5rem;
}

.host-name {
  color: #a0a0a0;
}

.go-home-btn {
  margin-top: 5rem;
  width: 12rem;
  color: var(--primary-orange-color);
  background-color: white;
  border: 1px solid var(--primary-orange-color);
}

.go-home-btn:hover {
  color: white;
  background-color: var(--primary-orange-color);
  border: 1px solid var(--primary-orange-color);
}


.loading-container {
    position: fixed;
  top: 0;
  width: 100vh;
  height: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loading {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  padding-bottom: 1rem;
}

.loading span {
    display: inline-block; /* span 내부요소들을 한줄로 세우기 */
    width: 20px;
    height: 20px;
    background-color: gray;
    border-radius: 50%;    /* span을 동그랗게 */
    animation: loading 1s 0s linear infinite;
    /* 이벤트명  반복시간  딜레이시간  이벤트처리부드럽게  이벤트무한반복*/
  }

  .loading span:nth-child(1) {  /*loading의 자식 중 첫번째 span*/
    /*nth-child : 형제 사이에서의 순서*/
    animation-delay: 0s;
    background-color: var(--primary-orange-color);
  }

  .loading span:nth-child(2) {
    animation-delay: 0.2s;
    background-color: var(--primary-skyblue-color);
  }

  .loading span:nth-child(3) {
    animation-delay: 0.4s;
    background-color: var(--primary-red-color);
  }

  @keyframes loading {        /*loading이라는 keyframe 애니메이션*/
    0%,                      /* 0, 50, 100은 구간*/
    100% {
      opacity: 0;            /* 안보였다가 */
      transform: scale(0.5); /*transform의 scale로 요소를 확대 또는 축소할 수 있음*/   
    }
    50% {
      opacity: 1;             /* 보였다가 */
      transform: scale(1.2); /* 1.2배 */
    }
  }

</style>
