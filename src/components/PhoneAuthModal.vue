<template>
  <div class="modal">
    <div class="container">
      <div class="row overlay mx-auto">
        <div class="col-12 col-lg-5 col-xl-5 col-md-6 mx-auto">
          <div class="card border-0 shadow-none">
            <div class="p-2 d-flex justify-content-end align-items-center">
              <button @click.prevent="closeModal" class="btn btn-sm" style="color: var(--text-color);width: 30px;height: 30px;border-radius: 50%;"><i class="fas fa-close"></i></button>
            </div>
            <div class="card-body text-center">
              <h4>{{ $t('message.hello') }}</h4>
              <h5>{{ $t('message.wct_flash') }}</h5>

              <div>
                <div class="card shadow-none border-0">
                  <div class="card-body">
                    <div>
                      <p class="alert alert-warning w-100 mt-2" v-if="alertActive">{{alertMessage}}</p>
                    </div>
                    <div class="mt-3" v-if="otpActive">
<!--                      <span style="color:var(&#45;&#45;text-color);">{{ $t('message.enter_phone') }}</span>-->
                      {{phone}}
                      <form @submit.prevent="sendOtp">
                        <vue-tel-input :value="phone" @input="onTelInput" defaultCountry="MM"></vue-tel-input>
<!--                        <vue-tel-input v-model="phone" defaultCountry="MM" required="true" :placeholder="$t('message.enter_phone')"></vue-tel-input>-->
<!--                        <div class="d-flex rounded p-1 align-items-center" style="color: var(&#45;&#45;text-color);background-color: var(&#45;&#45;light);">-->
<!--                          <span class="mx-2">09</span><input type="number" required class="form-control rounded" style="background-color: var(&#45;&#45;background-color);border: 1px solid white" v-model="phone" id="phone-input" placeholder="****" autocomplete="off">-->
<!--                        </div>-->
                        <button type="submit"  class="btn btn-sm w-50 mx-auto my-3" style="color:var(--text-color);background-color: var(--btnLight);">
                          {{$t('message.get_otp')}}
                          <div class="spinner-border spinner-border-sm mx-1" style="color: var(--text-color);" v-if="spinnerActive"></div>
                        </button>
                      </form>

                      <!--              <div class="text-decoration-none mx-auto text-primary" style="cursor:pointer;" @click="sendOtp()">Resend OTP ?</div>-->

                      <div id="recaptcha-container"></div><br>
                    </div>

                    <div v-if="showConfirm">
                      <div class="form-floating mb-3" >
                        <input type="text" required class="form-control" v-model="otp" id="code-input" placeholder="enter phone" autocomplete="off">
                        <label for="code-input">{{ $t('message.enter_code') }}</label>
                      </div>
                      <button class="btn mb-3 w-50 mx-auto text-black" style="background-color: var(--btnLight);" @click="verifyOtp">
                        <span class="mx-auto">{{ $t('message.verify') }}</span>
                        <div class="spinner-border spinner-border-sm mx-auto d-inline-block" v-if="verifySpinnerActive"></div>
                      </button>
                      <br>
                      <div class="text-decoration-none mx-auto" style="cursor:pointer;color: var(--text-color);" @click="sendOtp()">{{$t('message.resend')}}</div>
                    </div>

                    <div v-if="userInfoActive" style="color: var(--text-color);">
                      <div class="form-floating mb-3" >
                        <input type="text" required class="form-control" v-model="userInfo.name" id="name-input" placeholder="enter name" autocomplete="off">
                        <label for="name-input">{{$t('message.name')}}</label>
                      </div>
                      <div class="form-floating mb-3" >
                        <input type="email" required class="form-control" v-model="userInfo.email" id="user-email-input" placeholder="enter name" autocomplete="off">
                        <label for="user-email-input">{{ $t('message.email') }}</label>
                      </div>
                      <div class="form-floating mb-3" >
                        <input type="text" required class="form-control" v-model="userInfo.address" id="user-address-input" placeholder="enter name">
                        <label for="user-address-input">{{ $t('message.address') }}</label>
                      </div>
                      <button class="btn btn-dark w-50 mx-auto" @click="saveUserInfo">{{$t('message.save')}}</button>
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

</template>

