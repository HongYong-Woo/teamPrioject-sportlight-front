<template>
  <div class="join-container">
    <button @click="goBack" class="back-button">⬅</button>

    <form @submit.prevent="handleSubmit" class="form-container">
      <div class="form-header">
        <h2>Spotlight에 개설된<br />수많은 클래스를 이용해보세요!</h2>
        <p>현재 {{ totalCourses }}개의 강좌가 개설되어있어요.</p>
      </div>

      <div class="form-group">
        <label>이메일</label>
        <div class="email-container">
          <input type="email" v-model="formData.loginId" placeholder="이메일 입력" :class="loginIdInputClass"
            @input="resetloginIdValidation" required />
          <button type="button" @click="validateloginId" class="validate-button">
            중복 확인
          </button>
        </div>
        <p v-if="loginIdValidationMessage" :class="loginIdValidationClass">
          {{ loginIdValidationMessage }}
        </p>
      </div>

      <div class="form-group">
        <label>비밀번호</label>
  <div class="password-input-wrapper">
    <input
      :type="passwordVisible ? 'text' : 'password'"
      v-model="formData.loginPwd"
      placeholder="8자 이상, 숫자와 영문자 조합"
      required
    />
    <button
      type="button"
      class="password-toggle-btn"
      @click.stop="passwordVisible = !passwordVisible"
    >
      <Eye v-if="passwordVisible" class="password-icon" />
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

<div class="form-group">
  <label>비밀번호 확인</label>
  <div class="password-input-wrapper">
    <input
      :type="confirmPasswordVisible ? 'text' : 'password'"
      v-model="formData.passwordConfirm"
      placeholder="비밀번호 재입력"
      required
    />
    <button
      type="button"
      class="password-toggle-btn"
      @click.stop="confirmPasswordVisible = !confirmPasswordVisible"
    >
      <Eye v-if="confirmPasswordVisible" class="password-icon" />
      <EyeOff v-else class="password-icon" />
    </button>
  </div>
  <p v-if="passwordMismatchError" class="error-message">비밀번호가 일치하지 않습니다.</p>
</div>


      <div class="form-group">
        <label>닉네임</label>
        <div class="nickname-container">
          <input type="text" v-model="formData.userNickname" placeholder="닉네임 입력" :class="nicknameInputClass"
            @input="resetNicknameValidation" required />
          <button type="button" @click="validateNickname" class="validate-button">
            중복 확인
          </button>
        </div>
        <p v-if="nicknameValidationMessage" :class="nicknameValidationClass">
          {{ nicknameValidationMessage }}
        </p>
      </div>

      <div class="form-group">
        <label>이름</label>
        <input type="text" v-model="formData.userName" placeholder="이름 입력" />
      </div>

      <div class="form-group">
        <label>휴대폰 번호</label>
        <input type="tel" v-model="formData.userPhone" placeholder="휴대폰 번호 입력 (- 제외)" @input="validatePhoneNumber" />
        <p v-if="phoneError" class="error-message">- 없이 숫자만 입력해주세요.</p>
      </div>

      <div class="form-group">
        <label>생년월일</label>
        <input type="text" v-model="formData.userBirth" placeholder="ex. 19990101" @input="validateBirthDate" />
        <p v-if="birthError" class="error-message">8자리 숫자만 입력해주세요.</p>
      </div>

      <div class="form-group">
        <label>성별</label>
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
        <div class="checkbox-group">
          <label>
            <input type="checkbox" v-model="formData.allAgreement" @change="toggleAllAgreements" />
            <span class="check-box" :class="{ valid: formData.allAgreement }">✓</span>
            전체 약관 동의
          </label>
        </div>
        <div class="checkbox-details">
          <label>
            <input type="checkbox" v-model="formData.termsAgreement" />
            <span class="check-box" :class="{ valid: formData.termsAgreement }">✓</span>
            [필수] 서비스 약관 동의
            <a href="아직이에용" target="_blank" rel="noopener noreferrer" class="view-link">
              보기
            </a>
          </label>
          <label>
            <input type="checkbox" v-model="formData.personalAgreement" />
            <span class="check-box" :class="{ valid: formData.personalAgreement }">✓</span>
            [선택] 개인정보처리방침 동의
            <a href="아마 노션링크?" target="_blank" rel="noopener noreferrer" class="view-link">
              보기
            </a>
          </label>
          <label>
            <input type="checkbox" v-model="formData.marketingAgreement" />
            <span class="check-box" :class="{ valid: formData.marketingAgreement }">✓</span>
            [선택] 마케팅 및 활용 동의
          </label>
        </div>
      </div>

      <button type="submit" class="submit-button" :disabled="isFormInvalid">
        가입하기
      </button>
    </form>
  </div>
</template>
 
<script setup>
import { ref, computed } from "vue";
import { useAPI } from "@/axios/useAPI";
import { useRouter } from "vue-router";
import { Eye, EyeOff } from "lucide-vue-next";

const { post, get } = useAPI();
const router = useRouter();
const totalCourses = 1000;

const formData = ref({
  loginId: "",
  loginPwd: "",
  passwordConfirm: "",
  userNickname: "",
  userName: "",
  userGender: "",
  userBirth: "",
  userPhone: "",
  termsAgreement: false,
  personalAgreement: false,
  marketingAgreement: false,
  allAgreement: false,
});


const passwordVisible = ref(false);
const confirmPasswordVisible = ref(false);


const passwordMismatchError = computed(() => formData.value.loginPwd !== formData.value.passwordConfirm);

const passwordRules = computed(() => ({
  length: formData.value.loginPwd.length >= 8,
  complexity: /(?=.*[A-Za-z])(?=.*\d)|(?=.*[A-Za-z])(?=.*\W)|(?=.*\d)(?=.*\W)/.test(formData.value.loginPwd),
  noRepeat: !/(.)\1{2,}/.test(formData.value.loginPwd),
}));

