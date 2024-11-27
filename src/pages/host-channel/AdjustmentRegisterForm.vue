<script setup>
import {computed, onMounted, ref} from "vue";
import { useAPI } from '@/axios/useAPI';

const { get, post } = useAPI();

const possibleAmount = ref(0);

const fetchPossibleAmount = async () => {
  try {
    const response = await get(`/adjustments/possible-amount`);
    const data = response.data.data;
    possibleAmount.value = data.amount > 0 ? data.amount : 0;
  } catch (error) {
    console.error('Failed to fetch Details', error);
  }
}

onMounted(() => {
  fetchPossibleAmount();
});

let maskingRrn = ref("");

let inputData = ref({
  requestAmount: 0,
  applicant: "",
  rrn: computed(() => {
    return maskingRrn.value.replace(/[^0-9]/g, '');
  }),
  bankName: "",
  depositor: "",
  accountNumber: "",
});

let withholdingTax = computed(() => {
  return Math.ceil(inputData.value.requestAmount * 0.033);
});

let vat = computed(() => {
  return Math.ceil(inputData.value.requestAmount * 0.1);
});

let adjustedCharge = computed(() => {
  return Math.ceil(inputData.value.requestAmount * 0.15);
});

let totalAmount = computed(() => {
  let amount = inputData.value.requestAmount - withholdingTax.value - vat.value - adjustedCharge.value;
  return amount < 0 ? 0 : amount;
});

const registerForm = async() => {
  try {
    const form = new FormData();
    for(let key in inputData.value) {
      form.set(key, inputData.value[key]);
    }
    const response = await post('/adjustments', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    const id = response.data.data;
    console.log(`id: ${id}`);
    alert("정산 신청이 완료되었습니다.");
    //router.go();
  } catch (error) {
    console.error('Failed to fetch Details', error);
  }
};

const submitForm = () => {
  if(checkInputData()) {
    registerForm();
  }
};

const checkInputData = () => {
  for(let key in inputData.value) {
    if(!inputData.value[key]) {
      alert("모든 항목을 입력해주세요.");
      return false;
    }
  }
  if(inputData.value.requestAmount < 10000) {
    alert("정산 신청액의 최소 금액은 10000원 입니다.");
    return false;
  }
  if(inputData.value.requestAmount > possibleAmount.value) {
    alert("정산 신청액은 정산 가능액 이하로 입력해주세요.");
    return false;
  }
  if(inputData.value.rrn.length !== 13) {
    alert("주민등록번호는 하이픈 제외 13자리로 입력해주세요.");
    return false;
  }
  return true;
};

const onInputRrn = () => {
  maskingRrn.value = maskingRrn.value
      .replace(/[^0-9]/g, '')
      .replace(/^(\d{0,6})(\d{0,7})$/g, '$1-$2')
      .replace(/-{1,2}$/g, '');
};

const bankList = [
  { id: 1, name: '국민은행'},
  { id: 2, name: '기업은행'},
  { id: 3, name: '농협은행'},
  { id: 4, name: '신한은행'},
  { id: 5, name: '우체국'},
  { id: 6, name: 'SC은행'},
  { id: 7, name: '하나은행'},
  { id: 8, name: '카카오뱅크'},
  { id: 9, name: '우리은행'},
  { id: 10, name: '경남은행'},
  { id: 11, name: '광주은행'},
  { id: 12, name: '대구은행'},
  { id: 13, name: '토스뱅크'}
];
</script>

<template>
  <div>
    <h2 class="mb-3">정산 신청</h2>
    <div class="mb-lg-3">
      <h3>정산 가능액(원): {{ possibleAmount }}</h3>
    </div>
    <div class="row">
      <div class="card col">
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="requestAmount">1. 정산 신청 금액</label>
            <input type="number" class="form-control" v-model="inputData.requestAmount" id="requestAmount" aria-describedby="requestAmountHelp">
            <small id="requestAmountHelp" class="form-text text-muted">최소 정산 가능액: 10,000원</small>
          </div>
          <div class="form-group">
            <label for="applicant">2. 성함</label>
            <input type="text" class="form-control" id="requestAmount" v-model="inputData.applicant" maxlength="20">
          </div>
          <div class="form-group">
            <label for="rrn">3. 주민등록번호 (원천징수 세금 납부에 필요)</label>
            <input type="text" class="form-control" id="rrn" v-model="maskingRrn" @input="onInputRrn" maxlength="14">
          </div>
          <div class="form-group row">
            <div class="col">
              <label for="bankName">4. 정산 받으실 은행</label>
              <select v-model="inputData.bankName" class="form-select" id="bankName">
                <option disabled value="">선택</option>
                <option v-for="bank in bankList" :key="bank.id" :value="bank.name">{{ bank.name }}</option>
              </select>
            </div>
            <div class="col">
              <label for="depositor">5. 예금주명</label>
              <input type="text" class="form-control" id="depositor" v-model="inputData.depositor" maxlength="20">
            </div>
          </div>
          <div class="form-group">
            <label for="accountNumber">6. 계좌 번호</label>
            <input type="text" class="form-control" id="accountNumber" v-model="inputData.accountNumber" maxlength="20">
          </div>
          <div class="mb-2 mt-3 float-end">
            <small class="form-text text-muted">* 신청 후 영업일 기준 1-3일 소요될 수 있습니다.</small>
          </div>
          <button type="submit" class="btn btn-primary submit-btn">정산 신청</button>
        </form>
      </div>
      <div class="col">
        <table>
          <tbody>
          <tr>
            <td class="title-col col-1">
              정산 신청 금액
            </td>
            <td class="amount-col">
              {{ inputData.requestAmount.toLocaleString() }}
            </td>
          </tr>
          <tr>
            <td class="title-col">
              원천 징수 세금 (3.3%)
            </td>
            <td class="amount-col">
              {{ withholdingTax.toLocaleString() }}
            </td>
          </tr>
          <tr>
            <td class="title-col">
              부가가치세 (10%)
            </td>
            <td class="amount-col">
              {{ vat.toLocaleString() }}
            </td>
          </tr>
          <tr>
            <td class="title-col">
              플랫폼 수수료 (15%)
            </td>
            <td class="amount-col">
              {{ adjustedCharge.toLocaleString() }}
            </td>
          </tr>
          <tr>
            <td class="title-col">
              최종 정산 받으시는 금액
            </td>
            <td  class="amount-col" style="font-weight: bold;">
              {{ totalAmount.toLocaleString() }}
            </td>
          </tr>
          </tbody>
        </table>
        <div class="float-end">
          <small class="form-text text-muted">* 원 단위</small>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  width: 50%;
  padding: 20px;

}
.form-group {
  margin-bottom: 15px;
}
.submit-btn {
  width: 100%;
}
table {
  width: 100%;
}
table, td, th {
  border : 1px solid gray;
  border-collapse : collapse;
}
td {
  padding: 10px;
}
.title-col{
  width: 60%;
  background-color: #ebebeb;
  text-align: center;
  font-weight: bold;
}
.amount-col {
  text-align: end;
}
</style>
