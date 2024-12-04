<script setup>
import { useAPI } from "@/axios/useAPI";
import priceFormatter from "@/util/priceFormatter";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import CouponModal from '../../components/course/CouponModal.vue';
import Button from '../../components/common/Button.vue';
import router from "@/routers";
import Payment from '../../components/payment/Payment.vue';

const { get, post } = useAPI();
const scheduleId = useRoute().query.scheduleId;
const participantNum = useRoute().query.participantNum
const scheduleDetails = ref({});
const userInfo = ref({});
const coupons = ref([]);
const date = computed(() => {
    return scheduleDetails.value.startTime
        ? scheduleDetails.value.startTime.split('T')[0]
        : "";
    });
const couponIsOpen = ref(false);
const selectedCoupon = ref(null);
const couponDiscountAmount = computed(() => {
    if(!selectedCoupon.value) {
        return 0;
    }
    return Math.ceil(scheduleDetails.value.tuition * participantNum * selectedCoupon.value.discountRate / 100);
})
const courseDiscountAmount = computed(() => {
    if(scheduleDetails.value.discountRate == 0) return 0;
    return Math.ceil(scheduleDetails.value.tuition * participantNum * scheduleDetails.value.discountRate / 100);
})
const courseTotalDiscount = computed(() => {
    return Math.ceil(couponDiscountAmount.value + courseDiscountAmount.value);
})
const totalAmount = computed(() => {
    return Math.ceil(scheduleDetails.value.tuition * participantNum - courseTotalDiscount.value);
})
const isOpenPay = ref(false);



async function fetchScheduleInfo() {
    try {
        const response = await get(`/schedules/${scheduleId}`);
        scheduleDetails.value = response.data.data;
        console.log(scheduleDetails.value);
    } catch (error) {
        console.error('Failed to fetch Details', error);
    }
}

async function fetchUserInfo() {
    try {
        const response = await get(`/my/profile`);
        userInfo.value = response.data.data;
        console.log(userInfo.value);
    } catch (error) {
        console.log('Failed to fetch User Info', error);
    }
}

async function fetchCoupons() {
    try {
        const response = await get(`/coupons/available`);
        coupons.value = response.data.data;
        console.log(coupons.value);
    } catch (error) {
        console.log('Failed to fetch Coupons', error);
    }
}

onMounted(() => {
    fetchScheduleInfo();
    fetchUserInfo();
    fetchCoupons();
})

function couponBtnClickEvent() {
    couponIsOpen.value = true;
}

function applyCoupon(coupon) {
    selectedCoupon.value = coupons.value.find(c => c === coupon);
    couponIsOpen.value = false;
}

function cancelCoupon() {
    selectedCoupon.value = null;
    couponIsOpen.value = false;
}

function openPayment() {
    isOpenPay.value = true;
}

function clickOutside() {
    isOpenPay.value = false;
}
</script>
<template>
    <div class="info-container">
        <div class="course-info">
            <h2>수강 신청</h2>
            <div class="course-container">
                <img :src="scheduleDetails.imgUrl" alt="Course-img">
                <div class="title-container">
                    <div class="title">{{ scheduleDetails.courseTitle }}</div>
                    <div class="host">{{ scheduleDetails.hostNickname }}</div>
                </div>
            </div>
            <div class="date-time">
                <div class="title">날짜 및 시간</div>
                <span>{{ date }}</span>
                <span>
                    {{ new Date(scheduleDetails.startTime).toLocaleTimeString([], {
                    hour: '2-digit', minute: '2-digit'
                    }) }}
                    ~
                    {{ new Date(scheduleDetails.startTime).toLocaleTimeString([], {
                    hour: '2-digit', minute: '2-digit'
                    }) }}
                </span>
            </div>
            <div>
                <div class="title">위치</div>
                <span>{{ scheduleDetails.address }} {{ scheduleDetails.detailAddress }}</span>
                <div class="map"></div>
            </div>
        </div>
        <div class="important-info">
            <div class="gray-box">
                <div class="user-info-header">
                    <span>구매자 정보</span>
                    <button class="gray-btn">
                        수정
                    </button>
                </div>
                <div class="user-info">
                    <div class="user-info-set-container">
                        <div class="user-info-title">
                            <span>이름</span>
                        </div>
                        <span>{{ userInfo.userName }}</span>
                    </div>
                    <div class="user-info-set-container">
                        <div class="user-info-title">
                            <span>이메일</span>
                        </div>
                        <span>{{ userInfo.loginId }}</span>
                    </div>
                    <div class="user-info-set-container">
                        <div class="user-info-title">
                            <span>전화번호</span>
                        </div>
                        <span>{{ userInfo.userPhone }}</span>
                    </div>
                </div>
            </div>
            <div class="gray-box payment-box">
                <div class="payment-info-header">
                    <span>결제</span>
                </div>
                <div class="coupon-container">
                    <div class="payment-info-set-container">
                        <div class="payment-info-title coupon-title">쿠폰</div>
                        <div class="available-coupon">사용가능 <span>{{ coupons.length }}</span></div>
                    </div>
                    <div class="payment-info-set-container">
                        <div class="coupon-amount">
                            <span>{{ selectedCoupon ? priceFormatter(couponDiscountAmount) : "" }}</span>
                        </div>
                        <button class="gray-btn" @click="couponBtnClickEvent">선택</button>
                        <CouponModal v-if="couponIsOpen" :coupons="coupons" v-model:selectedCoupon="selectedCoupon"
                            @apply="applyCoupon" @cancel="cancelCoupon" />
                    </div>
                </div>
                <div class="tuition-calculate">
                    <div class="payment-info-set-container">
                        <div class="payment-info-title">선택 상품 금액</div>
                        <div>{{ priceFormatter(scheduleDetails.tuition * participantNum) }}</div>
                    </div>
                    <div v-if="scheduleDetails.discountRate" class="payment-info-set-container discount-amount">
                        <div class="payment-info-title">할인금액</div>
                        <div> {{ priceFormatter(courseTotalDiscount) }}</div>
                    </div>
                    <div v-if="scheduleDetails.discountRate" class="payment-info-set-container">
                        <div class="payment-info-title">- 즉시할인</div>
                        <div>{{ priceFormatter(courseDiscountAmount) }}</div>
                    </div>
                    <div v-if="couponDiscountAmount" class="payment-info-set-container">
                        <div class="payment-info-title">- 쿠폰할인</div>
                        <div>{{ priceFormatter(couponDiscountAmount) }}</div>
                    </div>
                </div>
                <div class="payment-info-set-container total-amount">
                    <div class="payment-info-title">총 결제 금액</div>
                    <div>{{ priceFormatter(totalAmount) }}</div>
                </div>
                <Button class="submit-button" @click="openPayment">
                    결제하기
                </Button>
                <span class="agreement">
                    회원 본인은 주문내용을 확인했으며, 구매조건 및 개인정보처리방침과 결제에 동의합니다.
                </span>
            </div>
        </div>
    </div>
    <div v-if="isOpenPay" @click="clickOutside" class="payment-container">
        <Payment class="payment-widget" 
            :userInfo="userInfo" 
            :amount="totalAmount"
            :orderName="scheduleDetails.courseTitle"
            :participantNum="participantNum"
            :schedule="scheduleDetails"
            :coupon="selectedCoupon"
            @click.stop />
    </div>
