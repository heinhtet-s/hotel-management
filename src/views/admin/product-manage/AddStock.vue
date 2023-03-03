<template v-if="currentShop">
 <AdminNavigation>
   <Loading v-if="loadingActive"/>
   <InfoDialog v-if="infoModalActive" :modal-message="modalMessage" v-on:close-modal="closeModal"/>
   <ConfirmDialog :modal-message="modalMessage" v-if="confirmActive" v-on:confirm="confirm" v-on:cancel="cancel"/>

   <div class="container-xxl fixed-top mt-5 pt-2 bg-white">
      <div class="d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center">
          <button class="btn fs-4" @click="$router.back()"><i class="fas fa-chevron-left"></i> {{ currentShop.name }}</button>
        </div>
        <div class="d-flex">
          <button class="btn btn-success btn-sm me-2"  data-bs-toggle="modal" data-bs-target="#exampleModal"> Import Excel</button>
          <router-link :to="{name:'Create', params:{shop_id:$route.params.shop_id}}" class="btn btn-primary btn-sm me-2" >Add New</router-link>

        </div>
      </div>
      <div class="category-box">
        <ul class="text-start d-block list-unstyled border-0 align-center pb-3">
          <li class="d-inline-block mx-1 category-list" :class="selectedCategory==='All'?'category-list-active':''" style="background-color: var(--light);" @click="selectCategory('All')">
            <span class="mx-2"> All</span>
          </li>
          <li v-for="(category, index) in productCategories" style="background-color: var(--light);" :key="index" class="category-list d-inline-block" :class="selectedCategory===category.name?'category-list-active':''" @click="selectCategory( category.name)">
            <span class="mx-2">{{category.name}}</span>
          </li>
        </ul>
      </div>

      <div class="px-1 d-flex justify-content-between">
        <div class="d-flex">
          <div class="form-check form-switch" v-if="currentShop.packageStatus ==='ultra' || currentShop.packageStatus==='premium'">
            <!--              <input class="form-check-input" type="checkbox" :checked="currentShop.showStock === 'yes'" role="switch" @change="showStock" id="flexSwitchCheckDefault">-->
            <label class="form-check-label" for="flexSwitchCheckDefault">{{ $t('message.show_stock_customer') }}</label>
          </div>
        </div>
      </div>
    </div>

    <div class="container-xxl">
      <div class="row mt-5 pt-3">

        <div class="col-12 mx-auto mt-5 pt-4">

          <div class="modal fade" style="z-index: 100000;" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl">
              <div class="modal-content border-0 mt-5" style="background-color: var(--background-color);border-radius: var(--border-radius);">
                <div class="modal-header border-0">
                  <h5 class="modal-title" id="exampleModalLabel">Import Excel products</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" style="height: 70vh; overflow-y: scroll">
                  <div class="d-flex justify-content-between align-items-center">
                    <input type="file" class="form-control w-50" @change="onChangeInput" required>
                    <button class="btn btn-primary" :disabled="excelProducts.length==0" @click="getBarcodeForExcel">Generate Barcode</button>
                  </div>

                  <table class="table mt-3" v-if="excelProducts!==''">
                    <thead>
                    <tr>
                      <th>Barcode</th>
                      <th>Name</th>
                      <th>Buy Price</th>
                      <th>Sell Price</th>
                      <th>Stock</th>
                      <th>Type</th>
                      <th>Size</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(product,index) in excelProducts" :key="index">
                      <td>{{product.barcode}}</td>
                      <td>{{product.itemName}}</td>
                      <td>{{product.buyPrice}}</td>
                      <td>{{product.sellPrice}}</td>
                      <td>{{product.stock}}</td>
                      <td>{{product.type}}</td>
                      <td>{{product.size}}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>

                <div class="modal-footer border-0">
                  <button type="button" :disabled="excelProducts.length==0" class="btn btn-primary" data-bs-dismiss="modal" @click="extractExcel">Import Data</button>
                </div>
              </div>
            </div>
          </div>
          <div class="w-25 mt-5 mx-auto">
            <input type="text" v-model="search" :placeholder="$t('message.search')" class="form-control mb-3 mx-2 ">
          </div>
          <div style="height: 60vh;overflow-y: scroll;" class="table-responsive">
            <table class="table table-hover table-bordered">
              <thead>
              <tr>
                <th class="text-nowrap">#</th>
                <th class="text-nowrap" style="width: 50px;">{{ $t('message.barcode') }}</th>
                <th class="text-nowrap">{{ $t('message.itemName') }}</th>
                <th class="text-nowrap">{{ $t('message.photo') }}</th>
                <th class="text-nowrap">{{ $t('message.type') }}</th>
                <th class="text-nowrap">{{ $t('message.buy_price') }}</th>
                <th class="text-nowrap">{{ $t('message.sell_price') }}</th>
                <th class="text-nowrap">{{ $t('message.stock') }}</th>
                <th class="text-nowrap">{{ $t('message.brand') }}</th>
              </tr>
              </thead>
              <tbody >
              <tr v-for="(product,index) in filterProducts.product" class="align-middle" :key="product.id">
                <td class="text-nowrap">{{index+1}}</td>
                <td class="text-nowrap" style="width: 50px;">{{product.barcode}}</td>
                <td class="text-truncate" style="max-width: 200px">{{product.itemName}}</td>
                <td class="text-nowrap">
                  <img :src="product.images[0]" v-if="product.images.length>0" class="rounded border border-light border-3 shadow-sm" style="width:50px; height:50px; object-fit: cover;" alt="">
                  <img src="../../../assets/flash/1.png" v-else class="rounded border border-light border-3 shadow-sm" style="width:50px; height:50px; object-fit: cover;" alt="">
                </td>
                <td class="text-nowrap">{{product.type}}</td>
                <td class="text-nowrap">{{product.buyPrice}}</td>
                <td class="text-nowrap">{{product.sellPrice}}</td>
                <td class="text-nowrap">{{product.stock}}</td>
              </tr>
              </tbody>
            </table>

          </div>
          <div class="w-100 pt-2 d-flex align-items-center justify-content-center">
            <pagination
                :totalPages="pageCount"
                :perPage="perPage"
                :currentPage="currentPage"
                :pages="filterProducts.product"
                @pagechanged="onPageChange"
            />
            <!--            <button class="btn btn-primary my-3" @click="loadMore">LoadMore</button>-->
          </div>
        </div>
      </div>

    </div>
  </AdminNavigation>

