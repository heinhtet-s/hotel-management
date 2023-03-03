<template>
    <AdminNavigation>
      <Loading v-if="loadingActive"/>
      <InfoDialog v-if="infoModalActive" :modal-message="modalMessage" v-on:close-modal="closeModal"/>
      <ConfirmDialog :modal-message="modalMessage" v-if="confirmActive" v-on:confirm="confirm" v-on:cancel="cancel"/>

      <div class="container-fluid" v-if="shopInfo">
        <div class="row pt-5">
          <div class="d-flex align-items-center my-2">
            <button class="btn btn--white fs-5" @click="$router.back()"><i class="fas fa-chevron-left"></i></button>
            <span class="fs-3">Shop Edit Panel</span>
          </div>
          <div class="col-12 col-lg-4" >

            <div class="form-scroller">
              <form class="form mt-3 mb-5 pb-5" @submit.prevent="saveUpdates">
                <p class="fw-bold my-2 mx-2">Shop ID: {{currentShop.shopId}}</p>
                <div class="row">
                  <div v-if="previewImage!==null">
                    <img :style="{ 'background-image': `url(${previewImage})` }" @click="selectImage" class="imagePreviewWrapper" alt="">
                  </div>
                  <div v-else>
                    <img :src="currentShop.profileUrl" width="200" @click="selectImage" height="200" alt="">
                  </div>

                  <div class="col-12 mb-2">
                    <label class="form-label mt-1">Change Profile:</label>
                    <input type="file" ref="fileInput" @input="pickFile" accept="image/*" id="img-input" class="form-control d-inline">
                  </div>

                  <div class="col-12 col-lg-6">
                    <div class="form-floating mb-3">
                      <input type="text" required class="form-control" v-model="currentShop.name" id="name-input" placeholder="enter shop name">
                      <label for="name-input">Shop Name</label>
                    </div>
                  </div>
                  <div class="col-12 col-lg-6">
                    <div class="form-floating mb-3">
                      <input type="text" required class="form-control" v-model="currentShop.shopCode" id="shop-code-input" placeholder="enter shop code">
                      <label for="shop-code-input">Shop Code</label>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12 col-lg-6">
                    <div class="form-floating mb-3">
                      <input type="email" disabled required class="form-control" v-model="currentShop.email" id="email-input" placeholder="enter shop email">
                      <label for="email-input">Shop Email</label>
                    </div>
                  </div>
                  <div class="col-12 col-lg-6">
                    <div class="form-floating mb-3">
                      <input type="text" required class="form-control" v-model="currentShop.phone" id="phone-input" placeholder="enter shop phone">
                      <label for="phone-input">Shop Phone</label>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12 col-lg-6 mb-3">
                    <label class="form-label">City</label>
                    <select class="form-select fs-6 form-control form-select-lg bg-transparent rounded" disabled style="height: 60px"  v-model="currentShop.city" aria-label=".form-select-lg example">
                      <option value="Choose City" selected disabled>Choose City </option>
                      <option v-for="(city, index) in cities" :key="index" :value="city.name">{{city.name}}</option>
                    </select>
                  </div>
                  <div class="col-12 col-lg-6 mb-3">
                    <label class="form-label">Sell Online?</label>
                    <select class="form-select fs-6 form-control form-select-lg bg-transparent rounded" style="height: 60px"  v-model="currentShop.onlineSell" aria-label=".form-select-sm example">
                      <option selected value="yes">yes</option>
                      <option selected value="free">free</option>
                      <option value="no">no</option>
                    </select>
                  </div>

                </div>
                <div class="row mb-1">
                  <div class="col-12">
                    <label class="form-label">Shop Types</label>
                    <div class="mb-1">
                      <span>Selected: </span>
                      <span class="badge rounded-pill bg-secondary text-light me-1" v-for="(type,index) in currentShop.shopType" :key="index">{{type}}</span>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="form-check" v-for="type in shopTypes" :key="type.id">
                      <input class="form-check-input" type="checkbox" @change="checkType($event)" :value="type.name" :checked="currentShop.shopType.includes(type.name)" :id="type.id">
                      <label class="form-check-label" :for="type.id">
                        {{type.name}}
                      </label>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12 col-lg-6">
                    <div class="">
                      <label for="phone-input">Admin Password</label>
                      <input type="text" rquired class="form-control" v-model="currentShop.adminPassword" id="admin-password-input" placeholder="enter password">
                    </div>
                  </div>
                  <div class="col-12 col-lg-6 mb-3">
                    <label class="form-label">Package</label>
                    <select required class="form-select fs-6 form-control form-select-lg bg-transparent rounded" v-model="currentShop.packageStatus" aria-label=".form-select-sm example">
                      <option value="basic">Basic</option>
                      <option value="standard">Standard</option>
                      <option value="premium">Premium</option>
                      <option value="ultra">Ultra</option>
                      <option value="restaurant">Restaurant</option>

                    </select>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12 col-lg-6 mb-3">
                    <label class="form-label">Shop Role</label>
                    <select class="form-select fs-6 form-control form-select-lg bg-transparent rounded" style="height: 60px"  v-model="currentShop.branch" aria-label=".form-select-lg example">
                      <option value="Shop Role" selected disabled>Shop Role</option>
                      <option value="main">main</option>
                      <option value="branch">branch</option>
                    </select>
                  </div>

                  <div class="col-12 col-lg-6 mb-3">
                    <label class="form-label">Promotion Type</label>
                    <select class="form-select fs-6 form-control form-select-lg bg-transparent rounded" style="height: 60px"  v-model="currentShop.promotionDisplayType" aria-label=".form-select-sm example">
                      <option selected disabled>Promo Display</option>
                      <option value="default">Default</option>
                      <option :value="type.name" v-for="type in promoTypes" :key="type.id">{{ type.name }}</option>
                    </select>
                  </div>

                  <div class="col-12">
                    <div class="form-floating mb-3">
                      <input type="text" required class="form-control" v-model="currentShop.address" id="address-input" placeholder="enter shop address">
                      <label for="address-input">Shop Address</label>
                    </div>
                  </div>

                </div>
                <div class="col-12 p-2 position-sticky"  style="background-color: var(--side-bar-bg);bottom: 0px;">
                  <button type="submit" class="btn mx-auto w-100" style="background-color: var(--btnLight);">Save</button>
                </div>
              </form>

            </div>

          </div>
          <div class="col-12 col-lg-8" >
            <div class="row bg-light">
              <div class="col-12 col-md-6">
                <span class="fs-4 my-1">Add new cashier</span>
                <!--            add cashier form-->
                <form @submit.prevent="addCashier">
                  <div class="row">
                    <div class="col-12 col-md-6">
                      <div class="form-floating">
                        <input type="text" required class="form-control" v-model="cashier.accountName" id="account-name-input" placeholder="enter account name">
                        <label for="account-name-input">Cashier Name</label>
                      </div>

                    </div>
                    <div class="col-12 col-md-6 ">
                      <div class="form-floating">
                        <input type="email" class="form-control" v-model="cashier.email" id="account-email-input" placeholder="enter account email">
                        <label for="account-email-input">Cashier Email</label>
                      </div>

                    </div>
                  </div>
                  <div class="row">
                    <div class="col-12 col-md-6 ">
                      <div class="form-floating">
                        <input type="text" required class="form-control" v-model="cashier.phone" id="account-phone-input" placeholder="enter account phone">
                        <label for="account-phone-input">Phone</label>
                      </div>

                    </div>
                    <div class="col-12 col-md-6 ">
                      <div class="form-floating">
                        <input type="text" required class="form-control" v-model="cashier.accountCode" id="account-code-input" placeholder="enter account email">
                        <label for="account-code-input">Cashier Code</label>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-12 col-md-6 ">
                      <div class="form-floating">
                        <input type="text" required class="form-control" v-model="cashier.counter" id="account-code-input" placeholder="enter account email">
                        <label for="account-code-input">Counter</label>
                      </div>
                    </div>
                    <div class="col-12 col-md-6 ">
                      <div class="form-floating">
                        <input type="text" required class="form-control" v-model="cashierPassword" id="account-password-input" placeholder="enter account password">
                        <label for="account-password-input">Password</label>
                      </div>

                    </div>
                    <div class="col-12 my-2">
                      <button type="submit" class="btn w-100 text-white" style="background-color: var(--secondary);">Register</button>
                    </div>
                  </div>

                </form>
                <!--            end add cashier form -->

              </div>
              <div class="col-12 col-md-6 bg-white border border-light border-3" style="height: 42vh; overflow-y: scroll">
                <div class="row">
                  <span class="fs-4 my-1">Cashiers</span>
                  <div class="card p-1" v-for="cashier in cashiers" :key="cashier.id">
                    <div class="p-1">
                      <div class="d-flex justify-content-between">
                        <span>{{cashier.accountLevel}}:{{cashier.accountName}}</span>
                        <span class="text-success">Account Code: {{cashier.accountCode}}</span>
                      </div>
                      <div class="d-flex flex-column" style="font-size: 12px;">
                        <span>Email: {{cashier.email}}</span>
                        <span>Counter: {{cashier.counter}}</span>

                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <div class="row bg-light">
              <div class="col-12 col-md-6">
                <div class="row align-items-end">
                  <span class="fs-4">Add new branch</span>
                  <div class="col-12 ">
                    <label class="form-label">Choose City</label>
                    <select class="form-select border-0 fs-6 form-control bg-transparent rounded" style="height: 60px;" @change="clearBranch" v-model="branchCity" aria-label="example">
                      <option v-for="(city, index) in cities" :key="index" :selected="index === 0" :value="city.name">{{city.name}}</option>
                    </select>
                  </div>
                  <div class="col-12 ">
                    <div class="align-items-center mx-1 position-relative">
                      <label class="form-label">Choose Branch</label>
                      <button :disabled="this.branchCity===''" style="cursor: pointer;height: 60px;font-size: 12px;" @click="branchInputToggle" class="border-0 p-1 form-control form-select-lg form-select text-start">{{selectedBranch.name||'choose branch'}}</button>
                      <div class="position-absolute shadow-sm p-2 mt-1" style="z-index: 100;background-color:var(--white);height: 200px; overflow-y:scroll;"  v-if="showBranch" >
                        <button class="btn" style="color:var(--text-color);" @click="this.showBranch = !this.showBranch"><i class="fas fa-times"></i></button>
                        <li v-for="(rBranch, index) in branchLists" :key="index"  class=" my-1 list-unstyled rounded p-1 text-start" @click="selectBranch(rBranch)">
                          <div class="d-flex justify-content-between">
                            <span class="fw-bold" style="font-size: 12px;">{{rBranch.name}}</span>
                          </div>
                        </li>
                      </div>
                    </div>
                  </div>
                  <div class="col-12 ">
                    <button class="btn my-3 w-100 float-end text-white" style="background-color: var(--primary)" :disabled="branchCity==='' || selectedBranch===''" @click="updateBranch">Add</button>
                  </div>
                </div>
              </div>
              <div class="col-12 col-md-6 p-1 bg-white border border-3 border-light" style="height: 42vh;overflow-y: scroll">
                <span class="fs-4">Branches</span>
                <div class="row" >
                  <div v-for="(branch, id) in shopInfo.listBranch" :key="id" class="mb-1 p-2 d-flex justify-content-between" style="background-color: var(--light);border-radius: var(--border-radius);">
                    <!--                <span class="badge bg-secondary w-25 me-2 rounded-pill">{{shopInfo.branchCity[id]}}</span>-->
                    <span class="w-75">{{branch}}, {{shopInfo.branchCity[id]}}</span>
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
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import db from "@/config/FirebaseInit";
import ConfirmDialog from "@/components/ConfirmDialog";
import InfoDialog from "@/components/InfoDialog";
import Loading from "@/components/Loading";
import AdminNavigation from "@/components/AdminNavigation";
export default {
  components: {AdminNavigation, Loading, ConfirmDialog, InfoDialog},
  data(){

    return{
      loadingActive:false,
      infoModalActive:false,
      modalMessage:'',
      confirmActive:false,
      file:'',
      currentShop:'',
      shopTypes:[],
      promoTypes:[],
      branchCity:'',
      selectedBranch:'',
      branchLists:[],
      password:'',
      showBranch:false,
      cashier:{
        FCM:'',
        accountCode:'',
        accountLevel:'cashier',
        accountName:'',
        counter:'',
        deviceId:'',
        editStatus:'yes',
        email:'',
        loginStatus:'no',
        notiStatus:'on',
        phone:'',
      },
      cashierPassword:'',
      cashiers:[],
      previewImage: null
    }
  },
  computed:{
    todayDate(){
      const today = new Date();
      const currentDate =  today.getFullYear()+"-"+(today.getMonth() + 1).toString().padStart(2, "0")+'-'+today.getDate().toString().padStart(2,"0");
      return currentDate;
    },
    cities(){
      return this.$store.state.cities;
    },
    shopInfo(){
      return this.$store.getters.getShopInfo;
    }

  },
  async mounted() {
    // await this.getShopInfo();
    await db.collection('shopRegistration').doc(this.$route.params.shop_id).get().then((result)=>{
      this.currentShop = result.data();
      console.log('current shop', this.currentShop);
      this.$store.dispatch("getShopInfo",this.currentShop);
      db.collection('shopTypes').get().then((result)=>{
        this.shopTypes=[];
        result.forEach(doc=>{
          this.shopTypes.push(doc.data())
        })
      })
      db.collection('displayPromotionType').get().then((result)=>{
        this.promoTypes=[];
        result.forEach(doc=>{
          this.promoTypes.push(doc.data())
        })
      })
      db.collection('shopRegistration').doc(this.currentShop.id).get().then((result)=>{
        this.currentShop = result.data();
        console.log('current shop',this.currentShop.city, this.currentShop.id);
        this.$store.dispatch("getShopInfo", this.currentShop);
      });
      this.getCashier();
    });

  },
  methods:{
    selectImage () {
      this.$refs.fileInput.click()
    },
    pickFile (e) {
      let input = this.$refs.fileInput
      let file = input.files
      if (file && file[0]) {
        this.file = e.target.files[0];
        let reader = new FileReader
        reader.onload = e => {
          this.previewImage = e.target.result
        }
        reader.readAsDataURL(file[0])
        this.$emit('input', file[0])
      }
    },
    async getCashier(){
      await db.collection(this.shopInfo.city).doc(this.shopInfo.id).collection('account').get().then(snapshot => {
        this.cashiers = [];
        snapshot.forEach(doc=>{
          this.cashiers.push(doc.data())
        })
      })
    },
    async addCashier(){
      if(this.cashier.email !=='' && this.cashierPassword!==''){
        this.loadingActive = true;
        const firebaseAuth = await firebase.auth();
        await firebaseAuth.createUserWithEmailAndPassword(this.cashier.email, this.cashierPassword).then((result)=> {
          const accountRef = db.collection(this.shopInfo.city).doc(this.shopInfo.id).collection('account').doc(result.user.uid);
          accountRef.set({
            'id':accountRef.id,
           ...this.cashier
          }).then(()=>{
            let shopRegRef = db.collection('shopRegistration').doc(this.$route.params.shop_id);
            shopRegRef.get().then(snapshot=>{
              let emailList = snapshot.data().emailList;
              emailList.push(this.cashier.email);
              shopRegRef.update({
                'emailList':emailList
              }).then(()=>{
                this.loadingActive = false;
                this.infoModalActive = true;
                this.modalMessage='Cashier Registration success'
                this.cashier.accountName = "";
                this.cashier.email ="";
                this.cashier.phone ="";
                this.cashierPassword ="";
                this.cashier.counter ="";
                this.cashier.accountCode="";
                console.log('cashier added')
              })
            })
          })
        }).catch(error=>{
          this.loadingActive=false;
          console.log(error.message)
        })
      }
    },
    async updateBranch(){
      this.loadingActive = true;
      if(this.selectedBranch!=='' && this.branchCity!==''){
        console.log('selected',this.selectedBranch.id);
        console.log('current',this.shopInfo);
        if(this.shopInfo.branchCity === undefined && this.shopInfo.listBranch===undefined){
          console.log('yes');
          db.collection(this.shopInfo.city).doc(this.shopInfo.id).update({
            'listBranch':[this.selectedBranch.id],
            'branchCity':[this.selectedBranch.city],
          }).then(()=>{
            console.log('update ok');
            this.updateBranchToSelected();
            // this.branchCity ='';
            // this.selectedBranch='';
          }).catch(err=>{
            console.log(err.message);
          })
        }else {
          console.log('no');
          if(!this.shopInfo.listBranch.includes(this.selectedBranch.id)){
            this.shopInfo.branchCity.push(this.selectedBranch.city);
            this.shopInfo.listBranch.push(this.selectedBranch.id);
            console.log(this.shopInfo)
            await db.collection(this.shopInfo.city).doc(this.shopInfo.id).update({
              'listBranch':this.shopInfo.listBranch,
              'branchCity':this.shopInfo.branchCity
            }).then(()=>{
              this.updateBranchToSelected();
              this.branchCity ='';
              this.selectedBranch='';
              console.log('update ok')
            }).catch(err=>{
              console.log(err.message)
            })
          }else {
            this.loadingActive = false;
            this.modalMessage = "The branch already existed"
            this.infoModalActive = true;
          }

        }

      }

    },

    async updateBranchToSelected(){
      if(this.selectedBranch.branchCity === undefined && this.selectedBranch.listBranch===undefined){
        console.log('yes')
        db.collection(this.selectedBranch.city).doc(this.selectedBranch.id).update({
          'listBranch':[this.shopInfo.id],
          'branchCity':[this.shopInfo.city],
        }).then(()=>{
          this.loadingActive = false;
          this.branchCity ='';
          this.selectedBranch='';
          console.log('update ok')
        })
      }else {
        console.log('no')
        if(!this.selectedBranch.listBranch.includes(this.shopInfo.id)){

          this.selectedBranch.branchCity.push(this.shopInfo.city);
          this.selectedBranch.listBranch.push(this.shopInfo.id);
          console.log(this.selectedBranch)
          await db.collection(this.selectedBranch.city).doc(this.selectedBranch.id).update({
            'listBranch':this.selectedBranch.listBranch,
            'branchCity':this.selectedBranch.branchCity
          }).then(()=>{
            this.loadingActive = false;
            this.branchCity ='';
            this.selectedBranch='';
            console.log('update ok')
          })
        }else {
          this.loadingActive = false;
          this.infoModalActive = true;
          this.modalMessage = "The branch already existed"
        }

      }
    },

    clearBranch(){
      this.branchLists = [];
      this.selectedBranch ='';
    },

    async branchInputToggle(){
      this.showBranch = !this.showBranch;
      await db.collection(this.branchCity).onSnapshot((snapshot)=>{
        this.branchLists = [];
        snapshot.forEach(doc=>{
          this.branchLists.push(doc.data());
        })
      })
    },

    selectBranch(branch){
      this.selectedBranch = branch;
      this.showBranch = !this.showBranch;

    },

    confirm(){
      this.loadingActive = true;
      this.confirmActive = !this.confirmActive;
    },
    cancel(){
      this.confirmActive = !this.confirmActive;
    },
    closeModal(){
      this.infoModalActive = !this.infoModalActive;
    },
    checkType(e){
      if(e.target.checked && this.currentShop){
        this.$nextTick(()=>{
          this.currentShop.shopType.push(e.target.value)
          console.log('shop type',this.currentShop.shopType)
        })
      }else {
        this.currentShop.shopType = this.currentShop.shopType.filter((type)=>{return type!== e.target.value})
      }
    },
    onChangePhotoInput(e) {
      this.file = e.target.files[0];
    },
    async saveUpdates(){
      console.log(this.currentShop)
      this.loadingActive = true;
      if(this.file) {
        const storageRef = await firebase.storage().ref();
        const imgRef = storageRef.child(`/${this.currentShop.city}/${this.currentShop.shopId}/profile/${this.currentShop.shopId}`)
        console.log(imgRef)
        imgRef.put(this.file).on("state_changed", () => {
        }, error => {
          console.log(error);
        }, async () => {
          const img_src = await imgRef.getDownloadURL();
          this.currentShop.profileUrl = img_src;
        })
      }
      db.collection('shopRegistration').doc(this.$route.params.shop_id).update({
        "name":this.currentShop.name,
        "email":this.currentShop.email,
        "address":this.currentShop.address,
        "phone":this.currentShop.phone,
        "shopCode":this.currentShop.shopCode,
        "profileUrl":this.currentShop.profileUrl,
        "shopType":this.currentShop.shopType,
        "promotionDisplayType":this.currentShop.promotionDisplayType,
        "onlineSell":this.currentShop.onlineSell,
        "branch":this.currentShop.branch,
        "city":this.currentShop.city,
      }).then(()=>{
        db.collection(this.currentShop.city).doc(this.shopInfo.id).update({
          "name":this.currentShop.name,
          "email":this.currentShop.email,
          "address":this.currentShop.address,
          "phone":this.currentShop.phone,
          "shopCode":this.currentShop.shopCode,
          "profileUrl":this.currentShop.profileUrl,
          "shopType":this.currentShop.shopType,
          "promotionDisplayType":this.currentShop.promotionDisplayType,
          "onlineSell":this.currentShop.onlineSell,
          "branch":this.currentShop.branch,
          "city":this.currentShop.city,
        }).then(()=>{
          this.loadingActive  = false;
          this.infoModalActive = true;
          this.modalMessage = "Info Updated!"
        })

      }).catch(err=>{
        console.log(err.message)
      })

    }
  }
}
</script>

<style scoped>
.form-select{
  background-color: var(--light) !important;
}
.card{
  background-color: var(--side-bar-bg) !important;
}
.to-pop-up{
  z-index: 3000;
  background-color: var(--side-bar-bg);
  border: 2px solid white;
  position: absolute;
  overflow-y: scroll;
  height: 300px;
  width: 250px;
  border-radius: var(--border-radius) !important;
  padding-bottom: 50px;
  top: 100px;
}
.imagePreviewWrapper {
  width: 200px;
  height: 200px;
  display: block;
  cursor: pointer;
  background-size: cover;
  background-position: center center;
}
li{
  cursor: pointer;
  background-color: var(--light);
}
li:hover{
  background-color: var(--softPrimary) !important;
}
.form-scroller{
  overflow: scroll;
  height: 85vh !important;
}
.row{
  border-radius: var(--border-radius);
  margin: 5px;
}
@media only screen and (max-width: 1030px) {

  .to-pop-up {
    top: 220px;
    width: 98%;
    right: 5px;
  }
  .form-scroller{
    height: inherit !important;
    overflow: hidden;
  }
}
</style>
