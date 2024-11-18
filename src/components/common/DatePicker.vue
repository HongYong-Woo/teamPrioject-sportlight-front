<script setup>
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { ref } from 'vue';

const props = defineProps({
    startDate: {
        type: String,
        default: null
    },
    endDate: {
        type: String,
        default: null
    }
});

const emit = defineEmits(['update:startDate', 'update:endDate']);
const today = ref(new Date());
const isExist = ref(false);

const dateRange = ref({ startDate: props.startDate, endDate: props.endDate });

const handleDateChange = (value) => {
    dateRange.value = value;
    emit('update:startDate', value ? value[0].toISOString().split('T')[0] : null);
    emit('update:endDate', value ? value[1].toISOString().split('T')[0] : null);
    isExist.value = value != null;
};

</script>

<template>
    <div class="datepicker-container">
        <Datepicker
            v-model="dateRange"
            range
            locale="ko"
            :format="'yyyy-MM-dd'"
            :class="['date-range-picker']"
            :enableTimePicker="false"
            :placeholder="'날짜를 선택하세요'"
            :autoApply="true"

            @update:modelValue="handleDateChange"
        />
        <div v-if="isExist" class="exist-light"></div>
    </div>
</template>

<style>
.datepicker-container {
    position: relative;
    display: inline-flex;
}

.date-range-picker {
    width: 16rem;
}

.dp__input {
    border-radius: 8px;
    height: 2.2rem;
    font-size: 1rem;
}

.dp__input:not(:placeholder-shown) {
    border-color: #333;
}

.dp__arrow_top {
    display: none;
}

.dp--clear-btn>.dp__icon:hover {
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

</style>
