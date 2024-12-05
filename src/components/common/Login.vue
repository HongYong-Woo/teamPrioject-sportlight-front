<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from "@/stores/auth";
import { useAPI } from "@/axios/useAPI";
import { Eye, EyeOff } from 'lucide-vue-next';


const currentStep = ref('login');

const auth = useAuthStore();
console.log("auth 상태 확인:", auth);
console.log("auth.openLoginModal:", auth.openLoginModal);
console.log("auth.closeLoginModal:", auth.closeLoginModal);

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

const loginPasswordVisible = ref(false);
const newPasswordVisible = ref(false);
const confirmPasswordVisible = ref(false);

const verificationCode = ref('');

const loginData = ref({
  username: '',
  password: '',
});

const passwordFieldType = ref("password");

const switchVisibility = () => {
  passwordFieldType.value = passwordFieldType.value === "password" ? "text" : "password";
};

function closeModal() {
  try {
    isVisible.value = false;
    currentStep.value = 'login';
    loginError.value = '';
    userName.value = '';
    userPhone.value = '';
    loginId.value = '';
    verificationCode.value = '';
    loginIds.value = [];
    loginData.value = {
      username: '',
      password: ''
    };
    passwordConfirm.value = '';
    isCodeSent.value = false;
    if (timerInterval.value) {
      clearInterval(timerInterval.value);
      timerInterval.value = null;
    }
    timer.value = 180;
    passwordResetSuccess.value = false;
    auth.closeLoginModal();
    emit('close');
  } catch (error) {
    console.error('Error in closeModal:', error);
  } finally {
    if (route.query.showLoginModal) {
      router.replace({
        query: {
          ...Object.fromEntries(
            Object.entries(route.query).filter(([key]) => key !== 'showLoginModal')
          )
        }
      });
    }
  }
}

function handleKeydown(event) {
  if (event.key === 'Escape') {
    closeModal();
  }
};

const handleLogin = async () => {
  try {
    const success = await auth.handleLogin(loginData.value);
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
    if (!newValue) {
      closeModal();
    }
  },
  { immediate: true }
);

watch(
  currentStep,
  () => {
    loginError.value = '';
  }
);


