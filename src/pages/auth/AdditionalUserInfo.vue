<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAPI } from "@/axios/useAPI";

const router = useRouter();
const { patch } = useAPI();

const formData = ref({
  loginId: "",
  userName: "",
  userPhone: "",
  userGender: "",
  userBirth: "",
  termsAgreement: false,
  personalAgreement: false,
  marketingAgreement: false,
  allAgreement: false
});

const birthError = ref(false);
const phoneError = ref(false);

const validateBirthDate = () => {
  birthError.value = !/^\d{8}$/.test(formData.value.userBirth);
};

const validatePhoneNumber = () => {
  phoneError.value = !/^\d+$/.test(formData.value.userPhone);
};

const validateEmail = () => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.loginId);
};

const isFormInvalid = computed(() => {
  return (
    !formData.value.loginId ||
    !validateEmail() ||
    !formData.value.userName ||
    !formData.value.userPhone ||
    birthError.value ||
    phoneError.value ||
    !formData.value.termsAgreement
  );
});

const toggleAllAgreements = () => {
  const allChecked = formData.value.allAgreement;
  formData.value.termsAgreement = allChecked;
  formData.value.personalAgreement = allChecked;
  formData.value.marketingAgreement = allChecked;
};


const handleSubmit = async () => {
  try {
    await patch('/api/auth/oauth/additional-info', formData.value);
    router.push('/');
  } catch (error) {
    if (error.response?.status === 401) {
      try {
        await auth.refreshToken();
        await patch('/api/auth/oauth/additional-info', formData.value);
        router.push('/');
      } catch (refreshError) {
        auth.logout();
        router.push('/login');
      }
    } else {
      errorMessage.value = error.response?.data?.message || '추가 정보 입력 중 오류가 발생했습니다.';
      console.error('추가 정보 입력 중 오류:', error);
    }
  }
};
</script>

<template>
  <div class="join-container">
    <button @click="goBack" class="back-button">⬅</button>

    <form @submit.prevent="handleSubmit" class="form-container">
      <div class="form-header">
        <h2>추가 정보 입력</h2>
        <p>서비스 이용을 위해 추가 정보를 입력해주세요.</p>
      </div>

      <div class="form-group">
        <label>이메일</label>
        <input type="email" v-model="formData.loginId" placeholder="이메일 입력" required />
      </div>

      <div class="form-group">
        <label>이름</label>
        <input type="text" v-model="formData.userName" placeholder="이름 입력" required />
      </div>

      <div class="form-group">
        <label>휴대폰 번호</label>
        <input type="tel" v-model="formData.userPhone" placeholder="휴대폰 번호 입력 (- 제외)" @input="validatePhoneNumber"
          required />
        <p v-if="phoneError" class="error-message">
          - 없이 숫자만 입력해주세요.
        </p>
      </div>

      <div class="form-group">
        <label>생년월일</label>
        <input type="text" v-model="formData.userBirth" placeholder="ex. 19990101" @input="validateBirthDate" />
        <p v-if="birthError" class="error-message">
          8자리 숫자만 입력해주세요.
        </p>
      </div>

      <div class="form-group">
        <label>성별</label>
        <div class="radio-group">
          <label>
            <input type="radio" value="M" v-model="formData.userGender" />
            남자
          </label>
          <label>
            <input type="radio" value="F" v-model="formData.userGender" />
            여자
          </label>
        </div>
      </div>

      <div class="form-group">
        <div class="checkbox-group">
          <label>
            <input type="checkbox" v-model="formData.allAgreement" @change="toggleAllAgreements" />
            <span class="check-box" :class="{ valid: formData.allAgreement }">
              ✓
            </span>
            전체 약관 동의
          </label>
        </div>

        <div class="checkbox-details">
          <label>
            <input type="checkbox" v-model="formData.termsAgreement" />
            <span class="check-box" :class="{ valid: formData.termsAgreement }">
              ✓
            </span>
            [필수] 서비스 약관 동의
            <a href="#" class="view-link">보기</a>
          </label>

          <label>
            <input type="checkbox" v-model="formData.personalAgreement" />
            <span class="check-box" :class="{ valid: formData.personalAgreement }">
              ✓
            </span>
            [선택] 개인정보처리방침 동의
            <a href="#" class="view-link">보기</a>
          </label>

          <label>
            <input type="checkbox" v-model="formData.marketingAgreement" />
            <span class="check-box" :class="{ valid: formData.marketingAgreement }">
              ✓
            </span>
            [선택] 마케팅 및 활용 동의
          </label>
        </div>
      </div>

      <button type="submit" class="submit-button" :disabled="isFormInvalid">
        입력 완료
      </button>
      <p v-if="errorMessage" class="error-message global-error">
        {{ errorMessage }}
      </p>
    </form>
  </div>
</template>

<style scoped>
.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  font-size: 16px;
  font-weight: bold;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.back-button:hover {
  text-decoration: underline;
}

.join-container {
  position: relative;
  max-width: 700px;
  min-width: 500px;
  margin: 20px auto;
  padding: 120px;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-header h2 {
  margin-top: 10px;
  font-size: 27px;
  text-align: center;
}

.form-header p {
  font-size: 18px;
  text-align: center;
  color: #777;
  margin-top: 20px;
  margin-bottom: 40px;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.form-group label {
  font-weight: bold;
  font-size: 18px;
  color: #585858;
  margin-bottom: 10px;
}

input[type="email"],
input[type="text"],
input[type="tel"] {
  width: 100%;
  height: 55px;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

input:focus {
  outline: none;
  border-color: #FF9300;
}

.radio-group {
  display: flex;
  gap: 15px;
}

.checkbox-group {
  margin-top: 10px;
}

.check-box {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 16px;
  height: 16px;
  font-size: 12px;
  color: #ccc;
  transition: color 0.3s ease;
}

.checkbox-details label {
  font-weight: normal;
  font-size: 14px;
  display: flex;
  align-items: center;
  margin-top: 8px;
  margin-left: 10px;
  gap: 8px;
}

.check-box.valid {
  color: #FF9300;
}

input[type="checkbox"] {
  display: none;
}

.error-message {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}

.submit-button {
  width: 100%;
  height: 55px;
  background-color: #ff9300;
  color: white;
  font-size: 16px;
  font-weight: bold;
  padding: 12px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  margin-top: 40px;
}

.submit-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.radio-group label {
  font-weight: normal;
}

.view-link {
  margin-left: 10px;
  color: #ff9300;
  text-decoration: underline;
  font-size: 14px;
  cursor: pointer;
}

.view-link:hover {
  color: #d67e00;
}

.success-message {
  color: #28a745;
  font-size: 12px;
  margin-top: 5px;
}

.global-error {
  text-align: center;
  margin-top: 10px;
  font-size: 14px;
  padding: 10px;
  background-color: #fff3f3;
  border: 1px solid #ffcdd2;
  border-radius: 4px;
}
</style>