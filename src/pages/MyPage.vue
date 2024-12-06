<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useAPI } from '@/axios/useAPI';
import UserInfoCard from '@/components/mypage/UserInfoCard.vue';
import EditUserInfo from '@/components/mypage/EditUserInfo.vue';
import PasswordChange from '@/components/modal/PasswordChange.vue'
import InterestSetting from '@/components/modal/InterestSetting.vue'
import { RouterView } from 'vue-router';
import { Heart, Lock, ClipboardPaste, UserPen, Tags, MessageSquareText, Ticket, CalendarSearch } from 'lucide-vue-next';
import SideBar from '@/components/host-channel/SideBar.vue';

const auth = useAuthStore();
const pageData = ref({
  interestCount: 0,
  reviewCount: 0,
  couponCount: 0,
  enrolledClassesCount: 0
});

const showEditModal = ref(false);
const showPasswordModal = ref(false);
const showInterestsModal = ref(false);
const userInterests = ref([]);
const { get } = useAPI();

const categories = [
  { id: 1, name: '내 쿠폰', link: '/mypage/coupons' },
  { id: 2, name: '찜 목록', link: '/mypage/interests' },
  { id: 3, name: '내가 신청한 클래스', link: '/mypage/courses' },
  { id: 4, name: '리뷰 관리', link: '/mypage/reviews' },
  { id: 5, name: '관심 분야 설정', link: '/mypage/interests' },
  { id: 6, name: '강사 등록하기', link: '/mypage/host-request' },
];

const fetchPageData = async () => {
  try {
    const response = await get('/my');
    pageData.value = response.data.data;
  } catch (error) {
    console.error('데이터 불러오기 실패:', error);
  }
};

onMounted(async () => {
  try {
    await auth.fetchUserProfile();
    await fetchPageData();
    await fetchUserInterests();
  } catch (error) {
    console.error('페이지 불러오기 실패: ', error);
  }
});

const openEditModal = () => {
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
};

const openPasswordModal = () => {
  showPasswordModal.value = true;
};

const closePasswordModal = () => {
  showPasswordModal.value = false;
};

const openInterestsModal = () => {
  showInterestsModal.value = true;
};

const closeInterestsModal = () => {
  showInterestsModal.value = false;
};

const handleInterestsSave = async () => {
  await fetchUserInterests();
  closeInterestsModal();
};

const handleSave = async () => {
  try {
    await auth.fetchUserProfile();
    await fetchPageData();
    closeEditModal();
  } catch (error) {
    console.error('Failed to update profile:', error);
  }
};

const fetchUserInterests = async () => {
  try {
    const response = await get('/my/user-interests');
    userInterests.value = response.data.data;
  } catch (error) {
    console.error('Failed to fetch user interests:', error);
  }
};
</script>

