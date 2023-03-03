<template>
  <!--  Shop-->
  <div class="container-fluid" style="background-color: var(--background-color); color: var(--text-color);">
    <Loading v-if="loadingActive"/>
    <InfoDialog v-if="infoModalActive" :modal-message="modalMessage" v-on:close-modal="closeInfoModal"/>
    <confirm-dialog :modal-message="modalMessage" v-if="confirmActive" v-on:confirm="confirm" v-on:cancel="cancel"/>

    <div class="row">
      <div class="col-lg-2 p-0">
        <AdminSidebar/>
      </div>

      <div class="col-12 col-lg-10 mt-5 pt-3">

        <div class="modal fade mt-4" id="exampleModalToggle" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex="-1">
          <div class="modal-dialog modal-xl modal-dialog-centered">
            <div class="modal-content" style="background-color: var(--background-color);">
              <div class="modal-header border-0">
                <h5 class="modal-title">Customer Detail</h5>
                <button type="button" style="color: var(--text-color)!important;" id="btn-close" class="btn" data-bs-dismiss="modal" aria-label="Close"><i class="fas fa-times"></i></button>
              </div>
              <div class="modal-body">
                <div class="row">
                  <div class="col-md-6" >
                    <div class="card-outside">
                      <p class="fs-3">
                        Add Transaction
                      </p>
                      <span>Fill information to add new transaction</span>
                      <div class="d-flex justify-content-between">
                        <button class="btn rounded-0 text-danger w-50 text-center" @click="toGetActive = true;" :class="toGetActive?'btn-active':''">To Get</button>
                        <button class="btn rounded-0 text-success w-50 text-center" @click="toGetActive = false;" :class="!toGetActive?'btn-active':''">Paid</button>
                      </div>
                      <div class="mt-2">
                        <div class="d-flex">
                          <input type="date" required class="form-control" v-model="transactionDate">
                          <input type="number" required class="form-control" v-model="transactionAmount" placeholder="Amount">
                        </div>
                        <textarea name="note mt-2" class="form-control" id="note" cols="30" v-model="transactionNote" rows="10" placeholder="Note(optional)"></textarea>
                        <button class="btn mt-2 btn-primary" @click="addNewTransaction">Confirm</button>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6" >
                    <div class="card-outside">
                      <span class="fs-3">Transaction Details</span>
                      <div class="d-flex">
                        <div class="text-start d-flex align-items-center justify-content-center" >
                          <img :src="selectedSupplier.image" class="m-1" width="100" height="100" style="border-radius: var(--border-radius);" alt="">
                        </div>
                        <div class="form-floating mb-3 ms-2 d-flex flex-column">
                          <span>{{selectedSupplier.name}}</span>
                          <span>{{selectedSupplier.phone}}</span>
                          <span>{{selectedSupplier.address}}</span>
                        </div>

                      </div>
                      <div class="d-flex justify-content-between">
                        <div class="d-flex flex-column">
                          <span>Total Credit</span>
                          <span class="text-danger">{{this.selectedSupplier.debt}} Ks</span>
                        </div>
                        <div class="d-flex flex-column">
                          <span>Total Debit</span>
                          <span class="text-success">{{this.selectedSupplierTotalDebit}}Ks</span>
                        </div>
                      </div>
                      <div v-if="selectedSupplierRecords.length>0">
                        <div class="card-container">
                          <div class="card p-2 " v-for="(cash,index) in this.selectedSupplierRecords" :key="index" style="background-color: var(--light)!important;min-height: 30px !important;">
                            <div class="d-flex justify-content-between align-items-end">
                              <div class="d-flex flex-column">
                                <span>{{cash.status==='cashout'? '(Paid)':'(To Get)'}}</span>
                                <span>{{cash.day}}</span>
                              </div>
                              <div>
                                <span :class="cash.status === 'cashout'? 'text-success':'text-danger'">{{cash.amount}} ks</span>
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
        <div class="row">
          <div class="d-flex align-items-center">
            <button @click="$router.back()" style="color: var(--text-color);" class=" btn fs-5"><i class="fas fa-chevron-left"> </i>
            </button>
            <span class="fs-3">Add Supplier</span>

          </div>
          <div class="col-12 col-lg-5 mb-1">
            <div class="rounded">
              <div class="card-body">
                <div class="form">
                  <div class="text-start">
                    <label for="img-input" class="mb-2">Upload Images (Optional)</label>
                    <input required type="file" @change="onChangePhotoInput" accept="image/*" id="img-input" multiple class="form-control mb-3" ref="photo" placeholder="photo">
                  </div>
                  <div class="form-floating mb-3">
                    <input type="text" required class="form-control" v-model="supplier.name" id="supplier-name" placeholder="enter name">
                    <label for="barcode-input">Name</label>
                  </div>
                  <div class="form-floating mb-3">
                    <input type="text" required class="form-control" v-model="supplier.phone" id="supplier-phone" placeholder="enter phone">
                    <label for="barcode-input">Phone</label>
                  </div>
                  <div class="form-floating mb-3">
                    <input type="text" required class="form-control" v-model="supplier.address" id="supplier-address" placeholder="enter address">
                    <label for="barcode-input">Address</label>
                  </div>
                  <button class="btn float-end" style="background-color: var(--btnLight);" @click.prevent="upload">Confirm</button>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-lg-7 table-responsive">
            <table class="table table-hover table-bordered">
              <thead>
              <tr>
                <th>#</th>
                <th>Photo</th>
                <th>Name</th>
                <th>Debt</th>
                <th>Control</th>
                <!--                <th>Created At</th>-->
              </tr>
              </thead>
              <tbody>
              <tr v-for="(supplier, index) in suppliers" :key="index">
                <td>{{index+1}}</td>
                <td>
                  <img :src="supplier.image" v-if="supplier.image!==''" width="50" height="50" class="rounded" alt="">
                  <img src="../../assets/flash/1.png" v-else width="50" height="50" class="rounded" alt="">
                </td>
                <td>{{supplier.name}}</td>
                <td class="text-danger">{{supplier.debt}} Ks</td>
                <td>

                  <button type="button" class="btn btn-primary btn-sm mx-1" @click="openDetailBox(supplier)" data-bs-toggle="modal" data-bs-target="#exampleModalToggle">
                    <i class="fas fa-info-circle"></i>
                  </button>

                  <button type="button" class="btn btn-warning btn-sm mx-1" @click="openEditBox(supplier)" data-bs-toggle="modal" data-bs-target="#supplierEditModal">
                    <i class="fas fa-edit"></i>
                  </button>

                  <div class="modal fade" style="z-index: 10000;" id="supplierEditModal"  tabindex="-1" aria-labelledby="liveCountModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                      <div class="modal-content">
                        <div class="modal-header border-0">
                          <h5 class="modal-title" id="liveCountModalLabel">Customer: {{selectedSupplier.name}}</h5>
                          <button type="button" id="btn-close" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                          <div class="row">
                            <div class="text-start d-flex align-items-center justify-content-center" >
                              <img :src="selectedSupplier.image" class="m-1" width="100" height="100" style="border-radius: var(--border-radius);" alt="">
                            </div>
                            <div>
                              <label for="img-input" class="mb-2">Upload Images (Optional)</label>
                              <input required type="file" @change="onChangeUpdatePhotoInput" accept="image/*" id="img-input" multiple class="form-control mb-3" ref="updatePhoto" placeholder="photo">

                            </div>
                            <div class="form-floating mb-3">
                              <input type="text" required class="form-control" v-model="selectedSupplier.name" id="edit-supplier-name" placeholder="enter name">
                              <label for="edit-supplier-name">name</label>
                            </div>
                            <div class="form-floating mb-3">
                              <input type="text" required class="form-control" v-model="selectedSupplier.phone" id="edit-supplier-phone" placeholder="enter phone">
                              <label for="edit-supplier-phone">phone</label>
                            </div>
                            <div class="form-floating mb-3">
                              <input type="text" required class="form-control" v-model="selectedSupplier.address" id="edit-supplier-address" placeholder="enter address">
                              <label for="edit-supplier-address">address</label>
                            </div>
                            <div class="d-flex justify-content-end">
                              <button class="btn " style="background-color: var(--btnLight);" @click.prevent="updateCustomer">Save</button>

                            </div>

                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button class="btn btn-danger btn-sm me-1" @click="deleteCustomer(supplier)"><i class="fas fa-trash"></i></button>


                </td>
                <!--                <td><i class="fas fa-calendar m-1"></i> <span>{{supplier.createdAt.toDate().toLocaleDateString()}}</span> <i class="fas fa-clock mx-1"></i> <span>{{supplier.createdAt.toDate().toLocaleTimeString()}}</span></td>-->
              </tr>
              </tbody>
            </table>
          </div>

        </div>

      </div>

    </div>
  </div>
