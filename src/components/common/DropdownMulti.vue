<script setup>
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref } from 'vue';

const props = defineProps({
    options: Array,
    selectedValues: Array,
    placeholder: String,
});

const emit = defineEmits(['update:selectedValues']);

const isOpen = ref(false); // 아코디언 열림 상태
const selectedValues = ref([...props.selectedValues]); // 로컬 상태 복사

// 아코디언 열기/닫기
function toggleDropdown() {
    isOpen.value = !isOpen.value;
}

// 체크박스 값 변경 시 부모로 업데이트 emit
function updateSelected() {
    emit('update:selectedValues', selectedValues.value);
}
</script>

<template>
    <div class="accordion">
        <!-- 아코디언 헤더 -->
        <div @click="toggleDropdown" class="accordion-header">
            <span>{{ placeholder }}</span>
            <FontAwesomeIcon :icon="isOpen ? faChevronUp : faChevronDown" size="sm" class="arrow"/>
        </div>

        <!-- 아코디언 내용 -->
        <div
            class="accordion-content"
            :class="{ open: isOpen }"
        >
            <div class="accordion-inner">
                <label
                    v-for="option in options"
                    :key="option.value"
                    class="dropdown-menu-option"
                >
                    <input
                        type="checkbox"
                        :value="option.value"
                        v-model="selectedValues"
                        @change="updateSelected"
                    />
                    {{ option.label }}
                </label>
            </div>
        </div>
    </div>
</template>

<style scoped>
.accordion {
    display: flex;
    flex-direction: column;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    padding: 0.5rem;
}

.accordion-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    font-size: 1.1rem;
    font-weight: 500;
    padding: 0.5rem;
    border-radius: 4px;
}

.arrow {
    transition: all 0.5s ease;
}

/* 아코디언 내용 */
.accordion-content {
    max-height: 0; /* 기본 상태에서 높이 0 */
    overflow: hidden;
    transition: max-height 0.5s ease; /* 전환 효과 */
    padding: 0 0.5rem;
}

.accordion-content.open {
    max-height: 300px; /* 충분히 큰 값으로 설정 (내용에 맞게 변경 가능) */
}

.accordion-inner {
    display: flex;
    flex-direction: column;
}

.dropdown-menu-option {
    display: flex;
    align-items: center;
    padding: 0.5rem 0;
    font-size: 1rem;
}

[type="checkbox"] {
    appearance: none; /* 기본(네이티브) 모양을 제거 */
    box-sizing: border-box;
    background-clip: content-box;
    padding: 0.125em;
    width: 1em;
    height: 1em;
    border: 1px solid gray;
    border-radius: 50%;
    cursor: pointer;
    margin-right: 0.25rem;
}
[type="checkbox"]:checked {
    border-color: var(--primary-orange-color);
    background-color: var(--primary-orange-color);
}

</style>
