<template>
  <div class="container-fluid" style="background-color: var(--background-color); color: var(--text-color);">
    <Loading v-if="loadingActive"/>
    <InfoDialog v-if="infoModalActive" :modal-message="modalMessage" v-on:close-modal="closeInfoModal"/>
    <confirm-dialog :modal-message="modalMessage" v-if="confirmActive" v-on:confirm="confirm" v-on:cancel="cancel"/>

    <div class="row ">
      <div class="col-lg-2 p-0"><AdminSidebar/></div>
      <div class="col-12 col-lg-10 mt-5" v-if="shopInfo.packageStatus === 'ultra' || shopInfo.packageStatus === 'premium'">
        <div class="row pt-3">
          <div class="col-12 col-lg-5">
            <div class="d-flex align-items-center">
              <button class="btn btn--white" style="color: var(--text-color);" @click="$router.back()"><i class="fas fa-chevron-left"></i></button>
              <span class="fs-5">Available Delivery Services</span>
            </div>
            <div class="card rounded">
              <div class="card-body">
                <div class="form">
                  <div class="col-12">
                    <div class="form-check mt-2 py-2" style="background-color: var(--light); border-radius: var(--border-radius);" v-for="type in deliveryServices" :key="type.id">
                      <input class="form-check-input ms-1" type="checkbox" @change="checkService($event)" :checked="shopInfo.deliveryServices.includes(type.id)" :value="type.id" :id="type.id">
                      <label class="form-check-label " :for="type.id">
                        <span>{{type.name}}, </span>
                        <span class="badge rounded-pill" style="background-color: var(--btnLight);color: var(--text-color);" v-for="(name,index) in type.availableCities" :key="index">{{name}} </span>
                      </label>
                    </div>
                  </div>
<!--                  <button class="btn btn-sm float-end my-3" style="background-color: var(&#45;&#45;btnLight);" @click.prevent="upload">Choose</button>-->
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-lg-5" v-if="shopInfo.deliveryServices.length>0">
            <span class="fs-5">Selected Delivery Services</span>
            <div class="card shadow-none m-1" style="background-color: var(--side-bar-bg) !important; border-radius: var(--border-radius) !important;" v-for="(deli, index) in ownerObjDeliveryServices" :key="index">
              <div class="p-2">
                <div class="d-flex justify-content-between align-items-center">
                  <div class="d-flex align-items-center justify-content-between">
                    <img :src="deli.photo" class="rounded-circle shadow-sm" width="60" height="60" alt="">
                    <span>{{deli.name}}</span>
                  </div>
                </div>
                <div class="d-flex w-75 flex-column mx-2">
                  <span><i class="fas fa-phone"></i>{{deli.phone}}</span>

                  <span>
                    Available:
                    <span class="badge rounded-pill" style="background-color: var(--light);color: var(--text-color);" v-for="(name,index) in deli.availableCities" :key="index">{{name}} </span>
                  </span>
                  <div class="d-flex justify-content-between">
                    <div class="d-flex flex-column">
                      <span class="text-success">In City</span>
                      <span>{{deli.feeRange}}</span>
                    </div>
                    <div class="d-flex flex-column ">
                      <span class="text-success">Other City</span>
                      <span>{{deli.externalFeeRange}}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import db from "@/config/FirebaseInit";
import Loading from "@/components/Loading";
import InfoDialog from "@/components/InfoDialog";
import ConfirmDialog from "@/components/ConfirmDialog";
import AdminSidebar from "@/components/AdminSidebar";
export default {
  components: {ConfirmDialog, InfoDialog, Loading,AdminSidebar},
  data(){
    return{
      infoModalActive:false,
      modalMessage:'',
      loadingActive:false,
      confirmActive:false,
      deleteId:'',
      selectedService:'',
      deliveryServices:[], //main
      shopProfile:[],//owner services
      tempDeliveryServices:[], //owner seletcted temp
      ownerObjDeliveryServices:[],
    }
  },

  computed:{
    owner(){
      return this.$store.getters.getShopOwner;
    },
    shopInfo(){
      return this.$store.getters.getShopInfo;
    },
    paymentType(){
      return this.$store.getters.getPaymentTypes;
    }
  },
  created() {
    this.$store.dispatch("getShopInfo",this.owner);
  },
  async mounted() {
    this.tempDeliveryServices = this.shopInfo.deliveryServices;
    await db.collection('deliveryServices').onSnapshot(snapshot => {
      this.deliveryServices = [];
      snapshot.forEach(doc=>{
        this.deliveryServices.push(doc.data());
      })
    })
    this.shopInfo.deliveryServices.forEach(id=>{
      this.ownerObjDeliveryServices = [];
      db.collection('deliveryServices').doc(id).onSnapshot(snapshot => {
        this.ownerObjDeliveryServices.push(snapshot.data());
      })
    })

  /*  db.collection(this.owner.city).doc(this.owner.shopId).get().then(snapshot => {
      this.shopProfile = snapshot.data();
    })*/

  },

  methods:{
    async checkService(e){
      this.loadingActive = true;
      if(e.target.checked){
        if(!this.tempDeliveryServices.includes(e.target.value)){
          this.tempDeliveryServices.push(e.target.value);
          await db.collection(this.owner.city).doc(this.owner.shopId).update({
            'deliveryServices':this.tempDeliveryServices
          }).then(()=>{
            this.shopInfo.deliveryServices.forEach(id=>{
              this.ownerObjDeliveryServices = [];
              db.collection('deliveryServices').doc(id).onSnapshot(snapshot => {
                this.ownerObjDeliveryServices.push(snapshot.data());
              })
            })
            this.loadingActive = false;
           // window.location.reload();
          });
        }
      }else {
        this.tempDeliveryServices = this.tempDeliveryServices.filter((service)=>{return service!==e.target.value});
        await db.collection(this.owner.city).doc(this.owner.shopId).update({
          'deliveryServices':this.tempDeliveryServices
        }).then(()=>{
          this.shopInfo.deliveryServices.forEach(id=>{
            this.ownerObjDeliveryServices = [];
            db.collection('deliveryServices').doc(id).onSnapshot(snapshot => {
              this.ownerObjDeliveryServices.push(snapshot.data());
            })
          })
          this.loadingActive = false;
         // window.location.reload();
        });
      }
    },
    confirm(){
      this.loadingActive = true;
      this.confirmActive = !this.confirmActive;
      const filterDeliveryServices = this.shopProfile.deliveryServices.filter(id=>{return id!==this.deleteId})
      db.collection(this.owner.city).doc(this.owner.shopId).update({
        'deliveryServices':filterDeliveryServices
      }).then(()=>{
        this.loadingActive = false;
        this.modalMessage='Deleted';
        this.infoModalActive=true;
        window.location.reload();
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

  }
}
</script>

<style scoped>

</style>