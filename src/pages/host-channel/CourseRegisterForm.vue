<script setup>
import {computed, onMounted, ref, watch} from "vue";
import { useAPI } from "@/axios/useAPI";
import TextEditor from "@/components/common/TextEditor.vue";
import DaumAddressAPI from "@/components/common/DaumAddressAPI.vue";
import KakaoMapAPI from "@/components/common/KakaoMapAPI.vue";
import DateTimeSchedule from "@/components/host-channel/DateTimeSchedule.vue";
import {useRoute} from "vue-router";

const route = useRoute();
const modifyMode = ref(null);


const { get, post, patch, remove } = useAPI();
const categories = ref([]);
const titleMaxLength = 50;
const classImgInput = ref(null);
const titleCounter = ref(0);

const onInputTitle = e => {
  const target = e.currentTarget;
  if (target.value.length > titleMaxLength) {
    target.value = target.value.slice(0, max);
  }
  titleCounter.value = target.value.length;
  inputData.value.title = target.value;
}
const fetchCategories = async () => {
  try {
    const response = await get('/categories');
    categories.value = response.data.data;
  } catch (error) {
    console.error('Failed to fetch Details', error);
  }
};
const courseInfo = ref({});

const fetchCourseInfo = async () => {

  try {
    const response = await get(`/hosts/courses/${route.params.id}`);
    courseInfo.value = response.data.data;
    initializeInputData();
  } catch (error) {
    console.error('Failed to fetch Details', error);
  }
};
const inputData = ref({
  title: '',
  categoryId: null,
  content: '',
  tuition: 0,
  discountRate: 0,
  level: '',
  address: '',
  detailAddress: '',
  latitude: 37.5096776765406,
  longitude: 127.055536318832,
  time: 0,
  maxCapacity: 0,
  minDaysPriorToReservation: 1,
  mainImage: null,
  images: [],
  existMainImage: null,
  existImages: [],
});

const initializeInputData = () => {
  inputData.value = { ...inputData.value, ...courseInfo.value }
  titleCounter.value = inputData.value.title.length;
};
onMounted(() => {

  fetchCategories();
  if(!!route.params.id) {
    modifyMode.value = true;
    fetchCourseInfo();
  }
})

const possibleTodayReservation = ref(null);

watch(() => courseInfo.value.minDaysPriorToReservation, (newValue) => {
  possibleTodayReservation.value = newValue === 0;
});

const schedules = ref([]);

const inputClassImg = e => {
  let file = e.target.files[0];
  const name = file.name;
  if(name.endsWith('.jpg') || name.endsWith('.jpeg') ||
      name.endsWith('.png') || name.endsWith('.gif')) {
    inputData.value.images.push(file);
    classImgInput.value = null;
  } else {
    alert("이미지 형식을 등록해주세요.")
  }
};

const inputMainImage = e => {
  let file = e.target.files[0];
  const name = file.name;
  if(name.endsWith('.jpg') || name.endsWith('.jpeg') ||
      name.endsWith('.png') || name.endsWith('.gif')) {
    inputData.value.mainImage = file;
  } else {
    alert("이미지 형식을 등록해주세요.")
  }
};

let mainImgThumb = computed(() => {
  if(inputData.value.mainImage === null) {
    return new URL('@/assets/img_upload_thumb.jpg', import.meta.url).href;
  } else {
    return URL.createObjectURL(inputData.value.mainImage);
  }
});

let classImgThumbList = computed(() => {
  let imgSrcList = [];
  for (let i = 0; i < inputData.value.images.length; i++) {
    imgSrcList.push(URL.createObjectURL(inputData.value.images[i]));
  }
  return imgSrcList;
});

const cancelClassImg = index => {
  inputData.value.images.splice(index, 1);
};

const cancelExistImg = (id, index) => {
  if(modifyMode.value) {
    deletedFileIdList.value.push(id);
  }
}

const inputContent = text => {
  inputData.value.content = text;
};

const assignAddress = address => {
  inputData.value.address = address;
};

const assignLatLng = (lat, lng) => {
  inputData.value.latitude = lat;
  inputData.value.longitude = lng;
};

const getTotalTuition = computed(() => {
  if(inputData.value.tuition > 0 && inputData.value.discountRate > 0) {
    return Math.ceil(inputData.value.tuition * (1 - inputData.value.discountRate / 100));
  }
  return inputData.value.tuition;
});