const birthError = ref(false);
const phoneError = ref(false);

const validateBirthDate = () => {
  birthError.value = !/^\d{8}$/.test(formData.value.userBirth);
};

const validatePhoneNumber = () => {
  phoneError.value = !/^\d+$/.test(formData.value.userPhone);
};

const isFormInvalid = computed(() => {
  return (
    !formData.value.loginId ||
    !formData.value.loginPwd ||
    passwordMismatchError.value ||
    birthError.value ||
    phoneError.value ||
    !formData.value.termsAgreement
  );
});

const loginIdValidationMessage = ref("");
const loginIdValidationClass = ref("");
const loginIdInputClass = ref("");

const validateloginId = async () => {
  if (!formData.value.loginId) {
    loginIdValidationMessage.value = "이메일을 입력해주세요.";
    loginIdValidationClass.value = "error-message";
    loginIdInputClass.value = "invalid";
    return;
  }

  try {
    const response = await get("/my/check-loginId", {
      params: { loginId: formData.value.loginId },
    });

    if (response.data && response.data.data) {
      loginIdValidationMessage.value = "사용 가능한 이메일입니다.";
      loginIdValidationClass.value = "success-message";
      loginIdInputClass.value = "valid";
    }
  } catch (error) {
    if (error.response && error.response.status === 409) {
      loginIdValidationMessage.value = "이미 사용 중인 이메일입니다.";
      loginIdValidationClass.value = "error-message";
      loginIdInputClass.value = "invalid";
    } else {
      console.error(error);
      loginIdValidationMessage.value = "오류가 발생했습니다. 다시 시도해주세요.";
      loginIdValidationClass.value = "error-message";
      loginIdInputClass.value = "invalid";
    }
  }
};

const resetloginIdValidation = () => {
  loginIdValidationMessage.value = "";
  loginIdValidationClass.value = "";
  loginIdInputClass.value = "";
};

const nicknameValidationMessage = ref("");
const nicknameValidationClass = ref("");
const nicknameInputClass = ref("");

const validateNickname = async () => {
  if (!formData.value.userNickname) {
    nicknameValidationMessage.value = "닉네임을 입력해주세요.";
    nicknameValidationClass.value = "error-message";
    nicknameInputClass.value = "invalid";
    return;
  }

  try {
    const response = await get("/my/check-nickname", {
      params: { userNickname: formData.value.userNickname },
    });

    if (response.data && response.data.data) {
      nicknameValidationMessage.value = "사용 가능한 닉네임입니다.";
      nicknameValidationClass.value = "success-message";
      nicknameInputClass.value = "valid";
    }
  } catch (error) {
    if (error.response && error.response.status === 409) {
      nicknameValidationMessage.value = "이미 사용 중인 닉네임입니다.";
      nicknameValidationClass.value = "error-message";
      nicknameInputClass.value = "invalid";
    } else {
      console.error(error);
      nicknameValidationMessage.value = "오류가 발생했습니다. 다시 시도해주세요.";
      nicknameValidationClass.value = "error-message";
      nicknameInputClass.value = "invalid";
    }
  }
};

const resetNicknameValidation = () => {
  nicknameValidationMessage.value = "";
  nicknameValidationClass.value = "";
  nicknameInputClass.value = "";
};

const toggleAllAgreements = () => {
  const allChecked = formData.value.allAgreement;
  formData.value.termsAgreement = allChecked;
  formData.value.personalAgreement = allChecked;
  formData.value.marketingAgreement = allChecked;
};

const handleSubmit = async () => {
  const payload = { ...formData.value };
  delete payload.passwordConfirm;
  delete payload.allAgreement;

  try {
    const response = await post("/join", payload);
    if (response.status === 200) {
      router.push("/");
    }
  } catch (error) {
    console.error(error);
  }
};

const goBack = () => {
  router.go(-1);
};
</script>
 
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

.email-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

input[type="email"],
input[type="password"],
input[type="text"],
input[type="tel"],
button {
  width: 100%;
  height: 55px;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
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

.error-message {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}

.submit-button {
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


.nickname-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

input.valid {
  border: 2px solid #ff9300;
  color: #ff9300;
  background-color: #fff;
}

input.invalid {
  border: 2px solid red;
  color: red;
  background-color: #fff;
}

.validate-button {
  width: 30%;
  border: 2px solid #ff9300;
  color: #ff9300;
  background-color: #fff;
  border-radius: 5px;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.validate-button:disabled {
  background-color: #ccc;
  border-color: #ccc;
  color: #999;
  cursor: not-allowed;
}

.success-message {
  color: #28a745;
  font-size: 12px;
  margin-top: 5px;
}

.view-link {
  margin-left: 10px;
  color: #ff9300;
  text-decoration: underline;
  font-size: 14px;
  cursor: pointer;
}

.view-link:hover {
  color: #0056b3;
  text-decoration: underline;
}

.password-input-wrapper {
  position: relative;
  width: 100%;
}

.password-input-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}

.password-input-wrapper input {
  width: 100%;
  height: 55px;
  padding: 12px 45px 12px 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  box-sizing: border-box;
}

.password-toggle-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 30px; 
  height: 30px;
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  z-index: 1;
}

.password-icon {
  width: 20px;
  height: 20px;
  pointer-events: none;
  display: block;
}

.password-input-wrapper input:focus {
  outline: none;
  border-color: #FF9300;
}

.password-toggle-btn:hover {
  color: #333;
}

.password-input-wrapper input[type="password"],
.password-input-wrapper input[type="text"] {
  margin-top: 6px;
  background-color: #fff;
}
</style>