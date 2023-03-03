<template>
    <Loading v-if="loadingActive"/>
    <InfoDialog v-if="infoModalActive" :modal-message="modalMessage" v-on:close-modal="closeInfoModal"/>
    <confirm-dialog :modal-message="modalMessage" v-if="confirmActive" v-on:confirm="confirm" v-on:cancel="cancel"/>

    <AdminSidebar>
      <div class="row">
        <div class="col-12 col-lg-6" >
          <div class="d-flex align-items-center mt-3">
            <button class="btn btn--white border-0" @click="$router.back()"><i class="fas fa-chevron-left"></i></button>
            <span class=" fs-5"><i class="fas fa-credit-card"></i> Payment Method</span>
          </div>
          <div class="card mb-3 shadow-none m-1 rounded">
            <div class="d-flex p-3 justify-content-between">
              <div class="d-flex flex-column">
                <div class="d-flex align-items-center">
                  <div style="background-color: var(--white); border-radius: var(--border-radius); padding: 2px;">
                    <img :src="selectedPayment.url" v-if="selectedPayment.url!==''" style="border-radius: var(--border-radius);" width="50" height="50" alt="">
                    <img src="../../assets/flash/1.png" v-else style="border-radius: var(--border-radius);" width="50" height="50" alt="">

                  </div>
                  <span class="fs-5 fw-bold ms-2">{{selectedPayment.paymentType}}</span>

                </div>
                <div class="d-flex flex-column" v-if="selectedPayment.paymentType!== 'Cash on Delivery'">
                  <span class="fs-4 my-2">{{selectedPayment.accountNumber}}</span>
                  <span>Holder Name</span>
                  <span class="fs-5">{{selectedPayment.accountName}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-lg-6">
          <div class="mt-3">
            <span class=" fs-5"><i class="fas fa-clock-rotate-left"></i> Transaction Histories</span>

          </div>
          <div class="btn-group p-1" role="group" aria-label="Basic radio toggle button group">
            <input type="radio" class="btn-check" @click="showDaily" name="btnradio" id="btnradio1" autocomplete="off" checked>
            <label class="btn check-btn" :class="dateType==='day'?'active':''"  for="btnradio1">Daily</label>

            <input type="radio" class="btn-check" @click="showMonthly" name="btnradio" id="btnradio2" autocomplete="off">
            <label class="btn check-btn" :class="dateType==='month'?'active':''" for="btnradio2">Monthly</label>

            <input type="radio" class="btn-check" @click="showYearly" name="btnradio" id="btnradio3" autocomplete="off">
            <label class="btn check-btn" :class="dateType==='year'?'active':''" for="btnradio3">Yearly</label>
          </div>
          <div class="p-2 d-flex justify-content-between">
            <span class="text-black">Total: {{(totalPrice - totalRefund).toLocaleString()}} Ks</span>
            <div class="d-flex align-items-center rounded">
              <input type="date" @change="formatDate" class="form-control" v-if="dateType === 'day'">
              <input v-if="dateType==='month'" type="month" @change="filterMonth" class="form-control border-1 border-secondary" style="background-color: var(--white)!important; border:1px solid gray!important;">
              <NextDatePicker v-if="dateType==='year'"  v-model:value="selectedYear" style="z-index: 30000;" class="border-1 border-secondary" @change="yearChange" type="year" :placeholder="selectedYear"></NextDatePicker>
            </div>
          </div>
          <div class="modal-body transaction-modal" >
            <div class="card mb-1 p-1" style="background-color: var(--light)!important;" v-for="(transaction,index) in allTransaction " :key="index">
              <div class="d-flex justify-content-between align-items-start">
                <div class="d-flex text-start">
                  <div class="d-flex px-2 me-1 text-center align-items-center" style="background-color: var(--side-bar-bg); border-radius: var(--border-radius);">
                    <i class="fas fa-money-check"></i>
                  </div>
                  <div class="d-flex flex-column">
                    <span>{{transaction.customerName || 'Unknown'}}</span>
                    <span class="text-black-50">{{transaction.day}}, {{transaction.time.toDate().toLocaleTimeString('en')}}</span>
                  </div>
                </div>
                <div class="d-flex text-end flex-column" v-if="transaction.cashReceived!==undefined">
                  <span class="text-success">Received</span>
                  <span> + {{ transaction.cashReceived }} Ks</span>
                </div>
                <div class="d-flex flex-column text-end" v-if="transaction.refund!==undefined">
                  <span class="text-danger">Refund</span>
                  <span> - {{ transaction.refund }} Ks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </AdminSidebar>

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
      infoModalActive:false,
      modalMessage:'',
      loadingActive:false,
      confirmActive:false,
      selectedYear:'',
      dateType:'day',
      selectedDate:'',
      selectedPayment:'',
      totalPrice:0,
      totalRefund:0,
      refundTransaction:[],
      selectedPaymentTransaction:[],
      allTransaction:[],
    }
  },

  computed:{
    owner(){
      return this.$store.getters.getShopOwner;
    },
    paymentType(){
      return this.$store.getters.getPaymentTypes;
    },
    shopInfo(){
      return this.$store.getters.getShopInfo;
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
    dates() {
      return this.days.map(day => day.date);
    },
    attributes() {
      return this.dates.map(date => ({
        highlight: true,
        dates: date,
      }));
    },
  },

  async mounted() {
    await db.collection(this.shopInfo.city).doc(this.shopInfo.id).collection('paymentMethods').doc(this.$route.params.payment_id).onSnapshot(snapshot => {
      this.selectedPayment = snapshot.data();
      this.selectForTransaction()
    })

  },
  created() {
    this.$store.dispatch("getDay");
    this.$store.dispatch("getMonth");
    this.$store.dispatch("getYear");
    this.fileName=this.currentDay+'-orders';
    this.$store.dispatch('getShopInfo',this.owner);
    this.selectedDate = this.currentDay;
  },

  methods:{
    async formatDate(e){
      const date = new Date(e.target.value);
      let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
      let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
      let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
      let payload = day+"-"+month+"-"+year;
      console.log(payload);
      this.selectedDate = payload;
      this.dateType='day';
      await this.getTransaction();
    },
    async showDaily(){
      this.selectedDate = this.currentDay;
      this.dateType='day';
      await this.getTransaction();

    },
    async showMonthly(){
      this.dateType ='month';
      this.selectedDate=this.currentMonth;
      await this.getTransaction();

    },
    async filterMonth(e) {
      let date = new Date(e.target.value)
      let month = new Intl.DateTimeFormat('en', {month: 'short'}).format(date);
      let year = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(date);
      this.selectedDate = month + "-" + year;
      this.dateType = 'month';
      await this.getTransaction();
    },
    async showYearly(){
      this.dateType = 'year';
      this.selectedDate=this.currentYear;
      await this.getTransaction();
    },
    async yearChange(){
      this.dateType ='year';
      let date = new Date(this.selectedYear)
      this.selectedDate = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
      await this.getTransaction();
    },
    async getTransaction(){
      this.refundTransaction =[];
      this.selectedPaymentTransaction =[];
      this.allTransaction =[];
      this.totalPrice =0;
      this.totalRefund = 0;
      console.log(this.dateType, this.selectedDate)
      await db.collection(this.owner.city).doc(this.owner.shopId).collection('paymentMethods').doc(this.selectedPayment.id).collection('refund').where(this.dateType,'==',this.selectedDate).onSnapshot(snapshot1 => {
        console.log('refund size',snapshot1.size)
        snapshot1.forEach(doc=>{
          this.refundTransaction.push(doc.data())
          this.totalRefund+=parseInt(doc.data().refund)
          this.allTransaction.push(doc.data())
        })
      })
      await db.collection(this.owner.city).doc(this.owner.shopId).collection('paymentMethods').doc(this.selectedPayment.id).collection('transaction').where(this.dateType,'==',this.selectedDate).onSnapshot(snapshot => {
        console.log('received size', snapshot.size)
        snapshot.forEach(doc=>{
          this.selectedPaymentTransaction.push(doc.data())
          this.allTransaction.push(doc.data())
          this.totalPrice+=parseInt(doc.data().cashReceived)
        })
      })
    },
    selectForTransaction(){
      this.selectedDate = this.currentDay;
      this.dateType='day';
      this.getTransaction();
    },
    selectForEdit(payment){
      this.selectedPayment = payment;
    },
    confirm(){
      this.loadingActive = true;
    },
    cancel(){
      this.confirmActive = !this.confirmActive;
    },
    closeInfoModal(){
      this.infoModalActive = !this.infoModalActive;
    },
  }
}
</script>

<style scoped>
.card{
  background-color: var(--side-bar-bg) !important;
  border-radius: var(--border-radius) !important;
}
.check-btn{
  width: 80px !important;
  border:2px solid var(--primary) !important;
  box-shadow: none !important;
  border-radius: 0px !important;
}
.active{
  background-color: var(--primary) !important;
  color: var(--white);
}
.btn-group{
  width: 100%;
}
.btn-group .btn{
  border-radius: 0px !important;
}
.btn-check{

  border-radius: var(--border-radius) !important;
}
.btn-check{
}
.btn{
  border: 2px solid var(--softPrimary);
  box-shadow: none !important;
  outline: none !important;
}
.transaction-modal{
  height: 70vh;
  overflow: scroll;
}
@media only screen and (max-width: 1030px) {
  .transaction-modal{
    height: 80vh;
  }
}
</style>