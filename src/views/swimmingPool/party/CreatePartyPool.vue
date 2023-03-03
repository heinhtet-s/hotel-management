<template>
  <AdminSidebar>
    <Loading v-if="loadingActive" />

    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered border-0">
        <div class="modal-content border-0" style="
            border-radius: var(--border-radius);
          background-color: var(--background-color);
            color: var(--text-color);
          ">
          <div class="modal-header border-0">
            <h5 class="modal-title" id="exampleModalLabel">Create category</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <label for="" class="form-label">Name</label>
            <input type="text" class="form-control" v-model="categories.name" required />
          </div>
          <div class="modal-body">
            <label for="" class="form-label">Amount</label>
            <input type="text" class="form-control" v-model="categories.amount" required />
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="submitCategory">
              {{ $t('message.confirm') }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex align-items-center justify-content-between rounded mt-2">
      <div class="d-flex align-items-center rounded mt-2">
        <router-link :to="{ name: 'ListSwimmingPool' }" class="btn btn-sm me-2 fs-4" style="color: var(--primary)"><i
            class="fas fa-chevron-left"> </i> <span>{{ $t('message.create_party') }}</span>
        </router-link>
      </div>
      <div class="
          category-box
          d-lg-flex
          justify-content-between
          align-items-center
        ">
        <div></div>
        <div>
          <!-- <router-link
            :to="{ name: '' }"
            class="btn btn-lg ms-1 mb-2 p-1"
            style="color: var(--text-color); background-color: var(--btnLight)"
            >Party List</router-link
          > -->
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-around rounded mt-2">
      <form class="form col-12 col-lg-6" style="height: 95vh; overflow-y: scroll" @keydown.prevent.stop.enter
        @submit.prevent="submitSwimming">
        <!-- @submit.prevent="submitSwimming" -->
        <div class="row">
          <div class="col-12 col-lg-6 col-md-6 mb-2">
            <div class="d-flex align-items-center mt-4">
              <div class="w-100 form-floating">
                <select required class="form-select fs-6 form-control form-select-lg rounded"
                  style="border-radius: var(--border-radius) !important" aria-label=".form-select-sm example"
                  v-model="types" @change="onChange()">
                  <option v-for="category in swimmingPartyCategories" :value="{
                    amount: category.amount,
                    name: category.name,
                  }" :key="category.id">
                    {{ category.name }}
                  </option>
                </select>
                <label class="form-label">{{ $t('message.type') }}</label>
              </div>
            </div>
          </div>

          <div class="col-12 col-lg-6 col-md-6 mb-2">
            <div class="date-panel mt-4">
              <div class="d-flex align-items-center justify-content-center rounded">
                <input type="date" class="form-control me-1" @change="formatDate" required />
              </div>
            </div>
          </div>

          <div class="col-12 col-lg-6 col-md-6 mb-2">
            <div class="date-panel mt-4">
              <div class="d-flex align-items-center justify-content-center rounded">
                <input v-if="types.name === 'Section'" type="time" id="sTime" class="form-control me-1"
                  placeholder="Start" @change="onTimeChangeStart" required />
              </div>
            </div>
          </div>

          <div class="col-12 col-lg-6 col-md-6 mb-2">
            <div class="date-panel mt-4">
              <div class="d-flex align-items-center justify-content-center rounded">
                <input v-if="types.name === 'Section'" type="time" id="eTime" class="form-control" placeholder="End"
                  @change="onTimeChangeEnd" required />
              </div>
            </div>
          </div>

          <div class="col-12 col-lg-6 col-md-6 mb-2">
            <div class="form-floating mb-3 mt-4">
              <input type="text" required class="form-control" id="name-input" placeholder="" v-model="name" />
              <label for="name-input">{{ $t('message.name') }}</label>
            </div>
          </div>

          <div class="col-12 col-lg-6 col-md-6 mb-2">
            <div class="form-floating mb-3 mt-4">
              <input type="text" required class="form-control" id="name-input" placeholder="" v-model="phone" />
              <label for="name-input">{{ $t('message.phone') }}</label>
            </div>
          </div>
          <div class="col-12 col-lg-6 col-md-6 mb-2">
            <div class="form-floating mb-3 mt-4">
              <input type="text" required class="form-control" id="name-input" placeholder="" v-model="address" />
              <label for="name-input">{{ $t('message.address') }}</label>
            </div>
          </div>

          <div class="col-12 col-lg-6 col-md-6 mb-2">
            <div class="form-floating mb-3 mt-4">
              <input type="text" class="form-control" id="name-input" placeholder="" v-model="nrc" />
              <label for="name-input">NRC (optional)</label>
            </div>
          </div>

          <div class="col-12 col-lg-6 col-md-6 mb-2">
            <div class="mt-4">
              <label for="name-input">{{ $t('message.price') }} = </label>

              <input type="text" disabled required class="border-0" id="name-input" placeholder=""
                v-model="types.amount" />
              <!-- v-model="getFinalTotal" -->

            </div>
          </div>

          <div class="position-sticky shadow-sm bottom-0 mt-5" style="background-color: var(--background-color)">
            <button type="submit" class="btn w-100 my-2 text-white mx-auto" style="background-color: var(--primary)"
              v-print="'#printcontent'">
              {{ $t('message.confirm') }}
            </button>
          </div>
        </div>
      </form>

      <!----------Voucher  -->
      <div style="display: block">
        <div class="voucher-box">
          <div class="bg-white p-2 text-black py-3 px-3" style="font-size: 12px; min-width: 500px" id="printcontent">
            <div class="d-flex fw-bold align-items-center mb-2">
              <img :src="shopInfo.profileUrl" class="rounded me-2" width="150" height="150"
                v-if="showLogo === 'true'" />
              <div class="mt-1 d-flex flex-column w-100 px-2"
                :class="showLogo === 'true' ? 'text-start' : 'text-center'">
                <span class="fs-5 fw-bolder">360 Swimming Pool Party Vouncher
                </span>
                <span class="my-1">{{ shopInfo.address }}</span>
                <span><i class="fas fa-square-phone-flip"></i>
                  {{ shopInfo.phone }}</span>
              </div>
            </div>

            <div class="d-flex justify-content-between align-items-center">
              <div class="
                  text-start
                  fw-bold
                  d-flex
                  flex-column
                  pt-1
                  voucher-list-solid
                ">
                <span class="mb-1">{{ $t("message.voucher_no") }}
                  {{ vouncherId }}
                </span>

                <span class="mb-1">Selected Date:
                  {{ selectedDate }}
                </span>
                <span class="mb-1">Current Date:
                  {{ currentDay }}
                </span>
              </div>

              <div class="
                  text-start
                  fw-bold
                  d-flex
                  flex-column
                  pt-1
                  voucher-list-solid
                ">
                <span class="mb-1">Name :
                  {{ name }}
                </span>

                <span class="mb-1">Phone :
                  {{ phone }}
                </span>
              </div>
            </div>

            <div>
              <div class="d-flex fw-bold py-1 voucher-list-top" style="
                  border-bottom: 2px dotted black !important;
                  border-right: 0 !important;
                  border-left: 0 !important;
                  border-top: 0 !important;
                "></div>
              <div class="d-flex justify-content-between fw-bold text-start">
                <p class="">Type</p>
                <p class="text-start">{{ types.name }}</p>
              </div>
              <div class="d-flex justify-content-between fw-bold text-start " v-if="types.name === 'Section'">
                <p class="">Start Time</p>
                <p class="">{{ startTime }}</p>
              </div>
              <div class="d-flex justify-content-between fw-bold" v-if="types.name === 'Section'">
                <p class="text-start">End Time</p>
                <p class="text-start">{{ endTime }}</p>
              </div>
              <div class="d-flex justify-content-between fw-bold" v-if="types.name === 'Section'">
                <p class="text-start">Total Time</p>
                <p class="text-start">{{ totalTime }}</p>
              </div>
              <div class="d-flex justify-content-between fw-bold">
                <p class="text-start">Price</p>
                <p class="text-start">
                  {{ Number(types.amount).toLocaleString() }} Ks
                </p>
              </div>
              <div class="py-1" style="
                  border-bottom: 2px dotted black !important;
                  border-right: 0 !important;
                  border-left: 0 !important;
                  border-top: 0 !important;
                "></div>
              <div class="d-flex justify-content-between fw-bold">
                <p class="text-start">SubTotal</p>
                <p class="text-start">
                  {{ parseInt(getFinalTotal).toLocaleString() }} Ks
                </p>
              </div>
            </div>

            <div class="px-1 flex-column">
              <!-- <div
                class="d-flex fw-bold py-1 voucher-list-top"
                style="
                  border-bottom: 2px dotted black !important;
                  border-right: 0 !important;
                  border-left: 0 !important;
                  border-top: 0 !important;
                "
              ></div> -->

              <div class="text-center">
                <p class="fw-bold">{{ $t("message.thank") }}</p>

                <p class="mt-1">Power by Light Idea Software Development</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- end Voucher -->
    </div>
  </AdminSidebar>
