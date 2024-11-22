<template>
  <div class="join-container">
    <h2>회원가입</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="email">이메일:</label>
        <input id="email" type="email" v-model="formData.loginId" required placeholder="이메일 입력" />
      </div>
      <div class="form-group">
        <label for="password">비밀번호:</label>
        <input id="password" type="password" v-model="formData.loginPwd" required placeholder="비밀번호 입력" />
      </div>
      <div class="form-group">
        <label for="nickname">닉네임:</label>
        <input id="nickname" type="text" v-model="formData.userNickname" placeholder="닉네임 입력" />
      </div>
      <div class="form-group">
        <label for="introduce">자기소개:</label>
        <input id="introduce" type="text" v-model="formData.userIntroduce" placeholder="자기소개 입력" />
      </div>
      <div class="form-group">
        <label for="name">이름:</label>
        <input id="name" type="text" v-model="formData.userName" placeholder="이름 입력" />
      </div>
      <div class="form-group">
        <label>성별:</label>
        <div class="radio-group">
          <label>
            <input type="radio" value="남자" v-model="formData.userGender" /> 남자
          </label>
          <label>
            <input type="radio" value="여자" v-model="formData.userGender" /> 여자
          </label>
        </div>
      </div>
      <div class="form-group">
        <label for="birth">생년월일:</label>
        <input id="birth" type="text" v-model="formData.userBirth" placeholder="YYYYMMDD" />
      </div>
      <div class="form-group">
        <label for="phone">전화번호:</label>
        <input id="phone" type="tel" v-model="formData.userPhone" placeholder="전화번호 입력" />
      </div>
      <div class="form-group">
        <label>
          이용약관 동의(필수):
          <input type="checkbox" v-model="formData.termsAgreement" />
        </label>
        <span v-if="!formData.termsAgreement && showWarning" class="warning">
          약관에 동의하셔야 가입이 가능합니다.
        </span>
      </div>
      <div class="form-group">
        <label>
          마케팅 동의:
          <input type="checkbox" v-model="formData.marketingAgreement" />
        </label>
      </div>
      <div class="form-group">
        <label>
          개인정보 제공 동의:
          <input type="checkbox" v-model="formData.personalAgreement" />
        </label>
      </div>
      <button type="submit">회원가입</button>
    </form>
    <p v-if="responseMessage">{{ responseMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAPI } from '@/axios/useAPI';
import { useRouter } from 'vue-router';
import { useAuthStore } from "@/stores/auth";

const { post } = useAPI();
const router = useRouter();
const auth = useAuthStore();

const formData = ref({
  loginId: '',
  loginPwd: '',
  userNickname: '',
  userIntroduce: '',
  userName: '',
  userGender: '',
  userBirth: '',
  userPhone: '',
  termsAgreement: false,
  marketingAgreement: false,
  personalAgreement: false,
});

const responseMessage = ref('');
const showWarning = ref(false);

const handleSubmit = async () => {
  if (!formData.value.termsAgreement) {
    showWarning.value = true;
    return;
  }
  showWarning.value = false;

  try {
    const response = await post('/join', formData.value);
    if (response.status === 200 && response.data === "회원가입 성공") {
      responseMessage.value = "회원가입이 완료되었습니다.";
      auth.openLoginModal();
      const prevPath = sessionStorage.getItem('previousPath') || '/';
      router.push(prevPath);
    } else {
      responseMessage.value = "알 수 없는 오류가 발생했습니다.";
    }
  } catch (error) {
    if (error.response && error.response.status === 409) {
      responseMessage.value = error.response.data.message || "이미 사용 중인 이메일(또는 ID)입니다.";
    } else {
      responseMessage.value = error.response?.data?.message || '회원가입에 실패했습니다.';
    }
  }
};
</script>

<style scoped>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f3f3f3;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.join-container {
  background-color: #fde1b5;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 600px;
}

h2 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2.4rem;
  color: #444;
}

.form-group {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

input {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
}

button {
  width: 100%;
  padding: 1rem;
  background-color: #e79843;
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 1.4rem;
  cursor: pointer;
}

button:hover {
  background-color: #d7893e;
}

.warning {
  color: red;
  font-size: 0.9rem;
}

.radio-group {
  display: flex;
  gap: 1rem;
}

@media (max-width: 768px) {
  h2 {
    font-size: 2rem;
  }

  input {
    font-size: 1rem;
  }

  button {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  h2 {
    font-size: 1.6rem;
  }

  input {
    font-size: 0.9rem;
  }

  button {
    font-size: 1rem;
  }
}
</style>
