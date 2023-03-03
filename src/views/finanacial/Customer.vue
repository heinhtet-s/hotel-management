<template>
  <!--  Shop-->
  <admin-sidebar>
    <Loading v-if="loadingActive"/>
    <InfoDialog v-if="infoModalActive" :modal-message="modalMessage" v-on:close-modal="closeInfoModal"/>
    <confirm-dialog :modal-message="modalMessage" v-if="confirmActive" v-on:confirm="confirm" v-on:cancel="cancel"/>

    <div class="row">
      <div class="d-flex align-items-center">
        <button @click="$router.back()" style="color: var(--text-color);" class=" btn fs-5"><i class="fas fa-chevron-left"> </i>
        </button>
        <span class="fs-3">Add Customer</span>
      </div>
      <div class="col-12 col-lg-4 mb-1">
        <div class="card">
          <div class="card-body">
            <form @submit.prevent="upload">
              <div class="text-start">
                <label for="img-input" class="mb-2">Upload Images (Optional)</label>
                <input type="file" @change="onChangePhotoInput" accept="image/*" id="img-input" multiple class="form-control mb-3" ref="photo" placeholder="photo">
              </div>
              <div class="form-floating mb-3">
                <input type="text" required class="form-control" v-model="customer.name" id="customer-name" placeholder="enter name">
                <label for="barcode-input">Name</label>
              </div>
              <div class="form-floating mb-3">
                <input type="text" required class="form-control" v-model="customer.phone" id="customer-phone" placeholder="enter phone">
                <label for="barcode-input">Phone</label>
              </div>
              <div class="form-floating mb-3">
                <input type="text" required class="form-control" v-model="customer.address" id="customer-address" placeholder="enter address">
                <label for="barcode-input">Address</label>
              </div>
              <button type="submit" class="btn float-end" style="background-color: var(--btnLight);">Confirm</button>
            </form>
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-8 ">
        <div class="card" style="height: 80vh;overflow: scroll; background-color: var(--background-color);">
          <div class="d-flex justify-content-between">
            <span class="mt-2">Customers</span>
            <div>
              <input type="text" v-model="search" @input="searchCustomer" class="form-control" placeholder="enter name">
            </div>
          </div>
          <div class="card-body table-responsive">
            <table class="table table-hover table-striped">
              <thead>
              <tr>
                <th class="text-nowrap">#</th>
                <th class="text-nowrap">Photo</th>
                <th class="text-nowrap">Name</th>
                <th class="text-nowrap">phone</th>
                <th class="text-nowrap">Debt</th>
                <th class="text-nowrap text-center">Control</th>
                <!-- <th>Created At</th>-->
              </tr>
              </thead>
              <tbody v-if="search!==''">
              <tr v-for="(customer, index) in searchedCustomerList" :key="index">
                <td class="text-nowrap">{{index+1}}</td>
                <td class="text-nowrap">
                  <img :src="customer.image" v-if="customer.image!==''" width="50" height="50" class="rounded" alt="">
                  <img src="../../assets/flash/1.png" v-else width="50" height="50" class="rounded" alt="">
                </td>
                <td class="text-nowrap">{{customer.name}}</td>
                <td class="text-nowrap">{{customer.phone}}</td>
                <td class="text-nowrap text-danger">{{customer.debt}} Ks</td>
                <td class="text-nowrap text-center">

                  <button type="button" class="btn btn-primary btn-sm mx-1" @click="openDetailBox(customer)">
                    <i class="fas fa-info-circle"></i>
                  </button>

                  <button type="button" class="btn btn-warning btn-sm mx-1" @click="openEditBox(customer)" data-bs-toggle="modal" data-bs-target="#customerEditModal">
                    <i class="fas fa-edit"></i>
                  </button>

                  <div class="modal fade" style="z-index: 10000;" id="customerEditModal"  tabindex="-1" aria-labelledby="liveCountModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                      <div class="modal-content">
                        <div class="modal-header border-0">
                          <h5 class="modal-title" id="liveCountModalLabel">Customer: {{selectedCustomer.name}}</h5>
                          <button type="button" id="btn-close" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                          <div class="row">
                            <div class="text-start d-flex align-items-center justify-content-center" >
                              <img :src="selectedCustomer.image" v-if="selectedCustomer.image!==''" class="m-1" width="100" height="100" style="border-radius: var(--border-radius);" alt="">
                              <img src="../../assets/flash/1.png" v-else width="100" height="100" alt="">
                            </div>
                            <form @submit.prevent="updateCustomer">
                              <div>
                                <label for="img-input" class="mb-2">Upload Images (Optional)</label>
                                <input type="file" @change="onChangeUpdatePhotoInput" accept="image/*" id="img-input" multiple class="form-control mb-3" ref="updatePhoto" placeholder="photo">
                              </div>
                              <div class="form-floating mb-3">
                                <input type="text" required class="form-control" v-model="selectedCustomer.name" id="edit-customer-name" placeholder="enter name">
                                <label for="edit-customer-name">name</label>
                              </div>
                              <div class="form-floating mb-3">
                                <input type="text" required class="form-control" v-model="selectedCustomer.phone" id="edit-customer-phone" placeholder="enter phone">
                                <label for="edit-customer-phone">phone</label>
                              </div>
                              <div class="form-floating mb-3">
                                <input type="text" required class="form-control" v-model="selectedCustomer.address" id="edit-customer-address" placeholder="enter address">
                                <label for="edit-customer-address">address</label>
                              </div>
                              <div class="d-flex justify-content-end">
                                <button type="submit" class="btn " style="background-color: var(--btnLight);" >Update</button>

                              </div>
                            </form>


                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button class="btn btn-danger btn-sm me-1" @click="deleteCustomer(customer)"><i class="fas fa-trash"></i></button>

                </td>
                <!--                <td><i class="fas fa-calendar m-1"></i> <span>{{customer.createdAt.toDate().toLocaleDateString()}}</span> <i class="fas fa-clock mx-1"></i> <span>{{customer.createdAt.toDate().toLocaleTimeString()}}</span></td>-->
              </tr>
              </tbody>
              <tbody v-else>
              <tr v-for="(customer, index) in customers" :key="index">
                <td class="text-nowrap">{{index+1}}</td>
                <td class="text-nowrap">
                  <img :src="customer.image" v-if="customer.image!==''" width="50" height="50" class="rounded" alt="">
                  <img src="../../assets/flash/1.png" v-else width="50" height="50" class="rounded" alt="">
                </td>
                <td class="text-nowrap">{{customer.name}}</td>
                <td class="text-nowrap">{{customer.phone}}</td>
                <td class="text-nowrap text-danger">{{customer.debt}} Ks</td>
                <td class="text-nowrap text-center">

                  <button type="button" class="btn btn-primary btn-sm mx-1" @click="openDetailBox(customer)">
                    <i class="fas fa-info-circle"></i>
                  </button>

                  <button type="button" class="btn btn-warning btn-sm mx-1" @click="openEditBox(customer)" data-bs-toggle="modal" data-bs-target="#customerEditModal">
                    <i class="fas fa-edit"></i>
                  </button>

                  <div class="modal fade" style="z-index: 10000;" id="customerEditModal"  tabindex="-1" aria-labelledby="liveCountModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                      <div class="modal-content">
                        <div class="modal-header border-0">
                          <h5 class="modal-title" id="liveCountModalLabel">Customer: {{selectedCustomer.name}}</h5>
                          <button type="button" id="btn-close" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                          <div class="row">
                            <div class="text-start d-flex align-items-center justify-content-center" >
                              <img :src="selectedCustomer.image" v-if="selectedCustomer.image!==''" class="m-1" width="100" height="100" style="border-radius: var(--border-radius);" alt="">
                              <img src="../../assets/flash/1.png" v-else width="100" height="100" alt="">
                            </div>
                            <form @submit.prevent="updateCustomer">
                              <div>
                                <label for="img-input" class="mb-2">Upload Images (Optional)</label>
                                <input type="file" @change="onChangeUpdatePhotoInput" accept="image/*" id="img-input" multiple class="form-control mb-3" ref="updatePhoto" placeholder="photo">
                              </div>
                              <div class="form-floating mb-3">
                                <input type="text" required class="form-control" v-model="selectedCustomer.name" id="edit-customer-name" placeholder="enter name">
                                <label for="edit-customer-name">name</label>
                              </div>
                              <div class="form-floating mb-3">
                                <input type="text" required class="form-control" v-model="selectedCustomer.phone" id="edit-customer-phone" placeholder="enter phone">
                                <label for="edit-customer-phone">phone</label>
                              </div>
                              <div class="form-floating mb-3">
                                <input type="text" required class="form-control" v-model="selectedCustomer.address" id="edit-customer-address" placeholder="enter address">
                                <label for="edit-customer-address">address</label>
                              </div>
                              <div class="d-flex justify-content-end">
                                <button type="submit" class="btn " style="background-color: var(--btnLight);" >Update</button>

                              </div>
                            </form>


                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button class="btn btn-danger btn-sm me-1" @click="deleteCustomer(customer)"><i class="fas fa-trash"></i></button>

                </td>
                <!--                <td><i class="fas fa-calendar m-1"></i> <span>{{customer.createdAt.toDate().toLocaleDateString()}}</span> <i class="fas fa-clock mx-1"></i> <span>{{customer.createdAt.toDate().toLocaleTimeString()}}</span></td>-->
              </tr>

              </tbody>
            </table>
          </div>

        </div>
      </div>

    </div>

  </admin-sidebar>

