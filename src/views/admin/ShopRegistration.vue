<template>
  <AdminNavigation>
    <Loading v-if="loadingActive"/>
    <InfoDialog v-if="infoModalActive" :modal-message="modalMessage" v-on:close-modal="closeModal"/>
    <ConfirmDialog :modal-message="modalMessage" v-if="confirmActive" v-on:confirm="confirm" v-on:cancel="cancel"/>
    <div class="container">
      <div class="row mt-5 pt-5">
        <div class="col-12 col-lg-6 mx-auto">
          <div class="d-flex align-items-center">
            <button class="btn btn--white" @click="$router.back()"><i class="fas fa-chevron-left"></i>             <span class="fs-5">Shop Registration Panel</span>
            </button>
          </div>
          <form @submit.prevent="shopRegister">
            <p class="fw-bold my-2 mx-2">Shop ID: {{shopReg.name.replace(/ /g, "").toLowerCase()+shopReg.shopCode.toLowerCase()+todayDate}}</p>
            <div class="row">
              <div class="col-12 mb-2">
                <input type="file" @change="onChangePhotoInput" accept="image/*" id="img-input" class="form-control d-inline">
              </div>
              <div class="col-12 col-lg-6">
                <div class="form-floating mb-3">
                  <input type="text" required class="form-control" v-model="shopReg.name" id="name-input" placeholder="enter shop name">
                  <label for="name-input">Shop Name</label>
                </div>
              </div>
              <div class="col-12 col-lg-6">
                <div class="form-floating mb-3">
                  <input type="text" required class="form-control" v-model="shopReg.shopCode" id="shop-code-input" placeholder="enter shop code">
                  <label for="shop-code-input">Shop Code</label>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12 col-lg-6">
                <div class="form-floating mb-3">
                  <input type="email" required class="form-control" v-model="email" id="shop-email-input" placeholder="enter shop email">
                  <label for="shop-email-input">Shop Email</label>
                </div>
              </div>
              <div class="col-12 col-lg-6">
                <div class="form-floating mb-3">
                  <input type="text" required class="form-control" v-model="password" id="password-input" placeholder="password">
                  <label for="password-input">Shop Password</label>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12 col-lg-6 mb-3">
                <select required class="form-select fs-6 form-control form-select-lg bg-transparent rounded" style="height: 60px"  v-model="shopReg.city" aria-label=".form-select-lg example">
                  <!--                <option value="Choose City" selected disabled>Choose City </option>-->
                  <option value="Taungyi">Taungyi</option>
                </select>
              </div>
              <div class="col-12 col-lg-6">
                <div class="form-floating mb-3">
                  <input type="text" required class="form-control" v-model="shopReg.phone" id="phone-input" placeholder="enter shop phone">
                  <label for="phone-input">Shop Phone number</label>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-12 col-lg-6 mb-3">
                <label class="form-label">Online Sell ?</label>
                <select required class="form-select fs-6 form-control form-select-lg bg-transparent rounded" style="height: 60px"  v-model="shopReg.onlineSell" aria-label=".form-select-sm example">
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="free">Free</option>
                </select>
              </div>
              <div class="col-12 col-lg-6 mb-3">
                <label class="form-label">Package</label>
                <select required class="form-select fs-6 form-control form-select-lg bg-transparent rounded" style="height: 60px"  v-model="shopReg.packageStatus" aria-label=".form-select-sm example">
                  <option value="basic">Basic</option>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="ultra">Ultra</option>
                </select>
              </div>

            </div>
            <div class="row mb-1">
              <div class="col-12">
                <label class="form-label">Shop Types</label>
                <div class="mb-1">
                  <span class="badge rounded-pill bg-secondary text-light me-1" v-for="(type,index) in shopReg.shopType" :key="index">{{type}}</span>
                </div>
              </div>
              <div class="col-12">
                <div class="form-check" v-for="type in shopTypes" :key="type.id">
                  <input class="form-check-input" type="checkbox" @change="checkType($event)" :value="type.name" :id="type.id">
                  <label class="form-check-label" :for="type.id">
                    {{type.name}}
                  </label>
                </div>
              </div>

            </div>

            <div class="row">

              <div class="col-12 col-lg-6 mb-3">
                <div class="form-floating mb-3">
                  <input type="text" required class="form-control" v-model="shopReg.enableAdminPassword" id="enable-admin-input" placeholder="enter shop email">
                  <label for="online-input">Enable admin? (yes/no)</label>
                </div>
              </div>
              <div class="col-12 col-lg-6">
                <div class="form-floating mb-3">
                  <input type="text" required class="form-control" v-model="shopReg.adminPassword" id="admin-password-input" placeholder="enter shop phone">
                  <label for="phone-input">Admin Password</label>
                </div>
              </div>
            </div>

            <div class="row">

              <div class="col-12 col-lg-6 mb-3">
                <label class="form-label">Shop Role</label>
                <select required class="form-select fs-6 form-control form-select-lg bg-transparent rounded" style="height: 60px"  v-model="shopReg.branch" aria-label=".form-select-lg example">
                  <option value="main">main</option>
                  <option value="branch">branch</option>
                </select>
              </div>

              <div class="col-12 col-lg-6 mb-3">
                <label class="form-label">Promotion Type</label>
                <select required class="form-select fs-6 form-control form-select-lg bg-transparent rounded" style="height: 60px"  v-model="shopReg.promotionDisplayType" aria-label=".form-select-sm example">
                  <option value="default">Default</option>
                  <option :value="type.name" v-for="type in promoTypes" :key="type.id">{{ type.name }}</option>
                </select>
              </div>

              <div class="col-12">
                <div class="form-floating mb-3">
                  <input type="text" required class="form-control" v-model="shopReg.address" id="shop-address-input" placeholder="enter shop address">
                  <label for="shop-address-input">Shop Address</label>
                </div>
              </div>
            </div>
            <button type="submit" class="btn mx-auto w-50 btn-dark">Register</button>
          </form>
        </div>

      </div>

    </div>

  </AdminNavigation>
