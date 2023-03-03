<template>
  <Loading v-if="loadingActive"/>
  <AdminNavigation>
    <div class="container-xxl" style="background-color: var(--background-color);">
      <div class="row">
        <div class="col-12 col-lg-10 p-0"  style="color: var(--text-color);">
          <div class="pb-1 shadow-sm" style="position: sticky;z-index: 1000; top:40px;background-color: var(--background-color);">
            <div class="d-lg-flex d-md-flex align-items-center rounded justify-content-between mb-2 pt-3" >
              <div class="d-flex align-items-center">
                <button @click="this.$router.back()" style="color: var(--text-color);" class="btn border-0 float-start"><i class="fas fa-chevron-left"> </i></button>
                <router-link class="fs-5 mb-1 text-decoration-none p-1" style="color: var(--text-color)!important;" :class="$route.name==='SellReport'?'route-active':''" :to="{name:'SellReport',params:{date_type:'day',selected_date:currentDay}}" >
                  {{ $t('message.invoices') }}</router-link>
                <span class="fs-5 mb-1 mx-1">|</span>
                <router-link class="fs-5 mb-1 text-decoration-none p-1" style="color: var(--text-color)!important;" :class="$route.name==='ProductSellReport'?'route-active':''" :to="{name:'ProductSellReport'}">{{$t('message.sell_report')}} </router-link>
              </div>
              <div class="btn-group p-1" role="group" aria-label="Basic radio toggle button group">
                <input type="radio" class="btn-check" @click="showDaily" name="btnradio" id="btnradio1" autocomplete="off" checked>
                <label class="btn check-btn btn-primary"  for="btnradio1">{{$t('message.daily')}}</label>

                <input type="radio" class="btn-check" @click="showMonthly" name="btnradio" id="btnradio2" autocomplete="off">
                <label class="btn check-btn btn-primary" for="btnradio2">{{$t('message.monthly')}}</label>

              </div>
            </div>
            <div class="">
              <div class="d-flex justify-content-between px-2">
                <div class="d-flex p-1 mb-1 " style="background-color: var(--light);border-radius: var(--border-radius);">
                  <span class="badge me-1" style="background-color: var(--discountPrimary); border-radius: var(--border-radius);">{{finalProducts.length}}</span>
                  <span class="">{{income.toLocaleString()}} Ks</span>
                </div>

                <div class="date-panel">
                  <div class="d-flex align-items-center rounded" >
                    <!--                  <div  v-if="dateType==='day'">
                                        <button type="button" class="btn me-1 border-0 btn-sm d-flex align-items-center rounded p-2" style="background-color: var(&#45;&#45;light);" @click="showVCalendar = !showVCalendar">
                                          <i class="fas fa-calendar"></i><span class="ms-1">Choose Day</span>
                                        </button>
                                        <div v-if="showVCalendar" class="date-box position-fixed d-flex shadow flex-column rounded m-0 p-2 text-center" style="background-color: var(&#45;&#45;light);">
                                          <div>
                                            <button class="btn btn-close float-end" @click="showVCalendar =!showVCalendar"></button>
                                          </div>
                                          <Calendar :attributes="attributes" @dayclick="onDayClick" />
                                          <div class="d-flex">
                                            <button class="rounded btn mx-auto text-white btn-sm mt-1" style="background-color: var(&#45;&#45;primary);" @click="dateSelectHandler">OK</button>
                                          </div>
                                        </div>
                                      </div>-->
                    <input type="date" @change="formatDate" class="form-control" v-if="dateType === 'day'">
                    <input v-else type="month" @change="filterMonth" class="form-control border-0" placeholder="choose month">
                    <vue-excel-xlsx
                        :data="filterExportData"
                        :columns="columns"
                        :file-name="fileName"
                        :file-type="'xlsx'"
                        :sheet-name="fileName"
                        class="btn btn-success ms-2 border-0"
                    >
                      <i class="fas fa-file-excel"></i>
                      <!--                    <span class="ms-1">{{ $t('message.export') }}</span>-->
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
                <th class="text-nowrap">#</th>
                <th class="text-nowrap">{{ $t('message.sold_items') }}</th>
                <th class="text-nowrap text-center">{{ $t('message.count') }}</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(product,index) in finalProducts" :key="index" class="align-middle" data-bs-toggle="modal" data-bs-target="#exampleModal" >
                <td class="text-nowrap">
                  {{index+1}}
                </td>
                <td class="text-nowrap">
                  {{ product.name}}
                </td>
                <td class="text-nowrap text-center">
                  {{product.data}}
                </td>
                <td class="text-nowrap text-end d-none">
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </AdminNavigation>

