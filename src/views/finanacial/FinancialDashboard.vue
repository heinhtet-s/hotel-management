<template>
  <admin-sidebar>

    <div class="row" style="height:90vh;overflow-y: scroll">
      <div class="col-6">
        <button @click="$router.back()" class=" btn fs-5" style="color: var(--text-color);">
          <i class="fas fa-chevron-left"> </i>
          <span class="fs-4 ms-2">Financial Report</span>

        </button>
        <div class="d-flex justify-content-between">
          <span class="fs-5 ms-3">Daily Report</span>
          <div>
            <input type="date" @change="formatDate" class="form-control" >
          </div>
        </div>
       <div class="row">
         <div class="col-6 ">

           <div class="card">
             <div class="card-body">
               <div class="d-flex justify-content-between rounded">
                 <span style="color: var(--discountPrimary)">Income</span>
               </div>
               <h4 class=" mt-3">{{ paymentReceives.toLocaleString() }}Ks</h4>
             </div>
           </div>

         </div>
         <div class="col-6">
           <router-link :to="{name:'Expenses'}" class="text-decoration-none">
             <div class="card">
               <div class="card-body">
                 <div class="d-flex justify-content-between rounded">
                   <span class="text-success">Expenses</span>
                   <i class="fas fa-chevron-right"></i>
                 </div>
                 <h4 class=" mt-3">{{ expenseTotalAmount.toLocaleString() }}Ks</h4>
               </div>
             </div>
           </router-link>

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
      <div class="col-6" v-if="cashier.accountLevel === 'admin'">
        <div class="col-12">

          <div class="card mt-2">
            <div class="card-body">
              <span class="fs-5">Current Inventory</span>

              <div class="d-flex justify-content-between align-items-center">
                <span class="fs-4">Monthly Report</span>
                <div class="text-end">
                  {{selectedDate}}
                  <input type="month" @change="filterMonth" placeholder="choose month" class="form-control">
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
                  <h4 class="fw-bold mt-3 text-end">{{resultMonthlyProfit}} Ks</h4>
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
                <h4 class="fw-bold mt-3">{{ sellIncome}} Ks</h4>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>

  </admin-sidebar>

</template>

<script>
import AdminSidebar from "@/components/AdminSidebar";
import db from "@/config/FirebaseInit";

export default {
  components:{AdminSidebar},
  data(){
    return{
      expenseTotalAmount:'0',
      customers:'0',
      capital:0,
      sellIncome:0,
      profit:0,
      totalInvoice:'148',
      selectedDate:'',
      selectedDay:'',
      monthlyIncome:0,
      monthlyProfit:0,
      resultMonthlyProfit:0,
      sellProducts:[],
      paymentReceives:0,
    }
  },
  computed:{

    cashier(){
      return this.$store.getters.getCashierAcc;
    },
    currentDay(){
      return this.$store.getters.getDay;
    },
    currentMonth(){
      return this.$store.getters.getMonth;
    },
    owner(){
      return this.$store.getters.getShopOwner;
    },
    products(){
      return this.$store.getters.getAllProducts;
    },

  },
  created() {
    this.selectedDate = this.currentMonth;
    this.selectedDay = this.currentDay;
    this.$store.dispatch("getMonth")
    this.$store.dispatch("getCurrentShop",this.owner)
    this.$store.dispatch("getAllProducts",this.owner)
    this.calculateCapital();
    this.calculateProfit();
    this.getSellProduct(this.selectedDate);
    this.getPaymentReceives();
    this.getExpenseAmount();
  },
  methods:{
    formatDate(e){
      const date = new Date(e.target.value);
      let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
      let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
      let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
      let payload = day+"-"+month+"-"+year;
      console.log(payload);
      this.selectedDay = payload;
      this.getExpenseAmount();
    },
    async getExpenseAmount(){
      await db.collection(this.owner.city).doc(this.owner.shopId).collection('expenses').where('date','==',this.selectedDay).onSnapshot(snapshot=>{
        this.expenseTotalAmount=0;
        snapshot.forEach(doc=>{
          this.expenseTotalAmount += parseInt(doc.data().amount);
        })
      })
    },
    async getPaymentReceives(){
      await db.collection(this.owner.city).doc(this.owner.shopId).collection('paymentReceived').where('day','==',this.selectedDay).onSnapshot(snapshot=>{
        this.paymentReceives=0;
        snapshot.forEach(doc=>{
          this.paymentReceives += parseInt(doc.data().receivedAmount);
        })
      })
    },
    async getSellProduct(month){
      await db.collection(this.owner.city).doc(this.owner.shopId).collection('sellProducts').where('month','==',month).get().then(snapshot => {
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
      for(let i =0; i< this.products.length;i++){
        if(this.products[i].stock) {
          this.capital += parseInt(this.products[i].buyPrice)*parseInt(this.products[i].stock);
        }
      }
    },
    calculateProfit(){
      let myCapital = 0;
      let myIncome = 0;
      for(let i =0; i< this.products.length;i++){
        console.log("sell price",this.products[i].sellPrice,', discount: '+this.products[i].discount)

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
      this.sellIncome = parseInt(myIncome) - parseInt(myCapital);

    },
    async filterMonth(e) {
      let date = new Date(e.target.value)
      let month = new Intl.DateTimeFormat('en', {month: 'short'}).format(date);
      let year = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(date);
      this.selectedDate = month + "-" + year;
      await this.getSellProduct(this.selectedDate);
    }
  }
}
</script>

<style scoped>
.row{
  background-color: var(--background-color);
}
.card{
  padding: 5px;
  background-color: var(--light) !important;
}
.card-body{
  background-color: var(--light) !important;
}
.icon-badge{
  width: 70px;
  height: 70px;
  background-color: var(--btnLight);
  display: inline-block;
  justify-content: center;
  align-items: center;
}
</style>