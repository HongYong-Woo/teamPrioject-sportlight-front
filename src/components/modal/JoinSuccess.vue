<template>
    <div v-if="show" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h3>회원가입 완료 🎉</h3>
        <p>Spotlight에 오신 것을 환영합니다!</p>
        <button @click="closeModal" class="modal-button">확인</button>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    show: Boolean,
  });
  
  const emit = defineEmits(["close"]);
  
  const closeModal = () => {
    emit("close");
  };
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal {
    background: white;
    padding: 20px 30px;
    border-radius: 8px;
    text-align: center;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .modal h3 {
    margin-bottom: 10px;
    font-size: 24px;
  }
  
  .modal p {
    margin-bottom: 20px;
    color: #555;
  }
  
  .modal-button {
    background: #ff9300;
    color: white;
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .modal-button:hover {
    background: #ff7500;
  }
  </style>