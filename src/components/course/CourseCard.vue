<!-- src/components/common/Card.vue -->
<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faArrowRight, faStar, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import priceFormatter from "../../util/priceFormatter.js";

const props = defineProps({
    id: { type: Number, required: true },
    nickname: { type: String, default: 'Card Host', },
    title: { type: String, default: 'Card Title', },
    address: { type: String, default: 'Card Address', },
    tuition: { type: Number, default: 0, },
    discountRate: { type: Number, default: 0, },
    time: { type: Number, default: 0, },
    level: { type: String, default: 'Card Level', },
    category: { type: String, default: 'Card Category', },
    rating: { type: Number, default: 0.0, },
    reviewCount: { type: Number, default: 0, },
    image: { type: String, default: null, },
    profileImage: { type: String, default: null, }
});

const router = useRouter();
const emits = defineEmits(['button-click']);
const isHovered = ref(false);
const discounted = computed(() => props.discountRate > 0);

function goToCourseDetail() {
    router.push({ name: 'CourseDetail', params: { id: props.id } });
}
</script>

<template>
    <div class="wrapper">
        <div class="card-wrapper" @mouseenter="isHovered = true" @mouseleave="isHovered = false" @click="goToCourseDetail">
            <!-- <img v-if="image" :src="image" alt="Card image" class="card-image" /> -->
             <div class="img-wrapper">
                <div v-if="discounted" class="discount-rate">{{ discountRate }}% off</div>
                <img :src="image" alt="Card image" class="card-image">
            </div>
            <div class="card-content">
                <h2 class="card-title">{{ title }}</h2>
                <div class="host-details">
                    <img src="../../../public/favicon.ico" alt="Profile image" class="profile-image">
                    <div>{{ nickname }}</div>
                </div>

                <div class="card-details" v-if="!isHovered">

                    
                    <div class="rating-details">
                        <span>
                            <FontAwesomeIcon :icon="faStar" size="sm" style="color: #FFD43B; margin-right: 4px;" />
                        </span>
                        <span class="rating">{{ rating }}</span>
                        <span class="rating-count">({{ reviewCount }})</span>
                    </div>
                    <div v-if="discounted" class="price">
                        <span class="tuition discounted">{{ priceFormatter(tuition - tuition * discountRate / 100)}}</span>
                        <span class="original">{{ priceFormatter(tuition) }}</span>
                    </div>
                    <span v-else class="tuition">{{ priceFormatter(tuition) }}</span>
                    <div class="empty-space"></div>
                </div>

                <div v-else class="card-details">
                    <span class="address">
                        <FontAwesomeIcon :icon="faLocationDot" size="sm" style="margin-right: 4px;" />{{ address }}
                    </span>
                    <div class="details-container">
                        <div class="details-left">
                            <span class="category">{{ category }}</span>
                            <span class="level">{{ level }}</span>
                        </div>
                        <span class="time details-right">
                            <FontAwesomeIcon :icon="faClock" size="sm" /> {{ time }}분
                        </span>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>


<style scoped>
.wrapper {
    padding: 0 0.25rem;
}

.card-wrapper {
    width: 100%;
    padding: 0.5rem;

    display: flex;
    flex-direction: column;
}

.card:hover {
    transition: all 1s;
}

.img-wrapper {
    position: relative;
}

.discount-rate {
    position: absolute;
    top: 0.25rem;
    left: 0.25rem;
    background-color: red;
    padding: 0.125rem 0.5rem;
    color: white;
    font-size: 0.75rem;
    border-radius: 0.25rem;
}

.card-image {
    width: 100%;
    aspect-ratio: 3 / 2;
    border-radius: 0.25rem;
    object-fit: cover;
    background-color: darkred;
}

/* 강사 정보 */
.host-details {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 0.25rem;
}

.profile-image {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 0.25rem;
    background-color: dimgrey;
}


.card-content {
    
}

.card-title {
    font-size: 1.3rem;
    font-weight: bold;
}

/* 정보 */
.card-details {}

/* 기본 */
.empty-space {
    height: 1rem;
}

.price {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 4px;
}

.tuition {
    font-weight: bold;
}

.original {
    font-size: 0.75rem;
    text-decoration: line-through;
    color: #767676;
}

.rating-details {
    margin-top: 8px;
}

.rating {
    margin-right: 0.125rem;
}

.rating-count {
    font-size: 0.75rem;
    color: #767676;
}

/* Hover 시 */
.address {
    color: #aaa;
    font-size: 0.9rem;
}

.details-container {
    display: flex;
    justify-content: space-between;
}

.details-left {
    display: flex;
    flex-direction: column;
}

.details-rigth {}

.category {}

.level {}

.time {
    align-content: end;
}
</style>