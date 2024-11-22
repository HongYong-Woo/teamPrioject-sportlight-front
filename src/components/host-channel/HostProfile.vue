<script setup>
const openProfileUpdateModal = () => {

};
</script>

<template>
<div class="card text-center mb-3 " style="width: 18rem;">
  <div class="card-body mb-2">
    <img src="https://kr.object.ncloudstorage.com/sportlight/spotlight.png" alt="profile-user-img" class="profile-user-img rounded-circle mb-2">
    <div class="card-title fs-6 fw-bold" style="color: #E97C16">
      강사
    </div>
    <div class="card-text  fw-bold mb-4 fs-5">
      강사 닉네임 자리입니다
    </div>
    <div>
      <button class="btn" @click="openProfileUpdateModal">강사 정보 수정</button>
    </div>
  </div>
</div>
</template>

<style scoped>
.card {
  border: 2px solid #E97C16;
}
.profile-user-img {
  width: 100px;
  height: 100px;
}
.btn {
  color: #E97C16;
  background-color: #FFEBD9;
  border: 1px solid #E97C16;
}
</style>
