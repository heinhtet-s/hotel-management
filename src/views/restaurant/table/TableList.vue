<template>
  <Loading v-if="loadingActive"/>
  <InfoDialog v-if="modalActive" :modal-message="modalMessage" v-on:close-modal="closeModal"/>
  <confirm-dialog :modal-message="modalMessage" v-if="confirmActive" v-on:confirm="confirm" v-on:cancel="cancel"/>

  <AdminSidebar>
    <div class="col-12 table-responsive">
      <div class=" header-bar mt-1">
        <button @click="$router.back()" class="btn fs-5" style="color: var(--primary);" >
          <i class="fas fa-chevron-left"> </i>
          <span class="ms-2">{{$t('message.tables')}}</span>
        </button>

        <div class="category-box d-lg-flex justify-content-between align-items-center">
          <ul class="text-start d-block list-unstyled border-0 py-3 align-center">
            <li class="d-inline-block mx-1 category-list" :class="selectedCategory==='All'?'category-list-active':''" style="background-color: var(--light);" @click="selectCategory('All')">
              <span class="mx-2"> All</span>
            </li>
            <li v-for="(category, index) in productCategories" style="background-color: var(--light);" :key="index" class="category-list d-inline-block" :class="selectedCategory===category.name?'category-list-active':''" @click="selectCategory( category.name)">
              <span class="mx-2">{{category.name}}</span>
            </li>
          </ul>
          <div>
            <router-link :to="{name:'TableCreate',params:{category:$route.params.category}}" class="btn btn-lg ms-2 mb-3" style="color: var(--text-color);background-color: var(--btnLight);"><i class="fas fa-plus-circle"></i></router-link>
          </div>
        </div>

        <div class="px-1 d-flex justify-content-between">
          <div class="">
            <!--              @input="searchProduct"-->
            <input type="text" v-model="search"  :placeholder="$t('message.search')" class="form-control mb-3 mx-2 ">
          </div>
        </div>
      </div>
      <div class="table-card">
        <div class="row">
          <div class="col-2 align-middle"  v-for="(product) in filterProducts.product" :key="product.id">
            <div class="card">
              <div class="card-body">
                <span class="fw-bold fs-5">{{product.name}}</span>
                <div class="d-flex py-3">
                  <router-link :to="{name:'TableUpdate', params:{table_id:product.id}}" class="btn btn-sm me-1 btn-warning"><i class="fas fa-edit"></i></router-link>
                  <button class="btn btn-sm btn-danger" @click="deleteProduct(product.id)"><i class="fas fa-trash"></i></button>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
      <div class="w-100 d-flex align-items-center justify-content-center">
        <div>
          <pagination
              :totalPages="pageCount"
              :perPage="perPage"
              :currentPage="currentPage"
              :pages="filterProducts.product"
              @pagechanged="onPageChange"
          />
        </div>
        <!--          <button class="btn btn-primary my-3" @click="loadMore">LoadMore</button>-->
      </div>
    </div>

  </AdminSidebar>
</template>

<script>
// import axios from "axios";

