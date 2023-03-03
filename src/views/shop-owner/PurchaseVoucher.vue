<template>
  <AdminSidebar>
    <Loading v-if="loadingActive"/>
    <InfoDialog v-if="infoModalActive" :modal-message="modalMessage" v-on:close-modal="closeModal"/>
    <ConfirmDialog :modal-message="modalMessage" v-if="confirmActive" v-on:confirm="confirm" v-on:cancel="cancel"/>
    <PurchaseSelectItem :selectedProduct="selectedProduct" :owner="owner" :selectedRelatons="selectedRelations" v-if="showDialog" v-on:confirm-modal="confirmItem" v-on:close-modal="closeDialog"/>

    <div class="row pt-2">
      <!-- search box-->
      <div class="col-12 col-lg-4 col-md-4" style="background-color: var(--light);">
        <div class="d-flex flex-column rounded mb-2 p-1" style="background-color: var(--light);">
          <div class="d-flex justify-content-between">
            <div class="dropdown d-none">
              <button class="btn align-items-center dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
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
            </div>
            <button class="btn btn-sm d-lg-none" style="background-color: var(--softPrimary);" @click="showSelectedBoxHandler"><i class="fas fa-cart-plus"></i> <span class="badge rounded-circle" style="background-color: var(--btnLight);">{{selectedPurchaseProducts.length}}</span></button>
          </div>
          <div class="d-flex align-items-end p-1" style="background-color: var(--background-color);border-radius: var(--border-radius);">
            <!--                <button class="btn" style="color: var(&#45;&#45;text-color);"  v-if="products.length>0" @click="clearSearch"><i class="fas fa-times"></i></button>-->
            <button class="btn" style="color: var(--text-color);"><i class="fas fa-search "></i></button>
            <!--                <input type="text" autofocus v-model="search" v-if="selectedSearchType!=='barcode'" @input="searchProductFromServer" :placeholder="$t('message.search')" class="form-control " @click="showSearchBoxHandler">-->
            <input type="text" ref='barcodeSearch' autofocus v-model="search" @keyup.enter="searchByBarcode"  :placeholder="$t('message.search_by_barcode')" class="form-control " @click="showSearchBoxHandler">
          </div>
        </div>
        <div class="row pe-1 product-box" >
          <div class="col-6" style="padding: 5px !important;" v-for="(product, index) in filterProducts.product" :key="index"  @click="selectForCart(product)">
            <div class="card product-card m-0">
              <div class="" >
                <div class="">
                  <img :src="product.images[0]" v-if="product.images.length>0" style="width: 120px;height: 120px; border-radius: var(--border-radius)!important;" alt="">
                  <img src="../../assets/flash/1.png" v-else style="width:120px;height: 120px;border-radius: var(--border-radius)!important;" alt="">
                </div>
                <div class="ms-2 p-1" style="border-radius: var(--border-radius);">
                  <div class="d-flex text-start flex-column">
                    <div class="d-flex justify-content-between align-items-start">
                      <span>{{product.itemName}} </span>
                      <!-- <i class="fas fa-plus-circle"></i>-->
                    </div>
                    <span style="font-size: 12px;color:var(--text-color-light);">{{product.itemCode}}</span>
                    <span>{{product.sellPrice}} Ks</span>
                    <div class="d-flex justify-content-between align-items-center">
                      <span style="color: var(--primary)">{{$t('message.stock')}}: {{product.stock}} Pcs</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row py-2 border-top me-1">
          <pagination
              :totalPages="pageCount"
              :perPage="perPage"
              :currentPage="currentPage"
              :pages="allProducts"
              @pagechanged="onPageChange"
          />
        </div>

      </div>
      <!--          selected box-->
      <div class="col-12 col-lg-8 col-md-8 text-center rounded" v-if="showSelectedBox">

        <div class="d-flex rounded justify-content-between align-items-center py-2 px-2 " style="background-color: var(--light);">
          <div class="d-flex align-items-center">
            <router-link class="btn" style="background-color:var(--btnLight);border-radius: var(--border-radius); " :to="{name:'PurchaseList'}"><i class="fas fa-list"></i></router-link>
            <span class="ms-3" style="color: var(--text-color) !important;">Purchase Voucher Setup</span>
          </div>
          <button class="btn btn-sm btn-danger my-1 ms-2" @click="clearCartItems">
            <i class="fa fa-filter-circle-xmark"></i>
            <span class="ms-2">Clear All</span>
          </button>
        </div>
        <!--             TODO-->

        <div class="row selected-box" style="height: 60vh; overflow-y: scroll">
          <div class="col-12 " >
            <!--                {{order}}-->
            <div class="table-responsive p-0 mt-2">
              <table class="table">
                <thead>
                <tr>
                  <th>*</th>
                  <th class="text-truncate text-start" style="max-width: 250px;">{{ $t('message.itemName') }}</th>
                  <th class="text-start">{{ $t('message.sell_price') }}</th>
                  <th class="text-start">{{$t('message.buy_price')}}</th>
                  <th class="text-start">{{ $t('message.count') }}</th>
                  <th class="text-start">{{$t('message.unit')}}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(order,index) in selectedPurchaseProducts" :key="index">
                  <td class="align-middle">
                    <button class="btn btn-sm btn-sm text-danger" :id="order.id" @click="removeFromCart(index)"><i class="fas fa-trash"></i></button>
                  </td>
                  <td  class="text-truncate text-start align-middle" style="max-width: 250px;">{{order.itemName}}</td>

                  <td class="align-middle">
                    <input type="number"  @input="sellPriceChangeHandler(order, index)" class="form-control" v-model="order.sellPrice">
                  </td>

                  <td class="align-middle">
                    <input type="number"  @input="buyPriceChangeHandler(order, index)" class="form-control" v-model="order.buyPrice">
                  </td>

                  <td class="align-middle">
                    <input type="number" @input="countChangeHandler(order, index)" class="form-control" v-model="order.frontNumber">
                  </td>
                  <td class="align-middle text-start"> {{order.frontUnit}}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="" style="background-color: var(--light);color: var(--text-color)!important;border-radius: var(--border-radius);height: 30vh;">
          <div class="d-flex p-2 justify-content-between">
            <span class="">{{$t('message.total')}}</span>
            <span class=" text-end">{{totalForShow}} Ks</span>
          </div>
          <div class="d-flex m-2 rounded p-1 justify-content-between align-items-center" style="background-color: var(--white); color: var(--text-color)!important;">
            <div class="text-start">
              <label class="form-label">Discount Price</label>
              <input type="text" class="form-control" @input="addDiscountPrice" v-model="newDiscountPrice" placeholder="enter discount">
            </div>
            <span class="fs-4 text-end">{{newDiscountPrice}} Ks</span>
          </div>
          <div class="d-flex p-2 justify-content-between">
            <span class="">{{$t('message.net_amount')}}</span>
            <span class=" text-end">{{finalTotal}} Ks</span>
          </div>
          <div class="d-flex justify-content-end">
            <button class="btn w-50" @click="submitVoucher" style="background-color: var(--primary);color: var(--light);">Save</button>
          </div>
        </div>
      </div>
    </div>

  </AdminSidebar>