</template>

<script>
import db,{timestamp} from "@/config/FirebaseInit";
import Loading from "@/components/Loading";
import InfoDialog from "@/components/InfoDialog";
import ConfirmDialog from "@/components/ConfirmDialog";
import AdminSidebar from "@/components/AdminSidebar";
import firebase from "firebase/compat";
import html2canvas from "html2canvas";
import _ from "lodash";
export default {
  components: {ConfirmDialog, InfoDialog, Loading, AdminSidebar},
  data(){
    return{
      dismissModal:'true',
      file:'',
      customers:[],
      newCategoryName:'',
      showTableVoucher:'true',
      confirmStatus:'',
      editFile:'',
      selectedCustomer:'',
      productsOfCategory:[],
      customer:{
        name:"",
        id:"",
        image:"",
        debt:"0",
        address:"",
        phone:"",
        month:"",
        day:"",
        year:"",
        time:"",

      },
      selectedCustomerRecords:[],
      customerInvoice:[],
      selectedCustomerTotalCredit:'',
      selectedCustomerTotalDebit:'',
      toGetActive:true,

      searchedCustomerList:[],
      search:'',
      searchInvoiceValue:'',
      transactionDate:'',
      transactionAmount:'',
      transactionNote:'',

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

    }
  },
  computed:{
    shopInfo(){
      return this.$store.getters.getShopInfo;
    },
    owner(){
      return this.$store.getters.getShopOwner;
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
      if(!this.showAllInvoiceActive){
        return this.customerInvoice.filter(invoice=>invoice.credit>0);
      }else if(this.searchInvoiceValue!==''){
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
    this.$store.dispatch("getShopInfo",this.owner);

    await db.collection(this.owner.city).doc(this.owner.shopId).collection('customer').onSnapshot(snapshot => {
      this.customers = [];
      snapshot.forEach(doc=>{
        this.customers.push(doc.data());
      });
    });

  },
  methods:{
    searchCustomer:_.debounce(function (){
      if(this.search!==''){
        db.collection(this.owner.city)
            .doc(this.owner.shopId)
            .collection('customer').orderBy('name').startAt(this.search).endAt(this.search+'~').onSnapshot(snapshot=>{
          this.searchedCustomerList = [];
          snapshot.docs.filter(e=>{
            this.searchedCustomerList.push(e.data());

          })
        })
      }else {
        this.searchedCustomerList = [];
      }
    }, 500),
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
    },
    choosePaymentType(payment){
      this.selectedPaymentType = payment;
      this.showPaymentToggle = !this.showPaymentToggle;
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

    getInvoiceFromTransaction(id){
      this.costPerItem =[];
      this.totalPrice =0;
      let filterInvoice = this.customerInvoice.filter(invoice => invoice.id === id);
      this.selectedInvoice = filterInvoice[0];
      db.collection(this.shopInfo.city).doc(this.shopInfo.id).collection('sellProducts').doc(this.selectedInvoice.id).collection('record').onSnapshot(snapshot => {
        this.invoiceHistories=[];
        snapshot.forEach(doc=>{
          this.invoiceHistories.push(doc.data());
        })
      })
      for(let i =0 ;i<this.selectedInvoice.countList.length;i++){
        this.costPerItem.push(parseInt(this.selectedInvoice.sellPriceList[i])*parseInt(this.selectedInvoice.countList[i]))
      }
      this.costPerItem.forEach(price=>{
        this.totalPrice += parseInt(price);
      })
      /*db.collection(this.owner.city).doc(this.owner.shopId).collection('sellProducts').doc(id).onSnapshot(snapshot => {
        this.selectedInvoice = snapshot.data();
        console.log('selected credit',this.selectedInvoice);

      })*/
      // this.selectedInvoice = filterInvoice[0];

    },
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
    closeInfoModal(){
      this.infoModalActive = !this.infoModalActive;
    },
    cancel(){
      this.confirmActive = !this.confirmActive;
    },
    async deleteRecordAndDoc(){
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
        console.log('edit confirmed')
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
    },
    async openEditBox(customer){
      this.selectedCustomer = customer;

    },
    async getCustomerInvoice(){
      await db.collection(this.owner.city).doc(this.owner.shopId).collection('sellProducts').where('customerId','==',this.selectedCustomer.id).orderBy('time','desc').onSnapshot(snapshot => {
        this.customerInvoice=[];
        snapshot.forEach(doc=>{
          this.customerInvoice.push(doc.data())
        });

      });
    },
    /*async getTransaction(){
      this.selectedCustomerRecords = [];
      this.selectedCustomerTotalDebit =0;
      this.selectedCustomerTotalCredit=0;
      await db.collection(this.owner.city).doc(this.owner.shopId).collection('customer').doc(this.selectedCustomer.id).collection('cash').orderBy('time','desc').onSnapshot(snapshot => {
        snapshot.forEach(doc=>{
          this.selectedCustomerRecords.push(doc.data());
          if(doc.data().status === 'cashout'){
            this.selectedCustomerTotalDebit += parseInt(doc.data().amount.slice(1));
          }else {
            this.selectedCustomerTotalCredit += parseInt(doc.data().amount.slice(1));
          }
        });
        console.log(this.selectedCustomerRecords)
      });
    },*/
    async openDetailBox(customer){
      this.$router.push({name:'CustomerDetail',params:{customer_id:customer.id, voucher_id:''}});
      /*this.selectedCustomerTotalCredit = 0;
      this.selectedCustomerTotalDebit=0;
      this.selectedCustomer = customer;
      // await this.getTransaction();
      await this.getCustomerInvoice();*/

    },
    formatDate(payload){
      const date = new Date(payload);
      let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
      let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
      let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
      return day+"-"+month+"-"+year;
    },
    async addNewTransaction(){
      //this.loadingActive = true;
     if(this.selectedPaymentType!=='' && this.transactionAmount!==''){
       // let status = '';
       let amount = '';
       let debt = '';

       /*if(this.toGetActive){
         status = 'cashin'
         amount = '-'+ this.transactionAmount;
       }else {
         status = 'cashout';
         amount = '+'+ this.transactionAmount;
       }*/

       if(this.selectedCustomer.debt!==''){
         debt =(parseInt(this.selectedCustomer.debt) - parseInt(this.transactionAmount));
       }else {
         debt =amount;
       }
       console.log('debt' , debt);
       db.collection(this.owner.city).doc(this.owner.shopId).collection('customer').doc(this.selectedCustomer.id).update({
         'debt':debt.toString()
       }).then(()=>{
         let newCashReceived = parseInt(this.selectedInvoice.cashReceived) + this.transactionAmount;
         let newChange = parseInt(this.selectedInvoice.credit) - parseInt(this.transactionAmount);
         let newCredit = parseInt(this.selectedInvoice.credit)-this.transactionAmount;
         db.collection(this.owner.city).doc(this.owner.shopId).collection('sellProducts').doc(this.selectedInvoice.id).update({
           'cashReceived':newCashReceived.toString(),
           'credit':newCredit.toString(),
           'change':newChange.toString()
         }).then(()=>{
           console.log('voucher update ok');
           let voucherRecordRef = db.collection(this.owner.city).doc(this.owner.shopId).collection('sellProducts').doc(this.selectedInvoice.id);
           voucherRecordRef.set({
             'id':voucherRecordRef.id,
             'totalPrice':this.selectedInvoice.totalPrice,
             'credit':newCredit.toString(),
             'cashReceived':this.transactionAmount.toString(),
             'change':newChange.toString(),
             'paymentMethod':this.selectedInvoice.paymentMethod,
             'dateTime':this.currentDateTime,
             'time':timestamp
           }).then(()=>{
             console.log('voucher record added');
             let paymentRef = db.collection(this.owner.city).doc(this.owner.shopId).collection('paymentMethods').doc(this.selectedPaymentType.id).collection('transaction').doc();
             paymentRef.set({
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
             }).then(()=>{
               console.log('transaction added to payment');
               this.selectedCustomerRecords=[];
               this.selectedInvoice='';
               this.selectedPaymentType ='';
               this.transactionAmount='';
               // this.getTransaction();
               console.log('added')
             })
           })
         })
       })
       //====================
       /*const recordRef = await db.collection(this.owner.city).doc(this.owner.shopId).collection('customer').doc(this.selectedCustomer.id).collection('cash').doc();
       if(status === 'cashout'){
         recordRef.set({
           'amount':amount,
           'customerId':this.selectedCustomer.id,
           'day':this.formatDate(this.transactionDate),
           'id':recordRef.id,
           'note':this.transactionNote,
           'status':status,
           'time':timestamp,
           'vouncherId':this.selectedInvoice.vouncherId,
           'sellProductId':this.selectedInvoice.id
         }).then(()=>{
           db.collection(this.owner.city).doc(this.owner.shopId).collection('customer').doc(this.selectedCustomer.id).update({
             'debt':debt.toString()
           }).then(()=>{
             let newCashReceived = parseInt(this.selectedInvoice.cashReceived) + this.transactionAmount;
             let newCredit = parseInt(this.selectedInvoice.credit)-this.transactionAmount;
             db.collection(this.owner.city).doc(this.owner.shopId).collection('sellProducts').doc(this.selectedInvoice.id).update({
               'cashReceived':newCashReceived.toString(),
               'credit':newCredit.toString()
             }).then(()=>{
               console.log('voucher update ok');
               let newChange = parseInt(this.selectedInvoice.credit) - parseInt(this.transactionAmount);
               let voucherRecordRef = db.collection(this.owner.city).doc(this.owner.shopId).collection('sellProducts').doc(this.selectedInvoice.id);
                 voucherRecordRef.set({
                 'id':voucherRecordRef.id,
                 'totalPrice':this.selectedInvoice.totalPrice,
                 'credit':this.selectedInvoice.credit,
                 'cashReceived':this.transactionAmount.toString(),
                 'change':newChange.toString(),
                 'paymentMethod':this.checkoutItem.paymentMethod,
                 'status' : 'paidRemain',
                 'day':this.currentDay,
                 'time':timestamp
               }).then(()=>{
                 console.log('voucher record added');
                   let paymentRef = db.collection(this.owner.city).doc(this.owner.shopId).collection('paymentMethods').doc(this.selectedPaymentType.id).collection('transaction').doc();
                   paymentRef.set({
                     'id':paymentRef.id,
                     'customerId':this.selectedCustomer.id,
                     'customerName':this.selectedCustomer.name,
                     'vouncherId':this.selectedInvoice.vouncherId,
                     'sellProductId':this.selectedInvoice.id,
                     'amount':this.transactionAmount.toString(),
                     'day':this.transactionDate,
                     'time':timestamp
                   }).then(()=>{
                     console.log('transaction added to payment');
                     this.selectedCustomerRecords=[];
                     this.getTransaction();
                     console.log('added')
                   })
                 })
             })
           })
         })
       }else {
         recordRef.set({
           'amount':amount,
           'customerId':this.selectedCustomer.id,
           'day':this.formatDate(this.transactionDate),
           'id':recordRef.id,
           'note':this.transactionNote,
           'status':status,
           'time':timestamp
         }).then(()=> {
           db.collection(this.owner.city).doc(this.owner.shopId).collection('customer').doc(this.selectedCustomer.id).update({
             'debt': debt.toString()
           }).then(() => {
           })
         })

       }*/

     }else {
       alert('Fill date and amount')
     }
    },
    onChangePhotoInput(e) {
      this.file = e.target.files[0];
    },
    onChangeUpdatePhotoInput(e) {
      this.editFile = e.target.files[0];
    },
    async updateCustomer(){
      this.loadingActive = true;
      if(!this.editFile){
        db.collection(this.owner.city).doc(this.owner.shopId).collection('customer').doc(this.selectedCustomer.id).update({
          'name':this.selectedCustomer.name,
          'address':this.selectedCustomer.address,
          'phone':this.selectedCustomer.phone
        }).then(()=>{
          console.log('update ok')
          this.loadingActive = false;
          document.getElementById('btn-close').click();
        })
      }else {
        console.log(this.selectedCustomer.id)
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
            'image':img_src,
            'address':this.selectedCustomer.address,
            'phone':this.selectedCustomer.phone
          }).then(()=>{
            this.loadingActive = false;
            console.log('update ok')
            document.getElementById('btn-close').click();
          })
        })
      }


    },
    async upload(){
      this.customer.day=this.currentDay;
      this.customer.month = this.currentMonth;
      this.customer.year = this.currentYear;
      this.customer.time = timestamp;
      if(this.customer.name!=='' && this.customer.phone!='' && this.customer.address!==''){
        this.loadingActive = true;
        const customerRef =  await db.collection(this.owner.city).doc(this.owner.shopId).collection('customer').doc()
        this.customer.id = customerRef.id;
        if(this.file) {
          const storageRef = await firebase.storage().ref();
          const imgRef = storageRef.child(`/${this.owner.city}/${this.owner.shopId}/customer/${customerRef.id}`)
          imgRef.put(this.file).on("state_changed", () => {
          }, error => {
            console.log(error);
          }, async () => {
            const img_src = await imgRef.getDownloadURL();
            this.customer.image = img_src;
            customerRef.set(this.customer).then(()=>{
              this.loadingActive = false;
              this.infoModalActive = true;
              this.modalMessage = "Success"
              this.customer.name='';
              this.customer.phone ='';
              this.customer.address='';
              this.file='';

            }).catch(error=>{
              console.log(error.message)
            })
          });
        }else {
          customerRef.set(this.customer).then(()=>{
            this.loadingActive = false;
            this.infoModalActive = true;
            this.modalMessage = "Success";
            this.customer.name='';
            this.customer.phone ='';
            this.customer.address='';
            this.file='';
          }).catch(error=>{
            console.log(error.message)
          })
        }
      }else {
        this.loadingActive = false;
        this.infoModalActive = true;
        this.modalMessage = "Enter Customer name"
      }
    }
  }
}
</script>

<style scoped>
.btn-group{
  width: 100%;
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
tr{
  color: var(--text-color);
}
.card-container{
  height: 300px;
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
  height: 85vh;
  overflow-y: scroll;
}
.card-outside{
  border-radius: var(--border-radius);
  padding: 10px;
  height:90vh;
  background-color: var(--light) !important;
}
@media only screen and (max-width: 1030px) {
  .content-box {
    margin-top: 90px;
  }
}
</style>