<script setup>
import { faXmark, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
    minValue: {
        type: Number,
        required: true
    },
    maxValue: {
        type: Number,
        required: true
    },
    minRange: {
        type: Number,
        required: true
    },
    maxRange: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        default: 'Button'
    },
    placeholder: {
        type: String,
        default: 'Button'
    }
});

const emit = defineEmits(['update:minValue', 'update:maxValue']);

const localMinValue = ref(props.minValue);
const localMaxValue = ref(props.maxValue);
const localMinRange = ref(props.minRange);
const localMaxRange = ref(props.maxRange);
const isOpen = ref(false);
const dropdown = ref(null);

function toggleDropdown() {
    isOpen.value = !isOpen.value;
}

function clearValues() {
    localMaxValue.value = localMaxRange.value;
    localMinValue.value = localMinRange.value;
    emit('update:minValue', localMinValue.value);
    emit('update:maxValue', localMaxValue.value);
}

function clickOutside(event) {
    if (isOpen.value && dropdown.value && !dropdown.value.contains(event.target)) {
        isOpen.value = false;
    }
}

function normalizeValue(value) {
    return Math.round(value / 1000) * 1000;
}

// 값이 변경될 때마다 thumb와 range의 위치를 업데이트하는 함수
function setSliderValues() {
    const thumbLeft = document.querySelector('.slider > .thumb.left');
    const thumbRight = document.querySelector('.slider > .thumb.right');
    const range = document.querySelector('.slider > .range');

    if (thumbLeft && thumbRight && range) { // DOM 요소가 존재하는지 확인
        const leftPercent = ((localMinValue.value - localMinRange.value) / (localMaxRange.value - localMinRange.value)) * 100;
        const rightPercent = ((localMaxValue.value - localMinRange.value) / (localMaxRange.value - localMinRange.value)) * 100;

        thumbLeft.style.left = `${leftPercent}%`;
        thumbRight.style.left = `${rightPercent}%`;

        range.style.left = `${leftPercent}%`;
        range.style.right = `${100 - rightPercent}%`;
    }
};

// 컴포넌트가 마운트된 후에 setSliderValues 호출
onMounted(() => {
    setSliderValues();
    document.addEventListener('click', clickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', clickOutside);
})

// 슬라이더 값이 변경될 때마다 값 업데이트
watch([localMinValue, localMaxValue], () => {
    setSliderValues();
}, { immediate: true });


// 값이 변경되지 않도록 제한하는 로직
const onLeftChange = (event) => {
    const left = normalizeValue(parseInt(event.target.value));
    if (left >= localMaxValue.value) {
        localMinValue.value = localMaxValue.value - 1000;
    } else {
        localMinValue.value = left;
    }
    emit('update:minValue', localMinValue.value);
};

const onRightChange = (event) => {
    const right = normalizeValue(parseInt(event.target.value));
    if (right <= localMinValue.value) {
        localMaxValue.value = localMinValue.value + 1000;
    } else {
        localMaxValue.value = right;
    }
    emit('update:maxValue', localMaxValue.value);
};
</script>

<template>
    <div class="accordion">
        <!-- 아코디언 헤더 -->
        <div @click="toggleDropdown" class="accordion-header">
            <span>{{ placeholder }}</span>
            <FontAwesomeIcon :icon="isOpen ? faChevronUp : faChevronDown" size="sm" class="arrow" />
        </div>
        <div class="accordion-content" :class="{ open: isOpen }">
            <div v-show="isOpen" class="slider-container">
                <span>{{ props.name }}</span>
                <div class="middle">
                    <div class="multi-range-slider">
                        <!-- 진짜 슬라이더 -->
                        <input type="range" :min="localMinRange" :max="localMaxRange" step="1000"
                            v-model="localMinValue" :value="localMinValue" @input="onLeftChange" />
                        <input type="range" :min="localMinRange" :max="localMaxRange" step="1000"
                            v-model="localMaxValue" :value="localMaxValue" @input="onRightChange" />

                        <!-- 커스텀 슬라이더 -->
                        <div class="slider">
                            <div class="track"></div>
                            <div class="range"></div>
                            <div class="thumb left"></div>
                            <div class="thumb right"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

.slider-container {
    height: max-content;
    padding: 0.7rem 1rem;
    margin-top: 8px;
    border-radius: 8px;
    z-index: 5;
}

.middle {
    position: relative;
    width: 100%;
    margin: 8px auto;
}

.slider {
    position: relative;
    z-index: 1;
    height: 4px;
    margin: 0 15px;
}

.slider>.track {
    position: absolute;
    z-index: 1;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    border-radius: 2px;
    background-color: #e9770033;
}

.slider>.range {
    position: absolute;
    z-index: 2;
    top: 0;
    bottom: 0;
    border-radius: 2px;
    background-color: var(--primary-orange-color);
}

.slider>.thumb {
    position: absolute;
    z-index: 3;
    width: 16px;
    height: 16px;
    background-color: var(--primary-orange-color);
    border-radius: 50%;
    cursor: pointer;
}

.slider>.thumb.left {
    left: 25%;
    transform: translate(-8px, -6px);
}

.slider>.thumb.right {
    left: 75%;
    transform: translate(-8px, -6px);
}

input[type="range"] {
    position: absolute;
    pointer-events: none;
    -webkit-appearance: none;
    z-index: 2;
    height: 10px;
    width: 100%;
    opacity: 0;
}

input[type="range"]::-webkit-slider-thumb {
    pointer-events: all;
    width: 30px;
    height: 30px;
    border-radius: 0;
    border: 0 none;
    cursor: pointer;
    -webkit-appearance: none;
}






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
}

.accordion-content.open {
    max-height: 300px; /* 충분히 큰 값으로 설정 (내용에 맞게 변경 가능) */
}
</style>
