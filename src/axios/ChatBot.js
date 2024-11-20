import { ref, onMounted, watch } from "vue";
import axios from "axios";

export function chatbot() {


    const showChatbot = ref(false); // 챗봇을 보여줄지 여부
    const questionMessage = ref(""); // 사용자의 질문
    const responseMessage = ref(""); // 챗봇의 답변
    const messages = ref([]); // 대화 내용
    const time = ref(""); // 대화 시간
    var question;

    // 시간 포맷
    const formatter = new Intl.DateTimeFormat("ko-KR", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });

    const toggleShowChatbot = () => {
        showChatbot.value = !showChatbot.value;      
    };

 
    const openChatbot = () => {
        axios.post('http://localhost:8080/chatbot/open').then((response) => {
           console.log("openResponse:", response.data);

           time.value = formatter.format(new Date(response.data.timestamp));

            responseMessage.value = response.data.content[0].data.details;    

            messages.value.push({text : responseMessage.value, sender : 'chatbot', time : time.value});
            console.log("details : " + responseMessage.value );
        }).catch((error) => {
            console.error("Failed to open chatbot:", error);
        });
    }

    const sendChatbot = async () => {
        console.log("messages:", questionMessage.value);
        question = questionMessage.value;
        messages.value.push({text : question, sender : 'user', time : formatter.format(new Date())});

        axios.post('http://localhost:8080/chatbot/send', {question})
        .then((response) => {
            console.log("sendResponse:", response.data);
           
            time.value = formatter.format(new Date(response.data.timestamp));
            responseMessage.value = response.data.content[0].data.details;

            messages.value.push({text : responseMessage.value, sender : 'chatbot', time : time.value});

            console.log("sendResponse " + responseMessage.value);
        }).catch((error) => {
            console.error("Failed to send chatbot:", error);
        });
        questionMessage.value = '';
    }

    const saveMessages = () => {
        localStorage.setItem('chatbotMessages', JSON.stringify(messages.value));
        
    }

    const loadMessages = () => {
        const savedMessages = localStorage.getItem('chatbotMessages');
        if (savedMessages) {
            messages.value = JSON.parse(savedMessages);
        }else {
            openChatbot();
        }
    }

    onMounted(() => {
        console.log("Chatbot mounted");
         loadMessages();
    });

    watch(messages, saveMessages, { deep: true });

   
    return {
        showChatbot,
        questionMessage,
        responseMessage,
        messages,
        toggleShowChatbot,
        openChatbot,
        sendChatbot
    };

}