<!--
<template>
  <div class="container-fluid" style="background-color: var(&#45;&#45;background-color); color: var(&#45;&#45;text-color);">
    <Loading v-if="loadingActive"/>
    <InfoDialog v-if="infoModalActive" :modal-message="modalMessage" v-on:close-modal="closeModal"/>
    <confirm-dialog :modal-message="modalMessage" v-if="confirmActive" v-on:confirm="confirm" v-on:cancel="cancel"/>

    <div class="row">
      <div class="col-lg-2 p-0"><AdminSidebar/></div>

      <div class="col-12 col-lg-10 mt-5">
        <div class="row">
          <div class="rounded text-start p-2 rounded my-2">
            <div class="d-flex align-items-center">
              <button @click="$router.back()" style="color:var(&#45;&#45;text-color);" class="btn me-2 float-start"><i class="fas fa-chevron-left"> </i></button>
              <span class="fs-4 mb-1">Create Promotion Code</span>
            </div>
          </div>
          <div class="col-12 col-lg-4 mx-auto">
            <div class=" rounded">
              <div class="card-body">
                <div class="form">
                  <div class="form-floating mb-3">
                    <input type="text" required class="form-control" v-model="promoCode.name" id="promo-name-input" placeholder="enter promotion category">
                    <label for="promo-name-input">Promotion category name</label>
                  </div>
                  <div class="form-floating mb-3">
                    <input type="text" required class="form-control" v-model="promoCode.price" id="price-input" placeholder="enter price">
                    <label for="price-input">Promotion Price</label>
                  </div>
                  <div class="form-floating mb-3">
                    <input type="text" required class="form-control" v-model="count" id="count-input" placeholder="enter count">
                    <label for="count-input">Count</label>
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
                  <button class="btn float-end my-3" style="background-color: var(&#45;&#45;btnLight);" @click.prevent="uploadPromoCode">Save</button>

                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-lg-8 ">
            <div class="">
              <div class="card-body table-responsive">
                <table class="table table-hover table-bordered">
                  <thead>
                  <tr>
                    <th class="text-nowrap">#</th>
                    <th class="text-nowrap">Promo Code</th>
                    <th class="text-nowrap">Category</th>
                    <th class="text-nowrap">Price</th>
                    <th class="text-nowrap">Status</th>
                    <th class="text-nowrap">Start Date</th>
                    <th class="text-nowrap">End Date</th>
                    <th>Control</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(promo_code, index) in promoCodes" :key="index">
                    <td class="text-nowrap">{{index+1}}</td>
                    <td class="text-nowrap">{{promo_code.code}}</td>
                    <td class="text-nowrap">{{promo_code.name}}</td>
                    <td class="text-nowrap">{{promo_code.price}}</td>
                    <td class="text-nowrap">{{promo_code.used}}</td>
                    <td class="text-nowrap">{{promo_code.startDate}}</td>
                    <td class="text-nowrap">{{promo_code.endDate}}</td>
                    <td>
                      <button class="btn btn-danger" @click="deletePromCode(promo_code.id)"><i class="fas fa-trash"></i></button>
                    </td>
                  </tr>
                  </tbody>
                </table>
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
      count:'',
      category:{
        name:"",
        id:"",
        startDate:"",
        endDate:"",
      },
      promoCode:{
        code:"",
        name:"",
        id:"",
        price:"",
        used:"no",
        startDate:"",
        endDate:"",
      },
      deleteId:'',
    }
  },
  computed:{
    owner(){
      return this.$store.getters.getShopOwner;
    }
  },
  async mounted() {
    /*await db.collection(this.owner.city).doc(this.owner.shopId).collection('promotionCategory').onSnapshot(snapshot => {
      snapshot.forEach(doc=>{
        if(!this.categories.some((cate)=>cate.id === doc.id))
          this.categories.push(doc.data());
      });
    });*/
    await db.collection(this.owner.city).doc(this.owner.shopId).collection('promotionCode').onSnapshot(snapshot => {
      this.promoCodes = [];
      snapshot.forEach(doc=>{
        if(!this.promoCodes.some((cate)=>cate.id === doc.id))
          this.promoCodes.push(doc.data());
      })
    })
  },
  methods:{
    confirm(){
      this.loadingActive = true;
      this.confirmActive = !this.confirmActive;
      db.collection(this.owner.city).doc(this.owner.shopId).collection('promotionCode').doc(this.deleteId).delete().then(()=>{
        this.loadingActive = false;
        this.modalMessage='Deleted';
        this.infoModalActive=true;
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
    async uploadCategory(){
      this.category.startDate = this.formatDateStr(this.category.startDate) ;
      this.category.endDate = this.formatDateStr(this.category.endDate);
      const categoryRef =  await db.collection(this.owner.city).doc(this.owner.shopId).collection('promotionCategory').doc()
      this.category.id = categoryRef.id;
      categoryRef.set(this.category).then(()=>{
        this.infoModalActive=true;
        this.modalMessage="Upload Ok";
      }).catch(error=>{
        alert(error.message)
      })
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
      if(this.promoCode.name!=='' && this.promoCode.price!=='' && this.promoCode.startDate!=='' && this.promoCode.endDate!=='')
      {
        this.loadingActive = true;
        this.category.name = this.promoCode.name;
        this.category.startDate = this.formatDateStr(this.promoCode.startDate) ;
        this.category.endDate = this.formatDateStr(this.promoCode.endDate);
        const categoryRef =  await db.collection(this.owner.city).doc(this.owner.shopId).collection('promotionCategory').doc()
        this.category.id = categoryRef.id;
        categoryRef.set(this.category).then(()=>{
          for(let i=0;i<this.count;i++){
            this.promoCode.startDate = this.formatDateStr(this.promoCode.startDate) ;
            this.promoCode.endDate = this.formatDateStr(this.promoCode.endDate);
            this.promoCode.code = this.owner.shopCode+this.getFirstLetters(this.promoCode.name)+this.getRandomStr();
            const promoCodeRef =  db.collection(this.owner.city).doc(this.owner.shopId).collection('promotionCode').doc()
            this.promoCode.id = promoCodeRef.id;
            promoCodeRef.set(this.promoCode).then(()=>{
              //alert("Upload Ok")
            }).catch(error=>{
              alert(error.message)
            })
            if(i==(this.count-1)){
              this.loadingActive = false;
              this.modalMessage="Generated Successfully";
              this.infoModalActive = true;
            }
          }
        })
      }
      else {
        this.loadingActive = false;
        this.infoModalActive = true;
        this.modalMessage = "Please Fill all fields!"
      }


    }
  }
}
</script>

<style scoped>
tr{
  color: var(&#45;&#45;text-color);
}
@media only screen and (max-width: 1030px) {
  .content-box {
    margin-top: 60px;
  }
}
</style>-->
