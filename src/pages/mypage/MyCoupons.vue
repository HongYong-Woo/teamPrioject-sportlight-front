<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAPI } from '@/axios/useAPI';
import { useUiStore } from '@/stores/ui';

const uiStore = useUiStore();
const coupons = ref([]);
const error = ref(null);
const activeTab = ref('사용 가능');
const currentPage = ref(1);
const pageSize = ref(8);
const totalItems = ref(0);

const tabs = ['사용 가능', '사용 완료', '만료'];
const { get } = useAPI();

const STATUS_MAP = {
    '사용 가능': 'AVAILABLE',
    '사용 완료': 'USED',
    '만료': 'EXPIRED'
};

const REVERSE_STATUS_MAP = {
    'AVAILABLE': '사용 가능',
    'USED': '사용 완료',
    'EXPIRED': '만료'
};

const fetchCoupons = async (page = 1) => {
    try {
        uiStore.setLoading(true);
        error.value = null;

        const status = STATUS_MAP[activeTab.value];
        const url = `/my/coupons/paged?status=${status}&page=${page}&size=${pageSize.value}`;
        
        const response = await get(url);
        
        if (response.data) {
            coupons.value = response.data.data.map(coupon => ({
                ...coupon,
                status: activeTab.value
            }));
            totalItems.value = response.data.total || 0;
            currentPage.value = page;
        }
    } catch (err) {
        console.error('쿠폰을 불러오지 못했습니다:', err);
        error.value = '쿠폰을 불러오는 중 오류가 발생했습니다.';
    } finally {
        uiStore.setLoading(false);
    }
};

const getRemainingDays = (expirationDate) => {
    const today = new Date();
    const expDate = new Date(expirationDate);
    const diffTime = expDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

const setTab = (status) => {
    activeTab.value = status;
    currentPage.value = 1;
    fetchCoupons(1);
};

const goToPage = (page) => {
    if (page > 0 && page <= Math.ceil(totalItems.value / pageSize.value)) {
        fetchCoupons(page);
    }
};

const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));

const paginationArray = computed(() => {
    const delta = 2;
    const range = [];

    for (let i = Math.max(2, currentPage.value - delta);
        i <= Math.min(totalPages.value - 1, currentPage.value + delta);
        i++) {
        range.push(i);
    }

    if (currentPage.value - delta > 2) {
        range.unshift('...');
    }
    if (currentPage.value + delta < totalPages.value - 1) {
        range.push('...');
    }

    range.unshift(1);
    if (totalPages.value !== 1) {
        range.push(totalPages.value);
    }
    return range;
});

onMounted(() => fetchCoupons(1));
</script>

<template>
    <div class="coupons-container">
        <div class="header">
            <h1 class="title">내 쿠폰함</h1>
            <div class="stats">
            </div>
        </div>

        <div class="tabs-container">
            <div class="tabs">
                <button v-for="tab in tabs" :key="tab" :class="['tab-button', { active: activeTab === tab }]"
                    @click="setTab(tab)">
                    {{ tab }}
                    <span class="tab-count" v-if="activeTab === tab">({{ totalItems }})</span>
                </button>
            </div>
        </div>

        <div v-if="error" class="error-message">
            {{ error }}
        </div>

        <div v-else>
            <div v-if="coupons.length === 0" class="empty-state">
                <p>{{ activeTab }} 쿠폰이 없습니다.</p>
            </div>

            <div v-else class="coupon-grid">
                <div v-for="coupon in coupons" :key="coupon.id" class="coupon-item"
                    :class="{ 'expired': coupon.status !== '사용 가능' }">
                    <div class="coupon-content">
                        <div class="coupon-info">
                            <div class="coupon-main">
                                <h3 class="coupon-name">{{ coupon.name }}</h3>
                                <div class="discount-text">
                                    {{ coupon.discountPercentage }}<span class="percent">%</span>
                                </div>
                            </div>
                            <p class="event-name">{{ coupon.eventName }}</p>
                            <div class="coupon-footer">
                                <span class="validity">
                                    {{ new Date(coupon.issueDate).toLocaleDateString() }} ~
                                    {{ new Date(coupon.expirationDate).toLocaleDateString() }}
                                </span>
                                <span v-if="coupon.status === '사용 가능'" class="remaining-days"
                                    :class="{ 'warning': getRemainingDays(coupon.expirationDate) <= 7 }">
                                    {{ getRemainingDays(coupon.expirationDate) }}일 남음
                                </span>
                                <span v-else class="status-badge" :class="coupon.status">
                                    {{ coupon.status }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="pagination" v-show="totalPages > 1">
                <button class="page-button" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">
                    이전
                </button>

                <button v-for="page in paginationArray" :key="page"
                    :class="['page-number', { active: page === currentPage }]" @click="page !== '...' && goToPage(page)"
                    :disabled="page === '...'">
                    {{ page }}
                </button>

                <button class="page-button" :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">
                    다음
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.coupons-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.title {
    font-size: 2rem;
    font-weight: 700;
    color: #1a1a1a;
}

.stats {
    font-size: 1.1rem;
    color: #666;
}

.tabs-container {
    margin-bottom: 2rem;
}

.tabs {
    display: flex;
    gap: 1rem;
    border-bottom: 2px solid #f0f0f0;
    padding-bottom: 0.5rem;
}

.tab-button {
    background: none;
    border: none;
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
    color: #666;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 8px;
}

.tab-button:hover {
    background-color: #f8f9fa;
}

.tab-button.active {
    color: #FF9800;
    font-weight: 600;
    position: relative;
}

.tab-button.active::after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #FF9800;
}

