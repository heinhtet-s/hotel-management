<template>
  <Loading v-if="loadingActive"/>
  <InfoDialog v-if="modalActive" :modal-message="modalMessage" v-on:close-modal="closeModal"/>
  <confirm-dialog :modal-message="modalMessage" v-if="confirmActive" v-on:confirm="confirm" v-on:cancel="cancel"/>
  <div class="container-fluid" style="background-color: var(--background-color);color: var(--text-color);">
    <div class="row">
      <div class="col-lg-2 p-0">
        <AdminSidebar />
      </div>
      <div class="col-12 col-lg-10" v-if="shopInfo.packageStatus === 'ultra'|| shopInfo.packageStatus==='pro'">
        <!-- Modal -->
        <div class="modal fade" v-if="branches.length>0" style="z-index: 10000;" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0" style="background-color: var(--background-color); border-radius: var(--border-radius);">
              <div class="modal-header border-0">
                <h5 class="modal-title" id="exampleModalLabel">Transfer</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                 <div class="row">
                   <div class="col-12" v-if="selectedProduct">
                     <div class="card p-2" style="background-color: var(--light) !important;">
                       <img :src="selectedProduct.images[0]" class="mx-auto" width="200" height="200" style="border-radius: var(--border-radius)" alt="">
                       <div class="d-flex flex-column text-start">
                         <span class="fs-4 text-center">{{selectedProduct.itemName}}</span>
                         <span class="fs-6">Item Code: {{selectedProduct.itemCode}}</span>
                         <span>{{selectedProduct.stock}} Pcs</span>
                         <div class="d-flex justify-content-between">
                           <div>
                             <span class="text-success">Buy Price</span>
                             <p>{{selectedProduct.buyPrice}} Ks</p>
                           </div>
                           <div>
                             <span class="text-warning">Sell Price</span>
                             <p>{{selectedProduct.sellPrice}} Ks</p>
                           </div>
                         </div>

                       </div>

                     </div>
                     <div class="form-floating mb-3 mx-1" v-if="selectedProduct.stock!==''">
                       <input type="number" class="form-control" id="transfer-stock" v-model="transferStock" placeholder="enter stock ">
                       <label for="transfer-stock">Transfer Stock</label>
                     </div>
                   </div>
                 </div>

              </div>
              <div class="modal-footer border-0 justify-content-center">
                <button type="button" class="btn w-50 text-white" style="background-color: var(--primary);" data-bs-dismiss="modal" @click="selectProductWithCount()">Confirm</button>
              </div>
            </div>
          </div>
        </div>

        <div class="modal fade" style="z-index: 10000;" id="exampleModal2" tabindex="-1" aria-labelledby="exampleModal2Label" aria-hidden="true">
          <div class="modal-dialog" >
            <div class="modal-content border-0" style="background-color: var(--background-color); border-radius: var(--border-radius)!important;">
              <div class="modal-header border-0">
                <h5 class="modal-title " id="exampleModal2Label">Transfer Lists</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body" style="height: 70vh; overflow-y: scroll;">
                <h4 class="text-center">Are your sure to send?</h4>

              <div class="d-flex flex-column">
                <div v-for="(temp, index) in transferTempList" class="d-flex justify-content-between p-1 mb-1" style="background-color: var(--light); border-radius: var(--border-radius);" :key="index">
                  <div class="d-flex align-items-center">
                    <button class="btn btn-sm text-danger border-end border-2 me-1" style="border-radius: 0px !important;" @click="removeTemp(temp.id)" ><i class="fas fa-trash"></i></button>
                    <span>{{index+1}}.</span><span class="ms-2 w-75">{{temp.name}}</span>
                  </div>
                  <input type="text" class="form-control w-25" :hidden="temp.count===''" v-model="temp.count">
                </div>
