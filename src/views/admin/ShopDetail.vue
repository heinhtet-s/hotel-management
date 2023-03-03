
<template>
  <AdminNavigation>
    <Loading v-if="loadingActive"/>
    <InfoDialog v-if="infoModalActive" :modal-message="modalMessage" v-on:close-modal="closeModal"/>
    <ConfirmDialog :modal-message="modalMessage" v-if="confirmActive" v-on:confirm="confirm" v-on:cancel="cancel"/>

    <div class="container-xxl">
      <div class="row mt-5 pt-3">
        <div class="col-12 col-lg-12 mx-auto">
          <div class="d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center">
              <button class="btn btn--white fs-4" @click="$router.back()"><i class="fas fa-chevron-left"></i></button>
              <span class="fs-3">{{ currentShop.name }}</span>
            </div>
          </div>
          <div class="row">
            <div class="col-12 col-md-6 col-lg-4" style="height: 80vh;overflow-y: scroll;">
              <div class="table-responsive">
                <div class="d-flex flex-column">
                  <table class="table table-hover table-bordered ">
                    <tbody>
                    <tr>
                      <td colspan="2">
                        <img :src="currentShop.profileUrl" class="img-thumbnail" alt="">
                        <router-link :to="{name:'ShopEdit',params:{shop_id:$route.params.shop_id}}" class="btn my-1 btn-warning"><i class="fas fa-edit"></i> Edit</router-link>
                      </td>
                    </tr>
                    <tr>
                      <td>Shop Tye</td>
                      <td>
                        <span class="badge bg-secondary rounded-pill me-1" v-for="(type,index) in currentShop.shopType" :key="index">{{type}}</span>
                      </td>
                    </tr>
                    <tr>
                      <td>Email</td>
                      <td>{{currentShop.email}}</td>
                    </tr>
                    <tr>
                      <td>Phone</td>
                      <td>{{currentShop.phone}}</td>
                    </tr>
                    <tr>
                      <td>Branch Type</td>
                      <td>{{currentShop.branch}}</td>
                    </tr>
                    <tr>
                      <td>Address</td>
                      <td>{{currentShop.address}}</td>
                    </tr>
                    <tr>
                      <td>Display type</td>
                      <td>{{currentShop.promotionDisplayType}}</td>
                    </tr>
                    <tr>
                      <td>Online Sell</td>
                      <td>{{currentShop.onlineSell}}</td>
                    </tr>
                    <tr>
                      <td>Created At</td>
                      <td v-if="currentShop">{{currentShop.createdAt.toDate().toLocaleDateString()}}, {{currentShop.createdAt.toDate().toLocaleTimeString()}}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="card d-none">
                <button class="btn btn-warning" @click="updateBarcode">Update Barcode</button>
              </div>
            </div>
            <div class="col-12 col-md-8">
              <div class="row">
                <div class="col-12 col-md-6 col-lg-4">
                  <router-link :to="{name:'ShopEdit',params:{shop_id:$route.params.shop_id}}" class="text-decoration-none ">
                    <div class="card">
                      <div class="card-body d-flex align-items-center">
                        <div class="p-2 d-inline icon-design" >
                          <i class="fas fa-square-poll-horizontal fa-2x"></i>
                        </div>
                        <h5 class="fw-bold ms-1">Cashier Management</h5>

                      </div>
                    </div>
                  </router-link>
                </div>
                <div class="col-12 col-md-6 col-lg-4 ">
                  <router-link :to="{name:'AdminSellReport', params:{shop_id:$route.params.shop_id}}" class="text-decoration-none ">
                    <div class="card">
                      <div class="card-body d-flex align-items-center">
                        <div class="p-2 d-inline icon-design" >
                          <i class="fas fa-square-poll-horizontal fa-2x"></i>
                        </div>
                        <h5 class="fw-bold ms-1" >Sell Report Management</h5>
                        <!--              <h5 class=" fw-bold">10</h5>-->
                      </div>
                    </div>
                  </router-link>
                </div>
                <div class="col-12 col-md-6 col-lg-4">
                  <router-link :to="{name:'AddStock',params:{shop_id:$route.params.shop_id}}" class="text-decoration-none ">
                    <div class="card">
                      <div class="card-body d-flex align-items-center">
                        <div class="p-2 d-inline icon-design" >
                          <i class="fas fa-square-poll-horizontal fa-2x"></i>
                        </div>
                        <h5 class="fw-bold ms-1">Product Management</h5>
                        <!--              <h5 class=" fw-bold">10</h5>-->
                      </div>
                    </div>
                  </router-link>
                </div>
              </div>


            </div>

          </div>
        </div>

      </div>

    </div>

  </AdminNavigation>
</template>

<script>
import db from "@/config/FirebaseInit";
import ConfirmDialog from "@/components/ConfirmDialog";
import InfoDialog from "@/components/InfoDialog";
import Loading from "@/components/Loading";
import AdminNavigation from "@/components/AdminNavigation";
export default {
  components: {AdminNavigation, Loading, ConfirmDialog, InfoDialog},
  data(){

    return{
      loadingActive:false,
      infoModalActive:false,
      modalMessage:'',
      confirmActive:false,
      file:'',
      currentShop:'',
    }
  },
  computed:{
    shopOwner(){
      return this.$store.getters.getShopOwner
    },
    todayDate(){
      const today = new Date();
      const currentDate =  today.getFullYear()+"-"+(today.getMonth() + 1).toString().padStart(2, "0")+'-'+today.getDate().toString().padStart(2,"0");
      return currentDate;
    },
    cities(){
      return this.$store.state.cities;
    }

  },
  async mounted() {

    await db.collection('shopRegistration').doc(this.$route.params.shop_id).get().then((result)=>{
      this.currentShop = result.data();
      console.log(this.currentShop)
    });
  },
  methods:{
    confirm(){
      this.loadingActive = true;
      this.confirmActive = !this.confirmActive;
    },
    updateBarcode(){
      this.loadingActive = true;
      db.collection('BarcodeUpdate').doc().set({
        'shopId':this.currentShop.shopId,
        'city':this.currentShop.city
      }).then(()=>{
        this.loadingActive = false;
        alert('ok')
      })

    },
    cancel(){
      this.confirmActive = !this.confirmActive;
    },
    closeModal(){
      this.infoModalActive = !this.infoModalActive;
    },

  }
}
</script>

<style scoped>
td{
  min-width: 30%;
}
.card{
  background-color: var(--side-bar-bg) !important;
  transition: 0.4s;
}
.card:hover, .card-body:hover{
  background-color: var(--btnLight) !important;
}
</style>
