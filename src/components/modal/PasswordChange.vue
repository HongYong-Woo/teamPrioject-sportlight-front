<script setup>
import { ref, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useAPI } from '@/axios/useAPI';
import { Eye, EyeOff } from 'lucide-vue-next';

const emit = defineEmits(['close']);
const router = useRouter();
const auth = useAuthStore();
const { post } = useAPI();

const props = defineProps({
    isOpen: {
        type: Boolean,
        required: true
    }
});

const currentStep = ref('current-password');
const currentPassword = ref('');
const newPwd = ref('');
const passwordConfirm = ref('');
const errorMessage = ref('');
const currentPasswordVisible = ref(false);
const newPwdVisible = ref(false);
const confirmPasswordVisible = ref(false);

const passwordRules = computed(() => ({
    length: newPwd.value?.length >= 8,
    complexity: /(?=.*[A-Za-z])(?=.*\d)|(?=.*[A-Za-z])(?=.*\W)|(?=.*\d)(?=.*\W)/.test(
        newPwd.value || ""
    ),
    noRepeat: !/(.)\1{2,}/.test(newPwd.value || ""),
}));

const isPasswordValid = computed(() => {
    return passwordRules.value.length && passwordRules.value.complexity && passwordRules.value.noRepeat;
});

const passwordMismatchError = computed(() => {
    return newPwd.value && passwordConfirm.value && newPwd.value !== passwordConfirm.value;
});

const verifyCurrentPassword = async () => {
    try {
        const response = await post('/api/auth/verify-password', {
            currentPassword: currentPassword.value
        });

        if (response.data.code === 200) {
            currentStep.value = 'new-password';
            errorMessage.value = '';
        } else {
            errorMessage.value = '현재 비밀번호가 일치하지 않습니다.';
        }
    } catch (error) {
        errorMessage.value = error.response?.data?.message || '비밀번호 확인 중 오류가 발생했습니다.';
    }
};

const changePassword = async () => {
    if (passwordMismatchError.value) {
        errorMessage.value = '새 비밀번호가 일치하지 않습니다.';
        return;
    }

    if (!isPasswordValid.value) {
        errorMessage.value = '비밀번호 규칙을 모두 만족해야 합니다.';
        return;
    }

    try {
        const response = await post('/api/auth/change-password', {
            //currentPassword: currentPassword.value,
            newPwd: newPwd.value
        });

        if (response.data.code === 200) {
            await auth.logout();
            router.push('/');
        } else {
            errorMessage.value = '비밀번호 변경에 실패했습니다.';
        }
    } catch (error) {
        errorMessage.value = error.response?.data?.message || '비밀번호 변경 중 오류가 발생했습니다.';
    }
};

const closeModal = () => {
    currentStep.value = 'current-password';
    currentPassword.value = '';
    newPwd.value = '';
    passwordConfirm.value = '';
    errorMessage.value = '';
    emit('close');
};

watch(() => props.isOpen, (newVal) => {
    if (!newVal) {
        closeModal();
    }
});
</script>

<template>
    <div v-if="isOpen" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
            <button class="close-btn" @click="closeModal">×</button>

            <div v-if="currentStep === 'current-password'">
                <h2>비밀번호 변경</h2>
                <p class="subtitle">현재 비밀번호를 입력해주세요.</p>

                <div class="input-group password-input-wrapper">
                    <input :type="currentPasswordVisible ? 'text' : 'password'" class="input-box" v-model="currentPassword"
                        placeholder="현재 비밀번호" />
                    <button class="password-toggle-btn" @click="currentPasswordVisible = !currentPasswordVisible">
                        <Eye v-if="currentPasswordVisible" class="password-icon" />
                        <EyeOff v-else class="password-icon" />
                    </button>
                </div>

                <button class="submit-btn" @click="verifyCurrentPassword" :disabled="!currentPassword">
                    확인
                </button>
            </div>

            <div v-else>
                <h2>새 비밀번호 설정</h2>
                <p class="subtitle">새로운 비밀번호를 입력해주세요.</p>

                <div class="input-group">
                    <div class="password-input-wrapper">
                        <input :type="newPwdVisible ? 'text' : 'password'" class="input-box" v-model="newPwd"
                            placeholder="새 비밀번호" />
                        <button class="password-toggle-btn" @click="newPwdVisible = !newPwdVisible">
                            <Eye v-if="newPwdVisible" class="password-icon" />
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

                <div class="input-group password-input-wrapper">
                    <input :type="confirmPasswordVisible ? 'text' : 'password'" class="input-box" v-model="passwordConfirm"
                        placeholder="새 비밀번호 확인" />
                    <button class="password-toggle-btn" @click="confirmPasswordVisible = !confirmPasswordVisible">
                        <Eye v-if="confirmPasswordVisible" class="password-icon" />
                        <EyeOff v-else class="password-icon" />
                    </button>
                </div>

                <button class="submit-btn" @click="changePassword" :disabled="!isPasswordValid || passwordMismatchError">
                    변경 완료
                </button>
            </div>

            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </div>
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
    text-align: center;
    padding: 2.5rem;
    width: 420px;
    border-radius: 12px;
    position: relative;
}

.close-btn {
    position: absolute;
    top: 16px;
    right: 16px;
    background: none;
    border: none;
    font-size: 24px;
    color: #666;
    cursor: pointer;
}

h2 {
  margin-top: 30px;
  margin-bottom: 15px;
}

.subtitle {
    color: #666;
    font-size: 14px;
    margin-bottom: 24px;
}

.input-group {
    margin-bottom: 16px;
}

.password-input-wrapper {
    position: relative;
}

.input-box {
    width: 100%;
    height: 48px;
    padding: 0 40px 0 16px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 16px;
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
  border-radius: 8px !important;
}

.submit-btn {
    width: 100%;
    height: 48px;
    background-color: #FF9300;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    margin-top: 12px 0;
}

.submit-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.error-message {
    color: #ff4d4f;
    font-size: 14px;
    margin-top: 8px;
    text-align: center;
}
</style>