<!--                <ul class="w-75 list-unstyled">
                  <li class="p-1 m-1 " style="background-color: var(&#45;&#45;side-bar-bg);height: 50px; border-radius: var(&#45;&#45;border-radius);" v-for="(name,index) in transfer.productNameList" :key="index">{{name}}</li>
                </ul>
                <ul class="w-25 list-unstyled ">
                  <li class="p-1 m-1" style="background-color: var(&#45;&#45;side-bar-bg);height: 50px;border-radius: var(&#45;&#45;border-radius);" v-for="(count,index) in transfer.countList" :key="index">{{count}}</li>
                </ul>-->
              </div>

              </div>
              <div class="modal-footer border-0 justify-content-center align-items-center">
                <button type="button w-50" class="btn text-light w-50" :disabled="transferTempList.length===0" style="background-color: var(--primary);" @click="sendProduct" data-bs-dismiss="modal" data-bs-target="#exampleModal2">Send Now</button>
              </div>
            </div>
          </div>
        </div>


        <div class="position-fixed header-bar p-1 shadow-sm">
          <div class="d-flex flex-lg-row flex-column align-center justify-content-between rounded mt-4 mb-2">
            <div class="d-flex rounded align-items-center justify-content-between">
              <div class="d-flex align-items-center">
                <button @click="$router.back()" class="btn" style="color: var(--text-color);"><i class="fas fa-chevron-left"> </i></button>
                <router-link class="text-decoration-none fs-5" style="color: var(--text-color);" :class="$route.name==='WarehouseManagement'?'activeRoute':''" :to="{name:'WarehouseManagement'}">Warehouse</router-link>
                <span class="mx-1" style="color: var(--primary);">|</span>
                <router-link class="text-decoration-none fs-5" style="color: var(--text-color);" :class="$route.name==='TransferRecord'?'activeRoute':''" :to="{name:'TransferRecord'}">Transfer History</router-link>
              </div>
            </div>
            <div class="d-flex flex-column flex-lg-row justify-content-lg-between">
              <div class="d-flex flex-lg-row flex-column">
                <div class="align-items-center mx-1">
                  <div class="d-flex my-1 rounded align-items-center p-1 search-box ">
                    <div class="p-1 text-nowrap me-1" style="background-color: var(--side-bar-bg);width:50px;border-radius: var(--border-radius);"><i class="fas fa-warehouse"></i>To</div>
                    <button style="cursor: pointer" @click="toBranchInputToggle" class="border-0 p-1 form-control form-select text-start">{{receivedBranch.name||'choose branch'}}</button>
                  </div>
                  <div class="to-pop-up shadow-sm p-2 "  v-if="toBranchToggleClick" >
                    <div class="d-flex justify-content-between fw-bold align-items-center">
                      <span>Select Branch</span>
                      <button class="btn" style="color:var(--text-color);" @click="this.toBranchToggleClick = !this.toBranchToggleClick"><i class="fas fa-times"></i></button>

                    </div>
                    <li v-for="(rBranch, index) in branches" :key="index" :class="rBranch.id === transferBranch.id?'d-none':''" class=" my-1 list-unstyled rounded p-1 text-start" @click="selectReceivedBranch(rBranch)">
                      <div class="d-flex justify-content-between">
                        <span class="text-truncate text-nowrap">{{rBranch.name}}</span>
                      </div>
                    </li>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="category-box d-lg-flex justify-content-between">
            <ul class="text-start d-block list-unstyled border-0 align-center">
              <li class="d-inline-block mx-1 category-list" :class="selectedCategory==='All'?'category-list-active':''" style="background-color: var(--light);" @click="selectedCategory = 'All'">
                <span class="mx-2"> All</span>
              </li>

              <li v-for="(category, index) in selectedBranchCategories" style="background-color: var(--light);" :key="index" class="category-list d-inline-block" :class="selectedCategory===category.name?'category-list-active':''" @click="selectedCategory = category.name">
                <span class="mx-2">{{category.name}}</span>
              </li>
            </ul>
          </div>
          <div class="d-flex justify-content-between">
            <div class="d-flex rounded align-items-center search-box mt-1">
              <div class="m-1">
                <i class="fas fa-search"></i>
              </div>
              <input type="text" v-model="search" placeholder="search..." class="form-control border-0" style="background-color: var(--background-color)!important;">
            </div>
            <div class="d-flex rounded align-items-center mt-1" v-if="receivedBranch!==''">
              <button class="btn btn-sm ms-1 btn-success" :disabled="!transferTempList.length>0" data-bs-toggle="modal" data-bs-target="#exampleModal2" ><span class="badge bg-white text-black rounded-circle me-1">{{transferTempList.length}}</span>Transfer <i class="fas fa-share"></i></button>
            </div>
          </div>


        </div>
        <div class="card-body px-0 table-card table-responsive">

          <table class="table table-hover table-bordered">
            <thead>
            <tr>
              <th class="text-nowrap">#</th>
              <th class="text-nowrap">Item Code</th>
              <th class="text-nowrap">Name</th>
              <th class="text-nowrap">Photos</th>
              <th class="text-nowrap">Buy Price</th>
              <th class="text-nowrap">Sell Price</th>
              <th class="text-nowrap">Stocks</th>
              <th class="text-nowrap d-none">Control</th>
              <th >Select</th>
