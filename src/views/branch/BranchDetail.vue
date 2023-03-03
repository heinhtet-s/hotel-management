<template>
  <div class="container-fluid"  style="background-color: var(--background-color);  color: var(--text-color);" >
    <div class="row">
      <div class="col-lg-2 p-0">
        <AdminSidebar/>
      </div>
      <div class="col-12 col-lg-10" v-if="shopInfo.packageStatus === 'ultra'|| shopInfo.packageStatus==='pro'">
        <div class="row mt-5">
          <div class="col-12 ">
            <div class="row">
              <div class="col-12">
                <button class="btn btn--white border-0" @click="$router.back()"><i class="fas fa-chevron-left"></i></button>
                <span class="fs-4">Branch Detail</span>
              </div>

              <div class="col-6">
                <div class="card p-1" style="background-color: var(--light)!important;">
                  <div class="d-flex align-items-center mb-3">
                    <img :src="branch.profileUrl" width="80" style="border-radius: var(--border-radius);">
                    <span class="fs-2 ms-2">
                      {{branch.name}}
                    </span>
                  </div>
                  <div class="py-3" style="border-top: 2px solid var(--side-bar-bg);">
                    <div><i class="fas fa-phone"></i><span class="ms-2 mb-1">{{branch.phone}}</span></div>
                    <div><i class="fas fa-location"></i><span class="ms-2">{{branch.address}}</span></div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-6" @click="showProductLists">
                    <div class="card p-2 d-flex align-items-center" :class="showProducts?'card-active':''">
                      <div class="icon-badge p-2"><i class="fas fa-layer-group fa-2x"></i></div>
                      <span>Products</span>
                    </div>
                  </div>
                  <div class="col-6" @click="showSellReportLists">

                    <div class="card p-2 d-flex align-items-center" :class="showSellReports?'card-active':''">
                      <div class="icon-badge p-2">
                        <i class="fas fa-square-poll-vertical fa-2x"></i>
                      </div>
                        <span>Sell Reports</span>
                    </div>
                  </div>
                  <div class="col-6" @click="showFinancialReport">
                    <div class="card p-2 d-flex align-items-center" :class="showFinancial?'card-active':''">
                      <div class="icon-badge p-2"><i class="fas fa-coins fa-2x"></i></div>
                      <span>Financial Reports</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-6" v-if="showProducts">
                <div class="">
                  <span class="fs-3">Products</span>
                  <ul class="text-start d-block list-unstyled border-0 align-center py-3">
                    <li class="d-inline-block mx-1 category-list" :class="selectedCategory==='All'?'category-list-active':''" style="background-color: var(--light);" @click="selectCategory('All')">
                      <span class="mx-2"> All</span>
                    </li>
                    <li v-for="(category, index) in productCategories" style="background-color: var(--light);" :key="index" class="category-list d-inline-block" :class="selectedCategory===category.name?'category-list-active':''" @click="selectCategory( category.name)">
                      <span class="mx-2">{{category.name}}</span>
                    </li>
                  </ul>
                  <div class="pe-1 d-flex">
                    <div class="dropdown">
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
                    </div>
                    <input type="text" v-model="search" @input="searchProduct" :placeholder="$t('message.search')" class="form-control mb-3 mx-2 ">
                  </div>
                </div>

                <div class="scroll-view px-0">
                   <div v-if="this.search!==''">
                    <div v-for="(product) in searchProducts" class="p-2 d-flex mb-2 justify-content-between align-items-start" style="background-color: var(--light)!important;border-radius: var(--border-radius);"  :key="product.id" @click="viewItemDetails(product)">
                      <div class="d-flex">
                        <img :src="product.images[0]" v-if="product.images.length>0" class="rounded border border-light border-3 shadow-sm" style="width:50px; height:50px; object-fit: cover;" alt="">
                        <img src="../../assets/flash/1.png" v-else class="rounded border border-light border-3 shadow-sm" style="width:50px; height:50px; object-fit: cover;" alt="">
                        <div class="d-flex flex-column ms-2">
                          <span>{{product.itemName}}</span>
                          <span class="text-black-50">{{product.barcode}}</span>
                          <span>{{product.sellPrice}} Ks</span>
                        </div>
                      </div>
                      <div class="d-flex flex-column align-items-end">
                        <i class="fas fa-chevron-right"></i>
                        <span class="mt-4">{{product.stock}} Pcs</span>
                      </div>

                    </div>
                  </div>
                  <div v-else>
                    <div v-for="(product) in filterProducts" class="p-2 d-flex mb-2 justify-content-between align-items-start" style="background-color: var(--light)!important;border-radius: var(--border-radius);" :key="product.id" @click="viewItemDetails(product)">
                      <div class="d-flex align-items-center">
                        <img :src="product.images[0]" v-if="product.images.length>0" class="rounded border border-light border-3 shadow-sm" style="width:60px; height:60px; object-fit: cover;" alt="">
                        <img src="../../assets/flash/1.png" v-else class="rounded border border-light border-3 shadow-sm" style="width:60px; height:60px; object-fit: cover;" alt="">
                        <div class="d-flex flex-column ms-2">
                          <span>{{product.itemName}}</span>
                          <span>{{product.barcode}}</span>
                          <span>{{product.sellPrice}}</span>
                        </div>
                      </div>
                      <div class="d-flex flex-column align-items-end">
                        <i class="fas fa-chevron-right"></i>
                        <span class="mt-4">{{product.stock}} Pcs</span>
                      </div>
                    </div>
                    </div>

                  </div>


              </div>
              <div class="col-6" v-if="showSellReports">
                <div class="">
                  <span class="fs-3">Sell Report</span>
                </div>
                <div class="btn-group p-1 w-100" role="group" aria-label="Basic radio toggle button group">
                  <input type="radio" class="btn-check" @click="showDaily" name="btnradio" id="btnradio1" autocomplete="off" checked>
                  <label class="btn check-btn" :class="dateType==='day'?'btn-primary':''"   for="btnradio1">{{ $t('message.daily') }}</label>

                  <input type="radio" class="btn-check" @click="showMonthly" name="btnradio" id="btnradio2" autocomplete="off">
                  <label class="btn check-btn" :class="dateType==='month'?'btn-primary':''"  for="btnradio2">{{ $t('message.monthly') }}</label>
                  </div>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="d-flex flex-column ">
                    <span class="text-primary">Income</span>
                    <span class="fs-4">{{total.toLocaleString()}} Ks</span>
                  </div>
                  <div>
                    <input type="date" @change="formatDate" class="form-control" v-if="dateType === 'day'">
                    <input v-if="dateType==='month'" type="month" @change="filterMonth" class="form-control border-1 border-secondary" style="background-color: var(--white)!important; border:1px solid gray!important;">
                  </div>
                </div>
                <div class="scroll-view">
                  <div class="card p-1 mb-2" style="background-color: var(--light) !important;" v-for="voucher in sellProducts" :key="voucher.id">
                    <div class="d-flex justify-content-between align-items-center">
                      <span>{{voucher.vouncherId}}</span>
                      <span>{{voucher.dateTime}}</span>
                    </div>
                    <span>{{voucher.totalPrice}} Ks</span>
                  </div>
                </div>

              </div>
              <div class="col-6" v-if="showFinancial">

                <div class="row">
                  <div>
                    <span class="fs-4">Financial Report</span>
                  </div>
                  <div class="col-12 d-flex justify-content-between">
                    <span class="fs-4">Daily Report</span>
                    <div>
                      <input type="date" @change="formatDateForFinancial" class="form-control" >
                    </div>
                  </div>
                  <div class="col-12 col-lg-6 col-md-6 ">

                    <div class="card">
                      <div class="card-body">
                        <div class="d-flex justify-content-between rounded">
                          <span style="color: var(--discountPrimary)">Income</span>
                        </div>
                        <h4 class=" mt-3">{{ paymentReceives.toLocaleString() }}Ks</h4>
                      </div>
                    </div>

                  </div>
                  <div class="col-12 col-lg-6 col-md-6">
                    <div class="card">
                      <div class="card-body">
                        <div class="d-flex justify-content-between rounded">
                          <span class="text-success">Expenses</span>
                          <i class="fas fa-chevron-right"></i>
                        </div>
                        <h4 class=" mt-3">{{ expenseTotalAmount.toLocaleString() }}Ks</h4>
                      </div>
                    </div>

                  </div>
                  <div class="col-12">
                    <div class="card">
                      <div class="card-body">
                        <span class="text-success">Remaining Amount</span>
                        <h4>{{(paymentReceives-expenseTotalAmount).toLocaleString()}} Ks</h4>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row mt-5" >
                  <span class="fs-4">Current Inventory</span>
                  <div class="col-12">
                    <div class="card mt-2">
                      <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                          <span class="fs-4">Monthly Report</span>
                          <div class="text-end">
                            {{selectedDate}}
                            <input type="month" @change="filterMonthForFnancial" placeholder="choose month" class="form-control">
                          </div>
                        </div>
                        <div class="d-flex justify-content-between" >
                          <div class="">
                            <div class="d-flex justify-content-between rounded">
                              <span style="color: var(--discountPrimary)">Total Invoice</span>
                            </div>
                            <h4 class="fw-bold mt-3">{{(sellProducts.length).toLocaleString()}}</h4>
                          </div>
                          <div class="text-end">
                            <span class="text-primary">Profit</span>
                            <h4 class="fw-bold mt-3 text-end">{{(this.resultMonthlyProfit).toLocaleString()}} Ks</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="card">
                      <div class="card-body d-flex justify-content-between" >
                        <div class="text-start">
                          <span class="text-primary">Capital</span>
                          <h4 class="fw-bold mt-3">{{capital.toLocaleString()}} Ks</h4>
                        </div>
                        <div class="text-end">
                          <span class="text-success">Profit</span>
                          <h4 class="fw-bold mt-3">{{ (sellIncome).toLocaleString() }} Ks</h4>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminSidebar from "@/components/AdminSidebar";
