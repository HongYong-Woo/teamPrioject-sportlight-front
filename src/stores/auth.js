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
    userInfo: null,
    showLoginModal: false,
    lastRefreshTime: null,
    refreshTimeout: null,
    minimumRefreshInterval: 5 * 60 * 1000,
  }),
  
  actions: {
    async login(loginData) {
      const { post } = useAPI();
      try {
        console.log("로그인 시도:", loginData);
        
        const formData = new FormData();
        formData.append('username', loginData.username);
        formData.append('password', loginData.password);
  
        const response = await post('/login', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
  
        if (response.data?.code === 200) {
          const token = response.data.token;
          const decodedToken = jwtDecode(token);
  
          this.token = token;
          this.userRoles = Array.isArray(decodedToken.roles) 
            ? decodedToken.roles 
            : [decodedToken.roles];
  
          localStorage.setItem('accessToken', token);
          localStorage.setItem('userRoles', JSON.stringify(this.userRoles));
  
          await this.fetchUserProfile();
          return true;
        }
        
        this.token = "";
        this.userRoles = [];
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userRoles');
        
        this.loginError = response.data?.message || '로그인에 실패했습니다';
        return false;
      } catch (error) {
        console.error("로그인 에러:", error);
        this.token = "";
        this.userRoles = [];
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userRoles');
        
        this.loginError = error.response?.data?.message || '로그인에 실패했습니다';
        return false;
      }
    },
    async fetchUserProfile() {
      try {
        const { get } = useAPI();
        const response = await get('/my/profile');
        
        if (response.data?.data) {
          const userData = response.data.data;
          
          this.userInfo = {
            ...userData,
            userImage: userData.userImage || '/assets/default_img.jpg'
          };
          
          return this.userInfo;
        }
      } catch (error) {
        console.error("프로필 정보 가져오기 실패:", error);
        this.userInfo = null;
        throw error;
      }
    },

    async logout() {
      try {
        const { post } = useAPI();
        await post('/logout');
        
        this.token = "";
        this.userRoles = [];
        this.loginError = "";
        this.showLoginModal = false;
        this.userInfo = null;
        
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userRoles');
        
      } catch (error) {
        console.error('로그아웃 실패', error);
      }
    },

    isAuthenticated() {
      try {
        if (!this.token) return false;
        
        const decodedToken = jwtDecode(this.token);
        const currentTime = Date.now() / 1000;
    
        if (decodedToken.exp > currentTime) {
          return true; 
        } else {
          return this.refreshToken();
        }
      } catch (error) {
        return false;
      }
    },

    async findLoginIds(userName, userPhone) {
      const { post } = useAPI();
      try {
        const response = await post('/api/auth/find-login-id', { userName, userPhone });
        this.findIdMessage = response.data.data;
      } catch (error) {
        this.findIdMessage = ['사용자 정보를 찾을 수 없습니다.'];
      }
    },

    async sendPasswordResetLink(userName, userPhone, loginId) {
      const { post } = useAPI();
      try {
        const response = await post('/api/auth/password-reset/request', {
          userName,
          userPhone,
          loginId
        });
        this.passwordResetMessage = response.data;
      } catch (error) {
        this.passwordResetMessage = '입력하신 정보가 일치하지 않습니다.';
      }
    },

    openLoginModal() {
      this.showLoginModal = true;
    },

    closeLoginModal() {
      this.showLoginModal = false;
    },

    async refreshToken() {
      const { post } = useAPI();
      try {
        const now = Date.now();
        if (this.lastRefreshTime && (now - this.lastRefreshTime) < this.minimumRefreshInterval) {
          return false;
        }
    
        const response = await post("/api/auth/reissue");
        console.log("토큰 재발급 응답:", response);
        
        if (response.data?.code === 200) {
          const token = response.data.token || response.data.data;
          
          if (!token) {
            console.error("토큰이 응답에 없음:", response.data);
            return false;
          }
    
          try {
            const decodedToken = jwtDecode(token);
            
            this.token = token;
            this.userRoles = Array.isArray(decodedToken.roles) 
              ? decodedToken.roles 
              : [decodedToken.roles];
    
            localStorage.setItem("accessToken", token);
            localStorage.setItem("userRoles", JSON.stringify(this.userRoles));
            
            await this.fetchUserProfile();
            
            this.lastRefreshTime = now;
            return true;
          } catch (decodeError) {
            console.error("토큰 디코딩 실패:", decodeError);
            return false;
          }
        }
        
        return false;
      } catch (error) {
        console.error("토큰 재발급 요청 실패:", error.response?.data || error);
        await this.logout();
        return false;
      }
    },

    async updateProfile(formData) {
      const { patch } = useAPI();
      try {
        await patch('/my/profile', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        await this.fetchUserProfile();
        await this.refreshToken();
        
        return true;
      } catch (error) {
        console.error('프로필 업데이트 실패:', error);
        throw error;
      }
    },

    async setLoginSuccess(token) {
      try {
          const decodedToken = jwtDecode(token);
          
          this.token = token;
          this.userRoles = Array.isArray(decodedToken.roles) 
              ? decodedToken.roles 
              : [decodedToken.roles];
  
          localStorage.setItem('accessToken', token);
          localStorage.setItem('userRoles', JSON.stringify(this.userRoles));
  
          await this.fetchUserProfile();
          return true;
      } catch (error) {
          console.error('소셜 로그인 처리 실패:', error);
          return false;
      }
  }

  }
});