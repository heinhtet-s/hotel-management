<template>
  <div class="bg-owner">
    <Loading v-show="loadingActive"/>
    <!--    <InfoModal v-if="modalActive" :modal-message="modalMessage" v-on:close-modal="closeModal"/>-->
    <div class="container-fluid pt-5 overlay">
      <div class="row mt-5 min-vh-100">
        <div class="col-12 col-md-6 col-lg-6 mx-auto">
          <div class="" style="background-color: var(--light); border-radius: var(--border-radius);">
            <div class="card-body p-5">
              <div class="text-center">
                <div><i class="fa fa-user-lock text-dark fa-3x"></i><span class="fs-3">Admin Login</span></div>

                <!--<button class="btn btn-outline-dark" @click="googleSignIn"><i class="fa fa-circle"></i> Sign in with google</button>-->
                <p class="alert alert-warning" v-if="error" >
                  {{this.errorMsg}}
                </p>
              </div>
              <form class="row">
                <div class="col-12 ">

                  <div class="form-floating mb-3">
                    <input type="text" id="email" v-model="form.email" class="form-control" required placeholder="Enter Ms Code">
                    <label for="email">Admin Email</label>
                  </div>

                </div>
                <div class="col-12 ">

                  <div class="form-floating mb-3">
                    <input type="password" id="password" v-model="form.password" class="form-control" required placeholder="Enter Ms Code">
                    <label for="password">Password</label>
                  </div>
                </div>
                <button class="mt-3 w-50 btn btn-dark text-white mx-auto" @click.prevent="signIn">Sign in</button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import Loading from "../../components/Loading";
import db from "../../config/FirebaseInit";
// import InfoModal from "@/components/InfoModal";
export default {
  name:'AdminLogin',
  components: {Loading},
  data(){
    return{
      form:{
        email:"",
        password:"",
      },
      loadingActive:false,
      modalActive:false,
      modalMessage:"",
      error:null,
      errorMsg:"",
    }
  },
  computed:{
    user(){
      return this.$store.getters.getCurrentUser;
    },
    owner(){
      return this.$store.getters.getShopOwner;
    }
  },
  methods:{
    async signIn(){
      this.loadingActive = true;
      if(this.form.email !== "" && this.form.password !==""){
        if(this.user!=='' || this.owner!==''){
          firebase.auth().signOut().then(()=>{
            sessionStorage.clear();
            window.localStorage.removeItem('vuex');
            this.$store.state.shopOwner = '';
            console.log('login session cleared')
          })
        }
        await firebase.auth().signInWithEmailAndPassword(this.form.email, this.form.password)
            .then(async (userCredential)=>{
              const user = userCredential.user;
              await db.collection('admin').doc(user.uid).get().then((result)=>{
                if(result.exists){
                  this.$store.dispatch('getAdmin');
                  this.$router.push({name:"AdminHome"});
                }else {
                  this.loadingActive = false;
                  alert("User unmatched!")
                }
              })
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
              }else {
                this.errorMsg = error.message;
              }
              setTimeout(()=>{
                  this.error = false;
              }, 3000);
              return;
            });
        return;
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
.bg-owner{
  background-color: var(--primary);
  background-image: url("../../assets/flash-shop.svg");
  object-fit: cover;
  min-height: 100vh;
  box-sizing: border-box;
  background-repeat: no-repeat;
  background-size: cover;
}
.overlay{
  background-color: rgba(75, 67, 201, 0.83);
  backdrop-filter: blur(3px);
}
input, button, .card{
  border-radius: 20px !important;
}
</style>