<script setup>
import { useAPI } from "@/axios/useAPI";
import { faCertificate, faPercent } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { onMounted, ref } from "vue";
import { formatDateString } from '../../util/DateFormatter';

const { get, post } = useAPI();

const coupons = ref([]);
const selectedCoupon = ref(null);

const fetchCoupons = async () => {
    try {
        const response = await get('/admin/coupons');
        coupons.value = response.data.data;
        console.log(coupons.value);
    } catch (err) {
        console.log('Failed to fetch coupons', err);
    }
}

const getCoupon = async () => {
    if (selectedCoupon.value) {
        try {
            const requestData = {
                couponId: selectedCoupon.value.couponId,
                eventId: selectedCoupon.value.eventId
            }
            console.log(requestData);
            const response = await post('/admin/get-coupon', requestData);
            alert(`${selectedCoupon.value.couponName} 쿠폰이 발급되었습니다!`);
        } catch (err) {
            console.log('Failed to get coupon', err);
            alert('쿠폰 발급에 문제가 생겼습니다. 나중에 다시 시도해 주세요.');
        }
    } else {
        alert('쿠폰을 선택해주세요.');
    }
}

onMounted(() => {
    fetchCoupons();
})

</script>
<template>
    <div class="container">
        <div class="card">
            <div class="main">
                <div class="co-img">
                    <FontAwesomeIcon :icon="faPercent" class="percent" />
                    <FontAwesomeIcon :icon="faCertificate" class="icon" />
                </div>
                <div class="vertical"></div>
                <div v-if="selectedCoupon" class="content">
                    <h1>{{ selectedCoupon.discountRate }}% <span>Coupon</span></h1>
                    <p>~ {{ formatDateString(selectedCoupon.endDate) }}</p>
                </div>
                <div v-else class="content">
                    <h1>쿠폰 선택</h1>
                    <p>만료 기간을 확인해주세요</p>
                </div>
            </div>
            <div class="copy-button">
                <select v-model="selectedCoupon">
                    <option :value="selectedCoupon" disabled selected hidden>쿠폰을 선택해주세요.</option>
                    <option v-for="coupon in coupons" :key="coupon.id" :value="coupon">
                        <p>{{ coupon.couponName }}</p>
                    </option>
                </select>
                <button class="copybtn" @click="getCoupon">GET</button>
            </div>
        </div>
    </div>

</template>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap");

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Poppins", sans-serif;
}

.container {
    width: 100%;
    justify-content: center;
    align-items: center;
    display: flex;
}

.card {
    width: 400px;
    height: 180px;
    border-radius: 5px;
    box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.2);
    background-color: #fff;
    padding: 10px 10px;
    position: relative;
}

.main,
.copy-button {
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    align-items: center;
}

.co-img {
    position: relative;
    color: #dc143c;
}

.percent {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 3rem;
}

.icon {
    width: 100px;
    height: 100px;
}

.vertical {
    border-left: 5px dotted black;
    height: 100px;
    position: absolute;
    left: 40%;
}

.content h1 {
    font-size: 35px;
    margin-left: -20px;
    color: #565656;
}

.content h1 span {
    font-size: 18px;
}

.content h2 {
    font-size: 18px;
    margin-left: -20px;
    color: #565656;
    text-transform: uppercase;
}

.content p {
    font-size: 16px;
    color: #696969;
    margin-left: -20px;
}

.copy-button {
    margin: 12px 0 -5px 0;
    height: 45px;
    border-radius: 4px;
    padding: 0 5px;
    border: 1px solid #e1e1e1;
}

.copy-button select {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    font-size: 15px;
}

.copy-button button {
    padding: 5px 20px;
    background-color: #dc143c;
    color: #fff;
    border: 1px solid transparent;
}
</style>
