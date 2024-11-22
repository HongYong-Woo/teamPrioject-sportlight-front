<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from "@/stores/auth";
import { useAPI } from "@/axios/useAPI";

const currentStep = ref('login');
const auth = useAuthStore();
const route = useRoute();
const router = useRouter();
const userName = ref('');
const userPhone = ref('');
const loginId = ref('');
const passwordConfirm = ref('');
const loginError = ref("");
const isVisible = ref(false);
const emit = defineEmits(['close']);
const loginIds = ref([]);
const isCodeSent = ref(false);
const timer = ref(180);
const timerInterval = ref(null);
const passwordResetSuccess = ref(false);

const verificationCode = ref('');

const loginData = ref({
  username: '',
  password: '',
});


function closeModal() {
  isVisible.value = false;
  currentStep.value = 'login';
  loginError.value = '';
  userName.value = '';
  userPhone.value = '';
  loginId.value = '';
  verificationCode.value = '';
  loginIds.value = [];
  loginData.value.password = '';
  passwordConfirm.value = '';
  isCodeSent.value = false;
  clearInterval(timerInterval.value);
  timer.value = 180;
  passwordResetSuccess.value = false;
  auth.closeLoginModal();
  emit('close');
  router.replace({ query: { ...route.query, showLoginModal: undefined } });
}

function handleKeydown(event) {
  if (event.key === 'Escape') {
    closeModal();
  }
};

const handleLogin = async () => {
  try {
    const success = await auth.login(loginData.value);
    if (success) {
      console.log("로그인 성공");
      console.log(`유저 권한: ${auth.userRoles.join(', ')}`);
      closeModal();
    } else {
      loginError.value = auth.loginError;
    }
  } catch (error) {
    console.error("로그인 에러:", error);
    loginError.value = "로그인 처리 중 문제가 발생했습니다.";
  }
};

watch(
  () => auth.showLoginModal,
  (newValue) => {
    isVisible.value = newValue;
  },
  { immediate: true }
);


const handleFindId = async () => {
  try {
    await auth.findLoginIds(userName.value, userPhone.value);
    //console.log("아이디 목록:", auth.findIdMessage);
    loginIds.value = auth.findIdMessage;
    if (loginIds.value.length > 0) {
      currentStep.value = 'check-id';
    } else {
      loginError.value = '일치하는 아이디를 찾을 수 없습니다.';
    }
  } catch (error) {
    console.error('아이디 찾기 에러:', error);
    loginError.value = '아이디 찾기 중 문제가 발생했습니다.';
  }
};

const sendVerificationCode = async () => {
  if (!loginId.value || !userName.value || !userPhone.value) {
    loginError.value = "모든 정보를 입력해주세요.";
    return;
  }

  const { post } = useAPI();

  try {
    const response = await post("/api/auth/password-reset/request", {
      userName: userName.value,
      userPhone: userPhone.value,
      loginId: loginId.value,
    });

    console.log("응답:", response.data);
    console.log("response.data:", response?.data);
    
    if (response?.data?.code === 200) {
      isCodeSent.value = true;
      loginError.value = "";
      startTimer();
      //currentStep.value = 'verify-code';
    } else {
      loginError.value = "인증번호를 전송할 수 없습니다.";
    }
  } catch (error) {
    console.error("API 호출 실패:", error);
    loginError.value = error.response?.data?.message || "서버와 통신 중 문제가 발생했습니다.";
    isCodeSent.value = false;
  }
};



const verifyCodeAndMoveToResetPwd = async () => {
  if (!verificationCode.value) {
    loginError.value = "인증번호를 입력해주세요.";
    return;
  }

  const { post } = useAPI();

  try {
    const response = await post("/api/auth/verify-code", {
      loginId: loginId.value,
      code: verificationCode.value,
    });

    console.log("응답:", response.data);
    if (response?.data?.code === 200) {
      currentStep.value = "change-password";
      loginError.value = "";
    } else {
      loginError.value = "인증번호가 유효하지 않습니다.";
    }
  } catch (error) {
    console.error("서버와 통신 중 에러 발생:", error);
    loginError.value = error.response?.data?.message || "인증번호 검증 중 문제가 발생했습니다.";
  }
};

