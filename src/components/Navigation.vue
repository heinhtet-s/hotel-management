<template>
  <!-- <PhoneAuthModal v-show="loginModal" v-on:close-modal="closeLoginModal" /> -->
  <header>
    <nav
      class="navbar navbar-expand-xl p-0"
      style="
        z-index: 50;
        position: absolute;
        top: 0;
        left: 0;
        background: transparent;
        width: 100%;
      "
    >
      <div class="container-xxl px-0">
        <router-link
          class="d-flex text-decoration-none align-items-center"
          :to="{ name: 'Home' }"
        >
          <span class="fw-bold fs-4 ms-2" style="color: white">360&#176;</span>
        </router-link>

        <button
          class="navbar-toggler border-0"
          data-bs-toggle="collapse"
          :class="visible ? null : 'collapsed'"
          :aria-expanded="visible ? 'true' : 'false'"
          @click="visible = !visible"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-label="Toggle navigation"
        >
          <span> </span>
          <span> </span>
          <span> </span>
        </button>

        <div
          class="collapse navbar-collapse"
          :class="visible ? null : 'collapsed'"
          id="navbarSupportedContent"
        >
          <ul class="navbar-nav ms-auto mb-2 align-items-center mb-lg-0">
            <li class="nav-item">
              <router-link class="link" to="/about">About</router-link>
            </li>
            <li class="nav-item">
              <router-link class="link" to="/contact">Contact</router-link>
            </li>
            <!-- <div class="divider"></div> -->
            <!-- <li class="nav-item">
              <span
                @click="toggleTheme"
                aria-label="Toggle themes"
                class="nav-link d-flex justify-content-center align-items-center"
              >
                <span
                  v-if="this.theme == 'darkMode'"
                  style="font-size: 1rem"
                  class="text-white"
                  ><i class="fas fa-sun"></i
                ></span>
                <span v-else style="font-size: 1rem"
                  ><i class="fas fa-moon"></i
                ></span>
              </span>
            </li>
            <div class="nav-item dropdown">
              <a
                class="nav-link text-center dropdown-toggle p-1 d-flex justify-content-center align-items-center"
                style="font-size: 1rem"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i class="fas fa-globe"></i
                ><span class="ms-1">{{
                  languages[
                    languages.findIndex(
                      (lan) => lan.language === this.$i18n.locale
                    )
                  ].title
                }}</span>
              </a>
              <ul
                class="dropdown-menu dropdown-menu-end"
                aria-labelledby="dropdownMenuButton1"
              >
                <li
                  class="dropdown-item"
                  v-for="entry in languages"
                  :key="entry.title"
                  @click="changeLocale(entry.language)"
                >
                  <flag :iso="entry.flag" v-bind:squared="false" />
                  {{ entry.title }}
                </li>
              </ul>
            </div> -->
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
// import PhoneAuthModal from '@/components/PhoneAuthModal';
export default {
  data() {
    return {
      languages: [
        { flag: 'us', language: 'en', title: 'English' },
        { flag: 'mm', language: 'mmr', title: 'Myanmar' },
        { flag: 'cn', language: 'chn', title: 'China' },
      ],
      theme: '',
      darkModeActive: false,
      userTheme: 'light-theme',
      loginModal: false,
      visible: false,

      addToCartActive: false,
      showCategory: false,
      totalPrice: 0,
      allTotal: [],

      /*user:null,
      owner:null,*/
    };
  },
  name: 'Navigation',

  mounted() {
    if (localStorage.getItem('locale')) {
      this.$i18n.locale = localStorage.getItem('locale');
    }
    let localTheme = localStorage.getItem('theme'); //gets stored theme value if any
    document.documentElement.setAttribute('data-theme', localTheme); // updates the data-theme attribute
  },
  computed: {
    orders() {
      return this.$store.getters.getCartItems;
    },
    user() {
      return this.$store.getters.getCurrentUser;
    },
    admin() {
      return this.$store.getters.getAdmin;
    },
  },
  created() {
    this.$store.dispatch('getAdmin');
  },

  methods: {
    changeLocale(locale) {
      this.visible = !this.visible;
      this.$i18n.locale = locale;
      localStorage.setItem('locale', locale);
    },
    toggleTheme() {
      this.visible = !this.visible;
      this.theme = this.theme == 'darkMode' ? '' : 'darkMode'; //toggles theme value
      document.documentElement.setAttribute('data-theme', this.theme); // sets the data-theme attribute
      localStorage.setItem('theme', this.theme); // stores theme value on local storage
    },
    adminLogout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          window.localStorage.removeItem('vuex');
          sessionStorage.clear();
          this.$store.state.admin = '';
          console.log('logout');
          this.$router.push({ name: 'AdminLogin' });
        })
        .catch((error) => {
          alert(error.message);
        });
    },
    signIn() {
      this.loginModal = true;
    },

    closeModal() {
      this.infoModalActive = !this.infoModalActive;
    },
    closeLoginModal() {
      this.loginModal = !this.loginModal;
    },
    cancel() {
      this.confirmActive = !this.confirmActive;
    },
  },
};
</script>

