<script setup>
import { createPagingParam } from "@/util/PagingParam.js";
import { computed } from "vue";

const prop = defineProps({
  pagingParam: {
    type: Object,
    required: true,
    default: () => {
      return createPagingParam();
    },
  }
});

const emit = defineEmits(['changePage']);

const getPrevPage = () => {
  return prop.pagingParam.start - 1;
};

const getNextPage = () => {
  return prop.pagingParam.end + 1;
}

const pageNumList = computed(() => {
  const list = [];
  const start = prop.pagingParam.start;
  const end = prop.pagingParam.end;
  for(let i = start; i <= end; i++) {
    list.push(i);
  }
  return list;
});

const changePage = page => {
  emit('changePage', page);
}
</script>
<template>
  <nav aria-label="Page navigation example">
    <ul class="pagination justify-content-center">
      <li :class="prop.pagingParam.prev ? 'page-item' : 'page-item disabled'" @click="changePage(getPrevPage())"><a class="page-link">Prev</a></li>
      <li :class="prop.pagingParam.page === num ? 'page-item active':'page-item'" v-for="num in pageNumList" :key="num"  @click="changePage(num)"><a class="page-link">{{ num }}</a></li>
      <li :class="prop.pagingParam.next ? 'page-item' : 'page-item disabled'" @click="changePage(getNextPage())"><a class="page-link">Next</a></li>
    </ul>
  </nav>
</template>
<style scoped>
</style>
