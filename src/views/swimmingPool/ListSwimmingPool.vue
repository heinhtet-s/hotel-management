<template>
  <AdminSidebar>
    <Loading v-if="loadingActive" />
    <div class="">
      <div class="header-bar">
        <div class="d-flex align-items-center justify-content-between rounded mb-2">
          <div class="d-flex rounded align-items-center mt-2">
            <!-- <router-link
              :to="{ name: 'ListSwimmingPool' }"
              class="btn btn-lg ms-2"
              style="color: var(--text-color)"
              ><i class="fas fa-chevron-left"> </i
            ></router-link> -->
            <span class="fs-4">{{ $t('message.swimming_pool_report') }}</span>
          </div>
          <div class="btn-group p-1" role="group" aria-label="Basic radio toggle button group">
            <input @click="showDaily" type="radio" class="btn-check" name="btnradio" id="btnradio1" autocomplete="off"
              checked />
            <label class="btn check-btn btn-d-m" :class="dateType === 'day' ? 'btn-primary' : ''" for="btnradio1">{{
              $t("message.daily")
            }}</label>

            <input type="radio" class="btn-check" name="btnradio" id="btnradio2" autocomplete="off"
              @click="showMonthly" />
            <label class="btn check-btn btn-d-m" :class="dateType === 'month' ? 'btn-primary' : ''" for="btnradio2">{{
              $t("message.monthly")
            }}</label>
          </div>
        </div>

        <div class="
            d-flex
            category-box
            d-lg-flex
            justify-content-between
            align-items-center
            mb-3
          ">
          <div>
            <h5 class="d-inline">Total Price :</h5>
            <span> {{ Number(income).toLocaleString() }} Ks</span>
          </div>
          <div class="d-flex align-items-center justify-content-around">
            <select class="form-select me-2" style="
                border-radius: var(--border-radius) !important;
                min-width: 200px;
              " aria-label="Default select example" @change="onChange">
              <option selected>{{ $t('message.type') }}</option>
              <!-- <option value="all">All</option> -->
              <option value="single">Single</option>
              <option value="party">Party</option>
            </select>

            <div class="me-2">
              <input v-if="dateType === 'day'" type="date" class="form-control me-1" @change="formatDate" />
            </div>
            <div class="me-2">
              <input v-if="dateType === 'month'" type="month" class="form-control me-1" @change="monthChange" />
            </div>

            <router-link :to="{ name: 'CreateSwimmingPool' }" class="btn text-nowrap" style="
            color: var(--text-color);
                background-color: var(--green);
              "><i class="fas fa-plus-circle"></i> {{ $t('message.create_ticket') }} </router-link>
            <router-link :to="{ name: 'CreatePartyPool' }" class=" text-nowrap btn ms-1" style="
            color: var(--white);
              background-color: var(--primary);">
              <i class="fas fa-plus-circle me-1"></i>{{ $t('message.create_party') }}</router-link>
          </div>
        </div>
      </div>

      <div class="px-0 table-card table-responsive">
        <table class="table table-hover table-striped">
          <thead>
            <tr>
              <!-- <th class="text-nowrap">People Price</th> -->
              <th class="text-nowrap">{{ $t('message.ticket_id') }}</th>
              <th class="text-nowrap">{{ $t('message.type') }}</th>
              <th class="text-nowrap">{{ $t('message.people_count') }}</th>
              <th class="text-nowrap">{{ $t('message.type') }}</th>
              <th class="text-nowrap">{{ $t('message.date') }}</th>
              <th class="text-nowrap">{{ $t('message.total') }}</th>
              <th class="text-nowrap text-center">{{ $t('message.control') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr class="align-middle" v-for="pool in filterInvoices" :key="pool.id">
              <td class="text-nowrap">{{ pool.voucherId }}</td>
              <td class="text-nowrap">{{ pool.status }}</td>
              <!-- <td class="text-nowrap">
                {{ pool.adultPrice !== 0 ? pool.adultPrice : pool.childPrice }}
              </td> -->
              <td class="text-nowrap">
                {{ Number(pool.adultCount) + Number(pool.childCount) }}
              </td>
              <td class="text-nowrap">
                {{ pool.type ? pool.type : "-" }}
              </td>
              <td class="text-nowrap" v-if="pool.status === 'party'">
                {{
                  pool.selectedDay && pool.startTime
                    ? `${pool.startTime} - ${pool.endTime} / ${pool.selectedDay}`
                    : pool.selectedDay
                }}
              </td>
              <td class="text-nowrap" v-if="pool.status === 'single'">
                {{ pool.day }}
              </td>
              <td class="text-nowrap">{{ pool.totalPrice }}</td>

              <td class="text-nowrap text-center">
                <router-link class="btn btn-sm btn-primary me-2" :to="{
                  name: 'DetailSwimmingPool',
                  params: { id: pool.id },
                }">
                  <!-- <i class="fas fa-edit"></i> -->
                  <i class="fa-solid fa-circle-info"></i>
                  {{ $t('message.details') }}</router-link>
                <!-- <button
                  class="btn btn-sm btn-danger me-2"
                  @click="deleteSwimming(pool.id)"
                >
                  <i class="fa-sharp fa-solid fa-trash"></i> Delete
                </button> -->

                <router-link class="btn btn-sm btn-warning me-2" :to="{
                  name: 'EditSwimmingPool',
                  params: { id: pool.id },
                }"><i class="fas fa-edit"></i>{{ $t('message.edit') }}</router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- <div v-if="invoices.length > perPage"> -->
      <div v-if="filterInvoices.length !== 0">
        <pagination :totalPages="pageCount" :perPage="perPage" :currentPage="currentPage" :pages="invoices.length"
          @pagechanged="onPageChange" />
      </div>
    </div>
  </AdminSidebar>
