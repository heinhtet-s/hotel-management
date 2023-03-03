<template>
  <Loading v-if="loadingActive"/>
  <InfoDialog v-if="infoModalActive" :modal-message="modalMessage" v-on:close-modal="closeModal"/>
  <ConfirmDialog :modal-message="modalMessage" v-if="confirmActive" v-on:confirm="confirm" v-on:cancel="cancel"/>
  <AdminNavigation />
  <div class="container pt-5">
    <div class="row pt-5">
      <div class="col-12 col-lg-6 col-md-6 mx-auto">
        <h2>Delivery Registration</h2>
        <form @submit.prevent="register">
          <div class="row">
            <div class="col-12 col-lg-6 mb-2">
              <input type="file" required @change="onChangePhotoInput" accept="image/*" id="img-input" class="form-control d-inline">
            </div>
            <div class="col-12 col-lg-6">
              <div class="form-floating mb-3">
                <input type="text" required class="form-control" v-model="deliveryInfo.name" id="name-input" placeholder="enter delivery name">
                <label for="name-input">Name</label>
              </div>
            </div>
            <div class="col-12 col-lg-6">
              <div class="form-floating mb-3">
                <input type="text" required class="form-control" v-model="deliveryInfo.phone" id="shop-code-input" placeholder="enter phone">
                <label for="shop-code-input">Phone</label>
              </div>
            </div>
            <div class="col-12 col-lg-6">
              <div class="form-floating mb-3">
                <input type="text" required class="form-control" v-model="deliveryInfo.email" id="shop-code-input" placeholder="enter email">
                <label for="shop-code-input">Email</label>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12 col-lg-6">
              <div class="form-floating mb-3">
                <input type="text" required class="form-control" v-model="deliveryInfo.address" id="name-input" placeholder="enter delivery address">
                <label for="name-input">Address</label>
              </div>
            </div>
            <div class="col-12 col-lg-6">
              <div class="form-floating mb-3">
                <input type="text" required class="form-control" v-model="deliveryInfo.feeRange" id="shop-code-input" placeholder="enter fee range">
                <label for="shop-code-input">Fee Range</label>
              </div>
            </div>
            <div class="col-12 col-lg-6">
              <div class="form-floating mb-3">
                <input type="text" required class="form-control" v-model="deliveryInfo.externalFeeRange" id="shop-code-input" placeholder="enter fee range">
                <label for="shop-code-input">External Fee Range</label>
              </div>
            </div>

          </div>
          <div class="row mb-1">

            <div class="col-12 col-lg-6">
              <label class="form-label">Available Cities</label>
              <div class="mb-1">
                <span class="badge rounded-pill bg-secondary text-light me-1" v-for="(city,index) in deliveryInfo.availableCities" :key="index">{{city}}</span>
              </div>
            </div>

            <div class="col-12">
              <div class="form-check" v-for="(city,index) in cities" :key="index">
                <input class="form-check-input" type="checkbox" @change="checkCities($event)" :value="city.name" :id="index">
                <label class="form-check-label" :for="index">
                  {{city.name}}
                </label>
              </div>
            </div>
            <div class="col-12 col-lg-6">
            </div>
            <div class="form-floating my-3">
              <input type="text" required class="form-control" v-model="deliveryInfo.description" id="shop-code-input" placeholder="enter fee range">
              <label for="shop-code-input">Description</label>
            </div>
            <div class="col-12 align-items-center justify-content-center text-center">
              <button type="submit" class="btn btn-dark w-50">Register</button>
            </div>

            </div>

        </form>
      </div>
      <div class="col-12 col-lg-6 col-md-6">
        <div style="height: 600px; overflow: scroll;">
          <div class="card shadow-none m-1" style="background-color: var(--side-bar-bg) !important; border-radius: var(--border-radius) !important;" v-for="(deli, index) in deliverServices" :key="index">
            <div class="p-2">
              <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center justify-content-between">
                  <img :src="deli.photo" class="rounded-circle shadow-sm" width="60" height="60" alt="">
                  <span>{{deli.name}}</span>
                </div>
              </div>
              <div class="d-flex w-75 flex-column mx-2">
                <span><i class="fas fa-phone"></i>{{deli.phone}}</span>
                <span><i class="fas fa-envelope"></i>{{deli.email}}</span>
                <span>Address: {{deli.address}}</span>
                <span>
                    Available:
                    <span class="badge rounded-pill" style="background-color: var(--light);color: var(--text-color);" v-for="(name,index) in deli.availableCities" :key="index">{{name}} </span>
                  </span>
                <div class="d-flex justify-content-between">
                  <div class="d-flex flex-column">
                    <span class="text-success">In City</span>
                    <span>{{deli.feeRange}}</span>
                  </div>
                  <div class="d-flex flex-column ">
                    <span class="text-success">Other City</span>
                    <span>{{deli.externalFeeRange}}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  </div>
