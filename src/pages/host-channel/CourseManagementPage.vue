 <template>
  <div class="main-container row">
    <div class="sidebar col-3">
      <SideBar :categories="categories"></SideBar>
    </div>
    <div class="content col-9">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import SideBar from "@/components/host-channel/SideBar.vue";
import {useRoute} from "vue-router";
import {computed} from "vue";
const route = useRoute()

const categories = computed(() => {
  const courseId = route.params.id;
  return [
    { id: 1, name: '신청자 내역', link: `/management/${courseId}/applicants` },
    { id: 2, name: '클래스 정보', link: `/management/${courseId}/courses` },
    { id: 3, name: '클래스 일정 관리', link: `/management/${courseId}/schedules` },
    { id: 4, name: '클래스 문의', link: `/management/${courseId}/qnas` },
  ];
});
</script>