</template>
      
<script>
import Loading from "@/components/Loading";
import AdminSidebar from "@/components/AdminSidebar";
import db from "../../config/FirebaseInit";
import Pagination from "@/components/Pagination";

export default {
  name: "ListSwimmingPool",
  components: { AdminSidebar, Loading, Pagination },
  data() {
    return {
      // page: 10,
      //pagination
      currentPage: 0,
      perPage: 10,
      //end pagination

      swimming: {
        typeAge: "",
        date: "",
      },
      invoices: [],
      income: 0,
      currentSetDay: "",

      selectedDate: "",
      selectedAll: "",

      // selectedMonth: "",
      dateType: "month",

      // swimmingPoolArray: [],

      categories: [],
      loadingActive: false,
      selectedId: "",

      newCategoryCount: "",
      newCategoryPrice: "",
      selectedCategory: "",
    };
  },

  watch: {},

  computed: {
    pageCount() {
      return Math.ceil(this.invoices.length / this.perPage);
    },

    offsetCount() {
      return this.currentPage * this.perPage;
    },

    swimmingPoolList() {
      return this.$store.getters.getAlLSwimmingPool;
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

    filterInvoices() {
      return this.invoices.slice(
        this.offsetCount,
        this.offsetCount + this.perPage
      );
    },
  },

  async created() { },

  async mounted() {

    // this.$store.dispatch("getAlLSwimmingPool", this.owner);
    // this.swimmingPoolArray = this.swimmingPoolList;
    this.dateType = 'day'
    this.selectedDate = this.currentDay;
    // this.selectedMonth = this.currentMonth;
    let yourDate = new Date();
    const dat = yourDate.toISOString().split("T")[0];
    this.currentSetDay = dat;

    // let date = new Date();
    //   let month = new Intl.DateTimeFormat("en", { month: "short" }).format(
    //     date
    //   );
    //   let year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(
    //     date
    //   );
    // this.selectedMonth = month + "-" + year;
    await this.getVouchers();
    console.log("this filter", this.filterInvoices)
  },

  methods: {
    onPageChange(page) {

      if (page < this.currentPage) {
        this.currentPage = page;
      } else if (page > this.currentPage) {
        this.currentPage = page - 1;
      }


    },

    async onChange(e) {
      if (e.target.value == "all") {
        this.selectedAll = "all";
      } else {
        this.dateType = "status";
        this.selectedDate = e.target.value;
      }
      // console.log("first" , this.selectedAll)

      await this.getVouchers();
    },

    async formatDate(e) {
      // this.selectedMonth = "";

      let date = new Date(e.target.value);
      let year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(
        date
      );
      let month = new Intl.DateTimeFormat("en", { month: "short" }).format(
        date
      );
      let day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);
      let payload = day + "-" + month + "-" + year;
      this.selectedDate = payload;
      await this.getVouchers();
    },

    async monthChange(e) {
      this.selectedDate = "";
      let date = new Date(e.target.value);
      let month = new Intl.DateTimeFormat("en", { month: "short" }).format(
        date
      );
      let year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(
        date
      );

      this.selectedDate = month + "-" + year;
      await this.getVouchers();
    },

    async showDaily() {
      // console.log("daily");
      this.dateType = "day";
      this.selectedDate = this.currentDay;
      await this.getVouchers();
    },

    async showMonthly() {
      // console.log("monthly");
      this.dateType = "month";
      // this.selectedMonth = this.currentMonth;
      this.selectedDate = this.currentMonth;
      await this.getVouchers();
    },

    async deleteSwimming(id) {
      console.log("id", id);
      this.loadingActive = true;

      await db
        .collection(this.owner.city)
        .doc(this.owner.shopId)
        .collection("swimmingPoolVouchers")
        .doc(id)
        .delete()
        .then(() => {
          this.loadingActive = false;
          console.log("delete is success");
          this.getVouchers();
          this.modalMessage = "Deleted Successfully";
        });
    },

    async getVouchers() {
      this.invoices = [];
      this.income = 0;
      await db
        .collection(this.owner.city)
        .doc(this.owner.shopId)
        .collection("swimmingPoolVouchers")
        .where(this.dateType, "==", this.selectedDate)
        .orderBy("dateTime", "desc")
        .onSnapshot((snapshot) => {
          snapshot.forEach((doc) => {
            // console.log("doc", doc.data());
            this.invoices.push(doc.data());
            this.income += parseInt(doc.data().totalPrice);
          });
          // this.$router.replace({
          //   name: "ListSwimmingPool",
          //   params: {},
          // });
          // console.log(
          //   "invoiceggggg",
          //   Number(Math.ceil((this.invoices.length) / this.perPage)) - 1
          // );
        });
    },
  },
};
</script>
<style scoped>
.btn-group {
  width: 35%;
}

.btn-group .btn {
  border-radius: 0px !important;
}

.btn-check {
  border-radius: var(--border-radius) !important;
}

/* .btn {
    border: 2px solid var(--primary);
    box-shadow: none !important;
    outline: none !important;
  } */

.btn-d-m {
  border: 2px solid var(--primary);
  box-shadow: none !important;
  outline: none !important;
}

.btn-primary {
  background-color: var(--primary) !important;
  border: none !important;
  color: white;
}
</style>