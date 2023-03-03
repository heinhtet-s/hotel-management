<template>
  <admin-sidebar>
    <InfoDialog v-if="infoModalActive" :modal-message="modalMessage" v-on:close-modal="closeInfoModal"/>
    <!-- Modal -->
    <div class="modal fade" v-if="selectedCashier" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0" style="background-color: var(--background-color); border-radius: var(--border-radius);">
          <div class="modal-header border-0">
            <h5 class="modal-title" id="exampleModalLabel">Admin Password</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>Email: {{selectedCashier.email}}</p>
            <p>Cashier Code: {{selectedCashier.accountCode}}</p>
            <label class="form-label">Name:</label>
            <input type="text" v-model="selectedCashier.accountName" class="form-control mb-1 form-control-sm">
            <label class="form-label">Phone:</label>
            <input type="text" v-model="selectedCashier.phone" class="form-control mb-1 form-control-sm">
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="updateCashier">Update</button>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-4">
        <div class="d-flex">
          <button class="btn btn--white border-0" @click="$router.back()"><i class="fas fa-chevron-left"></i></button>
          <span class="fs-4">Cashiers</span>
        </div>
        <div class="card" v-for="cashier in cashiers" :class="selectedCashier.id === cashier.id?'active_cashier':''" :key="cashier.id" @click="selectCashier(cashier)">
          <div class="d-flex justify-content-between">
            <span> {{cashier.accountName}}</span>
            <span>{{cashier.accountCode}}</span>
          </div>
        </div>
      </div>
      <div class="col-8" v-if="selectedCashier">
        <div class="row">
          <div class="d-flex justify-content-between align-items-center">
            <span class="fs-4">Selected Cashier : {{selectedCashier.accountCode}}</span>
            <div class="d-flex" v-if="shopInfo.packageStatus==='ultra' || shopInfo.packageStatus==='premium'">
              <button class="btn border-0" v-if="selectedCashier.notiStatus==='off'" @click="showNoti"><i class="fas fa-bell-slash" ></i></button>
              <button class="btn border-0" v-if="selectedCashier.notiStatus==='on'"  @click="disableNoti"><i class="fas fa-bell"></i></button>
            </div>
            <div>
              <div class="form-check form-switch">
                <input class="form-check-input" id="enableEdit" :checked="selectedCashier.editStatus==='yes'" type="checkbox" role="switch" @change="enableEditor">
                <label class="form-check-label" for="enableEdit">Editor Mode</label>
              </div>
            </div>

            <button class="btn border-0" style="background-color: var(--btnLight);" data-bs-toggle="modal" data-bs-target="#exampleModal" ><i class="fas fa-circle-info"></i></button>

          </div>
          <div class="btn-group p-1" role="group" aria-label="Basic radio toggle button group">
            <input type="radio" class="btn-check" @click="showDaily" name="btnradio" id="btnradio1" autocomplete="off" checked>
            <label class="btn check-btn" :class="dateType==='day'?'btn-primary':''"  for="btnradio1">Daily</label>

            <input type="radio" class="btn-check" @click="showMonthly" name="btnradio" id="btnradio2" autocomplete="off">
            <label class="btn check-btn" :class="dateType==='month'?'btn-primary':''" for="btnradio2">Monthly</label>

            <input type="radio" class="btn-check" @click="showYearly" name="btnradio" id="btnradio3" autocomplete="off">
            <label class="btn check-btn" :class="dateType==='year'?'btn-primary':''" for="btnradio3">Yearly</label>
          </div>
          <div class="p-2 d-flex justify-content-between">
            <span class="text-black">Total: {{totalPrice.toLocaleString()}} Ks</span>
            <div class="d-flex align-items-center rounded">
              <input type="date" @change="formatDate" class="form-control" v-if="dateType === 'day'">
              <input v-if="dateType==='month'" type="month" @change="filterMonth" class="form-control border-1 border-secondary" style="background-color: var(--white)!important; border:1px solid gray!important;">
              <NextDatePicker v-if="dateType==='year'"  v-model:value="selectedYear" style="z-index: 30000;" class="border-1 border-secondary" @change="yearChange" type="year" :placeholder="selectedYear"></NextDatePicker>
            </div>
          </div>
          <div style="height: 90vh;overflow-y: scroll;overflow-x: hidden;">
            <div class="card" v-for="voucher in vouchers" :key="voucher.id">
              <div class="d-flex justify-content-between">
                <span>{{voucher.vouncherId}}</span>
                <span>{{voucher.dateTime}}</span>
              </div>
              <div>
                <span>{{parseInt(voucher.totalPrice).toLocaleString()}} Ks</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </admin-sidebar>

</template>

