<script setup>
import { faChevronDown, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';

const props = defineProps({
    options: Array,
    selectedValue: String,
});

const emit = defineEmits(['update:selectedValue']);

const isOpen = ref(false);
const selectedValue = ref(props.selectedValue); // 로컬 상태로 복사
const dropdown = ref(null);
console.log(props.options);

const selectedLabel = computed(() => {
    const selectedOption = props.options.find(option => option.value === selectedValue.value);
    return selectedOption ? selectedOption.label : '선택해주세요';
});

// 드롭다운 열기/닫기
function toggleDropdown() {
    isOpen.value = !isOpen.value;
}

// 바깥쪽 클릭 감지 및 닫기
function clickOutside(event) {
    if (isOpen.value && dropdown.value && !dropdown.value.contains(event.target)) {
        isOpen.value = false;
    }
}

// 선택된 값을 부모로 업데이트
function updateSelected(option) {
    selectedValue.value = option.value;
    emit('update:selectedValue', option.value);
    isOpen.value = false; // 선택 후 드롭다운 닫기
}

// props.selectedValue 변경 시 로컬 상태 동기화
watch(
    () => props.selectedValue,
    (newValue) => {
        selectedValue.value = newValue;
    },
    { immediate: true }
);

// 마운트 시 이벤트 리스너 추가
onMounted(() => {
    document.addEventListener('click', clickOutside);
});

// 언마운트 시 이벤트 리스너 제거
onUnmounted(() => {
    document.removeEventListener('click', clickOutside);
});
</script>

<template>
    <div ref="dropdown" class="dropdown">
        <!-- 드롭다운 토글 -->
        <button @click="toggleDropdown">
            {{ selectedLabel }}
            <FontAwesomeIcon :icon="faChevronDown" size="sm" style="pointer-events: none;" />
        </button>

        <!-- 드롭다운 메뉴 -->
        <transition name="dropdown-fade">
            <div v-if="isOpen" class="dropdown-menu">
                <button
                    v-for="option in options"
                    :key="option.value"
                    @click="updateSelected(option)"
                    class="dropdown-menu-option"
                >
                    {{ option.label }}
                </button>
            </div>
        </transition>
    </div>
</template>

<style scoped>
.dropdown {
    position: relative;
    display: inline-flex;
    font-size: 1rem;
    margin-top: 6px;
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
    transition: all 0.3s ease;
}

.dropdown-fade-enter-from, .dropdown-fade-leave-to {
    opacity: 0;
}

.dropdown-fade-enter-to, .dropdown-fade-leave-from {
    opacity: 1;
}

.dropdown>button {
    padding: 0.5rem 1rem 0.5rem 1rem;
    cursor: pointer;
    border-radius: 8px;
    background-color: white;
    border: 1px solid #ccc;
    height: 2.2rem;
}

.dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    width: max-content;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 8px;
    margin-top: 8px;
    display: flex;
    flex-direction: column;
}

.dropdown-menu-option {
    align-content: center;
    align-items: center;
    border-radius: 6px;
    padding: 0.4rem 0.8rem 0.4rem 0.8rem;
    background-color: white;
    border: none;
    height: 2rem;
}

.dropdown-menu-option:hover {
    background-color: #f0f0f0;
}
</style>
