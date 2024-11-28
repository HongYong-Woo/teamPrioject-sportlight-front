<script setup>
import { faChevronDown, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
    options: Array,
    selectedValues: Array,
    placeholder: String,
});

const emit = defineEmits(['update:selectedValues']);

const isOpen = ref(false);
const selectedValues = ref([...props.selectedValues]); // 로컬 상태로 복사
const dropdown = ref(null);

// 드롭다운 열기/닫기
function toggleDropdown() {
    isOpen.value = !isOpen.value;
}

function clearSelectedValues() {
    selectedValues.value = [];
    emit('update:selectedValues', selectedValues.value);
}

// 바깥쪽 클릭 감지 및 닫기
function clickOutside(event) {
    if (isOpen.value && dropdown.value && !dropdown.value.contains(event.target)) {
        isOpen.value = false;
    }
}

// 체크박스 값 변경 시 부모로 업데이트 emit
function updateSelected() {
    emit('update:selectedValues', selectedValues.value);
}

// props.selectedValues 변경 시 로컬 상태 동기화
watch(
    () => props.selectedValues,
    (newValues) => {
        selectedValues.value = [...newValues];
    },
    { immediate: true } // 컴포넌트 초기화 시 즉시 실행
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
        <button @click="toggleDropdown"
            :class="selectedValues.length > 0 ? 'dropdown-toggle-exist' : 'dropdown-toggle-none'">
            <span>{{ selectedValues.length == 0 ? placeholder : selectedValues.join(', ') }}</span>
            <FontAwesomeIcon v-if="!isOpen && selectedValues.length == 0" :icon="faChevronDown" size="sm"
                style="pointer-events: none;" />
            <FontAwesomeIcon v-else :icon="faXmark" size="sm" @click="clearSelectedValues" class="xmark" />
            <div v-if="selectedValues.length > 0" class="exist-light"></div>
        </button>

        <!-- 드롭다운 메뉴 -->
        <transition name="dropdown-fade">
            <div v-if="isOpen" class="dropdown-menu">
                <label v-for="option in options" :key="option.value" class="dropdown-menu-option">
                    <input type="checkbox" :value="option.value" v-model="selectedValues" @change="updateSelected" />
                    <span style="width: 4px;"></span>
                    {{ option.label }}
                </label>
            </div>
        </transition>
    </div>
</template>

<style scoped>
.dropdown {
    position: relative;
    display: inline-flex;
    font-size: 1rem;
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
    height: 2.2rem;
    display: flex;
    align-items: center;
}

.dropdown>button>span {
    margin-right: 0.25rem;
}

.dropdown-toggle-exist {
    border: 1px solid #333;
}

.dropdown-toggle-none {
    border: 1px solid #ccc;
}

.xmark {
    background: none;
    border: none;
}

.xmark:hover {
    color: var(--primary-orange-color);
}

.exist-light {
    position: absolute;
    top: -3px;
    right: -3px;
    width: 12px;
    height: 12px;
    background-color: var(--primary-orange-color);
    border: 2px solid white;
    border-radius: 50%;
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
    display: flex;
    align-content: center;
    align-items: center;
    padding: 0.5rem 4px;
    border-radius: 6px;
}

.dropdown-menu-option:hover {
    background-color: #f0f0f0;
}
</style>