const createForm = () => {
  const form = new FormData();
  form.append('title', inputData.value.title);
  form.append('categoryId', inputData.value.categoryId);
  form.append('content', inputData.value.content);
  form.append('tuition', inputData.value.tuition);
  form.append('discountRate', inputData.value.discountRate);
  form.append('level', inputData.value.level);
  form.append('address', inputData.value.address);
  form.append('detailAddress', inputData.value.detailAddress);
  form.append('latitude', inputData.value.latitude);
  form.append('longitude', inputData.value.longitude);
  form.append('time', inputData.value.time);
  form.append('maxCapacity', inputData.value.maxCapacity);
  form.append('minDaysPriorToReservation', inputData.value.minDaysPriorToReservation);
  form.append('mainImage', inputData.value.mainImage);
  for (let i = 0; i < inputData.value.images.length; i++) {
    form.append(`images`, inputData.value.images[i]);
  }
  return form;
};

const modifyForm = () => {
  const form = new FormData();
  form.append('title', inputData.value.title);
  form.append('content', inputData.value.content);
  form.append('tuition', inputData.value.tuition);
  form.append('discountRate', inputData.value.discountRate);
  form.append('level', inputData.value.level);
  form.append('address', inputData.value.address);
  form.append('detailAddress', inputData.value.detailAddress);
  form.append('latitude', inputData.value.latitude);
  form.append('longitude', inputData.value.longitude);
  form.append('time', inputData.value.time);
  form.append('maxCapacity', inputData.value.maxCapacity);
  form.append('minDaysPriorToReservation', inputData.value.minDaysPriorToReservation);
  form.append('mainImage', inputData.value.mainImage);
  for (let i = 0; i < inputData.value.images.length; i++) {
    form.append(`images`, inputData.value.images[i]);
  }
}

const submitRegisterForm = async () => {
  try {
    const form = createForm();
    const response = await post('/hosts/courses', form, {
      headers: {'Content-Type': 'multipart/form-data'}
    });
    const id = response.data.data.id;
    console.log(id);
    await submitRegisterScheduleForm(id);
    alert("클래스 개설 신청이 완료되었습니다.");
    router.push({
      name: 'HostCourseList',
    });
  } catch (error) {
    alert("클래스 개설 신청이 실패했습니다.");
  }
};

const deletedFileIdList = ref([]);

const submitForm = () => {
  if(modifyMode.value) {
    submitModifyForm();
  } else {
    submitRegisterForm();
  }
}

const submitModifyForm = async () => {
  try {
    const form = modifyForm();
    await patch(`/hosts/courses/${route.params.id}`, form, {
      headers: {'Content-Type': 'multipart/form-data'}
    });
    deletedFileIdList.value.forEach(id => submitFileDeleteForm(id))
    alert("클래스 수정이 완료되었습니다.");
  } catch (error) {
    alert("클래스 수정이 실패했습니다.");
  }
};

const submitRegisterScheduleForm = async (courseId) => {
  try {
    if(schedules.value && schedules.value.length > 0) {
      await post(`/hosts/courses/${courseId}/schedules`, schedules.value);
    }
  } catch (error) {
    console.log(error);
  }
};

const submitFileDeleteForm = async id => {
  try {
    await remove(`/files/${id}`);
  } catch (error) {
    console.log(error);
  }
};
</script>
<template>
  <div class="menu-title">
    <h2>{{ modifyMode ? '클래스 정보 수정' : '클래스 개설' }}</h2>
  </div>
<card class="card" style="width: 80%;" v-if="!modifyMode">
  <div class="form-text">
    <h5 style="font-weight: bold">클래스 개설 과정</h5>
    <div class="form-label">
      클래스 개설 요청 → 검토 후 승인 → 수강 후 정산
    </div>
  </div>
