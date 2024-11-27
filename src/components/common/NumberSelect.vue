<script setup>
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref, computed, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
  min: {
    type: Number,
    default: 1,
  },
  max: {
    type: Number,
    default: 10,
  },
  step: {
    type: Number,
    default: 1,
  },
  placeholder: {
    type: String,
  },
  inputName: {
    type: String,
  }
});

const emit = defineEmits(['update:modelValue']);

// 값의 범위 생성
const options = computed(() => {
  const range = [];
  for (let i = props.min; i <= props.max; i += props.step) {
    range.push(i);
  }
  return range;
});

const localValue = ref(props.modelValue);

// 값 증가
function increment() {
  const currentIndex = options.value.indexOf(localValue.value);
  if (currentIndex < options.value.length - 1) {
    localValue.value = options.value[currentIndex + 1];
    emit('update:modelValue', localValue.value);
  }
}

// 값 감소
function decrement() {
  const currentIndex = options.value.indexOf(localValue.value);
  if (currentIndex > 0) {
    localValue.value = options.value[currentIndex - 1];
    emit('update:modelValue', localValue.value);
  }
}

function removeFocus(event) {
  event.target.blur();
}

// 값 입력 시 유효 범위 검증
function handleInput(event) {
  const inputValue = Number(event.target.value);

  // 숫자가 아니거나 범위를 벗어난 경우 조정
  if (isNaN(inputValue)) {
    localValue.value = props.min;
  } else if (inputValue < props.min) {
    localValue.value = props.min;
  } else if (inputValue > props.max) {
    localValue.value = props.max;
  } else {
    localValue.value = inputValue;
  }

  // 부모 컴포넌트에 값 업데이트
  emit('update:modelValue', localValue.value);
}

// 외부 값 변경 시 동기화
watch(
  () => props.modelValue,
  (newValue) => {
    localValue.value = newValue;
  },
  { immediate: true }
);
</script>

<template>
  <div class="number-select">
    <button type="button" class="minus-btn" @click="decrement" :disabled="localValue === min">
      <FontAwesomeIcon :icon="faMinus" size="sm"/>
    </button>
    <input type="number" :name="inputName" v-model="localValue" :min="min" :max="max" :step="step" :placeholder="placeholder"
      @blur="handleInput" @keydown.enter="removeFocus"/>
    <button type="button" class="plus-btn" @click="increment" :disabled="localValue === max">
      <FontAwesomeIcon :icon="faPlus" size="sm"/>
    </button>
  </div>
</template>

<style scoped>
.number-select {
  position: relative;
  display: inline-flex;
  flex-direction: row;
  height: 2.2rem;
}

button {
  height: 100%;
  background-color: white;
  color: black;
  border: 1px solid var(--border-color);
  cursor: pointer;
  text-align: center;
}

button:disabled {
  color: #ccc;
  cursor: not-allowed;
}

.minus-btn {
  border-radius: 8px 0 0 8px;
  padding: 0 0.8rem 0 1rem;
}

.plus-btn {
  border-radius: 0 8px 8px 0;
  padding: 0 1rem 0 0.8rem;
}

input {
  height: 100%;
  width: 3rem;
  padding: 0.5rem;
  border: none;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  font-size: 1rem;
  text-align: center;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
