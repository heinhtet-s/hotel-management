<template>
  <div class="container-fluid" style="overflow-y: hidden">
    <div class="d-flex">
      <div class="min-vh-100 position-relative  p-2" style="border-right: 2px solid var(--light);">
        <div class="d-flex justify-content-between text-center rounded mb-3">
          <router-link @click="routeClick" class="p-1 text-decoration-none" style="color: var(--text-color);"
            :to="{name:'OwnerProfile'}">
            <img :src="shopInfo.profileUrl" class="text-white" style="border-radius: var(--border-radius);" width="30"
              height="30" alt="">
            <p class="fw-bold">{{ $t('message.profile') }}</p>
          </router-link>
        </div>
        <ul
          class="text-start py-auto d-flex flex-column align-items-center justify-content-center d-block list-unstyled">
          <router-link @click="routeClick" class="" :to="{ name: 'ShopHome' }">
            <li :to="{ name: 'ShopHome' }" class="d-inline-block align-items-center mx-1"
              :class="this.$route.name === 'ShopHome' ? 'list_active' : ''">
              <div class="d-flex align-items-center">
                <div><i class="fas icon-bg fa-home"></i></div>
              </div>
            </li>
          </router-link>
          <router-link @click="routeClick" class="" :to="{ name: 'SellProductRestaurant' }"
            v-if="cashierAcc.counter === 'Bar' || cashierAcc.counter == 'Restaurant' || cashierAcc.counter === 'Coffee Counter'">
            <li class="d-inline-block mx-1" :class="this.$route.name === 'SellProductRestaurant' ? 'list_active' : ''">
              <div class="d-flex align-item-center">
                <div> <i class="fas icon-bg fa-cash-register"></i></div>
              </div>

            </li>
          </router-link>
          <router-link @click="routeClick" class="" :to="{ name: 'Apartment', params: { category: 'All' } }"
            v-if="cashierAcc.counter === 'Apartment'">

            <li class="d-inline-block mx-1" :class="this.$route.name === 'Apartment' ? 'list_active' : ''">
              <div class="d-flex align-item-center">
                <div class="d-flex align-items-center"><i class="fas icon-bg fa-people-roof"></i></div>
              </div>

            </li>
          </router-link>
          <router-link @click="routeClick" class=""   v-if="cashierAcc.counter!=='Apartment'"
            :to="{  name:'SellReport', params: { date_type: 'day', selected_date: today } }">
            <li class="d-inline-block text-center mx-1" :class="this.$route.name==='SellReport'? 'list_active' : ''">
              <i class="fas icon-bg fa-square-poll-vertical"></i>R
            </li>
          </router-link>
          <router-link @click="routeClick" class="" v-if="cashierAcc.counter === 'Apartment' || cashierAcc.counter === 'Admin'"
            :to="{ name: 'ApartmentSellReport', params: { date_type: 'day', selected_date: today } }">
            <li class="d-inline-block text-center mx-1" :class="this.$route.name==='ApartmentSellReport' ? 'list_active' : ''">
              <i class="fas icon-bg fa-square-poll-vertical"></i>A          
            </li>
          </router-link>
          
          <router-link @click="routeClick" class="" :to="{ name: 'ListSwimmingPool' }"
            v-if="cashierAcc.counter === 'Apartment' || cashierAcc.counter === 'Admin'">

            <li class="d-inline-block mx-1" :class="this.$route.name === 'ListSwimmingPool' ? 'list_active' : ''">
              <div class="d-flex align-item-center">
                <div class="d-flex align-items-center"><i class="fas icon-bg fa-person-swimming"></i></div>
              </div>

            </li>
          </router-link>

          <router-link @click="routeClick" class="" :to="{ name: 'reservationManagement', params: { type: 'restaurant' }, }"
            v-if="cashierAcc.counter === 'Restaurant' || cashierAcc.counter === 'Bar'">
            <li class="d-inline-block mx-1" :class="this.$route.name === 'reservationManagement' ? 'list_active' : ''">
              <i class="fas icon-bg fa-book"></i>
            </li>
          </router-link>

          <router-link @click="routeClick" class="" :to="{ name: 'ShopDashboard' }">
            <li class="d-inline-block mx-1" :class="this.$route.name === 'ShopDashboard' ? 'list_active' : ''">
              <div class="d-flex align-item-center">
                <div class="d-flex align-items-center"><i class="fas icon-bg fa-boxes-stacked"></i></div>
              </div>
            </li>
          </router-link>

        
          <router-link @click="routeClick" class="" :to="{ name: 'GeneralSetting' }" v-if="shopInfo.onlineSell !== 'free'">

            <li class="d-inline-block mx-1" :class="this.$route.name === 'GeneralSetting' ? 'list_active' : ''">
              <div class="d-flex align-item-center">
                <div class="d-flex align-items-center"><i class="fas icon-bg fa-gear"></i></div>
              </div>

            </li>
          </router-link>

        </ul>
        <div class="d-flex flex-column mt-5">
          <div class="dropdown mb-3 mx-auto">
            <button class="btn rounded-circle text-center p-1 d-flex justify-content-center align-items-center"
              type="button" id="dropdownMenuButton1"
              style="background-color: var(--primary);color: var(--white); width: 25px; height: 25px;"
              data-bs-toggle="dropdown" aria-expanded="false">
              <i class="fas fa-globe "></i>
            </button>
            <ul class="dropdown-menu shadow-sm" style="z-index: 30000;" aria-labelledby="dropdownMenuButton1">
              <li class="dropdown-item" v-for="entry in languages" :key="entry.title"
                @click="changeLocale(entry.language)">
                <flag :iso="entry.flag" v-bind:squared=false /> {{ entry.title }}
              </li>
            </ul>
          </div>
          <button @click="toggleTheme" aria-label="Toggle themes"
            class="btn rounded-circle d-flex justify-content-center align-items-center mx-auto"
            style="background-color: var(--primary);color: var(--white); width: 25px; height: 25px;">
            <span v-if="this.theme == 'darkMode'"><i class="fas fa-sun"></i></span>
            <span v-else><i class="fas fa-moon"></i></span>
          </button>

        </div>
      </div>
      <div class="ms-2 p-2 w-100" style="overflow-y: hidden">
        <slot />
      </div>

    </div>

  </div>

