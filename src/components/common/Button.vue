    <script setup>
    import { defineProps, defineEmits, computed } from 'vue';

    const props = defineProps({
        variant: {
            type: String,
            default: 'primary', // 기본 버튼 스타일 (primary, secondary 등)
            validator: (value) => ['primary', 'secondary', 'danger', 'success', 'warning'].includes(value),
        },
        size: {
            type: String,
            default: 'medium', // 버튼 크기 (small, medium, large 등)
            validator: (value) => ['small', 'medium', 'large'].includes(value),
        },
        isLoading: {
            type: Boolean,
            default: false, // 로딩 상태 여부
        },
        disabled: {
            type: Boolean,
            default: false, // 비활성화 여부
        },
    });

    const emits = defineEmits(['click']);

    function handleClick(event) {
        if (!props.disabled && !props.isLoading) {
            emits('click', event);
        }
    }

    const variantClass = computed(() => `btn-${props.variant}`);
    const sizeClass = computed(() => `btn-${props.size}`);
</script>

<template>
    <button :class="[
        'btn',
        variantClass,
        sizeClass,
        { 'is-loading': isLoading, 'is-disabled': disabled }
    ]" :disabled="disabled || isLoading" @click="handleClick">
        <span v-if="isLoading" class="spinner"></span>
        <slot></slot>
    </button>
</template>


<style scoped>
/* 기본 버튼 스타일 */
.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.25rem;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.2s ease;
}

/* 비활성화 상태 */
.btn.is-disabled {
    cursor: not-allowed;
    opacity: 0.6;
}

/* 로딩 상태 */
.btn.is-loading {
    cursor: wait;
}

.spinner {
    border: 2px solid rgba(0, 0, 0, 0.2);
    border-top: 2px solid #000;
    border-radius: 50%;
    width: 1rem;
    height: 1rem;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

/* 버튼 스타일 변형 */
.btn-primary {
    background-color: var(--primary-orange-color);
    color: white;
}

.btn-primary:hover {
    background-color: #e97700;
}

.btn-secondary {
    background-color: #6c757d;
    color: white;
}

.btn-secondary:hover {
    background-color: #5a6268;
}

.btn-danger {
    background-color: #dc3545;
    color: white;
}

.btn-danger:hover {
    background-color: #c82333;
}

.btn-success {
    background-color: #28a745;
    color: white;
}

.btn-success:hover {
    background-color: #218838;
}

.btn-warning {
    background-color: #ffc107;
    color: black;
}

.btn-warning:hover {
    background-color: #e0a800;
}

/* 크기별 스타일 */
.btn-small {
    padding: 0.4rem 0.8rem;
    font-size: 0.875rem;
}

.btn-medium {
    padding: 0.5rem 1rem;
    font-size: 1rem;
}

.btn-large {
    padding: 0.75rem 1.5rem;
    font-size: 1.25rem;
}
</style>
