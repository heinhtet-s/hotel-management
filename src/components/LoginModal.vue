<template>
  <div class="modal">
    <div class="container">
      <div class="row overlay mx-auto">
        <div class="col-12 col-lg-5 col-xl-5 col-md-6 mx-auto border border-1 rounded bg-white">
          <div class="card border-0 shadow-none">
            <div class="p-2 d-flex justify-content-end align-items-center">
              <button @click.prevent="closeModal" class="btn btn-sm btn-outline-dark" style="width: 30px;height: 30px;border-radius: 50%;"><i class="fas fa-close"></i></button>
            </div>
            <div class="card-body text-center">
              <h4>{{ $t('message.hello') }}</h4>
              <h5>{{ $t('message.wct_flash') }}</h5>

              <div v-if="showPhoneAuth">
                <PhoneAuthModal v-if="showPhoneAuth" />
              </div>

              <div v-else>

                <p v-show="error" class="alert alert-warning my-2" role="alert">
                  {{errorMsg}}
                </p>
                <form>
                  <div class="form-floating mb-3" v-show="registerModalActive">
                    <input type="text" required class="form-control" v-model="name" id="name-input" placeholder="user name">
                    <label for="name-input">{{ $t('message.name') }}</label>
                  </div>
                  <div class="form-floating mb-3">
                    <input type="email" required class="form-control" v-model="email" id="email-input" placeholder="email">
                    <label for="email-input">{{ $t('message.email') }}</label>
                  </div>
                  <div class="form-floating mb-3">
                    <input type="email" required class="form-control" v-show="registerModalActive" v-model="phone" id="email-input" placeholder="phone" >
                    <label for="email-input">{{ $t('message.phone') }}</label>
                  </div>
                  <div class="form-floating mb-3">
                    <input type="email" required class="form-control" v-show="registerModalActive" v-model="address" id="email-input" placeholder="address">
                    <label for="email-input">{{$t('message.address')}}</label>
                  </div>
                  <div class="form-floating">
                    <input type="password" required class="form-control" v-model="password" id="password-input" placeholder="password">
                    <label for="password-input">{{$t('message.password')}}</label>
                  </div>
                  <div class="d-flex justify-content-end">
                    <router-link :to="{name:'ForgotPassword'}" class="nav-link" style="font-size: 11px;" v-show="loginModalActive">Forgot password?</router-link>
                  </div>

                  <button class="btn w-50 mt-2" @click.prevent="signIn" style="background-color: var(--btnLight)" v-if="loginModalActive">
                    <span class="mx-auto">{{ $t('message.signin') }}</span>
                    <div class="spinner-border spinner-border-sm mx-auto d-inline-block" v-if="spinnerActive"></div>

                  </button>
                  <button class="btn w-50 mt-2 " @click.prevent="register" style="background-color: var(--btnLight)"  v-if="registerModalActive">
                    <span class="mx-auto">{{$t('message.register')}}</span>
                    <div class="spinner-border spinner-border-sm mx-auto d-inline-block" v-if="spinnerActive"></div>

                  </button>
                </form>
              </div>

              <div class="mt-2">
                <div class="d-flex align-items-center justify-content-between">
                  <div class="border-1 bg-dark w-75 border-bottom"></div>
                  <span class="text-black-50 w-100">{{$t('message.continue_with')}}</span>
                  <div class="border-1 bg-dark w-75 border-bottom"></div>
                </div>
                <div class="d-flex justify-content-center align-items-center mt-1">
                  <button class="btn btn-outline-primary me-1" :class="loginModalActive?'bg-primary text-white':''"  @click="showLogin"><i class="fas fa-envelope"></i></button>

                  <button class="btn btn-outline-primary me-1" @click="googleSignIn"><i class="fab fa-google"></i></button>
                  <button class="btn btn-outline-primary" @click="showPhoneAuthBox"><i class="fas fa-phone"></i></button>
                </div>
              </div>

              <div class="my-2 d-flex justify-content-center align-items-center" v-if="loginModalActive">
                <span>Not a member?</span>
                <span class="text-primary ms-1" style="cursor: pointer" @click.prevent="showRegister">Register Now</span>
              </div>
              <div class="my-2 d-flex align-items-center justify-content-center" v-if="registerModalActive">
                <span>Already a member?</span>
                <span class="text-primary ms-1" style="cursor: pointer" @click.prevent="showLogin">Login Here</span>
              </div>
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
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import db, {timestamp} from "../config/FirebaseInit";
import PhoneAuthModal from "@/components/PhoneAuthModal";
export default {
  name:"LoginModal",
  components: {PhoneAuthModal},
  props:["modalMessage"],
  data(){
    return{
      phone:"",
      address:"",
      name:"",
      email:"",
      password:"",
      error:null,
      errorMsg:"",
      showPhoneAuth:false,
      spinnerActive:false,
      registerModalActive:false,
      loginModalActive:true,
    }
  },
  computed:{
    owner(){
      return this.$store.getters.getShopOwner;
    },
    admin(){
      return this.$store.getters.getAdmin;
    }
  },

  methods:{
    showPhoneAuthBox(){
      this.showPhoneAuth = true;
      this.registerModalActive = false;
      this.loginModalActive = false;
    },
    showRegister() {
      this.showPhoneAuth = false;
      this.loginModalActive = false;
      this.registerModalActive = true;
    },
    showLogin() {
      this.showPhoneAuth = false;
      this.loginModalActive = true;
      this.registerModalActive = false;
    },
    closeModal(){
      this.$emit("close-modal")
    },
    signIn(){
      if(this.email!='' && this.password!=''){
        this.sessionLogout();
        this.spinnerActive = true;
        firebase.auth().signInWithEmailAndPassword(this.email,this.password)
            .then(()=>{
              this.spinnerActive = false;
              this.closeModal();
            }).catch((error)=>{
          this.spinnerActive = false;
          if (error.code === 'auth/email-already-in-use') {
            this.errorMsg = 'Mail already in used!';
          }
          else if(error.code === 'auth/user-not-found'){
            this.errorMsg = "You haven't register with this mail."
          }else {
            this.errorMsg = error.message;
          }
          this.error=true;
          //this.errorMsg = error.message;
          setTimeout(()=>{
            this.error = false;
          },5000)
          return;
        });
        return;
      }else {
        this.errorMsg = "Please fill email and password!"
        this.error=true;
        //this.errorMsg = error.message;
        setTimeout(()=>{
          this.error = false;
        },5000)
        return;
      }

    },
    sessionLogout() {
      if (this.admin !== '') {
        firebase.auth().signOut().then(() => {
          sessionStorage.clear();
          window.localStorage.removeItem('vuex');
          this.$store.state.admin = '';
          console.log('login session cleared');
        })
      }
      if (this.owner !== '') {
        firebase.auth().signOut().then(() => {
          sessionStorage.clear();
          window.localStorage.removeItem('vuex');
          this.$store.state.shopOwner = '';
          console.log('login session cleared');
        })
      }
    },
    async googleSignIn(){
      this.closeModal();
      this.sessionLogout();
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        'login_hint': 'flashmallmm.com'
      });
      const auth = getAuth();

      await signInWithPopup(auth, provider)
          .then((userResult) => {
            const dataBase = db.collection('users').doc(userResult.user.uid);
            dataBase.get().then((result)=>{
              if(!result.data()){
                dataBase.set({
                  id:dataBase.id,
                  name:userResult.user.displayName,
                  email:userResult.user.email,
                  phone:'',
                  address:'',
                  photo:userResult.user.photoURL,
                  shopOwner:false,
                  date:timestamp
                });
              }
              this.$store.dispatch("getCurrentUser")
            })
          }).catch((error) => {
            // const errorCode = error.code;
            // const errorMessage = error.message;
            console(error.message)
            // const email = error.email;
            // const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
            // console.log(errorCode+", "+errorMessage+", "+email+", "+credential)
            return;
          });
      return;
    },
    async register(){
      if(this.name !== "" &&
          this.email !=="" &&
          this.address!=="" &&
          this.password !== "" &&
          this.phone !=="" &&
          this.address !==""
      ){
        this.sessionLogout();
        this.spinnerActive = true;
        this.error = false;
        this.errorMsg="";
        const firebaseAuth = await firebase.auth();
        await firebaseAuth.createUserWithEmailAndPassword(this.email, this.password).then((userCredential)=>{
          // send the signed in user a verification email
          //TODO: user verification
          /*userCredential.user.sendEmailVerification().then(()=>{

          });*/
          const dataBase = db.collection('users').doc(userCredential.user.uid);
          dataBase.set({
            id:dataBase.id,
            name:this.name,
            email:this.email,
            phone:this.phone,
            address:this.address,
            photo:'',
            shopOwner:false,
            date:timestamp
          }).then(()=>{

            this.$store.dispatch("getCurrentUser");
            this.errorMsg="";
            this.error=false;
            this.spinnerActive = false;
            this.registerModalActive=false;
            this.loginModalActive=true;
            this.closeModal();
            return;
          }).catch(error=>{
            this.spinnerActive = false;
            this.error= true;
            this.errorMsg = error.message;
            setTimeout(()=>{
              this.error = false;
            },5000)
          });
          this.errorMsg="";
          this.error=false;


        }).catch(error=>{
          this.spinnerActive = false;
          if (error.code === 'auth/email-already-in-use') {
            this.errorMsg = 'The mail address is already used!';
          }else {
            this.errorMsg = error.message;
          }
          this.error=true;
          //this.errorMsg = error.message;
          setTimeout(()=>{
            this.error = false;
          },5000)
          return;
        });
      }else {
        this.spinnerActive = false;
        this.error = true;
        this.errorMsg = "Please fill out all the fields!"
        setTimeout(()=>{
          this.error = false;
        },5000)
        return ;
      }
    }
  },
}
</script>

<style scoped>
body{
  overflow:hidden;
}
.card{
  border-radius: 20px !important;
}
.modal{
  width:400px;
  top:0;
  z-index: 20000;
  height: 100%;
  width: 100%;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(141, 154, 236, 0.83);
  backdrop-filter: blur(5px);
}
.nav-link{
  cursor: pointer !important;
  transition: 0.8s;
}
.nav-link:hover{
  transform: scale(1.05);
}
.close-icon{
  transition: 0.9s;
}
.close-icon:hover{
  color: #6b4040;
}
.card:hover{
  background: white;
}
@media screen and (max-width: 480px) {
  .modal{


  }
  .container{
  }
  .bg-login{
    height: 80%;
    width: 90%;
  }
  .row{
    margin:10px;
  }
  .overlay{
    width: 100%;
    height: 100%;
    border-radius: var(--border-radius);
    background-color: #fff;
  }
  .card{
    box-shadow: 0 0 0 0 var(--light);
  }
}
</style>