</card>
  <div class="course-form">
    <div class="title">
      1. 클래스 정보
    </div>
    <div class="mb-3">
      <div class="sub-title">
        클래스명
        <span class="require">
        (필수)
      </span>
      </div>
      <div>
        <input v-model.trim="inputData.title" class="form-control" type="text" :maxlength="titleMaxLength" @input="onInputTitle">
        <small id="requestAmountHelp" class="form-text text-muted float-end">{{ titleCounter }} / {{ titleMaxLength }}</small>
      </div>
    </div>
    <div class="mb-3">
      <div class="sub-title">
        카테고리
        <span class="require">(필수)</span>
      </div>
      <div>
        <select :class="modifyMode ? 'form-select' : 'form-select'" v-model="inputData.categoryId" :disabled="modifyMode" style="width: 200px">
          <option :value="null" disabled>선택</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
        </select>
      </div>
    </div>
    <div class="title">
      2. 이미지
    </div>
    <div class="row">
      <div class="col-5">
        <div class="sub-title">
          대표 이미지
          <span class="require">(필수)</span>
        </div>
        <div>
          <input type="file" id="upload-main-image" @change="inputMainImage" hidden/>
          <label for="upload-main-image">
            <img v-if="!inputData.mainImage && inputData.existMainImage" width="250" height="250" class="rounded" alt="main-image" :src="inputData.existMainImage.path" />
            <img v-else width="250" height="250" class="rounded" alt="main-image" :src="mainImgThumb" />
          </label>
        </div>
      </div>
      <div class="col-7">
        <div class="sub-title">
          클래스 이미지
          <span class="non-require">(선택, 최대 8장 등록 가능)</span>
        </div>
        <div class="row">
          <div v-if="modifyMode" class="class-img-thumb col-3 mb-3" v-for="(image, index) in inputData.existImages" :key="index">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill img-cancel-btn" viewBox="0 0 16 16" @click="cancelExistImg(image.id, index)">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
            </svg>
            <img width="100" height="100" class="rounded" alt="class-img" :src="image.path">
          </div>
          <div class="class-img-thumb col-3 mb-3" v-for="(src, index) in classImgThumbList" :key="index">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill img-cancel-btn" viewBox="0 0 16 16" @click="cancelClassImg(index)">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
            </svg>
            <img width="100" height="100" class="rounded" alt="class-img" :src="src">
          </div>
          <div v-if="inputData.images.length + inputData.existImages?.length < 8" class="col-3 mb-3">
            <input type="file" id="upload-class-image" @change="inputClassImg" hidden/>
            <label for="upload-class-image">
              <img class="rounded" width="100" height="100" alt="class-image" src="@/assets/img_upload_thumb.jpg" />
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="title">
      3. 상세 내용
    </div>
    <div class="mb-3">
      <div class="sub-title">
        클래스 상세 내용
        <span class="require">(필수)</span>
      </div>
      <TextEditor :content="inputData.content" @input-text="inputContent"></TextEditor>
    </div>
    <div class="mb-3">
      <div class="sub-title">
        난이도
        <span class="require">(필수)</span>
      </div>
      <div class="button-group" role="group">
        <input type="radio" id="btnradio1" class="btn-check" v-model="inputData.level" value="BEGINNER" autocomplete="off">
        <label class="btn btn-outline-secondary course-level-btn" for="btnradio1">초급</label>

        <input type="radio" id="btnradio2" class="btn-check" v-model="inputData.level" value="INTERMEDIATE" autocomplete="off">
        <label class="btn btn-outline-secondary course-level-btn" for="btnradio2">중급</label>

        <input type="radio" id="btnradio3" class="btn-check" v-model="inputData.level" value="ADVANCED" autocomplete="off">
        <label class="btn btn-outline-secondary course-level-btn" for="btnradio3">고급</label>
      </div>
    </div>
    <div>
      <div class="row">
        <div class="col">
          <div class="sub-title">
            소요 시간
            <span class="require">(필수)</span>
          </div>
          <div class="row align-items-center">
            <input class="form-control m-2" style="width: 80px;" v-model.number="inputData.time" maxlength="3">분
          </div>
        </div>
        <div class="col">
          <div class="sub-title">
            수강 최대 인원
            <span class="require">(필수)</span>
          </div>
          <div class="row align-items-center">
            <input class="form-control m-2" style="width: 80px;" v-model.number="inputData.maxCapacity" maxlength="3"> 명
          </div>
        </div>
      </div>
    </div>
    <div class="title">
      4. 공간 정보
    </div>
    <div class="mb-3">
      <div class="sub-title">
        클래스 주소
        <span class="require">(필수)</span>
      </div>
      <DaumAddressAPI :address="inputData.address" @assignAddress="assignAddress" @assignLatLng="assignLatLng"></DaumAddressAPI>
      <div class="row">
        <div class="col-9">
          <input class="form-control" type="text" v-model.trim="inputData.detailAddress" placeholder="상세주소" maxlength="255">
        </div>
      </div>
      <div class="mt-3 mb-2">
        주소 입력 후 핀으로 정확한 위치를 설정해주세요.
      </div>
      <KakaoMapAPI :latitude="inputData.latitude" :longitude="inputData.longitude" @assignLatLng="assignLatLng" :marker-draggable="true"></KakaoMapAPI>
    </div>
    <div class="title">
      5. 클래스 금액
    </div>
    <div class="mb-3">
      <div class="sub-title">
        인당 금액
        <span class="require">(필수)</span>
      </div>
      <div class="row align-items-center">
        <input class="form-control m-2" style="width: 150px;" v-model.trim="inputData.tuition" maxlength="9"> 원
      </div>
    </div>
    <div class="mb-3">
      <div class="sub-title">
        할인 옵션
        <span class="non-require">(선택)</span>
      </div>
      <div class="row align-items-center">
        <input class="form-control m-2" style="width: 150px;" v-model.trim="inputData.discountRate" maxlength="2"> %
      </div>
    </div>
    <div class="mb-3">
      <div class="sub-title">
        최종 수강 금액
      </div>
      <div class="row align-items-center">
        <input class="form-control m-2" style="width: 150px;" disabled v-model="getTotalTuition"> 원
      </div>
    </div>
    <div class="mb-3">
      <div class="sub-title">
        당일 예약 가능 여부
        <span class="require">(필수)</span>
      </div>
      <div class="row radio-area">
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" id="possibleCheck" v-model="possibleTodayReservation" :value="true" @click="inputData.minDaysPriorToReservation=0;">
          <label class="form-check-label" for="possibleCheck">가능해요</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" id="impossibleCheck" v-model="possibleTodayReservation" :value="false" @click="inputData.minDaysPriorToReservation=1;">
          <label class="form-check-label" for="impossibleCheck">불가능해요</label>
          <div class="min-days-box row align-items-center" v-show="possibleTodayReservation === false">
            최소 <input class="form-control m-2" style="width: 50px;" v-model.number="inputData.minDaysPriorToReservation" maxlength="2"> 일 전에는 예약이 필요해요
          </div>
        </div>
      </div>
    </div>
    <div v-if="!modifyMode">
      <div class="title">
        6. 클래스 일정
      </div>
      <div class="form-text mb-3">
        일정을 등록하지 않고 클래스 개설 요청이 가능합니다.<br>
        클래스 일정은 개설 후 개설 클래스 > 클래스 관리에서 언제든지 등록할 수 있습니다.
      </div>
      <div class="date-time-schedule-area">
        <DateTimeSchedule :schedules="schedules"></DateTimeSchedule>
      </div>
    </div>
  </div>
  <div class="submit-button-area">
    <button class="btn register-btn" @click="submitForm">{{ modifyMode ? '클래스 수정' : '클래스 개설' }}</button>
  </div>
