import { defineStore } from "pinia";
import { useAPI } from "@/axios/useAPI";
import { jwtDecode } from 'jwt-decode';
import router from "@/routers";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("accessToken") || "",
    userRoles: (() => {
      try {
        return JSON.parse(localStorage.getItem("userRoles") || "[]");
      } catch {
        return [];
      }
    })(),
    loginError: '',
    findIdMessage: [],
    passwordResetMessage: '',
    userInfo: null,
    showLoginModal: false,
    lastRefreshTime: null,
    refreshTimeout: null,
    minimumRefreshInterval: 5 * 60 * 1000,
  }),

  getters: {
    isAuthenticated() {
      try {
        if (!this.token) return false;
        const decodedToken = jwtDecode(this.token);
        return Date.now() / 1000 < decodedToken.exp;
      } catch (error) {
        console.error("JWT 디코딩 실패:", error);
        return false;
      }
    }
  },
  
  actions: {
    async handleLogin(loginData) {
      try {
        const formData = new FormData();
        formData.append('username', loginData.username);
        formData.append('password', loginData.password);
    
        const { post } = useAPI();
        const response = await post('/login', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
    
        console.log('로그인 응답 데이터:', response.data);
    
        const { token, roles } = response.data;
    
        if (token && roles) {
          return await this.setLoginSuccess(token, roles);
        }
    
        this.loginError = response.data?.message || '로그인에 실패했습니다';
        return false;
      } catch (error) {
        console.error('로그인 에러:', error);
        this.loginError = error.response?.data?.message || '로그인에 실패했습니다';
        return false;
      }
    },
    

    async setLoginSuccess(token, roles) {
      try {
        this.token = token;
        this.userRoles = roles;
    
        localStorage.setItem('accessToken', token);
        localStorage.setItem('userRoles', JSON.stringify(roles));
    
        await this.fetchUserProfile();
        return true;
      } catch (error) {
        console.error('로그인 처리 실패:', error);
        this.clearAuthState();
        return false;
      }
    },

    async fetchUserProfile() {
      try {
          const { get } = useAPI();
          const response = await get('/my/profile');
          
          if (response.data?.data) {
              this.userInfo = {
                  ...response.data.data,
                  userImage: response.data.data.userImage || new URL('@/assets/default_img.jpg', import.meta.url).href,
                  couponCount: response.data.data.couponCount || 0
              };
          }
      } catch (error) {
          console.error("프로필 정보 가져오기 실패:", error);
          this.userInfo = null;
      }
    },

    

    async refreshToken() {
      if (!this.canRefresh()) return false;

      try {
        const { post } = useAPI();
        const response = await post("/auth/reissue");
        
        if (response.data?.code === 200) {
          const token = response.data.token || response.data.data;
          if (!token) throw new Error("토큰이 응답에 없음");
          
          return this.setLoginSuccess(token);
        }
        return false;
      } catch (error) {
        console.error("토큰 갱신 실패:", error);
        await this.logout();
        return false;
      }
    },

    async logout() {
      try {
        const { post } = useAPI();
        await post('/logout');
        router.push('/');
      } catch (error) {
        console.error('로그아웃 실패:', error);
        router.push('/');
      } finally {
        this.clearAuthState();
        router.push('/');
      }
    },

    clearAuthState() {
      this.token = "";
      this.userRoles = [];
      this.userInfo = null;
      this.loginError = "";
      this.showLoginModal = false;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userRoles');
    },

    canRefresh() {
      const now = Date.now();
      if (this.lastRefreshTime && 
          (now - this.lastRefreshTime) < this.minimumRefreshInterval) {
        return false;
      }
      this.lastRefreshTime = now;
      return true;
    },

        async findLoginIds(userName, userPhone) {
      const { post } = useAPI();
      try {
        const response = await post('/auth/find-login-id', { userName, userPhone });
        this.findIdMessage = response.data.data;
      } catch (error) {
        this.findIdMessage = ['사용자 정보를 찾을 수 없습니다.'];
      }
    },

    async sendPasswordResetLink(userName, userPhone, loginId) {
      const { post } = useAPI();
      try {
        const response = await post('/auth/password-reset/request', {
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

    toggleLoginModal(show) {
      this.showLoginModal = show;
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
          return true;
      } catch (error) {
          console.error('프로필 업데이트 실패:', error);
          throw error;
      }
  }
}
});

export const useInterestStore = defineStore("interest", {
  state: () => ({
    interestIds: new Set(),
    lastFetchTime: null,
    CACHE_DURATION: 5 * 60 * 1000 // 5분
  }),

  getters: {
    isInterested: (state) => (courseId) => state.interestIds.has(courseId)
  },

  actions: {
    async fetchInterestsIfNeeded() {
      const now = Date.now();
      if (!this.lastFetchTime || now - this.lastFetchTime > this.CACHE_DURATION) {
        await this.fetchInterests();
      }
    },

    async fetchInterests() {
      const { get } = useAPI();
      const response = await get("/my/interests");
      this.interestIds = new Set(response.data.data.map(course => course.id));
      this.lastFetchTime = Date.now();
    },

    async toggleInterest(courseId) {
      const { patch } = useAPI();
      const response = await patch(`/my/interests/${courseId}`);
      
      if (response.data.data) {
        this.interestIds.add(courseId);
      } else {
        this.interestIds.delete(courseId);
      }
      return response.data.data;
    }
  }
  
});