</template>

<script>
import html2canvas from 'html2canvas';
import db, {timestamp} from "../../config/FirebaseInit";
import ConfirmDialog from "@/components/ConfirmDialog";
import InfoDialog from "@/components/InfoDialog";
import Loading from "@/components/Loading";
import AdminSidebar from "@/components/AdminSidebar";
import PurchaseSelectItem from "@/components/PurchaseSelectItem";
import 'lodash/debounce';
import _ from 'lodash';
import Pagination from "@/components/Pagination";
export default {
  components: {Loading, ConfirmDialog, InfoDialog, AdminSidebar, PurchaseSelectItem,Pagination},
  data(){
    return{

      //pagination
      currentPage:0,
      perPage:20,
      //end pagination
      showCart:false,
      showTableVoucher:false,
      infoModalActive:false,
      modalMessage:'',
      loadingActive:false,
      confirmActive:false,

      //modal
      showDiscountInput:false,
      showPromotionInput:false,
      showDiscountPriceInput:false,

      showDiscountBox:true,
      showPaymentBox:true,
      showVoucherBox:true,
      showCustomerBox:true,

      selectedSellProductContainer:1,
      newDiscountPrice:0,
      showDialog:false,

      products:[],
      tax:0,
      //search data
      search:'',
      searchCode:'',
      searchProduct:null,
      showSelectedBox:true,
      showSearchBox:true,
      magic_flag:true,
      //selected products list
      // selectedSellProduc:[],
      totalPrice:0,
      // finalTotal:0,
      originalProduct:"",
      showSearch:false,

      showAlert:false,
      alertMessage:'',
      discountType:'price',

      cashier:[],
      productCategories:[],
      todayVoucherSize:'',

      //searched product
      product:{
        name:'',
        images:[],
        buyPrice:'',
        sellPrice:'',
        barcode:'',
        itemCode:'',
      },
      selectedCategory:'All',
      selectedSearchType:'',

      //for count*price of each order
      costPerItem:[],
      casherCode:'',

      //Relations
      relation:[],
      selectedProduct:'',
      frontNumber: 1,
      frontUnit: 'Pcs',
      selectedRelation:'',
      selectedRelations:[],

      pcsList:[],
      customers:[],
      searchCustomer:'',

      purchaseVoucher: {
            'countList':[],
            'nameList':[],
            'sellPriceList':[],
            'buyPriceList':[],
            'productIdList':[],
            'itemCodeList':[],
            'productUnitList':[],
            'id':'',
            'time':'',
            'day':'',
            'year':'',
            'month':'',
            'dateTime':'',
            'discount':'',
            'tax':"0",
            'totalPrice':'',
            'voucherId':'',
            'note':'',
      },

      showPaymentToggle:false,
      showCustomerAddBox:false,
      customerAlert:false,
      voucherStyle:'',
      // paymentMethods:[],
      // filterProducts:[],
      selectedPaymentType:'',
      payAmount:'',
      selectedCustomer:'',
      limit:20,
      showWarning:true,
      warningMessage:'',
      sellNowActive:false,
      searchedCustomerList:[],
      timeout:null,
    }
  },
  computed:{
    allProducts(){
      return this.$store.getters.getAllProducts;
    },
    filterProducts(){
      let filterProduct = [];
      if(this.search!==""){
        filterProduct = this.allProducts.filter(pro=>pro.barcode.toLowerCase().includes(this.search.toLowerCase()) || pro.itemName.toLowerCase().includes(this.search.toLowerCase()))
        return {product:filterProduct.slice(this.offsetCount, this.offsetCount + this.perPage), prodCount:filterProduct.length};
      }
      else {
        return {product:this.allProducts.slice(this.offsetCount, this.offsetCount + this.perPage), prodCount: this.allProducts.length};
      }
    },
    pageCount(){
      return Math.ceil(this.filterProducts.prodCount/this.perPage)
    },
    offsetCount(){
      return this.currentPage*this.perPage
    },
    selectedPurchaseProducts(){
      return this.$store.getters.getSelectedPurchaseProducts;
    },

    totalForShow(){
      let tot = 0;
      if(this.selectedPurchaseProducts.length>0){
        this.selectedPurchaseProducts.forEach(order=>{
          tot += order.buyPrice * order.frontNumber;
        })
      }
      return tot;
    },
    finalTotal(){
      if(this.newDiscountPrice!==''){
        return  this.totalForShow - parseInt(this.newDiscountPrice);
      }
      return this.totalForShow
    },

    showName(){
      return localStorage.getItem('showCustomerName');
    },
    showLogo(){
      return localStorage.getItem('showLogoImage');
    },
    paymentMethods(){
      return this.$store.getters.getPaymentMethods;
    },
    showPhone(){
      return localStorage.getItem('showCustomerPhone');
    },
    showRefund(){
      return localStorage.getItem('showRefund');
    },
    cashierAcc(){
      return this.$store.getters.getCashierAcc;
    },

    owner(){
      return this.$store.getters.getShopOwner;
    },
    shopInfo(){
      return this.$store.getters.getShopInfo;
    },

    today(){
      return this.$store.getters.getDay;
    },
    thisMonth(){
      return this.$store.getters.getMonth;
    },
    thisYear(){
      return this.$store.getters.getYear;
    },
    dateTime(){
      return this.$store.getters.getDateTime;
    },

  },
  async mounted() {
    if(window.innerWidth<500){
      this.showSelectedBox = false;
      this.showDiscountBox = false;
      this.showCustomerBox = false;
    }
    this.$refs.barcodeSearch.focus();

    this.warningMessage = this.$t('message.enter_pay_amount');
    this.$store.dispatch("getShopInfo",this.owner);
    this.$store.dispatch("getDay");
    this.$store.dispatch("getMonth");
    this.$store.dispatch("getDateTime");
    this.$store.dispatch("getYear");
    this.$store.dispatch("getPaymentMethods",this.owner);
    this.$store.dispatch("getCashierAcc",this.owner);
    this.$store.dispatch("getAllProducts", this.owner);
    if(localStorage.getItem('selectedProductSearchType')){
      this.selectedSearchType = localStorage.getItem('selectedProductSearchType');
    }
    if(localStorage.getItem('voucherStyle')){
      this.voucherStyle =localStorage.getItem('voucherStyle');
    }
    console.log(this.cashierAcc.accountCode);
    console.log(this.today)
    await db.collection(this.owner.city).doc(this.owner.shopId).collection('purchaseVouchers').where('day','==',this.today).onSnapshot(snapshot => {
      this.todayVoucherSize = snapshot.size;
      console.log('todayVoucherSize',this.todayVoucherSize)
    });

    await db.collection(this.owner.city).doc(this.owner.shopId).collection('category').onSnapshot(snapshot => {
      this.productCategories = [];
      snapshot.forEach(doc=>{
        if(doc.data().name!=='All'){
          this.productCategories.push(doc.data());
        }
      })
    });

    this.$store.dispatch("getAllProducts",this.owner);



    await db.collection(this.owner.city).doc(this.owner.shopId).collection('customer').orderBy('time','desc').onSnapshot(snapshot => {
      this.customers = [];
      snapshot.forEach(doc=>{
        this.customers.push(doc.data());
      })
    });

  },
  methods:{
    onPageChange(page) {
      console.log(page)
      this.currentPage = page;
    },
    generateVoucherId(){
      const date = new Date();
      let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
      let twoDigitMonth = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date);
      let twoDigitYear = date.getFullYear().toString().slice(-2);
      let vId='';
      let padNumber = this.todayVoucherSize+1;
      //TODO: must be used owner selected casherCode
      vId = this.shopInfo.shopCode+this.cashierAcc.accountCode+twoDigitYear+twoDigitMonth+day+padNumber.toString().padStart(5,'0');
      return vId;
    },
    async submitVoucher(){
      this.loadingActive = true;
      let purchaseVoucherRef =await  db.collection(this.shopInfo.city).doc(this.shopInfo.id).collection('purchaseVouchers').doc();
      this.purchaseVoucher.id=purchaseVoucherRef.id;
      this.purchaseVoucher.time=timestamp;
      this.purchaseVoucher.day=this.today;
      this.purchaseVoucher.year=this.thisYear;
      this.purchaseVoucher.month=this.thisMonth;
      this.purchaseVoucher.dateTime=this.dateTime;
      this.purchaseVoucher.discount=this.newDiscountPrice+"";
      this.purchaseVoucher.totalPrice=this.finalTotal+"";
      this.purchaseVoucher.voucherId=this.generateVoucherId();
      this.selectedPurchaseProducts.forEach((product)=>{
        this.purchaseVoucher.countList.push(product.frontNumber.toString())
        this.purchaseVoucher.nameList.push(product.itemName);
        this.purchaseVoucher.sellPriceList.push(product.sellPrice+"");
        this.purchaseVoucher.buyPriceList.push(product.buyPrice+"");
        this.purchaseVoucher.itemCodeList.push(product.itemCode);
        this.purchaseVoucher.productIdList.push(product.id);
        this.purchaseVoucher.productUnitList.push(product.frontUnit);
        if(this.selectedPurchaseProducts.length === this.purchaseVoucher.countList.length){
          console.log('voucher', this.purchaseVoucher);
          purchaseVoucherRef.set(this.purchaseVoucher);
          this.recordProduct();
        }
      });

    },

     recordProduct(){
      this.selectedPurchaseProducts.forEach((product,index)=>{
        db.collection(this.shopInfo.city).doc(this.shopInfo.id).collection('products').doc(product.id).get().then(async (snapshot)=>{
          let originalProduct =await snapshot.data();
          let buyPriceNote="";
          let sellPriceNote="";
          let updateStock='';
          let pcsBuyPrice = 0;
          let newCount = parseInt(product.frontNumber) * parseInt(product.backNumber);
          if(originalProduct.stock!==''){
            updateStock = parseInt(originalProduct.stock) + newCount;
          }else {
            updateStock = "";
          }
          const productRef = db.collection(this.shopInfo.city).doc(this.shopInfo.id).collection('products').doc(product.id)

          if(product.buyPrice == ""){
            product.buyPrice = 0;
          }
          if(product.sellPrice == ""){
            product.sellPrice = 0;
          }
          //for pcs product
          if(product.frontUnit==='Pcs'){
            console.log('..........')
            console.log('front unit', product.frontUnit);


            //buy price change record
            if(parseInt(originalProduct.buyPrice) !== parseInt(product.buyPrice)){
              buyPriceNote ="Buy Price Change("+originalProduct.buyPrice+" -> "+product.buyPrice+")";
              const recordRef = productRef.collection("records").doc();
              recordRef.set({
                'id':product.id,
                'recordId':recordRef.id,
                'itemCode':product.itemCode,
                'barcode':product.barcode,
                'itemName':product.itemName,
                'buyPrice':product.buyPrice+"",
                'sellPrice':product.sellPrice+"",
                'stock':""+product.stock+"",
                'description':product.description,
                'type':product.type,
                'color':product.color,
                'size':product.size,
                'weight':product.weight,
                'time':timestamp,
                'day':this.today,
                'month':this.thisMonth,
                'year':this.thisYear,
                'dateTime':this.dateTime,
                'rating':product.rating,
                'discount':product.discount,
                'note':buyPriceNote,
                'process': 'buyPrice',
                'count':'0'
              }).then(()=>{
                console.log('Buy price recorded')
              })
            }

            //sell price change record
            if(parseInt(originalProduct.sellPrice) !== parseInt(product.sellPrice)){
              sellPriceNote ="Sell Price Change("+originalProduct.sellPrice+" -> "+product.sellPrice+")";
              const recordRef = productRef.collection("records").doc();
              recordRef.set({
                'id':product.id,
                'recordId':recordRef.id,
                'itemCode':product.itemCode,
                'barcode':product.barcode,
                'itemName':product.itemName,
                'buyPrice':product.buyPrice+"",
                'sellPrice':product.sellPrice+"",
                'stock':""+product.stock+"",
                'description':product.description,
                'type':product.type,
                'color':product.color,
                'size':product.size,
                'weight':product.weight,
                'time':timestamp,
                'day':this.today,
                'month':this.thisMonth,
                'year':this.thisYear,
                'dateTime':this.dateTime,
                'rating':product.rating,
                'discount':product.discount,
                'note':sellPriceNote,
                'process': 'sellPrice',
                'count':'0'
              }).then(()=>{
                console.log('sell price recorded')
              })
            }

            //update original product
            productRef.update(
                {
                  'stock':updateStock+"",
                  'buyPrice':product.buyPrice+"",
                  'sellPrice':product.sellPrice+""
                }
            ).then(()=>{
              console.log('update product ok')
            });
          }else {
            console.log('..........')
            console.log('front unit', product.frontUnit)
            pcsBuyPrice = parseInt(parseInt(product.buyPrice)/parseInt(product.backNumber));
            console.log('pcs buy price=',pcsBuyPrice,'original buy price=',originalProduct.buyPrice);
            if(parseInt(originalProduct.buyPrice) !== pcsBuyPrice){
              console.log('buy price change')
              buyPriceNote ="Buy Price Change("+originalProduct.buyPrice+" -> "+pcsBuyPrice+")";
              const recordRef = productRef.collection("records").doc();
              recordRef.set({
                'id':product.id,
                'recordId':recordRef.id,
                'itemCode':product.itemCode,
                'barcode':product.barcode,
                'itemName':product.itemName,
                'buyPrice':product.buyPrice+"",
                'sellPrice':product.sellPrice+"",
                'stock':""+product.stock+"",
                'description':product.description,
                'type':product.type,
                'color':product.color,
                'size':product.size,
                'weight':product.weight,
                'time':timestamp,
                'day':this.today,
                'month':this.thisMonth,
                'year':this.thisYear,
                'dateTime':this.dateTime,
                'rating':product.rating,
                'discount':product.discount,
                'note':buyPriceNote,
                'process': 'buyPrice',
                'count':'0'
              }).then(()=>{
                console.log('Buy price recorded')
              })
            }

            productRef.collection('relation').where('frontUnit','==',product.frontUnit).get().then( snapshot=> {
              let relation = snapshot.docs[0];
              // snapshot.forEach(doc=>{
              //   relation.push(doc.data())
              // });
              console.log('relation', relation);
              productRef.collection('relation').doc(relation.id).update(
                  {
                    'sellPrice': product.sellPrice+""
                  });
              console.log('relation buy price, sell price update ');
              //updated original product
              productRef.update(
                  {
                    'buyPrice':pcsBuyPrice+"",
                    'stock':updateStock+"",
                  }).then(()=>{
                console.log('stock update in relation product');

              })
              });

          }

          //stock update record
          const recordRef = productRef.collection("records").doc();
          await recordRef.set({
            'id':product.id,
            'recordId':recordRef.id,
            'itemCode':product.itemCode,
            'barcode':product.barcode,
            'itemName':product.itemName,
            'buyPrice':product.buyPrice+"",
            'sellPrice':product.sellPrice+"",
            'stock':""+product.stock+"",
            'description':product.description,
            'type':product.type,
            'color':product.color,
            'size':product.size,
            'weight':product.weight,
            'time':timestamp,
            'day':this.today,
            'month':this.thisMonth,
            'year':this.thisYear,
            'dateTime':this.dateTime,
            'rating':product.rating,
            'discount':product.discount,
            'note':'default',
            'process': 'stockUpdate',
            'count':'+'+newCount
          })

          if(this.selectedPurchaseProducts.length === index+1){
            this.modalMessage = 'Voucher Inserted Successfully';
            this.clearCartItems();
            this.loadingActive = false;
            this.$router.push({name:'PurchaseList'});
          }
        })

      })

    },
    addDiscountPrice(){
      if(this.newDiscountPrice!==''){
        this.finalTotal =parseInt(this.totalForShow) - parseInt(this.newDiscountPrice);
      }else {
        this.finalTotal = this.totalForShow;
      }
    },
    inputFocus(){
      if(this.selectedSearchType === 'barcode'){
        this.$refs.barcodeSearch.focus();
      }
    },
    searchCustomerHandler:_.debounce(function (){
      if(this.searchCustomer!==''){
        db.collection(this.owner.city)
            .doc(this.owner.shopId)
            .collection('customer').orderBy('name').startAt(this.searchCustomer).endAt(this.searchCustomer+'~').onSnapshot(snapshot=>{
          this.searchedCustomerList = [];
          snapshot.docs.filter(e=>{
            this.searchedCustomerList.push(e.data());
          })
        })
        console.log(this.searchedCustomerList)
      }else {
        this.searchedCustomerList = [];
      }
    }, 500),

    showSearchBoxHandler(){
      if(window.innerWidth<500){
        this.showSearchBox = true;
        this.showSelectedBox = false;
      }

    },
    showSelectedBoxHandler(){
      if(window.innerWidth<500){
        this.showSelectedBox = true;
        this.showSearchBox = false;
      }
    },
    clearCartItems(){
      this.newDiscountPrice = 0;
      this.finalTotal = 0;
      this.$store.commit('clearSelectedPurchaseProduct')
    },
    selectSearchType(type){
      if(this.selectedSearchType === 'barcode'){
        this.$refs.barcodeSearch.focus();
      }
      localStorage.setItem('selectedProductSearchType',type);
      if(this.selectedSearchType){
        this.selectedSearchType = localStorage.getItem('selectedProductSearchType');
      }
    },
    clearSearch(){
      if(this.selectedSearchType === 'barcode'){
        this.$refs.barcodeSearch.focus();
      }

      this.products =[];
      this.search ='';
    },

    searchProductFromServer:_.debounce(function (){
      console.log('debug',this.search, this.selectedSearchType);
      if(this.search!==''){
        db.collection(this.owner.city)
            .doc(this.owner.shopId)
            .collection('products').orderBy(this.selectedSearchType).startAt(this.search).endAt(this.search+"~").onSnapshot(snapshot=>{
          this.products = [];
          snapshot.docs.filter(e=>{
            const isDuplicate = this.products.includes(e.id);
            if(!isDuplicate){
              this.products.push(e.data());
              return true;
            }
            return false;
          })
          console.log(this.products.length)
        })

      }else {
        this.products = [];
      }
    }, 500),

    searchByBarcode(){
      db.collection(this.owner.city).doc(this.owner.shopId).collection('products').where('barcode','==',this.search).onSnapshot(snapshot => {
        this.products= [];
        this.selectedProduct ='';
        this.selectedRelations=[];
        this.selectedProduct = snapshot.docs[0].data();
        this.products.push(this.selectedProduct)
        console.log('product',this.selectedProduct);
        console.log('relation',this.selectedRelations)
        this.showDialog = true;
        this.search = '';
        if(this.selectedSearchType === 'barcode'){
          this.$refs.barcodeSearch.focus();
        }
      });
    },

    async addNewCustomer(){
      let customerRef = await db.collection(this.shopInfo.city).doc(this.shopInfo.id).collection('customer').doc();
      this.customer.id = customerRef.id;
      this.customer.day = this.today;
      this.customer.month = this.thisMonth;
      this.customer.year = this.thisYear;
      this.customer.time = timestamp;
      console.log(this.customer)
      await customerRef.set(this.customer).then(()=>{
        console.log('added new Customer');
        this.customer.name='';
        this.customer.phone='';
        this.customer.address='';
        this.showCustomerAddBox = false;
      }).then(()=>{
        console.log('customer added')
      })
    },

    resetPayment(){
      this.checkoutItem.cashReceived = '0';
      this.checkoutItem.credit='0';
      this.checkoutItem.change='0';
      this.payAmount = '';
      /*if(window.innerWidth<500){
        this.showPaymentBox = false;
      }*/
      this.customerAlert=false;
      this.showWarning = true;
      this.warningMessage = this.$t('message.enter_pay_amount')
      this.sellNowActive = false;
    },

    resetDiscount(){
      this.sellNowActive = false;
      this.checkoutItem.totalPrice = parseInt(this.checkoutItem.totalPrice) + parseInt(this.checkoutItem.discount);
      if(parseInt(this.checkoutItem.cashReceived)> parseInt(this.checkoutItem.totalPrice)){
        this.checkoutItem.change = parseInt(this.checkoutItem.cashReceived) - parseInt(this.checkoutItem.totalPrice);
      }else {
        this.checkoutItem.credit = parseInt(this.checkoutItem.totalPrice) - parseInt(this.checkoutItem.cashReceived);
      }
      this.checkoutItem.discount = '0';
      this.newDiscountPrice='';
      this.newDiscount ='';
    },

    calculatePayAmount(e){
      this.payAmount = e.target.value;
      // this.showPaymentBox = !this.showPaymentBox;
      console.log(this.sellNowActive)
      this.checkoutItem.change='0';
      if(this.selectedPaymentType!==''){
        let credit = 0;
        let change = 0;
        this.checkoutItem.paymentMethod = this.selectedPaymentType.paymentType
        this.checkoutItem.cashReceived = this.payAmount.toString();
        if(this.payAmount!==''){
          if(this.selectedCustomer!==''){
            this.sellNowActive = true;
          }
          if(parseInt(this.payAmount)<parseInt(this.checkoutItem.totalPrice)){
            credit = parseInt(this.checkoutItem.totalPrice)-parseInt(this.checkoutItem.cashReceived);
            this.checkoutItem.credit = credit.toString();
            this.checkoutItem.change = '0';
            if(this.selectedCustomer===''){
              this.sellNowActive = false;
              this.showWarning = true;
              this.warningMessage = this.$t('message.please_add_customer');
              this.customerAlert = true;
              // this.payAmount = '';
            }
          }else {
            this.checkoutItem.cashReceived='0';
            this.showWarning = false;
            this.customerAlert=false;
            this.warningMessage ='';
            this.checkoutItem.cashReceived = this.payAmount.toString();
            change = parseInt(this.checkoutItem.cashReceived) - parseInt(this.checkoutItem.totalPrice);
            this.checkoutItem.change = change.toString();
            this.checkoutItem.credit='0';
            this.sellNowActive = true;
          }
        }else {
          this.warningMessage = this.$t('message.enter_pay_amount');
          this.showWarning = true;
          this.checkoutItem.cashReceived='0';
          this.sellNowActive = false;
        }
      }else {
        this.warningMessage = this.$t('message.please_choose_payment')
        this.showWarning = true;
        setTimeout(()=>{
          this.showWarning = false;
        },3000)
      }

    },

    choosePaymentType(type){
      this.selectedPaymentType = type;
      this.checkoutItem.paymentMethod = type.paymentType;
      this.checkoutItem.paymentId = type.id;
      this.showPaymentToggle = !this.showPaymentToggle;
    },

    setCustomer(customer){
      this.customerAlert = false;
      this.showWarning = false;
      this.warningMessage='';
      this.selectedCustomer = customer;
      if(window.innerWidth<500){
        this.showCustomerBox= false;
        this.showVoucherBox = true;
      }
      this.checkoutItem.customerName = customer.name;
      this.checkoutItem.customerId = customer.id;
      this.checkoutItem.customerPhone = customer.phone;
      this.checkoutItem.customerAddress = customer.address;
      if(this.selectedCustomer!==''){
        if(this.payAmount!==''){
          this.sellNowActive = true;
          this.showWarning = false;
        }else {
          this.showWarning = true;
          this.sellNowActive = false;
          this.warningMessage = this.$t('message.enter_pay_amount')
        }
      }else {
        this.sellNowActive = false;
      }

    },

    removeCustomer(){
      if(this.checkoutItem.totalPrice>this.checkoutItem.cashReceived){
        this.sellNowActive = false;
        this.customerAlert = true;
      }else {
        this.sellNowActive = true;
        this.customerAlert = false;
      }
      this.selectedCustomer='';
      if(window.innerWidth<500){
        this.showCustomerBox= false;
        this.showPaymentBox = true;
        this.showVoucherBox = true;
      }
      this.checkoutItem.customerName = "";
      this.checkoutItem.customerId = "";
      this.checkoutItem.customerPhone = "";
      this.checkoutItem.customerAddress = "";
    },

    getSelectedRelation(){
      if(this.frontUnit!=='Pcs'){
        this.selectedRelation = this.selectedRelations.filter(relation => {
          return relation.frontUnit === this.frontUnit;
        });
      }else {
        this.selectedRelation = [];
      }

    },
    //selected products
    async selectForCart(product){
      this.selectedProduct ='';
      this.selectedRelations=[];
      this.selectedProduct = product;
      this.showDialog = true;
      /*await db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(product.id).collection('relation').onSnapshot(snapshot => {
        snapshot.forEach(doc=>{
          this.selectedRelations.push(doc.data())
        });
        this.search='';
      })*/
    },

    addToCart(product){
      let pcsNumber = 1;
      let relationSellPrice = '';
      //If there is relation in the selected product, get the backnumber and sell price
      if(this.selectedRelation.length>0){
        pcsNumber = parseInt(this.selectedRelation[0].backNumber);
        relationSellPrice = parseInt(this.selectedRelation[0].sellPrice);
      }else {
        relationSellPrice = product.sellPrice;
      }
      const sameId = this.selectedPurchaseProducts.findIndex(item => {
        return item.id === product.id;
      })

      if(this.selectedPurchaseProducts.some(e=>e.id === product.id && e.frontUnit === this.frontUnit)){
        this.selectedPurchaseProducts.forEach(item=>{
          if(item.frontUnit === this.frontUnit && item.id === product.id){
            let newStock = (this.frontNumber*pcsNumber);
            if(product.stock!==''){
              if(product.stock>=newStock){
                console.log('stock exist and count is less then stock');
                this.selectedPurchaseProducts.forEach(p=>{
                  if(p.id === product.id){
                    p.stock =parseInt(p.stock) - newStock;
                    console.log('update count', p.id)
                    // this.$store.commit("updateSelectedSellProduct", newStock,product.id)
                  }
                })
                // this.$store.state.selectedPurchaseProducts[sameId].stock = parseInt(this.selectedPurchaseProducts[sameId].stock)-newStock;
                item.frontNumber = parseInt(item.frontNumber) + parseInt(this.frontNumber);
                item.count += (item.backNumber*this.frontNumber);
                this.searchProduct=null;
                this.frontNumber =1;
                this.frontUnit = 'Pcs';
                this.selectedRelations=[];
                this.selectedRelation='';
                console.log('same id and same unit', item);
              }else {
                this.searchProduct=null;
                this.frontNumber =1;
                this.frontUnit = 'Pcs';
                this.selectedRelations=[];
                this.selectedRelation='';
                console.log('out of stock');
                this.infoModalActive = true;
                this.modalMessage = this.$t('message.out_of_stock');
              }
            }else {
              item.frontNumber = parseInt(item.frontNumber) + parseInt(this.frontNumber);
              item.count += (item.backNumber*this.frontNumber);
              this.searchProduct=null;
              this.frontNumber =1;
              this.frontUnit = 'Pcs';
              this.selectedRelations=[];
              this.selectedRelation='';
              console.log('same id and same unit', item);
            }
          }
        })
      }else {
        if(product.stock!==''){
          if(product.stock>=((this.frontNumber*pcsNumber))){
            let newStock = 0;
            // this.selectedPurchaseProducts.stock = product.stock -((this.frontNumber*pcsNumber));
            if(this.selectedPurchaseProducts.some(p=>p.id === product.id)){
              newStock = parseInt(this.selectedPurchaseProducts[sameId].stock)-((this.frontNumber*pcsNumber));
              this.selectedPurchaseProducts.forEach(p=>{
                if(p.id === product.id){
                  p.stock = newStock;
                  console.log('update count', p.id)
                  // this.$store.commit("updateSelectedSellProduct", newStock,product.id)
                }
              })
              console.log('new same id item stock: ',this.selectedPurchaseProducts[sameId].id);
              console.log(this.selectedPurchaseProducts[sameId]);
            }else {
              newStock =parseInt(product.stock)-((this.frontNumber*pcsNumber))
            }
            let myProduct = {
              'frontNumber':this.frontNumber,
              'count':pcsNumber*this.frontNumber,
              'frontUnit':this.frontUnit,
              'backNumber':pcsNumber,
              'sellPrice':relationSellPrice,
              'itemCode':product.itemCode,
              'barcode':product.barcode,
              'id':product.id,
              'type':product.type,
              'images':product.images,
              'itemName':product.itemName,
              'stock':newStock,
              'buyPrice':product.buyPrice,
              'description':product.description,
              'color':product.color,
              'size':product.size,
              'weight':product.weight,
              'rating':product.rating,
              'discount':product.discount
            }
            this.$store.commit('SET_SELECTED_SELL_PRODUCT', myProduct);
            this.searchProduct=null;
            this.frontNumber =1;
            this.frontUnit = 'Pcs';
            this.selectedRelations=[];
            this.selectedRelation='';
            console.log('different id and different unit');
          }else {
            this.searchProduct=null;
            this.frontNumber =1;
            this.frontUnit = 'Pcs';
            this.selectedRelations=[];
            this.selectedRelation='';
            console.log('out of stock');
            this.infoModalActive = true;
            this.modalMessage = this.$t('message.out_of_stock')
          }
        }else {
          let myProduct =  {
            'frontNumber':this.frontNumber,
            'count':pcsNumber*this.frontNumber,
            'frontUnit':this.frontUnit,
            'backNumber':pcsNumber,
            'sellPrice':relationSellPrice,
            'itemCode':product.itemCode,
            'barcode':product.barcode,
            'id':product.id,
            'type':product.type,
            'images':product.images,
            'itemName':product.itemName,
            'stock':'',
            'buyPrice':product.buyPrice,
            'description':product.description,
            'color':product.color,
            'size':product.size,
            'weight':product.weight,
            'rating':product.rating,
            'discount':product.discount
          }
          this.$store.commit('SET_SELECTED_SELL_PRODUCT', myProduct);
          this.searchProduct=null;
          this.frontNumber =1;
          this.frontUnit = 'Pcs';
          this.selectedRelations=[];
          this.selectedRelation='';
          console.log('different id and different unit',this.selectedPurchaseProducts);
        }
      }
      if(this.selectedPurchaseProducts.length>0){
        this.selectedPurchaseProducts.forEach(order=>{
          this.totalPrice += parseInt(order.sellPrice ) * parseInt(order.frontNumber);
        })
      }
    },
    countChangeHandler(order, index){
      if(order.frontNumber===''){
        order.frontNumber = 1;
      }
      this.$store.commit('updatePurchaseProductCount',{'index':index, 'count':order.frontNumber} )
    },
    sellPriceChangeHandler(order, index){
      if(order.sellPrice===''){
        order.buyPrice = 0;
      }
      this.$store.commit('updatePurchaseProductSellPrice',{'index':index, 'sellPrice':order.sellPrice} )
    },
    buyPriceChangeHandler(order, index){
      if(order.buyPrice===''){
        order.buyPrice = 0;
      }
      this.$store.commit('updatePurchaseProductBuyPrice',{'index':index, 'buyPrice':order.buyPrice} )
    },

    removeFromCart(index){
      this.$store.commit("removeSelectedPurchaseProduct", index)
    },
    //method for input change
    countChangeInput(order){
      let tempStock = order.stock;
      if(order.stock>order.count){
        order.stock = order.stock-order.count;
      }else {
        order.count=0;
        order.stock = tempStock;
      }
    },


    async showSearchProduct(){
      this.showSearch = true;
      this.selectedCategory = "All";
    },

    clearCart(){
      this.totalPrice = 0;
      this.newDiscount = 0;
      if(this.selectedSearchType === 'barcode'){
        this.$refs.barcodeSearch.focus();
      }
    },

    confirm(){
      this.confirmActive = !this.confirmActive;

    },

    cancel(){
      this.confirmActive = !this.confirmActive;
    },

    closeModal(){
      this.infoModalActive = !this.infoModalActive;
    },
    confirmItem(){
      this.magic_flag = true;
      if(this.selectedSearchType === 'barcode'){
        this.$refs.barcodeSearch.focus();

      }
      console.log('focus',this.magic_flag)
    },
    closeDialog(){
      if(this.selectedSearchType === 'barcode'){
        this.$refs.barcodeSearch.focus();
      }
      this.showDialog = !this.showDialog;

    },

    async printThis() {
      console.log("printing..");
      const el = this.$refs.printcontent;

      const options = {
        type: "dataURL",
      };
      const printCanvas = await html2canvas(el, options);

      const link = document.createElement("a");
      link.setAttribute('download', `${this.purchaseVoucher.vouncherId}.png`);
      link.setAttribute(
          "href",
          printCanvas
              .toDataURL("image/png")
              .replace("image/png", "image/octet-stream")
      );
      link.click();

      console.log("done");
    },

  },

}
</script>

