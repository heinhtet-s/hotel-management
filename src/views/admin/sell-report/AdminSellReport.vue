<template>
  <AdminNavigation>
    <div class="container-xxl" style="background-color: var(--background-color);">
      <div class="row">
        <Loading v-if="loadingActive"/>


        <div class="modal fade" id="exampleModal" style="z-index: 10005" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content bg-light " style="border-radius: var(--border-radius); border: none">
              <div class="modal-header align-items-center">
                <button class="btn" style="background-color: var(--btnLight);" @click="printThis"><i class="fas fa-save"></i></button>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body bg-white p-2">
                <div class=" px-lg-5 bg-white p-2" id="printcontent" ref="printcontent">
                  <div class="text-center mt-2">
                    <div class="d-flex align-items-center mt-2">
                      <img :src="shopInfo.profileUrl" style="border-radius: var(--border-radius);" width="150" height="150" alt="">
                      <span class="fs-5 fw-bold text-start ms-2">{{shopInfo.name}}</span>
                    </div>
                    <p class="mt-2 fw-bold">{{shopInfo.address}}</p>
                    <p>Ph: {{shopInfo.phone}}</p>
                  </div>
                  <div class="d-flex flex-column fw-bold text-start" style="border-top: 2px solid gray;">
                    <span>Voucher No: {{this.selectedProduct.vouncherId}}</span>
                    <span v-if="showName==='true' && selectedProduct.customerName!==''">Customer Name: {{selectedProduct.customerName}}</span>
                    <span v-if="showPhone==='true' && selectedProduct.customerPhone!==''">Customer Phone:{{selectedProduct.customerPhone}}</span>
                    <span>Date: {{this.selectedProduct.dateTime}}</span>

                  </div>
                  <div class="text-start d-flex justify-content-between mb-1 voucher-list">
                    <span class="fw-bold">Items</span>
                    <span class="fw-bold">Price</span>
                  </div>
                  <div class="voucher-list"></div>
                  <div class="d-flex text-start align-items-start justify-content-between mb-1 fw-bold" v-for="(name,index) in selectedProduct.nameList" :key="index">
                    <p class="w-50 text-start">{{ name }} ({{ selectedProduct.countList[index]}} {{selectedProduct.productUnitList?selectedProduct.productUnitList[index]:''}} x {{ selectedProduct.sellPriceList[index]}})</p>
                    <p class="w-50 text-end ">{{ costPerItem[index] }} Ks</p>
                  </div>
                  <div class="voucher-list"></div>

                  <div class="d-flex justify-content-between fw-bold py-1">
                    <span>SubTotal</span>
                    <span>{{costPerItem.reduce((a,b)=>a+b)}} Ks</span>
                  </div>

                  <div class="d-flex justify-content-between fw-bold py-1" v-if="selectedProduct.tax!=='0'">
                    <span>Tax({{selectedProduct.tax}})%</span>
                    <span v-if="costPerItem.length>0">{{selectedProduct.totalPrice*(selectedProduct.tax/100)}} Ks</span>
                  </div>

                  <div class="d-flex justify-content-between fw-bold py-1" v-if="selectedProduct.discount>0">
                    <span>Discount</span>
                    <span>{{selectedProduct.discount}} Ks</span>
                  </div>

                  <div class="d-flex justify-content-between fw-bold voucher-list ">
                    <span>Total</span>
                    <span>{{ selectedProduct.totalPrice }} Ks</span>
                  </div>
                  <div class="d-flex justify-content-between fw-bold voucher-list  py-1" v-if="selectedProduct.cashReceived">
                    <span>Cash Received ({{this.selectedProduct.paymentMethod}})</span>
                    <span>{{ selectedProduct.cashReceived }} Ks</span>
                  </div>
                  <div class="d-flex justify-content-between fw-bold voucher-list py-1" v-if="selectedProduct.credit && selectedProduct.credit>0">
                    <span>Credit</span>
                    <span>{{ selectedProduct.credit }} Ks</span>
                  </div>
                  <div class="d-flex justify-content-between fw-bold voucher-list py-1" v-if="selectedProduct.change && selectedProduct.change>0">
                    <span>Change</span>
                    <span>{{ selectedProduct.change }} Ks</span>
                  </div>
                  <div class="d-flex flex-column text-center">
                    <span class="fs-4 fw-bold">Thank You!</span>
                    <span>Power by Light Idea Software Development</span>
                  </div>
                </div>
                <!--              <button class="btn btn-primary mx-auto w-50 mt-5">Print</button>-->
              </div>
              <div class="modal-footer d-flex">
                <!--                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>-->
                <button class="btn btn-primary mx-auto my-2" v-print="'#printcontent'" data-bs-dismiss="modal">Print Voucher</button>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 p-0"  style="color: var(--text-color);">
          <div class="pb-1 shadow-sm" style="position: sticky;z-index: 1000; top:40px;background-color: var(--background-color);">
            <div class="d-lg-flex d-md-flex align-items-center rounded justify-content-between mb-2 pt-3" >
              <div class="d-flex align-items-center">
                <button @click="this.$router.back()" style="color: var(--text-color);" class="btn border-0 float-start"><i class="fas fa-chevron-left"> </i> {{ $t('message.invoices') }}</button>

              </div>
              <div class="btn-group p-1" role="group" aria-label="Basic radio toggle button group">
                <input type="radio" class="btn-check" @click="showDaily" name="btnradio" id="btnradio1" autocomplete="off" checked>
                <label class="btn check-btn" :class="dateType==='day'?'btn-primary':''"   for="btnradio1">{{ $t('message.daily') }}</label>

                <input type="radio" class="btn-check" @click="showMonthly" name="btnradio" id="btnradio2" autocomplete="off">
                <label class="btn check-btn" :class="dateType==='month'?'btn-primary':''"  for="btnradio2">{{ $t('message.monthly') }}</label>

                <input type="radio" class="btn-check" @click="showYearly" name="btnradio" id="btnradio3" autocomplete="off">
                <label class="btn check-btn " :class="dateType==='year'?'btn-primary':''"  for="btnradio3">{{$t('message.yearly')}}</label>
              </div>
            </div>
            <div class="">
              <div class="d-flex flex-lg-row flex-column justify-content-lg-between px-2">
                <div class="d-flex">
                  <div class="d-flex p-1 mb-1" style="background-color: var(--light);border-radius: var(--border-radius);">
                    <span class="badge my-1 d-flex align-items-center me-1" style="background-color: var(--discountPrimary); border-radius: var(--border-radius);">{{filterInvoices.length}}</span>
                    <span class="d-flex align-items-center">{{income.toLocaleString()}} Ks</span>
                  </div>
                  <div class="d-flex align-items-center ms-2">
                    <!--                  @keyup.enter="searchByVoucherId"-->
                    <input type="text" class="form-control" v-model="search" @focus="this.searchInvoices=[]"  :placeholder="$t('message.enter_voucher_id')">
                  </div>
                </div>
                <div class="date-panel">
                  <div class="d-flex align-items-center rounded">

                    <input type="date" @change="formatDate" class="form-control" v-if="dateType === 'day'">
                    <input v-if="dateType==='month'" type="month" @change="filterMonth" class="form-control border-1 border-secondary" style="background-color: var(--white)!important; border:1px solid gray!important;">

                    <NextDatePicker v-if="dateType==='year'"  v-model:value="selectedYear" class="border-1 border-secondary" @change="yearChange" type="year" placeholder="Select year"></NextDatePicker>


                    <select class="form-select border-0 form-control mx-1 w-50" @change="onChange($event)" aria-label="Default select example">
                      <option value="All" selected>{{ $t('message.all') }}</option>
                      <option value="offlineSell">{{$t('message.in_shop_sell')}}</option>
                      <option value="onlineSell">{{$t('message.online_sell')}}</option>
                      <option value="liveSell">{{$t('message.live_sell')}}</option>
                    </select>
                    <vue-excel-xlsx
                        :data="filterExportData"
                        :columns="columns"
                        :file-name="fileName"
                        :file-type="'xlsx'"
                        :sheet-name="fileName"
                        class="btn btn-success ms-2 d-flex align-items-center border-success border-2"
                    >
                      <i class="fas fa-file-excel"></i><span class="ms-1"></span>
                    </vue-excel-xlsx>
                  </div>
                </div>
              </div>

            </div>

          </div>
          <div class="card-body table-responsive mt-5 ">
            <table class="table table-bordered">
              <thead >
              <tr class="border-bottom-0">
                <th class="text-nowrap text-center ">#</th>
                <th class="text-nowrap text-center">{{ $t('message.sell_type') }}</th>
                <th class="text-nowrap text-center">{{ $t('message.voucher_no') }}</th>
                <th class="text-nowrap text-center">{{ $t('message.customer_name') }}</th>
                <th class="text-nowrap text-center">{{ $t('message.total') }}</th>
                <th class="text-nowrap text-center">{{ $t('message.date') }}</th>
                <th class="text-nowrap">{{ $t('message.control') }}</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(order,index) in filterInvoices" :key="index" class="align-middle" >
                <td class="text-nowrap">
                  {{index+1}}
                </td>
                <td class="">
                  <span class="badge" style="width: 100px; background-color: var(--side-bar-bg);color: var(--text-color);" v-if="order.sellType == 'onlineSell'">Online Sell</span>
                  <span class="badge" style="width: 100px; background-color: var(--secondary);" v-if="order.sellType == 'offlineSell'">In Shop Sell</span>
                  <span class="badge" style="width: 100px; background-color: var(--discountPrimary);" v-if="order.sellType == 'liveSell'">Live Sell</span>
                </td>
                <td class="text-nowrap">
                  {{order.vouncherId}}
                </td>
                <td class="text-nowrap">
                  {{order.customerName || 'Unknown'}}
                </td>
                <td class="text-nowrap text-end">{{parseInt(order.totalPrice).toLocaleString()}} Ks</td>
                <td class="text-nowrap text-end">
                  <span> {{order.dateTime}}</span><br/>
                  <span style="color: var(--secondary);font-size: 12px;">{{order.note}}</span>
                </td>
                <td class="">
                  {{order.customerId}}
                  <router-link style="background-color: var(--live-bg); border-radius: var(--border-radius);" :to="{name:'AdminRefund',params:{customer_id:order.customerId, voucher_id:order.id}}" class="btn border-0 btn-sm d-block text-white">{{ $t('message.refund') }} </router-link>
                  <router-link style="background-color: var(--side-bar-bg); border-radius: var(--border-radius);" :to="{name:'AdminCustomerDetail',params:{customer_id:order.customerId, voucher_id:order.id}}" class="btn border-0 d-block mt-1 btn-sm"><i class="fas fa-info-circle"></i> {{$t('message.details')}}</router-link>
                </td>
              </tr>
              </tbody>
            </table>
            <pagination
                :totalPages="pageCount"
                :perPage="perPage"
                :currentPage="currentPage"
                :pages="invoices"
                @pagechanged="onPageChange"
            />
          </div>
        </div>
      </div>
    </div>

  </AdminNavigation>