<template>
  <div class="page-container">
    <div class="my-page">
      <Sidebar :categories="categories" :submenus="submenus" />
      <h1>마이페이지</h1>
      <router-view />
      <div class="row main-row">
        <div class="main-section">
          <div class="info-card">
            <p v-if="!auth.userInfo">회원 정보를 가져오는 중...</p>
            <UserInfoCard v-if="auth.userInfo" @open-edit-modal="openEditModal" />
          </div>
        </div>

        <div class="side-section">
          <router-link to="/mypage/coupons" class="card coupon-card">
            <div class="title-group">
              <Ticket class="icon" />
              <h2>쿠폰</h2>
            </div>
            <p class="subtitle">할인된 가격으로 클래스를 이용해보세요!</p>
            <div class="count-info">
              <span class="label">보유 쿠폰:</span>
              <span class="value">{{ pageData.couponCount }} 개</span>
            </div>
          </router-link>

          <router-link to="/mypage/interests" class="card interest-card">
            <div class="title-group">
              <Heart class="icon" />
              <h2>찜 목록</h2>
            </div>
            <p class="subtitle">회원님이 찜한 클래스들을 확인하실 수 있어요.</p>
            <div class="count-info">
              <span class="label">찜:</span>
              <span class="value">{{ pageData.interestCount }} 개</span>
            </div>
          </router-link>
        </div>
      </div>

      <div class="row">
        <div class="main-section">
          <router-link to="/mypage/courses" class="card course-card action-card">
            <div class="title-group">
              <CalendarSearch class="icon" />
              <h2>내가 신청한 클래스</h2>
            </div>
            <p class="subtitle">회원님이 신청한 클래스에요! 결제 정보를 확인하거나 리뷰를 남길 수 있어요.</p>
          </router-link>
        </div>

        <div class="side-section">
          <div v-if="auth.userRoles.includes('HOST')" class="card action-card" @click="$router.push('/hostchannel/main')">
            <div class="title-group">
              <UserPen class="icon" />
              <h2>강사 채널가기</h2>
            </div>
            <p class="subtitle">강사님의 활동을 확인하고 관리하세요 :)</p>
          </div>
          <div v-else class="card action-card" @click="$router.push('/mypage/host-request')">
            <div class="title-group">
              <ClipboardPaste class="icon" />
              <h2>강사 등록하기</h2>
            </div>
            <p class="subtitle">회원님의 지식을 다른 회원님에게 공유해보세요 :)</p>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="main-section">
          <div class="card action-card" @click="openInterestsModal">
            <div class="title-group">
              <Tags class="icon" />
              <h2>관심 분야 설정</h2>
            </div>
              <p class="subtitle">회원님의 관심 분야를 설정할 수 있는 곳이에요! 관심 분야를 설정하고 맞춤 추천을 받아보세요 :)</p>
            <div class="current-interests">
              <div v-if="userInterests.length === 0" class="no-interests">
                아직 선택된 관심 분야가 없습니다.
              </div>
              <div v-else class="interest-tags">
                <span v-for="interest in userInterests" :key="interest.id" class="interest-tag">
                  {{ interest.name }}
                </span>
              </div>
            </div>

          </div>
        </div>

        <div class="side-section">
          <div class="card action-card" @click="openPasswordModal">
            <div class="title-group">
              <Lock class="icon" />
              <h2>비밀번호 변경</h2>
            </div>
            <p class="subtitle">계정 보안을 위해 주기적으로 변경해주세요.</p>
          </div>
        </div>
        <div>
          <div class="card action-card" @click="$router.push('/mypage/reviews')">
            <div class="title-group">
              <MessageSquareText class="icon" />
              <h2>리뷰 관리</h2>
            </div>
            <p class="subtitle">회원님이 작성하신 리뷰를 확인하실 수 있어요</p>
          </div>
        </div>
      </div>

      <EditUserInfo v-if="showEditModal && auth.userInfo" :is-open="showEditModal" :user-info="auth.userInfo"
        @close="closeEditModal" @save="handleSave" />

      <PasswordChange v-if="showPasswordModal" :is-open="showPasswordModal" @close="closePasswordModal" />

      <InterestSetting v-if="showInterestsModal" :is-open="showInterestsModal" :current-interests="userInterests"
        @close="closeInterestsModal" @save="handleInterestsSave" />
    </div>
  </div>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
  padding: 20px 0;
}

.my-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 40px;
  margin-bottom: 100px;
}

.row {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}

.main-section {
  flex: 3;
  min-width: 0;
}

.side-section {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.main-row {
  min-height: 300px;
}

.card {
  background: white;
  border: 1px solid #FF9800;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 100%;
  text-decoration: none;
  color: inherit;
}

.course-card,
.interests-settings-card {
  min-height: 180px;
  display: flex;
  flex-direction: column;
}

.action-card {
  cursor: pointer;
  transition: transform 0.2s;
  min-height: 180px;
  display: flex;
  flex-direction: column;
}

.action-card:hover {
  transform: translateY(-4px);
}

h1 {
  margin-bottom: 30px;
  color: #333;
}

h2 {
  font-size: 23px;
  font-weight: bold;
  color: #333;
  margin: 0 0 12px 0;
}

.subtitle {
  color: #666;
  font-size: 14px;
  margin-bottom: 20px;
}

.count-info {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: auto;
}

.count-info .label {
  color: #666;
  font-size: 14px;
  margin-right: 8px;
}

.count-info .value {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.interests-btn {
  width: 140px;
  padding: 8px 16px;
  background: #FFF3E0;
  color: #FF9800;
  border: 1px solid #FF9800;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  margin-top: auto;
}

.interests-btn:hover {
  background: #FFE0B2;
}

.coupon-card,
.interest-card {
  transition: transform 0.2s;
  display: flex;
  flex-direction: column;
}

.coupon-card:hover,
.interest-card:hover {
  transform: translateY(-4px);
}

.current-interests {
  margin: 15px 0;
}

.no-interests {
  color: #666;
  font-style: italic;
}

.interest-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.interest-tag {
  background: #FFF3E0;
  color: #FF9800;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
}

.title-group {
  display: flex;
  gap: 8px;
}

.icon {
  width: 2rem;
  height: 2rem;
  vertical-align: middle;
}

@media (max-width: 768px) {
  .my-page {
    padding: 0 20px;
  }

  .row {
    flex-direction: column;
  }

  .main-row {
    min-height: auto;
  }

  .side-section {
    gap: 16px;
  }

  .card {
    padding: 20px;
  }

  .course-card,
  .interests-settings-card,
  .action-card {
    min-height: 150px;
  }

  .count-info {
    margin-top: 16px;
  }

  .interests-btn {
    margin-top: 16px;
  }
}

@media (max-width: 480px) {
  .my-page {
    padding: 0 15px;
  }

  h1 {
    font-size: 24px;
    margin-bottom: 20px;
  }

  .card {
    padding: 16px;
  }

  .count-info .value {
    font-size: 18px;
  }

  .interests-btn {
    width: 100%;
  }
}
</style>