<!--              <th v-if="shopInfo.branch==='main' && $route.params.branch_id!==shopInfo.id">Control</th>-->
            </tr>
            </thead>
            <tbody>

            <tr v-for="(product,index) in filterProducts.product" class="align-middle" :key="product.id" :class="transferTempList.some(a=>a.id === product.id)?'tr-select':''">
<!--              <td v-if="receivedBranch!==''">-->
<!--                <button class="btn" @click="selectProduct($event,product)" :data-bs-toggle="!product.selected?'modal':''" data-bs-target="#exampleModal" id="flexCheckDefault">-->
<!--              </td>-->

              <td class="text-nowrap">{{index+1}}</td>
              <td class="text-nowrap">{{product.itemCode}}</td>
              <td class="text-wrap">{{product.itemName}}</td>
              <td class="text-nowrap">
                <img :src="product.images[0]" v-if="product.images.length>0" class="rounded border border-light border-3 shadow-sm" style="width:50px; height:50px; object-fit: cover;" alt="">
                <img src="../../assets/flash/1.png" v-else class="rounded border border-light border-3 shadow-sm" style="width:50px; height:50px; object-fit: cover;" alt="">
              </td>
              <td class="text-nowrap">{{product.buyPrice}} Ks</td>
              <td class="text-nowrap">{{product.sellPrice}} Ks</td>
              <td class="text-nowrap" :class="showLowStock?'text-danger':''">{{product.stock}}</td>
              <td class="text-nowrap d-none">
                <div>
                  <router-link class="btn btn-sm btn-primary" :to="{name:'WarehouseProductDetail',params:{branch_city:$route.params.branch_city,branch_id:$route.params.branch_id,product_id:product.id}}"><i class="fas fa-info-circle"></i></router-link>
                  <button class="btn btn-sm ms-1 btn-success" v-if="receivedBranch!==''" @click="selectTransferProduct(product)" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class="fas fa-share"></i>Transfer</button>
                </div>
              </td>
              <td>
                <button class="btn btn-primary" @click="selectProduct($event,product)" :disabled="transferTempList.some(a=>a.id === product.id)" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class="fas fa-plus-circle"></i></button>
              </td>
            </tr>
            </tbody>
          </table>
          <div>
            <pagination
                :totalPages="pageCount"
                :perPage="perPage"
                :currentPage="currentPage"
                :pages="filterProducts.product"
                @pagechanged="onPageChange"
            />
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import axios from "axios";

