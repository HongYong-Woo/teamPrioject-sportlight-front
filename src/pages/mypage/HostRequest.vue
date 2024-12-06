<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAPI } from '@/axios/useAPI';
import { formatDateString } from '@/util/DateFormatter';

const router = useRouter();
const { get, remove } = useAPI();

const hostRequest = ref(null);
const loading = ref(true);
const error = ref('');

const fetchHostRequest = async () => {
  try {
    const response = await get('/my/host-request-status');
    hostRequest.value = response.data.data;
  } catch (err) {
    if (err.response?.status !== 404) {
      error.value = '데이터를 불러오는데 실패했습니다.';
    }
  } finally {
    loading.value = false;
  }
};

const deleteRequest = async () => {
  if (!confirm('정말로 강사 등록 요청을 삭제하시겠습니까?')) return;
  
  try {
    await remove('/my/host-request');
    hostRequest.value = null;
  } catch (err) {
    error.value = '삭제에 실패했습니다.';
  }
};

onMounted(fetchHostRequest);
</script>

<template>
  <div class="host-request-page">
    <h1>강사 등록 현황</h1>

    <div v-if="loading" class="loading-state">
      <p>로딩 중...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
    </div>

    <div v-else-if="!hostRequest" class="empty-state">
      <p>아직 등록된 요청이 없습니다.</p>
      <button @click="router.push('/mypage/host-request-register')" class="register-btn">
        강사 전환 요청하기
      </button>
    </div>

    <div v-else class="request-info">
      <div class="info-row">
        <div class="info-label">상태</div>
        <div class="info-value">
          {{ hostRequest.reqStatus === 'PENDING' ? '검토중' : 
             hostRequest.reqStatus === 'APPROVED' ? '승인됨' : '반려됨' }}
        </div>
      </div>
      <div class="info-row">
        <div class="info-label">등록일</div>
        <div class="info-value">{{ formatDateString(hostRequest.regDate) }}</div>
      </div>
      <div class="info-row">
        <div class="info-label">수정일</div>
        <div class="info-value">{{ formatDateString(hostRequest.modDate) }}</div>
      </div>
      <div class="info-row">
        <div class="info-label">반려일</div>
        <div class="info-value">{{ formatDateString(hostRequest.rejDate) }}</div>
      </div>
      <div class="info-row" v-if="hostRequest.reqStatus === 'PENDING'">
        <div class="info-value">
          <div class="action-buttons">
            <button @click="router.push('/mypage/host-request-register')" class="edit-btn">
              수정
            </button>
            <button @click="deleteRequest" class="delete-btn">
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.host-request-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  margin-bottom: 30px;
  color: #333;
}

.request-info {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.info-row {
  display: flex;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  flex: 1;
  color: #666;
  font-weight: 500;
}

.info-value {
  flex: 2;
  color: #333;
}

.action-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.edit-btn,
.delete-btn {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.edit-btn {
  background-color: #FF9800;
  color: white;
  border: none;
}

.delete-btn {
  background-color: white;
  color: #dc3545;
  border: 1px solid #dc3545;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  min-height: 200px;
}

.empty-state p {
  color: #666;
  margin-bottom: 24px;
}

.register-btn {
  padding: 12px 24px;
  background-color: white;
  color: #FF9800;
  border: 1px solid #FF9800;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.register-btn:hover {
  background-color: #FFF3E0;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 40px;
  color: #666;
}
</style>