import db from "@/config/FirebaseInit";
import Loading from "@/components/Loading";
import InfoDialog from "@/components/InfoDialog";
import ConfirmDialog from "@/components/ConfirmDialog";
import AdminSidebar from "@/components/AdminSidebar";
import 'lodash/debounce';
import Pagination from "@/components/Pagination"
export default {
  components: {ConfirmDialog, Loading, InfoDialog, AdminSidebar, Pagination},
  data(){
    return{
      //pagination
      currentPage:0,
      perPage:18,
      //end pagination
      filterExportData:[],
      showLowStock:false,
      search:'',
      selectedCategory:'',
      selectedSearchType:'',
      confirmActive:false,
      modalActive:false,
      modalMessage:'',
      loadingActive:false,
      selectedId:'',
      selectedProduct:'',
      frontUnit:'Pcs',
      frontNumber:1,
      limit:50,
      relations:[],
      update_stock:'',
      selectedRelation:'',
      // products:[],
      lastProduct:'',
      loadActive:false,
      lowStockProducts:[],
    }
  },
  computed:{


    offsetCount(){
      return this.currentPage*this.perPage
    },
    currentDateTime(){
      return this.$store.getters.getDateTime;
    },
    currentDay(){
      return this.$store.getters.getDay;
    },
    currentMonth(){
      return this.$store.getters.getMonth;
    },
    originalProducts(){
      return this.$store.getters.getAllProducts
    },
    owner(){
      return this.$store.getters.getShopOwner;
    },
    productCategories(){
      return this.$store.getters.getTableCategories;
    },
    shopInfo(){
      return this.$store.getters.getShopInfo;
    },
    cashierAcc(){
      return this.$store.getters.getCashierAcc;
    },
    products(){
      return this.$store.getters.getAllTables;
    },

    filterProducts(){
      let searchProducts = [];
      if(this.showLowStock){
        let lowStockLists = [];
        for(let i =0; i<this.products.length;i++){
          if(parseInt(this.products[i].stock)<=parseInt(this.shopInfo.lowStock)){
            lowStockLists.push(this.products[i]);
          }
        }
        return {product:lowStockLists.slice(this.offsetCount, this.offsetCount + this.perPage),prodCount:lowStockLists.length};
      }else if (this.search!==''){
        searchProducts = this.products.filter(pd=> pd.name.toLowerCase().includes(this.search.toLowerCase()));
        return {product:searchProducts.slice(this.offsetCount, this.offsetCount + this.perPage), prodCount:searchProducts.length};
      }else if (this.selectedCategory !== 'All'){
        searchProducts = this.products.filter(pd=> pd.category === this.selectedCategory);
        return {product:searchProducts.slice(this.offsetCount, this.offsetCount + this.perPage), prodCount:searchProducts.length};
      }
      else {
        return {product:this.products.slice(this.offsetCount, this.offsetCount + this.perPage), prodCount: this.products.length};
      }
    },
    pageCount(){
      return Math.ceil(this.filterProducts.prodCount/this.perPage)
    },
  },
  async created() {
    this.selectedCategory = this.$route.params.category;
    this.$store.dispatch("getShopInfo",this.owner);
    this.$store.dispatch("getTableCategories", this.owner);

    this.$store.dispatch("fetchAllTables",this.owner);
    this.$store.dispatch("getCashierAcc",this.owner);
  },

  async mounted() {
   this.selectCategory(this.$route.params.category);
  },

  methods:{
    onPageChange(page) {
      console.log(page)
      this.currentPage = page;
    },

   // TODO: delete all product function
   /* async deleteAll(){
     await db.collection('').doc('').collection('').where('day','==','25-Aug-2022').get().then(snapshot=>{
        console.log(snapshot.size)
        snapshot.forEach(doc=>{
          console.log(doc.data().itemName)
          db.collection('').doc('').collection('products').doc(doc.data().id).delete().then(()=>{
            console.log('deleted')
          });
        })
      })
    },*/


    selectCategory(name){
      this.search = "";
      this.selectedCategory = name;
      this.$router.replace({name:'TableList', params:{category:this.selectedCategory}})

    },

    selectProduct(product){
      this.selectedProduct = product;
      db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(product.id).collection('relation').onSnapshot(snapshot=>{
        this.relations = [];
        snapshot.forEach(doc=>{
          this.relations.push(doc.data());
        });
        // console.log(this.relations)
      });
    },

    selectSearchType(type){
      localStorage.setItem('selectedProductSearchType',type);
      if(this.selectedSearchType){
        this.selectedSearchType = localStorage.getItem('selectedProductSearchType');
      }
    },

    viewItemDetails(product){
      this.$router.push({name:'ProductDetail', params:{product_id:product.id}})
    },

    closeModal(){
      this.modalActive = !this.modalActive;
    },

    async confirm(){
      this.confirmActive = !this.confirmActive;
      db.collection(this.owner.city).doc(this.owner.shopId).collection('tables').doc(this.selectedId).delete();
      this.modalActive = true;
      this.modalMessage = 'Deleted Successfully'
    },
    cancel(){
      this.confirmActive = !this.confirmActive;
    },
    deleteProduct(id){
      this.selectedId = id;
      this.modalMessage = 'Are you sure to delete?';
      this.confirmActive = true;
    }
  }

}
</script>

<style scoped>

.header-bar{
  padding-top: 5px;
  background-color: var(--background-color);
}
.card{
  box-shadow:0 0 40px -10px rgba(204, 204, 204, 0.6);
}
.category-box{
  /*z-index: 1000;*/
  /*background-color: var(--side-bar-bg);*/
  display: flex;
  width: 100%;
  position: sticky;
  box-sizing: border-box;
  height: inherit;
  align-items: center;
}
.category-list-active{
  background-color: var(--btnLight) !important;
}
.category-list:hover{
  background-color: var(--primary);
}
.category-box ul{
  width: 100%;
  padding: 5px;
  border-radius: var(--border-radius);
  background-color: var(--side-bar-bg);
  height: inherit;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  box-sizing: border-box;
}
.category-list{
  cursor: pointer;
  border: none !important;
  border-bottom: 1px solid ;
  height: inherit;
  min-width: 60px;
  text-align: center;
  display: inline;
  padding: 5px;
  margin-left: 5px;
  border-radius: var(--border-radius);
  background-color: var(--btnLight);
  transition: 0.3s;
}
.table-card{
  border-radius: var(--border-radius);
  height: 60vh;
  overflow-y: scroll;
}
@media only screen and (max-width: 1030px) {
  .category-box ul{
    width: 98%;
  }

  .header-bar{
    left: 0px;
    margin-top: 20px;
    width: 100%;
  }

  .table-card{
    margin-top: 200px;
  }
}
</style>