</template>
    
<script>
import AdminSidebar from "@/components/AdminSidebar";
import db from "@/config/FirebaseInit";
import Loading from "../../../components/Loading.vue";

export default {
  components: { AdminSidebar, Loading },
  data() {
    return {
      types: {
        name: "",
        amount: "",
      },

      name: "",
      phone: "",
      address: "",
      sectiontPrice: 0,
      allDayPrice: 0,

      nrc: "",
      selectedDate: "",
      selectedMonth: "",

      startTime: "",
      endTime: "",
      totalTime: 0,
      partyOnePrice: "",
      finalTotal: "",

      selectedPools: "",
      //category start
      categories: {
        amount: "",
        id: "",
        date: "",
      },
      categoryRef: "",
      vouncherId: "",
      //category end

      loadingActive: false,
    };
  },

  computed: {
    getFinalTotal: {
      get() {
        if (this.sectiontPrice && this.allDayPrice === 0) {
          return this.sectiontPrice * this.totalTime;
        } else {
          return this.allDayPrice;
        }
      },
    },

    cashierAcc() {
      return this.$store.getters.getCashierAcc;
    },

    showLogo() {
      return localStorage.getItem("showLogoImage");
    },

    swimmingPartyCategories() {
      return this.$store.getters.getAlLCategoriesSwimmingPoolParty;
    },

    owner() {
      return this.$store.getters.getShopOwner;
    },

    shopInfo() {
      return this.$store.getters.getShopInfo;
    },

    currentDateTime() {
      return this.$store.getters.getDateTime;
    },
    currentDay() {
      return this.$store.getters.getDay;
    },
    currentMonth() {
      return this.$store.getters.getMonth;
    },
    currentYear() {
      return this.$store.getters.getYear;
    },
  },

  async mounted() {
    this.categoryRef = await db
      .collection(this.owner.city)
      .doc(this.owner.shopId)
      .collection("SwimmingPoolPartyCategory")
      .doc();

    this.$store.dispatch("getAlLCategoriesSwimmingPoolParty", this.owner);
    this.$store.dispatch("getCashierAcc", this.owner);

    this.$store.dispatch("getDateTime");
    this.$store.dispatch("getDay");
    this.$store.dispatch("getMonth");
    this.$store.dispatch("getYear");
    this.$store.dispatch("getShopInfo", this.owner);

  },

  methods: {
    onChange() {
      this.sectiontPrice = 0;
      this.allDayPrice = 0;

      if (this.types.name === "Section" && this.sectiontPrice === 0) {
        this.sectiontPrice = this.types.amount;
      }

      if (this.types.name === "AllDay" && this.allDayPrice === 0) {
        this.allDayPrice = this.types.amount;
      }
    },

    async submitSwimming() {
      this.vouncherId = this.generateVoucherId(3);

      try {
        let categoryRefAll = await db
          .collection(this.owner.city)
          .doc(this.owner.shopId)
          .collection("swimmingPoolVouchers")
          .doc();

        // let categoryRefSection = await db
        //   .collection(this.owner.city)
        //   .doc(this.owner.shopId)
        //   .collection("swimmingPoolVouchers")
        //   .doc();

        this.loadingActive = true;
        // console.log(this.types.name);

        // if (this.types.name == "AllDay") {
        if (this.endTime === "" && this.startTime === "") {
          await categoryRefAll
            .set({
              adultCount: 0,
              adultPrice: 0,
              childCount: 0,
              childPrice: 0,
              dateTime: this.currentDateTime,
              day: this.currentDay,
              selectedDay: this.selectedDate,

              endTime: "",
              startTime: "",
              totalTime: "",

              name: this.name,
              phone: this.phone,
              address: this.address,
              nrc: this.nrc,
              type: this.types.name,
              status: "party",

              id: categoryRefAll.id,
              month: this.selectedMonth, //to create selected month
              totalPrice: this.getFinalTotal,
              partyOnePrice: this.types.amount,
              voucherId: this.vouncherId, //voucher id
              year: this.currentYear,
            })
            .then(() => {
              (this.name = ""),
                (this.phone = ""),
                (this.address = ""),
                (this.nrc = ""),
                (this.types.name = ""),
                (this.sectiontPrice = ""),
                (this.loadingActive = false);
              console.log("Add Party Pool Swimming.");
              this.$router.back();
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          await categoryRefAll
            .set({
              adultCount: 0,
              adultPrice: 0,
              childCount: 0,
              childPrice: 0,
              dateTime: this.currentDateTime,
              day: this.currentDay,
              selectedDay: this.selectedDate,

              endTime: this.endTime,
              startTime: this.startTime,
              totalTime: this.totalTime,

              name: this.name,
              phone: this.phone,
              address: this.address,
              nrc: this.nrc,
              type: this.types.name,
              status: "party",

              id: categoryRefAll.id,
              month: this.selectedMonth, //to create selected month
              totalPrice: this.getFinalTotal,
              partyOnePrice: this.types.amount,
              voucherId: this.vouncherId, //voucher id
              year: this.currentYear,
            })
            .then(() => {
              (this.name = ""),
                (this.phone = ""),
                (this.address = ""),
                (this.nrc = ""),
                (this.types.name = ""),
                (this.sectiontPrice = ""),
                (this.loadingActive = false);
              console.log("Add Party Pool Swimming.");
              this.$router.back();

            })
            .catch((error) => {
              console.log(error);
            });
        }

        // if (this.types.name == "Section") {
        //   await categoryRefSection
        //     .set({
        //       adultCount: 0,
        //       adultPrice: 0,
        //       childCount: 0,
        //       childPrice: 0,
        //       dateTime: this.currentDateTime,
        //       day: this.currentDay,
        //       selectedDay: this.selectedDate,

        //       endTime: this.endTime,
        //       startTime: this.startTime,
        //       totalTime: this.totalTime,
        //       name: this.name,
        //       phone: this.phone,
        //       address: this.address,
        //       nrc: this.nrc,
        //       type: this.types.name,
        //       status: "party",

        //       id: categoryRefSection.id,
        //       month: this.selectedMonth, //to create selectedMonth
        //       totalPrice: this.getFinalTotal,
        //       partyOnePrice: this.types.amount,
        //       voucherId: this.vouncherId,
        //       year: this.currentYear,
        //     })
        //     .then(() => {
        //       (this.name = ""),
        //         (this.phone = ""),
        //         (this.address = ""),
        //         (this.nrc = ""),
        //         (this.types.name = ""),
        //         (this.sectiontPrice = ""),
        //         (this.loadingActive = false);
        //       console.log("Add Party Pool Swimming.");
        //     })
        //     .catch((error) => {
        //       console.log(error);
        //     });
        // }

        this.loadingActive = false;
      } catch (error) {
        console.log(error);
      }
    },

    onTimeChangeStart() {
      var inputEle = document.getElementById("sTime");

      var timeSplit = inputEle.value.split(":"),
        hours,
        minutes,
        meridian;
      hours = timeSplit[0];
      minutes = timeSplit[1];

      if (hours > 12) {
        meridian = "PM";
        hours -= 12;
      } else if (hours < 12) {
        meridian = "AM";
        if (hours == 0) {
          hours = 12;
        }
      } else {
        meridian = "PM";
      }
      this.startTime = hours + ":" + minutes + " " + meridian;
      // alert( hours + ":" + minutes + ":" +  meridian);

      //how many hours
      let sTime = document.getElementById("sTime").value,
        eTime = document.getElementById("eTime").value;

      if (sTime && eTime) {
        let diff = toSeconds(eTime) - toSeconds(sTime);
        if (diff < 0) diff = 86400 + diff; // adding because diff is negative
        console.log("time difference is : " + fromSeconds(diff));
        console.log("diff", diff);

        this.totalTime = fromSeconds(diff);
      }

      function toSeconds(time) {
        let splitTime = time.split(":");
        return splitTime[0] * 3600 + splitTime[1] * 60;
      }

      function fromSeconds(secs) {
        let hours = parseInt(secs / 3600);
        // seconds = parseInt(secs % 3600)
        // minutes = parseInt(seconds / 60);
        // return hours + "hours : " + minutes + "minutes ";
        return hours;
      }
    },

    onTimeChangeEnd() {
      var inputEle = document.getElementById("eTime");
      var timeSplit = inputEle.value.split(":"),
        hours,
        minutes,
        meridian;
      hours = timeSplit[0];
      minutes = timeSplit[1];
      if (hours > 12) {
        meridian = "PM";
        hours -= 12;
      } else if (hours < 12) {
        meridian = "AM";
        if (hours == 0) {
          hours = 12;
        }
      } else {
        meridian = "PM";
      }
      this.endTime = hours + ":" + minutes + " " + meridian;
      // alert( hours + ":" + minutes + " " + meridian);

      //how many hours
      let sTime = document.getElementById("sTime").value,
        eTime = document.getElementById("eTime").value;

      if (sTime && eTime) {
        let diff = toSeconds(eTime) - toSeconds(sTime);
        if (diff < 0) diff = 86400 + diff; // adding because diff is negative
        // console.log("time difference is : " + fromSeconds(diff));
        // console.log("diff", diff)

        this.totalTime = fromSeconds(diff);
      }

      function toSeconds(time) {
        let splitTime = time.split(":");
        return splitTime[0] * 3600 + splitTime[1] * 60;
      }

      function fromSeconds(secs) {
        let hours = parseInt(secs / 3600);
        // seconds = parseInt(secs % 3600)
        // minutes = parseInt(seconds / 60);
        // return hours + "hours : " + minutes + "minutes ";
        return hours;
      }
    },

    hoursDiff() {
      let sTime = document.getElementById("sTime").value,
        eTime = document.getElementById("eTime").value;
      console.log("s", sTime);

      if (sTime && eTime) {
        let diff = toSeconds(eTime) - toSeconds(sTime);
        if (diff < 0) diff = 86400 + diff; // adding because diff is negative
        console.log("time difference is : " + fromSeconds(diff));
      }

      function toSeconds(time) {
        let splitTime = time.split(":");
        return splitTime[0] * 3600 + splitTime[1] * 60;
      }

      function fromSeconds(secs) {
        let hours = parseInt(secs / 3600),
          seconds = parseInt(secs % 3600),
          minutes = parseInt(seconds / 60);
        return hours + "hours : " + minutes + "minutes ";
      }

      // let time = new Date(e.target.value);
      // // var time = new Date();
      // var d = new Date();
      // d.toLocaleString(); // -> "2/1/2013 7:37:08 AM"
      // d.toLocaleDateString(); // -> "2/1/2013"
      // d.toLocaleTimeString();

      // console.log(
      //   time.toLocaleString("en-US", {
      //     hour: "numeric",
      //     minute: "numeric",
      //     hour12: true,
      //   })
      // );

      // const dtfs = new Intl.DateTimeFormat("en", {
      //   hour: "numeric",
      //   minute: "numeric",
      //   second: "numeric",
      // });
      // this.startTime = dtfs.format(dates);

      // let date = new Date(e.target.value);
      // const dtf = new Intl.DateTimeFormat("en", {
      //   hour: "numeric",
      //   minute: "numeric",
      //   second: "numeric",
      // });
      // this.endTime = dtf.format(date);
    },

    formatTimeEnd(e) {
      let date = new Date(e.target.value);
      const dtf = new Intl.DateTimeFormat("en", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      });
      this.endTime = dtf.format(date);
    },

    formatDate(e) {
      let date = new Date(e.target.value);
      let year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(
        date
      );
      let month = new Intl.DateTimeFormat("en", { month: "short" }).format(
        date
      );
      let day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);
      // return  day+"-"+month+"-"+year;
      let payload = day + "-" + month + "-" + year;
      this.selectedMonth = month + "-" + year;
      this.selectedDate = payload;
      //   this.dateType='day';
      //   this.getVoucher();
    },

    generateVoucherId(padNumber) {
      const date = new Date();
      let day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);
      let twoDigitMonth = new Intl.DateTimeFormat("en", {
        month: "2-digit",
      }).format(date);
      let twoDigitYear = date.getFullYear().toString().slice(-2);
      let vId = "";
      vId =
        this.shopInfo.shopCode +
        this.cashierAcc.accountCode +
        twoDigitYear +
        twoDigitMonth +
        day +
        padNumber.toString().padStart(5, "0");
      return vId;
    },
  },
};
</script>
    
<style scoped>

</style>