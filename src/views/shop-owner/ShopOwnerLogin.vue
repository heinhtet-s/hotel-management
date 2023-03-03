<template>
  <div class="bg-owner">
    <Loading v-show="loadingActive"/>
    <InfoDialog v-if="modalActive" :modal-message="modalMessage" v-on:close-modal="closeInfoModal"/>
    <!--    <InfoModal v-if="modalActive" :modal-message="modalMessage" v-on:close-modal="closeModal"/>-->
    <div class="container-fluid">
      <div class="row min-vh-100">
        <div class="col-12 col-lg-5 mx-auto d-flex align-items-center justify-content-center">
          <div class="card">
            <div class="card-body">
              <div class="d-flex my-3 align-items-center">
                <img src="../../assets/360-degree.png" style="background-color: var(--primary);border-radius: var(--border-radius);padding: 3px;" width="80" height="80" alt="">
                <div class="d-flex flex-column ms-2 text-start">
                  <span class="fs-1 fw-bold">360 Degree Bar</span>
                  <span class="ms-1">Restaurant Management System</span>
                </div>
              </div>
              <form @submit.prevent="signIn" class="mt-5">
                <div class="col-12 ">
                  <div class="form-floating mb-3">
                    <input type="text" id="owner-email-login" v-model="form.email" class="form-control" required placeholder="Enter Ms Code">
                    <label for="owner-email-login" class="text-black-50">Enter Email</label>
                  </div>
                </div>
                <div class="col-12 ">
                  <div class="form-floating mb-3">
                    <input type="password" id="password" v-model="form.password" class="form-control" required placeholder="Enter Ms Code">
                    <label for="password" class="text-black-50">Password</label>
                  </div>
                </div>
                <div class="w-100 d-flex justify-content-center">
                  <button type="submit" class="mt-3 w-50 btn text-white mx-auto" style="background-color: var(--primary);" >Sign in</button>
                </div>
              </form>
            </div>
          </div>

        </div>
        <div class="col-12 col-lg-7" style="background-color: var(--primary);">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import Loading from "@/components/Loading";
import db from "@/config/FirebaseInit";
import InfoDialog from "@/components/InfoDialog";
export default {
  name:'Shop Owner Login',
  components: {InfoDialog, Loading},
  data(){
    return{
      form:{
        email:"",
        password:"",
      },
      deviceId:'',
      loadingActive:false,
      modalActive:false,
      modalMessage:"",
      error:null,
      errorMsg:"",
    }
  },
  computed:{
    owner(){
      return this.$store.getters.getShopOwner;
    },
    fcmToken(){
      return this.$store.getters.getFCM;
    }
  },
  created() {
    this.deviceId = navigator.userAgent;
  },
  methods:{
    closeInfoModal(){
      this.modalActive = !this.modalActive;
    },
    async signIn(){
      this.loadingActive = true;
      if(this.form.email !== "" && this.form.password !==""){

        await firebase.auth().signInWithEmailAndPassword(this.form.email, this.form.password)
            .then(async (userCredential)=>{
              const user = userCredential.user;
              await db.collection('shopRegistration').where('emailList','array-contains',user.email).get().then((snapshot)=>{
                let userList = [];
                snapshot.forEach(doc=>{
                  userList.push(doc.data());
                })
                let accRef =db.collection(userList[0].city).doc(userList[0].shopId).collection('account').doc(user.uid);
                accRef.update({
                  'loginStatus':'yes',
                  'deviceId':this.deviceId,
                  'FCM':this.fcmToken,
                }).then(()=>{
                  accRef.get().then(snapshot=>{
                    console.log('cashier acc after update',snapshot.data());
                    this.$store.commit('SET_CASHIER_ACC',snapshot.data());
                    this.$store.dispatch('getCurrentShop');
                    this.loadingActive = false;
                    this.modalMessage = 'Login Success!';
                    this.modalActive = true;
                    localStorage.setItem('selectedProductSearchType','barcode');
                    localStorage.setItem('showLogoImage', false);
                    localStorage.setItem('showCustomerPhone', false);
                    localStorage.setItem('showCustomerName', false);
                    localStorage.setItem('voucherStyle', 'listStyle');
                    localStorage.setItem('gridView', 'false');
                    localStorage.setItem('selectedSelection',1)
                    this.$router.push({name:"ShopHome"});
                  });
                });
                /*accRef.get().then(accSnapshot=>{

                  if(accSnapshot.data().deviceId ===''){

                  }else {
                    //if the user did not login and the device id is same
                    if(accSnapshot.data().deviceId === this.deviceId){
                      accRef.update({
                        'FCM':this.fcmToken,
                        'loginStatus':'yes'
                      }).then(()=>{
                        accRef.get().then(snapshot=> {
                          console.log('cashier acc after update', snapshot.data());
                          this.$store.commit('SET_CASHIER_ACC', snapshot.data());
                          this.loadingActive = false;
                          this.$store.dispatch('getCurrentShop');
                          //this.$router.push({name:"ShopHome"});
                          this.modalMessage = 'Login Success!';
                          this.modalActive = true;
                          this.$router.push({name:"ShopHome"})
                        })
                      })
                    }else{
                      firebase.auth().signOut().then(()=>{
                        sessionStorage.clear();
                        window.localStorage.removeItem('vuex');
                        this.$store.state.owner='';
                        console.log('login session cleared')
                      }).then(()=>{
                        this.loadingActive = false;
                        this.modalMessage = "Sorry you already logged in other device.";
                        this.modalActive = true;
                      })
                    }
                  }
                })*/

              });
            }).catch((error)=>{
              this.loadingActive = false;
              this.modalActive = true;
              this.form.password = "";
              this.error= true;
              if (error.code === 'auth/email-already-in-use') {
                this.errorMsg = 'Mail already in used!';
              }
              else if(error.code === 'auth/user-not-found'){
                this.errorMsg = "You haven't register with this mail."
              }else if(error.code === 'auth/network-request-failed'){
                this.errorMsg = "No Internet connection"
              }else if(error.code === 'auth/wrong-password'){
                this.errorMsg = "Password is not matched!"
              } else{
                this.errorMsg = error.message;
              }
              this.modalMessage = this.errorMsg;
              setTimeout(()=>{
                this.error = false;
              }, 5000);
              return;
            });
        // return;
      }else {
        this.loadingActive = false;
        this.error = true;
        this.errorMsg ="Please fill email and password!";
        setTimeout(()=>{
          this.error = false;
        }, 3000);
        return;
      }
    },
    closeModal(){
      this.modalActive = !this.modalActive;
    },
  }
}
</script>

<style scoped>

</style>