const handleFindId = async () => {
  try {
    await auth.findLoginIds(userName.value, userPhone.value);
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
    const response = await post("/auth/password-reset/request", {
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
    const response = await post("/auth/verify-code", {
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
  console.log("changePassword 함수 실행됨");

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
    console.log("API 요청 시작");
    const response = await post("/auth/password-reset/confirm", {
      newPwd: loginData.value.password,
    });

    console.log("API 응답:", response);

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

const passwordRules = computed(() => ({
  length: loginData.value.password?.length >= 8,
  complexity: /(?=.*[A-Za-z])(?=.*\d)|(?=.*[A-Za-z])(?=.*\W)|(?=.*\d)(?=.*\W)/.test(
    loginData.value.password || ""
  ),
  noRepeat: !/(.)\1{2,}/.test(loginData.value.password || ""),
}));

const isPasswordValid = computed(() => {
  return passwordRules.value.length && passwordRules.value.complexity && passwordRules.value.noRepeat;
});

const passwordMismatchError = computed(() => {
  return (
    loginData.value.password &&
    passwordConfirm.value &&
    loginData.value.password !== passwordConfirm.value
  );
});

function validatePassword() {
  console.log("비밀번호 유효성 검증:", passwordRules.value);
}

function validatePasswordConfirm() {
  console.log("비밀번호 확인 유효성 검증:", !passwordMismatchError.value);
}


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
  window.addEventListener('message', messageHandler);
  window.addEventListener('keydown', handleKeydown);
  if (route.query.showLoginModal === 'true') {
    isVisible.value = true;
    auth.openLoginModal();
  }
});

onUnmounted(() => {
  window.removeEventListener('message', messageHandler);
  window.removeEventListener('keydown', handleKeydown);
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
    timerInterval.value = null;
  }
  closeModal();
});

const handleSocialLogin = (provider) => {
  const width = 500;
  const height = 600;
  const left = window.screen.width / 2 - width / 2;
  const top = window.screen.height / 2 - height / 2;

  const popup = window.open(
    `http://localhost:8080/api/oauth2/authorization/${provider}`,
    'OAuth2 Login',
    `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`
  );

  if (!popup || popup.closed || typeof popup.closed === 'undefined') {
    loginError.value = "팝업이 차단되었습니다. 팝업 차단을 해제해주세요.";
    return;
  }
};

const messageHandler = async (event) => {
  // CORS 검증
  if (event.origin !== 'http://localhost:8080') return;

  const data = event.data;

  // 에러 처리
  if (data.error) {
    loginError.value = data.error;
    return;
  }

  // 성공 처리
  if (data.token) {
    try {
      localStorage.setItem('accessToken', data.token);
      const success = await auth.setLoginSuccess(data.token);
      
      if (success) {
        if (data.requiresAdditionalInfo) {
          router.push('/additional-info');
        } else {
          closeModal();
          // 필요한 경우 페이지 새로고침 또는 상태 업데이트
          window.location.reload();
        }
      }
    } catch (error) {
      console.error('로그인 처리 중 오류:', error);
      loginError.value = "로그인 처리 중 오류가 발생했습니다.";
    }
  }
};

onMounted(() => {
  window.addEventListener('message', messageHandler);
});

onUnmounted(() => {
  window.removeEventListener('message', messageHandler);
});

</script>

<template>
  <div v-if="isVisible" class="modal-overlay">
    <transition name="fade-slide">
      <div class="modal-content">
        <button class="back-btn" v-if="currentStep !== 'login'"
          @click="currentStep = currentStep === 'find-id' ? 'login' : 'login'">
          ⬅
        </button>
        <button class="close-btn" @click="closeModal">×</button>

        <div v-if="currentStep === 'login'">
          <img src="@/assets/logo.png" alt="Logo" class="modal-logo" />
          <form @submit.prevent="handleLogin">
            <div class="input-group">
              <input type="email" class="input-box" placeholder="이메일" v-model="loginData.username" required />
            </div>
            <div class="input-group">
              <div class="input-group password-input-wrapper">
                <input :type="loginPasswordVisible ? 'text' : 'password'" class="input-box" placeholder="비밀번호"
                  v-model="loginData.password" required />
                <button type="button" class="password-toggle-btn" @click="loginPasswordVisible = !loginPasswordVisible">
                  <Eye v-if="loginPasswordVisible" class="password-icon" />
                  <EyeOff v-else class="password-icon" />
                </button>
              </div>
            </div>
            <button type="submit" class="login-btn">로그인</button>
          </form>
          <p v-if="loginError" class="error-message">{{ loginError }}</p>
          <div class="extra-options">
            <button @click="currentStep = 'find-pwd'" class="authButton">비밀번호 찾기</button> |
            <a href="/join">회원가입</a> |
            <button @click="currentStep = 'find-id'" class="authButton">이메일(아이디) 찾기</button>
          </div>

          <div class="social-login">
            <div class="social-divider">
              <span>간편 회원가입</span>
            </div>
            <div v-if="loginError && loginError.includes('팝업')" class="popup-blocker-warning">
              {{ loginError }}
            </div>
            <div class="social-btn-container">
              <button class="social-btn kakao" @click.prevent="handleSocialLogin('kakao')">
                Kakao
              </button>
              <button class="social-btn naver" @click.prevent="handleSocialLogin('naver')">
                Naver
              </button>
              <button class="social-btn google" @click.prevent="handleSocialLogin('google')">
                Google
              </button>
            </div>
          </div>
        </div>

        <div v-if="currentStep === 'find-pwd'">
          <h2>비밀번호 찾기</h2>
          <p class="subtitle">이름, 전화번호, 이메일을 입력하시고<br /> 해당 이메일에서 인증코드를 확인해주세요.</p>
          <div class="input-group">
            <input type="text" class="input-box" placeholder="이름" v-model="userName" required />
          </div>
          <div class="input-group">
            <input type="text" class="input-box" placeholder="휴대폰 번호 입력 (- 제외)" v-model="userPhone" required />
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
          <h2>비밀번호 변경</h2>
          <p class="subtitle">새 비밀번호를 입력하고 변경 버튼을 눌러주세요.</p>

          <div class="input-group">
            <div class="input-group">
              <div class="password-input-wrapper">
                <input :type="newPasswordVisible ? 'text' : 'password'" class="input-box" placeholder="새 비밀번호"
                  v-model="loginData.password" @input="validatePassword" required />
                <button type="button" class="password-toggle-btn" @click="newPasswordVisible = !newPasswordVisible">
                  <Eye v-if="newPasswordVisible" class="password-icon" />
                  <EyeOff v-else class="password-icon" />
                </button>
              </div>
              <div class="password-rules">
                <div :class="{ valid: passwordRules.length }">
                  <span class="check-box" :class="{ valid: passwordRules.length }">✓</span>
                  <span>8자 이상</span>
                </div>
                <div :class="{ valid: passwordRules.complexity }">
                  <span class="check-box" :class="{ valid: passwordRules.complexity }">✓</span>
                  <span>숫자와 영문자 조합</span>
                </div>
                <div :class="{ valid: passwordRules.noRepeat }">
                  <span class="check-box" :class="{ valid: passwordRules.noRepeat }">✓</span>
                  <span>같은 문자 3회 연속 사용 불가</span>
                </div>
              </div>
            </div>
          </div>

          <div class="input-group">
            <div class="input-group password-input-wrapper">
              <input :type="confirmPasswordVisible ? 'text' : 'password'" class="input-box" placeholder="새 비밀번호 확인"
                v-model="passwordConfirm" @input="validatePasswordConfirm" required />
              <button type="button" class="password-toggle-btn" @click="confirmPasswordVisible = !confirmPasswordVisible">
                <Eye v-if="confirmPasswordVisible" class="password-icon" />
                <EyeOff v-else class="password-icon" />
              </button>
            </div>
            <p v-if="passwordMismatchError" class="error-message">비밀번호가 일치하지 않습니다.</p>
          </div>

          <button class="login-btn" @click="changePassword" :disabled="!isPasswordValid || passwordMismatchError">
            변경 완료
          </button>

          <p v-if="loginError" class="error-message">{{ loginError }}</p>
        </div>


        <div v-if="currentStep === 'find-id'">
          <h2>아이디 찾기</h2>
          <p class="subtitle">정보를 입력하시면<br />
            회원님의 이메일이 표시됩니다.</p>
          <div class="input-group">
            <input type="text" class="input-box" placeholder="이름" v-model="userName" required />
          </div>
          <div class="input-group">
            <input type="text" class="input-box" placeholder="휴대폰 번호 입력 (- 제외)" v-model="userPhone" required />
          </div>
          <button class="find-id-btn" @click="handleFindId">아이디 찾기</button>
          <p v-if="loginError" class="error-message">
            {{ loginError }}
          </p>
        </div>

        <div v-if="currentStep === 'check-id'">
          <h2>아이디 확인</h2>
          <p class="subtitle">회원님의 이메일을 확인하세요</p>
          <div v-if="loginIds.length > 0" class="id-list">
            <div v-for="id in loginIds" :key="id" class="id-item">
              {{ id }}
            </div>
          </div>
          <p v-else>일치하는 아이디를 찾을 수 없습니다.</p>
          <div class="button-group">
            <button class="login-btn standard" @click="currentStep = 'login'">로그인 하기</button>
            <button class="login-btn outlined" @click="currentStep = 'find-pwd'">비밀번호 찾기</button>
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
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2.5rem;
  width: 420px;
  height: 530px;
  min-width: 350px;
  border-radius: 12px;
  text-align: center;
  position: relative;
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
  overflow-y: hidden;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.close-btn {
  position: absolute;
  top: 9px;
  right: 25px;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #a0a0a0;
  cursor: pointer;
}

.close-btn:hover {
  color: #999;
}

.modal-logo {
  width: 200px;
  margin: 30px auto 20px;
}

.input-group {
  margin-bottom: 3px;
}

.input-box {
  width: 100%;
  height: 52px;
  padding: 0.9rem;
  margin-top: 6px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
}

.email-group div:first-of-type input {
  border-radius: 10px;
}

.login-btn {
  width: 100%;
  height: 52px;
  background-color: #FF9300;
  color: white;
  border: none;
  border-radius: 8px;
  margin: 7px 0;
  font-size: 16px;
  cursor: pointer;
}

.reset-pwd-btn {
  width: 100%;
  height: 53px;
  background-color: #FF9300;
  color: white;
  border: none;
  border-radius: 8px;
  margin: 5px 0;
  font-size: 16px;
  cursor: pointer;
}

.verify-btn {
  height: 50px;
  width: 80px;
  font-size: 15px;
  border: 1px solid #FF9300;
  background-color: white;
  color: #FF9300;
  border-radius: 8px !important;
  cursor: pointer;
}

.verify-btn:disabled {
  background-color: #ccc;
  color: #999;
  border-color: #ccc;
  cursor: not-allowed;
  border-radius: 8px;
}

.verify-btn:hover {
  background-color: #fdf2e1;
}

.login-btn.outlined {
  background-color: white;
  color: #FF9300;
  border: 2px solid #FF9300;
}

.login-btn.outlined:hover {
  background-color: #fdf2e1;
  color: #FF9300;
  border-color: #FF9300;
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
  font-size: 13px;
  margin-bottom: 5px;
  padding: 8px 12px;
  background-color: #f1f1f1;
  border-radius: 4px;
}

.extra-options {
  font-size: 13px;
  color: #959595;
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
  gap: 15px;
}

.social-btn {
  width: 55px;
  height: 55px;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.social-btn:hover {
  transform: translateY(-2px);
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
  font-size: 13px;
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
  align-items: end;
  gap: 5px;
  margin-bottom: 3px;
}

.email-box {
  flex: 1;
  height: 50px;
  padding: 12px 16px;
  border: 1px solid #ccc;
  border-radius: 8px !important;
  font-size: 16px;
}

.authButton {
  font-size: 13px;
  color: #a0a0a0;
  text-decoration: underline;
  cursor: pointer;
  background: none;
  border: none;
  padding: 3px;
  margin-top: 5px;
  margin-bottom: 3px;
}

.link:hover {
  color: #666;
  text-decoration: none;
}

.find-id-btn,
.find-pwd-btn {
  width: 100%;
  height: 53px;
  background-color: #FF9300;
  color: white;
  border: none;
  border-radius: 8px;
  margin: 10px 0;
  font-size: 16px;
  cursor: pointer;
  text-align: center;
}

.back-btn {
  font-size: 1.0rem;
  font-weight: bold;
  color: #7a7a7a;
  background: none;
  border: none;
  padding: 0;
  position: absolute;
  top: 19px;
  left: 25px;
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
  font-size: 15px;
  font-weight: bold;
  margin: 10px 0;
}

.subtitle {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 20px;
}

.error-message {
  color: red;
  font-size: 0.8rem;
  margin-bottom: 5px;
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

h2 {
  margin-top: 30px;
  margin-bottom: 15px;
}

.button-group {
  display: flex;
  justify-content: center;
  height: 67px;
  gap: 15px;
  margin-top: 20px;
}

.login-btn.small {
  padding: 0.8rem 2rem;
  font-size: 16px;
}

.login-btn.small.secondary {
  background-color: #ccc;
  color: #333;
}

.login-btn.small.secondary:hover {
  background-color: #bbb;
}

.password-rules {
  margin-top: 10px;
}

.password-rules div {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ccc;
  font-size: 14px;
  margin-bottom: 4px;
}

.password-rules div.valid {
  color: #FF9300;
}

.password-input-wrapper {
  position: relative;
  width: 100%;
}

.password-toggle-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 4px;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle-btn:hover {
  color: #333;
}

.password-icon {
  width: 20px;
  height: 20px;
}

.password-input-wrapper .input-box {
  padding-right: 45px;
}

.popup-blocker-warning {
  background-color: #fff3cd;
  border: 1px solid #ffeeba;
  color: #856404;
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