</template>

<script>
import Loading from "@/components/Loading";
import InfoDialog from "@/components/InfoDialog";
import ConfirmDialog from "@/components/ConfirmDialog";
import firebase from "firebase/compat/app";
import db, {timestamp} from "../../config/FirebaseInit";
import AdminNavigation from "@/components/AdminNavigation";
export default {
  components: {ConfirmDialog, InfoDialog, Loading, AdminNavigation},
  data(){
    return{
      loadingActive:false,
      modalMessage:'',
      infoModalActive:'',
      confirmActive:false,

      file:'',
      cities:[],
      deliverServices:[],
      deliveryInfo:{
        id:'',
        name:'',
        email:'',
        phone:'',
        availableCities:[],
        address:'',
        photo:'',
        description:'',
        feeRange:'',
        externalFeeRange:'',
        createdAt:'',
      }
    }
  },
  async mounted() {
    await db.collection('city').onSnapshot(snapshot => {
      snapshot.forEach(doc=>{
        this.cities.push(doc.data())
      })
    })
    await this.getDeliveryLists();
  },
  methods:{
    async getDeliveryLists(){
      await db.collection('deliveryServices').onSnapshot(snapshot => {
        snapshot.forEach(doc=>{
          this.deliverServices.push(doc.data());
        })
      })
    },
    checkCities(e){
      if(e.target.checked){
        this.$nextTick(()=>{
          this.deliveryInfo.availableCities.push(e.target.value)
        })
      }else {
        this.deliveryInfo.availableCities = this.deliveryInfo.availableCities.filter((city)=>{return city!== e.target.value})
      }
    },
    onChangePhotoInput(e) {
      this.file = e.target.files[0];
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
    async register(){
      if(this.deliveryInfo.name!=='' && this.deliveryInfo.email!=='' && this.deliveryInfo.phone!=='' && this.file!==null && this.deliveryInfo.description!=='' && this.deliveryInfo.feeRange!==''){
        this.loadingActive = true;
        const deliveryRef = db.collection('deliveryServices').doc();
        this.deliveryInfo.id = deliveryRef.id;
        this.deliveryInfo.createdAt = timestamp;
        console.log(this.deliveryInfo);
        const storageRef = await firebase.storage().ref();
        const imgRef = storageRef.child(`/delivery/${deliveryRef.id}/profile/`)
        imgRef.put(this.file).on("state_changed", () => {
        },error => {
          console.log(error);
          this.loadingActive = false;
        },async ()=> {
          const img_src = await imgRef.getDownloadURL();
          this.deliveryInfo.photo = img_src;

          db.collection('deliveryServices').doc(deliveryRef.id).set(this.deliveryInfo).then(()=>{
            this.loadingActive = false;
            this.infoModalActive = true;
            this.modalMessage = "Registered Successfully!"
          }).catch(err=>{
            this.loadingActive = false;
            console.log(err.message);
          })
        })
      }else {
        this.loadingActive = false;
        this.infoModalActive = true;
        this.modalMessage = "Please fill all "
      }


    }
  }

}
</script>

<style scoped>

</style>