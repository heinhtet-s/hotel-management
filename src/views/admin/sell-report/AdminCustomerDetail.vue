<template>
  <!--  Shop-->
  <AdminNavigation>
    <div class="container-xxl" style="background-color: var(--background-color); color: var(--text-color);">
      <Loading v-if="loadingActive"/>
      <InfoDialog v-if="infoModalActive" :modal-message="modalMessage" v-on:close-modal="closeInfoModal"/>
      <confirm-dialog :modal-message="modalMessage" v-if="confirmActive" v-on:confirm="confirm" v-on:cancel="cancel"/>

      <div class="row">
        <div class="col-12 col-lg-10 mt-5">
          <div class="row">
            <div class="d-flex align-items-center">
              <button @click="$router.back()" style="color: var(--text-color);" class=" btn fs-5"><i class="fas fa-chevron-left"> </i>
              </button>
              <span class="fs-3 p-1">{{ $t('message.voucher_details') }}</span>
            </div>
            <div class="col-md-4" v-if="selectedCustomer">
              <div class="card-outside overflow-scroll">
                <span class="fs-5 p-1">{{ $t('message.customer_info') }}</span>

                <div class="d-flex" style="background-color: var(--side-bar-bg);border-radius: var(--border-radius);">
                  <div class="text-start d-flex align-items-center justify-content-center" >
                    <img :src="selectedCustomer.image" v-if="selectedCustomer.image!==''" class="m-1" width="100" height="100" style="border-radius: var(--border-radius);" alt="">
                    <img src="../../../assets/flash/1.png" v-else class="m-1" width="100" height="100" style="border-radius: var(--border-radius);" alt="">
                  </div>
                  <div class="form-floating mb-3 ms-2 d-flex flex-column">
                    <span><i class="fas fa-user"></i> {{selectedCustomer.name}}</span>
                    <span><i class="fas fa-phone"></i> {{selectedCustomer.phone}}</span>
                    <span class="text-black-50"><i class="fa-solid fa-location-crosshairs"></i> {{selectedCustomer.address}}</span>
                  </div>
                </div>
                <div class="" >
                  <div class="d-flex justify-content-between align-items-center">
                    <span>{{ $t('message.total_credit') }}</span>
                    <div>
                      <input type="text" v-model="searchInvoiceValue" class="form-control form-control-sm mt-1" placeholder="search">
                    </div>
                  </div>
                  <div class="d-flex justify-content-between">
                    <span class="text-danger">{{selectedCustomer.debt}} Ks</span>

                    <div class="form-check form-switch d-none">
                      <input class="form-check-input" @change="showAllInvoiceChange" type="checkbox" role="switch" id="flexSwitchCheckDefault">
                      <label class="form-check-label" for="flexSwitchCheckDefault">Show All</label>
                    </div>
                  </div>

                </div>
                <div class="d-flex align-items-end">

                </div>
                <div >
                  <div class="card-container" v-if="creditInvoice.length>0">
                    <div class="card p-2" :class="invoice.id === selectedInvoice.id ? 'activeInvoice':''" v-for="(invoice,index) in this.creditInvoice" :key="index" @click="selectInvoice(invoice)" style="min-height: 30px !important;cursor: pointer;">
                      <div class="d-flex justify-content-between">
                        <div class="d-flex flex-column">
                          <span class="text-black-50">{{invoice.dateTime}}</span>
                          <span>{{invoice.vouncherId}}</span>
                        </div>
                        <div class="d-flex flex-column text-end">
                          <span :class="invoice.credit==='0'?'text-success':'text-danger'">{{ invoice.credit !=='0'?'Credit':'Paid' }}</span>
                          <span class="text-danger" v-if="invoice.credit!=='0'">{{invoice.credit}} ks</span>
                        </div>
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
                    <div class="voucher-box" >
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
                            <td class="border-0 text-start text-wrap align-start" style="width: 40%;">{{ name }}</td>
                            <td class="border-0 text-end text-nowrap align-start">{{ selectedInvoice.countList[index]}} {{selectedInvoice.productUnitList[index]}}</td>
                            <td class="border-0 text-end text-nowrap align-start">{{ parseInt(selectedInvoice.sellPriceList[index]).toLocaleString()}}</td>
                            <td class="border-0 text-end text-nowrap align-start">{{ parseInt(costPerItem[index]).toLocaleString() }} Ks</td>
                          </tr>
                          </tbody>
                        </table>
                        <div class="px-1 flex-column">
                          <div class="d-flex fw-bold py-1 voucher-list-top">
                            <span class="w-75 text-start">{{ $t('message.total') }}</span>
                            <span class="w-25 text-end">{{ parseInt(selectedInvoice.totalPrice).toLocaleString() }} Ks</span>
                          </div>
                          <div class="d-flex fw-bold py-1" v-if="shopInfo.tax!=='0'">
                            <span class="w-75 text-start">{{ $t('message.tax') }}</span>
                            <!--                          {{((selectedInvoice.totalPrice*(parseInt(shopInfo.tax)/100)).toFixed(0)).toLocaleString()-->
                            <span class="w-25 text-end">{{selectedInvoice.tax.toLocaleString()}} Ks</span>
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

                          <div class="text-center">
                            <p class="fw-bold">{{ $t('message.thank') }}</p>
                            <p class="mt-1">Power by Light Idea Software Development</p>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                <div class="col-md-5">
                  <div class="" style="background-color: var(--light);">
                    <div class="mt-2 p-1 d-flex flex-column" v-if="selectedInvoice.credit>0" style="background-color: var(--background-color); border-radius: var(--border-radius);">
                      <div >
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
                        <div class="d-flex mb-2">
                          <input type="number" required class="form-control" v-model="transactionAmount" :placeholder="$t('message.amount')">
                        </div>
                        <textarea name="note mt-2" class="form-control mb-2" id="note" cols="30" v-model="transactionNote" rows="3" :placeholder="$t('message.note')+'(optional)'"></textarea>

                      </div>
                      <button class="btn mt-2 align-items-end text-white" style="background-color: var(--primary);" @click="addNewTransaction">{{$t('message.confirm')}}</button>
                    </div>
                    <div class="history-container m-0 mt-1" >
                      <span class="my-1 d-flex align-items-center"><i class="fa-solid fa-clock-rotate-left"></i> {{$t('message.payment_history')}}</span>
                      <div class="card mb-1" style="background-color: var(--side-bar-bg)!important;font-size: 12px;" v-for="(history,index) in invoiceHistories" :key="index">
                        <div class="p-1" >
                          <span class="text-black-50">{{history.dateTime}}</span>
                          <div class="d-flex justify-content-between">
                            <div class="d-flex flex-column">
                              <span class="text-success">{{history.paymentMethod}} {{ $t('message.cash_received') }} </span>
                              <span>{{ history.cashReceived }} Ks</span>
                            </div>
                            <div class="d-flex flex-column text-end">
                              <span class="text-danger" v-if="history.credit!=='0'">Credit</span>
                              <span class="text-danger" v-if="history.credit!=='0'">{{ history.credit }} Ks</span>
                              <span class="text-success" v-if="history.change!=='0'">Change</span>
                              <span class="text-success" v-if="history.change!=='0'">{{ history.change }} Ks</span>
                            </div>

                          </div>
                          <div>
                            <spna>{{history.note}}</spna>
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
import html2canvas from "html2canvas";
import AdminNavigation from "@/components/AdminNavigation";
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

      searchInvoiceValue:'',
      transactionDate:'',
      transactionAmount:'',
      transactionNote:'',
      voucherStyle:'',

      costPerItem :[],
      invoiceHistories:[],
      selectedInvoice:'',

      loadingActive:false,
      infoModalActive:false,
      confirmActive:false,
      modalMessage:'',
      customerToDelete:'',

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
    this.$store.dispatch("getPaymentMethods", this.owner);
    if(localStorage.getItem('voucherStyle')){
      this.voucherStyle =localStorage.getItem('voucherStyle');
    }

    console.log('voucher id',this.$route.params.voucher_id)

    await db.collection('shopRegistration').doc(this.$route.params.shop_id).get().then(async(result)=> {
      this.owner = result.data();
      this.$store.dispatch("getShopInfo",this.owner);

      if(this.$route.params.customer_id !== '' && this.$route.params.voucher_id !== ''){
        console.log('both exist')
        await db.collection(this.owner.city).doc(this.owner.shopId).collection('customer').doc(this.$route.params.customer_id).onSnapshot(snapshot => {
          this.selectedCustomer = snapshot.data();
          this.getInvoiceFroRouteId();
        });
      }

      if(this.$route.params.customer_id !=='' && this.$route.params.voucher_id === ''){
        console.log('customer exist and no voucher')
        await db.collection(this.owner.city).doc(this.owner.shopId).collection('customer').doc(this.$route.params.customer_id).onSnapshot(snapshot => {
          this.selectedCustomer = snapshot.data();
          console.log('selected customer',this.selectedCustomer)
          db.collection(this.owner.city).doc(this.owner.shopId).collection('sellProducts').where('customerId','==',this.selectedCustomer.id).orderBy('time','desc').onSnapshot(snapshot => {
            this.customerInvoice=[];
            snapshot.forEach(doc=>{
              this.customerInvoice.push(doc.data());
            });
          });
        });
      }

      if(this.$route.params.customer_id ==='' && this.$route.params.voucher_id !== ''){
        console.log('customer not exists and voucher exists')
        await this.getInvoiceFroRouteId();
      }
    })
  },
  methods:{
    async getInvoiceFroRouteId(){
      console.log('invoke ok')
      await db.collection(this.owner.city).doc(this.owner.shopId).collection('sellProducts').doc(this.$route.params.voucher_id).onSnapshot(snapshot => {
        this.selectedInvoice = snapshot.data();
        this.totalPrice =0;
        for(let i =0 ;i<this.selectedInvoice.countList.length;i++){
          this.costPerItem.push(parseInt(this.selectedInvoice.sellPriceList[i])*parseInt(this.selectedInvoice.countList[i]))
        }
        this.costPerItem.forEach(price=>{
          this.totalPrice += parseInt(price);
        })
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

    /*
    viewInvoice(invoice){
      this.costPerItem = [];
      this.selectedInvoice = invoice;
      this.totalPrice = 0;
      //console.log(this.selectedProduct)
      for(let i =0 ;i<this.selectedInvoice.countList.length;i++){
        this.costPerItem.push(parseInt(this.selectedInvoice.sellPriceList[i])*parseInt(this.selectedInvoice.countList[i]))
      }
      this.costPerItem.forEach(price=>{
        this.totalPrice += parseInt(price);
      })
    },
*/
    closeInfoModal(){
      this.infoModalActive = !this.infoModalActive;
    },
    cancel(){
      this.confirmActive = !this.confirmActive;
    },
    /*async deleteRecordAndDoc(){
      db.collection(this.owner.city).doc(this.owner.shopId).collection('customer').doc(this.customerToDelete.id).collection('cash').onSnapshot(snapshot => {
        if(snapshot.exists){
          snapshot.forEach((doc,index)=>{
            db.collection(this.owner.city).doc(this.owner.shopId).collection('customer').doc(this.customerToDelete.id).collection('cash').doc(doc.data().id).delete();
            console.log(snapshot.size,'==',index)
            if(snapshot.size === index+1){
              db.collection(this.owner.city).doc(this.owner.shopId).collection('customer').doc(this.customerToDelete.id).delete().then(()=>{
                this.loadingActive = false;
                this.modalMessage='Deleted';
                this.infoModalActive=true;
              });
            }
          });
        }else {
          db.collection(this.owner.city).doc(this.owner.shopId).collection('customer').doc(this.customerToDelete.id).delete().then(()=>{
            this.loadingActive = false;
            this.modalMessage='Deleted';
            this.infoModalActive=true;
          });
        }
      });

    },

    async confirm(){
      if(this.confirmStatus === 'delete'){
        this.loadingActive = true;
        this.confirmActive = !this.confirmActive;
        if(this.customerToDelete.image!==''){
          const storageRef = await firebase.storage().ref();
          // Create a reference to the file to delete
          const imgRef = storageRef.child(`/${this.owner.city}/${this.owner.shopId}/customer/${this.customerToDelete.id}`)
          // Delete the file
          imgRef.delete().then(() => {
            console.log('delete ok');
            this.deleteRecordAndDoc();
            // File deleted successfully
          }).catch((error) => {
            console.log(error.message)
          });
        }else {
          await this.deleteRecordAndDoc()
        }

      }else {
        this.loadingActive = true;
        this.confirmActive = !this.confirmActive;
        console.log('edit confirmed');
        if(!this.editFile){
          db.collection(this.owner.city).doc(this.owner.shopId).collection('customer').doc(this.selectedCustomer.id).update({
            'name':this.selectedCustomer.name,
            'phone':this.selectedCustomer.phone,
            'address':this.selectedCustomer.address
          }).then(()=>{
            console.log('update ok')
          });
        }else {
          // console.log(this.selectedCustomer.id)
          const storageRef = firebase.storage().ref();
          const imgRef = storageRef.child(`/${this.owner.city}/${this.owner.shopId}/customer/${this.selectedCustomer.id}`)
          imgRef.put(this.editFile).on("state_changed", () => {
          }, error => {
            console.log(error);
          }, async () => {
            const img_src = await imgRef.getDownloadURL();
            this.selectedCustomer.image = img_src;
            await db.collection(this.owner.city).doc(this.owner.shopId).collection('customer').doc(this.selectedCustomer.id).update({
              'name':this.selectedCustomer.name,
              'phone':this.selectedCustomer.phone,
              'address':this.selectedCustomer.address,
              'image':img_src
            }).then(()=>{
              console.log('update ok')
            })
          })
        }
      }

    },

    deleteCustomer(customer){
      this.customerToDelete = customer;
      this.confirmStatus = 'delete';
      this.modalMessage='Are you sure to Delete?'
      this.confirmActive = true;
    },*/
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

    addNewTransaction(){
      let batch = db.batch();
      console.log('id', this.selectedInvoice.id);
      console.log(timestamp)
      if(this.selectedPaymentType!=='' && this.transactionAmount!==''){
        this.loadingActive = true;
        let amount = '';
        let debt = '';
        if(this.selectedCustomer.debt!==''){
          debt =(parseInt(this.selectedCustomer.debt) - parseInt(this.transactionAmount));
        }else {
          debt =amount;
        }
        console.log('debt' , debt);

        let customerRef = db.collection(this.owner.city).doc(this.owner.shopId).collection('customer').doc(this.selectedCustomer.id);
        batch.update(customerRef,{
          'debt':debt.toString()
        });

        let newChange=0;
        let newCredit=0;
        let newCashReceived = parseInt(this.selectedInvoice.cashReceived) + this.transactionAmount;
        if(newCashReceived >= parseInt(this.selectedInvoice.totalPrice)){
          newChange =newCashReceived-parseInt(this.selectedInvoice.totalPrice);
        }else {
          newCredit = parseInt(this.selectedInvoice.totalPrice)-newCashReceived;
        }
       let invoiceRef =  db.collection(this.owner.city).doc(this.owner.shopId).collection('sellProducts').doc(this.selectedInvoice.id);
        batch.update(invoiceRef,{
          'cashReceived':newCashReceived.toString(),
          'credit':newCredit.toString(),
          'change':newChange.toString()
        });

        console.log('id next',this.selectedInvoice.id)
        console.log('voucher update ok');
        let voucherRecordRef = db.collection(this.owner.city).doc(this.owner.shopId).collection('sellProducts').doc(this.selectedInvoice.id).collection('record').doc();
        batch.set(voucherRecordRef,{
          'id':voucherRecordRef.id,
          'totalPrice':this.selectedInvoice.totalPrice,
          'credit':newCredit.toString(),
          'cashReceived':this.transactionAmount.toString(),
          'change':newChange.toString(),
          'note':this.transactionNote,
          'paymentMethod':this.selectedInvoice.paymentMethod,
          'dateTime':this.currentDateTime,
          'time':timestamp
        });

        console.log('voucher record added');
        let paymentRef = db.collection(this.owner.city).doc(this.owner.shopId).collection('paymentMethods').doc(this.selectedPaymentType.id).collection('transaction').doc();
        batch.set(paymentRef,{
          'id':paymentRef.id,
          'customerId':this.selectedCustomer.id,
          'customerName':this.selectedCustomer.name,
          'vouncherId':this.selectedInvoice.vouncherId,
          'sellProductId':this.selectedInvoice.id,
          'cashReceived':this.transactionAmount.toString(),
          'credit':newCredit.toString(),
          'change':newChange.toString(),
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
          'receivedAmount': this.transactionAmount.toString(),
          'status': "payCredit",
          'time':timestamp,
          'vouncherId':this.selectedInvoice.vouncherId,
          'year':this.currentYear,
        });

        batch.commit();
        console.log('transaction added to payment');
        //this.selectedInvoice='';
        // this.selectedPaymentType ='';
        //this.getInvoiceFroRouteId();
        this.selectedCustomerRecords=[];
        this.transactionAmount='';
        this.loadingActive = false;
        this.modalMessage = 'Payment Update Success!'
        this.infoModalActive = true;
        this.transactionNote='';
        //this.$router.back();
        // this.$router.push({name:'CustomerDetail', params:{customer_id:this.selectedCustomer.id, voucher_id:this.selectedInvoice.id}})
        console.log('added')

      }else {
        this.loadingActive = false;
        this.infoModalActive =true;
        this.modalMessage =this.$t('message.select_payment_amount')
      }
    },
    onChangePhotoInput(e) {
      this.file = e.target.files[0];
    },
    onChangeUpdatePhotoInput(e) {
      this.editFile = e.target.files[0];
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

.history-container{
  border-radius: var(--border-radius);
  background-color: var(--background-color);
  height: 36vh;
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