import db from "@/config/FirebaseInit";
import _ from "lodash";
export default {
  components:{AdminSidebar},
  data(){
    return{
      branch:'',
      search:'',
      selectedCategory:'All',
      products:[],
      productCategories:[],
      selectedSearchType:'itemName',
      searchProducts:[],
      sellProducts:[],
      total:0,
      selectedDate:'',
      dateType:'day',
      showProducts:true,
      showFinancial:false,
      showSellReports:false,

    //  financial
      expenseTotalAmount:'0',
      customers:'0',
      capital:0,
      sellIncome:0,
      profit:0,
      totalInvoice:'148',
      selectedDay:'',
      monthlyIncome:0,
      monthlyProfit:0,
      resultMonthlyProfit:0,
      paymentReceives:0,
    }
  },
  computed:{
    shopInfo(){
      return this.$store.getters.getShopInfo;
    },
    owner(){
      return this.$store.getters.getShopOwner;
    },
    cashierAcc(){
      return this.$store.getters.getCashierAcc;
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
    branches(){
      return this.$store.getters.getBranches;
    },
    selectedBranch(){
      return this.$store.getters.getSelectedBranch;
    },
    filterProducts(){
      let pLists = []
      if(this.selectedCategory!=='All'){
        this.products.forEach(doc=>{
          if(doc.itemName === this.selectedCategory){
            pLists.push(doc)
          }
        });
        return pLists
      }else {
        return this.products
      }
    }

  },
  mounted() {
    this.$store.dispatch("getCurrentShop");
    this.$store.dispatch("getShopInfo", this.owner);
    this.$store.dispatch("getCashierAcc",this.owner);
    this.$store.dispatch("getDay");
    this.$store.dispatch("getMonth");
    this.$store.dispatch("getYear");
    this.selectedDate = this.currentDay;

    if(this.selectedBranch!==''){
      this.branch = this.$store.getters.getSelectedBranch;
    }
    this.showProductLists();
    this.showProductCategories();
  },

  methods:{
    async showDaily(){
      this.dateType = 'day';
      this.selectedDate = this.currentDay;
      await this.getVoucher();
    },
    async showMonthly(){
      this.dateType = 'month';
      this.selectedDate = this.currentMonth;
      await this.getVoucher();
    },
    async filterMonth(e){
      let date = new Date(e.target.value)
      let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
      let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
      this.selectedDate = month+"-"+year;

      this.dateType = 'month';
      await this.getVoucher();
    },
    async formatDate(e){
      let date = new Date(e.target.value);
      let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
      let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
      let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
      let payload = day+"-"+month+"-"+year;
      this.selectedDate = payload;
      this.dateType='day';
      await this.getVoucher();
    },
    showFinancialReport(){
      this.showFinancial = true;
      this.showProducts = false;
      this.showSellReports = false;
      this.calculateCapital();
      this.calculateProfit();
      this.getSellProduct(this.selectedDate);
      this.getPaymentReceives();
      this.getExpenseAmount();
    },
    async getVoucher(){
      this.sellProducts =[];
      this.total = 0;

      //financial
      this.sellProducts=[];
      this.monthlyIncome =0;
      this.monthlyProfit=0;
      this.resultMonthlyProfit = 0;

      await db.collection(this.$route.params.city).doc(this.$route.params.branch_id).collection('sellProducts').where(this.dateType,'==',this.selectedDate).onSnapshot(snapshot => {
        snapshot.forEach(doc=>{
          this.sellProducts.push(doc.data());
          this.total+=parseInt(doc.data().totalPrice);
          for(let i = 0; i<doc.data().countList.length;i++){
            this.monthlyIncome += parseInt(doc.data().buyPriceList[i]) * parseInt(doc.data().countList[i]);
          }
          this.monthlyProfit +=parseInt(doc.data().totalPrice);
        });
        this.resultMonthlyProfit = this.monthlyProfit - this.monthlyIncome;

      })
    },
    async showSellReportLists(){
      this.showFinancial = false;
      this.showProducts = false;
      this.showSellReports = true;
     await this.getVoucher();

    },

    //Products
    showProductCategories(){
      db.collection(this.$route.params.city).doc(this.$route.params.branch_id).collection('category').onSnapshot(snapshot => {
        snapshot.forEach(doc=>{
          if(doc.data().name!=='All')
          this.productCategories.push(doc.data())
        })
      })
    },
    showProductLists(){
      this.showFinancial = false;
      this.showProducts = true;
      this.showSellReports = false;
      this.products=[];
      db.collection(this.$route.params.city).doc(this.$route.params.branch_id).collection('products').onSnapshot(snapshot => {
        snapshot.forEach(doc=>{
          this.products.push(doc.data())
        })
      })
    },
    viewItemDetails(){

    },
    selectCategory(name){
      this.selectedCategory = name;


    },
    selectSearchType(type){
      this.selectedSearchType = type;
    },
    searchProduct:_.debounce(function (){
      if(this.search!==''){
        if(this.selectedSearchType==='barcode' || this.selectedSearchType === 'itemCode'){
          db.collection(this.branch.city)
              .doc(this.branch.id)
              .collection('products').where(this.selectedSearchType,'==',this.search).onSnapshot(snapshot => {
            this.searchProducts= [];
            snapshot.forEach(doc=>{
              this.searchProducts.push(doc.data())
            })
          })
        }else{
          db.collection(this.branch.city)
              .doc(this.branch.id)
              .collection('products').orderBy(this.selectedSearchType).startAt(this.search).endAt(this.search+'~').onSnapshot(snapshot=>{
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

  //  financial

    async getExpenseAmount(){
      await db.collection(this.$route.params.city).doc(this.$route.params.branch_id).collection('expenses').where('date','==',this.selectedDay).onSnapshot(snapshot=>{
        this.expenseTotalAmount=0;
        snapshot.forEach(doc=>{
          this.expenseTotalAmount += parseInt(doc.data().amount);
        })
      })
    },
    async getPaymentReceives(){
      await db.collection(this.$route.params.city).doc(this.$route.params.branch_id).collection('paymentReceived').where('day','==',this.selectedDay).onSnapshot(snapshot=>{
        this.paymentReceives=0;
        snapshot.forEach(doc=>{
          this.paymentReceives += parseInt(doc.data().receivedAmount);
        })
      })
    },
    async getSellProduct(month){
      await db.collection(this.$route.params.city).doc(this.$route.params.branch_id).collection('sellProducts').where('month','==',month).get().then(snapshot => {
        this.sellProducts=[];
        this.monthlyIncome =0;
        this.monthlyProfit=0;
        this.resultMonthlyProfit = 0;
        snapshot.forEach(doc=>{
          for(let i = 0; i<doc.data().countList.length;i++){
            this.monthlyIncome += parseInt(doc.data().buyPriceList[i]) * parseInt(doc.data().countList[i]);
          }
          this.monthlyProfit +=parseInt(doc.data().totalPrice);

          this.sellProducts.push(doc.data())
        })
        this.resultMonthlyProfit = this.monthlyProfit - this.monthlyIncome;
      })
    },
    calculateCapital(){
      this.capital = 0;
      for(let i =0; i< this.products.length;i++){
        if(this.products[i].stock) {
          this.capital += parseInt(this.products[i].buyPrice)*parseInt(this.products[i].stock);
        }
      }
    },
    calculateProfit(){
      this.getVoucher();
      let myCapital = 0;
      let myIncome = 0;
      for(let i =0; i< this.products.length;i++){
        if(this.products[i].stock){
          let sellPrice = 0;
          if(parseInt(this.products[i].discount)>0){
            sellPrice = parseInt(this.products[i].sellPrice)-(parseInt(this.products[i].sellPrice)*(parseInt(this.products[i].discount)/100))
          }else {
            sellPrice= this.products[i].sellPrice;
          }
          myCapital += parseInt(this.products[i].buyPrice)*parseInt(this.products[i].stock)
          myIncome +=parseInt(sellPrice)*parseInt(this.products[i].stock);
        }
      }
      this.sellIncome = myIncome - myCapital;

    },
    formatDateForFinancial(e){
      const date = new Date(e.target.value);
      let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
      let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
      let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
      let payload = day+"-"+month+"-"+year;
      console.log(payload);
      this.selectedDay = payload;
      this.dateType = 'day';
      this.getExpenseAmount();
    },
    async filterMonthForFnancial(e) {
      let date = new Date(e.target.value)
      let month = new Intl.DateTimeFormat('en', {month: 'short'}).format(date);
      let year = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(date);
      this.selectedDate = month + "-" + year;
      this.dateType = 'month'
      await this.getVoucher();
    }


  }
}
</script>

<style scoped>
.check-btn{
  width: 80px !important;
}
.btn-group{
  width: 35%;
}
.btn-group .btn{
  border-radius: 0px !important;
}
.btn-check{
  border-radius: var(--border-radius) !important;
}
.btn{
  border: 2px solid var(--primary);
  box-shadow: none !important;
  outline: none !important;
}
.btn-primary{
  background-color: var(--primary) ;
  color: white;
}
.icon-badge{
  border-radius: var(--border-radius);
  background-color: var(--softPrimary);
  justify-content: center;
  align-items: center;
}
r{
  cursor: pointer;
  color: var(--text-color) !important;
}
thead, tbody{
  border: 1px solid var(--light) !important;
  color: var(--dark);
}
.category-box{
  /*z-index: 1000;*/
  /*background-color: var(--side-bar-bg);*/
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
  width: 85%;
  padding: 5px;
  border-radius: var(--border-radius);
  background-color: var(--side-bar-bg);
  height: inherit;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  box-sizing: border-box;
}
.scroll-view{
  height: 65vh;
  overflow-y: scroll;
  padding-bottom: 100px;
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
}
.card, .card-body{
  cursor: pointer;
  background-color: var(--light) !important;
  transition: 0.3s;
}
.card-active{
  background-color: var(--softPrimary) !important;
}


</style>