<script setup>
import { ref } from 'vue';
import { chatbot } from '@/axios/ChatBot';


const {
    showChatbot,
    questionMessage,
    messages,
    toggleShowChatbot,
    sendChatbot
} = chatbot();



</script>

<template>
 
    <button @click="toggleShowChatbot" class="chatbot_button">
      <Transition name="rotate-fade">
        <img v-if="showChatbot" src="../../assets/img/Xbutton.png" class="buttonImg">
        <img v-else src="../../assets/img/chatbot.png" class="buttonImg">
      </Transition>
    </button>
  
    <Transition name="slide-fade">
    <div v-show="showChatbot" class="chatbotModal">
        <div class="chatbotModalHeader">
            <img src="../../assets/spotlightLogo.png" alt="Logo"  class="logo">
            <img src="../../assets/logo.png" alt="sportlight" class="titlelogo">
            <hr>
        </div>
        <div class="chatbotModalBody">
            <div v-for="message in messages" class="chatbotMessage">
                <div class="chatbotMessagecontent">
                    <img v-if="message.sender === 'chatbot'" src="../../assets/img/chatbot.png" class="messageImg">
                    <p :class="message.sender">{{ message.text }}</p>
                </div>
                <span class="messageTime">{{ message.time }}</span>
               
            </div>

        </div>
        <div @submit.prevent = sendChatbot() class="chatbotModalFooter">
            <form class="inputQuestionForm">
                <input type="text" class="input" placeholder="질문을 입력하세요" v-model="questionMessage"/>
                <button type="submit" class="submit_button"><img src="../../assets/img/arrow.png" class="submit_image"></button>
            </form>
                
           
        </div>
    </div>
</Transition>
</template>

<style scoped>
.chatbot_button {
    position: fixed;
    /* right: 20px;
    bottom: 20px; */
    width: 60px;
    height: 60px;
    border-radius: 50%;
    /* background-color: blue; */
    text-align: center;
    align-content: center;
    color: white;
    font-weight: bold;
    font-size: large;
    border-width: 0px;

    cursor: pointer;

    overflow: hidden;
    position: relative;
    left: 1585px;
    bottom: -250px;
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


.rotate-fade-enter-active, .rotate-fade-leave-active {
  transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out; /* 애니메이션 효과 추가 */
}

.rotate-fade-enter, .rotate-fade-leave-to {
    transform: rotate(360deg);    
    opacity: 0;
}

.chatbotModal {
    position: fixed;
    right: 20px;
    bottom: 90px;
    width: 323px;
    height: 550px;
  
    background: rgb(243, 243, 243);
  box-shadow: -2px 0 5px rgba(0,0,0,0.5);
  z-index: 1000;
  border: 3px;;
    /* border: 3px solid transparent;  */
  /* border-image: linear-gradient(to left bottom, #FF9500, #008CFF) 1; */ 
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  
}

.chatbotModalHeader {
    height: 70px;
    background-color: white;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    
}

.logo {
    margin-left: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
    border-radius: 10px;
    width : 50px; 
    height : 50px;
}

.titlelogo {
    margin-left: 20px;
    margin-right: 35px;
    margin-top: 15px;
    margin-bottom: 5px;
    width : 200px; 
    height : 50px;
    float: right;
}

.chatbotModalBody {
    overflow-y: auto;
    height: 363px;
    padding-top: 10px;
    flex: 1;
    
   
}

.chatbotMessage{
    margin: 10px;
    margin-bottom: 30px;
}

.chatbotMessagecontent {
    position: relative;

    display: flex;
    

}

.messageImg {
    width: 30px;
    height: 30px;
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
}

.chatbotModalFooter {
    background-color: white;
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
    background-color: rgb(243, 243, 243);
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
    padding-left: 10px;
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