<script setup>
import {useAPI} from "@/axios/useAPI.js";
import {onMounted, ref} from "vue";
import HostInfoModal from "@/components/host-channel/HostInfoModal.vue";
import { faYoutube, faInstagram, faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const { get } = useAPI();
const hostInfo = ref({});
const fetchHostInfo = async () => {
  try {
    const response = await get('/hosts/info');
    hostInfo.value = response.data.data;
  } catch (error) {
    console.error('Failed to fetch Details', error);
  }
};

onMounted(() => {
  fetchHostInfo();
});

const isOpenUpdateModal = ref(false);
const openProfileUpdateModal = () => {
  isOpenUpdateModal.value = true;
};

const handleSave = () => {
  fetchHostInfo();
};

const closeProfileUpdateModal = () => {
  isOpenUpdateModal.value = false;
}
</script>

<template>
  <div class="card text-center mb-3">
    <div class="card-body">
      <div class="card-title mb-4">
        <h6>강사</h6>
        <h4 class="mb-3" style="font-weight: bold">{{ hostInfo.userNickname }}</h4>
      </div>

      <!-- SNS 계정 -->
      <div class="link-container">
        <FontAwesomeIcon :icon="faInstagram" :class="hostInfo.hostInsta ? 'insta-icon' : 'non-icon'" size="xl" />
        <FontAwesomeIcon :icon="faFacebook" :class="hostInfo.hostFacebook ? 'facebook-icon' : 'non-icon'" size="xl" />
        <FontAwesomeIcon :icon="faTwitter" :class="hostInfo.hostTwitter ? 'twitter-icon' : 'non-icon'" size="xl" />
        <FontAwesomeIcon :icon="faYoutube" :class="hostInfo.hostYoutube ? 'youtube-icon' : 'non-icon'" size="xl" />
      </div>

      <!-- 수정 버튼 -->
      <div class="mt-4">
        <button class="btn btn-primary" @click="openProfileUpdateModal">
          강사 정보 수정
        </button>
      </div>
    </div>
  </div>

  <!-- 수정 모달 -->
  <HostInfoModal
      v-if="isOpenUpdateModal && hostInfo"
      :is-open="isOpenUpdateModal"
      :hostInfo="hostInfo"
      @close="closeProfileUpdateModal"
      @save="handleSave"
  />
</template>

<style scoped>
.card {
  border: 6px solid #ffc44d;
  padding: 10px;
  border-radius: 20px;
}
.card-title {
  color: #E97C16;
  font-weight: bold;
  font-size: large;
}
.btn {
  color: #E97C16;
  background-color: #FFEBD9;
  border: 1px solid #E97C16;
}
.insta-icon {
  color: #DD2A7B;
  margin-right: 10px;
}
.twitter-icon {
  color: #1DA1F2;
  margin-right: 10px;
}
.youtube-icon {
  color: red;
  margin-right: 10px;
}
.facebook-icon {
  color: #4267B2;
  margin-right: 10px;
}
.non-icon {
  color: #c6c6c6;
  margin-right: 10px;
}
</style>
