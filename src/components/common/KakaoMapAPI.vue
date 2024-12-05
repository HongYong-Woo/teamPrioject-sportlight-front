<script setup>
import {onMounted, watch} from "vue";

const prop = defineProps({
  latitude: {
    type: Number,
    require: false,
    default: () => {
      return 37.5096776765406;
    }
  },
  longitude: {
    type: Number,
    require: false,
    default: () => {
      return 127.055536318832;
    }
  },
  markerDraggable: {
    type: Boolean,
    require: false,
    default: () => {
      return false;
    }
  }
});

const emit = defineEmits(['assignLatLng']);

onMounted(() => {
  init();
})

const init = () => {
  if (window.kakao && window.kakao.maps) {
    initializeMap();
  }  else {
    loadKakaoMapScript();
  }
};

const kakaoAppkey = "c4523886c7cf7fe4a7adca0a977fa00c";
const loadKakaoMapScript = () => {
  const kakaoScriptUrl = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoAppkey}&libraries=services&autoload=false`;
  loadScript(kakaoScriptUrl, () => {
    window.kakao.maps.load(() => {
      initializeMap();
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
  document.head.appendChild(script);
};

const initializeMap = () => {
  const coords = new kakao.maps.LatLng(prop.latitude ? prop.latitude : 37.5096776765406, prop.longitude ? prop.longitude : 127.055536318832);
  const mapContainer = document.getElementById('map');
  const mapOption = {
    center: coords, // 지도의 중심좌표
    level: 1 // 지도의 확대 레벨
  };

  const map = new window.kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다
  map.setMaxLevel(1);
  const markerPosition = coords;
  const marker = new window.kakao.maps.Marker({
    position: markerPosition
  });

  marker.setDraggable(prop.markerDraggable);
  if(prop.markerDraggable) {
    kakao.maps.event.addListener(marker, 'dragend', function() {
      const position = marker.getPosition();
      emit('assignLatLng', position.getLat(), position.getLng());
    });
  }

  marker.setMap(map);
};

watch(() => [prop.latitude, prop.longitude], () => {
  init();
}, {
  immediate: true,
});
</script>

<template>
<div id="map">
</div>
</template>


<style scoped>
#map {
  width: 90%;
  height: 400px;
}
</style>