const changePassword = async () => {
  console.log("changePassword 함수 실행됨");  // 디버깅용 로그
  
  if (!loginData.value.password || !passwordConfirm.value) {
    loginError.value = "새 비밀번호와 확인 비밀번호를 모두 입력해주세요.";
    return;
  }

  if (passwordMismatchError.value) {
    loginError.value = "비밀번호가 일치하지 않습니다.";
    return;
  }

  const { post } = useAPI();

  try {
    console.log("API 요청 시작"); // 디버깅용 로그
    const response = await post("/api/auth/password-reset/confirm", {
      newPwd: loginData.value.password,
    });

    console.log("API 응답:", response); // 디버깅용 로그

    if (response?.data?.code === 200) {
      console.log("비밀번호 변경 성공");
      passwordResetSuccess.value = true;
      loginError.value = "";
      closeModal();
    } else {
      loginError.value = "비밀번호 변경에 실패했습니다.";
    }
  } catch (error) {
    console.error("서버와 통신 중 에러 발생:", error);
    loginError.value = error.response?.data?.message || "비밀번호 변경 중 문제가 발생했습니다.";
  }
};



const passwordMismatchError = computed(() => {
  return loginData.password && passwordConfirm.value && loginData.password !== passwordConfirm.value;
});


const startTimer = () => {
  if (timerInterval.value) {
    console.log("기존 타이머 정지");
    clearInterval(timerInterval.value);
  }
  console.log("새 타이머 시작");
  timer.value = 180;

  timerInterval.value = setInterval(() => {
    if (timer.value > 0) {
      timer.value--;
      console.log("타이머:", timer.value);
    } else {
      console.log("타이머 종료");
      clearInterval(timerInterval.value);
      isCodeSent.value = false;
    }
  }, 1000);
};

const formattedTimer = computed(() => {
  const minutes = String(Math.floor(timer.value / 60)).padStart(2, "0");
  const seconds = String(timer.value % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
});

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);

  if (route.query.showLoginModal === 'true') {
    isVisible.value = true;
  }
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  clearInterval(timerInterval.value);
});


</script>

