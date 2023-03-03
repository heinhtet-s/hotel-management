<template>
  <AdminSidebar>
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
              <div class="d-flex flex-column fw-bold text-start" style="border-top: 2px solid gray;">
                <span>Voucher No: {{this.selectedProduct.voucherId}}</span>
                <span>Date: {{this.selectedProduct.dateTime}}</span>

              </div>
              <div class="text-start d-flex justify-content-between mb-1 voucher-list">
                <span class="fw-bold">Items</span>
                <span class="fw-bold">Price</span>
              </div>
              <div class="voucher-list"></div>
              <div class="d-flex text-start align-items-start justify-content-between mb-1 fw-bold" v-for="(name,index) in selectedProduct.nameList" :key="index">
                <p class="w-50 text-start">{{ name }} ({{ selectedProduct.countList[index]}} {{selectedProduct.productUnitList?selectedProduct.productUnitList[index]:''}} x {{ selectedProduct.buyPriceList[index]}})</p>
                <p class="w-50 text-end ">{{ costPerItem[index] }} Ks</p>
              </div>
              <div class="voucher-list"></div>
              <div class="d-flex justify-content-between fw-bold py-1">
                <span>SubTotal</span>
                <span>{{costPerItem.reduce((a,b)=>a+b)}} Ks</span>
              </div>

              <div class="d-flex justify-content-between fw-bold py-1" v-if="selectedProduct.discount>0">
                <span>Discount</span>
                <span>{{selectedProduct.discount}} Ks</span>
              </div>

              <div class="d-flex justify-content-between fw-bold voucher-list ">
                <span>Total</span>
                <span>{{ selectedProduct.totalPrice }} Ks</span>
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

    <div class="pb-1" style="position: sticky; color:var(--text-color) !important;z-index: 1000; top:5px;background-color: var(--background-color);">
      <div class="d-lg-flex d-md-flex align-items-center rounded justify-content-between mb-2 pt-3" >
        <div class="d-flex align-items-center">
          <router-link class="btn border-0" style="color:var(--text-color) !important;" :to="{name:'PurchaseVoucher'}">
            <i class="fas fa-chevron-left"></i>
            <span class="fs-4 ms-3" style="color:var(--text-color) !important;">{{$t('message.purchase_lists')}}</span>
          </router-link>
        </div>
        <div class="btn-group p-1"  role="group" aria-label="Basic radio toggle button group">
          <input type="radio" class="btn-check" @click="showDaily" name="btnradio" id="btnradio1" autocomplete="off" checked>
          <label class="btn check-btn" style="color:var(--text-color) !important;" :class="dateType==='day'?'btn-primary':''"   for="btnradio1">{{ $t('message.daily') }}</label>

          <input type="radio" class="btn-check" @click="showMonthly" name="btnradio" id="btnradio2" autocomplete="off">
          <label class="btn check-btn" style="color:var(--text-color) !important;" :class="dateType==='month'?'btn-primary':''"  for="btnradio2">{{ $t('message.monthly') }}</label>

          <input type="radio" class="btn-check" @click="showYearly" name="btnradio" id="btnradio3" autocomplete="off">
          <label class="btn check-btn "  style="color:var(--text-color) !important;" :class="dateType==='year'?'btn-primary':''"  for="btnradio3">{{$t('message.yearly')}}</label>
        </div>
      </div>
      <div class="">
        <div class="d-flex flex-lg-row flex-column justify-content-lg-between px-2">
          <div class="d-flex justify-content-between">
            <div class="d-flex p-1 mb-1" style="background-color: var(--light);border-radius: var(--border-radius);">
              <span class="badge my-1 d-flex align-items-center me-1" style="background-color: var(--discountPrimary); border-radius: var(--border-radius);">{{filterInvoices.length}}</span>
              <span class="d-flex align-items-center">{{income.toLocaleString()}} Ks</span>
            </div>
            <div class="d-flex align-items-center ms-2">
              <input type="text" class="form-control" v-model="search" :placeholder="$t('message.enter_voucher_id')">
            </div>
          </div>
          <div class="date-panel">
            <div class="d-flex align-items-center rounded">
              <input type="date" ref="datePicker" @change="formatDate" class="form-control" v-if="dateType === 'day'">

              <input v-if="dateType==='month'" type="month" @change="filterMonth" class="form-control border-1 border-secondary" style="background-color: var(--white)!important; border:1px solid gray!important;">

              <NextDatePicker v-if="dateType==='year'"  v-model:value="selectedYear" class="border-1 border-secondary" @change="yearChange" type="year" placeholder="Select year"></NextDatePicker>


            </div>
          </div>
        </div>

      </div>

    </div>
    <div class="card-body table-responsive " style="height: 68vh; overflow-y: scroll" >
      <table class="table table-hover table-striped" >
        <thead >
        <tr class="border-bottom-0">
          <th class="text-nowrap text-center ">#</th>
          <th class="text-nowrap text-center">{{ $t('message.voucher_no') }}</th>
          <th class="text-nowrap text-center">{{ $t('message.sold_items') }}</th>
          <th class="text-nowrap text-center">{{ $t('message.total') }}</th>
          <th class="text-nowrap text-center">{{ $t('message.date') }}</th>
        </tr>
        </thead>

        <tbody >
        <tr v-for="(order,index) in filterInvoices" :key="index" class="align-middle" @click="viewDetails(order)" data-bs-toggle="modal" data-bs-target="#exampleModal">
          <td class="text-nowrap">
            {{index+1}}
          </td>
          <td class="text-nowrap">
            {{order.voucherId}}
          </td>

          <td class="text-nowrap">
            <div class="d-flex" style="height:70px; overflow-y: scroll; overflow-x: hidden">

              <ul class="main-list">
                <li v-for="(item,index) in order.nameList"  style="width: 100px;" :key="index" >
                  <span class="text-truncate">{{item}}</span>
                </li>
              </ul>
              <ul>
                <li v-for="(count,index) in order.countList" :key="index" >
                  x{{count}} {{order.productUnitList?order.productUnitList[index]:''}}
                </li>
              </ul>
            </div>
          </td>
          <td class="text-nowrap text-end">{{parseInt(order.totalPrice).toLocaleString()}} Ks</td>
          <td class="text-nowrap text-end">
            <span> {{order.dateTime}}</span><br/>
            <span style="color: var(--secondary);font-size: 12px;">{{order.note}}</span>
          </td>
        </tr>
        </tbody>

      </table>

    </div>
    <div class="py-1 mt-1 border-top">
      <pagination
          :totalPages="pageCount"
          :perPage="perPage"
          :currentPage="currentPage"
          :pages="invoices"
          @pagechanged="onPageChange"
      />
    </div>
  </AdminSidebar>

