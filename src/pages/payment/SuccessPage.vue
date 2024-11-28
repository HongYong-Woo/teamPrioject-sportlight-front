<script setup>
import { ref, onMounted } from "vue";

// 결제 데이터 참조 변수 선언
const paymentKey = ref("");
const orderId = ref("");
const amount = ref("");
const responseData = ref("");

// URL의 쿼리 파라미터 값을 가져오는 함수
const urlParams = new URLSearchParams(window.location.search);

// 서버로 결제 승인 요청을 보내는 함수
const confirmPayment = async () => {
  try {
    const requestData = {
      paymentKey: urlParams.get("paymentKey"),
      orderId: urlParams.get("orderId"),
      amount: urlParams.get("amount"),
    };

    const response = await fetch("/confirm/widget", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw { message: data.message, code: data.code };
    }

    // 서버 응답 데이터를 저장
    responseData.value = data;
  } catch (err) {
    // 실패 시 실패 페이지로 이동
    window.location.href = `/payment/fail?message=${err.message}&code=${err.code}`;
  }
};

// 컴포넌트가 마운트될 때 실행
onMounted(() => {
  paymentKey.value = urlParams.get("paymentKey");
  orderId.value = urlParams.get("orderId");
  amount.value = urlParams.get("amount");

  // 결제 승인 요청 함수 호출
  confirmPayment();
});
</script>

<template>
  <div>
    <!-- 결제 완료 섹션 -->
    <div class="box_section" style="width: 600px">
      <img
        width="100px"
        src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png"
        alt="결제 완료 이미지"
      />
      <h2>결제를 완료했어요</h2>

      <!-- 결제 금액 정보 -->
      <div class="p-grid typography--p" style="margin-top: 50px">
        <div class="p-grid-col text--left"><b>결제금액</b></div>
        <div class="p-grid-col text--right">{{ amount }}원</div>
      </div>

      <!-- 주문번호 정보 -->
      <div class="p-grid typography--p" style="margin-top: 10px">
        <div class="p-grid-col text--left"><b>주문번호</b></div>
        <div class="p-grid-col text--right">{{ orderId }}</div>
      </div>

      <!-- paymentKey 정보 -->
      <div class="p-grid typography--p" style="margin-top: 10px">
        <div class="p-grid-col text--left"><b>paymentKey</b></div>
        <div
          class="p-grid-col text--right"
          style="white-space: initial; width: 250px"
        >
          {{ paymentKey }}
        </div>
      </div>

      <!-- 버튼 섹션 -->
      <div class="p-grid" style="margin-top: 30px">
        <button
          class="button p-grid-col5"
          @click="window.location.href='https://docs.tosspayments.com/guides/v2/payment-widget/integration'"
        >
          연동 문서
        </button>
        <button
          class="button p-grid-col5"
          @click="window.location.href='https://discord.gg/A4fRFXQhRu'"
          style="background-color: #e8f3ff; color: #1b64da"
        >
          실시간 문의
        </button>
      </div>
    </div>

    <!-- 서버 응답 데이터 표시 -->
    <div class="box_section" style="width: 600px; text-align: left">
      <b>Response Data :</b>
      <pre style="white-space: initial">{{ responseData }}</pre>
    </div>
  </div>
</template>

<style scoped>
.box_section {
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}
.p-grid {
  display: flex;
  justify-content: space-between;
}
.p-grid-col {
  flex: 1;
}
.text--left {
  text-align: left;
}
.text--right {
  text-align: right;
}
.button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.button:hover {
  opacity: 0.9;
}
</style>
