<script setup>
import router from "@/routers/index.js";
import { useRoute } from 'vue-router'
import { onMounted, ref, watch } from "vue";
import { useAPI } from '@/axios/useAPI';
const { get } = useAPI();
import { createPagingParam } from "@/util/PagingParam";
import { formatDateString } from "@/util/LocalDateTimeFormatter.js";
import PagingBar from "@/components/common/PagingBar.vue";

const route = useRoute();
const adjustmentList = ref([]);
const pagingParam = ref({});

const fetchAdjustmentList = async (page, size) => {
  try {
    const response = await get(`/adjustments?page=${page ? page : 1}&size=${size ? size : 15}`);
    pagingParam.value = createPagingParam(response.data);
    adjustmentList.value = response.data.data;
  } catch (error) {
    console.error('Failed to fetch Details', error);
  }
};

onMounted(() => {
  const page = route.query.page;
  const size = route.query.size;
  fetchAdjustmentList(page, size);
});

watch(() => [route.query.page, route.query.size],
    ([newPage, newSize]) => {
      fetchAdjustmentList(newPage, newSize);
    }
);

const reloadPage = page => {
  router.push({
    name: 'AdjustmentList',
    query: {
      page: page,
      size: pagingParam.value.size,
    }
  })
};

const getStatusString = status => {
  switch (status) {
    case 'REQUEST': {
      return '요청';
    }
    case 'APPROVAL': {
      return '승인';
    }
    case 'FAIL': {
      return '보류';
    }
    case 'COMPLETE': {
      return '완료';
    }
    default: {
      return '';
    }
  }
};

</script>

<template>
  <div class="table-container">
    <h2 class="mb-3">정산 내역</h2>
    <table class="table">
      <thead>
      <tr>
        <th scope="col">예금주 성함</th>
        <th scope="col">입금 요청 은행</th>
        <th scope="col">정산 예정액(원)</th>
        <th scope="col">정산 요청 날짜</th>
        <th scope="col">정산 진행 현황</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in adjustmentList" :key="item.id">
        <td>{{ item.depositor }}</td>
        <td>{{ item.bankName }}</td>
        <td>{{ item.totalAmount.toLocaleString() }}</td>
        <td>{{ formatDateString(item.reqDate) }}</td>
        <td>{{ getStatusString(item.status) }}</td>
      </tr>
      </tbody>
    </table>
  </div>
  <div>
    <PagingBar :paging-param="pagingParam" @changePage="reloadPage"></PagingBar>
  </div>
</template>

<style scoped>
.table-container {
  min-height: 500px;
}
tr {
  text-align: center;
}
</style>