</template>

<script>
import db from "@/config/FirebaseInit";
import AdminNavigation from "@/components/AdminNavigation";
import Loading from "@/components/Loading";
export default {
  components:{Loading, AdminNavigation},
  data(){
    return{
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
      orders:[],
      selectedProduct:'',
      user:'',
      columns : [
        {
          label: "Product Id",
          field: "id"
        },

        {
          label: "Product Name",
          field: "name"
        },
        {
          label: "Count",
          field: "count",
        },
        {
          label: "Total Price",
          field: "totalPrice",
        },
      ],

      productSellList:[],
      filterProductSellList:[],

      sellReports:[],
      sellProductLists:[],
      unitSellProductLists:[],
      filterSellProductLists:[],
      finalProducts:[],
      owner:'',
    }
  },
  computed:{
    currentDay(){
      return this.$store.getters.getDay;
    },
    currentMonth(){
      return this.$store.getters.getMonth;
    },
    currentYear(){
      return this.$store.getters.getYear;
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
        return this.filterData.filter(sell=>{
          return sell.sellType === this.selectedSellType
        })
      }else {
        return this.filterData;
      }
    },
  },
  async created() {
    this.$store.dispatch("getDay");
    this.$store.dispatch("getMonth");
    this.$store.dispatch("getYear");
    this.fileName=this.currentDay+'-orders';
    await this.$store.dispatch('getCurrentShop');
    // await this.getProduct();
    this.selectedDate = this.currentDay;
    await db.collection('shopRegistration').doc(this.$route.params.shop_id).get().then(async(result)=> {
      this.owner = result.data();
      console.log('owner', this.owner)
    });
    await this.getSellReports();

  },
  methods:{
    async getSellReports(){
      this.finalProducts=[];
      this.sellReports = [];
      this.income = 0;
      // console.log(this.selectedDate)
      await db.collection(this.owner.city).doc(this.owner.shopId).collection('sellProducts').where(this.dateType,'==',this.selectedDate).orderBy('time','desc').onSnapshot(  async (snapshot) => {
        snapshot.forEach(doc=>{
          this.sellReports.push(doc.data());
          this.income += parseInt(doc.data().totalPrice);
          if(snapshot.size === this.sellReports.length){
            console.log('sell reports', this.sellReports)
            console.log('length:',snapshot.size ,'==', this.sellReports.length)
            console.log(snapshot.dateType)
            this.destructureProducts();
          }
        })
      });
    },

    destructureProducts(){
      this.sellProductLists = [];
      this.sellReports.forEach((doc,index)=>{
        if(doc.productUnitList){
          doc.productIdList.forEach((id,i)=>{

            this.sellProductLists.push({
              'name':doc.nameList[i],
              'count':doc.countList[i],
              'id':id,
              'unit':doc.productUnitList[i]
            });
          });
        }else {
          doc.productIdList.forEach((id,i)=>{
            this.sellProductLists.push({
              'name':doc.nameList[i],
              'count':parseInt(doc.countList[i]),
              'id':id,
              'unit':'Pcs'
            })
          });
        }
        if(this.sellReports.length === index+1){
          //console.log('sell product list', this.sellProductLists)
          this.getProductWithUnit();
        }
      })
    },

    getProductWithUnit(){
      this.filterProductSellList =[];
      this.sellProductLists.forEach((item,i)=>{
        if(this.filterProductSellList.some(p=>p.id === item.id && p.unit === item.unit)){
          const duplicateIndex = this.filterProductSellList.findIndex(p=>{
            return p.id === item.id && p.unit === item.unit;
          });
          this.filterProductSellList[duplicateIndex].count = parseInt(this.filterProductSellList[duplicateIndex].count) + parseInt(item.count);
        }else {
          this.filterProductSellList.push({
            'id':item.id,
            'name':item.name,
            'count':parseInt(item.count),
            'unit':item.unit
          })
        }
        if(this.sellProductLists.length === i+1){
          //console.log('filter list',this.filterProductSellList);
          this.finalFilterProduct();
        }
      });
    },

    finalFilterProduct(){
      this.filterProductSellList.forEach(async (product)=>{
        if(this.finalProducts.some(p=>p.id===product.id)) {
          const duplicateId = this.finalProducts.findIndex(p => {
            return p.id === product.id
          });
          let sameIdProduct = this.finalProducts[duplicateId];
          sameIdProduct.data = sameIdProduct.data+' | ' + product.count+' '+product.unit;
        }else {
          this.finalProducts.push({
            'id':product.id,
            'name':product.name,
            'data':product.count+' '+product.unit
          })
        }

      })

    },


    onChange(e){
      this.search = '';
      this.selectedSellType = e.target.value;
      // //console.log(this.selectedSellType)
    },

    async filterMonth(e){
      let date = new Date(e.target.value)
      let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
      let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
      this.selectedDate = month+"-"+year;
      this.dateType='month';
      console.log(this.selectedDate)
      //console.log(this.selectedDate);
      this.fileName=this.selectedDate+'-sell-report';
      await this.getSellReports();
    },

    /*async dateSelectHandler(){
      this.showVCalendar = !this.showVCalendar;
      this.fileName = 'sell-report';
      ////console.log(this.days)
      this.selectedDate = this.days[0].formattedDate;
      this.dateType = 'day';
      await this.getSellReports();
      /!*this.days.forEach(day=>{
        //console.log(day);

      })*!/
    },
    onDayClick(day) {
      const idx = this.days.findIndex(d => d.id === day.id);
      if (idx >= 0) {
        this.days.splice(idx, 1);
      } else {
        this.days.push({
              id:day.id,
              date:day.date,
              formattedDate:this.formatDate(day.date)
            }
        );
      }
    },*/
    /*formatDate(date){
      let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
      let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
      let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
      return  day+"-"+month+"-"+year;
    },*/
    async formatDate(e){
      let date = new Date(e.target.value);
      let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
      let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
      let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
      this.selectedDate = day+"-"+month+"-"+year;
      this.dateType = 'day';
      await this.getSellReports();
    },


    async showDaily(){
      this.dateType = 'day';
      this.selectedDate = this.currentDay
      this.fileName = this.selectedDate+'-daily-sell-report'
      await this.getSellReports();
    },
    async showMonthly(){
      this.dateType = 'month';
      this.selectedDate = this.currentMonth;
      this.fileName = this.selectedDate+'-monthly-sell-report';
      console.log(this.selectedDate)
      await this.getSellReports();
    },
  }
}
</script>

<style scoped>
.date-box{
  right: 20px;
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
.check-btn{
  width: 80px !important;
}
.voucher-list{
  border-top: 2px dashed black;
}
.btn-group .btn{
  border-radius: 0px !important;
}
.btn-check{
}
.btn{
  border: 2px solid var(--primary);
  box-shadow: none !important;
  outline: none !important;
}
.check-btn:hover{
  background-color: var(--primary);
}
.btn-primary{
  background-color: white ;
  color: black;
}
thead, tbody{
  border: 1px solid var(--softPrimary) !important;
  color: var(--dark);
}
.btn-primary:focus{
  background-color: var(--primary) !important;
}
/*@media print {
  .hidden-print,
  .hidden-print * {
    display: none !important;
  }
}*/
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