<template>
  <AdminSidebar>
    <div class="row">
      <div class="d-flex align-items-center" style="color: var(--text-color);">
        <button @click="$router.back()" class=" btn " style="color: var(--text-color);" >
          <i class="fas fa-chevron-left"> </i>
          <span class="ms-1">{{ $t('message.inventory') }}</span>
        </button>
      </div>
      <div class="col-6 col-lg-4 col-md-6 mb-3">
        <router-link :to="{name:'ProductList',params: {category:'All'}}" class="text-decoration-none">
          <div class="card">
            <div class="text-center">
              <div class="icon-badge p-2 "><i class="fas fa-layer-group fa-2x"></i></div>
              <h6 class="mt-5 fs-4">{{$t('message.product_management')}} </h6>
              <!-- {{$t('message.product_management')}} -->
            </div>
          </div>
        </router-link>
      </div>
      <div class="col-6 col-lg-4 col-md-6 mb-3" v-if="cashierAcc.counter==='Restaurant' || cashierAcc.counter==='Bar' ">
        <router-link :to="{name:'TableList',params: {category:'All'}}" class="text-decoration-none">
          <div class="card">
            <div class="text-center">
              <div class="icon-badge p-2 "><i class="fas fa-chair fa-2x"></i></div>
              <h6 class="mt-5 fs-4"> {{$t('message.table_management')}}</h6>
            </div>
          </div>
        </router-link>
      </div>
      <div class="col-6 col-lg-4 col-md-6 mb-3">
        <router-link :to="{name:'PurchaseVoucher'}" class="text-decoration-none">
          <div class="card">
            <div class="text-center">
              <div class="icon-badge p-2 "><i class="fas fa-shopping-cart fa-2x"></i></div>
              <h6 class="mt-5 fs-4"> {{$t('message.purchase_lists')}}</h6>
            </div>
          </div>
        </router-link>
      </div>
      <div class="col-6 col-lg-4 col-md-6 mb-3">
        <router-link :to="{name:'ShopOwnerCategoryManagement'}" class="text-decoration-none ">
          <div class="card">
            <div class="text-center">
              <div class="icon-badge p-2 ">
                <i class="far fa-rectangle-list fa-2x"></i>
              </div>
              <h6 class="mt-5 fs-4"> {{ $t('message.categories_management') }}</h6>
            </div>
          </div>
        </router-link>
      </div>

      <div class="col-6 col-lg-4 col-md-6 mb-3" v-if="cashierAcc.counter==='Apartment' ">
        <router-link :to="{name:'ListSwimmingPoolCategory'}" class="text-decoration-none ">
          <div class="card">
            <div class="text-center">
              <div class="icon-badge p-2 ">
                <i class="far fa-rectangle-list fa-2x"></i>
              </div>
              <!-- <h6 class="mt-5 fs-4"> Swimming Pool Category Management</h6> -->
              <h6 class="mt-5 fs-4"> {{$t('message.swimming_management')}}</h6>
            </div>
          </div>
        </router-link>
      </div>

      <!-- <div class="col-6 col-lg-4 col-md-6 mb-3">
        <router-link :to="{name:'ListPartyPool'}" class="text-decoration-none ">
          <div class="card">
            <div class="text-center">
              <div class="icon-badge p-2 ">
                <i class="far fa-rectangle-list fa-2x"></i>
              </div>
              <h6 class="mt-5 fs-4"> Swimming Pool Party Category Management</h6>
            </div>
          </div>
        </router-link>
      </div> -->

      <div class="col-6 col-lg-4 col-md-6 mb-3" v-if="shopInfo.packageStatus==='ultra' || shopInfo.packageStatus==='premium'">
        <router-link :to="{name:'OwnerDeliveryService'}" class=" text-decoration-none">
          <div class="card">
            <div class="text-center">
              <div class="icon-badge p-2 ">
                <i class="fas fa-truck fa-2x"></i>
              </div>
              <h6 class="mt-5 fs-4">{{$t('message.delivery_management')}}</h6>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </AdminSidebar>
</template>

<script>
import AdminSidebar from "@/components/AdminSidebar";
export default {
  components:{AdminSidebar},
  data(){
    return{
      loadingActive:false,
    }
  },
  computed:{
    owner(){
      return this.$store.getters.getShopOwner;
    },
    shopInfo(){
      return this.$store.getters.getShopInfo;
    },
    cashierAcc(){
      return this.$store.getters.getCashierAcc;
    }
  },
  created() {
    if(this.owner){
      this.$store.dispatch("getShopInfo", this.owner)
      this.$store.dispatch("getAllProducts",this.owner);
      this.$store.dispatch("getCashier", this.owner);
      this.$store.dispatch("getPaymentTypes");
    }
  }
}
</script>
<style scoped>
h6{
  color: var(--dark);
}
.card{
  border-radius: var(--border-radius);
  box-shadow:0 0 50px -20px rgba(204, 204, 204, 0.8);
  color: var(--text-color) !important;
  padding: 10px;
}
h6{
  color: var(--text-color);
}

.card:hover{
  background-color: var(--secondary) !important;
  transform: scale(1.05);
}
.icon-badge{
  border-radius: var(--border-radius);
  background-color: var(--side-bar-bg);
  display: inline-block;
  justify-content: center;
  align-items: center;
}


ul{
  text-align: start;
  list-style-type: none;
}
ol{
  text-align: start;
}
</style>