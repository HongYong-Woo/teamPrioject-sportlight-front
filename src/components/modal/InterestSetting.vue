<script setup>
import { ref, onMounted } from 'vue';
import { useAPI } from '@/axios/useAPI';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  currentInterests: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['close', 'save']);
const { get, patch } = useAPI();

const categories = ref([]);
const selectedInterests = ref([...props.currentInterests]);
const errorMessage = ref('');

const fetchCategories = async () => {
  try {
    const response = await get('/categories');
    categories.value = response.data.data;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }
};

const toggleInterest = (category) => {
  const index = selectedInterests.value.findIndex(i => i.id === category.id);
  
  if (index === -1) {
    if (selectedInterests.value.length >= 5) {
      errorMessage.value = '관심 분야는 최대 5개까지만 선택 가능합니다.';
      return;
    }
    selectedInterests.value.push(category);
  } else {
    selectedInterests.value.splice(index, 1);
  }
  errorMessage.value = '';
};

const isSelected = (category) => {
  return selectedInterests.value.some(i => i.id === category.id);
};

const handleSave = async () => {
  try {
    await patch('/my/user-interests', {
      categoryIds: selectedInterests.value.map(i => i.id)
    });
    emit('save');
  } catch (error) {
    console.error('Failed to save interests:', error);
    errorMessage.value = '관심 분야 저장에 실패했습니다.';
  }
};

onMounted(() => {
  fetchCategories();
});
</script>

<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h2>관심 분야 설정</h2>
        <button class="close-btn" @click="$emit('close')">x</button>
      </div>

      <div class="modal-body">
        <p class="instruction">관심 있는 분야를 선택해주세요. (최대 5개)</p>
        
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <div class="categories-grid">
          <button
            v-for="category in categories"
            :key="category.id"
            class="category-button"
            :class="{ selected: isSelected(category) }"
            @click="toggleInterest(category)"
          >
            {{ category.name }}
          </button>
        </div>

        <div class="selected-interests">
          <h3>선택된 관심 분야 ({{ selectedInterests.length }}/5)</h3>
          <div class="selected-tags">
            <span
              v-for="interest in selectedInterests"
              :key="interest.id"
              class="interest-tag"
            >
              {{ interest.name }}
              <button class="remove-tag" @click="toggleInterest(interest)">×</button>
            </span>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="save-button" @click="handleSave">저장</button>
      </div>
    </div>
  </div>
</template>

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

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  padding: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
  margin: 20px 0;
}

.category-button {
  padding: 10px;
  border: 1px solid #FF9800;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.category-button.selected {
  background: #FF9800;
  color: white;
}

.selected-interests {
  margin-top: 20px;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.interest-tag {
  background: #FFF3E0;
  color: #FF9800;
  padding: 6px 12px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.remove-tag {
  background: none;
  border: none;
  color: #FF9800;
  cursor: pointer;
  padding: 0;
  font-size: 16px;
}

.error-message {
  color: #f44336;
  margin: 10px 0;
}

.save-button {
  background: #FF9800;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 6px;
  cursor: pointer;
}


.close-btn {
    position: absolute;
    top: 16px;
    right: 16px;
    background: none;
    border: none;
    font-size: 24px;
    color: #333;
    cursor: pointer;
    transition: all 0.3s ease;
}

.close-btn:hover {
    color: #FF9300;
    transform: scale(1.1);
}

@media (max-width: 480px) {
  .modal-content {
    width: 95%;
    max-height: 90vh;
  }

  .categories-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
}
</style>