</template>

<script>
export default {
  data() {
    return {
      guestMode: '',
      languages: [
        { flag: 'us', language: 'en', title: 'English' },
        { flag: 'mm', language: 'mmr', title: 'Myanmar' },
        { flag: 'cn', language: 'chn', title: 'China' }
      ],
      theme: '',
      darkModeActive: false,
      userTheme: "light-theme",
      visible: false,
      sidebarActive: false,
    }
  },
  computed: {
    owner() {
      return this.$store.getters.getShopOwner;
    },
    shopInfo() {
      return this.$store.getters.getShopInfo;
    },
    today() {
      return this.$store.getters.getDay;
    },
    cashierAcc() {
      return this.$store.getters.getCashierAcc;
    },
  },
  mounted() {
    this.$store.dispatch("getDay");
    console.log('today from sidebar', this.today)
    if (localStorage.getItem('locale')) {
      this.$i18n.locale = localStorage.getItem('locale');
    }
    let localTheme = localStorage.getItem('theme'); //gets stored theme value if any
    document.documentElement.setAttribute('data-theme', localTheme); //updates the data-theme attribute
  },
  methods: {
    changeLocale(locale) {
      this.visible = !this.visible;
      console.log(locale);
      this.$i18n.locale = locale;
      localStorage.setItem('locale', locale);
    },
    toggleTheme() {
      // this.visible =!this.visible;
      this.theme = this.theme == 'darkMode' ? '' : 'darkMode'; //toggles theme value
      document.documentElement.setAttribute('data-theme', this.theme); // sets the data-theme attribute
      localStorage.setItem('theme', this.theme); // stores theme value on local storage

    },
    showSideBar() {
      this.visible = !this.visible;
      this.sidebarActive = !this.sidebarActive;
    },
    routeClick() {
      this.sidebarActive = !this.sidebarActive;
      this.visible = !this.visible;
    },

  }

}
</script>

<style scoped>
span {
  font-size: 13px;
}

.dropdown-menu {
  box-shadow: 0 0 50px -20px rgba(204, 204, 204, 0.8);
  background-color: var(--background-color);
  border: 0;
  padding: 5px;
  border-radius: var(--border-radius);
}

.icon-bg {
  color: var(--dark) !important;
  margin: 5px;
  width: 20px;
  height: 20px;
  border-radius: var(--border-radius);
  padding: 5px;
  transition: 0.3s ease-in-out all;
}

li {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 10px;
  background-color: var(--light);
  padding: 5px;
  color: var(--gray);
  border-radius: var(--border-radius);
  transition: 0.3s ease-in-out all;
}

li:hover,
li:focus {
  background-color: var(--primary);
  color: var(--white) !important;
}

.list_active {
  background-color: var(--primary);
  color: var(--white);
}

ul {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.profile-link {
  text-decoration: none;
  background-color: var(--light);
  color: var(--text-color);
  border-radius: var(--border-radius);
  transition: 0.3s;
}

.profile-link:hover {
  background-color: var(--secondary);
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

/*end*/
@media only screen and (max-width: 1200px) {
  .category-box {
    width: 180px;
  }
}

.category-container {
  margin-top: 50px;
}

@media only screen and (max-width: 1030px) {

  .category-box {
    padding-top: 10px;
    z-index: 5000;
    position: fixed;
    width: inherit;
    margin-top: 0px;
    margin-bottom: 100px;
    min-height: 92%;
    align-items: center;
  }

}
</style>