<style scoped>
tr, td, th{
  color: var(--text-color) !important;
  background-color: var(--white) !important;
  border: 1px solid var(--light) !important;
}
.table-bottom{
  background-color: var(--light);
}
.table-bottom td{
  border-radius: 0px;
  border: none !important;
}



.table-voucher thead th, .table-voucher tbody td {
  border:2px solid var(--primary) !important;
}

.product-card{
  cursor: pointer;
  font-weight: bold;
  transition: 0.3s;
  text-align: center;
  padding: 5px;
}
.product-card:hover{
  background-color: var(--softPrimary)!important;
}

.product-box{
  padding-top: 5px;
  padding-left: 5px;
  position: sticky;
  padding-bottom: 100px;
  z-index: 1000;
  height: 80vh;
  overflow-y: scroll;
  overflow-x: hidden;
}
.category-list:hover{
  background-color: var(--primary);
}
.modal-body-box{
  height: 80vh;
  overflow-x: hidden;
  overflow-y: scroll;
}
.voucher-box{
  height: 80vh;
  border-radius: var(--border-radius);
  overflow-x: hidden;
  overflow-y: scroll;
}
.active-btn{
  background-color: var(--btnLight);
}
.selected-box{
  height: inherit;
  max-height: 80vh;
  overflow-y: scroll;
  overflow-x: hidden;
  padding-bottom: 100px;
}