.tab-count {
    margin-left: 0.5rem;
    font-size: 0.9rem;
    color: #999;
}

.coupon-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.coupon-item {
    background: white;
    border-radius: 16px;
    min-width: 200px;
    overflow: hidden;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    border: 2px solid #FF9800;
}

.coupon-item.expired {
    background: #f5f5f5;
    border-color: #e0e0e0;
}

.coupon-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
}

.coupon-item.expired .discount-text {
    color: #999;
}

.coupon-item.expired .coupon-name {
    color: #666;
}


.coupon-content {
    padding: 1.5rem;
    position: relative;
}

.coupon-main {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: nowrap;
    gap: 1rem;
    margin-bottom: 0.8rem;
}

.coupon-name {
    font-size: 1.2rem;
    font-weight: 600;
    min-width: 0;
    color: #1a1a1a;
    flex: 1;
}

.discount-text {
    color: #FF9800;
    font-weight: 700;
    font-size: 2rem;
    line-height: 1;
    white-space: nowrap;
    flex-shrink: 0;
}

.percent {
    font-size: 1.5rem;
    margin-left: 2px;
}

.event-name {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 1rem;
}

.coupon-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
    gap: 1rem;
}

.validity {
    font-size: 0.85rem;
    color: #999;
}

.remaining-days {
    font-size: 0.9rem;
    color: white;
    background: #FF9800;
    padding: 4px 12px;
    border-radius: 20px;
    white-space: nowrap;
}

.remaining-days.warning {
    background: #ff1744;
}

.status-badge {
    font-size: 0.9rem;
    padding: 4px 12px;
    border-radius: 20px;
    white-space: nowrap;
    background: #f5f5f5;
    color: #666;
}

.status-badge.EXPIRED {
    background: #ffebee;
    color: #c62828;
}

.status-badge.USED {
    background: #f5f5f5;
    color: #616161;
}

.status-badge.만료 {
    background: #ffebee;
    color: #c62828;
}

.status-badge.사용완료 {
    background: #f5f5f5;
    color: #616161;
}

.empty-state {
    text-align: center;
    padding: 4rem 0;
    color: #666;
}

.empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    margin-top: 2rem;
}

.page-button,
.page-number {
    padding: 0.5rem 1rem;
    border: 1px solid #FF9800;
    background: white;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #FF9800;
    min-width: 40px;
    text-align: center;
}

.page-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    border-color: #e0e0e0;
    color: #999;
}

.page-number.active {
    background: #FF9800;
    color: white;
    border-color: #FF9800;
}

.page-button:hover:not(:disabled),
.page-number:hover:not(:disabled):not(.active) {
    background: #fff3e0;
}

.error-message {
    text-align: center;
    padding: 2rem;
    color: #d32f2f;
    background: #ffebee;
    border-radius: 8px;
    margin: 2rem 0;
}

@media (max-width: 768px) {
    .coupons-container {
        padding: 1rem;
    }

    .coupon-grid {
        grid-template-columns: 1fr;
    }

    .header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }

    .tabs {
        overflow-x: auto;
        padding-bottom: 1rem;
        width: 100%;
    }

    .coupon-main {
    
        flex-direction: row;
        gap: 0.5rem;
    }

    .discount-text {
        align-self: flex-end;
    }

    .coupon-footer {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>