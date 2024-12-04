<script setup>
import { useAPI } from "@/axios/useAPI";
import { ref, onMounted } from "vue";
import { usePaymentStore } from "../../stores/payment";
import numberFormatter from "../../util/numberFormatter";
import Button from "../../components/common/Button.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import router from "@/routers";

function goToCoursePage() {
    router.go(-1);
}

function goToHomePage() {
    router.push({ name: 'Home' })
}

</script>

<template>
    <div class="container">
      <FontAwesomeIcon :icon="faCircleExclamation" class="check-img"/>
      <span class="order-fail">결제가 정상적으로<br/>완료되지 않았습니다.</span>

      <span class="fail-ment">이용에 불편을 드려죄송합니다.<br/>다시 주문하여 주시기 바랍니다.</span>

      <div class="btn-container">
        <Button class="btn" @click="goToHomePage">주문 페이지로 가기</Button>
        <Button class="btn" @click="goToHomePage">홈으로 가기</Button>
    </div>

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

.container>span {
    text-align: center;
}

.check-img {
  color: #FF7575;
  font-size: 100px;
}

.order-fail {
  margin-top: 2rem;
  font-size: 2rem;
  font-weight: bold;
}

.fail-ment {
  color: #a0a0a0;
  font-size: 0.8rem;
}

.btn-container {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    margin-top: 5rem;
}

.btn {
  width: 12rem;
  color: #FF7575;
  background-color: white;
  border: 1px solid #FF7575;
}

.btn:hover {
  color: white;
  background-color: #FF7575;
  border: 1px solid #FF7575;
}

</style>
