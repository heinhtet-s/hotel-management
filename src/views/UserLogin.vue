<template>
  <div>

  </div>
</template>

<script>
export default {

}
</script>

<style scoped>

</style>


<!--<template>-->
<!--  <div class="card shadow-none border-0">-->
<!--    <div class="card-body">-->
<!--      <div>-->
<!--        <h4 style="color: var(&#45;&#45;primary)">Login with Phone</h4>-->
<!--      </div>-->
<!--      <div class="mt-3">-->
<!--        <div class="d-flex bg-light rounded p-1 align-items-center">-->
<!--          <input type="tel" required class="bg-white form-control rounded" style="border: 1px solid white" v-model="phone" id="phone-input" placeholder="09****">-->
<!--        </div>-->
<!--        <button  class="btn btn-sm btn-dark w-50 mx-auto my-3" @click="sendOtp">-->
<!--          Get OTP-->
<!--        </button>-->
<!--        &lt;!&ndash;              <div class="text-decoration-none mx-auto text-primary" style="cursor:pointer;" @click="sendOtp()">Resend OTP ?</div>&ndash;&gt;-->

<!--        <div id="recaptcha-container"></div><br>-->
<!--      </div>-->
<!--      <div >-->
<!--        <div class="form-floating mb-3" >-->
<!--          <input type="text" required class="form-control" v-model="otp" id="code-input" placeholder="enter phone">-->
<!--          <label for="code-input">Enter Code</label>-->
<!--        </div>-->
<!--        <button class="btn btn-dark mb-3 w-50 mx-auto" @click="verifyOtp">-->
<!--          <span class="mx-auto">Verify</span>-->
<!--        </button>-->
<!--        <br>-->
<!--      </div>-->

<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import {getAuth,RecaptchaVerifier,signInWithPhoneNumber} from "firebase/auth";-->
<!--export default {-->
<!--  name:"PhoneAuthModal",-->
<!--  props:["modalMessage"],-->
<!--  data(){-->
<!--    return{-->
<!--      phone:'',-->
<!--      otp:'',-->
<!--    }-->
<!--  },-->

<!--  methods:{-->
<!--    sendOtp(){-->
<!--      if(this.phone.toString().length === 9){-->
<!--        //console.log('correct'+this.phone)-->
<!--        this.generateRecaptcha();-->
<!--        let appVerifier = window.recaptchaVerifier;-->
<!--        let format_phone = '+959'+this.phone;-->
<!--        console.log(format_phone)-->
<!--        signInWithPhoneNumber(getAuth(),format_phone,appVerifier).then(confirmationResult=>{-->
<!--          window.confirmationResult = confirmationResult;-->
<!--          alert('sms sent')-->
<!--          //console.log(confirmationResult)-->

<!--        }).catch(err=>{-->
<!--          console.log(err.message)-->
<!--        })-->

<!--      }else {-->
<!--        console.log(this.phone)-->
<!--      }-->
<!--    },-->
<!--    generateRecaptcha(){-->
<!--      window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container',{-->
<!--        'size':'invisible',-->
<!--        'callback':(response)=>{-->

<!--          console.log(response)-->
<!--        }-->
<!--      },getAuth())-->
<!--    }-->
<!--  },-->
<!--  created(){-->
<!--  },-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->
<!--.bg-login{-->
<!--  border-radius: var(&#45;&#45;border-radius);-->
<!--  background-color: var(&#45;&#45;white);-->

<!--}-->
<!--.modal{-->
<!--  top:0;-->
<!--  z-index: 20000;-->
<!--  background-color: rgba(0, 0, 0, 0.7);-->
<!--  position: fixed;-->
<!--  display: flex;-->
<!--  justify-content: center;-->
<!--  align-items: center;-->
<!--}-->
<!--/* Chrome, Safari, Edge, Opera */-->
<!--input::-webkit-outer-spin-button,-->
<!--input::-webkit-inner-spin-button {-->
<!--  -webkit-appearance: none;-->
<!--  margin: 0;-->
<!--}-->

<!--/* Firefox */-->
<!--input[type=number] {-->
<!--  -moz-appearance: textfield;-->
<!--}-->

<!--</style>-->
