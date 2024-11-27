<script setup>
import { defineProps, defineEmits, ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
    isVisible: {
        type: Boolean,
        required: true
    },
    profileImage: {
        type: String,
        required: true
    }
});

const emit = defineEmits(['update:is-visible', 'handle-dropdown']);
const profileRef = ref(null);

const toggleDropdown = (event) => {
    event.stopPropagation();
    emit('update:is-visible', !props.isVisible);
};

const handleDropdownChange = (selectedValue) => {
    emit('handle-dropdown', selectedValue);
};

const handleClickOutside = (event) => {
    if (profileRef.value && !profileRef.value.contains(event.target)) {
        emit('update:is-visible', false);
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="profile-dropdown-container">
      <button
          type="button"
          class="profile-btn"
          @click="toggleDropdown"
          ref="profileRef"
      >
          <img
              :src="profileImage"
              alt="Profile"
              class="profile-image"
          />
      </button>

      <Transition name="menu-fade">
          <div v-show="isVisible" class="menu-wrapper">
              <div class="menu-container">
                  <div class="menu-items">
                      <div
                          class="menu-item"
                          @click="() => handleDropdownChange('mypage')"
                      >
                          마이페이지
                      </div>
                      <div
                          class="menu-item"
                          @click="() => handleDropdownChange('logout')"
                      >
                          로그아웃
                      </div>
                  </div>
              </div>
          </div>
      </Transition>
  </div>
</template>

<style scoped>
.profile-dropdown-container {
  position: relative;
  display: inline-block;
}

.profile-btn {
  padding: 2px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
}

.profile-btn:focus {
  outline: none;
}

.profile-image {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #ddd;
  object-fit: cover;
}

.menu-wrapper {
  position: absolute;
  top: calc(100% + 5px);
  right: 0;
  z-index: 1000;
  min-width: 160px;
}

.menu-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid #eee;
}

.menu-items {
  padding: 4px 0;
}

.menu-item {
  padding: 10px 16px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;
  text-align: left;
}

.menu-item:hover {
  background-color: #f5f5f5;
}

@media (max-width: 768px) {
  .profile-image {
      width: 32px;
      height: 32px;
  }
  
  .menu-item {
      padding: 8px 14px;
      font-size: 13px;
  }
}

@media (max-width: 640px) {
  .profile-image {
      width: 28px;
      height: 28px;
  }
  
  .menu-item {
      padding: 6px 12px;
      font-size: 12px;
  }
}

.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: all 0.2s ease;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>