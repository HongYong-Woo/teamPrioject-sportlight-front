<!-- src/components/CardList.vue -->
<script setup>
import Card from './CourseCard.vue';

const props = defineProps({
    courses: {
        type: Array,
    }
})

</script>

<template>
    <div class="card-list-container">
        <!-- <div v-if="loading" class="loading">Loading...</div> -->
        <div class="card-list">
            <Card v-for="card in courses" :key="card.id" :nickname="card.nickname" :title="card.title"
                :address="card.address" :tuition="card.tuition" :discountRate="card.discountRate" :time="card.time"
                :level="card.level" :category="card.category" :rating="card.rating" :reviewCount="card.reviewCount"
                :image="card.image" @button-click="handleCardButtonClick(card.id)" />
        </div>
    </div>
</template>



<style scoped>
.card-list-container {
    overflow-x: auto;
    padding: 8px;
}

.card-list {
    width: 100vw;
    display: flex;
    gap: 16px;
}

.card-list-container::-webkit-scrollbar {
    display: none;
}

.loading {
    text-align: center;
    font-size: 1.5rem;
    color: gray;
}
</style>