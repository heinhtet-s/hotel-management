<template>
  <div class="container-fluid" style="background-color: var(--background-color); color: var(--text-color);">
    <Loading v-if="loadingActive"/>
    <InfoDialog v-if="infoModalActive" :modal-message="modalMessage" v-on:close-modal="closeModal"/>
    <confirm-dialog :modal-message="modalMessage" v-if="confirmActive" v-on:confirm="confirm" v-on:cancel="cancel"/>

    <div class="row">
      <div class="col-lg-2 p-0"><AdminSidebar/></div>

      <div class="col-12 col-lg-8 mt-5" v-if="shopInfo.packageStatus==='ultra'||shopInfo.packageStatus==='premium'">
        <div class="row">
          <div class="rounded text-start p-2 rounded my-2">
            <div class="d-flex align-items-center">
              <button @click="$router.back()" style="color:var(--text-color);" class="btn me-2 float-start"><i class="fas fa-chevron-left"> </i></button>
              <span class="fs-4 mb-1">Online Promotion</span>
            </div>
          </div>
          <div class="col-12 col-lg-5 mx-auto">
            <div class=" rounded">
              <div class="card-body">
                <form @submit.prevent="uploadPromoCode">
                  <div class="form-floating mb-3">
                    <input type="text" required class="form-control" v-model="promoCode.code" id="promo-name-input" placeholder="enter promotion category">
                    <label for="promo-name-input">Promotion Code</label>
                  </div>
                  <div class="form-floating mb-3">
                    <input type="number" required class="form-control" v-model="promoCode.count" id="price-input" placeholder="enter count">
                    <label for="price-input">Count</label>
                  </div>
                  <div class="row">
                    <div class="col-12 col-lg-6 col-md-6 text-start mb-3">
                      <label for="start-code-date">Start Date</label>
                      <input type="date" id="start-code-date" required class="form-control" v-model="promoCode.startDate">
                    </div>
                    <div class="col-12 col-lg-6 col-md-6 text-start mb-3">
                      <label for="end-code-date">End Date</label>
                      <input type="date" id="end-code-date" required class="form-control" v-model="promoCode.endDate">
                    </div>
                  </div>

                  <div class="form-floating mb-3">
                    <input type="number" required class="form-control" v-model="promoCode.minimumAmount" id="price-input" placeholder="enter minimum amount">
                    <label for="price-input">Minimum Amount</label>
                  </div>
                  <div class="row">
                    <div class="col-12 col-lg-6 col-md-6 text-start mb-3">
                      <label class="status">Discount Type</label>
                      <select id="status" style="background-color: var(--light) !important;" class="form-select fs-6 form-control form-select bg-transparent rounded"  v-model="promoCode.status" aria-label=".form-select-lg example">
                        <option value="Price">Price</option>
                        <option value="Percent">Rate (%)</option>
                      </select>
                     </div>
                    <div class="col-12 col-lg-6 col-md-6 text-start mb-3">
                      <label for="end-code-date">Discount</label>
                      <input type="number" id="end-code-date" required class="form-control" v-model="promoCode.discount">
                    </div>
                  </div>
                  <button type="submit" class="btn float-end my-3" style="background-color: var(--btnLight);">Save</button>
                </form>
              </div>
            </div>
          </div>
          <div class="col-12 col-lg-7" style="position: sticky; height: 80vh; overflow-y: scroll; overflow-x: hidden " >
            <div class="card" style="background-color: var(--light) !important;" v-for="(promo,index) in promoCodes" :key="index">
              <div class="card-body table-responsive">
                <div class="d-flex">
                  <div class="mt-2">
                    <div>
                      <span class="text-success">Start Date</span>
                      <p>{{promo.startDate}}</p>
                    </div>
                    <div>
                      <span class="text-danger">End Date</span>
                      <p>{{promo.endDate}}</p>
                    </div>
                    <div>
                      <span class="text-primary">Available Code</span>
                      <p>{{promo.count}}</p>
                    </div>
                  </div>
                  <div class="w-75 ms-2 p-1 bg-flash p-0" style="border-radius: var(--border-radius);">
                    <div class="bg-opacity w-100 h-100 m-0 d-flex">
                      <div class="d-flex flex-column w-75 ps-2">
                        <span class="fs-3">{{promo.code}}</span>
                        <span class="mt-2" style="color: var(--text-color-light);">Discount Rate</span>
                        <span class="fs-3" v-if="promo.status === 'Percent'">{{promo.discount}} %</span>
                        <span class="fs-3" v-else>{{promo.discount}} Ks</span>
                        <span class="mt-2" style="color: var(--text-color-light);">Minimum Purchase</span>
                        <span class="fs-3">{{promo.minimumAmount}} Ks</span>
                      </div>
                      <div class="text-end w-25">
                        <button class="btn btn-sm rounded-circle" @click="deletePromo(promo)"><i class="fas fa-trash"></i></button>
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

  </div>
</template>

