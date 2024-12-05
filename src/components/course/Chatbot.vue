<script setup>
import { onMounted, ref } from 'vue';
import { chatbot } from '@/axios/ChatBot';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCommentDots, faXmark, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const {
    showChatbot,
    questionMessage,
    messages,
    chatScroll,
    toggleShowChatbot,
    sendChatbot
} = chatbot();

onMounted(() => {
  chatScroll.value = document.querySelector('.chatbotModalBody');
});

</script>

<template>
 
  <Transition name="rotate-fade">
    <button @click="toggleShowChatbot" class="chatbot_button">
        <!-- <img v-if="showChatbot" src="../../assets/img/Xbutton.png" class="buttonImg">
        <img v-else src="../../assets/img/chatbot.png" class="buttonImg"> -->
        <FontAwesomeIcon v-if="showChatbot" :icon="faXmark" size="xl" class="button-icon"/>
        <FontAwesomeIcon v-else :icon="faCommentDots" size="xl" class="button-icon"/>
      </button>
    </Transition>
  
    <Transition name="slide-fade">
    <div v-show="showChatbot" class="chatbotModal">
        <div class="chatbotModalHeader">
          <p>Sportlight</p>
        </div>
        <div class="chatbotModalBody" ref="chatScroll">
            <div v-for="message in messages" :key="message.id" class="chatbotMessage" :class="{userment :  message.sender !== 'chatbot'}">
                <span v-if="message.sender !== 'chatbot'" class="messageTime">{{ message.time }}</span>
                <div class="chatbotMessagecontent">
                    <img v-if="message.sender === 'chatbot'" src="../../assets/img/chatbot.png" class="messageImg">
                    <span :class="message.sender">{{ message.text }}</span>
                </div>
                <span v-if="message.sender === 'chatbot'" class="messageTime">{{ message.time }}</span>
               
            </div>

        </div>
        <div @submit.prevent = sendChatbot() class="chatbotModalFooter">
            <form class="inputQuestionForm">
                <input type="text" class="input" placeholder="질문을 입력하세요" v-model="questionMessage" required/>
                <button type="submit" class="submit_button"><FontAwesomeIcon :icon="faPaperPlane"/></button>
            </form>
                
           
        </div>
    </div>
</Transition>
</template>

<style scoped>
.chatbot_button {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #ff9500b5;
    text-align: center;
    align-content: center;
    color: white;
    font-weight: bold;
    font-size: large;
    border-width: 0px;

    cursor: pointer;

    overflow: hidden;
    position: fixed;
    right: 2rem;
    bottom: 50px;
}

.buttonImg {
    width: 100%;
    height: 100%;
    object-fit: cover;
    background-color: transparent;    
    /* position: absolute; */
  top: 0;
  left: 0;
    transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out; /* 애니메이션 효과 추가 */
}

.button-icon {
  transition: all 0.2s ease-in-out; /* 애니메이션 효과 추가 */
}


.rotate-fade-enter-active, .rotate-fade-leave-active {
  transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out; /* 애니메이션 효과 추가 */
}

.rotate-fade-enter, .rotate-fade-leave-to {
    transform: rotate(360deg);    
    opacity: 0;
}

.chatbotModal {
    position: fixed;
    right: 30px;
    bottom: 120px;
    width: 323px;
    height: 500px;
  
    background: #f9f9f9;
  box-shadow: 5px 5px 5px rgba(0,0,0,0.3);
  z-index: 1000;
  border: 3px;;
    /* border: 3px solid transparent;  */
  /* border-image: linear-gradient(to left bottom, #FF9500, #008CFF) 1; */ 
  border-radius: 10px;
  display: flex;
  flex-direction: column;

 
  
}

.chatbotModalHeader {
    height: 40px;
    background-color: #f0f0f0;
    color: #333;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 15px;
    font-size: 20px;
}

.chatbotModalBody {
    overflow-y: auto;
    height: 363px;
    padding-top: 10px;
    flex: 1;
    scrollbar-width: thin;
}

.chatbotMessage{
  display: flex;
  flex-direction: row;
    margin: 10px;
}

.chatbotMessagecontent {
    position: relative;

    display: flex;
    
}

.messageImg {
    width: 30px;
    height: 30px;
}

.userment {
  justify-content: end;
}

.user {
  text-align: right;
  background-color: #d4ecff;
  padding: 10px;
  font-size: 90%;
  margin-left: auto;
  display: inline-block;
  max-width: 100%;
  word-wrap: break-word;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
}

.chatbot {
  text-align: left;
  background-color: #faecd9;
  padding: 10px;
  font-size: 90%;

  border-top-right-radius: 20px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}

.messageTime {
    float: right;
    margin: 2px;
    margin-right: 10px;
    font-size: 70%;

    white-space: nowrap;
    align-self: flex-end;
}

.chatbotModalFooter {
    background-color: #f0f0f0;
    height: 60px;
    padding: 10px;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
}

.inputQuestionForm {
    border-radius: 20px;
    background-color: white;
    width: 300px;
    display: flex;
    
}

.input {
    width: 250px;
    height: 40px;
    outline: none;
    background-color: transparent;
    border-width: 0px;
    border-radius: 20px;
    padding-left: 1rem;
    
}


.submit_button{
    width: 40px;
    height: 40px;
    border-width: 0px;
    background-color: transparent;
    border-radius: 20px;
    cursor: pointer;
}

.submit_image{
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* 스크롤바 스타일 */
.chatbotModalBody::-webkit-scrollbar {
  width: 10px; /* 스크롤바 너비 */
}

.chatbotModalBody::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.5); /* 스크롤바 색상 */
  border-radius: 10px; /* 스크롤바 모서리 둥글게 */
}

.chatbotModalBody::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.1); /* 스크롤바 트랙 색상 */
}



/*
  진입/진출 애니메이션은 다른 지속 시간과
  타이밍 함수를 사용할 수 있습니다.
*/
.slide-fade {
  bottom: 20%;
    left: 50%;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  /* transform: translateX(20px); */
  transform: translate(20px, 10px);
  opacity: 0;
}
</style>