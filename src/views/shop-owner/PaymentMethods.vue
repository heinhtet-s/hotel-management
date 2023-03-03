<template>
  <admin-sidebar>
    <Loading v-if="loadingActive"/>
    <InfoDialog v-if="infoModalActive" :modal-message="modalMessage" v-on:close-modal="closeInfoModal"/>
    <confirm-dialog :modal-message="modalMessage" v-if="confirmActive" v-on:confirm="confirm" v-on:cancel="cancel"/>
    <!-- Modal -->
    <div class="modal fade mt-5" style="z-index: 10000;" id="paymentEditModal"  tabindex="-1" aria-labelledby="paymentEditModalLabel" aria-hidden="true">
      <div class="modal-dialog" style="color: var(--text-color-light);">
        <div class="modal-content">
          <div class="modal-header border-0">
            <div>
              <img :src="selectedPayment.url" v-if="selectedPayment.url!==''" width="50" height="50" alt="">
              <img src="../../assets/flash/1.png" v-else width="50" height="50" alt="">
              <span style="color: var(--text-color-light);">{{selectedPayment.paymentType}}</span>

            </div>

            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">

            <div class="form-floating mb-3">
              <input type="text" required class="form-control" v-model="selectedPayment.accountName" placeholder="enter holder name">
              <label for="barcode-input">Holder Name</label>
            </div>
            <div class="form-floating mb-3">
              <input type="text" required class="form-control" v-model="selectedPayment.accountNumber" placeholder="enter acc number">
              <label for="barcode-input">Account Number</label>
            </div>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal">Close</button>
            <button class="btn btn-sm" style="background-color: var(--btnLight);" @click.prevent="update" data-bs-dismiss="modal">Save</button>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="d-flex align-items-center mt-3">
        <button class="btn" style="color: var(--text-color);" @click="$router.back()"><i class="fas fa-chevron-left"></i></button>
        <span class="fs-4">Payment Management</span>
      </div>
      <div class="col-12 col-lg-5">

        <div class="card rounded" style="background-color: var(--side-bar-bg) !important; border-radius: var(--border-radius) !important;">
          <h5 class="p-2"><i class="fas fa-plus-circle"></i> Add New</h5>

          <div class="card-body">
            <div class="form">
              <label class="form-label">Payment Type:</label>
              <select required class="form-select form-control fs-6 mb-2 form-select-lg bg-transparent rounded" style="height: 60px"  v-model="payment_method.paymentType" aria-label=".form-select-sm example">
                <option selected disabled>Payment Type</option>
                <option :value="type.name" v-for="(type,index) in paymentCategories" :key="index">{{ type.name }}</option>
              </select>
              <div class="form-floating mb-3">
                <input type="text" required class="form-control" v-model="payment_method.accountName" id="barcode-input" placeholder="enter holder name">
                <label for="barcode-input">Holder Name</label>
              </div>
              <div class="form-floating mb-3">
                <input type="text" required class="form-control" v-model="payment_method.accountNumber" id="barcode-input" placeholder="enter shop name">
                <label for="barcode-input">Account Number</label>
              </div>
              <button class="btn btn-sm float-end" style="background-color: var(--btnLight);" @click.prevent="upload">Save</button>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-6" >
        <h5><i class="fas fa-credit-card"></i> Payment Methods</h5>
        <div style="height: 80vh; overflow-y: scroll; overflow-x: hidden; padding-bottom: 100px; padding-bottom: 100px; " >
          <div class="card mb-3 shadow-none m-1 rounded" style="background-color: var(--side-bar-bg) !important; border-radius: var(--border-radius) !important; " v-for="(payment, index) in payment_methods" :key="index">
            <div class="d-flex p-3 justify-content-between">
              <div class="d-flex flex-column">
                <div class="d-flex align-items-center">
                  <div style="background-color: var(--white); border-radius: var(--border-radius); padding: 2px;">
                    <img :src="payment.url" v-if="payment.url!==''" style="border-radius: var(--border-radius);" width="50" height="50" alt="">
                    <img src="../../assets/flash/1.png" v-else style="border-radius: var(--border-radius);" width="50" height="50" alt="">

                  </div>
                  <span class="fs-5 fw-bold ms-2">{{payment.paymentType}}</span>

                </div>
                <div class="d-flex flex-column" v-if="payment.paymentType!== 'Cash on Delivery'">
                  <span class="fs-4 my-2">{{payment.accountNumber}}</span>
                  <span>Holder Name</span>
                  <span class="fs-5">{{payment.accountName}}</span>
                </div>
              </div>
              <div class="text-end d-flex" >
                <button style="width: 30px; height: 30px" class="btn btn-light rounded-circle btn-sm mx-1" @click="selectForTransaction(payment)" >
                  <i class="fas fa-circle-info"></i>
                </button>
                <button style="width: 30px; height: 30px" v-if="payment.paymentType!=='Cash'" class="btn btn-warning rounded-circle btn-sm mx-1" @click="selectForEdit(payment)" data-bs-toggle="modal" data-bs-target="#paymentEditModal">
                  <i class="fas fa-edit"></i>
                </button>
                <button style="width: 30px; height: 30px" class="btn btn-sm rounded-circle btn-danger d-none" @click="deletePayment(payment.id)"><i class="fas fa-trash"></i></button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

  </admin-sidebar>