<template>
  <div v-if="isVisible" class="modal-overlay">
    <transition name="fade-slide">
      <div class="modal-content">
        <button class="back-btn" v-if="currentStep !== 'login'" @click="currentStep = currentStep === 'login'">
          ← 뒤로
        </button>
        <button class="close-btn" @click="closeModal">×</button>
    
        <div v-if="currentStep === 'login'">
          <img src="@/assets/logo.png" alt="Logo" class="modal-logo" />
          <div class="input-group">
            <input type="email" class="input-box" placeholder="이메일" v-model="loginData.username" required />
          </div>
          <div class="input-group">
            <input type="password" class="input-box" placeholder="비밀번호" v-model="loginData.password" required />
          </div>
          <button class="login-btn" @click="handleLogin">로그인</button>
          <p v-if="loginError" class="error-message">{{ loginError }}</p>
          <div class="extra-options">
            <button @click="currentStep = 'find-pwd'" class ="authButton">비밀번호 찾기</button> |
            <a href="/join">회원가입</a> |
            <button @click="currentStep = 'find-id'" class="authButton">이메일(아이디) 찾기</button> 
          </div>

          <div class="social-login">
            <div class="social-divider">
              <span>간편 회원가입</span>
            </div>
            <div class="social-btn-container">
              <button class="social-btn kakao">Kakao</button>
              <button class="social-btn naver">Naver</button>
              <button class="social-btn google">Google</button>
            </div>
          </div>
        </div>

        <div v-if="currentStep === 'find-pwd'">
          <h1>비밀번호 찾기</h1>
          <p class="subtitle">이름, 전화번호, 이메일을 입력하시고<br/> 해당 이메일에서 인증코드를 확인해주세요.</p>
          <div class="input-group">
            <input type="text" class="input-box" placeholder="이름" v-model="userName" required />
          </div>
          <div class="input-group">
            <input type="text" class="input-box" placeholder="전화번호" v-model="userPhone" required />
          </div>
          <div class="input-group email-group">
            <input type="email" class="input-box email-box" placeholder="이메일" v-model="loginId" required />
            <button class="verify-btn" :disabled="isCodeSent" @click="sendVerificationCode">
              {{ isCodeSent ? formattedTimer : '전송' }}
            </button>
          </div>
          <div v-if="isCodeSent" class="input-group">
            <input type="text" class="input-box" placeholder="인증번호 입력" v-model="verificationCode" required />
          </div>
          <button class="reset-pwd-btn" @click="verifyCodeAndMoveToResetPwd">비밀번호 변경</button>
          <p v-if="loginError" class="error-message">{{ loginError }}</p>
        </div>

        <div v-if="currentStep === 'change-password'">
          <h1>비밀번호 변경</h1>
          <p class="subtitle">새 비밀번호를 입력하고 변경 버튼을 눌러주세요.</p>
          <div class="input-group">
            <input type="password" class="input-box" placeholder="새 비밀번호" v-model="loginData.password" required />
          </div>
          <div class="input-group">
            <input type="password" class="input-box" placeholder="새 비밀번호 확인" v-model="passwordConfirm" required />
          </div>
          <button 
            class="login-btn" 
            @click="changePassword" 
            :disabled="passwordMismatchError || !loginData.password || !passwordConfirm">
            변경 완료
          </button>
          <p v-if="loginError" class="error-message">{{ loginError }}</p>
        </div>

        <div v-if="currentStep === 'find-id'">
          <h1>아이디 찾기</h1>
          <p class="subtitle">정보를 입력하시면<br />
             회원님의 이메일이 표시됩니다.</p>
          <div class="input-group">
            <input type="text" class="input-box" placeholder="이름" v-model="userName" required />
          </div>
          <div class="input-group">
            <input type="text" class="input-box" placeholder="전화번호" v-model="userPhone" required />
          </div>
          <button class="find-id-btn" @click="handleFindId">아이디 찾기</button>
          <p v-if="loginError" class="error-message">
            {{ loginError }}
          </p>
        </div>

        <div v-if="currentStep === 'check-id'">
          <h1>아이디 확인</h1>
          <p class="subtitle">회원님의 이메일을 확인하세요</p>
          <div v-if="loginIds.length > 0" class="id-list">
            <div v-for="id in loginIds" :key="id" class="id-item">
              {{ id }}
            </div>
          </div>
          <p v-else>일치하는 아이디를 찾을 수 없습니다.</p>
          <div class="button-group">
            <button class="login-btn standard" @click="currentStep = 'login'">로그인 하기</button>
            <button class="login-btn outlined" @click="$router.push('/find-pwd')">비밀번호 찾기</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>


<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2.5rem;
  width: 550px;
  height: 650px;
  border-radius: 12px;
  text-align: center;
  position: relative;
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
  overflow-y: hidden;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 2rem;
  color: #a0a0a0;
  cursor: pointer;
}

.close-btn:hover {
  color: #999;
}

.modal-logo {
  width: 250px;
  margin: 30px auto 20px;
}

.input-group {
  margin-bottom: 10px;
}

.input-box {
  width: 100%;
  padding: 1.2rem;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 12px;
  font-size: 21px;
}

.login-btn {
  width: 100%;
  padding: 1.2rem;
  background-color: #e79843;
  color: white;
  border: none;
  border-radius: 12px;
  margin: 15px 0;
  font-size: 20px;
  cursor: pointer;
}