import db, {timestamp} from "../../config/FirebaseInit";
import Loading from "../..//components/Loading";
import InfoDialog from "../../components/InfoDialog";
import ConfirmDialog from "@/components/ConfirmDialog";
import AdminSidebar from "@/components/AdminSidebar";
import Pagination from "@/components/Pagination";
export default {
  components: {ConfirmDialog, Loading, InfoDialog, AdminSidebar, Pagination},
  data(){
    return{
      //pagination
      currentPage:0,
      perPage:15,
      //end pagination
      fromBranchToggleClick:false,
      toBranchToggleClick:false,
      showLowStock:false,
      search:'',
      selectedCategory:'All',
      confirmActive:false,
      modalActive:false,
      modalMessage:'',
      loadingActive:false,
      selectedId:'',
      selectedBranch:'',
      selectedBranchProducts:[],
      selectedBranchCategories:[],
      selectedProduct:'',
      branches:[],
      showControl:false,

      transferBranch:'',
      // receivedBranch:'',
      transferStock:0,
      transferToggleClick:false,
      productIdList:[],
      countList:[],
      productNameList: [],
      selectedTempCount:'',
      // transferTempList:[],
      transferTemp:{
        name:'',
        count:'',
        id:'',
      },
      transfer:{
        productIdList:[],
        productNameList:[],
        countList:[],
        id:'',
        shopCity:'',
        shopId:'',
        shopName:'',
        day:'',
        month:'',
        year:'',
        dateTime:'',
        time:'',
        status:'',
        transferStatus:'',
      },
    }
  },
  computed:{
    receivedBranch(){
      return this.$store.getters.getReceivedBranch
    },
    transferTempList(){
      return this.$store.getters.getTransferTempList
    },
    pageCount(){
      return Math.ceil(this.filterProducts.prodCount/this.perPage)
    },
    offsetCount(){
      return this.currentPage*this.perPage
    },
    owner(){
      return this.$store.getters.getShopOwner;
    },
    shopInfo(){
      return this.$store.getters.getShopInfo;
    },
    products(){

      if(this.selectedCategory!=='All'){
        return this.selectedBranchProducts.filter((product) => product.type === this.selectedCategory);
      }else{
        return this.selectedBranchProducts;
      }
    },
    filterProducts(){
      /*if(this.search!==""){
        return this.products.filter((parcel)=>{
          return parcel.itemName.toLocaleLowerCase().includes(this.search.toLocaleLowerCase()) || parcel.barcode.includes(this.search) || parcel.itemCode.includes(this.search);
        });
      }else if(this.showLowStock){
        return this.products.filter((parcel)=>{
          return parseInt(parcel.stock) <= parseInt(this.selectedBranch.lowStock);
        });
      }
      else {
        return this.products;
      }*/
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
        searchProducts = this.products.filter(pd=> pd.itemName.toLowerCase().includes(this.search.toLowerCase()) || pd.barcode.toLowerCase().includes(this.search.toLowerCase()) || pd.itemCode.toLowerCase().includes(this.search.toLowerCase()));
        return {product:searchProducts.slice(this.offsetCount, this.offsetCount + this.perPage), prodCount:searchProducts.length};
      }else if (this.selectedCategory !== 'All'){
        searchProducts = this.products.filter(pd=> pd.type === this.selectedCategory);
        return {product:searchProducts.slice(this.offsetCount, this.offsetCount + this.perPage), prodCount:searchProducts.length};
      }
      else {
        return {product:this.products.slice(this.offsetCount, this.offsetCount + this.perPage), prodCount: this.products.length};
      }
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
    currentYear(){
      return this.$store.getters.getYear;
    }
  },

  async mounted() {
    this.$store.dispatch("getDateTime");
    this.$store.dispatch("getDay");
    this.$store.dispatch("getMonth");
    this.$store.dispatch("getYear");
    this.$store.dispatch("getProductCategories", this.owner);
    this.$store.dispatch("getShopInfo",this.owner);
    this.$store.dispatch("getAllProducts",this.owner);

    await this.getBranches();
    /*await db.collection(this.$route.params.branch_city).doc(this.$route.params.branch_id).onSnapshot(snapshot => {
      console.log(snapshot.data())
      this.transferBranch = snapshot.data();
    })*/
    await this.getSelectedProducts(this.shopInfo.city, this.shopInfo.id);
    await this.getSelectedCategories(this.shopInfo.city, this.shopInfo.id);
  },

  methods:{
    onPageChange(page) {
      console.log(page)
      this.currentPage = page;
    },

    removeTemp(id){
      console.log(id);
      let productIndex = this.selectedBranchProducts.findIndex(product=>product.id === id);
      this.selectedBranchProducts[productIndex].selected = false;
      let index = this.transferTempList.findIndex(transfer=>transfer.id === id);
      this.$store.commit("REMOVE_TRANSFER_TEMP", index)
      // this.transferTempList.splice(index, 1);
      console.log(this.transferTempList);
    },

    cancel(){
      this.confirmActive = !this.confirmActive;

    },
    selectProduct(e,product){
      // product.selected = true;
      this.selectedProduct = product;
      console.log(this.selectedProduct);
      // if(e.target.checked){
      //
      //   // this.transferTempList.push();
      // }
      // else {
      //   product.selected = false;
      //   let index = this.transferTempList.findIndex(transfer=>transfer.id === product.id);
      //   // this.transferTempList.splice(index, 1);
      //   this.$store.commit("REMOVE_TRANSFER_TEMP", index)
      // }
      console.log('transfer temp', this.transferTempList);
    },
    selectProductWithCount(){
      let count = '';
      if(this.selectedProduct.stock === ''){
        count = ''
      }else {
        count = this.transferStock.toString()
      }
      let payload = {
        'name':this.selectedProduct.itemName,
        'id':this.selectedProduct.id,
        'count':count
      }
      this.$store.commit('SET_TRANSFER_TEMP_LISTS',payload)

     /* let index = this.transferTempList.findIndex(transfer=>transfer.id === this.selectedProduct.id);

      if(this.selectedProduct.stock!==''){
        this.transferTempList[index].count = this.transferStock.toString();
        this.transferStock =0;
      }else {
        this.selectedProduct.stock = '';
        this.transferTempList[index].count = '';
      }
      console.log('transfer temp', this.transferTempList);*/
    },

    selectReceivedBranch(branch){
      this.toBranchToggleClick = ! this.toBranchToggleClick;
      this.$store.commit('SET_RECEIVED_BRANCH', branch);
      // this.receivedBranch = branch;
    },

    selectTransferProduct(product){
      this.selectedProduct = product;
    },
    sendProduct(){
      this.loadingActive = true;
      this.transfer.day = this.currentDay;
      this.transfer.dateTime = this.currentDateTime;
      this.transfer.month = this.currentMonth;
      this.transfer.time = timestamp;
      this.transfer.year = this.currentYear;
      this.transfer.transferStatus = 'pending';
      this.transferTempList.forEach(doc=>{
        this.transfer.productIdList.push(doc.id);
        this.transfer.productNameList.push(doc.name);
        this.transfer.countList.push(doc.count.toString());
      })
      // console.log(this.transfer);
      let transferToRef =  db.collection(this.receivedBranch.city).doc(this.receivedBranch.id).collection('transfer').doc();
      this.transfer.id=transferToRef.id;
      this.transfer.status = 'received';
      this.transfer.shopId = this.shopInfo.id;
      this.transfer.shopName = this.shopInfo.name;
      this.transfer.shopCity = this.shopInfo.city;
      transferToRef.set(this.transfer).then(()=>{
        console.log('arrived')
        let sendFromRef = db.collection(this.shopInfo.city).doc(this.shopInfo.id).collection('transfer').doc(transferToRef.id);
        this.transfer.status = 'sent';
        this.transfer.shopId = this.receivedBranch.id;
        this.transfer.shopName = this.receivedBranch.name;
        this.transfer.shopCity = this.receivedBranch.city;
        sendFromRef.set(this.transfer).then(()=>{
          console.log('sent')
          this.loadingActive = false;
          this.countList = [];
          this.productNameList =[];
          this.productIdList =[];
          this.$store.commit('CLEAR_TRANSFER_TEMP_LIST')
          this.$store.commit("CLEAR_RECEIVED_BRANCH")
          this.transfer='';
          this.modalActive = true;
          this.modalMessage='Transfer Success';
          this.$router.push({name:'TransferRecord'});
        })
      });
    },
    closeModal(){
      this.modalActive = !this.modalActive;
    },
    fromBranchInputToggle(){
      this.fromBranchToggleClick = !this.fromBranchToggleClick;
      this.toBranchToggleClick = false;
    },
    toBranchInputToggle(){
      this.toBranchToggleClick = !this.toBranchToggleClick;
      this.fromBranchToggleClick = false;
    },

    getBranches(){
      this.shopInfo.listBranch.map((branch_id,index)=>{
        console.log(branch_id, this.shopInfo.branchCity[index]);
        db.collection(this.shopInfo.branchCity[index]).doc(branch_id).onSnapshot(snapshot => {
          console.log(snapshot.data())
          this.branches.push(snapshot.data())
        })
      })
    },
    async getSelectedProducts(city, id){
      console.log(city, id);
      await db.collection(city).doc(id).collection('products').onSnapshot(snapshot => {
        this.selectedBranchProducts=[];
        this.products=[];
        this.filterProducts=[];
        snapshot.forEach(doc=>{
            this.selectedBranchProducts.push({'selected':false,...doc.data()})
        })
      })
    },
    async getSelectedCategories(city,id){
      console.log(city,id);
      await db.collection(city).doc(id).collection('category').onSnapshot(snapshot => {
        this.selectedBranchCategories=[];

        snapshot.forEach(doc=>{
          if(doc.data().name!=='All'){
            this.selectedBranchCategories.push(doc.data())
          }

        })

      })
    }

  }

}
</script>

