import { ref, onMounted, watch, onUpdated, nextTick } from "vue";
import axios from "axios";

export function chatbot() {


    const showChatbot = ref(false); // 챗봇을 보여줄지 여부
    const questionMessage = ref(""); // 사용자의 질문
    const responseMessage = ref(""); // 챗봇의 답변
    const messages = ref([]); // 대화 내용
    const time = ref(""); // 대화 시간
    var question;
    const chatScroll = ref(null); // 채팅 스크롤

    // 시간 포맷
    const formatter = new Intl.DateTimeFormat("ko-KR", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });

    // 챗봇 보이기/숨기기 토글
    const toggleShowChatbot = () => {
        showChatbot.value = !showChatbot.value;      
    };

    // 처음 실행할 때 나오는 공통 메시지
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

    // 챗봇에 질문 보내고 받기
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

    // localStorage에 저장
    const saveMessages = () => {
        localStorage.setItem('chatbotMessages', JSON.stringify(messages.value));
        
    }

    // localStorage에서 불러오기
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
        //  loadMessages();
         openChatbot();
    });

    //messages 변경을 감지하여 saveMessages 호출, 채팅 스크롤을 아래로 내림
    watch(messages, async () => {
        saveMessages();

        await nextTick();
        if (chatScroll.value) {
            chatScroll.value.scrollTop = chatScroll.value.scrollHeight;
        }
    } , { deep: true });

   
    return {
        showChatbot,
        questionMessage,
        responseMessage,
        messages,
        chatScroll,
        toggleShowChatbot,
        openChatbot,
        sendChatbot
    };
}