</template>
<style scoped>
.menu-title {
  margin-top: 20px;
  margin-bottom: 20px;
}
.card {
  padding: 20px;
  background-color: rgb(239, 239, 239);
  border: none;
  margin-bottom: 20px;
}
.title {
  font-size: x-large;
  font-weight: bold;
  margin-top: 30px;
  margin-bottom: 10px;
}
.sub-title {
  font-size: large;
  font-weight: bold;
  width: fit-content;
  margin-bottom: 3px;
}
.require {
  font-size: large;
  color: #FF9300;
  font-weight: bold;
}
.non-require {
  font-size: large;
  color: #b2b2b2;
  font-weight: bold;
}
.course-level-btn {
  width: 120px;
  margin-right: 10px;
  border: 2px solid #b2b2b2;
}
.min-days-box {
  border: 2px solid #FF9300;
  width: fit-content;
  padding: 0 50px;
  margin-top: 10px;
  border-radius: 10px;
}
.radio-area {
  margin-left: 5px;
}
.class-img-thumb {
  position : relative;
}
.img-cancel-btn {
  position : absolute;
  top: 3px;
  right: 8px;
}
.register-btn {
  width: 200px;
  background-color: #FF9300;
  color: white;
}
.date-time-schedule-area {
  margin-bottom: 40px;
}
.submit-button-area {
  margin-top: 50px;
  margin-bottom: 100px;
  text-align: end;
}
.course-form {
  margin: 20px;
}
</style>