<style scoped>
.search-box{
  padding:5px;
  width:250px;
  background-color: var(--light);
  border-radius: var(--border-radius) !important;
}
.from-pop-up{
  z-index: 3000;
  background-color: var(--side-bar-bg);
  border: 2px solid white;
  position: absolute;
  overflow-y: scroll;
  height: 300px;
  width: 250px;
  border-radius: var(--border-radius) !important;
  padding-bottom: 50px;
  top: 100px;
}
.to-pop-up{
  z-index: 3000;
  background-color: var(--white);
  border: 2px solid white;
  position: absolute;
  overflow-y: scroll;
  height: 300px;
  width: 250px;
  border-radius: var(--border-radius) !important;
  padding-bottom: 50px;
  top: 70px;
}
.session-pop-up2{
  z-index: 3000;
  background-color: var(--side-bar-bg);
  border: 2px solid white;
  position: absolute;
  overflow-y: scroll;
  width: 370px;
  height: 200px;
  border-radius: var(--border-radius) !important;
  padding-bottom: 50px;
  top: 170px;
}
.tr-select{
  background-color: var(--side-bar-bg) !important;
}
li{
  cursor: pointer;
  background-color: var(--light);
}
li:hover{
  background-color: var(--softPrimary) !important;
}
.header-bar{
  background-color: var(--background-color);
  top:20px;
  width: 82%;
  z-index: 1000;
}
tr{
  cursor: pointer;
  color: var(--text-color) !important;
}
.category-box{
  padding: 5px;
  z-index: 2000;
  background-color: var(--side-bar-bg);
  border-radius: var(--border-radius);
  position: sticky;
  box-sizing: border-box;
  margin-top:5px;
  margin-left: 0px;
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
  margin-top: 4px;
  margin-bottom: 4px;
  margin-left: 5px;
  border-radius: var(--border-radius);
  background-color: var(--btnLight);
  transition: 0.3s;
}
.table-card{
  margin-top: 250px;
}
.activeRoute{
  border-bottom: 2px solid var(--primary);
}
@media only screen and (max-width: 1030px) {

  .header-bar{
    left: 0px;
    margin-top: 20px;
    width: 100%;
  }

  .search-box{
    width: 100%;
  }
  .table-card{
    margin-top: 320px;
  }
  .from-pop-up, .to-pop-up {
    top: 140px;
    width: 98%;
    right: 5px;
  }
  .to-pop-up {
    top: 130px;
    width: 98%;
    right: 5px;
  }

}
</style>