.content-box{
  top:100px;
}
.customer-box{
  height: 79vh;
  color: var(--text-color) !important;
  background-color: var(--background-color) !important;
  border-radius: var(--border-radius) !important;
}
.discount-box{
  color: var(--text-color) !important;
  background-color: var(--background-color) !important;
  border-radius: var(--border-radius) !important;
}
.category-box{
  padding: 0;
  z-index: 1000;
  background-color: var(--side-bar-bg);
  border-radius: var(--border-radius);
  color: var(--text-color);
  position: sticky;
  box-sizing: border-box;
  width: 100%;
  margin-top:5px;
  margin-left: 0px;
  height: inherit;
  align-items: center;
}

.dropdown-item{
  cursor: pointer;
}

.category-box ul{
  padding:5px;
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
  margin-left: 5px;
  border-radius: var(--border-radius);
  background-color: var(--btnLight);
  transition: 0.3s;
}
.category-list-active{
  background-color: var(--softPrimary) !important;
}

.voucher-list-solid{
  border-top: 2px solid black;
}
.voucher-list-top{
  border-top: 2px dotted black;
}
.voucher-list-bottom{
  border-bottom: 2px dotted black;
}
.btn-group{
  width: 100%;
}
.check-btn{
  background-color: var(--secondary);
  border: none !important;
  width: 80px !important;
}
.btn-group .btn{
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

thead, tbody{
  border: none !important;
  color: var(--dark);
}


.modal-header{
  padding: 2px !important;
  margin:3px !important ;
}
.modal-body{
  padding: 5px !important;
}
@media only screen and (max-width: 1030px) {

}

.alert-warning{
  border-radius: var(--border-radius)!important;
}
.customer-card{
  background-color: var(--light)!important;
  transition: 0.3s;
  cursor: pointer;
}
.customer-card:hover{
  background-color: var(--softPrimary) !important;
}
.activeCustomer{
  background-color: var(--softPrimary)!important;
}
.voucher-modal{
  height: 70vh;
  overflow-y: scroll;
}
@media only screen and (max-width: 800px) {

  .category-box{
    width: 30%;
  }
  .selected-box{
    height: 70vh;
  }

}
.voucher-modal{
  height: 80vh;
}

@media only screen and (max-width: 500px) {
  .voucher-modal{
    height: inherit !important;
  }
  .voucher-box{
    height: inherit !important;
  }
  .modal-body-box{
    height: inherit !important;
  }

  .modal-body-box{
    height:75vh;
    overflow-x: hidden;
    overflow-y: scroll;
  }

  .category-box{
    width: 94%;

  }

}
</style>
