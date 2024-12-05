<script setup>
import {onMounted, ref, watch} from "vue";

const prop = defineProps({
  address: {
    type: String,
    require: true,
    default: () => {
      return "";
    }
  },
});

const emit = defineEmits(['assignAddress', 'assignLatLng']);

const address = ref(prop.address);

watch(() => prop.address,
    (newAddress) => {
      address.value = newAddress;
    },
    { immediate: true }
);

let geocoder = null;

onMounted(() => {
  loadDaumPostcodeScript();
});

const loadDaumPostcodeScript = () => {
  const daumScriptUrl = `//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js`;
  loadScript(daumScriptUrl, loadKakaoMapScript);
};

const kakaoAppkey = "c4523886c7cf7fe4a7adca0a977fa00c";
const loadKakaoMapScript = () => {
  const kakaoScriptUrl = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoAppkey}&libraries=services&autoload=false`;
  loadScript(kakaoScriptUrl, () => {
    kakao.maps.load(() => {
      geocoder = new kakao.maps.services.Geocoder(); // 지오코더 인스턴스 생성
    });
  });
};

const loadScript = (src, callback) => {
  const script = document.createElement('script');
  script.src = src;
  script.onload = callback.bind(this);
  script.onerror = (e) => {
    console.error("스크립트 로드 오류: ", e);
  };
  document.head.appendChild(script);  // 문서의 head에 스크립트 태그를 추가하여 로드
};

const execDaumPostcode = () => {
  new window.daum.Postcode({
    oncomplete: (data) => {
      console.log(data);
      let addr = '';
      let extraAddr = '';

      if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
        addr = data.roadAddress;
      } else { // 사용자가 지번 주소를 선택했을 경우(J)
        addr = data.jibunAddress;
      }

      if(data.userSelectedType === 'R'){
        if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
          extraAddr += data.bname;
        }
        if(data.buildingName !== '' && data.apartment === 'Y'){
          extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
        }
        if(extraAddr !== ''){
          extraAddr = ' (' + extraAddr + ')';
        }
      }
      address.value = addr + extraAddr;
      emit('assignAddress', address.value);

      if (geocoder) {
        geocoder.addressSearch(data.roadAddress, (results, status) => {
          if (status === kakao.maps.services.Status.OK) {
            emit('assignLatLng', results[0].y, results[0].x);
          }
        });
      } else {
        console.error('지오코더가 초기화되지 않았습니다.');
      }
      window.close();
    }
  }).open();
};
</script>

<template>
  <div class="row">
    <div class="address-input col-9">
      <input class="form-control" type="text" @click="execDaumPostcode" v-model="address" placeholder="주소"><br>
    </div>
    <div class="col-3">
      <button class="btn" @click.prevent="execDaumPostcode">주소 찾기</button>
    </div>
  </div>
</template>

<style scoped>
.address-input {
  margin-top: 4px;
}
.btn {
  background-color: #FF9300;
  color: white;
  margin-top: 2px;
}
</style>
