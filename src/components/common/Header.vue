<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { RouterLink } from 'vue-router';
import { faChevronDown, faChevronUp, faMagnifyingGlass, faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import Login from './Login.vue';
import ProfileDropdown from './ProfileDropdown.vue';
import Notification from '../Notification.vue';

const auth = useAuthStore();
const router = useRouter();

const isCategoryOpen = ref(false);
const isMyPageDropdownVisible = ref(false);
const isSidebarOpen = ref(false);
const isResponsive = ref(false);
const sidebarCategoryOpen = ref(false);
const searchQuery = ref('');
const sidebarSearchQuery = ref('');

const isModalVisible = ref(false);

const toggleLoginModal = () => {
    isModalVisible.value = !isModalVisible.value;
    auth.toggleLoginModal(isModalVisible.value);
};

const isAuthenticated = computed(() => {
    return Boolean(auth.token) && auth.isAuthenticated;
});

const defaultProfileImage = new URL('@/assets/default_img.jpg', import.meta.url).href;

const profileImage = computed(() => {
    if (!auth.token || !auth.profileImage) {
        return defaultProfileImage;
    }
    return auth.profileImage;
});

const handleDropdownChange = async (selectedValue) => {
    if (selectedValue === 'mypage') {
        await router.push("/mypage");
    } else if (selectedValue === 'logout') {
        await handleLogout();
    }
};

const handleLogout = async () => {
    isMyPageDropdownVisible.value = false;
    await auth.logout();
    router.push("/");
};

const updateDropdownVisibility = (value) => {
    isMyPageDropdownVisible.value = value;
};

const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
};

function toggleCategoryMenu() {
    if (isResponsive.value) {
        sidebarCategoryOpen.value = !sidebarCategoryOpen.value;
    } else {
        isCategoryOpen.value = !isCategoryOpen.value;
    }
}

const handleSearch = (e) => {
    e.preventDefault();
    // 여기에 검색 로직 구현해야댐
    console.log('Searching for:', searchQuery.value);
};

const handleSidebarSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', sidebarSearchQuery.value);
    isSidebarOpen.value = false;
    router.push(`/search?q=${encodeURIComponent(sidebarSearchQuery.value)}`);
};

const handleKeydown = (event) => {
    if (event.key === "Escape" && isSidebarOpen.value) {
        toggleSidebar();
    }
};

const handleLoginClose = () => {
    isModalVisible.value = false;
    auth.closeLoginModal();
};

const handleResize = () => {
    isResponsive.value = window.innerWidth <= 768;
    if (isResponsive.value) {
        isCategoryOpen.value = false;
    }
};

onMounted(() => {
    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeydown);
    handleResize();
});

