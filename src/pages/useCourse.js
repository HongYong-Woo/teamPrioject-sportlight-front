import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useAPI } from '@/axios/useAPI';

export default function usecourses() {
    const { get } = useAPI();
  const courses = ref([]);

  const fetchInitialcourses = async () => {
    try {
      const response = await get('/courses/popular');
      courses.value = response.data;
      console.log("courses.value:", courses.value);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  onMounted(() => {
    fetchInitialcourses();
  });

  return {
    courses
  };
}