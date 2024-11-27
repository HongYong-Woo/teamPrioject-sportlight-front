<script setup>
const companyInfo = {
    name: "(주)스포츠라이트",
    representative: "트루만쇼",
    registrationNumber: "000-11-11111",
    inquiryEmail: "trueManShow@sportlight.net",
    call: "02-111-1111",
    mailOrderSles: "2024-서울삼성-0000",
    cheifPrivacyOfficer: "박트루",
    addess: "서울특별시 배고프구 졸리니집으로 000길 99 6층",
};
</script>

<template>
  <footer class="footer">
    <div class="footer-inner">
      <div class="flex">
        <div class="content">
          <strong>COMPANY</strong>
          <p>
            {{ companyInfo.name }}<br />
            대표자: {{ companyInfo.representative }}<br />
            사업자등록번호: {{ companyInfo.registrationNumber }}<br />
            통신판매업: {{ companyInfo.mailOrderSles }} <br />
            개인정보보호책임자: {{ companyInfo.cheifPrivacyOfficer }} <br />
            주소: {{ companyInfo.addess }}
          </p>
        </div>
        <div class="content">
          <strong>INFORMATION</strong>
          <p>
            <a href="#">이용약관</a> /
            <a href="#">개인정보 취급방침</a><br />
          </p>
        </div>
        <div class="content">
          <strong>SUPPORT</strong>
          <p>
            이메일문의: {{ companyInfo.inquiryEmail }}<br />
            전화문의: {{ companyInfo.call }}
          </p>
        </div>
      </div>
      <div class="info">ⓒ SPORTLIGHT. ALL RIGHTS RESERVED.</div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #f9f9f9;
  color: #404040;
  position: fixed;
  bottom: 0;
  width: 100%;
  min-width: 320px;
}

.footer-inner {
  padding: 20px 30px;
  margin: 0 auto;
}

.footer-inner .flex {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
}

.content {
  flex: 1;
  margin: 0 15px;
  position: relative;
}

.content strong {
  display: block;
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 10px;
}

.content a {
  color: #666;
}

.content p {
  margin: 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.content:not(:last-child)::after {
  content: "";
  position: absolute;
  top: 0;
  right: 10px;
  width: 1px;
  height: 130px;
  background: #dfdfdf;
}

.info {
  font-size: 13px;
  color: #909090;
  margin-top: 15px;
}

@media (max-width: 768px) {
  .footer-inner .flex {
    flex-direction: column; 
    align-items: center;
  }

  .content {
    margin: 8px 0;
    text-align: center;
  }

  .content strong {
    margin-bottom: 6px;
  }

  .content p {
    margin: 3px 0; 
    line-height: 1.3; 
  }

  .content:not(:last-child)::after {
    display: none;
  }

  .footer-inner {
    padding: 5px;
  }
}
</style>