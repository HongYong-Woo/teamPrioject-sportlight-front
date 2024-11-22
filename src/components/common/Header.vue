<script setup>
import { ref } from 'vue';
import { faChevronDown, faChevronUp, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const isCategoryOpen = ref(false);

function toggleCategoryMenu() {
    isCategoryOpen.value = !isCategoryOpen.value;
}
</script>

<template>
    <header>
        <div class="header-container">
            <div class="logo-container">
                <RouterLink to="/">
                    <img class="logo-img" src="@/assets/logo.png" alt="Logo" />
                </RouterLink>
            </div>

            <nav>
                <RouterLink to="/course" class="menu">클래스</RouterLink>
                <RouterLink to="/community" class="menu">커뮤니티</RouterLink>
                <div>
                    <button class="menu" @click="toggleCategoryMenu">
                        카테고리
                        <FontAwesomeIcon v-if="!isCategoryOpen" :icon="faChevronDown" size="sm" style="margin-left: 4px" />
                        <FontAwesomeIcon v-else :icon="faChevronUp" size="sm" style="margin-left: 4px" />
                    </button>
                </div>
            </nav>

            <form class="search-container">
                <input type="text" />
                <button>
                    <FontAwesomeIcon :icon="faMagnifyingGlass" />
                </button>
            </form>

            <div class="user-info">
                <button class="login-btn" type="button">로그인</button>
            </div>
        </div>
    </header>
    <!-- 카테고리 목록 -->
    <transition name="slide-down">
        <ul v-if="isCategoryOpen" class="category-list">
            <li>러닝</li>
            <li>헬스</li>
            <li>클라이밍</li>
            <li>요가</li>
            <li>필라테스</li>
            <li>탁구</li>
            <!-- 추가 카테고리 항목 -->
        </ul>
    </transition>
    <transition name="dark-page">
        <div v-if="isCategoryOpen" class="dark-page" @click="toggleCategoryMenu"></div>
    </transition>
</template>

<style scoped>
@import '../../styles/header.css';

header{
    border-bottom: 1px solid #d9d9d9;
}

.category-list {
    list-style: none;
    padding: 1rem 15rem 0 15rem;
    margin: 0;
    height: 200px;
    background-color: white;
    border: 1px solid #ddd;
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
}

/* 슬라이드 다운 애니메이션 */
.slide-down-enter-active,
.slide-down-leave-active {
    transition: all 0.5s ease;
}

.slide-down-enter-from {
    transform: translateY(-200px);
}

.slide-down-enter-to {
    transform: translateY(0);
}

.slide-down-leave-from {
    transform: translateY(0);
}

.slide-down-leave-to {
    transform: translateY(-200px);
}

/* 어두워지게 하는 애니메이션 */
.dark-page {
    position: absolute;
    width: 100vw;
    height: 100vh;
    top: 64px;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
}

.dark-page-enter-active,
.dark-page-leave-active {
    transition: all 0.5s ease;
}

.dark-page-enter-from, .dark-page-leave-to {
    opacity: 0;
}

.dark-page-enter-to, .dark-page-leave-from {
    opacity: 1;
}

</style>
