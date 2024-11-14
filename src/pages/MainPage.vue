<script setup>
import Card from '../components/course/CourseCard.vue'
import { onMounted } from 'vue';
import useCourse from './useCourse.js'
import CardList from '../components/course/CardList.vue'
import Banner from '@/components/banner/Banner.vue';
import Chatbot from '../components/course/Chatbot.vue';

const { courses } = useCourse();

onMounted(() => {

});
</script>

<template>
    <Banner/>
    <div class="margin-banner"></div>
    <CardList/>
    <CardList/>
    <CardList/>
    <Chatbot/>
</template>

<style scoped>
.margin-banner {
    height: 400px;
}
</style>