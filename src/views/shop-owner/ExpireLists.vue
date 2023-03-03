<template>
  <Loading v-if="loadingActive"/>
  <div class="container-fluid" v-if="this.owner" style="background-color: var(--background-color);color: var(--text-color);">
    <div class="row">
      <div class="col-lg-2 p-0">
        <AdminSidebar />
      </div>
      <div class="col-12 col-lg-10 table-responsive mt-5">
        <div class="d-flex p-2 position-fixed justify-content-between align-items-center my-2" style="top: 38px; z-index: 100; width: 80%; background-color: var(--background-color);">
         <div class="d-flex">
           <button class="btn btn--white" @click="$router.back()"><i class="fas fa-chevron-left"></i></button>
           <span class="fs-4">{{ $t('message.expire_list') }}</span>
         </div>

          <div class="btn-group p-1" role="group" aria-label="Basic radio toggle button group">
            <input type="radio" class="btn-check" @click="getTargetExpireProducts" name="btnradio" id="btnradio1" autocomplete="off" checked>
            <label class="btn btn-primary" style="font-size: 12px;" :class="expireActive?'check-btn':''"  for="btnradio1">Expire in {{shopInfo.expireAlert}} Days</label>

            <input type="radio" class="btn-check" @click="getExpiredProducts" name="btnradio" id="btnradio2" autocomplete="off">
            <label class="btn btn-primary " style="font-size: 12px;" :class="!expireActive?'check-btn':''" for="btnradio2">Expired Products</label>
          </div>
        </div>

        <div class="mt-5" >

          <div v-if="!expireActive" style="height: 80vh;overflow-y: scroll">
            <div  class="row">
              <div class="col-12 col-md-3" v-for="(product,index) in filterExpiredProducts" :key="index">
                <div class="card p-1 shadow-sm" >
                  <router-link :to="{name:'ProductDetail', params:{product_id:product.id}}" class="text-decoration-none d-flex align-items-center">
                    <div>
                      <img :src="product.images[0]" v-if="product.images.length>0" width="60" height="60" class="rounded-circle shadow-sm" alt="">
                      <img src="../../assets/flash/1.png" style="opacity: 0.3" v-else width="60" height="60" alt="">
                    </div>
                    <div class="d-flex ps-1 flex-column mt-1 p-1" style="width: 80%">
                  <span class="text-black text-truncate">
                    {{product.itemName}}
                  </span>
                      <span class="text-danger">
                    {{product.expireDate}}
                  </span>
                    </div>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
          <div  style="height: 80vh;overflow-y: scroll" v-else>
            <div class="row">
              <div class="col-6 col-md-3" v-for="(product,index) in filterExpiredProducts" :key="index">
                <div class="card p-3 shadow-sm">
                  <router-link :to="{name:'ProductDetail', params:{product_id:product.id}}" class="text-decoration-none d-flex">
                    <div>
                      <img :src="product.images[0]" v-if="product.images.length>0" width="60" height="60" class="rounded-circle shadow-sm" alt="">
                      <img src="../../assets/flash/1.png" style="opacity: 0.4" v-else width="60" height="60" alt="">

                    </div>
                    <div class="d-flex ps-1 flex-column mt-1" style="width: 80%">
                      <span class="text-black text-truncate">
                        {{product.itemName}}
                      </span>
                      <span class="text-danger">
                        {{product.expireDate}}
                      </span>
                    </div>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
          <pagination
              :totalPages="pageCount"
              :perPage="perPage"
              :currentPage="currentPage"
              :pages="filterExpiredProducts"
              @pagechanged="onPageChange"
          />
        </div>

      </div>
    </div>
  </div>


</template>

<script>
import AdminSidebar from "@/components/AdminSidebar";
import Loading from "@/components/Loading";
import Pagination from "@/components/Pagination";
export default {
  components: {Loading, AdminSidebar,Pagination},
  data(){
    return{
      //pagination
      currentPage:0,
      perPage:24,
      //end pagination
      search:'',
      selectedCategory:'All',
      confirmActive:false,
      modalActive:false,
      modalMessage:'',
      loadingActive:false,
      //productCategories:'',
      selectedId:'',
      /* products:[],*/
      targetExpiredProducts:[],
      expiredProducts:[],
      expireActive:false,
    }
  },
  computed:{
    pageCount(){
      return Math.ceil(this.expiredProducts.length/this.perPage)
    },

    offsetCount(){
      return this.currentPage*this.perPage
    },

    filterExpiredProducts(){
      return this.expiredProducts.slice(this.offsetCount, this.offsetCount+this.perPage)
    },

    owner(){
      return this.$store.getters.getShopOwner;
    },
    productCategories(){
      return this.$store.getters.getProductCategories;
    },
    shopInfo(){
      return this.$store.getters.getShopInfo;
    },
    products(){
      return this.$store.getters.getAllProducts;
    },



  },
  created() {
    this.$store.dispatch("getProductCategories", this.owner);
    this.$store.dispatch("getShopInfo",this.owner);
    this.$store.dispatch("getAllProducts",this.owner);
  },
  async mounted() {
    //await this.getExpiredProducts();
    await this.getTargetExpireProducts();


  },
  methods:{
    onPageChange(page) {
      console.log(page)
      this.currentPage = page;
    },
    viewItemDetails(product){
      this.$router.push({name:'ProductDetail', params:{product_id:product.id}})
    },
    getToday(){
      let date = new Date();
      let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
      let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
      let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
      return   day+"-"+month+"-"+year;
    },
    async getExpiredProducts(){
      this.expiredProducts = [];
      this.expireActive = true;
      let date = new Date();
      this.products.forEach(product=>{
        if(product.expireDate){
          console.log(product.expireDate)
          if(new Date(product.expireDate)<=date){
            this.expiredProducts.push(product)
          }
        }

      });
    },
    async getTargetExpireProducts(){
      this.expireActive = false;
      this.expiredProducts = [];
      let expireAlert = parseInt(this.shopInfo.expireAlert);
      let date = new Date();
      console.log('Today', date)
      let target = new Date()
      let targetExpireDate = new Date(target.setDate(target.getDate()+expireAlert));
      console.log(targetExpireDate)

      this.products.forEach(product=>{
        if(product.expireDate){
          let expireDate = new Date(product.expireDate);
          // expireDate = expireDate.toLocaleDateString();
          console.log(expireDate)
          //  console.log('product', expireDate)
          if(expireDate >= date && expireDate<=targetExpireDate){
            this.expiredProducts.push(product)
          }
        }

      });

    },
  }

}
</script>

<style scoped>
.btn-group{
  width: 30%;
}
.card{
  background-color: var(--white) !important;
  height: 100px;
  overflow: hidden;
}
.check-btn{
  background-color: var(--secondary);
  border: none !important;
  width: 80px !important;
}
.btn-group .btn{
  width: 50% !important;
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
</style>