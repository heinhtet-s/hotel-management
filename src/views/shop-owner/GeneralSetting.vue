<template>
  <AdminSidebar>
    <InfoDialog v-if="infoModalActive" :modal-message="modalMessage" v-on:close-modal="closeInfoModal"/>
    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title" id="exampleModalLabel">Admin Password</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <label>Enter Admin Password</label>
            <input type="password" class="form-control" maxlength="6" v-model="password" placeholder="password">
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="enableGuestMode">Ok</button>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-3" style="overflow-y: scroll;">
      <div class="d-flex align-items-center">
        <button @click="$router.back()" style="color: var(--text-color);" class=" btn fs-5"><i class="fas fa-chevron-left"> </i>
        </button>
        <span class="fs-3">General Settings</span>
      </div>

      <div class="row">
        <div class="col-4 card mb-3" >
          <span class="fs-5 rounded">Tax : {{shopInfo.tax}} %</span>
          <div class="form">
            <div class="form-floating mb-3">
              <input type="text" required class="form-control" v-model="tax" id="barcode-input" placeholder="enter shop name">
              <label for="barcode-input">Enter (1-100)</label>
            </div>
            <button class="btn btn-sm float-end" style="background-color: var(--btnLight);" @click.prevent="upload">update</button>
          </div>
        </div>
        <div class="col-4 card mb-3" >
          <span class="fs-5 rounded">Invoice Option</span>
          <div class="px-1 d-flex mb-2 justify-content-between p-2 " style="background-color: var(--light); border-radius: var(--border-radius);">
            <label>Show Customer Name</label>
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" :checked="showName==='true'" role="switch" @change="showCustomerName">
            </div>
          </div>
          <div class="px-1 d-flex justify-content-between p-2 mb-2" style="background-color: var(--light); border-radius: var(--border-radius);">
            <label>Show Customer Phone</label>
            <div class="form-check form-switch">
              <input class="form-check-input" :checked="showPhone==='true'" type="checkbox" role="switch" @change="showCustomerPhone">
            </div>
          </div>
          <div class="px-1 d-flex justify-content-between p-2 " style="background-color: var(--light); border-radius: var(--border-radius);">
            <label>Show Logo Image</label>
            <div class="form-check form-switch">
              <input class="form-check-input" :checked="showLogo==='true'" type="checkbox" role="switch" @change="showLogoImage">
            </div>
          </div>
          <div class="px-1 d-flex justify-content-between p-2  my-2" style="background-color: var(--light); border-radius: var(--border-radius);">
            <label>Restrict Refund</label>
            <div class="form-check form-switch">
              <input class="form-check-input" :checked="showRefundText==='true'" type="checkbox" role="switch" @change="showRefund">
            </div>
          </div>
          <div class="px-1 my-1 p-2 d-flex justify-content-between align-items-center " style="background-color: var(--light); border-radius: var(--border-radius);">
            <label class="form-label">Voucher Style</label>
            <select required class="form-select fs-6 w-50 form-control form-select-lg bg-transparent rounded" v-model="voucherStyle" @change="changeVoucherStyle" aria-label=".form-select-lg example">
              <option value="listStyle">List Style</option>
              <option value="tableStyle">Table Style</option>
            </select>
            <!--                <label for="">List Style</label>
                            <div class="form-check form-switch">
                              <input class="form-check-input" :checked="showLogo==='true'" type="checkbox" role="switch" @change="showLogoImage">
                            </div>
                            <label for=""></label>
                            <div class="form-check form-switch">
                              <input class="form-check-input" :checked="showLogo==='true'" type="checkbox" role="switch" @change="showLogoImage">
                            </div>-->
          </div>

        </div>
        <div class="col-4 card mb-3" >
          <span class="fs-5 rounded">Create Low Stock</span>
          <span>Fill low stock count of your shop.</span>
          <div class="form">
            <div class="form-floating mb-3">
              <input type="text" required class="form-control" v-model="shopInfo.lowStock" id="barcode-input" placeholder="enter shop name">
              <label for="barcode-input"></label>
            </div>
            <button class="btn btn-sm float-end" style="background-color: var(--btnLight);" @click.prevent="saveLowStock">update</button>
          </div>
        </div>
        <div class="col-4 card mb-3" >
          <span class="fs-5 rounded">Expire Alert</span>
          <span>Fill number of days for expire alert.</span>
          <div class="form">
            <div class="form-floating mb-3">
              <input type="text" required class="form-control" v-model="shopInfo.expireAlert" id="barcode-input" placeholder="enter shop name">
              <label for="barcode-input"></label>
            </div>
            <button class="btn btn-sm float-end" style="background-color: var(--btnLight);" @click.prevent="saveExpireAlert">update</button>
          </div>
        </div>
      </div>


    </div>
  </AdminSidebar>

</template>

