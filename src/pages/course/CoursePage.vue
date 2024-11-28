<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useAPI } from '@/axios/useAPI.js';
import CardTable from '../../components/course/CardTable.vue';
import DropdownMulti from '../../components/common/DropdownMulti.vue';
import NumberSelect from '../../components/common/NumberSelect.vue';
import Slider from '../../components/common/MultiRangeSlider.vue';
import Datepicker from '../../components/common/DatePicker.vue';
import DropdownSingle from '../../components/common/DropdownSingle.vue';

// 평점 3.5점 이상 <-- 이런 필터링도 있는게 좋을거 같은데....
const filterOptions = ref({
    categories: [], // 선택된 카테고리
    levels: [], // 선택된 난이도
    minPrice: 0,
    maxPrice: 1000000,
    participants: 1,
    startDate: null, // 시작 날짜
    endDate: null, // 종료 날짜
    latitude: 0,
    longitude: 0,
    searchText: null,
    sortType: 'POPULARITY'
});

const { get } = useAPI();
const courses = ref([]);
const categories = ref([]);
const minPrice = ref(0);
const maxPrice = ref(1000000);
const minRange = ref(0);
const maxRange = ref(1000000);
const startDate = ref(null);
const endDate = ref(null);

const levels = [
    { value: 'BEGINNER', label: '초급' },
    { value: 'INTERMEDIATE', label: '중급' },
    { value: 'ADVANCED', label: '고급' }
];

const sortType = [
    { value: 'POPULARITY', label: '인기순' },
    { value: 'NEWEST', label: '최신순' },
    // { value: 'RATING', label: '별점순' },
    // { value: 'REVIEW_COUNT', label: '리뷰순' },
    // { value: 'DISTANCE', label: '거리순' }
];

async function fetchInitialcourses() {
    try {
        console.log(filterOptions.value.levels.join(','));
        const response = await get('/courses/list', {
            categories: filterOptions.value.categories.join(','),
            levels: filterOptions.value.levels.join(','),
            minPrice: filterOptions.value.minPrice,
            maxPrice: filterOptions.value.maxPrice,
            participants: filterOptions.value.participants,
            startDate: filterOptions.value.startDate,
            endDate: filterOptions.value.endDate,
            latitude: filterOptions.value.latitude,
            longitude: filterOptions.value.longitude,
            searchText: filterOptions.value.searchText,
            sortType: filterOptions.value.sortType
        });
        courses.value = response.data;
    } catch (error) {
        console.error("Failed to fetch courses:", error);
    }
};

async function fetchCategories() {
    try {
        const response = await get('/categories');
        categories.value = response.data.data.map((category) => ({
            value: category.id,
            label: category.name
        }));
        console.log(categories.value);
    } catch (error) {
        console.error("Failed to fetch categories:", error);
    }
}

onMounted(() => {
    fetchInitialcourses();
    fetchCategories();
});

watch(filterOptions, () => {
    fetchInitialcourses();
    console.log(filterOptions);
}, { deep: true });

function updateFilterOption(optionKey, newValues) {
    filterOptions.value[optionKey] = newValues;
}

function addCommas(amount) {
    return '￦' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

</script>

<template>

    <div class="options">
        <div class="filter">

            <DropdownMulti :options="levels" :selectedValues="filterOptions.levels"
                @update:selectedValues="(newValues) => updateFilterOption('levels', newValues)" placeholder="난이도" />

            <DropdownMulti :options="categories" :selectedValues="filterOptions.categories"
                @update:selectedValues="(newValues) => updateFilterOption('categories', newValues)"
                placeholder="카테고리" />

            <Slider :minValue="minPrice" :maxValue="maxPrice" :minRange="minRange" :maxRange="maxRange"
                :name="addCommas(filterOptions.minPrice) + ' ~ ' + addCommas(filterOptions.maxPrice)" placeholder="가격"
                @update:minValue="(newValue) => updateFilterOption('minPrice', newValue)"
                @update:maxValue="(newValue) => updateFilterOption('maxPrice', newValue)" />

            <div class="datepicker-container">
                <Datepicker :startDate="startDate" :endDate="endDate"
                    @update:startDate="(newValue) => updateFilterOption('startDate', newValue)"
                    @update:endDate="(newValue) => updateFilterOption('endDate', newValue)" />
            </div>
        </div>
        <div class="sort">
            <DropdownSingle :options="sortType" :selectedValue="filterOptions.sortType"
                @update:selectedValue="(newValue) => updateFilterOption('sortType', newValue)" />
        </div>
    </div>

    <CardTable :courses="courses" />
</template>

<style scoped>
.options {
    display: flex;
    justify-content: space-between;
}

.filter {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}

.datepicker-container {
    width: 16rem;
}
</style>