<style scoped>
.nav-item {
  padding-block: 0.5rem;
  margin: 0px 5px;
  font-size: 1.25rem;
}
.nav-link {
  color: var(--text-color);
  text-decoration: none;
}
.nav-link:hover {
  color: var(--primary);
}

.navbar {
  background-color: transparent;
  color: var(--text-color);
}

li {
  cursor: pointer;
}
.navbar-toggler {
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
  transition: 0.4s;
  position: relative;
  z-index: 1000;
}
.navbar-toggler:focus {
  transform: scale(1.02);
}
.navbar-toggler {
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
  background-color: var(--primary);
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

.link {
  text-decoration: none;
  color: var(--text-color);
  margin-right: 1rem;
  transition: color 0.35s ease-out;
}

.link:hover {
  color: var(--primary);
}

.divider {
  background-color: var(--text-color);
  opacity: 0.5;
  width: 1.5px;
  height: 2rem;
  margin-right: 0.25rem;
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
  transform: translate(15%, 33%) rotate(-45deg);
}

/**
 * Animate collapse open into hamburger menu
 */

/* top line moves back to initial position and rotates back to 0 degrees */
.navbar-toggler span:nth-child(1) {
  transform: translate(0%, 0%) rotate(0deg);
}
/* middle line goes back to regular color and opacity */
.navbar-toggler span:nth-child(2) {
  opacity: 1;
}
/* bottom line goes back to initial position and rotates back to 0 degrees */
.navbar-toggler span:nth-child(3) {
  transform: translate(0%, 0%) rotate(0deg);
}

@media screen and (max-width: 800px) {
  .signin-nav {
    margin-top: 50px;
    margin-bottom: 50px;
  }
  .navbar-nav {
    text-align: center;
  }
  .signin-btn {
    margin: auto;
  }
  .navbar-collapse {
    margin-top: -3rem;
    padding-top: 30vh;
    text-align: center;
    height: 100vh;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(20px);
  }
  .nav-link {
    width: 150px;
    border-radius: 0px;
    margin: 10px auto 0 auto;
    border-bottom: 2px solid var(--light);
  }
  .dropdown {
    display: inline;
    margin: 10px auto 0 auto;
  }
  .collapsing {
    -webkit-transition: none;
    transition: none;
  }
  .divider {
    display: none;
  }
}
</style>

//
<li class="nav-item" @click.prevent="visible = !visible">
//               <router-link :to="{name:'UserProfile'}" class="nav-link" v-if="user">
//                <div class="d-flex justify-content-center align-items-center">
//                  <span class="me-2" style="font-size: 1rem"><i class="fas fa-user-circle"></i></span>
//                  <div class="d-flex flex-column ">
//                   <span style="font-size: 9px">
//                     {{ $t('message.profile') }}
//                   </span>
//                    <span class="fw-bold" style="font-size: 11px">
//                     {{ user.name.substr(0, user.name.indexOf(' '))}}
//                   </span>
//                  </div>
//                </div>
//               </router-link>
//               <div v-else class="nav-link" @click="signIn">
//                 <div class="d-flex justify-content-center align-items-center">
//                   <span style="font-size: 22px"><i class="fas fa-user-circle"></i></span>
//                   <div class="d-flex flex-column">
//                   <span style="font-size: 9px">
//                     {{ $t('message.nav_signIn') }}
//                   </span>
//                     <span class="fw-bold" style="font-size: 11px">
//                     Account
//                   </span>
//                   </div>
//                 </div>
//               </div>

//             </li>