<script>
import db from "@/config/FirebaseInit";
import InfoDialog from "@/components/InfoDialog";
import AdminSidebar from "@/components/AdminSidebar";
//import ownerDeliveryService from "@/views/shop-owner/OwnerDeliveryService";
export default {
  components: {InfoDialog, AdminSidebar},
  data(){
    return{
      Tax:'',
      lowStock:'',
      passwordFailed:false,
      infoModalActive:false,
      password:'',
      modalMessage:'',
      shopInfo:'',
      showName:'',
      showPhone:'',
      showLogo:'',
      guestMode:'',
      showRefundText:'',
      defaultCashier:'',
      voucherStyle:'',
    }
  },
  computed:{
    owner(){
      return this.$store.getters.getShopOwner;
    },
    cashiers(){
      return this.$store.getters.getAllCashier;
    },
  },
  async mounted() {
    this.$store.dispatch('getCashier', this.owner)
    this.showName = localStorage.getItem('showCustomerName');
    this.showPhone = localStorage.getItem('showCustomerPhone');
    this.showLogo = localStorage.getItem('showLogoImage');
    this.showRefundText=localStorage.getItem('showRefund');

    this.guestMode = localStorage.getItem('guestMode');
    this.defaultCashier = localStorage.getItem('defaultCashier');
    if(!this.guestMode){
      localStorage.setItem('guestMode',false);
    }
    if(localStorage.getItem('voucherStyle')){
      this.voucherStyle = localStorage.getItem('voucherStyle');
    }
    if(!this.defaultCashier){
      localStorage.setItem('defaultCashier','C1');
    }
    if(!this.showName){
      localStorage.setItem('showCustomerName',true);
    }
    if(!this.showPhone){
      localStorage.setItem('showCustomerPhone',true);
    }
    this.defaultCashier = localStorage.getItem('defaultCashier');
    db.collection(this.owner.city).doc(this.owner.shopId).onSnapshot(snapshot => {
      this.shopInfo = snapshot.data();
    })
  },
  methods:{
    changeVoucherStyle(e){
      this.voucherStyle = e.target.value;
      localStorage.setItem('voucherStyle', e.target.value);
    },
    async showCustomerName(e){
      if(e.target.checked){
        localStorage.setItem('showCustomerName', true);
      }else {
        localStorage.setItem('showCustomerName', false);
      }
    },
    async showCustomerPhone(e){
      if(e.target.checked){
        localStorage.setItem('showCustomerPhone', true);
      }else {
        localStorage.setItem('showCustomerPhone', false);
      }
    },
    async showLogoImage(e){
      if(e.target.checked){
        localStorage.setItem('showLogoImage', true);
      }else {
        localStorage.setItem('showLogoImage', false);
      }
    },
    async showRefund(e){
      if(e.target.checked){
        localStorage.setItem('showRefund', true);
      }else {
        localStorage.setItem('showRefund', false);
      }
    },

    closeInfoModal(){
      this.infoModalActive = !this.infoModalActive;
    },
    setCashier(e, code){
      if(e.target.checked){
        localStorage.setItem('defaultCashier', code);
      }
    },
    async saveLowStock(){
      await db.collection(this.owner.city).doc(this.owner.shopId).update({
        'lowStock':this.shopInfo.lowStock
      }).then(()=>{
        this.infoModalActive = true;
        this.modalMessage = 'Update Success!';
      })
    },
    async saveExpireAlert(){
      await db.collection(this.owner.city).doc(this.owner.shopId).update({
        'expireAlert':this.shopInfo.expireAlert
      }).then(()=>{
        this.infoModalActive = true;
        this.modalMessage = 'Update Success!';
      })
    },
    enableGuestMode(){
      if(this.guestMode === 'false'){
        if(this.password === this.shopInfo.adminPassword){
          localStorage.setItem('guestMode', true);
          this.guestMode = localStorage.getItem('guestMode');
          this.password='';
        }else {
          this.infoModalActive = true;
          this.modalMessage = 'Password does not match!';
          this.password = '';
        }
      }else {
        if(this.password === this.shopInfo.adminPassword){
          localStorage.setItem('guestMode', false);
          this.guestMode = localStorage.getItem('guestMode');
          this.password ='';
        }else {
          this.infoModalActive = true;
          this.modalMessage = 'Password does not match!'
          this.password = '';
        }
      }
    },
    async upload(){
      if(this.tax>=0 && this.tax<=100){
        await db.collection(this.owner.city).doc(this.owner.shopId).update({
          'tax':this.tax.toString()
        }).then(()=>{
          this.tax = '';
          this.infoModalActive = true;
          this.modalMessage = 'Update Success!';
        })
      }else {
        this.tax = '';
        this.infoModalActive = true;
        this.modalMessage = 'Please enter value between 1-100';
      }

    }
  }
}
</script>

<style scoped>
.card{
  background-color: var(--light) !important;
  padding:10px;
}
@media only screen and (max-width: 1030px) {
  .content-box {
    margin-top: 90px;
  }
}
</style>