</template>

<script>
import db from "@/config/FirebaseInit";
import html2canvas from "html2canvas";
import AdminSidebar from "@/components/AdminSidebar";
import Loading from "@/components/Loading";
import Pagination from "@/components/Pagination";
export default {
  components:{AdminSidebar, Loading, Pagination},
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
    }
  },
  computed:{
    pageCount(){
      return Math.ceil(this.invoices.length/this.perPage)
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
    if(this.search!==""){
        filterInv = this.invoices.filter(inv=>inv.voucherId.toLowerCase().includes(this.search.toLowerCase()))
        console.log('filtering',filterInv)
        return filterInv.slice(this.offsetCount, this.offsetCount + this.perPage);
      }else {
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
  },
  created() {
    this.$store.dispatch("getDay");
    this.$store.dispatch("getMonth");
    this.$store.dispatch("getYear");
    this.fileName=this.currentDay+'-invoices';
    this.$store.dispatch('getShopInfo',this.owner);
    this.selectedDate = this.currentDay;
  },
  async mounted(){
    await this.$store.dispatch('getCurrentShop');
    await db.collection(this.owner.city).doc(this.owner.shopId).collection('purchaseVouchers').where('day','==',this.currentDay).orderBy('time','desc').onSnapshot(snapshot => {
      this.invoices=[];
      this.income = 0;
      this.filterData =[];
      snapshot.forEach(doc=>{
        this.invoices.push(doc.data())
        this.income += parseInt(doc.data().totalPrice);
        // this.invoices.push(doc.data());
      })
      // console.log(this.invoices[0])
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
            .collection('purchaseVouchers').where('voucherId','==',this.search).onSnapshot(snapshot=>{
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
      await db.collection(this.owner.city).doc(this.owner.shopId).collection('purchaseVouchers').where(this.dateType,'==',this.selectedDate).orderBy('time','desc').onSnapshot(snapshot => {
        snapshot.forEach(doc=>{
          this.invoices.push(doc.data())
          this.income +=parseInt(doc.data().totalPrice);
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
        this.costPerItem.push(parseInt(this.selectedProduct.buyPriceList[i])*parseInt(this.selectedProduct.countList[i]))
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
tr, td, th{
  border: 1px solid var(--light);
}
.date-box{
  right: 100px;
  top:150px;
}
tr{
  color: var(--text-color) !important;
  cursor: pointer;
}
ol, ul{
  list-style-type: none;
  padding: 0;
  color: var(--text-color);


}
.btn-primary{
  border: 1px solid var(--primary) !important;
  background-color: var(--primary) !important;
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