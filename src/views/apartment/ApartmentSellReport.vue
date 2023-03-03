<template>
  <admin-sidebar>
    <Loading v-if="loadingActive" />
    <div class="">
      <div
        class="pb-1"
          style="
          position: sticky;
          z-index: 1000;
          top: 0px;
          background-color: var(--background-color);
        "
      >
        <div
          class="d-lg-flex d-md-flex align-items-center rounded justify-content-between mb-2"
        >
          <div class="d-flex align-items-center">
            <button
              @click="this.$router.back()"
              style="color: var(--text-color)"
              class="btn border-0 float-start"
            >
              <i class="fas fa-chevron-left"> </i>
            </button>
            <router-link
              class="fs-5 p-1 mb-1 text-decoration-none"
              style="color: var(--text-color) !important"
              :class="
                $route.name === 'ApartmentSellReport' ? 'route-active' : ''
              "
              :to="{ name: 'ApartmentSellReport' }"
            >
              {{ $t('message.invoices') }}</router-link
            >
            <span class="fs-5 mb-1 mx-1" style="color: var(--primary)">|</span>
            <router-link
              class="fs-5 mb-1 p-1 text-decoration-none"
              style="color: var(--text-color) !important"
              :class="
                $route.name === 'ApartmentProductSellReport'
                  ? 'route-active'
                  : ''
              "
              :to="{ name: 'ApartmentProductSellReport' }"
            >
              {{ $t('message.sell_report') }}
            </router-link>
          </div>
          <div
            class="btn-group p-1"
            role="group"
            aria-label="Basic radio toggle button group"
          >
            <input
              type="radio"
              class="btn-check"
              @click="showDaily"
              name="btnradio"
              id="btnradio1"
              autocomplete="off"
              checked
            />
            <label
              class="btn check-btn"
              :class="dateType === 'day' ? 'btn-primary' : ''"
              for="btnradio1"
              >{{ $t('message.daily') }}</label
            >

            <input
              type="radio"
              class="btn-check"
              @click="showMonthly"
              name="btnradio"
              id="btnradio2"
              autocomplete="off"
            />
            <label
              class="btn check-btn"
              :class="dateType === 'month' ? 'btn-primary' : ''"
              for="btnradio2"
              >{{ $t('message.monthly') }}</label
            >

            <input
              type="radio"
              class="btn-check"
              @click="showYearly"
              name="btnradio"
              id="btnradio3"
              autocomplete="off"
            />
            <label
              class="btn check-btn"
              :class="dateType === 'year' ? 'btn-primary' : ''"
              for="btnradio3"
              >{{ $t('message.yearly') }}</label
            >
          </div>
        </div>
        <div class="">
          <div
            class="d-flex flex-lg-row flex-column justify-content-lg-between px-2"
          >
            <div class="d-flex">
              <div
                class="d-flex p-1 mb-1"
                style="
                  background-color: var(--light);
                  border-radius: var(--border-radius);
                "
              >
                <span
                  class="badge my-1 d-flex align-items-center me-1"
                  style="
                    background-color: var(--discountPrimary);
                    border-radius: var(--border-radius);
                  "
                  >{{ invoices.length }}</span
                >
                <span class="d-flex align-items-center"
                  >{{ income.toLocaleString() }} Ks</span
                >
              </div>
              <div class="d-flex align-items-center ms-2">
                <input
                  type="text"
                  class="form-control"
                  v-model="search"
                  :placeholder="$t('message.enter_voucher_id')"
                />
              </div>
            </div>
            <div class="date-panel">
              <div class="d-flex align-items-center rounded">
                <input
                  type="date"
                  @change="formatDate"
                  class="form-control"
                  v-if="dateType === 'day'"
                />
                <input
                  v-if="dateType === 'month'"
                  type="month"
                  @change="filterMonth"
                  class="form-control border-1 border-secondary"
                  style="
                    background-color: var(--white) !important;
                    border: 1px solid gray !important;
                  "
                />
                <NextDatePicker
                  v-if="dateType === 'year'"
                  v-model="selectedYear"
                  class="border-1 border-secondary"
                  @change="yearChange"
                  type="year"
                  placeholder="Select year"
                ></NextDatePicker>
                <select
                  class="form-select border-0 form-control bg-light mx-1"
                  @change="onChangeApartment($event)"
                  aria-label="Default select example"
                >
                  <!-- :disabled="cashier.accountLevel !== 'admin'" -->
                  <option value="All">All Room</option>
                  <option
                    :value="apartment.id"
                    v-for="apartment in apartments"
                    :selected="id === 0"
                    :key="apartment.id"
                  >
                    {{ apartment.name }}
                  </option>
                </select>
                <vue-excel-xlsx
                  :data="filterExportData"
                  :columns="columns"
                  :file-name="fileName"
                  :file-type="'xlsx'"
                  :sheet-name="fileName"
                  class="btn btn-success ms-2 d-flex align-items-center border-success border-2"
                >
                  <i class="fas fa-file-excel"></i><span class="ms-1"></span>
                </vue-excel-xlsx>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="mt-3 mb-2 border-bottom border-1"
        style="height: 70vh; overflow-y: scroll"
      >
        <table class="table table-striped">
          <thead>
            <tr class="border-bottom-0">
              <th class="text-nowrap text-start">
                {{ $t('message.room') }}
              </th>
              <th class="text-nowrap text-center">
                {{ $t('message.voucher_no') }}
              </th>
              <th class="text-nowrap text-start">
                {{ $t('message.name') }}
              </th>
              <!--              <th class="text-nowrap text-center">{{ $t('message.sold_items') }}</th>-->
              <th class="text-nowrap text-end">{{ $t('message.total') }}</th>
              <th class="text-nowrap text-center">{{ $t('message.date') }}</th>
              <th class="text-nowrap text-center">
                {{ $t('message.control') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(order, index) in filterInvoices"
              :key="index"
              class="align-middle"
            >
              <td class="text-start">
                {{ order.apartmentName }}
              </td>
              <td class="text-nowrap text-center">
                {{ order.voucherId }}
              </td>
              <td class="text-nowrap text-start">
                {{ order.customerName || 'Unknown' }}
              </td>

              <td class="text-nowrap text-end">
                {{ parseInt(order.totalPrice).toLocaleString() }} Ks
              </td>
              <td class="text-nowrap text-center">
                <span> {{ order.checkoutTime }}</span
                ><br />
                <span style="color: var(--secondary); font-size: 12px">{{
                  order.note
                }}</span>
              </td>
              <td class="text-nowrap text-center">
                <router-link
                    style="
                    background-color: var(--secondary);
                    border-radius: var(--border-radius);
                  "
                  :to="{
                    name: 'ApartmentSellReportDetail',
                    query: {
                      voucher_id: order.voucherId,
                    },
                  }"
                  class="btn border-0 btn-sm me-1 text-light"
                  ><i class="fas fa-info-circle"></i>
                  {{ $t('message.details') }}</router-link
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="invoices.length > perPage">
        <pagination
          :totalPages="pageCount"
          :perPage="perPage"
          :currentPage="currentPage"
          :pages="invoices"
          @pagechanged="onPageChange"
        />
      </div>
    </div>
  </admin-sidebar>
</template>

<script>
import db from '@/config/FirebaseInit';
import AdminSidebar from '@/components/AdminSidebar';
import Loading from '@/components/Loading';
import Pagination from '@/components/Pagination';
export default {
  components: { AdminSidebar, Loading, Pagination },
  data() {
    return {
      //pagination
      selectedApartment: 'All',
      currentPage: 0,
      perPage: 10,
      //end pagination
      filterData: [],
      selectedDate: '',
      fileName: '',
      search: '',
      selectedYear: '',
      showVCalendar: false,
      dateType: 'day',
      totalPrice: 0,
      income: 0,
      costPerItem: [0],
      days: [],
      loadingActive: false,
      limit: 50,
      invoices: [],
      searchInvoices: [],
      selectedProduct: '',
      user: '',
      columns: [
        {
          label: 'Voucher Id',
          field: 'voucher-id',
        },
        {
          label: 'Room',
          field: 'sellType',
        },

        {
          label: 'Item List',
          field: 'orderItems',
        },
        {
          label: 'Count List',
          field: 'orderCounts',
        },
        {
          label: 'Price List',
          field: 'orderPrices',
        },
        {
          label: 'Total Price',
          field: 'totalPrice',
        },

        {
          label: 'Date',
          field: 'date',
        },
        {
          label: 'Note',
          field: 'note',
        },
        {
          label: 'Customer Name',
          field: 'customerName',
        },
        {
          label: 'Customer Phone',
          field: 'customerPhone',
        },
      ],
    };
  },

  computed: {
    cashier() {
      return this.$store.getters.getCashierAcc;
    },
    kitchens() {
      return this.$store.getters.getKitchens;
    },
    pageCount() {
      return Math.ceil(this.invoices.length / this.perPage);
    },

    offsetCount() {
      return this.currentPage * this.perPage;
    },
    showName() {
      return localStorage.getItem('showCustomerName');
    },
    showPhone() {
      return localStorage.getItem('showCustomerPhone');
    },
    owner() {
      return this.$store.getters.getShopOwner;
    },
    shopInfo() {
      return this.$store.getters.getShopInfo;
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

    apartments() {
      return this.$store.getters.getAllApartments;
    },

    filterInvoices() {
      let filterInv = [];
      if (this.search !== '') {
        filterInv = this.invoices.filter((inv) =>
          inv.voucherId.toLowerCase().includes(this.search.toLowerCase())
        );
        return filterInv.slice(
          this.offsetCount,
          this.offsetCount + this.perPage
        );
      } else {
        return this.invoices.slice(
          this.offsetCount,
          this.offsetCount + this.perPage
        );
      }
    },
    dates() {
      return this.days.map((day) => day.date);
    },
    attributes() {
      return this.dates.map((date) => ({
        highlight: true,
        dates: date,
      }));
    },
    filterExportData() {
      if (this.selectedApartment !== 'All') {
        let filterInv = this.filterData.filter(
          (inv) => inv.apartmentId === this.apartmentId
        );

        console.log('fileter >', filterInv);
        return filterInv;
      } else {
        return this.filterData;
      }
    },
  },
  async mounted() {
    this.$store.dispatch('getDay');
    this.$store.dispatch('getMonth');
    this.$store.dispatch('getYear');
    this.fileName = this.currentDay + '-invoices';
    this.$store.dispatch('getShopInfo', this.owner);
    this.$store.dispatch('getCashier', this.owner);
    this.$store.dispatch('fetchKitchens', this.owner);
    this.selectedDate = this.currentDay;
    await this.$store.dispatch('getCurrentShop');

    this.selectedSellType = this.cashier.accountCode;
    this.dateType = this.$route.params.date_type;
    await this.getVoucher();
  },
  methods: {
    onPageChange(page) {
      console.log(page);
      this.currentPage = page;
    },

    async onChangeApartment(e) {
      this.search = '';
      this.selectedApartment = e.target.value;
      await this.getVoucher();
    },

    addToFilterOrders(doc) {
      const exportData = {
        'voucher-id': doc.voucherId,
        room: doc.apartmentName,
        orderItems: doc.nameList.join(),
        orderCounts: doc.countList.join(),
        orderPrices: doc.sellPriceList.join(),
        totalPrice: doc.totalPrice,
        date: doc.checkoutTime,
        note: doc.note ? doc.note : '',
        customerName: doc.customerName,
        customerPhone: JSON.stringify(doc.customerPhone),
      };
      this.filterData.push(exportData);
      //console.log(this.filterData)
    },

    async yearChange() {
      let date = new Date(this.selectedYear);
      this.selectedDate = new Intl.DateTimeFormat('en', {
        year: 'numeric',
      }).format(date);
      this.fileName = this.selectedDate + '-sell-report';
      this.dateType = 'year';
      await this.getVoucher();
    },
    async showDaily() {
      this.currentPage = 0;
      this.dateType = 'day';
      this.selectedDate = this.currentDay;
      this.fileName = this.selectedDate + '-daily-sell-report';
      await this.getVoucher();
    },
    async showMonthly() {
      this.currentPage = 0;
      this.dateType = 'month';
      this.selectedDate = this.currentMonth;
      this.fileName = this.selectedDate + '-monthly-sell-report';
      await this.getVoucher();
    },
    async showYearly() {
      this.currentPage = 0;
      this.dateType = 'year';
      this.selectedDate = this.currentYear;
      this.fileName = this.selectedDate + '-yearly-sell-report';
      await this.getVoucher();
    },
    async getVoucher() {
      this.invoices = [];
      this.income = 0;
      this.filterData = [];
      if (this.selectedApartment === 'All') {
        await db
          .collection(this.owner.city)
          .doc(this.owner.shopId)
          .collection('apartmentVouchers')
          .where(this.dateType, '==', this.selectedDate)
          .orderBy('time', 'desc')
          .onSnapshot((snapshot) => {
            snapshot.forEach((doc) => {
              this.invoices.push(doc.data());
              this.income += parseInt(doc.data().totalPrice);
              this.addToFilterOrders(doc.data());
            });

            this.$router.replace({
              name: 'ApartmentSellReport',
              params: {
                date_type: this.dateType,
                selected_date: this.selectedDate,
              },
            });
          });
      } else {
        await db
          .collection(this.owner.city)
          .doc(this.owner.shopId)
          .collection('apartmentVouchers')
          .where(this.dateType, '==', this.selectedDate)
          .where('apartmentId', '==', this.selectedApartment)
          .orderBy('time', 'desc')
          .onSnapshot((snapshot) => {
            snapshot.forEach((doc) => {
              this.invoices.push(doc.data());
              this.income += parseInt(doc.data().totalPrice);
              this.addToFilterOrders(doc.data());
            });

            this.$router.replace({
              name: 'ApartmentSellReport',
              params: {
                date_type: this.dateType,
                selected_date: this.selectedDate,
              },
            });
          });
      }
    },

    async filterMonth(e) {
      let date = new Date(e.target.value);
      let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(
        date
      );
      let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(
        date
      );
      this.selectedDate = month + '-' + year;
      console.log(this.selectedDate);
      this.fileName = this.selectedDate + '-sell-report';
      this.dateType = 'month';
      await this.getVoucher();
    },

    formatDate(e) {
      let date = new Date(e.target.value);
      let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(
        date
      );
      let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(
        date
      );
      let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
      // return  day+"-"+month+"-"+year;
      let payload = day + '-' + month + '-' + year;
      this.selectedDate = payload;
      this.dateType = 'day';
      this.getVoucher();
    },

    viewDetails(apartment) {
      this.costPerItem = [];
      this.selectedProduct = apartment;
      this.totalPrice = 0;
      //console.log(this.selectedProduct)
      for (let i = 0; i < this.selectedProduct.countList.length; i++) {
        this.costPerItem.push(
          parseInt(this.selectedProduct.sellPriceList[i]) *
            parseInt(this.selectedProduct.countList[i])
        );
      }
      this.costPerItem.forEach((price) => {
        this.totalPrice += parseInt(price);
      });
    },
  },
};
</script>

<style scoped>
/*.date-box{*/
/*  right: 100px;*/
/*  top:150px;*/
/*}*/

tr,
th,
td {
  border: 1px solid var(--light) !important;
  color: var(--text-color);
  cursor: pointer;
}
ol,
ul {
  list-style-type: none;
  padding: 0;
  color: var(--text-color);
}
.main-list li {
  color: var(--text-color) !important;
  text-align: start;
  font-size: 12px;
  height: 20px;
  background-color: var(--light);
  border-radius: var(--border-radius);
  color: var(--dark);
  margin: 2px;
  display: flex;
  padding: 2px;
}

.voucher-list {
  border-top: 2px dashed black;
}
.check-btn {
  width: 80px !important;
}
.btn-group {
  width: 35%;
}
.btn-group .btn {
  border-radius: 0px !important;
}
.btn-check {
  border-radius: var(--border-radius) !important;
}
.btn {
  border: 2px solid var(--primary);
  box-shadow: none !important;
  outline: none !important;
}

.btn-primary {
  background-color: var(--primary) !important ;
  border: none !important;
  color: white;
}
thead,
tbody {
  border: 1px solid var(--softPrimary) !important;
  color: var(--dark);
}

.date-panel {
  width: 35%;
}
.route-active {
  border-bottom: 2px solid var(--primary);
}

@media only screen and (max-width: 1030px) {
  .date-box {
    left: 10px;
    top: 210px;
  }
}
@media only screen and (max-width: 500px) {
  .date-panel {
    width: 100%;
  }
  .btn-group {
    width: 100%;
  }
  .date-box {
    left: 10px;
    top: 252px;
  }
}

.item-header fixed-top {
  border-bottom: 2px solid var(--light);
}
.item-header fixed-top span {
  width: 20%;
  color: var(--primary);
  font-weight: bolder;
  height: 40px;
  border-radius: var(--border-radius);
  padding-left: 10px;
  margin: 10px 5px;
}
.item-row {
  border-bottom: 2px solid var(--light);
}
.item-row span {
  width: 20%;
  height: 40px;
  border-right: 2px solid var(--light);
  padding-left: 10px;
  margin: 10px 5px;
}

.user {
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 2px solid var(--light);
}
.user span {
  border-right: 2px solid var(--light);
  border-right: 2px solid var(--light);
  padding-left: 10px;
}
</style>
