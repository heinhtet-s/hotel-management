import { createApp } from 'vue'
import App from './App.vue'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min"
import router from './router'
import store from './store'
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(fas);
import { fab } from '@fortawesome/free-brands-svg-icons';
library.add(fab);
import { far } from '@fortawesome/free-regular-svg-icons';
library.add(far);
import { dom } from "@fortawesome/fontawesome-svg-core";
dom.watch();


import VueExcelXlsx from "vue-excel-xlsx";
import 'v-calendar/dist/style.css';
import { SetupCalendar, Calendar, DatePicker } from 'v-calendar';
import print from 'vue3-print-nb'
import NextDatePicker from 'vue-datepicker-next';
import Vue3Lottie from 'vue3-lottie'
import 'vue3-lottie/dist/style.css'
import 'vue-datepicker-next/index.css';
import 'aos/dist/aos.css';
import './registerServiceWorker';
import { createI18n } from 'vue-i18n';
import FlagIcon from 'vue-flag-icon';
import VueTelInput from 'vue3-tel-input';
import 'vue3-tel-input/dist/vue3-tel-input.css';
import "v3-infinite-loading/lib/style.css";
import VueSplide from '@splidejs/vue-splide';
import {messages} from "@/langauges";
//pagination testing


// 2. Create i18n instance with options
const i18n = createI18n({
    locale: 'en', // set locale
    fallbackLocale: 'mmr', // set fallback locale
    messages, // set locale messages
    // If you need to specify other options, you can set other options
    // ...
})
import {messaging} from './config/FirebaseInit';
import VueBarcode from '@chenfengyuan/vue-barcode';

const app = createApp(App);
const VueTelInputOptions = {
    mode: "international",
    //onlyCountries: ['MM', 'GH', "GB", "US", "CA"]
}
import { ProCalendar } from "@lbgm/pro-calendar-vue";

app.config.globalProperties.$messaging = messaging;
app.use(store).use(router).use(ProCalendar).use(VueTelInput,VueTelInputOptions).use( VueSplide ).use(VueTelInput).use(i18n).use(Vue3Lottie).use(FlagIcon).use(VueExcelXlsx).use(print).use(SetupCalendar, {}).component(VueBarcode.name, VueBarcode).component('Calendar', Calendar).component('NextDatePicker',NextDatePicker).component('DatePicker', DatePicker).component('fon t-awesome-icon', FontAwesomeIcon).mount('#app')