</template>

<script>
import db,{timestamp} from "@/config/FirebaseInit";
import Loading from "@/components/Loading";
import InfoDialog from "@/components/InfoDialog";
import ConfirmDialog from "@/components/ConfirmDialog";
import AdminSidebar from "@/components/AdminSidebar";
import firebase from "firebase/compat";
import html2canvas from "html2canvas";
export default {
  components: {ConfirmDialog, InfoDialog, Loading, AdminSidebar},
  data(){
    return{
      dismissModal:'true',
      file:'',
      suppliers:[],
      newCategoryName:'',
      confirmStatus:'',
      editFile:'',
      selectedSupplier:'',
      productsOfCategory:[],
      supplier:{
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
      selectedSupplierRecords:[],
      supplierInvoice:[],
      selectedSupplierTotalCredit:'',
      selectedSupplierTotalDebit:'',
      toGetActive:true,

      transactionDate:'',
      transactionAmount:'',
      transactionNote:'',

      costPerItem :[],
      selectedInvoice:'',

      loadingActive:false,
      infoModalActive:false,
      confirmActive:false,
      modalMessage:'',
      supplierToDelete:'',
    }
  },
  computed:{
    owner(){
      return this.$store.getters.getShopOwner;
    },
    today(){
      return this.getToday();
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
    }
  },
  async mounted() {
    this.$store.dispatch("getDateTime");
    this.$store.dispatch("getDay");
    this.$store.dispatch("getMonth");
    this.$store.dispatch("getYear");
    await db.collection(this.owner.city).doc(this.owner.shopId).collection('supplier').onSnapshot(snapshot => {
      this.suppliers = [];
      snapshot.forEach(doc=>{
        this.suppliers.push(doc.data());
      })
    })
  },
  methods:{
    closeInfoModal(){
      this.infoModalActive = !this.infoModalActive;
    },
    cancel(){
      this.confirmActive = !this.confirmActive;
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
    async deleteRecordAndDoc(){
      await db.collection(this.owner.city).doc(this.owner.shopId).collection('supplier').doc(this.supplierToDelete.id).collection('cash').onSnapshot(snapshot => {
        if(snapshot.exists){
          snapshot.forEach((doc,index)=>{
            db.collection(this.owner.city).doc(this.owner.shopId).collection('supplier').doc(this.supplierToDelete.id).collection('cash').doc(doc.data().id).delete();
            if(snapshot.size === index+1){
              db.collection(this.owner.city).doc(this.owner.shopId).collection('supplier').doc(this.supplierToDelete.id).delete().then(()=>{
                this.loadingActive = false;
                this.modalMessage='Deleted';
                this.infoModalActive=true;
              });
            }
          });
        }else {
          db.collection(this.owner.city).doc(this.owner.shopId).collection('supplier').doc(this.supplierToDelete.id).delete().then(()=>{
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
        if(this.supplierToDelete.image!==''){
          const storageRef = await firebase.storage().ref();
          // Create a reference to the file to delete
          const imgRef = storageRef.child(`/${this.owner.city}/${this.owner.shopId}/supplier/${this.supplierToDelete.id}`)

          // Delete the file
          imgRef.delete().then(() => {
            console.log('delete ok');
            this.deleteRecordAndDoc();
          }).catch((error) => {
            console.log(error.message)
            // Uh-oh, an error occurred!
          });
        }else {
          await this.deleteRecordAndDoc();
        }
      }else {
        this.loadingActive = true;
        this.confirmActive = !this.confirmActive;
        console.log('edit confirmed')
        if(!this.editFile){
          db.collection(this.owner.city).doc(this.owner.shopId).collection('supplier').doc(this.selectedSupplier.id).update({
            'name':this.selectedSupplier.name,
            'phone':this.selectedSupplier.phone,
            'address':this.selectedSupplier.address
          }).then(()=>{
            console.log('update ok')
          });
        }else {
          // console.log(this.selectedSupplier.id)
          const storageRef = firebase.storage().ref();
          const imgRef = storageRef.child(`/${this.owner.city}/${this.owner.shopId}/supplier/${this.selectedSupplier.id}`)
          imgRef.put(this.editFile).on("state_changed", () => {
          }, error => {
            console.log(error);
          }, async () => {
            const img_src = await imgRef.getDownloadURL();
            this.selectedSupplier.image = img_src;
            await db.collection(this.owner.city).doc(this.owner.shopId).collection('supplier').doc(this.selectedSupplier.id).update({
              'name':this.selectedSupplier.name,
              'phone':this.selectedSupplier.phone,
              'address':this.selectedSupplier.address,
              'image':img_src
            }).then(()=>{
              console.log('update ok')
            })
          })
        }
      }

    },
    deleteCustomer(supplier){
      this.supplierToDelete = supplier;
      this.confirmStatus = 'delete';
      this.modalMessage='Are you sure to Delete?'
      this.confirmActive = true;
    },
    async openEditBox(supplier){
      this.selectedSupplier = supplier;

    },
    async getTransaction(){
      this.selectedSupplierRecords = [];
      this.selectedSupplierTotalDebit =0;
      this.selectedSupplierTotalCredit=0;
      await db.collection(this.owner.city).doc(this.owner.shopId).collection('supplier').doc(this.selectedSupplier.id).collection('cash').orderBy('time','desc').onSnapshot(snapshot => {
        snapshot.forEach(doc=>{
          this.selectedSupplierRecords.push(doc.data());
          if(doc.data().status === 'cashout'){
            this.selectedSupplierTotalDebit += parseInt(doc.data().amount.slice(1));
          }else {
            this.selectedSupplierTotalCredit += parseInt(doc.data().amount.slice(1));
          }
        });
        console.log(this.selectedSupplierRecords)
      });
    },
    async openDetailBox(supplier){
      this.selectedSupplierTotalCredit = 0;
      this.selectedSupplierTotalDebit=0;
      this.selectedSupplier = supplier;
      await this.getTransaction();

    },
    formatDate(payload){
      const date = new Date(payload);
      let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
      let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
      let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
      return day+"-"+month+"-"+year;
    },
    async addNewTransaction(){
      if(this.transactionDate!=='' && this.transactionAmount!==''){
        let status = '';
        let amount = '';
        let debt = '';
        if(this.toGetActive){
          status = 'cashin'
          amount = '-'+ this.transactionAmount;

        }else {
          status = 'cashout';
          amount = '+'+ this.transactionAmount;
        }
        if(this.selectedSupplier.debt!==''){
          debt =(parseInt(this.selectedSupplier.debt) + parseInt(amount));
        }else {
          debt =amount;
        }
        console.log('debt' , debt)
        const recordRef = await db.collection(this.owner.city).doc(this.owner.shopId).collection('supplier').doc(this.selectedSupplier.id).collection('cash').doc();
        recordRef.set({
          'amount':amount,
          'supplierId':this.selectedSupplier.id,
          'day':this.formatDate(this.transactionDate),
          'id':recordRef.id,
          'note':this.transactionNote,
          'status':status,
          'time':timestamp
        }).then(()=>{
          db.collection(this.owner.city).doc(this.owner.shopId).collection('supplier').doc(this.selectedSupplier.id).update({
            'debt':debt.toString()
          }).then(()=>{
            this.selectedSupplierRecords=[];
            this.getTransaction();
            console.log('added')
          })

        })
      }else {
        alert('Fill date and amount')
      }
    },
    closeModal(){
      this.infoModalActive = !this.infoModalActive;
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
        db.collection(this.owner.city).doc(this.owner.shopId).collection('supplier').doc(this.selectedSupplier.id).update({
          'name':this.selectedSupplier.name,
          'address':this.selectedSupplier.address,
          'phone':this.selectedSupplier.phone
        }).then(()=>{
          console.log('update ok')
          this.loadingActive = false;
          document.getElementById('btn-close').click();
        })
      }else {
        console.log(this.selectedSupplier.id)
        const storageRef = firebase.storage().ref();
        const imgRef = storageRef.child(`/${this.owner.city}/${this.owner.shopId}/supplier/${this.selectedSupplier.id}`)
        imgRef.put(this.editFile).on("state_changed", () => {
        }, error => {
          console.log(error);
        }, async () => {
          const img_src = await imgRef.getDownloadURL();
          this.selectedSupplier.image = img_src;
          await db.collection(this.owner.city).doc(this.owner.shopId).collection('supplier').doc(this.selectedSupplier.id).update({
            'name':this.selectedSupplier.name,
            'image':img_src,
            'address':this.selectedSupplier.address,
            'phone':this.selectedSupplier.phone
          }).then(()=>{
            this.loadingActive = false;
            console.log('update ok')
            document.getElementById('btn-close').click();
          })
        })
      }


    },
    async upload(){
      this.supplier.day=this.currentDay;
      this.supplier.month = this.currentMonth;
      this.supplier.year = this.currentYear;
      this.supplier.time = timestamp;
      if(this.supplier.name!=='' && this.supplier.phone!='' && this.supplier.address!==''){
        this.loadingActive = true;
        const supplierRef =  await db.collection(this.owner.city).doc(this.owner.shopId).collection('supplier').doc()
        this.supplier.id = supplierRef.id;
        if(this.file) {
          const storageRef = await firebase.storage().ref();
          const imgRef = storageRef.child(`/${this.owner.city}/${this.owner.shopId}/supplier/${supplierRef.id}`)
          imgRef.put(this.file).on("state_changed", () => {
          }, error => {
            console.log(error);
          }, async () => {
            const img_src = await imgRef.getDownloadURL();
            this.supplier.image = img_src;
            supplierRef.set(this.supplier).then(()=>{
              this.loadingActive = false;
              this.infoModalActive = true;
              this.modalMessage = "Success"
            }).catch(error=>{
              console.log(error.message)
            })
          });
        }else {
          supplierRef.set(this.supplier).then(()=>{
            this.loadingActive = false;
            this.infoModalActive = true;
            this.modalMessage = "Success"
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
tr{
  color: var(--text-color);
}
.card-container{
  height: 290px;
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
.card-outside{
  border-radius: var(--border-radius);
  padding: 10px;
  height: 500px;
  background-color: var(--side-bar-bg) !important;
}
@media only screen and (max-width: 1030px) {
  .content-box {
    margin-top: 90px;
  }
}
</style>