</template>

<script>
import db from "@/config/FirebaseInit";
import html2canvas from "html2canvas";
import AdminNavigation from "@/components/AdminNavigation";
import Loading from "@/components/Loading";
import Pagination from "@/components/Pagination";

export default {
  components:{AdminNavigation, Loading, Pagination},
  name:'AdminSellReport',
  data(){
    return{
      //pagination
      currentPage:0,
      perPage:10,
      //end pagination
      filterData:[],
      selectedDate:'',
      fileName:'',
      selectedSellType:'All',
      search:'',
      selectedYear:'',
      showVCalendar:false,
      dateType:'day',
      totalPrice:0,
      income:0,
      costPerItem:[0],
      days:[],
      loadingActive:false,
      invoices:[],
      searchInvoices:[],
      selectedProduct:'',
      user:'',
      owner:'',
      columns : [
        {
          label: "Voucher Id",
          field: "voucher-id"
        },
        {
          label: "Sell Type",
          field: "sellType",
        },

        {
          label:"Item List",
          field: 'orderItems'
        },
        {
          label:"Count List",
          field: 'orderCounts'
        },
        {
          label:"Price List",
          field: 'orderPrices'
        },
        {
          label:"Total Price",
          field: 'totalPrice'
        },

        {
          label: "Date",
          field: "date",
        },
        {
          label:"Note",
          field: 'note'
        },
        {
          label: "Customer Name",
          field: "customer-name",
        },
        {
          label: "Customer Phone",
          field: "customer-phone",
        }
      ],
    }
  },
  computed:{
    pageCount(){
      return Math.ceil(this.invoices.length/this.perPage)
    },

    offsetCount(){
      return this.currentPage*this.perPage
    },
    showName(){
      return localStorage.getItem('showCustomerName');
    },
    showPhone(){
      return localStorage.getItem('showCustomerPhone');
    },
    shopInfo(){
      return this.$store.getters.getShopInfo;
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
    filterInvoices(){
      let filterInv = [];
      if(this.selectedSellType!=='All'){
        for(let i = 0; i<this.invoices.length;i++){
          if(this.invoices[i].sellType === this.selectedSellType){
            filterInv.push(this.invoices[i]);
          }
        }
        return filterInv.slice(this.offsetCount, this.offsetCount + this.perPage);

        //return filterInv;
      }else if(this.search!==""){
        filterInv = this.invoices.filter(inv=>inv.vouncherId.toLowerCase().includes(this.search.toLowerCase()))
        console.log('filtering',filterInv)
        return filterInv.slice(this.offsetCount, this.offsetCount + this.perPage);
      }
      else {
        return this.invoices.slice(this.offsetCount, this.offsetCount + this.perPage);
      }
    },
    dates() {
      return this.days.map(day => day.date);
    },
    attributes() {
      return this.dates.map(date => ({
        highlight: true,
        dates: date,
      }));
    },
    filterExportData(){
      if(this.selectedSellType!=='All'){
        let filterInv = [];
        for(let i = 0; i<this.invoices.length;i++){
          if(this.invoices[i].sellType === this.selectedSellType){
            filterInv.push(this.invoices[i]);
          }
        }
        return filterInv;
      }else {
        return this.filterData;
      }
    },
  },
  async created() {
    this.$store.dispatch("getDay");
    this.$store.dispatch("getMonth");
    this.$store.dispatch("getYear");
    this.fileName=this.currentDay+'-invoices';
    this.selectedDate = this.currentDay;
    await db.collection('shopRegistration').doc(this.$route.params.shop_id).get().then(async(result)=> {
      this.owner = result.data();
      console.log('owner',this.owner)
      await db.collection(this.owner.city).doc(this.owner.shopId).collection('sellProducts').where('day', '==', this.currentDay).orderBy('time', 'desc').onSnapshot(snapshot => {
        this.invoices = [];
        this.income = 0;
        this.filterData = [];
        snapshot.forEach(doc => {
          this.invoices.push(doc.data())
          this.income += parseInt(doc.data().totalPrice);
          this.addToFilterOrders(doc.data())
        })
      })
    });
  },
  methods:{
    onPageChange(page) {
      console.log(page)
      this.currentPage = page;
    },
    searchByVoucherId(){
      if(this.search!==''){
        db.collection(this.owner.city)
            .doc(this.owner.shopId)
            .collection('sellProducts').where('vouncherId','==',this.search).onSnapshot(snapshot=>{
          this.searchInvoices = [];
          snapshot.docs.filter(e=>{
            this.searchInvoices.push(e.data());
            console.log(this.searchInvoices)
          })
        })
      }else {
        this.searchInvoices = [];
      }
    },

    onChange(e){
      this.search = '';
      this.selectedSellType = e.target.value;
     // console.log(this.selectedSellType)
    },

    addToFilterOrders(doc){
      const exportData ={
        'voucher-id':doc.vouncherId,
        'sellType':doc.sellType,
        'orderItems':doc.nameList.join(),
        'orderCounts':doc.countList.join(),
        'orderPrices':doc.sellPriceList.join(),
        'totalPrice':doc.totalPrice,
        'date':doc.dateTime,
        'note':doc.note,
        'customerName':doc.customerName,
        'customerPhone':doc.customerPhone,
      }
      this.filterData.push(exportData)
      //console.log(this.filterData)
    },

    async yearChange(){
      let date = new Date(this.selectedYear)
      this.selectedDate = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
      this.fileName=this.selectedDate+'-sell-report';
      this.dateType = 'year';
      await this.getVoucher();
    },
    async showDaily(){
      this.dateType = 'day';
      this.selectedDate = this.currentDay;
      this.fileName = this.selectedDate+'-daily-sell-report';
      await this.getVoucher();
    },
    async showMonthly(){
      this.dateType = 'month';
      this.selectedDate = this.currentMonth;
      this.fileName = this.selectedDate+'-monthly-sell-report'
      await this.getVoucher();
    },
    async showYearly(){
      this.dateType='year';
      this.selectedDate = this.currentYear;
      this.fileName = this.selectedDate+'-yearly-sell-report';
      await this.getVoucher();
    },
    async getVoucher(){
      this.invoices=[];
      this.income=0;
      this.filterData=[];
      await db.collection(this.owner.city).doc(this.owner.shopId).collection('sellProducts').where(this.dateType,'==',this.selectedDate).orderBy('time','desc').onSnapshot(snapshot => {
        snapshot.forEach(doc=>{
          this.invoices.push(doc.data())
          this.income +=parseInt(doc.data().totalPrice);
          this.addToFilterOrders(doc.data());
        });

        console.log('snap size', snapshot.size);
      })
    },

    async filterMonth(e){
      let date = new Date(e.target.value)
      let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
      let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
      this.selectedDate = month+"-"+year;
      console.log(this.selectedDate)
      this.fileName=this.selectedDate+'-sell-report';
      this.dateType = 'month';
      await this.getVoucher();
    },

    formatDate(e){
      let date = new Date(e.target.value);
      let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
      let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
      let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
      // return  day+"-"+month+"-"+year;
      let payload = day+"-"+month+"-"+year;
      this.selectedDate = payload;
      this.dateType='day';
      this.getVoucher();
    },

    printVoucher(){
      // Get HTML to print from element
      const prtHtml = document.getElementById('printcontent').innerHTML;

// Get all stylesheets HTML
      let stylesHtml = '';
      for (const node of [...document.querySelectorAll('link[rel="stylesheet"], style')]) {
        stylesHtml += node.outerHTML;
      }

// Open the print window
      const WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');

      WinPrint.document.write(`<!DOCTYPE html>
      <html>
        <head>
          ${stylesHtml}
        </head>
        <body>
          ${prtHtml}
        </body>
      </html>`);

      WinPrint.document.close();
      WinPrint.focus();
      WinPrint.print();
      WinPrint.close();

    },

    viewDetails(order){
      this.costPerItem = [];
      this.selectedProduct = order;
      this.totalPrice = 0;
      //console.log(this.selectedProduct)
      for(let i =0 ;i<this.selectedProduct.countList.length;i++){
        this.costPerItem.push(parseInt(this.selectedProduct.sellPriceList[i])*parseInt(this.selectedProduct.countList[i]))
      }
      this.costPerItem.forEach(price=>{
        this.totalPrice += parseInt(price);
      })
    },

    async printThis() {
      console.log("printing..");
      const el = this.$refs.printcontent;

      const options = {
        type: "dataURL",
      };
      const printCanvas = await html2canvas(el, options);

      const link = document.createElement("a");
      link.setAttribute('download', `${this.selectedProduct.vouncherId}.png`);
      link.setAttribute(
          "href",
          printCanvas
              .toDataURL("image/png")
              .replace("image/png", "image/octet-stream")
      );
      link.click();

      console.log("done");
    },
  }
}
</script>

<style scoped>
.date-box{
  right: 100px;
  top:150px;
}
tr{
  color: var(--text-color);
  cursor: pointer;
}
ol, ul{
  list-style-type: none;
  padding: 0;
  color: var(--text-color);


}
.main-list li{
  color: var(--text-color) !important;
  text-align: start;
  font-size: 12px;
  height: 20px;
  background-color: var(--light);
  border-radius: var(--border-radius);
  color: var(--dark);
  margin: 2px;
  display: flex;
  padding: 2px;
}

.voucher-list{
  border-top: 2px dashed black;
}
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
thead, tbody{
  border: 1px solid var(--softPrimary) !important;
  color: var(--dark);
}

.date-panel{
  width: 35%;
}
.route-active{
  border-bottom: 2px solid var(--primary);
}

@media only screen and (max-width: 1030px) {

  .date-box{
    left: 10px;
    top:210px;
  }

}
@media only screen and (max-width: 500px) {

  .date-panel {
    width: 100%;
  }
  .btn-group{
    width: 100%;
  }
  .date-box{
    left: 10px;
    top:252px;
  }
}
</style>