</template>
<style scoped>
.info-container {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
}

@media all and (min-width: 768px) {
    .course-info {
        width: 60%;
    }

    .important-info {
        position: sticky;
        width: 40%;
        height: fit-content;
        top: 6rem;
        padding-left: 3rem;
    }
}

@media all and (max-width: 767px) {
    .course-info {
        width: 100%;
    }

    .important-info {
        width: 100%;
    }
}

.course-info {}

.course-info>h2 {
    font-weight: bold;
    padding: 1rem 0;
    border-bottom: 1px solid #d9d9d9;
}

.course-info>div {
    margin-bottom: 1.5rem;
}

.course-container {
    display: flex;
    margin-top: 1rem;
}

.course-container>img {
    width: 30%;
    aspect-ratio: 3 / 2;
    object-fit: cover;
    border-radius: 0.5rem;
    border: 1px solid #d9d9d9;
}

.title-container {
    margin-left: 0.5rem;
}

.title {
    font-size: 1.3rem;
    font-weight: bold;
}

.host {
    font-size: 0.8rem;
    color: #767676;
}

.date-time {
    display: flex;
    flex-direction: column;
}

.map {
    aspect-ratio: 16/9;
    width: 100%;
    background-color: khaki;
}

.gray-box {
    border: 1px solid #d9d9d9;
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
}

.user-info-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid #d9d9d9;
}

.user-info-header>span {
    font-size: 1.1rem;
    font-weight: bold;
}

.gray-btn {
    font-size: 0.7rem;
    padding: 0.2rem 0.6rem;
    color: #767676;
    background: none;
    border: 1px solid #d9d9d9;
    border-radius: 1rem;
}

.gray-btn:hover {
    background-color: #d9d9d9;
    color: #333;
    transition: all 0.3s ease;
}

.user-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem 0;
}

.user-info-set-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
}

.user-info-title {
    width: 4rem;
    font-size: 0.8rem;
    color: #767676;
}

.payment-box {
    margin-top: 2rem;
}

.payment-info-header {
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid #d9d9d9;

    font-size: 1.1rem;
    font-weight: bold;
}

.coupon-container {
    margin-top: 1rem;
}

.payment-info-set-container {
    display: flex;
    justify-content: space-between;
}

.coupon-container>.payment-info-set-container {
    margin-top: 0.5rem;
}

.coupon-amount {
    flex-grow: 1;
    margin-right: 1.5rem;
    font-size: 0.8rem;
    align-content: center;
    padding-left: 0.25rem;
    background-color: #d9d9d988;
    border: 1px solid #d9d9d9;
    border-radius: 0.25rem;
}

.coupon-title {
    font-size: 1rem;
    font-weight: bold;
}

.tuition-calculate {
    margin-top: 1rem;
    display: grid;
    gap: 0.125rem;
}

.tuition-calculate, .available-coupon {
    font-size: 0.8rem;
    color: #767676;
}

.available-coupon>span {
    color: var(--primary-orange-color);
}

.discount-amount {
    color: red;
}

.total-amount {
    font-weight: bold;
    font-size: 1.1rem;
    margin-top: 0.75rem;
}

.submit-button {
    width: 100% !important;
    margin-top: 1rem;
}

.agreement {
    color: #767676;
    font-size: 0.75rem;
    display: block;
}

.payment-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 99999;
}

.payment-widget {
    margin-top: 10%;
}
</style>