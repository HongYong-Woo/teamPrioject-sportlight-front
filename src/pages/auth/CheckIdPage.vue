<template>
    <div class="check-id-page">
        <h2>회원님의 아이디를 확인하세요</h2>
        <p v-if="ids.length > 0">다음은 회원님의 아이디 목록입니다:</p>
        <ul>
            <li v-for="id in ids" :key="id">{{ id }}</li>
        </ul>
        <div class="button-group">
            <button @click="goToMain">메인 페이지로 이동하기</button>
            <button @click="goToPasswordReset">비밀번호 찾기</button>
        </div>
    </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

const ids = auth.findIdMessage; // Vuex 또는 Pinia에 저장된 아이디 목록 가져오기

const goToMain = () => {
    router.push('/');
};

const goToPasswordReset = () => {
    router.push('/find-pwd');
};
</script>

<style scoped>
.check-id-page {
    text-align: center;
    margin-top: 50px;
}
.button-group {
    margin-top: 20px;
}
button {
    margin: 0 10px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
}
</style>
