<template>
  <div id="app">
    <Navigation v-if="navigation" />
    <router-view />
  </div>
</template>

<script>
import Navigation from '@/components/Navigation';
import { firebase, messaging } from './config/FirebaseInit';
import { provide } from 'vue';
export default {
  data() {
    return {
      navigation: null,
    };
  },
  components: { Navigation },
  computed: {
    owner() {
      return this.$store.getters.getShopOwner;
    },
    cashier() {
      return this.$store.getters.getCashierAcc;
    },
  },
  mounted() {},
  //options api
  provide: {
    messaging: messaging,
  },
  //composition api
  setup() {
    provide('messaging', messaging);
  },
  async created() {
    await firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('getCurrentShop');
      }
    });
    this.$messaging
      .getToken({
        vapidKey:
          'BJMMGbfQ4hOe2acXMe11F99lGUArrGheO2nXLAFzs1D3Oh2MCuJCkWPiawTRR4h_roDqBaiqJ6NLVo5o2gu5mXo',
      })
      .then((token) => {
        this.$store.commit('SET_FCM', token);
      })
      .catch((err) => {
        console.log(err.message);
      });

    //TODO: device signout
    /* if(this.$store.getters.cashierAcc!==''){
      db.collection(this.owner.city).doc(this.owner.shopId).collection('account').doc(this.cashier.id).get().then(snapshot=>{
        if(snapshot.data().deviceId !== navigator.userAgent){
          firebase.auth().signOut().then(()=>{
            window.localStorage.removeItem('vuex');
            sessionStorage.clear();
            this.$store.state.shopOwner='';
            this.$store.state.cashierAcc = '';
            console.log("logout");
            this.$router.push({name:'ShopOwnerLogin'});
          }).catch(error=>{
            alert(error.message);
          });
        }
      })
    }*/
    this.checkRoute();
  },
  methods: {
    checkRoute() {
      if (
        this.$route.name === 'Home' ||
        this.$route.name === 'About' ||
        this.$route.name === 'Contact' ||
        this.$route.name === 'TermsOfService' ||
        this.$route.name === 'ShowShopByType' ||
        this.$route.name === 'Shops' ||
        this.$route.name === 'ShopInfo' ||
        this.$route.name === 'LiveSales' ||
        this.$route.name === 'ProductInfo' ||
        this.$route.name === 'product-detail' ||
        this.$route.name === 'UserProfile' ||
        this.$route.name === 'CustomerOrderDetails' ||
        this.$route.name === 'CustomerLiveOrderDetails'
      ) {
        this.navigation = true;
        return;
      } else {
        this.navigation = false;
        return;
      }
    },
  },
  watch: {
    $route() {
      this.checkRoute();
    },
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@200;300;400;600;800&display=swap');
#app {
  font-family: 'Sarabun', sans-serif;
  /*font-family: 'Zawgyi-One',second font,third font;*/
  -moz-osx-font-smoothing: grayscale;
  scroll-behavior: smooth;
}
:root {
  --primary: #ff6d00;
  --secondary: #ff7900;
  --primaryLight: #ff9e00;
  --discountPrimary: #fa5801;
  --live-bg: #b62323;
  --red: #b62323;
  --green: #6ffa80;
  --softPrimary: rgb(248, 214, 179);
  --text-color: #03071e;
  --text-color-light: #4f4f50c0;
  --btnLight: #ff9e00;
  --light: #f6fafc;
  --side-bar-bg: rgba(239, 247, 252, 0.84);
  --white: #ffffff;
  --gray: #333533;
  --dark: #03071e;
  --border-radius: 0.6rem;
  --background-color: white;
  --card-color: #ffffff;
}
[data-theme='darkMode'] {
  /* Variables for dark mode */
  --background-color: #0e141e;
  --light: #3b352e;
  --side-bar-bg: #9d6e47;
  --text-color: white;
  --white: #000000;
  --dark: #a2a2a4;
  --text-color-light: #c6c7cb;
  --card-color: rgba(72, 57, 41, 0.83);
}
body {
  background-color: var(--background-color) !important;
  width: 100vw;
  overflow-x: hidden;
}
.form-floating label {
  color: gray !important;
}
.accordion-button {
  box-shadow: none !important;
}
.fa,
.fas {
  color: var(--text-color) !important;
}

body::-webkit-scrollbar {
  width: 0.4em;
}

body::-webkit-scrollbar-track {
  /*box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);*/
}

body::-webkit-scrollbar-thumb {
  background-color: var(--softPrimary);
  outline: 1px solid var(--softPrimary);
}


td,
th {
  border: 1px solid var(--light) !important;
  background-color: var(--light);
  color: var(--text-color);
}
.modal-content {
  background-color: var(--background-color);
  color: var(--text-color);
  border-radius: var(--border-radius) !important;
  border: none !important;
}
.modal-header {
  border: none !important;
}
.modal-footer {
  border: none !important;
}

.btn {
  border-radius: var(--border-radius) !important;
  transition: 0.3s;
}
.card {
  background-color: var(--white) !important;
  border-radius: var(--border-radius) !important;
  margin: 5px;
  color: var(--text-color);
  border: 0px !important;
  transition: 0.3s !important;
  box-shadow:0 0 10px -10px rgba(204, 204, 204, 0.6);

}
.btn{
  box-shadow:0 0 10px -10px rgba(166, 110, 53, 0.83) !important;

}
.card-body {
  background-color: var(--white) !important;
  border-radius: var(--border-radius) !important;
  transition: 0.3s !important;
}
.carousel-img {
  border: 0px !important;
}
.btn:focus {
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}
.btn:hover {
  transform: scale(1.02);
}
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.form-control {
  border: 1px solid var(--side-bar-bg);
  color: var(--text-color) !important;
  background-color: var(--white) !important;
  border-radius: var(--border-radius) !important;
}

.form-control:focus {
  box-shadow: none !important;
}
.btn {
  border-radius: var(--border-radius);
}
/* Firefox */
input[type='number'] {
  -moz-appearance: textfield;
}
</style>