<script>
import db from "../../config/FirebaseInit";
import InfoDialog from "@/components/InfoDialog";
import AdminSidebar from "@/components/AdminSidebar";
export default {
  components: {InfoDialog, AdminSidebar},
  data(){
    return{
      selectedCashier:'',
      infoModalActive:false,
      modalMessage:'',
      totalPrice:0,

      selectedYear:'',
      dateType:'day',
      selectedDate:'',
      vouchers:'',
      editorStatus:'',
    }
  },
  computed:{
    owner(){
      return this.$store.getters.getShopOwner;
    },
    cashiers(){
      return this.$store.getters.getAllCashier;
    },
    cashierAcc(){
      return this.$store.getters.getCashierAcc;
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
    this.$store.dispatch("getDay");
    this.$store.dispatch("getMonth");
    this.$store.dispatch("getYear");
    this.$store.dispatch('getCashier', this.owner);
    this.$store.dispatch('getShopInfo',this.owner);
    this.selectedDate = this.currentDay;
  },
  created() {
    this.selectedCashier = this.cashiers[0];
    this.getVoucher()
  },
  methods:{
    enableEditor(e){
      if(e.target.checked){
        db.collection(this.owner.city).doc(this.owner.shopId).collection('account').doc(this.selectedCashier.id).update({
          'editStatus':'yes'
        })
        }else {
        db.collection(this.owner.city).doc(this.owner.shopId).collection('account').doc(this.selectedCashier.id).update({
          'editStatus':'no'
        })
      }
    },
    showNoti(){
      this.selectedCashier.notiStatus = 'on';

      db.collection(this.owner.city).doc(this.owner.shopId).collection('account').doc(this.selectedCashier.id).update({
        'notiStatus':'on'
      })
    },
    disableNoti(){
      this.selectedCashier.notiStatus = 'off';
      db.collection(this.owner.city).doc(this.owner.shopId).collection('account').doc(this.selectedCashier.id).update({
        'notiStatus':'off'
      })
    },
    updateCashier(){
      if(this.selectedCashier.accountName !== '' && this.selectedCashier.phone!==''){
        db.collection(this.owner.city).doc(this.owner.shopId).collection('account').doc(this.selectedCashier.id).update({
          'accountName':this.selectedCashier.accountName,
          'phone':this.selectedCashier.phone
        })
      }
    },
    closeInfoModal(){
      this.infoModalActive = !this.infoModalActive;
    },
    formatDate(e){
      const date = new Date(e.target.value);
      let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
      let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
      let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
      let payload = day+"-"+month+"-"+year;
      console.log(payload);
      this.selectedDate = payload;
      this.dateType='day';
      this.getVoucher();
    },
    showDaily(){
      this.selectedDate = this.currentDay;
      this.dateType='day';
      this.getVoucher();

    },
    showMonthly(){
      this.dateType ='month';
      this.selectedDate=this.currentMonth;
      this.getVoucher();

    },
    filterMonth(e) {
      let date = new Date(e.target.value)
      let month = new Intl.DateTimeFormat('en', {month: 'short'}).format(date);
      let year = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(date);
      this.selectedDate = month + "-" + year;
      this.dateType = 'month';
      this.getVoucher();
    },
    showYearly(){
      this.dateType = 'year';
      this.selectedDate=this.currentYear;
      this.getVoucher();
    },
    yearChange(){
      this.dateType ='year';
      let date = new Date(this.selectedYear)
      this.selectedDate = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
      this.getVoucher();
    },
    selectCashier(cashier){
      this.selectedCashier = cashier;
      console.log(this.selectedCashier);
      this.dateType = 'day';
      this.selectedDate = this.currentDay;
      this.getVoucher();
    },
    async getVoucher(){
      await db.collection(this.owner.city).doc(this.owner.shopId).collection('sellProducts').where('casherCode','==',this.selectedCashier.accountCode).where(this.dateType,'==',this.selectedDate).onSnapshot(snapshot => {
        this.vouchers = [];
        this.totalPrice=0;
        snapshot.forEach(doc=>{
          this.vouchers.push(doc.data());
          this.totalPrice+=parseInt(doc.data().totalPrice)
        })
        console.log(this.vouchers)
      })

    }


  }
}
</script>

<style scoped>

.check-btn{
  background-color: var(--white) !important;
  width: 50%;
  border:2px solid var(--primary) !important;
  box-shadow: none !important;
  border-radius: 0px !important;
}
.check-btn:hover{
  background-color: var(--primary) !important;
}
.btn-group{
  width: 100%;
}
.btn-group .btn{
  border-radius: 0px !important;
}
.btn-primary{
  background-color: var(--primary) !important; ;
  color: white !important;
}
btn-primary:focus{
  background-color: var(--primary) !important ;
  color: black;
}
.btn{
  border: 2px solid var(--primary);
  box-shadow: none !important;
  outline: none !important;
}
.card{
  cursor: pointer;
  background-color: var(--light) !important;
  padding:10px;
  transition: 0.3s;
}
.card:hover{
  background-color: var(--side-bar-bg)!important;
}
.active_cashier{
  background-color: var(--side-bar-bg)!important;
}
@media only screen and (max-width: 1030px) {
  .content-box {
    margin-top: 90px;
  }
}
</style>