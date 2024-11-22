<template>
    <div class="find-id-page">
        <h2>아이디 찾기</h2>
        <form @submit.prevent="findId">
            <label>
                이름:
                <input type="text" v-model="userName" required />
            </label>
            <br />
            <label>
                전화번호:
                <input type="text" v-model="userPhone" required />
            </label>
            <br />
            <button type="submit">아이디 찾기</button>
        </form>
        <!-- 경고 메시지 -->
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

const userName = ref('');
const userPhone = ref('');
const errorMessage = ref(''); // 경고 메시지 상태

const findId = async () => {
    await auth.findLoginIds(userName.value, userPhone.value);
    if (auth.findIdMessage && auth.findIdMessage.length > 0) {
        errorMessage.value = ''; // 경고 메시지 초기화
        router.push('/check-id');
    } else {
        errorMessage.value = '일치하는 아이디를 찾을 수 없습니다. 다시 입력해주세요.';
    }
};
</script>

<style scoped>
.find-id-page {
    text-align: center;
    margin-top: 50px;
}

.error {
    color: red;
    margin-top: 10px;
    font-weight: bold;
}
</style>
