<template>
  <main>
    <Loading v-if="loadingActive" />
    <admin-sidebar>
      <div>
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
                class="fs-5 mb-1 text-decoration-none p-1"
                style="color: var(--text-color) !important"
                :class="
                  $route.name === 'ApartmentSellReport' ? 'route-active' : ''
                "
                :to="{
                  name: 'ApartmentSellReport',
                  params: { date_type: 'day', selected_date: currentDay },
                }"
              >
                {{ $t('message.invoices') }}</router-link
              >
              <span class="fs-5 mb-1 mx-1">|</span>
              <router-link
                class="fs-5 mb-1 text-decoration-none p-1"
                style="color: var(--text-color) !important"
                :class="
                  $route.name === 'ApartmentProductSellReport'
                    ? 'route-active'
                    : ''
                "
                :to="{ name: 'ApartmentProductSellReport' }"
                >{{ $t('message.sell_report') }}
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
            </div>
          </div>
          <div class="">
            <div class="d-flex justify-content-between px-2">
              <div
                class="d-flex p-1 mb-1"
                style="
                  background-color: var(--light);
                  border-radius: var(--border-radius);
                "
              >
                <span
                  class="badge me-1"
                  style="
                    background-color: var(--discountPrimary);
                    border-radius: var(--border-radius);
                  "
                  >{{ finalProducts.length }}</span
                >
                <span class="">{{ income.toLocaleString() }} Ks</span>
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
                    v-else
                    type="month"
                    @change="filterMonth"
                    class="form-control border-0"
                    placeholder="choose month"
                  />
                  <vue-excel-xlsx
                    :data="filterExportData"
                    :columns="columns"
                    :file-name="fileName"
                    :file-type="'xlsx'"
                    :sheet-name="fileName"
                    class="btn btn-success ms-2 border-0"
                  >
                    <i class="fas fa-file-excel"></i>
                    <!--                    <span class="ms-1">{{ $t('message.export') }}</span>-->
                  </vue-excel-xlsx>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="table-responsive mt-2">
          <table class="table border-0 table-striped">
            <thead>
              <tr class="">
                <th class="text-nowrap">#</th>
                <th class="text-nowrap">{{ $t('message.sold_items') }}</th>
                <th class="text-nowrap">Buy {{ $t('message.price') }}</th>
                <th class="text-nowrap">Sell {{ $t('message.price') }}</th>
                <th class="text-nowrap">
                  {{ $t('message.count') }}
                </th>
                <th class="text-nowrap text-center">
                  {{ $t('message.total') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(product, index) in finalProducts"
                :key="index"
                class="align-middle"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              >
                <td class="text-nowrap">
                  {{ index + 1 }}
                </td>
                <td class="text-nowrap">
                  {{ product.name }}
                </td>
                <td class="text-nowrap">{{ product.buyPrice }} Ks</td>
                <td class="text-nowrap">{{ product.sellPrice }} Ks</td>
                <td class="text-nowrap">
                  {{ product.count }} {{ product.unit }}
                </td>
                <td class="text-nowrap text-center">
                  {{ product.totalPrice }} Ks
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </admin-sidebar>
  </main>
</template>

<script>
import db from '@/config/FirebaseInit';
import AdminSidebar from '@/components/AdminSidebar';
import Loading from '@/components/Loading';
export default {
  components: { Loading, AdminSidebar },
  data() {
    return {
      selectedDate: '',
      fileName: '',
      selectedSellType: 'All',
      search: '',
      selectedYear: '',
      showVCalendar: false,
      dateType: 'day',
      totalPrice: 0,
      income: 0,
      costPerItem: [0],
      days: [],
      loadingActive: false,
      orders: [],
      selectedProduct: '',
      user: '',
      columns: [
        {
          label: 'Product Id',
          field: 'id',
        },

        {
          label: 'Product Name',
          field: 'name',
        },
        {
          label: 'Count',
          field: 'count',
        },
        {
          label: 'Buy Price',
          field: 'buyPrice',
        },
        {
          label: 'Sell Price',
          field: 'sellPrice',
        },
        {
          label: 'Total Price',
          field: 'totalPrice',
        },
      ],

      productSellList: [],
      filterProductSellList: [],

      sellReports: [],
      sellProductLists: [],
      unitSellProductLists: [],
      filterSellProductLists: [],
      finalProducts: [],
    };
  },
  computed: {
    owner() {
      return this.$store.getters.getShopOwner;
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
      return this.finalProducts;
    },
  },
  async created() {
    this.$store.dispatch('getDay');
    this.$store.dispatch('getMonth');
    this.$store.dispatch('getYear');
    this.fileName = this.currentDay + '-orders';
    await this.$store.dispatch('getCurrentShop');
    // await this.getProduct();
    this.selectedDate = this.currentDay;
    await this.getSellReports();
  },
  methods: {
    async getSellReports() {
      this.finalProducts = [];
      this.sellReports = [];
      this.income = 0;
      // console.log(this.selectedDate)
      await db
        .collection(this.owner.city)
        .doc(this.owner.shopId)
        .collection('apartmentVouchers')
        .where(this.dateType, '==', this.selectedDate)
        .orderBy('time', 'desc')
        .onSnapshot(async (snapshot) => {
          snapshot.forEach((doc) => {
            this.sellReports.push(doc.data());
            if (snapshot.size === this.sellReports.length) {
              console.log(
                'length:',
                snapshot.size,
                '==',
                this.sellReports.length
              );
              console.log(snapshot.dateType);
              this.destructureProducts();
            }
          });
        });
    },

    destructureProducts() {
      this.sellProductLists = [];
      this.sellReports.forEach((doc, index) => {
        if (doc.productUnitList) {
          doc.productIdList.forEach((id, i) => {
            this.income += +doc.sellPriceList[i] * +doc.countList[i];
            this.sellProductLists.push({
              name: doc.nameList[i],
              sellPrice: doc.sellPriceList[i],
              buyPrice: doc.buyPriceList[i],
              count: doc.countList[i],
              id: id,
              unit: doc.productUnitList[i],
            });
          });
        } else {
          doc.productIdList.forEach((id, i) => {
            this.income += +doc.sellPriceList[i] * +doc.countList[i];
            this.sellProductLists.push({
              name: doc.nameList[i],
              count: parseInt(doc.countList[i]),
              id: id,
              sellPrice: doc.sellPriceList[i],
              buyPrice: doc.buyPriceList[i],
              unit: 'Pcs',
            });
          });
        }
        if (this.sellReports.length === index + 1) {
          //console.log('sell product list', this.sellProductLists)
          this.getProductWithUnit();
        }
      });
    },

    getProductWithUnit() {
      this.filterProductSellList = [];
      this.sellProductLists.forEach((item, i) => {
        if (
          this.filterProductSellList.some(
            (p) => p.id === item.id && p.unit === item.unit
          )
        ) {
          const duplicateIndex = this.filterProductSellList.findIndex((p) => {
            return p.id === item.id && p.unit === item.unit;
          });
          this.filterProductSellList[duplicateIndex].count =
            parseInt(this.filterProductSellList[duplicateIndex].count) +
            parseInt(item.count);
        } else {
          this.filterProductSellList.push({
            id: item.id,
            name: item.name,
            count: parseInt(item.count),
            unit: item.unit,
            sellPrice: item.sellPrice,
            buyPrice: item.buyPrice,
          });
        }
        if (this.sellProductLists.length === i + 1) {
          //console.log('filter list',this.filterProductSellList);
          this.finalFilterProduct();
        }
      });
    },

    finalFilterProduct() {
      this.filterProductSellList.forEach(async (product) => {
        if (this.finalProducts.some((p) => p.id === product.id)) {
          const duplicateId = this.finalProducts.findIndex((p) => {
            return p.id === product.id;
          });
          let sameIdProduct = this.finalProducts[duplicateId];
          sameIdProduct.data =
            sameIdProduct.data + ' | ' + product.count + ' ' + product.unit;
        } else {
          this.finalProducts.push({
            id: product.id,
            name: product.name,
            sellPrice: product.sellPrice,
            buyPrice: product.buyPrice,
            count: product.count,
            unit: product.unit,
            totalPrice: +product.sellPrice * +product.count,
          });
        }
      });
    },

    onChange(e) {
      this.search = '';
      this.selectedSellType = e.target.value;
      // //console.log(this.selectedSellType)
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
      this.dateType = 'month';
      console.log(this.selectedDate);
      //console.log(this.selectedDate);
      this.fileName = this.selectedDate + '-sell-report';
      await this.getSellReports();
    },

    async formatDate(e) {
      let date = new Date(e.target.value);
      let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(
        date
      );
      let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(
        date
      );
      let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
      this.selectedDate = day + '-' + month + '-' + year;
      this.dateType = 'day';
      await this.getSellReports();
    },

    async showDaily() {
      this.dateType = 'day';
      this.selectedDate = this.currentDay;
      this.fileName = this.selectedDate + '-daily-sell-report';
      await this.getSellReports();
    },
    async showMonthly() {
      this.dateType = 'month';
      this.selectedDate = this.currentMonth;
      this.fileName = this.selectedDate + '-monthly-sell-report';
      console.log(this.selectedDate);
      await this.getSellReports();
    },
  },
};
</script>

<style scoped>
.date-box {
  right: 20px;
  top: 150px;
}
tr,
td,
th {
  border: 1px solid var(--white) !important;
  color: var(--text-color) !important;
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
.check-btn {
  width: 80px !important;
}
.voucher-list {
  border-top: 2px dashed black;
}
.btn-group .btn {
  border-radius: 0px !important;
}
.btn-check {
}
.btn {
  border: 2px solid var(--primary);
  box-shadow: none !important;
  outline: none !important;
}
.check-btn:hover {
  background-color: var(--primary);
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
.btn-primary:focus {
  background-color: var(--primary) !important;
}
/*@media print {
     .hidden-print,
     .hidden-print * {
       display: none !important;
     }
   }*/
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
</style>
