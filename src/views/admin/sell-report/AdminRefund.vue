<template>
  <!--  Shop-->
  <AdminNavigation>
    <div class="container-xxl" style="background-color: var(--background-color); color: var(--text-color);">
      <Loading v-if="loadingActive"/>
      <InfoDialog v-if="infoModalActive" :modal-message="modalMessage" v-on:close-modal="closeInfoModal"/>
      <ConfirmDialog :modal-message="modalMessage" v-if="confirmActive" v-on:confirm="confirm" v-on:cancel="cancel"/>

      <div class="row">
        <div class="col-12 mt-5" style="overflow: hidden">
          <div class="row">
            <div class="modal fade" style="z-index: 30000;" id="stockModal"  tabindex="-1" aria-labelledby="stockModalLabel" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-body" v-if="tempInvoice">
                    <p class="text-center">{{ $t('message.enter_refund_count') }}</p>
                    <span class="badge mx-auto bg-primary rounded my-2">
                    1 {{tempInvoice.productUnitList[selectedProductIndex]}} = {{tempInvoice.backNumberList[selectedProductIndex]}} Pcs
                  </span>
                    <div class="d-flex align-items-center">
                      <input type="text" class="form-control me-2" v-model="productRefundCount">
                      <span>
                      {{tempInvoice.productUnitList[selectedProductIndex]}}
                    </span>
                    </div>
                  </div>
                  <div class="modal-footer d-flex justify-content-between">
                    <button type="button" class="btn text-danger" data-bs-dismiss="modal" >{{$t('message.cancel')}}</button>
                    <button type="button" class="btn text-white" style="background-color: var(--primary)!important;" @click="setRefundCount" data-bs-dismiss="modal">{{ $t('message.confirm') }}</button>
                  </div>
                </div>
              </div>
            </div>

            <div class="d-flex align-items-center">
              <button @click="$router.back()" style="color: var(--text-color);" class=" btn fs-5"><i class="fas fa-chevron-left"> </i>
              </button>
              <span class="fs-4 p-2">{{ $t('message.refund') }}</span>
            </div>
            <div class="col-md-4">
              <div class="card-outside overflow-scroll">
                <div class="d-flex justify-content-between my-1 align-items-center">
                  <span class="fs-5">{{ $t('message.refund_manage') }}</span>
                  <button class="btn text-white" style="background-color: var(--primary );" :disabled="refundActive" @click="refundConfirm">{{ $t('message.next') }}</button>
                </div>
                <div class="col-12 p-1">
                  <div  class="p-2 item-list" data-bs-toggle="modal" data-bs-target="#stockModal" @click="selectTempProduct(index)"  v-for="(invoice,index) in tempInvoice.nameList" :key="index">
                 <span class="text-primary fs-5">
                    {{invoice}}
                   </span>
                    <div class="d-flex justify-content-between">
                      <div class="d-flex flex-column">
                        <span class="text-success">{{ $t('message.available') }}</span>
                        <span >{{tempInvoice.countList[index]}} {{tempInvoice.productUnitList[index]}}</span>
                      </div>
                      <div class="d-flex flex-column text-end">
                        <span style="color: var(--discountPrimary);">{{$t('message.refund_count')}}</span>
                        <span>{{tempInvoice .refundCountList[index]}} {{tempInvoice.productUnitList[index]}}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


            </div>
            <!-- invoice -->

            <div class="col-md-8 card-outside" v-if="selectedInvoice!==''">
              <div class="row">
                <div class="d-flex align-items-center">
                  <button class="btn me-3" style="background-color: var(--btnLight);" @click="printThis"><i class="fas fa-save"></i> {{$t('message.save')}} </button>
                  <button class="btn text-white" style="background-color: var(--primary);" v-print="'#printcontent'" data-bs-dismiss="modal"><i class="fas fa-print"></i>
                    {{ $t('message.print') }}</button>
                </div>

                <div class="col-md-7 p-1 voucher-outer-box">

                  <div class="m-1" v-if="selectedInvoice">
                    <!----------Voucher 1  -->
                    <div class="voucher-box" v-if="voucherStyle === 'listStyle'">
                      <div class="bg-white p-2 text-black py-3 px-3 " style="font-size: 12px;" ref="printcontent" id="printcontent">
                        <div class="d-flex fw-bold align-items-center mb-2 "  >
                          <img :src="shopInfo.profileUrl" class="rounded me-2" width="150" height="150" v-if="showLogo==='true'" />
                          <div class="mt-1 d-flex flex-column w-100 px-2" :class="showLogo==='true'?'text-start':'text-center'">
                            <span class="fs-5 fw-bolder">{{shopInfo.name}}</span>
                            <span class="my-1">{{shopInfo.address}}</span>
                            <span><i class="fas fa-square-phone-flip"></i> {{shopInfo.phone}}</span>
                          </div>
                        </div>
                        <div class="text-start fw-bold d-flex flex-column pt-1 voucher-list-solid">
                          <span class="mb-1">{{$t('message.voucher_no')}} {{this.selectedInvoice.vouncherId}}</span>
                          <span class="mb-1"  v-if="showName==='true' && selectedInvoice.customerName!==''">Customer Name: {{this.selectedInvoice.customerName}}</span>
                          <span class="mb-1"  v-if="showPhone==='true' && selectedInvoice.customerPhone!==''">Customer Phone: {{this.selectedInvoice.customerPhone}}</span>
                          <span class="mb-1">{{$t('message.date')}}: {{this.selectedInvoice.dateTime}}</span>
                        </div>
                        <table class="w-100 table-1 border-0 p-0 table border-white table-voucher">
                          <thead class=" p-0 voucher-list-bottom">
                          <tr class="py-1 " style="border-bottom: 2px dotted black !important; border-right: 0 !important; border-left: 0 !important; border-top: 0 !important;">
                            <th class="bg-white border-0 text-start text-wrap align-start" style="width: 40%;">{{$t('message.items')}}</th>
                            <th class="bg-white border-0 text-end text-nowrap align-start">{{ $t('message.qty') }}</th>
                            <th class="bg-white border-0 text-end text-nowrap align-start">{{ $t('message.price') }}</th>
                            <th class="bg-white border-0 text-end text-nowrap align-start">{{$t('message.amount')}}</th>
                          </tr>
                          </thead>
                          <tbody class="border-0 fw-bold p-0">
                          <tr class="border-0 mb-1 py-1"  v-for="(name,index) in selectedInvoice.nameList" :key="index">
                            <td :class="selectedInvoice.countList[index]==='0'?'d-none':''" class="border-0 text-start text-wrap align-start" style="width: 40%;">{{ name }}</td>
                            <td :class="selectedInvoice.countList[index]==='0'?'d-none':''" class="border-0 text-end text-nowrap align-start">{{ selectedInvoice.countList[index]}} {{selectedInvoice.productUnitList[index]}}</td>
                            <td :class="selectedInvoice.countList[index]==='0'?'d-none':''" class="border-0 text-end text-nowrap align-start">{{ parseInt(selectedInvoice.sellPriceList[index]).toLocaleString()}}</td>
                            <td :class="selectedInvoice.countList[index]==='0'?'d-none':''" class="border-0 text-end text-nowrap align-start">{{ parseInt(costPerItem[index]).toLocaleString() }} Ks</td>
                          </tr>
                          </tbody>
                        </table>
                        <div class="px-1 flex-column">
                          <div class="d-flex fw-bold py-1 voucher-list-top">
                            <span class="w-75 text-start">{{ $t('message.total') }}</span>
                            <span class="w-25 text-end">{{ totalPrice.toLocaleString() }} Ks</span>
                          </div>
                          <div class="d-flex fw-bold py-1" v-if="parseInt(selectedInvoice.tax)>0">
                            <span class="w-75 text-start">{{ $t('message.tax') }}</span>
                            <span class="w-25 text-end">{{parseInt(selectedInvoice.tax).toLocaleString()}} Ks</span>
                          </div>
                          <div class="d-flex fw-bold  py-1" v-if="selectedInvoice.discount>0">
                            <span class="w-75 text-start">{{ $t('message.discount') }}</span>
                            <span class="w-25 text-end">{{parseInt(selectedInvoice.discount).toLocaleString()}} Ks</span>
                          </div>

                          <div class="d-flex fw-bold py-1 voucher-list-top">
                            <span class="text-start w-75">{{$t('message.net_amount')}}</span>
                            <span class="text-end w-25">{{parseInt(selectedInvoice.totalPrice).toLocaleString()}} Ks</span>
                          </div>
                          <div class="d-flex fw-bold  py-1">
                            <span class="text-start w-75">{{this.selectedInvoice.paymentMethod}} {{ $t('message.cash_received') }}</span>
                            <span class="text-end w-25">{{ parseInt(selectedInvoice.cashReceived).toLocaleString() }} Ks</span>
                          </div>
                          <div class="d-flex fw-bold py-1 voucher-list-top" v-if="selectedInvoice.credit>0">
                            <span class="text-start w-75">{{ $t('message.credit') }}</span>
                            <span class="text-end w-25">{{ parseInt(selectedInvoice.credit).toLocaleString() }} Ks</span>
                          </div>
                          <div class="d-flex fw-bold py-1 voucher-list-top" v-else>
                            <span class="text-start w-75">{{$t('message.change')}}</span>
                            <span class="text-end w-25">{{parseInt( selectedInvoice.change).toLocaleString() }} Ks</span>
                          </div>
                          <div class="d-flex fw-bold py-1 voucher-list-top" v-if="refundAmount!==''">
                            <span class="text-start w-75">Refund Amount</span>
                            <span class="text-end w-25">{{parseInt(refundAmount).toLocaleString() }} Ks</span>
                          </div>

                          <div class="text-center">
                            <p class="fw-bold">{{ $t('message.thank') }}</p>
                            <p class="mt-1">Power by Light Idea Software Development</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!----------Voucher 2  -->
                    <div class="voucher-box" v-else>
                      <div class="bg-white text-black p-3" style="font-size: 12px;" ref="printcontent" id="printcontent">
                        <div class="text-center">
                          <div class="d-flex align-items-center text-start p-1" style="background-color: var(--light);" >
                            <img :src="shopInfo.profileUrl" class="rounded" width="70" height="70"/>
                            <div class="ms-2 d-flex flex-column">
                              <span class=" fs-6">{{shopInfo.name}}</span>
                              <span class="my-1">{{shopInfo.address}}</span>
                              <span>Ph: {{shopInfo.phone}}</span>
                            </div>
                          </div>
                          <div class="text-start d-flex justify-content-between pt-1">
                            <span class="mb-1">Slip No: {{selectedInvoice.vouncherId}}</span>
                            <span class="mb-1">Date: {{selectedInvoice.dateTime}}</span>
                          </div>
                          <div class="text-start d-flex">
                            <span class="mb-1"  v-if="showName==='true' && selectedInvoice.customerName!==''">Customer :{{selectedInvoice.customerName}}, </span>
                            <span class="mb-1 ms-1"  v-if="showPhone==='true' && selectedInvoice.customerPhone!==''">{{selectedInvoice.customerPhone}}</span>
                          </div>
                          <table class="table">
                            <thead>
                            <tr>
                              <th class="text-start">Item</th>
                              <th>Qty</th>
                              <th class="text-nowrap">Price</th>
                              <th>Amount</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(name,index) in selectedInvoice.nameList" :key="index">
                              <td :class="selectedInvoice.countList[index]==='0'?'d-none':''" class="text-start">{{name}}</td>
                              <td :class="selectedInvoice.countList[index]==='0'?'d-none':''" class="text-nowrap text-center">{{ parseInt(selectedInvoice.countList[index]).toLocaleString()}} {{selectedInvoice.productUnitList[index]}}</td>
                              <td :class="selectedInvoice.countList[index]==='0'?'d-none':''" class="text-nowrap text-end">{{ parseInt(selectedInvoice.sellPriceList[index]).toLocaleString() }} Ks</td>
                              <td :class="selectedInvoice.countList[index]==='0'?'d-none':''" class="text-nowrap text-end">{{parseInt( costPerItem[index]).toLocaleString() }} Ks</td>
                            </tr>
                            <tr class="table-bottom">
                              <td colspan="3" class=" text-end text-nowrap">Total:</td>
                              <td class="text-end ">{{totalPrice.toLocaleString()}} Ks</td>
                            </tr>
                            <tr class="table-bottom" v-if="parseInt(selectedInvoice.tax)>0" >
                              <td colspan="3" class="text-end text-nowrap">Tax:</td>
                              <td class="text-end">{{parseInt(selectedInvoice.tax).toLocaleString()}} Ks</td>
                            </tr>
                            <tr class="table-bottom" v-if="selectedInvoice.discount>0">
                              <td colspan="3" class="text-end text-nowrap">Discount:</td>
                              <td class="text-nowrap text-end">{{parseInt(selectedInvoice.discount).toLocaleString()}} Ks</td>
                            </tr>
                            <tr class="table-bottom">
                              <td colspan="3" class="text-end text-nowrap" >Net Amount:</td>
                              <td class="text-nowrap text-end">{{parseInt(selectedInvoice.totalPrice).toLocaleString()}} Ks</td>
                            </tr>
                            <tr class="table-bottom">
                              <td colspan="3" class="text-end text-nowrap">{{selectedInvoice.paymentMethod}} Received:</td>
                              <td class="text-nowrap text-end">{{ parseInt(selectedInvoice.cashReceived).toLocaleString() }} Ks</td>
                            </tr>
                            <tr class="table-bottom" v-if="selectedInvoice.credit>0">
                              <td colspan="3" class="text-end text-nowrap">Credit:</td>
                              <td class="text-nowrap text-end">{{ parseInt(selectedInvoice.credit).toLocaleString() }} Ks</td>
                            </tr>
                            <tr class="table-bottom" v-else>
                              <td colspan="3" class="text-end text-nowrap">Change:</td>
                              <td class="text-nowrap text-end">{{parseInt( selectedInvoice.change).toLocaleString() }} Ks</td>
                            </tr>
                            </tbody>
                          </table>

                          <p class="fw-bold">Thank You!</p>
                          <p class="mt-1">Power by Light Idea Software Development</p>
                        </div>
                      </div>

                    </div>

                    <div class="p-2 shadow-sm" style="position: sticky; bottom: 0px;background-color: var(--background-color)">
                      <button class="btn w-100 btn-sm text-white" :disabled="nextActive" style="background-color: var(--primary);" @click="submitRefund">{{$t('message.refund')}}</button>
                    </div>
                  </div>

                </div>
                <div class="col-md-5">
                  <div class="" style="background-color: var(--light);">
                    <div class="mt-2 p-1 d-flex flex-column" style="background-color: var(--background-color); border-radius: var(--border-radius);">
                      <div>
                        <div class="d-flex justify-content-between align-items-center">
                          <span>{{$t('message.payment_method')}}</span>
                          <button class="btn btn-sm" @click="resetPayment" style="background-color: var(--light);color: var(--discountPrimary);">
                            {{ $t('message.reset') }}</button>
                        </div>
                        <button class="form-select mb-2 text-start form-control mt-2" @click="showPaymentToggle=!showPaymentToggle">{{selectedPaymentType!==''?selectedPaymentType.paymentType:$t('message.please_choose_payment')}}</button>
                        <div class="payment-pop-up shadow-sm p-2 mb-2 rounded" style="background-color: var(--background-color);"  v-if="showPaymentToggle" >
                          <li v-for="(type, index) in paymentMethods" :key="index" class=" my-1 list-unstyled text-black rounded text-start px-1" style="cursor:pointer;background-color: var(--light);" @click="choosePaymentType(type)">
                            <div class="w-100 d-flex align-items-center justify-content-start">
                              <img :src="type.url" v-if="type.url !==''" class="rounded" width="40" height="40" alt="">
                              <img src="../../../assets/flash/1.png"  v-else class="rounded m-1" width="40" height="40" alt="">
                              <div class="d-flex flex-column ms-2">
                                <span>{{type.paymentType}} ({{type.accountName}})</span>
                                <span style="color: var(--secondary);">{{type.accountNumber}}</span>
                              </div>
                            </div>
                          </li>
                        </div>
                      </div>
                    </div>
                    <div class="history-container m-0 mt-1" >
                      <span class="my-1 d-flex align-items-center p-1"><i class="fa-solid fa-clock-rotate-left"></i> {{$t('message.payment_history')}}</span>
                      <div class="card mb-1" style="background-color: var(--side-bar-bg)!important; font-size: 12px;" v-for="(history,index) in invoiceHistories" :key="index">
                        <div class="p-1" >
                          <span class="text-black-50">{{history.dateTime}}</span>
                          <div class="d-flex justify-content-between">
                            <div class="d-flex flex-column">
                              <span class="text-success">{{history.paymentMethod}} {{ $t('message.cash_received') }} </span>
                              <span>{{ history.cashReceived }} Ks</span>
                              <span>{{history.note}}</span>
                            </div>
                            <div class="d-flex flex-column text-end" v-if="history.credit!=='0'">
                              <span class="text-danger" >Credit</span>
                              <span class="text-danger">{{ history.credit }} Ks</span>
                            </div>
                            <div class="d-flex flex-column text-end" v-if="history.change!=='0'">
                              <span class="text-success">Change</span>
                              <span class="text-success" >{{ history.change }} Ks</span>
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
    </div>

  </AdminNavigation>

