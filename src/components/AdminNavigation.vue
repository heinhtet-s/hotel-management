<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark position-fixed w-100 top-0" style="z-index: 10000">
      <div class="container-xxl">

        <router-link class="d-flex text-decoration-none text-light align-items-center" :to="{name:'AdminHome'}">
          <img src="../assets/white-logo.svg" class="text-white" width="26" alt=""> <span class="fw-bold fs-6 mx-2"> Flash Mall</span>
        </router-link>

        <button class="navbar-toggler bordexr-0" data-bs-toggle="collapse" :class="visible?null:'collapsed'"
                :aria-expanded="visible ? 'true' : 'false'"
                @click="visible = !visible"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-label="Toggle navigation">
          <span > </span>
          <span > </span>
          <span > </span>
        </button>

        <div class="collapse navbar-collapse" :class="visible?null:'collapsed'" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item" @click="visible =!visible" >
              <router-link class="nav-link active"  aria-current="page" :to="{name:'ShopManagement'}">Shop Dashboard</router-link>
            </li>

            <li class="nav-item" @click.prevent="visible =!visible">
              <router-link class="nav-link" :to="{name:'UserControl'}">User Control</router-link>
            </li>
            <li class="nav-item" @click.prevent="visible =!visible">
              <router-link class="nav-link" :to="{name:'CreateDeliveryService'}">Delivery</router-link>
            </li>
          </ul>
                    <div class="dropdown"  v-if="admin">
                      <button class="btn btn-outline-light rounded dropdown-toggle " type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                        {{admin.email}}
                      </button>
                      <ul class="dropdown-menu " aria-labelledby="dropdownMenuButton1">
                        <li class="dropdown-item" @click.prevent="adminLogout">Logout</li>
                      </ul>
                    </div>
         </div>
      </div>
    </nav>
    <slot/>
  </div>
</template>

<script>
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
export default {
  data(){
    return{
      loginModal:false,
      visible:false,

    }
  },
  name:"AdminNavigation",
  computed: {
    user(){
      return this.$store.getters.getCurrentUser;
    },
    admin(){
      return this.$store.getters.getAdmin;
    }
  },
  created() {
    this.$store.dispatch('getAdmin');
  },

  methods:{
    adminLogout(){
      firebase.auth().signOut().then(()=>{
        window.localStorage.removeItem('vuex');
        sessionStorage.clear();
        this.$store.state.admin='';
        console.log("logout");
        this.$router.push({name:'AdminLogin'});
      }).catch(error=>{
        alert(error.message);
      });
    },
    closeModal(){
      this.loginModal = !this.loginModal;
    },
    signIn(){
      this.loginModal = true;
    }

  }
}
</script>
<style>

</style>
<style scoped>
.navbar{
  background-color: var(--primary);
}

li{
  cursor: pointer;
}
.navbar-toggler{
  border:none !important;
  outline: none !important;
  box-shadow: none !important;
  transition: 0.4s;
}
.navbar-toggler:focus{
  transform: scale(1.02);
}
.navbar-toggler{
  border: none;
  outline: none;
  box-shadow: none !important;
}

.navbar-toggler:focus {
  border: none;
  outline: none;
  box-shadow: none;
}

.navbar-toggler span {
  display: block;
  background-color: var(--light);
  height: 3px;
  border-radius: 20px;
  width: 25px;
  margin-top: 5px;
  margin-bottom: 5px;
  position: relative;
  left: 0;
  opacity: 1;
  transition: all 0.35s ease-out;
  transform-origin: center left;
}
/* top line needs a little padding */
.navbar-toggler span:nth-child(1) {
  margin-top: 0.3em;
}
/**
 * Animate collapse into X.
 */
/* top line rotates 45 degrees clockwise and moves up and in a bit to close the center of the X in the center of the button */
.navbar-toggler:not(.collapsed) span:nth-child(1) {
  transform: translate(15%, -33%) rotate(45deg);
}
/* center line goes transparent */
.navbar-toggler:not(.collapsed) span:nth-child(2) {
  opacity: 0;
}
/* bottom line rotates 45 degrees counter clockwise, in, and down a bit to close the center of the X in the center of the button  */
.navbar-toggler:not(.collapsed) span:nth-child(3) {
  transform: translate(15%, 33%) rotate(-45deg) ;
}

/**
 * Animate collapse open into hamburger menu
 */

/* top line moves back to initial position and rotates back to 0 degrees */
.navbar-toggler span:nth-child(1) {
  transform: translate(0%, 0%) rotate(0deg) ;
}
/* middle line goes back to regular color and opacity */
.navbar-toggler span:nth-child(2) {
  opacity: 1;
}
/* bottom line goes back to initial position and rotates back to 0 degrees */
.navbar-toggler span:nth-child(3) {
  transform: translate(0%, 0%) rotate(0deg) ;
}
@media (min-width: 768px) {

}

@media screen and (max-width: 800px) {
  .user-btn{
    width: 50%;
    margin: auto;
  }
  .navbar-nav{
    text-align: center;
  }
  .signin-btn{
    margin: auto;
  }
  .navbar-collapse{
    margin-top: 100px;
    text-align: center;
    height: 100vh;
  }
  .nav-link{
    width: 50%;
    background-color: var(--softPrimary);
    color: var(--dark) !important;
    border-radius: var(--border-radius);
    margin: 10px auto 0 auto;
  }
  .dropdown{
    display: inline;
    margin: 10px auto 0 auto;
  }
  .collapsing {
    -webkit-transition: none;
    transition: none;
  }

}
</style>