</template>

<script>
import db, {timestamp} from "@/config/FirebaseInit";
import ConfirmDialog from "@/components/ConfirmDialog";
import InfoDialog from "@/components/InfoDialog";
import Loading from "@/components/Loading";
import AdminNavigation from "@/components/AdminNavigation";
import * as XLSX from "xlsx";
import Pagination from "@/components/Pagination";
// import {debounce} from "lodash";
export default {
  components: {AdminNavigation, Loading, ConfirmDialog, InfoDialog, Pagination},
  data(){

    return{
      loadingActive:false,
      infoModalActive:false,
      modalMessage:'',
      confirmActive:false,
      file:'',
      currentShop:'',
      search:'',
      // products:[],
      limit:50,
      selectedSearchType:'barcode',
      lastProduct:'',
      excelProducts:[],
      searchProducts:[],
      selectedCategory:'All',
      //pagination
      currentPage:0,
      perPage:20,
      //end pagination
    }
  },
  computed:{
    pageCount(){
      return Math.ceil(this.filterProducts.prodCount/this.perPage)
    },

    offsetCount(){
      return this.currentPage*this.perPage
    },

    currentDateTime(){
      return this.$store.getters.getDateTime;
    },
    productCategories(){
      return this.$store.getters.getProductCategories;
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
    products(){
      return this.$store.getters.getAllProducts;
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
        searchProducts = this.products.filter(pd=> pd.itemName.toLowerCase().includes(this.search.toLowerCase()) || pd.barcode.toLowerCase().includes(this.search.toLowerCase()));
        return {product:searchProducts.slice(this.offsetCount, this.offsetCount + this.perPage), prodCount:searchProducts.length};
      }else if (this.selectedCategory !== 'All'){
        searchProducts = this.products.filter(pd=> pd.type === this.selectedCategory);
        return {product:searchProducts.slice(this.offsetCount, this.offsetCount + this.perPage), prodCount:searchProducts.length};
      }
      else {
        return {product:this.products.slice(this.offsetCount, this.offsetCount + this.perPage), prodCount: this.products.length};
      }
    },

  },
  async mounted() {
    this.$store.dispatch("getDateTime");
    this.$store.dispatch("getDay");
    this.$store.dispatch("getMonth");
    this.$store.dispatch("getYear");
    await db.collection('shopRegistration').doc(this.$route.params.shop_id).get().then((result)=>{
      this.currentShop = result.data();
      console.log(this.currentShop);
      this.$store.dispatch("getProductCategories",this.currentShop);
      this.$store.dispatch("getAllProducts",this.currentShop);
    });

  },
  methods:{
    onPageChange(page) {
      console.log(page)
      this.currentPage = page;
    },
    selectCategory(name){
      this.selectedCategory = name;

    },

    selectSearchType(type){
      this.selectedSearchType = type;
    },
    checkDetail(id){
      this.$router.push({name:"Detail", params:{shop_id:this.currentShop.id, product_id:id}})
    },
    confirm(){
      this.loadingActive = true;
      this.confirmActive = !this.confirmActive;
    },
    cancel(){
      this.confirmActive = !this.confirmActive;
    },
    closeModal(){
      this.infoModalActive = !this.infoModalActive;
    },

    onChangeInput(e){
      let files = e.target.files, f = files[0];
      let reader = new FileReader();

      reader.onload=(e)=> {
        let data = new Uint8Array(e.target.result);
        let workbook = XLSX.read(data, {type: 'array'});
        let sheetName = workbook.SheetNames[0]
        /* DO SOMETHING WITH workbook HERE */
        console.log('workbook', workbook);
        let worksheet = workbook.Sheets[sheetName];
        this.excelProducts = XLSX.utils.sheet_to_json(worksheet);
      };
      reader.readAsArrayBuffer(f);

    },

    getRandomStr(){
      const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let result = '';
      for ( let i = 0; i < 8; i++ ) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    },

    getBarcodeForExcel(){
      this.excelProducts.forEach(p=>{
        p.barcode=this.currentShop.shopCode+this.getRandomStr();
      });
    },

    //TODO: excel import
    extractExcel(){
      this.loadingActive = true;
      console.log(this.excelProducts)
      this.excelProducts.forEach(async (product,index)=>{
        let productRef =await db.collection(this.currentShop.city).doc(this.currentShop.shopId).collection('products').doc();
        await productRef.set(
            {
              barcode: product.barcode.toString(),
              buyPrice: product.buyPrice.toString(),
              youtubeLink:"",
              time: timestamp,
              day: this.currentDay,
              description: "",
              discount: "0",
              expireDate:"",
              id: productRef.id,
              images:[],
              itemCode: product.barcode+"",
              itemName: product.itemName+"",
              month:this.currentMonth,
              dateTime:this.currentDateTime,
              rating: "",
              sellPrice: product.sellPrice+"",
              size: product.size+"",
              stock: product.stock+"",
              type: product.type+"",
              weight: "",
              brand:"Nothing",
              color: "All",
              year: this.currentYear
            }
        );
        console.log('Added Product', this.excelProducts.length,'==', index)
        if(index+1 === this.excelProducts.length){
          this.loadingActive = false;
          this.infoModalActive = true;
          this.modalMessage = "Added Successfully";
        }
      })
    },


  }
}
</script>

<style scoped>
.category-box{
  /*z-index: 1000;*/
  background-color: var(--white);
  display: flex;
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
  margin-left: 5px;
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
td{
  min-width: 30%;
}
</style>
