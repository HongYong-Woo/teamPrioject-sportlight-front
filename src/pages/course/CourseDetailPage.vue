<script setup>
import { useAPI } from '@/axios/useAPI';
import { faChartSimple, faUserGroup, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { faYoutube, faInstagram, faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, defineProps, onBeforeMount, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import Datepicker from '../../components/common/DatePicker.vue';
import Button from '../../components/common/Button.vue';
import NumberSelect from '../../components/common/NumberSelect.vue';
import ReviewList from '../../components/course/ReviewList.vue';
import QnAList from '../../components/course/QnAList.vue';
import router from '@/routers';
import KakaoMapAPI from '../../components/common/KakaoMapAPI.vue';

const props = defineProps(
    {
        id: String,
        required: true
    }
)
const { get, post } = useAPI();
const courseId = props.id;
const courseDetails = ref({});
const schedules = ref([]);

const selectableDates = ref([]);
const filteredSchedules = ref([]);
const tuition = computed(() => courseDetails.value.tuition * request.value.participantNum);
const selectedTime = ref(null);

const request = ref({
    scheduleId: null,
    dateTime: null,
    participantNum: 1,
});



let currentIndex = ref(0);
const images = ref([]);
const currentImage = ref("");

const updateCourseImage = (img) => {
    currentImage.value = img;
}



async function fetchDetails() {
    try {
        const response = await get(`/courses/${courseId}`);
        courseDetails.value = response.data.data;
        currentImage.value = courseDetails.value.imgUrl;
        images.value.push(courseDetails.value.imgUrl);
        courseDetails.value.imgList.forEach(img => {
            images.value.push(img);
        });
    } catch (error) {
        console.error('Failed to fetch Details', error);
    }
}

async function fetchSchedules() {
    try {
        const response = await get(`/courses/${courseId}/schedules`);
        schedules.value = response.data.data;
        updateSelectableDates();
    } catch (error) {
        console.error(`Failed to fetch schedules`, error);
    }
}

onMounted(() => {
    fetchDetails();
    fetchSchedules();
    updateSelectableDates();
    window.addEventListener('scroll', updateActiveSection);
})

onBeforeUnmount(() => {
    window.removeEventListener('scroll', updateActiveSection);
})

function updateSelectableDates() {
    selectableDates.value = schedules.value
        .reduce((dates, schedule) => {
            const date = new Date(schedule.startTime).toISOString().split('T')[0];
            if (!dates.includes(date)) {
                dates.push(date);
            }
            return dates;
        }, []);
}

function updateFilteredSchedules() {
    if (!request.value.dateTime) {
        filteredSchedules.value = [];
        return;
    }
    const selectedDate = new Date(request.value.dateTime).toISOString().split('T')[0];
    filteredSchedules.value = schedules.value.filter(schedule => {
        const scheduleDate = new Date(schedule.startTime).toISOString().split('T')[0];
        return (scheduleDate === selectedDate)
    }).map(schedule => {
        schedule.isActive = 
            courseDetails.value.maxCapacity - schedule.participantNum < request.value.participantNum ||
            schedule.remainedNum <= 0 ? false : true;
        return schedule;
    });
    console.log(filteredSchedules.value);
}

function updateRequestParticipants(value) {
    request.value.participantNum = value;

    if (request.value.dateTime) {
        const date = new Date(request.value.dateTime);
        request.value.dateTime = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    updateSelectableDates();
    updateFilteredSchedules();
}

function updateRequestDate(newDate) {
    request.value.dateTime = formatDate(newDate);
    updateFilteredSchedules();
}

function selectTimeEvent(schedule) {
  selectedTime.value = new Date(schedule.startTime);
  request.value.dateTime = schedule.startTime;
  request.value.scheduleId = schedule.id;
}

const courseTimeRange = computed(() => {
    if (!request.value.dateTime) return ''; // 값이 없으면 빈 문자열
    const dateTimeString = request.value.dateTime;

    // 시간 정보가 포함되어 있는지 확인
    if (!dateTimeString.includes('T') || dateTimeString.split('T')[1].length === 0) {
        return ''; // 시간 정보가 없으면 빈 문자열 반환
    }

    const startTime = new Date(dateTimeString);
    const endTime = new Date(startTime.getTime() + courseDetails.value.time * 60 * 1000);
    return `${formatTime(startTime)} ~ ${formatTime(endTime)}`;
});


function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function addCommas(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '원';
}

watch([courseDetails, schedules], ([newDetails, newSchedules]) => {
    if (!newDetails && !newSchedules && newDetails.maxCapacity && newSchedules.length) {
        updateSelectableDates();
        updateFilteredSchedules();
    }
});

watch(request, () => {
    updateFilteredSchedules();
}, {deep: true});


const activeSection = ref('');

// 섹션을 보고 있을 때마다 activeSection을 업데이트하는 함수
const updateActiveSection = () => {
  const sections = ['intro', 'location', 'host', 'reviews', 'qna', 'recommend'];
  const headerHeight = 6.5 * 16; // 4rem (헤더 높이) -> 픽셀로 변환
  let currentSection = '';

  // 섹션들의 위치를 확인하여 현재 화면에 보이는 섹션을 찾음
  for (const section of sections) {
    const element = document.getElementById(section);
    if (element && element.getBoundingClientRect().top - headerHeight <= 0) {
      currentSection = section;
    }
  }

  // 현재 보고 있는 섹션을 activeSection에 설정
  activeSection.value = currentSection;
};


const scrollToSection = (sectionId) => {
    const headerHeight = 6.5 * 16; // 4rem (헤더 높이) -> 픽셀로 변환
    const section = document.getElementById(sectionId);
    window.scrollTo({
        top: section.offsetTop - headerHeight + 1, // 헤더 높이를 빼고 스크롤
        behavior: 'smooth', // 부드러운 스크롤
    });
};


function goToApplyCourse() {
    if (!request.value.dateTime) {
        alert("수강할 날짜를 선택해주세요.")
        return;
    }

    if (!request.value.dateTime.includes('T')) {
        alert("수강할 시간을 정해주세요.")
        return;
    }

    router.push({ name: 'ApplyCourse', query: {scheduleId: request.value.scheduleId, participantNum: request.value.participantNum} })
}

</script>

<template>
    <div>
        <div class="top">
            <div class="top-contents-container">
                <div class="img-container">
                    <img :src="currentImage" alt="Course Image" class="selected-image" />
                    <div class="image-list">
                        <img v-for="(image, index) in images" :key="index" :src="image" alt="Course Image"
                            class="img-content" @click="updateCourseImage(image)" />
                    </div>
                </div>
                <div class="contents-container">
                    <h4 class="title">{{ courseDetails.title }}</h4>
                    <h6 class="content">{{ courseDetails.content }}</h6>
                    <div class="host-info-container">
                        <img :src="currentImage || 'https://kr.object.ncloudstorage.com/sportlight/static_img/default_image.jpg'" alt="Host Profile" @error="e => e.target.src = 'https://kr.object.ncloudstorage.com/sportlight/static_img/user_profile_icon.jpg'"/>
                        <span class="host-nickname">{{ courseDetails.nickname }}</span>
                    </div>
                    <div class="course-details-info small-font gray-font">
                        <div class="level">
                            <FontAwesomeIcon :icon="faChartSimple" size="sm" />{{ courseDetails.level }}
                        </div>
                        <div class="time">
                            <FontAwesomeIcon :icon="faClock" size="sm" />{{ courseDetails.time }}분
                        </div>
                        <div class="max-capacity">
                            <FontAwesomeIcon :icon="faUserGroup" size="sm" />{{ courseDetails.maxCapacity }}명
                        </div>
                        <div class="location">
                            <FontAwesomeIcon :icon="faLocationDot" size="sm" />{{ courseDetails.address }}
                        </div>
                    </div>
                    <div class="attend-info-container">
                        <div class="participants">
                            <h6> 인원 </h6>
                            <NumberSelect :min="1" :max="99" :step="1" :modelValue="request.participantNum"
                                @update:modelValue="(newValue) => updateRequestParticipants(newValue)"
                                placeholder="인원" />
                        </div>
                        <div class="calendar">
                            <h6> 날짜 </h6>
                            <Datepicker :startDate="request.dateTime" :isRange="false" :inline="false" locale="ko"
                                format="yyyy/MM/dd" :selectableDates="selectableDates"
                                @update:startDate="(newValue) => updateRequestDate(newValue)" />
                        </div>
                        <div class="start-time">
                            <h6> 시간 </h6>
                            <div class="schedule-item">
                                <Button v-for="schedule in filteredSchedules" :key="schedule.id" size="small"
                                    type="button" :class="schedule.isActive ? 'active-btn' : 'inactive-btn'"
                                    :disabled="!schedule.isActive" @click="selectTimeEvent(schedule)">
                                    {{ new Date(schedule.startTime).toLocaleTimeString([], {
                                    hour: '2-digit', minute: '2-digit'
                                    }) }}
                                </Button>
                            </div>
                        </div>
                        <div class="course-time">
                            <h6>수업 시간</h6>
                            <div>{{ courseTimeRange }}</div>
                        </div>
                        <div class="result-container">
                            <h5 class="tuition">{{ addCommas(tuition) }}</h5>
                            <Button class="attend-btn" @click="goToApplyCourse()">
                                수강 신청
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="detail">
            <div class="nav">
                <ul>
                    <li :class="{ active: activeSection === 'intro'}"><a href="javascript:void(0)"
                            @click="scrollToSection('intro')">클래스 소개</a></li>
                    <li :class="{ active: activeSection === 'location'}"><a href="javascript:void(0)"
                            @click="scrollToSection('location')">위치</a></li>
                    <li :class="{ active: activeSection === 'host'}"><a href="javascript:void(0)"
                            @click="scrollToSection('host')">강사 소개</a></li>
                    <li :class="{ active: activeSection === 'reviews'}"><a href="javascript:void(0)"
                            @click="scrollToSection('reviews')">리뷰</a></li>
                    <li :class="{ active: activeSection === 'qna'}"><a href="javascript:void(0)"
                            @click="scrollToSection('qna')">Q&A</a></li>
                    <li :class="{ active: activeSection === 'recommend'}"><a href="javascript:void(0)"
                            @click="scrollToSection('recommend')">추천</a></li>
                </ul>
            </div>
            <div class="detail-container" id="intro">
                <h4>클래스 소개</h4>
                <div class="course-intro">{{ courseDetails.content }}</div>
            </div>
            <div class="detail-container" id="location">
                <h4>위치</h4>
                <div class="map-wrapper">
                    <KakaoMapAPI class="map" :latitude="courseDetails.latitude" :longitude="courseDetails.longitude" />
                </div>
                <p>{{ courseDetails.address }} {{ courseDetails.detailAddress }}</p>
                <p>찾아오는 길 ~~~~</p>
            </div>
            <div class="detail-container" id="host">
                <h4>강사 소개</h4>
                <div class="host-info-container">
                    <img :src="courseDetails.hostProfile || 'https://kr.object.ncloudstorage.com/sportlight/static_img/default_image.jpg'" alt="Host Profile" @error="e => e.target.src = 'https://kr.object.ncloudstorage.com/sportlight/static_img/user_profile_icon.jpg'">
                    <span class="host-nickname">{{ courseDetails.nickname }}</span>
                </div>
                <div class="host-intro">
                    <div>
                        {{ courseDetails.bio }}
                    </div>
                    <div class="link-container">
                        <a v-if="courseDetails.instar" :href="courseDetails.instar">
                            <FontAwesomeIcon :icon="faInstagram" style="color: #DD2A7B;" size="xl" />
                        </a>
                        <a v-if="courseDetails.facebook" :href="courseDetails.facebook">
                            <FontAwesomeIcon :icon="faFacebook" style="color: #4267B2" size="xl" />
                        </a>
                        <a v-if="courseDetails.twitter" :href="courseDetails.twitter">
                            <FontAwesomeIcon :icon="faTwitter" style="color: #1DA1F2;" size="xl" />
                        </a>
                        <a v-if="courseDetails.youtube" :href="courseDetails.youtube">
                            <FontAwesomeIcon v-if="courseDetails.youtube" :icon="faYoutube" style="color: red;"
                                size="xl" />
                        </a>
                    </div>
                </div>
            </div>
            <div class="detail-container" id="reviews">
                <h4>리뷰</h4>
                <div>
                    <ReviewList :courseId="courseId" />
                </div>
            </div>
            <div class="detail-container" id="qna">
                <h4>Q&A</h4>
                <div>
                    <QnAList :courseId="courseId" />
                </div>
                <!-- <div class="qna">{{ questions ? questions[0].qcontent : 'question' }} -> {{ question ? questions[0].acontent : 'answer' }}</div> -->
            </div>
            <!-- <div class="detail-container" id="recommend">
                <h2>이런 강의는 어때요?</h2>
                <div class="recommend">강의 추천</div>
            </div> -->
        </div>
    </div>
</template>

<style scoped>
.top {
    margin-top: 7rem;
}

.detail {
    margin-bottom: 7rem;
}

.top-contents-container {
    display: flex;
    flex-wrap: wrap;
    height: 100%;
}

.contents-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.img-content {
    aspect-ratio: 3 / 2;
}

@media all and (min-width: 768px) {
    .img-container {
        position: sticky;
        width: 60%;
        height: fit-content;
        top: 5rem;
    }

    .contents-container {
        width: 40%;
        padding-left: 1rem;
    }
}

@media all and (max-width: 767px) {
    .img-container {
        width: 100%;
    }

    .contents-container {
        width: 100%;
    }
}

.img-container>img {
    width: 100%;
    height: auto;
}

.host-info-container {
    display: flex;
    align-items: center;
}

.host-info-container>img {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    margin-right: 0.25rem;
}

.course-details-info {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.course-details-info>div {
    display: flex;
    flex-direction: row;
    gap: 0.1rem;
    align-items: center;
}

.attend-info-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    border: 1px solid #767676;
    border-radius: 0.25rem;
}

.participants {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.calendar {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.start-time {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.schedule-item {
    display: flex;
    flex-direction: row;
    gap: 0.375rem;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    scrollbar-width: thin;
}

.inactive-btn {
    background-color: #d9d9d9;
}

.course-time {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.result-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-top: 0.5rem;
    border-top: 1px solid #d9d9d9;
}

.tuition {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.attend-btn {
    width: 100%;
    font-weight: bold;
}

.nav {
    position: sticky;
    top: 4rem;
    height: 2.5rem;
    margin-top: 3rem;
    background-color: white;
    border-bottom: 1px solid #767676;
}

.nav ul {
    list-style: none;
    display: flex;
    height: 100%;
}

.nav ul li {
    cursor: pointer;
    width: 6rem;
    height: 100%;
    background-color: white;
    align-content: center;
    text-align: center;
}

.nav ul li a {
    text-decoration: none;
    color: #767676;
    font-weight: bold;
}

.nav ul li.active {
    border-bottom: 2px solid #333;
}

.nav ul li:hover {
    background-color: #f0f0f0;
    transition: all 0.5s ease;
}

.nav ul li.active a {
  color: #333;
}

.detail-container {
    margin-top: 3rem;
}

.detail-container h2 {
    margin-bottom: 1rem;
}

.map-wrapper {
    aspect-ratio: 16/9;
    width: 100%;
}

.map {
    width: 100% !important;
    height: 100% !important;
}

.host-intro {
    margin-top: 0.5rem;
}

.link-container {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
}

.review {
    background-color: blue;
}

.qna {
    background-color: yellow;
}

.recommend {
    background-color: paleturquoise;
}

.small-font {
    font-size: 0.9rem;
}

.gray-font {
    color: #767676;
}

.img-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.selected-image {
  width: 300px; /* 선택된 이미지 크기 */
  height: auto;
  margin-bottom: 20px;
  border: 2px solid #ddd; /* 선택 이미지 테두리 */
  border-radius: 10px;
  aspect-ratio: 3 / 2;
}

.image-list {
  display: flex;
  overflow-x: auto; /* 가로 스크롤 활성화 */
  white-space: nowrap; /* 줄바꿈 방지 */
  width: 100%; /* 가로 크기 설정 */
  padding: 10px 0;
}

.img-content {
  width: 100px; /* 리스트 이미지 크기 */
  height: 100px; /* 고정 높이 */
  margin-right: 10px;
  border-radius: 5px; /* 이미지 모서리 둥글게 */
  cursor: pointer; /* 클릭 가능 표시 */
  transition: transform 0.2s; /* 클릭 시 애니메이션 효과 */
}

.img-content:hover {
  transform: scale(1.1); /* 확대 효과 */
}

.image-list::-webkit-scrollbar {
  height: 8px; /* 스크롤바 높이 */
}

.image-list::-webkit-scrollbar-thumb {
  background: #aaa; /* 스크롤바 색상 */
  border-radius: 10px;
}

.image-list::-webkit-scrollbar-track {
  background: #f1f1f1; /* 스크롤바 배경 */
}

</style>