<template>
  <div class="wrapper">
    <div class="box_section">
      <!-- 결제 UI -->
      <div id="payment-method"></div>
      <!-- 이용약관 UI -->
      <div id="agreement"></div>
      <!-- 결제하기 버튼 -->
      <button class="button" id="payment-button">결제하기</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { usePaymentStore } from "../../stores/payment";

const props = defineProps({
    userInfo : {type: Object, required: true},
    amount : {type: Number, required: true},
    orderName : {type: String, required: true},
    participantNum : {type: Number, required: true},
    schedule : {type: Object, required: true},
    coupon : {type: Object, required: false},
  })

const generateRandomString = () =>
  btoa(Math.random().toString()).slice(0, 20); // 랜덤 문자열 생성
  
  const paymentStore = usePaymentStore();

const initializePaymentWidget = async () => {
  const button = document.getElementById("payment-button"); // 결제 버튼
  const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm"; // 클라이언트 키
  const customerKey = props.userInfo.userId + props.userInfo.loginId; // 사용자 키

  const tossPayments = await loadTossPayments(clientKey); // Toss Payments 로드

  const widgets = tossPayments.widgets({
    customerKey, // 사용자 키 설정
  });

  await widgets.setAmount({
    currency: "KRW", // 결제 통화 설정
    value: props.amount, // 결제 금액 설정
  });

  await Promise.all([
    widgets.renderPaymentMethods({
      selector: "#payment-method", // 결제 수단 렌더링
      variantKey: "DEFAULT",
    }),
    widgets.renderAgreement({
      selector: "#agreement", // 이용 약관 렌더링
      variantKey: "AGREEMENT",
    }),
  ]);

  // 결제하기 버튼 클릭 이벤트 추가
  button.addEventListener("click", async () => {
    const paymentData = {
      scheduleId: props.schedule.id,
      userId: props.userInfo.userId,
      userCouponId: props.coupon == null ? null : props.coupon.id,
      participantNum: props.participantNum,
      finalAmount: props.amount,
      schduleImg: props.schedule.imgUrl,
    }

    paymentStore.setPaymentData(paymentData);

    await widgets.requestPayment({
      orderId: generateRandomString(), // 주문 번호
      orderName: props.schedule.courseTitle, // 주문 이름
      successUrl: window.location.origin + "/widget/success", // 결제 성공 페이지 URL
      failUrl: window.location.origin + "/widget/fail", // 결제 실패 페이지 URL
      customerEmail: props.userInfo.loginId, // 고객 이메일
      customerName: props.userInfo.userName, // 고객 이름
    });
  });
};

// 컴포넌트 마운트 시 결제 위젯 초기화
onMounted(() => {
  initializePaymentWidget();
});

</script>

<style scoped>
body {
  background-color: #e8f3ff;
}

.wrapper {
  max-width: 800px;
  margin: auto;
}

.box_section {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgb(0 0 0 / 1%), 0 6px 6px rgb(0 0 0 / 6%);
  padding: 50px 50px 50px 50px;
  margin-top: 30px;
  color: #333d4b;
  text-align: center;
}

.button {
  color: #f9fafb;
  background-color: #3182f6;
  margin-top: 30px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 7px;
  padding: 11px 16px;
  width: 250px;
  cursor: pointer;
  transition: background 0.2s ease, color 0.1s ease;
}

.button:hover {
  color: #fff;
  background-color: #1b64da;
}
</style>