onUnmounted(() => {
    window.removeEventListener("resize", handleResize);
    window.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
    <header class="fixed-header">
        <div class="header-container" :class="{ 'responsive-header': isResponsive }">
            <div v-if="isResponsive" class="header-left">
                <button class="menu-icon" @click="toggleSidebar">
                    <FontAwesomeIcon :icon="faBars" size="lg" />
                </button>
            </div>

            <div class="logo-container" :class="{ 'responsive-logo-container': isResponsive }">
                <RouterLink to="/">
                    <img class="logo-img" src="@/assets/logo.png" alt="Logo" />
                </RouterLink>
            </div>

            <nav v-if="!isResponsive" class="navigation">
                <RouterLink to="/course" class="nav-link">클래스</RouterLink>
                <button class="nav-link" @click="toggleCategoryMenu">
                    카테고리
                    <FontAwesomeIcon v-if="!isCategoryOpen" :icon="faChevronDown" size="sm" style="margin-left: 4px" />
                    <FontAwesomeIcon v-else :icon="faChevronUp" size="sm" style="margin-left: 4px" />
                </button>
            </nav>

            <form v-if="!isResponsive" class="search-container" @submit="handleSearch">
                <div class="search-input-container">
                    <FontAwesomeIcon :icon="faMagnifyingGlass" class="search-icon" />
                    <input type="text" v-model="searchQuery" placeholder="검색어를 입력하세요" class="search-input" />
                </div>
            </form>

            <div class="header-right">
                <RouterLink v-if="isAuthenticated && auth.userRoles.includes('HOST')" to="/hostchannel/main" class="custom-btn instructor-btn">
                    강사 채널
                </RouterLink>
                <RouterLink v-else-if="isAuthenticated" to="/mypage/host-request" class="custom-btn instructor-btn">
                    강사 등록하기
                </RouterLink>

                <Notification v-if="isAuthenticated && !isResponsive" class="notification-btn" />

                <ProfileDropdown v-if="isAuthenticated" :is-visible="isMyPageDropdownVisible" :profile-image="profileImage"
                    @update:is-visible="updateDropdownVisibility" @handle-dropdown="handleDropdownChange" />
                <button v-else class="custom-btn" @click="toggleLoginModal">
                    로그인
                </button>
            </div>
        </div>

        <transition name="slide-right">
            <div v-if="isSidebarOpen && isResponsive" class="sidebar">
                <button class="close-btn" @click="toggleSidebar">&times;</button>

                <form class="sidebar-search" @submit="handleSidebarSearch">
                    <div class="search-input-container">
                        <FontAwesomeIcon :icon="faMagnifyingGlass" class="search-icon" />
                        <input type="text" v-model="sidebarSearchQuery" placeholder="검색어를 입력하세요" class="search-input" />
                    </div>
                </form>

                <ul class="sidebar-menu">
                    <li>
                        <RouterLink to="/course" class="sidebar-link">클래스</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/community" class="sidebar-link">커뮤니티</RouterLink>
                    </li>
                    <li class="sidebar-category" @click="toggleCategoryMenu">
                        카테고리
                        <FontAwesomeIcon :icon="sidebarCategoryOpen ? faChevronUp : faChevronDown" size="sm" />
                    </li>
                    <transition name="slide-down">
                        <div v-if="sidebarCategoryOpen" class="sidebar-category-list">
                            <li>러닝</li>
                            <li>헬스</li>
                            <li>클라이밍</li>
                            <li>요가</li>
                            <li>필라테스</li>
                            <li>탁구</li>
                        </div>
                    </transition>
                    <li v-if="isAuthenticated && auth.userRoles.includes('HOST')">
                        <RouterLink to="/hostchannel/main" class="sidebar-link">강사 채널</RouterLink>
                    </li>
                    <li v-else-if="isAuthenticated">
                        <RouterLink to="/mypage/host-request" class="sidebar-link">강사 등록하기</RouterLink>
                    </li>
                </ul>
            </div>
        </transition>
    </header>

    <transition name="slide-down">
        <ul v-if="isCategoryOpen && !isResponsive" class="category-list">
            <li>러닝</li>
            <li>헬스</li>
            <li>클라이밍</li>
            <li>요가</li>
            <li>필라테스</li>
            <li>탁구</li>
        </ul>
    </transition>

    <transition name="fade">
        <div v-if="(isCategoryOpen && !isResponsive) || isSidebarOpen" class="dark-page"
            @click="isResponsive ? toggleSidebar() : toggleCategoryMenu()"></div>
    </transition>

    <Login v-if="isModalVisible" @close="handleLoginClose" />
</template>

<style scoped>
@import '../../styles/header.css';

.header-container.responsive-header {
    padding: 0 16px;
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 1rem;
}

.header-left,
.header-right {
    display: flex;
    align-items: center;
    gap: 2rem;
}

.logo-container {
    flex-shrink: 0;
    margin-right: 10px;
    align-items: center;
}

.logo-img {
    height: 2rem;
}

.responsive-logo-container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.navigation {
    display: flex;
    align-items: center;
    font-weight: bold;
    gap: 0.5rem;
    white-space: nowrap;
}

.nav-link {
    color: #333;
    text-decoration: none;
    font-size: 18px;
    padding: 0.5rem;
    border: none;
    background: none;
    cursor: pointer;
}

.nav-link:hover {
    color: #FF9300;
}

.search-container {
    flex: 1;
    max-width: 500px;
    margin: 0 1.5rem;
}

.search-input-container {
    position: relative;
    width: 100%;
}

.search-icon {
    position: absolute;
    right: 19px;
    top: 50%;
    transform: translateY(-50%);
    color: #6B7280;
    z-index: 1;
}

.search-input {
    width: 100%;
    height: 40px;
    padding: 0 40px 0 12px;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    outline: none;
    background-color: white;
    font-size: 14px;
}

.search-input:focus {
    border-color: #FF9300;
    background-color: white;
}

.sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 280px;
    height: 100vh;
    background-color: white;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    z-index: 100;
    overflow-y: auto;
}

.sidebar-search {
    margin: 4rem 0;
    padding: 0 0.2rem;
}

.close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
}

.sidebar-menu {
    list-style: none;
    padding: 0;
    margin: 0;
}

.sidebar-link {
    display: block;
    color: #333;
    text-decoration: none;
    padding: 0.75rem 1rem;
    font-size: 18px;
}

.sidebar-category {
    padding: 0.75rem 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 18px;
}

.sidebar-category-list {
    background-color: white;
    border-top: 1px solid #f0f0f0;
    border-bottom: 1px solid #f0f0f0;
}

.sidebar-category-list li {
    padding: 0.5rem 2rem;
    cursor: pointer;
}

.category-list {
    list-style: none;
    padding: 1rem max(15rem, calc((100% - 1200px) / 2 + 15rem));
    margin: 0;
    max-height: calc(100vh - 64px);
    overflow-y: auto;
    background-color: white;
    border-top: 1px solid #e5e7eb;
    border-bottom: 1px solid #e5e7eb;
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    z-index: 20;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 0.5rem;
}

.category-list li {
    padding: 0.5rem;
    cursor: pointer;
}

.dark-page {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 15;
    transition: opacity 0.5s ease;
}



.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
}


.slide-right-enter-active,
.slide-right-leave-active {
    transition: transform 0.3s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
    transform: translateX(-100%);
}

.slide-down-enter-active,
.slide-down-leave-active {
    transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
    transform: translateY(-10px);
    opacity: 0;
}

.slide-down-enter-to,
.slide-down-leave-from {
    transform: translateY(0);
    opacity: 1;
}

.custom-btn {
    border: 2px solid #FF9300;
    background-color: white;
    color: #FF9300;
    padding: 0px 10px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: bold;
    cursor: pointer;
    height: 35px;
    width: 60px;
    min-width: 60px;
    transition: all 0.3s ease;
    margin-left: 1rem;
}

.custom-btn:hover {
    background-color: #FF9300;
    color: white;
}

.custom-btn:active {
    transform: scale(0.98);
}

.instructor-btn {
    margin-left: 1rem;
    font-size: 13px;
    width: 100px;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
}

.menu-icon:focus {
    outline: none;
    box-shadow: none;
}

@media (max-width: 768px) {
    .search-container {
        display: none;
    }

    .navigation {
        display: none;
    }

    .category-list {
        padding: 1rem;
    }

    .header-container {
        justify-content: space-between;
    }

    .logo-container {
        margin-right: 0;
    }

    .header-right .instructor-btn {
        display: none;
    }

    .sidebar-menu li .sidebar-link {
        margin-top: 0.5rem;
    }

    .notification-btn {
        display: none !important;
    }
}
</style>