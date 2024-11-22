import { defineStore } from "pinia";
import { useAPI } from "@/axios/useAPI";
import { jwtDecode } from 'jwt-decode';

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("accessToken") || "",
    userRoles: JSON.parse(localStorage.getItem("userRoles")) || [],
    loginError: '',
    findIdMessage: [],
    passwordResetMessage: '',
    //showLoginModal: false,
  }),
  
  actions: {
    async login(loginData) {
      const { post } = useAPI();
      try {
        const formData = new FormData();
        formData.append('username', loginData.username);
        formData.append('password', loginData.password);

        const response = await post('/login', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        const authHeader = response.headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
          const token = authHeader.substring(7);
          const decodedToken = jwtDecode(token);

          this.token = token;
          this.userRoles = Array.isArray(decodedToken.roles) 
            ? decodedToken.roles 
            : [decodedToken.roles];

          localStorage.setItem('accessToken', token);
          localStorage.setItem('userRoles', JSON.stringify(this.userRoles));
          localStorage.setItem('expirationTime', decodedToken.exp);

          this.closeLoginModal();
          return true;
        } else {
          this.loginError = '로그인 토큰을 가져오지 못했습니다.';
          return false;
        }
      } catch (error) {
        this.loginError = error.response?.data?.message || '로그인에 실패했습니다.';
        return false;
      }
    },

    logout() {
      this.token = "";
      this.userRoles = [];
      this.loginError = "";
      //this.showLoginModal = false; 
      localStorage.clear();
    },

    isAuthenticated() {
      const expirationTime = localStorage.getItem('expirationTime');
      return this.token && (!expirationTime || Date.now() < expirationTime * 1000);
    },

    async findLoginIds(userName, userPhone) {
      const { post } = useAPI();
      try {
          const response = await post('/api/auth/find-login-id', { userName, userPhone });
          this.findIdMessage = response.data.data;
      } catch (error) {
          this.findIdMessage = ['사용자 정보를 찾을 수 없습니다.'];
          console.error('아이디 찾기 에러:', error);
      }
     },

    async sendPasswordResetLink(userName, userPhone, loginId) {
      const { post } = useAPI();
      try {
        const response = await post('/api/auth/password-reset/request', {
          userName, userPhone, loginId
        });
        this.passwordResetMessage = response.data;
      } catch (error) {
        this.passwordResetMessage = '입력하신 정보가 일치하지 않습니다.';
        console.error('비밀번호 찾기 에러:', error);
      }
    },

    openLoginModal() {
      console.log("Login Button Clicked");
      this.showLoginModal = true;
    },
    

    closeLoginModal() {
      this.showLoginModal = false;
    },
  }
});