</template>

<script>
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import db,{timestamp} from "@/config/FirebaseInit";
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
      shopTypes:[],
      promoTypes:[],
      password:'',
      email:'',
      shopReg:{
        shopId:"",
        shopCode:"",
        name:"",
        email:"",
        emailList:[],
        phone:"",
        tax:"0",
        city:"Taungyi",
        shopType:[],
        promotionDisplayType:"default",
        address:"",
        profileUrl:"default",
        onlineSell:'no',
        branch:'main',
        adminPassword:'',
        lowStock:'',
        expireAlert:'',
        enableAdminPassword:'yes',
        deliveryServices:[],
        packageStatus:'basic'
      }
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
    }
  },
  async mounted() {
    await db.collection('shopTypes').get().then((result)=>{
      this.shopTypes=[];
      result.forEach(doc=>{
        this.shopTypes.push(doc.data());
      })
    })
    await db.collection('displayPromotionType').get().then((result)=>{
      this.promoTypes=[];
      result.forEach(doc=>{
        this.promoTypes.push(doc.data())
      })
    })
  },
  methods:{
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
      if(e.target.checked){
        this.$nextTick(()=>{
          this.shopReg.shopType.push(e.target.value)
        })
      }else {
        this.shopReg.shopType = this.shopReg.shopType.filter((type)=>{return type!== e.target.value})
      }
    },
    onChangePhotoInput(e) {
      this.file = e.target.files[0];
    },
    async shopRegister(){
      if(this.email!=='' && this.shopReg.city!=='' && this.password!=='' && this.file!==null && this.shopReg.shopCode!=='' && this.shopReg.name!=='' &&  this.shopReg.shopType.length>0){
        this.loadingActive = true;
        const firebaseAuth = await firebase.auth();
        const storageRef = await firebase.storage().ref();
        this.shopReg.shopId = this.shopReg.name.replace(/ /g, "").toLowerCase()+this.shopReg.shopCode.toLowerCase()+this.todayDate;
        this.shopReg.emailList.push(this.email);
        await firebaseAuth.createUserWithEmailAndPassword(this.email, this.password).then(async (result)=> {
          const imgRef = storageRef.child(`/${this.shopReg.city}/${this.shopReg.shopId}/profile/${this.shopReg.shopId}`)
          imgRef.put(this.file).on("state_changed", () => {
          },error => {
            console.log(error);
          },async ()=> {
            const img_src = await imgRef.getDownloadURL();
            this.shopReg.profileUrl = img_src;
            const dataBase = db.collection('shopRegistration').doc(result.user.uid);
            await dataBase.set(
                {
                  "id": result.user.uid,
                  "createdAt": timestamp,
                  ...this.shopReg
                });
            await db.collection(this.shopReg.city).doc(this.shopReg.shopId).set({
              "name": this.shopReg.name,
              "id": this.shopReg.shopId,
              "email": this.email,
              "address": this.shopReg.address,
              "phone": this.shopReg.phone,
              "shopCode": this.shopReg.shopCode,
              "profileUrl": this.shopReg.profileUrl,
              "shopType": this.shopReg.shopType,
              "promotionDisplayType": this.shopReg.promotionDisplayType,
              "onlineSell": this.shopReg.onlineSell,
              "branch": this.shopReg.branch,
              "city": this.shopReg.city,
              "tax": "0",
              "lowStock": "10",
              "adminPassword": this.shopReg.adminPassword,
              "deliveryServices": [],
              "expireAlert": '30',
              "packageStatus": this.shopReg.packageStatus
            });

            const categoryRef = db.collection(this.shopReg.city).doc(this.shopReg.shopId).collection('category').doc();
            await categoryRef.set({
              createdAt: timestamp,
              name: "All",
              id: categoryRef.id,
              url: "default",
            });

            const brandRef = db.collection(this.shopReg.city).doc(this.shopReg.shopId).collection('brand').doc();
            await brandRef.set({
              createdAt: timestamp,
              name: "None",
              id: brandRef.id,
            });

            const sizeRef = db.collection(this.shopReg.city).doc(this.shopReg.shopId).collection('size').doc();
            await sizeRef.set({
              createdAt: timestamp,
              name: "Free",
              id: sizeRef.id,
            });

            const colorRef = db.collection(this.shopReg.city).doc(this.shopReg.shopId).collection('color').doc();
            await colorRef.set({
              createdAt: timestamp,
              name: "All",
              id: colorRef.id,
            });

            const accountRef = db.collection(this.shopReg.city).doc(this.shopReg.shopId).collection('account').doc(result.user.uid);
            await accountRef.set({
              'id': result.user.uid,
              'FCM': '',
              'loginStatus': 'no',
              'deviceId': '',
              'email': this.email,
              'accountName': this.shopReg.name,
              'phone': '',
              'editStatus': 'yes',
              'accountLevel': 'admin',
              'accountCode': 'AD',
              'notiStatus': 'on'
            })

            const paymentRef = db.collection(this.shopReg.city).doc(this.shopReg.shopId).collection('paymentMethods').doc();
            await paymentRef.set(
                {
                  accountName: this.shopReg.name,
                  accountNumber: '',
                  createdAt: timestamp,
                  id: paymentRef.id,
                  paymentType: 'Cash',
                  url: ''
                }
            );

            this.loadingActive = false;
            this.infoModalActive = true;
            this.modalMessage = "Shop Registration success!";
            console.log('register ok');
          })
          })



      }else {
        this.loadingActive = false;
        this.infoModalActive = true;
        this.modalMessage = "Pleas fill completely!"
      }

     }
  }
}
</script>

<style scoped>

</style>