<script>
import db,{timestamp} from "@/config/FirebaseInit";
import Loading from "../..//components/Loading";
import InfoDialog from "../../components/InfoDialog";
import ConfirmDialog from "@/components/ConfirmDialog";
import AdminSidebar from "@/components/AdminSidebar";
export default {
  components: {ConfirmDialog, Loading, InfoDialog, AdminSidebar},
  data(){
    return{
      infoModalActive:false,
      modalMessage:'',
      loadingActive:false,
      confirmActive:false,

      categories:[],
      promoCodes:[],
      selectedDeletePromo:'',
      count:'',
      category:{
        name:"",
        id:"",
        startDate:"",
        endDate:"",
      },
      promoCode:{
        code:"",
        count:'',
        createdAt:'',
        discount:'',
        endDate:'',
        id:'',
        minimumAmount:'',
        startDate:'',
        status:'Price',
      },
      deleteId:'',
    }
  },
  computed:{
    owner(){
      return this.$store.getters.getShopOwner;
    },
    shopInfo(){
      return this.$store.getters.getShopInfo;
    }
  },
  async mounted() {
    this.$store.dispatch("getCurrentShop");
    this.$store.dispatch("getShopInfo",this.owner);
    await db.collection(this.owner.city).doc(this.owner.shopId).collection('promotion').orderBy('createdAt','desc').onSnapshot(snapshot => {
      this.promoCodes = [];
      snapshot.forEach(doc=>{
        if(!this.promoCodes.some((cate)=>cate.id === doc.id))
          this.promoCodes.push(doc.data());
      })
    })
  },
  methods:{
    async confirm(){
      this.loadingActive = true;
      this.confirmActive = !this.confirmActive;
      await db.collection(this.owner.city).doc(this.owner.shopId).collection('promotion').doc(this.selectedDeletePromo.id).collection('used').get().then(snapshot=>{
        if(snapshot.size>0){
          console.log('size',snapshot.size);
          let i = 0;

          snapshot.forEach(doc=>{
            i++;
            db.collection(this.owner.city).doc(this.owner.shopId).collection('promotion').doc(this.selectedDeletePromo.id).collection('used').doc(doc.data().id).delete();
            if(i === snapshot.size){
              db.collection(this.owner.city).doc(this.owner.shopId).collection('promotion').doc(this.selectedDeletePromo.id).delete().then(()=>{
                this.infoModalActive=true;
                this.modalMessage="Delete Ok";
                this.loadingActive = false;
              })
            }
          });
        }else {
          db.collection(this.owner.city).doc(this.owner.shopId).collection('promotion').doc(this.selectedDeletePromo.id).delete().then(()=>{
            this.infoModalActive=true;
            console.log(snapshot.size)
            this.modalMessage="Delete Ok";
            this.loadingActive = false;
          })
        }
      })
    },
    cancel(){
      this.confirmActive = !this.confirmActive;
    },
    closeModal(){
      this.infoModalActive = !this.infoModalActive;
    },
    deletePromCode(id){
      this.confirmActive = true;
      this.modalMessage = 'Are you sure to Delete?'
      this.deleteId = id;
    },
    formatDateStr(date){
      let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(new Date(date));
      let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(date));
      let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(new Date(date));
      return day+"-"+month+"-"+year;
    },
    getRandomStr(){
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
      let result = '';
      for ( let i = 0; i < 6; i++ ) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    },
    getFirstLetters(str) {
      const firstLetters = str
          .split(' ')
          .map(word => word[0])
          .join('');
      return firstLetters;
    },
    async uploadPromoCode(){
      this.promoCode.code = this.promoCode.code.toUpperCase();
      this.promoCode.discount = this.promoCode.discount.toString();
      this.promoCode.minimumAmount = this.promoCode.minimumAmount.toString();
      this.promoCode.count = this.promoCode.count.toString();
      this.promoCode.startDate = this.formatDateStr(this.promoCode.startDate) ;
      this.promoCode.endDate = this.formatDateStr(this.promoCode.endDate);
      this.promoCode.createdAt = timestamp;
      console.log(this.promoCode);
      const promoCodeRef =  await db.collection(this.owner.city).doc(this.owner.shopId).collection('promotion').doc()
      this.promoCode.id = promoCodeRef.id;
      promoCodeRef.set(this.promoCode).then(()=>{
        this.infoModalActive=true;
        this.modalMessage="Upload Ok";
        this.promoCode = {
          code:"",
          count:'',
          createdAt:'',
          discount:'',
          endDate:'',
          id:'',
          minimumAmount:'',
          startDate:'',
          status:'Price',
        }
      }).catch(error=>{
        alert(error.message)
      });
    },
    deletePromo(promo){
      this.selectedDeletePromo = promo;
      this.confirmActive = true;
      this.modalMessage = "Are you sure to delete!"
    },
  }
}
</script>

<style scoped>
tr{
  color: var(--text-color);
}
.bg-flash{
  background-image: url('../../assets/white-logo.svg');
  width: 100%;
  background-size: cover;
}
.bg-opacity{
  border-radius: var(--border-radius);
  background-color: #C0D1FD3A;
}
@media only screen and (max-width: 1030px) {
  .content-box {
    margin-top: 60px;
  }
}
</style>