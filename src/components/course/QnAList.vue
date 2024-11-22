<script setup>
import { useAPI } from "@/axios/useAPI";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { onMounted, ref } from "vue";
import Button from '../../components/common/Button.vue';

const props = defineProps({
  courseId: {
    type: String,
    required: true,
  },
});

const { get } = useAPI();

const questions = ref([{}]);
const replyVisible = ref({});
const replyData = ref({});

async function fetchQnAs(state) {
    try {
        const response = await get(`/courses/${props.courseId}/qnas`);
        state.value = response.data.data;
    } catch (error) {
        console.error('Failed to fetch QnAs', error);
    }
}

onMounted(() => {
  fetchQnAs(questions);
})

const toggleReply = (index) => {
  replyVisible.value[index] = !replyVisible.value[index];
  // 답글 입력 데이터 초기화
  if (!replyVisible.value[index]) {
    replyData.value[index] = { title: "", content: "" };
  }
};

const submitReply = (index) => {
  const reply = replyData.value[index];
  console.log(replyData.value);
  if (reply?.title && reply?.content) {
    alert(`답글 등록: 제목 - ${reply.title}, 내용 - ${reply.content}`);
    // 여기에서 백엔드 API 호출 등 답글 저장 로직 추가
    replyVisible.value[index] = false;
  } else {
    alert("답글 제목과 내용을 모두 입력해주세요.");
  }
};

</script>

<template>
  <div class="qna-list">
    <div v-for="(question, index) in questions" :key="index">
      <div class="question-item">
        <div class="title-header">
          <div class="title-info">
            <span class="title">Q. {{ question.qtitle }}</span>
            <span class="date">{{ new Date(question.qregDate).toLocaleDateString() }}</span>
          </div>
          <div> <!-- v-if 조건 로그인 한 사람이 이 강의의 강사일 경우 -->
            <span class="reply-btn" @click="toggleReply(index)">답글</span>
          </div>
        </div>
        <p class="content">{{ question.qcontent }}</p>
      </div>
      <div v-if="replyVisible[index]" class="reply-form">
        <input 
          class="reply-title" 
          type="text" 
          placeholder="답글 제목을 입력하세요"
          :v-model="replyData[index]?.title"
        />
        <textarea 
          class="reply-input" 
          placeholder="답글 내용을 입력하세요"
          :v-model="replyData[index]?.content"
        ></textarea>
        <Button size="small" class="reply-submit" @click="submitReply(index)">등록</Button>
      </div>

      <div v-if="question.aid" class="answer-header">
        <FontAwesomeIcon :icon="faArrowRight" class="arrow"/>
        <div class="answer-item">
          <div class="title-header">
            <div>
              <span class="title">A. {{ question.atitle }}</span>
              <span class="date">{{ new Date(question.aregDate).toLocaleDateString() }}</span>
            </div>
          </div>
          <p class="content">{{ question.acontent }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.question-item {
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #d9d9d9;
}

.title-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.title-info {
  display: flex;
  flex-direction: row;
  align-items: baseline;
}

.title {
  font-size: 1.1rem;
  font-weight: bold;
}

.date {
  font-size: 0.75rem;
  color: #888;
  margin-left: 0.25rem;
}

.reply-btn {
  font-size: 0.75rem;
  color: #888;
  text-decoration: underline;
}

.content {
  margin-top: 0.25rem;
  color: #333;
}

.reply-form {
  padding: 0.5rem 1rem;
  background-color: #f9f9f9;
  border-bottom: 1px solid #d9d9d9;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.reply-title {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.reply-input {
  width: 100%;
  padding: 0.5rem;
  height: 80px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.reply-submit {
  align-self: flex-end;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.answer-header {
  display: flex;
  flex-direction: row;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #d9d9d9;
  background-color: #f7f7f7;
}

.arrow {
  padding: 0.1rem 0.5rem 0 0.5rem;
}

</style>