</template>

<script>
import db,{timestamp} from "@/config/FirebaseInit";
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
      selectedYear:'2022',
      dateType:'day',
      selectedDate:'',

      showEditModal:false,
      selectedPayment:'',
      deleteId:'',
      paymentCategories:[],
      payment_methods:[],
      totalPrice:0,
      selectedPaymentTransaction:[],
      payment_method:{
        paymentType:"",
        accountNumber:"",
        accountName:"",
        id:"",
        url:"",
        createdAt:"",
      }
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
   await db.collection(this.owner.city).doc(this.owner.shopId).collection('paymentMethods').orderBy('createdAt','desc').onSnapshot(snapshot => {
     this.payment_methods = [];
     snapshot.forEach(doc=>{
       this.payment_methods.push(doc.data());
     })
   })
    await db.collection('paymentCategories').onSnapshot(snapshot => {
      this.paymentCategories = [];
      snapshot.forEach(doc=>{
        this.paymentCategories.push(doc.data());
      });
      this.payment_method.paymentType=this.paymentCategories[0];

    })

  },
  created() {
    this.$store.dispatch("getDay");
    this.$store.dispatch("getMonth");
    this.$store.dispatch("getYear");
    this.fileName=this.currentDay+'-orders';
    this.$store.dispatch('getShopInfo',this.owner);
  },

  methods:{
    selectForTransaction(payment){
      this.$router.push({name:'PaymentDetail',params:{payment_id:payment.id}})
     /* this.selectedPayment = payment;
      this.selectedDate = this.currentDay;
      this.dateType='day';
      this.getTransaction();*/

    },
    selectForEdit(payment){
      this.selectedPayment = payment;
    },
    confirm(){
      this.loadingActive = true;
      this.confirmActive = !this.confirmActive;
      db.collection(this.owner.city).doc(this.owner.shopId).collection('paymentMethods').doc(this.deleteId).delete().then(()=>{
        this.loadingActive = false;
        this.modalMessage='Deleted';
        this.infoModalActive=true;
      })
    },
    cancel(){
      this.confirmActive = !this.confirmActive;
    },
    closeInfoModal(){
      this.infoModalActive = !this.infoModalActive;
    },
    deletePayment(id){
      this.confirmActive = true;
      this.modalMessage = 'Are you sure to Delete?'
      this.deleteId = id;
    },
    onChangePhotoInput(){

    },
    async update(){
      if(this.selectedPayment.accountName !=='' && this.selectedPayment.accountNumber!==''){
        this.loadingActive = true;
        await db.collection(this.owner.city).doc(this.owner.shopId).collection('paymentMethods').doc(this.selectedPayment.id).update({
          'accountNumber':this.selectedPayment.accountNumber,
          'accountName': this.selectedPayment.accountName
        }).then(()=>{
          this.loadingActive = false;
          this.infoModalActive = true;
          this.modalMessage = 'Update Success!';
        })
      }
    },

    async upload(){
      if(this.payment_method.paymentType!=='' && this.payment_method.accountNumber!==''){
        this.loadingActive = true;
        const categoryRef =  await db.collection(this.owner.city).doc(this.owner.shopId).collection('paymentMethods').doc();
        this.payment_method.createdAt = timestamp;
        this.payment_method.id = categoryRef.id;
        let url ='';
        this.paymentCategories.forEach(payment=>{
          console.log(payment.name)
          console.log(this.payment_methods.paymentType)
          if(payment.name === this.payment_method.paymentType){
            url = payment.url;
          }
        })
        this.payment_method.url = url;
        await categoryRef.set(this.payment_method).then(()=>{
          this.loadingActive = false;
          this.infoModalActive=true;
          this.modalMessage="Upload Ok";
          this.payment_method = {
            paymentType:"",
            accountNumber:"",
            accountName:"",
            id:"",
            url:"",
            createdAt:"",
          }
        }).catch(error=>{
          alert(error.message)
        })
      }else {
        this.loadingActive = false;
        this.infoModalActive = true;
        this.modalMessage = "Please Fill all fields!"
      }

    }
  }
}
</script>

<style scoped>

</style>