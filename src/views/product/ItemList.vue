<template>
 
  <AdminSidebar>
    <Loading v-if="loadingActive"/>
  <InfoDialog v-if="modalActive" :modal-message="modalMessage" v-on:close-modal="closeModal"/>
  <confirm-dialog :modal-message="modalMessage" v-if="confirmActive" v-on:confirm="confirm" v-on:cancel="cancel"/>

  
    <div class="">

      <!-- stock Modal -->
      <div class="modal fade" style="z-index: 30000;" id="stockModal"  tabindex="-1" aria-labelledby="stockModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-body">
              <p class="text-center fs-5">{{$t('message.add_stock')}}</p>
              <div class="d-flex py-3 align-items-center justify-content-between">
                <span class="fs-5 text-truncate">{{selectedProduct.itemName}}</span>
                <span class="badge bg-success rounded-pill">Stock: {{selectedProduct.stock}} Pcs</span>
              </div>
              <span v-if="frontUnit!=='Pcs'">1 {{frontUnit}} = {{selectedRelation.backNumber}} Pcs</span>
              <!--          <input type="number" class="form-control " placeholder="Count" v-model="update_stock">-->
              <form @submit.prevent="updateStock">
                <div class="d-flex">
                  <input type="number" class="form-control me-2" required v-model="frontNumber" min="1">
                  <select class="form-select fs-6 form-control form-select-lg rounded" required @change="getSelectedRelation" style="height: 50px;background-color:var(--side-bar-bg)!important;border-radius: var(--border-radius) !important;"  v-model="frontUnit" aria-label=".form-select-sm example">
                    <option value="Pcs">Pcs</option>
                    <option :value="relation.frontUnit" v-for="(relation, index) in relations" :key="index">{{ relation.frontUnit }}</option>
                  </select>
                </div>
                <div class="modal-footer d-flex justify-content-between">
                  <button type="button" class="btn text-danger" data-bs-dismiss="modal" @click.prevent="update_stock=''">{{$t('message.cancel')}}</button>
                  <button type="submit" class="btn text-white" style="background-color: var(--primary)!important;" data-bs-dismiss="modal">{{ $t('message.confirm') }}</button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>

      <!-- Excel Modal -->
      <div class="modal fade" style="z-index: 3000;" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
          <div class="modal-content border-0 mt-5" style="background-color: var(--background-color);border-radius: var(--border-radius);">
            <div class="modal-header border-0">
              <h5 class="modal-title" id="exampleModalLabel">Import Excel products</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" style="height: 70vh; overflow-y: scroll">
              <input type="file" class="form-control w-50" @change="onChangeInput" required>
              <button class="btn btn-primary" @click="getBarcodeForExcel">Generate Barcode</button>

              <table class="table  mt-3" v-if="excelProducts!==''">
                <thead>
                <tr>
                  <th>Id</th>
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
                  <td>{{index+1}}</td>
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
              <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="extractExcel">Import Data</button>
            </div>
          </div>
        </div>
      </div>

      <div class="header-bar">
        <div class="d-flex align-items-center justify-content-between rounded mb-2">
          <div class="d-flex rounded align-items-center mt-2">
            <button @click="$router.back()" class="btn me-2 float-start" style="color: var(--text-color);"><i class="fas fa-chevron-left"> </i></button>
            <span class="fs-4">{{$t('message.products')}} </span>
            <span class="badge bg-warning rounded-pill"> {{filterProducts.prodCount}}</span>
            <!-- <span class="badge bg-warning rounded-pill" v-else> {{searchProducts.length}}</span>-->
          </div>
          <vue-excel-xlsx
              :data="filterExportProducts"
              :columns="columns"
              :file-name="'product'"
              :file-type="'xlsx'"
              :sheet-name="currentDay"
              class="btn btn-success btn-sm ms-2 d-flex align-items-center border-success border-2"
          >
            <i class="fas fa-file-excel"></i><span class="ms-1">Ground Stock</span>
          </vue-excel-xlsx>

        </div>

        <div class="category-box d-lg-flex justify-content-between align-items-center">
          <ul class="text-start d-block list-unstyled border-0 py-3 align-center">
            <li class="d-inline-block mx-1 category-list" :class="selectedCategory==='All'?'category-list-active':''"  @click="selectCategory('All')">
              <span class="mx-2"> All</span>
            </li>
            <li v-for="(category, index) in filterCategories" style="background-color: var(--light);" :key="index" class="category-list d-inline-block" :class="selectedCategory===category.name?'category-list-active':''" @click="selectCategory( category.name)">
              <span class="mx-2">{{category.name}}</span>
            </li>
          </ul>
          <div>
            <router-link :to="{name:'ProductCreate',params:{category:$route.params.category}}" class="btn btn-lg ms-2 mb-3" style="color: var(--text-color);background-color: var(--btnLight);"><i class="fas fa-plus-circle"></i></router-link>
          </div>

        </div>


        <div class="px-1 d-flex justify-content-between">
          <div class="d-flex">
            <div class="form-check form-switch" v-if="shopInfo.packageStatus ==='ultra' || shopInfo.packageStatus==='premium'">
              <input class="form-check-input" type="checkbox" :checked="shopInfo.showStock === 'yes'" role="switch" @change="showStock" id="flexSwitchCheckDefault">
              <label class="form-check-label" for="flexSwitchCheckDefault">{{ $t('message.show_stock_customer') }}</label>
            </div>
            <div class="form-check form-switch ms-2">
              <!--                 -->
              <input class="form-check-input" type="checkbox" role="switch" @click="this.showLowStock = !this.showLowStock" id="flexSwitchCheckDefault">
              <label class="form-check-label" for="flexSwitchCheckDefault">{{ $t('message.low_stock_products') }}</label>
            </div>
          </div>
          <div class="">
            <!--              <div class="dropdown">
                            <button class="btn dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                              <i class="fas fa-filter"></i>
                              <span v-if="selectedSearchType === 'itemCode'">{{$t('message.itemCode')}}</span>
                              <span v-if="selectedSearchType === 'barcode'">{{$t('message.barcode')}}</span>
                              <span v-if="selectedSearchType === 'itemName'">{{$t('message.itemName')}}</span>
                            </button>
                            <ul class="dropdown-menu" style="z-index: 5000;" aria-labelledby="dropdownMenuButton1">
                              <li><a class="dropdown-item" @click="selectSearchType('barcode')">{{ $t('message.barcode') }}</a></li>
                              <li><a class="dropdown-item" @click="selectSearchType('itemCode')">{{ $t('message.itemCode') }}</a></li>
                              <li><a class="dropdown-item" @click="selectSearchType('itemName')">{{ $t('message.itemName') }}</a></li>
                            </ul>
                          </div>-->
            <!--              @input="searchProduct"-->
            <input type="text" v-model="search"  :placeholder="$t('message.search')" class="form-control mb-3 mx-2 ">
          </div>


          <div>
            <router-link class="text-decoration-none text-primary my-1" :to="{name:'ExpireLists'}"><i class="fas fa-triangle-exclamation"></i>{{
                $t('message.expire_list')
              }}</router-link>
          </div>
        </div>
      </div>
      <div class="px-0 table-card table-responsive">
        <table class="table table-hover table-striped">
          <thead>
          <tr>
            <th class="text-nowrap" style="width: 50px;">{{ $t('message.barcode') }}</th>
            <th class="text-nowrap">{{ $t('message.itemName') }}</th>
            <th class="text-nowrap">{{ $t('message.photo') }}</th>
            <th class="text-nowrap">{{ $t('message.type') }}</th>
            <th class="text-nowrap" v-if="cashierAcc.editStatus==='yes'" >{{ $t('message.buy_price') }}</th>
            <th class="text-nowrap">{{ $t('message.sell_price') }}</th>
            <th class="text-nowrap">{{ $t('message.stock') }}</th>
            <th class="text-nowrap" >{{$t('message.kitchen')}} </th>
            <th class="text-nowrap text-center">Control</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(product) in filterProducts.product" class="align-middle" :key="product.id">
            <!--             {{product.buyPrice}}, {{product.sellPrice}}, {{product.stock}},{{product.itemName}}-->
            <td class="text-nowrap" style="width: 50px;">{{product.barcode}}</td>
            <td class="text-truncate" style="max-width: 200px">{{product.itemName}}</td>
            <td class="text-nowrap">
              <img :src="product.images[0]" v-if="product.images.length>0" class="rounded border border-light border-3 shadow-sm" style="width:50px; height:50px; object-fit: cover;" alt="">
              <img src="../../assets/flash/1.png" v-else class="rounded border border-light border-3 shadow-sm" style="width:50px; height:50px; object-fit: cover;" alt="">
            </td>
            <td class="text-nowrap">{{product.type}}</td>
            <td class="text-nowrap" v-if="cashierAcc.editStatus==='yes'">{{product.buyPrice}}</td>
            <td class="text-nowrap">{{product.sellPrice}}</td>
            <td class="text-nowrap" :class="showLowStock?'text-danger':''">{{product.stock}}</td>
            <td class="text-nowrap">{{product.kitchenType}}{{product.barMenu==='yes'?' / Bar':''}}</td>
            <td class="text-nowrap text-center">
              <button class="btn btn-sm btn-primary me-2" @click="viewItemDetails(product)"><i class="fas fa-info-circle "></i> Detail</button>
              <router-link v-if="cashierAcc.editStatus === 'yes'" :to="{name:'ProductEdit', params:{product_id:product.id}}" class="btn btn-sm btn-warning me-2"><i class="fas fa-edit "></i> Edit</router-link>
              <button v-if="cashierAcc.editStatus === 'yes'" class="btn btn-success btn-sm" @click="selectProduct(product)" data-bs-toggle="modal" data-bs-target="#stockModal"><i class="fas fa-plus"></i> Add Stock</button>
            </td>
          </tr>

          </tbody>
        </table>

      </div>
      <div class="w-100 d-flex align-items-center justify-content-center" >
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
  </AdminSidebar>
