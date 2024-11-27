<script setup>
import { ref, watch } from 'vue';
import Button from '../common/Button.vue';

const props = defineProps({
    coupons: Array, // 쿠폰 목록
    selectedCoupon: Object // 선택된 쿠폰
});

const emit = defineEmits(['apply', 'cancel']);
const internalSelectedCoupon = ref(props.selectedCoupon);

watch(() => props.selectedCoupon, (newVal) => {
    internalSelectedCoupon.value = newVal;
});

function applyCoupon() {
    console.log(internalSelectedCoupon.value);
    emit('apply', internalSelectedCoupon.value);
}

function cancelModal() {
    emit('cancel');
}

function formattedDateTime(dateTime) {
    const now = new Date();
    const targetDate = new Date(dateTime);
    const remainingDays = Math.ceil((targetDate - now) / (1000 * 60 * 60 * 24));

    return remainingDays + '일 후 만료 (' + dateTime
        .slice(0, 10)
        .replace('-','.')
        .replace('-','.') + ')';
}
</script>

<template>
    <div class="modal-overlay">
        <div class="modal-content" @click.stop>
            <h3>쿠폰 선택</h3>
            <div class="coupon-list">
                <div v-if="!coupons.length" class="no-coupon">
                    <p>🤪</p>
                    사용 가능한 쿠폰이 없습니다.
                </div>
                <div v-for="coupon in coupons" :key="coupon.id" :class="['coupon-option', { selected: coupon === internalSelectedCoupon }]">
                    <label>
                        <div>
                            <span class="amount">{{ coupon.discountRate }}%</span>
                            <span class="name">{{ coupon.name }}</span>
                            <span class="exp-date">{{ formattedDateTime(coupon.expDate) }}</span>
                        </div>
                        <input
                            type="radio"
                            :value="coupon"
                            v-model="internalSelectedCoupon"
                        />
                    </label>
                </div>
            </div>
            <div class="modal-actions">
                <Button @click="applyCoupon" :disabled="!internalSelectedCoupon">적용하기</Button>
                <Button @click="cancelModal">취소</Button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    width: auto;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.no-coupon {
    text-align: center;
}

.no-coupon>p {
    font-size: 4rem;
    animation: rotate 1s linear infinite;
}

@keyframes rotate {
    100% {
        transform: rotate(-360deg);
    }
}

.coupon-list {
    display: grid;
    gap: 0.25rem;
}

.coupon-option {
    border: 1px solid #d9d9d9;
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
}

.coupon-option:hover {
    border-color: #767676;
    transition: all 0.3s ease;
}

.selected {
    border-color: #767676;
}

.coupon-option>label {
    display: flex;
    justify-content: space-between;
}

.coupon-option>label>div {
    display: flex;
    flex-direction: column;
    margin-right: 3rem;
}

.amount {
    font-weight: bold;
    font-size: 1.2rem;
    color: red;
}

.name {

}

.exp-date {
    font-size: 0.8rem;
    color: #767676;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 1rem;
}

button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:first-of-type {
    color: white;
}

button:last-of-type {
    background-color: #ccc;
    color: white;
}

button:last-of-type:hover {
    background-color: #767676;
}
</style>
