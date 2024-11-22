<template>
    <div>
      <h2>비밀번호 찾기</h2>
      <form @submit.prevent="sendResetLink">
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
        <label>
          이메일:
          <input type="email" v-model="loginId" required />
        </label>
        <br />
        <button type="submit">전송</button>
      </form>
      <p v-if="auth.passwordResetMessage">{{ auth.passwordResetMessage }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useAuthStore } from '@/stores/auth';
  
  const auth = useAuthStore();
  
  const userName = ref('');
  const userPhone = ref('');
  const loginId = ref('');
  
  const sendResetLink = () => {
    auth.sendPasswordResetLink(userName.value, userPhone.value, loginId.value);
  };
  </script>
  