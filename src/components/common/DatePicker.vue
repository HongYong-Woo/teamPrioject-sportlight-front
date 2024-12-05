<script setup>
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { computed, ref } from 'vue';

const props = defineProps({
    startDate: {
        type: String,
        default: null
    },
    endDate: {
        type: String,
        default: null
    },
    selectableDates: {
        type: Array,
        default: []
    },
    isRange: {
        type: Boolean,
        default: true // true: 범위 선택, false: 단일 날짜 선택
    },
    inline: {
        type: Boolean,
        default: false
    },
    position: {
        type: String,
        dafault: 'center',
    }
});

const emit = defineEmits(['update:startDate', 'update:endDate']);
const today = ref(new Date());
const isExist = ref(false);

const dateRange = ref(props.isRange ? { startDate: props.startDate, endDate: props.endDate } : props.startDate);

const allowedDatesSet = computed(() => new Set(props.selectableDates));

const disabledDates = (date) => {
    if (!props.isRange) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1 필요
        const day = String(date.getDate()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;
        return !allowedDatesSet.value.has(formattedDate);
    }
    return false;
};

const handleDateChange = (value) => {
    if (props.isRange) {
        dateRange.value = value;
        emit('update:startDate', value ? value[0].toISOString().split('T')[0] : null);
        emit('update:endDate', value ? value[1].toISOString().split('T')[0] : null);
    } else {
        dateRange.value = value;
        emit('update:startDate', value ? value.toISOString().split('T')[0] : null);
    }
    isExist.value = value != null;
};

</script>

<template>
    <div class="datepicker-container">
        <Datepicker
            v-model="dateRange"
            :range="isRange"
            locale="ko"
            :format="'yyyy/MM/dd'"
            :class="['date-range-picker']"
            :enableTimePicker="false"
            :placeholder="'날짜를 선택하세요'"
            :autoApply="true"
            :inline="inline"
            :disabledDates="disabledDates"
            :minDate="today"
            :monthChangeOnScroll="false"
            :position="position"
            @update:modelValue="handleDateChange"
        />
    </div>
</template>

<style scoped>
.datepicker-container {
    position: relative;
    display: inline-flex;
    width: 100% !important;
}

.dp__input {
    border-radius: 8px;
    height: 2.2rem;
    font-size: 1rem;
}

.dp--menu-wrapper {
    z-index: 99999;
}

.dp__input:not(:placeholder-shown) {
    border-color: #333;
}

.dp__arrow_top {
    display: none;
}

</style>