<script>
import {getAuth, GoogleAuthProvider, RecaptchaVerifier,signInWithPhoneNumber, signInWithPopup} from "firebase/auth";
import db, {firebase, timestamp} from "@/config/FirebaseInit";
import {ref} from "vue";
export default {
  name:"PhoneAuthModal",
  props:["modalMessage"],
  data(){
    return{
      password:"",
      showPhoneAuth:false,
      registerModalActive:false,
      loginModalActive:true,
      // phone:'',
      results:'',
      otp:'',
      appVerifier:'',
      user:'',
      formattedPhone:'',
      userInfo:{
        id:'',
        name:'',
        email:'',
        phone:'',
        address:'',
        city:'',
        photo:'',
        shopOwner:false,
        date:'',
      },

      error:null,
      errorMsg:"",
      alertMessage:'',
      alertActive:false,
      otpActive:true,
      showConfirm:false,
      spinnerActive:false,
      verifySpinnerActive:false,
      userInfoActive:false,
    }
  },
  setup() {
    const phone = ref(null);

    return {
      phone
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
    onTelInput(phone, phoneObject,input) {
      console.log(input)
      if (phoneObject?.formatted) {
        //console.log('National Number',phoneObject.nationalNumber)
        this.formattedPhone = phoneObject
        console.log('formatted: ',this.formattedPhone)
      }
    },
    resendOtp(){
      this.otpActive = true;
      this.showConfirm = false;
    },
    showAlert(msg){
      this.alertActive = true;
      this.alertMessage = msg;
      setTimeout(()=>{
        this.alertActive = false;
      },5000)
    },
    sendOtp(){
      if(this.formattedPhone){
        if(this.formattedPhone.nationalNumber.toString().length === 10){
          this.generateRecaptcha();
          let appVerifier = window.recaptchaVerifier;
          // let format_phone ='959'+this.phone;
          this.spinnerActive = true;
          this.sessionLogout();
          signInWithPhoneNumber(getAuth(),this.formattedPhone.number,appVerifier).then(confirmationResult=>{
            window.confirmationResult = confirmationResult;
            this.showAlert(this.$t('message.otp_sent'))
            this.spinnerActive=false;
            this.otpActive = false;
            this.showConfirm = true;
          }).catch(err=>{
            this.showAlert(err.message);
            this.spinnerActive = false;
            this.showConfirm = false;
          })
        }else {
          this.spinnerActive = false;
          this.showAlert(this.$t('message.invalid_phone'));
        }
      }else {
        this.showAlert('Please Enter phone number')
      }

    },
    verifyOtp(){
      if(this.otp.length !== 6){
        this.showAlert(this.$t('message.invalid_otp'));
      }else {
        this.verifySpinnerActive = true;
        let confirmationResult = window.confirmationResult;
        confirmationResult.confirm(this.otp).then(result => {
          this.user = result.user;
          this.userInfo.phone = '+959'+result.user.phoneNumber;
          this.userInfo.id = result.user.uid;
          console.log(result.user);
          const dataBase = db.collection('users').doc(this.user.uid);
          dataBase.get().then((result) => {
            if (!result.data()) {
              this.verifySpinnerActive = false;
              this.showConfirm = false;
              this.userInfoActive = true;
            } else {
              this.verifySpinnerActive = false;
              this.closeModal();
              this.$store.dispatch("getCurrentUser");
              this.showAlert(this.$t('message.veri_success'));
            }
          })
        }).catch(function (error) {
          console.log(error)
          this.verifySpinnerActive = false;
          this.showAlert(this.$t('message.invalid_code'));
        });
      }

    },
    saveUserInfo(){
      this.userInfo.phone = this.formattedPhone.nationalNumber+"";
      this.userInfo.date = timestamp;
      if(this.userInfo.name ===''){
        this.showAlert(this.$t('message.fill_name'));

      }else if(this.userInfo.email ===''){
        this.showAlert(this.$t('message.fill_email'));

      }else if (this.userInfo.address ==='')
      {
        this.showAlert(this.$t('message.fill_address'));

      }else {
        console.log('user id',this.user.uid);
        db.collection('users').doc(this.user.uid).set(this.userInfo).then(()=>{
          this.showAlert(this.$t('message.veri_success'));
          this.closeModal();
          this.$store.dispatch("getCurrentUser");
        });
      }

    },

    generateRecaptcha(){
      window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container',{
        'size':'invisible',
        'callback':(response)=>{

          console.log(response)
        }
      },getAuth())
    },

    closeModal(){
      this.$emit("close-modal")
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
            console.log(error.message)
            // const email = error.email;
            // const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
            // console.log(errorCode+", "+errorMessage+", "+email+", "+credential)
            return;
          });
      return;
    },

  },
  created(){
    /*this.initReCaptcha()*/
  },
}
</script>

<style scoped>
.card{
  border-radius: 20px !important;
}
.bg-login{
  border-radius: var(--border-radius);
  background-color: var(--white);

}
.modal{
  top:0;
  z-index: 20000;
  background-color: rgba(0, 0, 0, 0.7);
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
}
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
body{
  overflow:hidden;
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
    /*background-color: #fff;*/
  }
  .card{
    /*box-shadow: 0 0 0 0 var(--light);*/
  }
}
</style>