</template>

<script>
// import axios from "axios";

import db,{timestamp} from "@/config/FirebaseInit";
import Loading from "@/components/Loading";
import InfoDialog from "@/components/InfoDialog";
import ConfirmDialog from "@/components/ConfirmDialog";
import AdminSidebar from "@/components/AdminSidebar";
import * as XLSX from 'xlsx'
import 'lodash/debounce';
import {debounce} from "lodash";
import Pagination from "@/components/Pagination"
export default {
  components: {ConfirmDialog, Loading, InfoDialog, AdminSidebar, Pagination},
  data(){
    return{
      //pagination
      currentPage:0,
      perPage:15,
      //end pagination
      filterExportData:[],
      columns : [
        {
          label: "Barcode",
          field: "barcode"
        },
        {
          label: "Item Name",
          field: "itemName",
        },

        {
          label:"Buy Price",
          field: 'buyPrice'
        },
        {
          label:"Sell Price",
          field: 'sellPrice'
        },
        {
          label:"Stock",
          field: 'stock'
        },
        {
          label:"Type",
          field: 'type'
        },
        {
          label:"Expire Date",
          field: 'expireDate'
        },
        {
          label:"Size",
          field: 'size'
        },


      ],
      showLowStock:false,
      search:'',
      selectedCategory:'',
      selectedSearchType:'',
      confirmActive:false,
      modalActive:false,
      modalMessage:'',
      loadingActive:false,
      selectedId:'',
      excelProducts:[],
      // filterProducts:[],
      // searchProducts:[],
      productBeforeSlice:[],
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
    products(){
      return this.$store.getters.getAllProducts;
    },
    filterExportProducts(){
      let filterInv = [];
      for(let i = 0; i<this.products.length;i++){
        filterInv.push(this.products[i]);
      }
      return filterInv;
    },
    currentYear(){
      return this.$store.getters.getYear;
    },
    owner(){
      return this.$store.getters.getShopOwner;
    },
    filterCategories(){
      return this.productCategories.filter(p=>p.name!=="All")
    },
    productCategories(){
      return this.$store.getters.getProductCategories;
    },
    shopInfo(){
      return this.$store.getters.getShopInfo;
    },
    cashierAcc(){
      return this.$store.getters.getCashierAcc;
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

    pageCount(){
      return Math.ceil(this.filterProducts.prodCount/this.perPage)
    },
  },
  async created() {
    this.selectedCategory = this.$route.params.category;
    this.$store.dispatch("getDateTime");
    this.$store.dispatch("getDay");
    this.$store.dispatch("getMonth");
    this.$store.dispatch("getYear");
    this.$store.dispatch("getProductCategories",this.owner);
    this.$store.dispatch("getShopInfo",this.owner);
    this.$store.dispatch("getAllProductsByKitchen");
    this.$store.dispatch("getCashierAcc",this.owner);
    if(localStorage.getItem('selectedProductSearchType')){
      this.selectedSearchType = localStorage.getItem('selectedProductSearchType');
    }

  },

  async mounted() {
   this.selectCategory(this.$route.params.category);

  },

  methods:{
    
    onPageChange(page) {
      console.log(page)
      this.currentPage = page;
    },

    selectCategory(name){
      this.search = "";
      this.selectedCategory = name;
      this.$router.replace({name:'ProductList', params:{category:this.selectedCategory}})
    },

    getSelectedRelation(){
      let selected = '';
      selected = this.relations.filter(relation => {
        return relation.frontUnit === this.frontUnit.toString();
      });
      this.selectedRelation = selected[0];
    },

    async updateStock(){
      let newStock =0;
      let count =0;
      this.loadingActive = true;
      if(this.frontNumber!==''){
        if(this.frontUnit!=='Pcs'){
          count = (parseInt(this.selectedRelation.backNumber) * parseInt(this.frontNumber))
          newStock = parseInt(this.selectedProduct.stock) + (parseInt(this.selectedRelation.backNumber) * parseInt(this.frontNumber));
        }else {
          count = this.frontNumber;
          if(this.selectedProduct.stock ===''){
            newStock = parseInt(this.frontNumber);
          }else {
            newStock = parseInt(this.selectedProduct.stock)+parseInt(this.frontNumber);
          }
        }
        await db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(this.selectedProduct.id).update(
            {
              'stock':newStock.toString()
            }
        ).then(()=>{
          console.log('stock update')
          const recordRef = db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(this.selectedProduct.id).collection('records').doc();
          recordRef.set(
              {
                'id':this.selectedProduct.id,
                'recordId':recordRef.id,
                'itemCode':this.selectedProduct.itemCode,
                'barcode':this.selectedProduct.barcode,
                'itemName':this.selectedProduct.itemName,
                'buyPrice':this.selectedProduct.buyPrice,
                'sellPrice':this.selectedProduct.sellPrice,
                'stock':this.selectedProduct.stock.toString(),
                'description':this.selectedProduct.description,
                'type':this.selectedProduct.type,
                'color':this.selectedProduct.color,
                'size':this.selectedProduct.size,
                'weight':this.selectedProduct.weight,
                'time':timestamp,
                'day':this.currentDay,
                'month':this.currentMonth,
                'year':this.currentYear,
                'dateTime':this.currentDateTime,
                'rating':this.selectedProduct.rating,
                'discount':this.selectedProduct.discount,
                'note':'default',
                'process': 'stockUpdate',
                'count':'+'+count.toString()
              }
          ).then(()=>{
            console.log('record updated')
            this.frontNumber = "";
            this.frontUnit = "Pcs";
            this.loadingActive=false;
            this.modalActive = true;
            this.modalMessage = 'Updated Successfully!'

          })

        })
      }else {
        this.loadingActive = false;
        this.modalActive = true;
        this.modalMessage = "Please fill stock!";
      }
    },

    selectProduct(product){
      this.selectedProduct = product;
      this.frontNumber = 1;
      this.frontUnit = 'Pcs';
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

    searchProduct:debounce(function (e){
      if(this.search!==''){
        if(this.selectedSearchType==='barcode' || this.selectedSearchType === 'itemCode'){
          this.search = this.search.replace(/\s/g, '');
          db.collection(this.owner.city)
              .doc(this.owner.shopId)
              .collection('products').where(this.selectedSearchType,'==',this.search).onSnapshot(snapshot => {
            this.searchProducts= [];
            snapshot.forEach(doc=>{
              this.searchProducts.push(doc.data())
            })
          })
        }else{
          db.collection(this.owner.city)
              .doc(this.owner.shopId)
              .collection('products').where('itemName',">=",e.target.value).where("itemName","<=",e.target.value+'\uf8ff').onSnapshot(snapshot=>{
            this.searchProducts = [];
            snapshot.docs.filter(e=>{
              const isDuplicate = this.products.includes(e.id);
              if(!isDuplicate){
                this.searchProducts.push(e.data());
                return true;
              }
              return false;
            })
          })
        }
      }
    }, 500),

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
        p.barcode=this.shopInfo.shopCode+this.getRandomStr();
      });
    },

    //TODO: excel import
    extractExcel(){
      console.log(this.excelProducts)
      this.excelProducts.forEach(product=>{
        let productRef = db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc();
        productRef.set(
            {
              barcode: product.barcode.toString(),
              buyPrice: product.buyPrice.toString(),
              color: "All",
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
              year: this.currentYear
            }
        ).then(()=>{
          console.log('added');
          /*let productRefRecord = db.collection('Lashio').doc('flowerpharmacyfpy2022-07-04').collection('products').doc(productRef.id).collection('records').doc();
          productRefRecord.set({
            'id': productRefRecord.id,
            'recordId': productRefRecord.id,
            'itemCode': product.barcode,
            'barcode': product.barcode,
            'itemName': product.itemName,
            'buyPrice': product.buyPrice.toString(),
            'sellPrice': product.sellPrice.toString(),
            'stock': product.stock.toString(),
            'description': "",
            'type': product.type.toString(),
            'color': "All",
            'size': "Free",
            'weight': "",
            'time': timestamp,
            'day': this.currentDay,
            'month': this.currentMonth,
            'dateTime':this.currentDateTime,
            'year': this.currentYear,
            'rating':"",
            'discount':"",
            'note': '',
            'process': 'add',
            'count': product.stock.toString(),
          })*/
        });
      })
    },

    async showStock(e){
      if(e.target.checked){
        await db.collection(this.owner.city).doc(this.owner.shopId).update({
          'showStock':'yes'
        }).then(()=>{
          console.log('updated')
        })
      }else {
        await db.collection(this.owner.city).doc(this.owner.shopId).update({
          'showStock':'no'
        }).then(()=>{
          console.log('updated')
        })
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
      this.loadingActive = true;
      /*
            await db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(this.selectedId).collection('records').get().then(result=>{
              result.forEach(doc=>{
                doc.ref.delete()
              })
              db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(this.selectedId).delete().then(()=>{
                this.loadingActive = false;
                this.modalMessage = "Deleted Successfully";
                this.modalActive = true;
              })
            })
      */
    },
    cancel(){
      this.confirmActive = !this.confirmActive;
    },
    deleteProduct(id){
      this.selectedId = id;
      this.modalMessage = `Are you sure to delete this id : ${this.selectedId}?`;
      this.confirmActive = true;
    }
  }

}
</script>

<style scoped>
.header-bar{
  top:5px;
  background-color: var(--background-color);
}
tr,td,th{
  cursor: pointer;
  border: 1px solid var(--light) !important;
  color: var(--text-color) !important;
}
thead, tbody{
  border: 1px solid var(--light) !important;
  color: var(--dark);
}
.category-box{
  /*z-index: 1000;*/
  /*background-color: var(--side-bar-bg);*/
  width: 100%;
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
  background-color: var(--white);
  transition: 0.3s;
}
.table-card{
  background-color: var(--light);
  height: 65vh;
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