.reset-pwd-btn {
  width: 100%;
  padding: 1.2rem;
  background-color: #e79843;
  color: white;
  border: none;
  border-radius: 12px;
  margin: 5px 0;
  font-size: 20px;
  cursor: pointer;
}

.verify-btn {
  height: 63px;
  width: 120px;
  font-size: 16px;
  border: 1px solid #e79843;
  background-color: white;
  color: #e79843;
  border-radius: 8px;
  cursor: pointer;
}

.verify-btn:disabled {
  background-color: #ccc;
  color: #999;
  border-color: #ccc;
  cursor: not-allowed;
}

.verify-btn:hover {
  background-color: #fdf2e1;
}

.login-btn.outlined {
  background-color: white;
  color: #e79843;
  border: 2px solid #e79843;
}

.login-btn.outlined:hover {
  background-color: #fdf2e1;
  color: #d7893e;
  border-color: #d7893e;
}
.login-btn.offset {
  margin-top: 40px;
}

.id-list {
  margin-top: 20px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 8px;
  max-height: 200px;
  overflow-y: auto;
}

.id-item {
  margin-bottom: 5px;
  padding: 8px 12px;
  background-color: #f1f1f1;
  border-radius: 4px;
}

.extra-options {
  font-size: 18px;
  color: #959595;
  margin-bottom: 10px;
}

.extra-options a {
  margin: 3px;
  text-decoration: underline;
  color: #959595;
}

.social-login {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.social-btn-container {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.social-btn {
  width: 70px;
  height: 70px;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.social-divider {
  display: flex;
  align-items: center;
  margin: 20px 0;
  width: 100%;
}

.social-divider::before,
.social-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background-color: #ccc;
}

.social-divider span {
  margin: 0 10px;
  color: #aaa;
  font-size: 19px;
  white-space: nowrap;
}

.kakao {
  background-color: #fee500;
  color: black;
}

.naver {
  background-color: #03c75a;
}

.google {
  background-color: #959595;
}

.email-group {
  display: flex;
  align-items:end;
  gap: 5px;
}

.email-box {
  flex: 1;
  height: 63px;
  padding: 12px 16px;
  border: 1px solid #ccc;
  border-radius: 12px;
  font-size: 21px;
}

.authButton {
  font-size: 18px;
  color: #a0a0a0;
  text-decoration: underline;
  cursor: pointer;
  background: none; 
  border: none;
  padding: 0;
}

.link:hover {
  color: #666;
  text-decoration: none;
}

.find-id-btn,
.find-pwd-btn {
  width: 100%;
  padding: 1.2rem;
  background-color: #e79843;
  color: white;
  border: none;
  border-radius: 12px;
  margin: 10px 0;
  font-size: 20px;
  cursor: pointer;
  text-align: center;
}

.back-btn {
  font-size: 1.2rem; 
  font-weight: bold; 
  color: #7a7a7a;
  background: none;
  border: none;
  padding: 0;
  position: absolute;
  top: 27px; 
  left: 15px;
  cursor: pointer;
}

.back-btn:hover {
  color: #999; 
}

.find-id-btn:hover,
.find-pwd-btn:hover {
  background-color: #d7893e;
}

.found-id {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 10px 0;
}

.subtitle {
  font-size: 1.3rem;
  color: #666;
  margin-bottom: 20px;
}

.error-message {
  color: red;
  font-size: 1.2rem;
  margin-top: 10px;
  margin-bottom: 10px;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

h1 {
  margin-top: 80px;
  margin-bottom: 15px;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 15px; /* 버튼 간격 */
  margin-top: 20px;
}

.login-btn.small {
  padding: 0.8rem 2rem; /* 가로 길이 조정 */
  font-size: 1rem; /* 버튼 텍스트 크기 */
}

.login-btn.small.secondary {
  background-color: #ccc; 
  color: #333;
}

.login-btn.small.secondary:hover {
  background-color: #bbb; /* 호버 시 색상 변경 */
}

</style>