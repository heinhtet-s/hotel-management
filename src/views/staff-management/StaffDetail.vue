<template>
  <!--  Shop-->
  <admin-sidebar>
    <Loading v-if="loadingActive"/>
    <InfoDialog v-if="infoModalActive" :modal-message="modalMessage" v-on:close-modal="closeInfoModal"/>
    <confirm-dialog :modal-message="modalMessage" v-if="confirmActive" v-on:confirm="confirm" v-on:cancel="cancel"/>

    <div class="row">
      <div class="d-flex align-items-center">
        <button @click="$router.back()" style="color: var(--text-color);" class=" btn fs-5">
          <i class="fas fa-chevron-left"> </i>
          <span class="fs-3 p-1">{{ $t('message.staff_detail') }}</span>

        </button>
      </div>
      <div class="col-md-4" v-if="selectedCustomer">
        <div class="card-outside overflow-scroll">
          <span class="fs-5 p-1">{{ $t('message.customer_info') }}</span>

          <div class="d-flex" style="background-color: var(--side-bar-bg);border-radius: var(--border-radius);">
            <div class="text-start d-flex align-items-center justify-content-center" >
              <img :src="selectedCustomer.profile" v-if="selectedCustomer.profile!==''" class="m-1" width="100" height="100" style="border-radius: var(--border-radius);" alt="">
              <img src="../../assets/flash/1.png" v-else class="m-1" width="100" height="100" style="border-radius: var(--border-radius);" alt="">
            </div>
            <div class="form-floating mb-3 ms-2 d-flex flex-column">
              <span><i class="fas fa-user"></i> {{selectedCustomer.name}}</span>
              <span><i class="fas fa-phone"></i> {{selectedCustomer.phone}}</span>
              <span class="text-black-50"><i class="fa-solid fa-location-crosshairs"></i> {{selectedCustomer.address}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  </admin-sidebar>

</template>

<script>
import db from "@/config/FirebaseInit";
import Loading from "@/components/Loading";
import InfoDialog from "@/components/InfoDialog";
import ConfirmDialog from "@/components/ConfirmDialog";
import AdminSidebar from "@/components/AdminSidebar";
export default {
  components: {ConfirmDialog, InfoDialog, Loading, AdminSidebar},
  data(){
    return{
      dismissModal:'true',
      file:'',
      customers:[],
      showTableVoucher:'true',
      confirmStatus:'',
      selectedCustomer:'',
      selectedCustomerRecords:[],
      customerInvoice:[],
      selectedCustomerTotalCredit:'',
      selectedCustomerTotalDebit:'',
      toGetActive:true,

      searchInvoiceValue:'',
      transactionDate:'',
      transactionAmount:'',
      transactionNote:'',
      voucherStyle:'',

      costPerItem :[],
      invoiceHistories:[],
      selectedInvoice:'',

      loadingActive:false,
      infoModalActive:false,
      confirmActive:false,
      modalMessage:'',
      customerToDelete:'',

      showPaymentToggle:false,
      selectedPaymentType:'',
      showAllInvoiceActive:false,

    }
  },
  computed:{
    showName(){
      return localStorage.getItem('showCustomerName');
    },
    showLogo(){
      return localStorage.getItem('showLogoImage');
    },
    showPhone(){
      return localStorage.getItem('showCustomerPhone');
    },
    shopInfo(){
      return this.$store.getters.getShopInfo;
    },
    owner(){
      return this.$store.getters.getShopOwner;
    },
    currentDateTime(){
      return this.$store.getters.getDateTime;
    },
    currentDay(){
      return this.$store.getters.getDay;
    },
    currentMonth(){
      return this.$store.getters.getMonth;
    },
    currentYear(){
      return this.$store.getters.getYear;
    },
    paymentMethods(){
      return this.$store.getters.getPaymentMethods;
    },
    creditInvoice(){
      if(this.searchInvoiceValue!==''){
        return this.customerInvoice.filter(invoice=>invoice.vouncherId.includes(this.searchInvoiceValue));
      }else {
        return this.customerInvoice;
      }
    }
  },
  async created() {
    console.log('voucher id',this.$route.params.voucher_id)


    if(this.$route.params.staff_id !==''){
      await db.collection(this.owner.city).doc(this.owner.shopId).collection('staffs').doc(this.$route.params.staff_id).onSnapshot(snapshot => {
        this.selectedCustomer = snapshot.data();
      });
    }

  },
  async mounted() {
    this.$store.dispatch("getDateTime");
    this.$store.dispatch("getDay");
    this.$store.dispatch("getMonth");
    this.$store.dispatch("getYear");
    this.$store.dispatch("getPaymentMethods", this.owner);
    this.$store.dispatch("getShopInfo",this.owner);
    if(localStorage.getItem('voucherStyle')){
      this.voucherStyle =localStorage.getItem('voucherStyle');
    }
  },
  methods:{
    closeInfoModal(){
      this.infoModalActive = !this.infoModalActive;
    },
    cancel(){
      this.confirmActive = !this.confirmActive;
    },
    async openEditBox(customer){
      this.selectedCustomer = customer;

    },

    formatDate(payload){
      const date = new Date(payload);
      let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
      let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
      let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
      return day+"-"+month+"-"+year;
    },

  }
}
</script>

<style scoped>
.btn-group{
  width: 100%;
}
thead, tbody{
  border: none !important;
}

.btn-group .btn{
  border:1px solid var(--primary);
  border: none !important;
  box-shadow: none !important;
  outline: none !important;
  border-radius: 0px !important;
}
.btn-check{
  border: none!important;
  border-radius: var(--border-radius) !important;
}
.activeInvoice{
  background-color: var(--btnLight)!important;
}
.voucher-list-solid{
  border-top: 2px solid black;
}
.voucher-list-top{
  border-top: 2px dotted black;
}
.voucher-list-bottom{
  border-bottom: 2px dotted black;
}
tr{
  color: var(--text-color);
}

.card-container{
  height: 65vh;
  overflow-y: scroll;
  overflow-x: hidden;
}

.history-container{
  border-radius: var(--border-radius);
  background-color: var(--background-color);
  height: 36vh;
  padding-bottom: 50px;
  overflow-y: scroll;
  overflow-x: hidden;
}
.btn-active{
  border-radius: 0px !important;
  border-bottom: 2px solid var(--primary) !important;
}
.voucher-list{
  border-top: 2px dashed black;
}
.voucher-box{
  height: 75vh;
  overflow-y: scroll;
}
.voucher-outer-box{
  border-radius: var(--border-radius);
  height: 82vh;
}
.card-outside{
  border-radius: var(--border-radius);
  padding: 10px;
  height:85vh;
  background-color: var(--light) !important;
}
@media only screen and (max-width: 1030px) {
  .content-box {
    margin-top: 90px;
  }
}
</style>