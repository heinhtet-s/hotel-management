<template>
  <AdminNavigation>
    <div class="container-fluid">
      <div class="row mt-5 pt-3">
        <div class="d-flex fs-2">
          <button class="btn" @click="$router.back()"><i class="fas fa-chevron-left"></i></button>
          <span>Shop Management</span>
        </div>
        <div class="col-12 col-md-3 mb-3 mx-auto">
          <div class="col-12 ">
            <router-link :to="{name:'ShopType'}" class="text-decoration-none">
              <div class="card">
                <div class="card-body d-flex align-items-center">
                  <div class="p-2 d-inline icon-design" >
                    <i class="fas fa-clipboard-list"></i>
                  </div>
                  <h5 class="fw-bold ms-1"> Shop Type</h5>
                  <!--              <h5 class=" fw-bold">80</h5>-->
                </div>
              </div>
            </router-link>
          </div>
          <div class="col-12 ">
            <router-link :to="{name:'DisplayPromoType'}" class="text-decoration-none ">
              <div class="card">
                <div class="card-body d-flex align-items-center">
                  <div class="p-2 d-inline icon-design" >
                    <i class="fas fa-square-poll-horizontal fa-2x"></i>
                  </div>
                  <h5 class="fw-bold ms-1">Display Promotion Type</h5>
                  <!--              <h5 class=" fw-bold">10</h5>-->
                </div>
              </div>
            </router-link>
          </div>
          <div class="col-12 ">
            <router-link :to="{name:'CityCategory'}" class="text-decoration-none ">
              <div class="card">
                <div class="card-body d-flex align-items-center">
                  <div class="p-2 d-inline icon-design" >
                    <i class="far fa-map fa-2x"></i>
                  </div>
                  <h5 class="fw-bold ms-1">Cities Categories</h5>
                  <!--              <h5 class=" fw-bold">10</h5>-->
                </div>
              </div>
            </router-link>
          </div>
          <div class="col-12">
            <router-link :to="{name:'CreatePaymentTypes'}" class="text-decoration-none ">
              <div class="card">
                <div class="card-body d-flex align-items-center">
                  <div class="p-2 d-inline icon-design" >
                    <i class="far fa-credit-card fa-2x"></i>
                  </div>

                  <h5 class="fw-bold ms-1">Payment Types</h5>
                  <!--              <h5 class=" fw-bold">10</h5>-->
                </div>
              </div>
            </router-link>
          </div>
        </div>
        <div class="col-12 col-md-9 mx-auto">
          <div class="d-flex flex-lg-row flex-column justify-content-between rounded px-2 mb-2 shadow-sm">
            <h3 class="my-2">Shop Owners <span class="badge bg-warning">{{shopOwners.length}}</span></h3>
            <div class="d-flex align-items-center bg-light rounded shadow-sm m-1">
              <i class="fas fa-search"></i>
              <input type="text" class="form-control ms-1" placeholder="Enter Shop name" v-model="searchValue">
            </div>
            <router-link :to="{name:'ShopRegistration'}">
              <button class="btn btn-outline-dark m-2 rounded"><i class="fas fa-circle-plus"></i> Add New Shop</button>
            </router-link>
          </div>
          <div class="" style="overflow-y: scroll;height: 75vh;">
            <div class=" table-responsive">
              <table class="table table-hover">
                <thead class="">
                <tr class="rounded">
                  <th class="text-nowrap">Shop ID</th>
                  <th class="">Name</th>
                  <th class="">Shop Code</th>
                  <th class="text-nowrap">City</th>
                  <th class="text-nowrap">Control</th>
                </tr>

                </thead>
                <tbody>
                <tr v-for="(shop, index) in filterShops" style="cursor:pointer;" :key="index">
                  <td class="text-nowrap">{{shop.shopId}}</td>
                  <td class="">{{shop.name}}</td>
                  <td class="">{{shop.shopCode}}</td>
                  <td class="text-nowrap">{{shop.city}}</td>
                  <td class="text-nowrap">
                    <button @click.prevent="showDetail(shop)"  class="btn btn-sm btn-primary me-1"><i class="fas fa-circle-info"></i> Detail </button>
                    <!--                  <router-link :to="{name:'AddStock',params:{shop_id:shop.id}}" class="btn btn-sm btn-success me-1"><i class="fas fa-circle-plus"></i>Stock Manage</router-link>
                                      <router-link :to="{name:'ShopEdit',params:{shop_id:shop.id}}" class="btn btn-sm btn-warning"><i class="fas fa-edit"></i> Edit </router-link>-->
                  </td>
                </tr>
                </tbody>
              </table>
              <pagination
                  :totalPages="pageCount"
                  :perPage="perPage"
                  :currentPage="currentPage"
                  :pages="shopOwners"
                  @pagechanged="onPageChange"
              />

            </div>
          </div>
        </div>

      </div>

    </div>

  </AdminNavigation>
</template>

<script>
import "firebase/compat/auth";
import db from "@/config/FirebaseInit";
import AdminNavigation from "@/components/AdminNavigation";
// import _ from "lodash";
// import {debounce} from "lodash";
import Pagination from "@/components/Pagination";
export default {
  components:{AdminNavigation, Pagination},
  data(){
    return{
      //pagination
      currentPage:0,
      perPage:10,
      //end pagination
      searchValue:'',
      shopOwners:[],
      searchShops:[]
    }
  },
  computed:{
    pageCount(){
      return Math.ceil(this.shopOwners.length/this.perPage)
    },

    offsetCount(){
      return this.currentPage*this.perPage
    },
    filterShops(){
      let ownerList = [];
      if(this.searchValue!==""){
        ownerList = this.shopOwners.filter(own=>own.name.toLowerCase().includes(this.searchValue.toLowerCase()))
        console.log('filtering',ownerList)
        return ownerList.slice(this.offsetCount, this.offsetCount + this.perPage);
      }else {
        return this.shopOwners.slice(this.offsetCount, this.offsetCount + this.perPage);
      }

    }
  },
  async mounted(){
    await db.collection('shopRegistration').get().then(snapshot => {
      this.shopOwners=[];
      snapshot.forEach(doc=>{
        this.shopOwners.push(doc.data())
      })
    });
  },
  methods:{
    onPageChange(page) {
      console.log(page)
      this.currentPage = page;
    },
    showDetail(shop){
      this.$router.push({name:'ShopDetail',params:{shop_id:shop.id}});
    },
    /*searchShop:debounce(function (e){
      if(e.target.value!==''){
        db.collection('shopRegistration').where("name",">=",e.target.value).where("name","<=",e.target.value+'\uf8ff').onSnapshot(snapshot=>{
          this.searchShops = [];
          snapshot.docs.filter(e=>{
            const isDuplicate = this.searchShops.includes(e.id);
            if(!isDuplicate){
              this.searchShops.push(e.data());
              console.log(this.searchShops)
              return true;
            }
            return false;
          })
        })
      }else {
        this.searchShops = [];
      }

    },500)*/

  }

}
</script>

<style scoped>
.card{
  background-color: var(--side-bar-bg) !important;
  transition: 0.4s;
}
.card:hover, .card-body:hover{
  background-color: var(--btnLight) !important;
}
.icon-design{
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width:50px;
  height: 50px;
  background-color: var(--light);
  border-radius: var(--border-radius);
}
</style>