</template>

<script>
import db,{timestamp} from "@/config/FirebaseInit";
import Loading from "@/components/Loading";
import InfoDialog from "@/components/InfoDialog";
import ConfirmDialog from "@/components/ConfirmDialog";
import AdminNavigation from "@/components/AdminNavigation";
import html2canvas from "html2canvas";
export default {
  components: {ConfirmDialog, InfoDialog, Loading, AdminNavigation},
  data(){
    return{
      dismissModal:'true',
      file:'',
      customers:[],
      showTableVoucher:'true',
      confirmStatus:'',
      selectedCustomer:'',
      selectedCustomerRecords:[],
      customerInvoice:[],
      selectedCustomerTotalCredit:'',
      selectedCustomerTotalDebit:'',
      toGetActive:true,
      totalPrice:0,

      searchInvoiceValue:'',
      transactionDate:'',
      transactionAmount:'',
      transactionNote:'',
      voucherStyle:'',

      costPerItem :[],
      invoiceHistories:[],
      selectedInvoice:'',

      tempInvoice:'',
      selectedTempProduct:'',
      productRefundCount:1,
      selectedProductIndex:'',

      loadingActive:false,
      infoModalActive:false,
      confirmActive:false,
      refundActive:false,
      nextActive:true,
      modalMessage:'',
      customerToDelete:'',
      refundAmount:0,
      oldCredit:0,
      updateProductList: [],

      showPaymentToggle:false,
      selectedPaymentType:'',
      showAllInvoiceActive:false,
      owner:'',

    }
  },
  computed:{
    showName(){
      return localStorage.getItem('showCustomerName');
    },
    showLogo(){
      return localStorage.getItem('showLogoImage');
    },
    showPhone(){
      return localStorage.getItem('showCustomerPhone');
    },
    shopInfo(){
      return this.$store.getters.getShopInfo;
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
    },
    paymentMethods(){
      return this.$store.getters.getPaymentMethods;
    },
    creditInvoice(){
      if(this.searchInvoiceValue!==''){
        return this.customerInvoice.filter(invoice=>invoice.vouncherId.includes(this.searchInvoiceValue));
      }else {
        return this.customerInvoice;
      }
    }
  },

  async mounted() {
    this.$store.dispatch("getDateTime");
    this.$store.dispatch("getDay");
    this.$store.dispatch("getMonth");
    this.$store.dispatch("getYear");
    if(localStorage.getItem('voucherStyle')){
      this.voucherStyle =localStorage.getItem('voucherStyle');
    }
    await db.collection('shopRegistration').doc(this.$route.params.shop_id).get().then(async(result)=> {
      this.owner = result.data();
      this.$store.dispatch("getShopInfo",this.owner);
      this.$store.dispatch("getPaymentMethods", this.owner);

      if(this.$route.params.customer_id !=='' && this.$route.params.voucher_id !==''){
        await db.collection(this.owner.city).doc(this.owner.shopId).collection('customer').doc(this.$route.params.customer_id).onSnapshot(snapshot => {

          this.selectedCustomer = snapshot.data();
          db.collection(this.owner.city).doc(this.owner.shopId).collection('sellProducts').where('customerId','==',this.selectedCustomer.id).orderBy('time','desc').onSnapshot(snapshot => {
            if(!snapshot.empty){
              this.customerInvoice=[];
              snapshot.forEach(doc=>{
                this.customerInvoice.push(doc.data())
              });
              this.getInvoiceFroRouteId();
            }
          });
        });
      }

      if(this.$route.params.customer_id !=='' && this.$route.params.voucher_id === ''){
        console.log('customer exist and no voucher')
        await db.collection(this.owner.city).doc(this.owner.shopId).collection('customer').doc(this.$route.params.customer_id).onSnapshot(snapshot => {
          this.selectedCustomer = snapshot.data();
          db.collection(this.owner.city).doc(this.owner.shopId).collection('sellProducts').where('customerId','==',this.selectedCustomer.id).orderBy('time','desc').onSnapshot(snapshot => {
            if(snapshot.exists){
              this.customerInvoice=[];
              snapshot.forEach(doc=>{
                this.customerInvoice.push(doc.data());
              });

            }
          });
        });
      }
      if(this.$route.params.customer_id ==='' && this.$route.params.voucher_id !== ''){
        await this.getInvoiceFroRouteId();
      }
    })
  },
  methods:{

    //Refund
    async submitRefund(){
      // console.log('refund count list',this.tempInvoice.refundCountList)

      if(this.selectedPaymentType!==''){
        this.loadingActive = true;
        let batch = db.batch();

        this.selectedInvoice.countList = [];
        this.selectedInvoice.nameList = [];
        this.selectedInvoice.itemCodeList = [];
        this.selectedInvoice.sellPriceList = [];
        this.selectedInvoice.buyPriceList = [];
        this.selectedInvoice.productUnitList = [];
        this.selectedInvoice.productIdList = [];
        console.log('temp invoice',this.tempInvoice)
        this.tempInvoice.countList.forEach((count, index)=>{
          console.log(count);
          if(count!=='0'){
            console.log('count not 0')
            this.selectedInvoice.countList.push(count+"");
            this.selectedInvoice.nameList.push(this.tempInvoice.nameList[index]);
            this.selectedInvoice.itemCodeList.push(this.tempInvoice.itemCodeList[index]);
            this.selectedInvoice.sellPriceList.push(this.tempInvoice.sellPriceList[index]);
            this.selectedInvoice.buyPriceList.push(this.tempInvoice.buyPriceList[index]);
            this.selectedInvoice.productUnitList.push(this.tempInvoice.productUnitList[index]);
            this.selectedInvoice.productIdList.push(this.tempInvoice.productIdList[index]);
          }

          if(index+1 === this.tempInvoice.countList.length){
            console.log('final count list', this.selectedInvoice.countList)
            // console.log('final invoice',this.selectedInvoice);
            // console.log('refund amount',this.refundAmount);

            //do not update voucher when total price is 0 because its to delete
            //total = 0 mean the whole voucher item are refunded, so delete voucher
            if(this.totalPrice!==0){

              let voucherUpdateRef = db.collection(this.owner.city).doc(this.owner.shopId).collection('sellProducts').doc(this.selectedInvoice.id);
              batch.update(voucherUpdateRef,this.selectedInvoice);

              let voucherRecRef = db.collection(this.owner.city).doc(this.owner.shopId).collection('sellProducts').doc(this.selectedInvoice.id).collection('record').doc();
              batch.set(voucherRecRef, {
                'id':voucherRecRef.id,
                'totalPrice':this.selectedInvoice.totalPrice.toString(),
                'credit':this.selectedInvoice.credit,
                'cashReceived':""+0,
                'change':this.refundAmount.toString(),
                'note':"Refund Amount -> "+this.refundAmount.toString(),
                'paymentMethod':this.selectedInvoice.paymentMethod,
                'dateTime':this.currentDateTime,
                'time':timestamp
              });
            }

            //if there is credit update the credit amount to customer collection
            if(this.tempInvoice.credit!=='0'){
              let creditToStore = Math.abs(parseInt(this.tempInvoice.credit)-parseInt(this.selectedInvoice.credit));
              let newDebt = this.selectedCustomer.debt - creditToStore;
              let customerDebtRef = db.collection(this.owner.city).doc(this.owner.shopId).collection('customer').doc(this.selectedInvoice.customerId);
              batch.update(customerDebtRef,{
                'debt':newDebt.toString()
              });
            }

            //if there is refund amount, write new transaction to the selected payment refund collection
            if(parseInt(this.refundAmount)>0){
              console.log('voucher record added');
              let paymentRef = db.collection(this.owner.city).doc(this.owner.shopId).collection('paymentMethods').doc(this.selectedPaymentType.id).collection('refund').doc();
              batch.set(paymentRef,{
                'id':paymentRef.id,
                'sellProductId':this.selectedInvoice.id,
                'refund':this.refundAmount.toString(),
                'day':this.currentDay,
                'month':this.currentMonth,
                'year':this.currentYear,
                'dateTime':this.currentDateTime,
                'time':timestamp
              });

              let paymentReceivedRef = db.collection(this.owner.city).doc(this.owner.shopId).collection('paymentReceived').doc();
              batch.set(paymentReceivedRef,{
                'day': this.currentDay,
                'id': paymentReceivedRef.id,
                'month': this.currentMonth,
                'paymentId':paymentRef.id,
                'paymentName': this.selectedPaymentType.paymentType,
                'receivedAmount':"-"+ this.refundAmount.toString(),
                'status': "refund",
                'time':timestamp,
                'vouncherId':this.selectedInvoice.vouncherId,
                'year':this.currentYear,
              });
            }

            batch.commit();

            //update the refund stock to the original products
            this.updateProductList.forEach((updateProduct,index)=>{
              console.log('id: ',updateProduct.id);
              if(updateProduct.stock!==''){
                let updateStock = parseInt(updateProduct.stock)+parseInt(updateProduct.reduceCount);
                db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(updateProduct.id).update( {
                  'stock':updateStock.toString()
                });

                let status = '';
                if(parseInt(updateProduct.reduceCount)>1){
                  status = ' are refunded'
                }else {
                  status = ' is refunded'
                }
                let productRecRef = db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(updateProduct.id).collection('records').doc()
                productRecRef.set(
                    {
                      'id':updateProduct.id,
                      'recordId':productRecRef.id,
                      'itemCode':updateProduct.itemCode,
                      'barcode':updateProduct.barcode,
                      'itemName':updateProduct.itemName,
                      'buyPrice':updateProduct.buyPrice,
                      'sellPrice':updateProduct.sellPrice,
                      'stock':updateProduct.stock+"",
                      'description':updateProduct.description,
                      'type':updateProduct.type,
                      'color':updateProduct.color,
                      'size':updateProduct.size,
                      'weight':updateProduct.weight,
                      'time':timestamp,
                      'day':this.currentDay,
                      'month':this.currentMonth,
                      'year':this.currentYear,
                      'dateTime':this.currentDateTime,
                      'rating':updateProduct.rating,
                      'discount':updateProduct.discount,
                      'note':updateProduct.reduceCount + status,
                      'process':'refund' ,
                      'count':updateProduct.reduceCount.toString()
                    });
              }else {
                let status = '';
                if(parseInt(updateProduct.reduceCount)>1){
                  status = ' are refunded'
                }else {
                  status = ' is refunded'
                }
                let productRecRef = db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(updateProduct.id).collection('records').doc()
                productRecRef.set(
                    {
                      'id':updateProduct.id,
                      'recordId':productRecRef.id,
                      'itemCode':updateProduct.itemCode,
                      'barcode':updateProduct.barcode,
                      'itemName':updateProduct.itemName,
                      'buyPrice':updateProduct.buyPrice,
                      'sellPrice':updateProduct.sellPrice,
                      'stock':updateProduct.stock+"",
                      'description':updateProduct.description,
                      'type':updateProduct.type,
                      'color':updateProduct.color,
                      'size':updateProduct.size,
                      'weight':updateProduct.weight,
                      'time':timestamp,
                      'day':this.currentDay,
                      'month':this.currentMonth,
                      'year':this.currentYear,
                      'dateTime':this.currentDateTime,
                      'rating':updateProduct.rating,
                      'discount':updateProduct.discount,
                      'note':updateProduct.reduceCount + status ,
                      'process':'refund' ,
                      'count':updateProduct.reduceCount.toString()
                    });
              }
              if(this.updateProductList.length === index+1 ){

                //total = 0 mean the whole voucher item is refund, so delete voucher
                if(this.totalPrice === 0){
                  db.collection(this.owner.city).doc(this.owner.shopId).collection('sellProducts').doc(this.selectedInvoice.id).collection('record').onSnapshot(snapshot => {
                    snapshot.forEach((doc)=>{
                      db.collection(this.owner.city).doc(this.owner.shopId).collection('sellProducts').doc(this.selectedInvoice.id).collection('record').doc(doc.data().id).delete();
                    })
                  });
                  db.collection(this.owner.city).doc(this.owner.shopId).collection('sellProducts').doc(this.selectedInvoice.id).delete().then(()=>{
                    console.log('voucher deleted')
                    // this.$router.back();
                  });
                }

                this.loadingActive = false;
                this.infoModalActive = true;
                this.modalMessage="Refund Process Success!"
                this.$router.back();

              }
            });
          }
        })



      }else {
        this.infoModalActive = true;
        this.modalMessage= "Please Select Payment Method"
      }

    },
    refundConfirm(){
      this.refundActive = true;
      this.nextActive = false;
      console.log('update list', this.updateProductList)
      this.selectedInvoice.countList = this.tempInvoice.countList;
      this.selectedInvoice.nameList = this.tempInvoice.nameList;
      this.selectedInvoice.itemCodeList = this.tempInvoice.itemCodeList;
      this.selectedInvoice.sellPriceList = this.tempInvoice.sellPriceList;
      this.selectedInvoice.buyPriceList = this.tempInvoice.buyPriceList;
      this.selectedInvoice.productUnitList = this.tempInvoice.productUnitList;
      this.selectedInvoice.productIdList = this.tempInvoice.productIdList;
      this.totalPrice =0;
      this.costPerItem=[];
      this.selectedInvoice.tax='0';
      this.selectedInvoice.discount ='0';
      console.log('after splice', this.selectedInvoice.countList);
      for(let i =0 ;i<this.selectedInvoice.countList.length;i++){

        console.log('update list', this.updateProductList)
        this.costPerItem.push(parseInt(this.selectedInvoice.sellPriceList[i])*parseInt(this.selectedInvoice.countList[i]));
        if(this.costPerItem.length == this.selectedInvoice.countList.length){
          this.costPerItem.forEach(price=>{
            this.totalPrice += parseInt(price);
          });

          let newNetAmount = Math.abs(this.totalPrice-parseInt(this.selectedInvoice.cashReceived));
          if(this.selectedInvoice.change!=='0'){
            this.refundAmount = Math.abs( newNetAmount-parseInt(this.selectedInvoice.change))
            this.selectedInvoice.change =(this.refundAmount + parseInt(this.selectedInvoice.change)).toString();
          }else{
            this.selectedInvoice.change = newNetAmount.toString();
            this.refundAmount = newNetAmount;
          }

          if(this.selectedInvoice.credit!=='0'){
            this.oldCredit = parseInt(this.tempInvoice.credit);
            let removeTotal = parseInt(this.selectedInvoice.totalPrice)-this.totalPrice;
            console.log('credit exit: old',this.oldCredit,',',removeTotal)
            if(removeTotal > this.oldCredit){
              console.log('true');
              this.selectedInvoice.credit="0";
              this.selectedInvoice.change = (Math.abs(removeTotal - parseInt(this.oldCredit))).toString();
              this.refundAmount = this.selectedInvoice.change;
            }else {
              console.log('false')
              this.selectedInvoice.credit = Math.abs(removeTotal - parseInt(this.oldCredit)).toString();
              this.selectedInvoice.change = "0";
              this.refundAmount = 0;
            }

          }else {

            console.log('')

          }
          this.selectedInvoice.totalPrice = (this.totalPrice).toString();
        }
      }

    },
    setRefundCount(){
      if(this.productRefundCount<=parseInt(this.tempInvoice.countList[this.selectedProductIndex])){
        console.log('count', this.tempInvoice.countList[this.selectedProductIndex])
        this.tempInvoice.countList[this.selectedProductIndex] = (parseInt(this.tempInvoice.countList[this.selectedProductIndex]) - parseInt(this.productRefundCount)).toString();
        this.tempInvoice.refundCountList[this.selectedProductIndex] = this.productRefundCount.toString();
        console.log(this.tempInvoice);
        console.log('selected invoice', this.tempInvoice.refundCountList);
        let reduceCount = parseInt(this.tempInvoice.refundCountList[this.selectedProductIndex]) * parseInt(this.tempInvoice.backNumberList[this.selectedProductIndex]);
        db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(this.tempInvoice.productIdList[this.selectedProductIndex]).get().then((snapShot) => {
          console.log('update product',snapShot.data());
          this.updateProductList.push({'reduceCount':reduceCount,...snapShot.data()});
        });
      }
      else {
        this.infoModalActive = true;
        this.modalMessage = "Please reduce count";
      }
    },
    async selectTempProduct(index){
      this.productRefundCount = 1;
      this.selectedProductIndex = index;
      let selectedUnit = this.tempInvoice.productUnitList[index];
      if(this.tempInvoice.productUnitList[this.selectedProductIndex]!=='Pcs'){
        db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(this.tempInvoice.productIdList[index]).collection('relation').where('frontUnit','==',selectedUnit).get().then(snapshot => {
          let result = [];
          snapshot.forEach(doc=>{
            result.push(doc.data())
          });
          console.log(result)
          this.tempInvoice.backNumberList[this.selectedProductIndex] = result[0].backNumber;
        })

      }else {
        this.tempInvoice.backNumberList[this.selectedProductIndex] = '1' ;
      }
      console.log('temp',this.selectedTempProduct)


    },
    //end Refund

    async getInvoiceFroRouteId(){
      console.log('invoke ok')
      await db.collection(this.owner.city).doc(this.owner.shopId).collection('sellProducts').doc(this.$route.params.voucher_id).get().then(snapshot => {
        this.selectedInvoice = snapshot.data();
        let refundCountList = [];
        let backNumberList =[];
        let refundCountListWithRelation =[];
        this.totalPrice =0;
        for(let i =0 ;i <this.selectedInvoice.nameList.length;i++){
          refundCountList.push('');
          backNumberList.push('');
          refundCountListWithRelation.push('');
          if(i+1 ===this.selectedInvoice.nameList.length){
            this.tempInvoice ={'refundCountList':refundCountList,'backNumberList':backNumberList,...snapshot.data()};
          }
          this.costPerItem.push(parseInt(this.selectedInvoice.sellPriceList[i])*parseInt(this.selectedInvoice.countList[i]))
          this.totalPrice += parseInt(parseInt(this.selectedInvoice.sellPriceList[i])*parseInt(this.selectedInvoice.countList[i]));
        }
        /*for(let i =0 ;i<this.selectedInvoice.countList.length;i++){
        }
        this.costPerItem.forEach(price=>{
        })*/
        db.collection(this.shopInfo.city).doc(this.shopInfo.id).collection('sellProducts').doc(this.selectedInvoice.id).collection('record').orderBy('time','desc').onSnapshot(snapshot => {
          this.invoiceHistories=[];
          snapshot.forEach(doc=>{
            this.invoiceHistories.push(doc.data());
          })
        })
      });

    },
    showAllInvoiceChange(e)
    {
      if(e.target.checked){
        this.showAllInvoiceActive = true;
      }else {
        this.showAllInvoiceActive = false;
      }
    },
    resetPayment(){
      this.selectedPaymentType = '';
      this.transactionAmount='';
    },
    choosePaymentType(payment){
      this.selectedPaymentType = payment;
      this.showPaymentToggle = !this.showPaymentToggle;
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
    async printThis() {
      console.log("printing..");
      const el = this.$refs.printcontent;

      const options = {
        type: "dataURL",
      };
      const printCanvas = await html2canvas(el, options);

      const link = document.createElement("a");
      link.setAttribute('download', `${this.selectedInvoice.vouncherId}.png`);
      link.setAttribute(
          "href",
          printCanvas
              .toDataURL("image/png")
              .replace("image/png", "image/octet-stream")
      );
      link.click();

      console.log("done");
    },

    selectInvoice(invoice){
      this.costPerItem =[];
      this.totalPrice =0;
      this.selectedInvoice = invoice;
      for(let i =0 ;i<this.selectedInvoice.countList.length;i++){
        this.costPerItem.push(parseInt(this.selectedInvoice.sellPriceList[i])*parseInt(this.selectedInvoice.countList[i]))
      }
      this.costPerItem.forEach(price=>{
        this.totalPrice += parseInt(price);
      });
      db.collection(this.shopInfo.city).doc(this.shopInfo.id).collection('sellProducts').doc(this.selectedInvoice.id).collection('record').orderBy('time','desc').onSnapshot(snapshot => {
        this.invoiceHistories=[];
        snapshot.forEach(doc=>{
          this.invoiceHistories.push(doc.data());
        })
      });
      this.$router.replace({name:'CustomerDetail', params:{customer_id:this.selectedCustomer.id, voucher_id:this.selectedInvoice.id}})
    },
    closeInfoModal(){
      this.infoModalActive = !this.infoModalActive;
    },
    cancel(){
      this.confirmActive = !this.confirmActive;
    },

    async openEditBox(customer){
      this.selectedCustomer = customer;

    },

    async openDetailBox(customer){
      this.selectedCustomerTotalCredit = 0;
      this.selectedCustomerTotalDebit=0;
      this.selectedCustomer = customer;
      await this.getCustomerInvoice();

    },

    formatDate(payload){
      const date = new Date(payload);
      let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
      let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
      let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
      return day+"-"+month+"-"+year;
    },

  }
}
</script>

<style scoped>
.btn-group{
  width: 100%;
}
thead, tbody{
  border: none !important;
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
.activeInvoice{
  background-color: var(--btnLight)!important;
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
tr{
  color: var(--text-color);
}

.card-container{
  height: 65vh;
  overflow-y: scroll;
  overflow-x: hidden;
}
.item-list{
  margin-bottom: 5px;
  justify-content: space-between;
  background-color: var(--side-bar-bg);
  border-radius: var(--border-radius);
  transition: 0.3s;
  cursor: pointer;
}
.item-list:active{
  background-color: var(--softPrimary);
}
.item-list:hover{
  background-color: var(--softPrimary);
}

.history-container{
  border-radius: var(--border-radius);
  background-color: var(--background-color);
  height: 60vh;
  padding-bottom: 50px;
  overflow-y: scroll;
  overflow-x: hidden;
}
.btn-active{
  border-radius: 0px !important;
  border-bottom: 2px solid var(--primary) !important;
}
.voucher-list{
  border-top: 2px dashed black;
}
.voucher-box{
  height: 75vh;
  overflow-y: scroll;
}
.voucher-outer-box{
  border-radius: var(--border-radius);
  height: 82vh;
}
.card-outside{
  border-radius: var(--border-radius);
  padding: 10px;
  height:85vh;
  background-color: var(--light) !important;
}
@media only screen and (max-width: 1030px) {
  .content-box {
    margin-top: 90px;
  }
}
</style>