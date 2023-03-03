<template>
  <admin-sidebar v-if="cashierAcc.accountLevel !== 'admin'">
    <Loading v-if="loadingActive" />
    <InfoDialog v-if="infoModalActive" :modal-message="modalMessage" @close-modal="closeModal" />
    <TableReservationReminder v-if="showReservationReminder" :reservedInfo="nextReserveInfo"
      :reservedMenus="nextReserveMenus" @reserve="reserveNextReservation" @rject="rejectNextReservation"
      @close-modal="closeReservationReminder" />
    <ConfirmDialog :modal-message="modalMessage" v-if="confirmActive" @confirm="confirm" @cancel="cancel" />
    <RestRelationMenuDialog :selectedProduct="selectedProduct" :owner="owner" :selectedRelations="selectedRelations"
      v-if="showDialog" @confirm-modal="confirmMenuItem" @close-modal="closeDialog" />


    <div class="row" style="overflow-y: hidden">
      <!--        Table-->
      <div class="col-12 col-lg-3">
        <div class="section-header">
          <h3>{{$t('message.tables')}}</h3>
        </div>
        <div class="category-box">
          <ul class="text-start d-block list-unstyled border-0 align-center">
            <li v-for="(category, index) in filterTableCategories" :key="index" class="category-list d-inline-block"
              @click="selectTableCategory(category.name)">
              <span class="mx-2">{{ category.name }}</span>
              <div class="active-dot" :class="
                selectedTableCategory === category.name
                  ? 'category-list-active'
                  : ''
              "></div>
            </li>
          </ul>
        </div>

        <div class="product-box">
          <div class="row">
            <div class="col-6" v-for="product in filterTables.product" :key="product.id">
              <div class="card table-card" style="cursor: pointer" @click="chooseTable(product)">
                <div class="card-body" :class="selectedTable.id == product.id ? 'table-active' : ''">
                  <div class="d-flex flex-column align-items-center">
                    <p class="">{{ product.name }}</p>
                    <p :class="
                      product.categoryType === 'Free'
                        ? 'text-success'
                        : 'text-danger'
                    ">
                      {{ product.categoryType }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <pagination :totalPages="pageCountTable" :perPage="perPageTable" :currentPage="currentPageTable" :pages="tables"
          @pagechanged="onPageChangeTable" />
      </div>
      <!--      Menus-->
      <div class="col-12 col-lg-5">
        <div class="section-header justify-content-between">
          <div class="">
            <h3>{{$t('message.menu')}}</h3>
          </div>
          <div class="d-flex align-items-end p-1" style="
              background-color: var(--background-color);
              border-radius: var(--border-radius);
            ">
            <button class="btn" style="color: var(--text-color)">
              <i class="fas fa-search"></i>
            </button>
            <input type="text" ref="barcodeSearch" autofocus v-model="search" :placeholder="$t('message.search')"
              class="form-control border-0" @click="showSearchBoxHandler" />
          </div>
        </div>

        <!--            Category -->
        <div class="category-box">
          <ul class="text-start d-block list-unstyled border-0">
            <li class="d-inline-block mx-1 category-list" @click="selectCate('All')">
              <span class="mx-2"> All</span>
              <div class="active-dot" :class="
                selectedCategory === 'All' ? 'category-list-active' : ''
              "></div>
            </li>
            <li v-for="(category, index) in filterCategories" :key="index" class="category-list d-inline-block"
              @click="selectCate(category.name)">
              <span class="mx-2">{{ category.name }}</span>
              <div class="active-dot" :class="
                selectedCategory === category.name
                  ? 'category-list-active'
                  : ''
              "></div>
            </li>
          </ul>
        </div>

        <div class="product-box">
          <div class="row">
            <div class="col-4" v-for="(product, index) in filterProducts.product" :key="index"
              @click="selectForCart(product)">
              <div class="product-card text-center">
                <div class="">
                  <img :src="product.images[0]" v-if="product.images.length > 0" style="
                      width: 90%;
                      height: 120px;
                      border-radius: var(--border-radius) !important;
                    " alt="" />
                  <img src="../../assets/flash/1.png" v-else style="
                      opacity: 0.3;
                      width: 90%;
                      height: 120px;
                      border-radius: var(--border-radius) !important;
                    " alt="" />
                </div>
                <div class="badge d-flex justify-content-between align-items-center" style="
                    position: absolute;
                    top: 5px;
                    border-radius: var(--border-radius);
                    background-color: var(--secondary);
                    right: 5px;
                  ">
                  <span class="fw-bold">{{ product.stock }} Pcs</span>
                </div>
                <div class="ms-2 p-1 text-start" style="border-radius: var(--border-radius)">
                  <div class="d-flex text-start flex-column">
                    <div class="d-flex justify-content-between text-wrap align-items-start" style="height: 25px">
                      <span class="fw-bold" style="color: var(--text-color)">{{
                        product.itemName
                      }}</span>
                    </div>
                    <!--                    <span class="mt-3" style="font-size: 12px;color:var(&#45;&#45;text-color-light);">{{product.barcode}}</span>-->
                    <span class="mt-3" style="color: var(--primary)">{{
                      parseInt(product.sellPrice).toLocaleString()
                    }}
                      Ks</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <pagination :totalPages="pageCount" :perPage="perPage" :currentPage="currentPage" :pages="allProducts"
          @pagechanged="onPageChange" />
      </div>
      <!--          selected box-->
      <div class="col-12 col-lg-4 rounded">
        <div class="section-header justify-content-between">
          <span class="fs-4">{{ selectedTable?.category }}/ {{ selectedTable?.name }}</span>
          <button class="btn btn-sm btn-danger" @click="clearCartItems">
            <i class="fa fa-filter-circle-xmark"></i>
            <span class="ms-2">{{ $t('message.clear_all') }}</span>
          </button>
        </div>
        <div class="category-box px-2 mb-3">
          <div class="d-flex py-3 justify-content-between align-items-center">
            <div class="">
              <span class="text-end">{{ $t("message.total") }}</span>
            </div>
            <div>
              <span v-if="shopInfo.tax !== '0'">
                + tax {{ shopInfo.tax }} %
              </span>
              <span class="text-success">{{ parseInt(totalForShow).toLocaleString() }} Ks</span>
            </div>
          </div>
          <!-- <div v-if="nextReserveInfo">
            <span class="text-success">Next Reservation</span>
            <p>{{ nextReserveInfo.customerName }} | {{ formatTime(nextReserveInfo.startTime) }}
              {{ nextReserveInfo.startDate }}</p>
          </div> -->
        </div>

        <div class="">
          <div class="product-box">
            <div class="row">
              <div class="col-12" v-for="(order, index) in selectedSellProduct" :key="index">
                <div class="p-0" style="
                    border-bottom: 1px solid var(--side-bar-bg) !important;
                    padding: 4px !important;
                  ">

                  <div class="m-0" style="background-color: var(--background-color) !important">
                    <div class="d-flex justify-content-between align-items-center align-items-start">
                      <div class="d-flex flex-column text-start">
                        <span style="color: var(--text-color)">{{
                          order.itemName.length > 80
                            ? order.itemName.slice(0, 80) + "..."
                            : order.itemName
                        }}</span>
                        <span style="color: var(--primary)">{{
                          parseInt(order.sellPrice).toLocaleString()
                        }}
                          Ks</span>
                        <span v-if="order.remark">
                          Remark:{{ order.remark }}
                        </span>
                      </div>
                      <!--                    <button class="btn btn-sm btn-sm" :id="order.id" @click="removeFromCart(order, index)"><i class="fas fa-trash"></i></button>-->
                      <div class="d-flex rounded justify-content-between align-items-center p-1" style="width: 150px">
                        <button class="btn btn-sm text-white" style="background-color: var(--primary)"
                          @click="decreaseCount(order)">
                          -
                        </button>
                        <span>{{ order.count }} {{ order.relation }}</span>
                        <!-- <input class="form-control text-center border-0" disabled @focus="$event.target.select()"
                          style="background-color: var(--background-color)" v-model="order.count"
                          @input="countChangeInput(order)" /> -->
                        <button class="btn btn-sm text-white" style="background-color: var(--primary)"
                          @click="increaseCount(order)">
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="d-flex p-1" style="background-color: var(--background-color)">
          <button class="btn me-2 pe-3 text-nowrap" style="
              border: 2px solid var(--softPrimary);
              min-width: 20%;
              color: var(--text-color);
            ">
            {{$t('message.cancel')}}
          </button>
          <button style="background-color: var(--primary); width: 80%" :disabled="selectedSellProduct.length <= 0"
            class="btn text-white" @click="submitSale">
            {{ $t("message.submit_sales") }}
          </button>
        </div>
      </div>
    </div>
  </admin-sidebar>
</template>

<script>
import db, { timestamp } from "../../config/FirebaseInit";
import ConfirmDialog from "@/components/ConfirmDialog";
import InfoDialog from "@/components/InfoDialog";
import TableReservationReminder from "@/components/TableReservationReminder";
import Loading from "@/components/Loading";
import AdminSidebar from "@/components/AdminSidebar";
import "lodash/debounce";
import Pagination from "@/components/Pagination";
import RestRelationMenuDialog from "@/components/RestRelationMenuDialog";
export default {
  components: {
    Loading,
    ConfirmDialog,
    TableReservationReminder,
    InfoDialog,
    AdminSidebar,
    Pagination,
    RestRelationMenuDialog,
  },
  data() {
    return {
      //pagination
      currentPage: 0,
      perPage: 20,
      currentPageTable: 0,
      perPageTable: 20,
      //end pagination
      // selectedTable:'',
      selectedTableCategory: "",
      showCart: false,
      showReservationReminder: false,
      showTableVoucher: false,
      infoModalActive: false,
      modalMessage: "",
      loadingActive: false,
      confirmActive: false,
      selectedSellProductContainer: 1,
      newDiscount: "",
      newDiscountPrice: "",
      newPromotion: "",
      showDialog: false,

      products: [],
      tax: 0,
      //search data
      search: "",
      searchCode: "",
      searchProduct: null,
      showSelectedBox: true,
      showSearchBox: true,
      totalPrice: 0,
      originalProduct: "",
      showSearch: false,

      showAlert: false,
      alertMessage: "",
      discountType: "price",

      cashier: [],
      //searched product
      product: {
        name: "",
        images: [],
        buyPrice: "",
        sellPrice: "",
        barcode: "",
        itemCode: "",
      },
      selectedCategory: "All",
      selectedSearchType: "",
      selectedSelectionIndex: "",

      //for count*price of each order
      costPerItem: [],
      casherCode: "",

      //Relations
      selectedProduct: "",
      selectedTableReservationList: [],
      pcsList: [],
      customers: [],
      searchCustomer: "",
      selectedSellProduct: [],
      // selectedSearchType:'barcode',
      //final order confirm obj
      checkoutItem: {
        countList: [],
        nameList: [],
        sellPriceList: [],
        buyPriceList: [],
        productIdList: [],
        itemCodeList: [],
        productUnitList: [],
        backNumberList: [],
        casherCode: "",
        sellType: "offlineSell",
        id: "",
        time: "",
        day: "",
        year: "",
        month: "",
        customerAddress: "",
        customerName: "",
        customerPhone: "",
        customerId: "",
        dateTime: "",
        discount: "0",
        promoCode: "0",
        tax: "0",
        totalPrice: "0",
        cashReceived: "0",
        credit: "0",
        change: "0",
        vouncherId: "",
        paymentMethod: "",
        paymentId: "",
        note: "",
      },
      showWarning: true,
      warningMessage: "",
      sellNowActive: false,
      searchedCustomerList: [],
      timeout: null,
      selectedRelations: [],
      relation: "Pcs",
      relationNumber: "1",
      // allProducts: [],
      nextReserveInfo: '',
      nextReserveMenus: [],
    };
  },
  computed: {
    allProducts(){
      return this.$store.getters.getAllProducts;
    },
    selectedTable() {
      return this.$store.getters.getSelectedTable;
    },
    tableCategories() {
      return this.$store.getters.getTableCategories;
    },

    filterTableCategories() {
      if (this.cashierAcc.counter === "Coffee Counter") {
        return this.tableCategories.filter(
          (cate) => cate.name === "Coffee Counter"
        );
      } else if (this.cashierAcc.counter === "Restaurant") {
        return this.tableCategories.filter(
          (cate) => cate.name === "Restaurant"
        );
      } else if (this.cashierAcc.counter === "Bar") {
        return this.tableCategories.filter((cate) => cate.name === "Bar");
      } else {
        return this.tableCategories;
      }
    },
    pageCountTable() {
      return Math.ceil(this.filterTables.prodCount / this.perPageTable);
    },
    offsetCountTable() {
      return this.currentPageTable * this.perPageTable;
    },
    tables() {
      console.log(this.$store.getters.getAllTables);
      return this.$store.getters.getAllTables;
    },

    filterTables() {
      let searchProducts = [];
      if (this.selectedTableCategory !== "All") {
        searchProducts = this.tables.filter(
          (pd) => pd.category === this.selectedTableCategory
        );
        return {
          product: searchProducts.slice(
            this.offsetCountTable,
            this.offsetCountTable + this.perPageTable
          ),
          prodCount: searchProducts.length,
        };
      } else {
        return {
          product: this.tables.slice(
            this.offsetCountTable,
            this.offsetCountTable + this.perPageTable
          ),
          prodCount: this.tables.length,
        };
      }
    },

    productCategories() {
      return this.$store.getters.getProductCategories;
    },
    filterCategories() {
      return this.productCategories.filter((cate) => cate.name !== "All");
    },

    filterProducts() {
      let filterProduct = [];
      if (this.search !== "") {
        filterProduct = this.allProducts.filter(
          (pro) =>
            pro.barcode.toLowerCase().includes(this.search.toLowerCase()) ||
            pro.itemName.toLowerCase().includes(this.search.toLowerCase())
        );
        return {
          product: filterProduct.slice(
            this.offsetCount,
            this.offsetCount + this.perPage
          ),
          prodCount: filterProduct.length,
        };
      } else if (this.selectedCategory !== "All") {
        filterProduct = this.allProducts.filter(
          (pro) => pro.type === this.selectedCategory
        );
        return {
          product: filterProduct.slice(
            this.offsetCount,
            this.offsetCount + this.perPage
          ),
          prodCount: filterProduct.length,
        };
      } else {
        return {
          product: this.allProducts.slice(
            this.offsetCount,
            this.offsetCount + this.perPage
          ),
          prodCount: this.allProducts.length,
        };
      }
    },
    pageCount() {
      return Math.ceil(this.filterProducts.prodCount / this.perPage);
    },
    offsetCount() {
      return this.currentPage * this.perPage;
    },
    gridView() {
      return localStorage.getItem("gridView");
    },
    totalForShow() {
      let tot = 0;
      if (this.selectedSellProduct.length > 0) {
        this.selectedSellProduct.forEach((order) => {
          tot += parseInt(order.sellPrice) * parseInt(order.count);
        });
      }
      if (this.shopInfo.tax !== "0") {
        tot += parseInt((tot * (parseInt(this.shopInfo.tax) / 100)).toFixed(0));
      }
      return tot;
    },

    selectedSellProductLists() {
      return this.$store.getters.getSelectedSellProductLists;
    },

    showName() {
      return localStorage.getItem("showCustomerName");
    },
    showLogo() {
      return localStorage.getItem("showLogoImage");
    },
    showPhone() {
      return localStorage.getItem("showCustomerPhone");
    },
    showRefund() {
      return localStorage.getItem("showRefund");
    },

    cashierAcc() {
      return this.$store.getters.getCashierAcc;
    },

    owner() {
      return this.$store.getters.getShopOwner;
    },

    shopInfo() {
      return this.$store.getters.getShopInfo;
    },

    today() {
      return this.$store.getters.getDay;
    },
    thisMonth() {
      return this.$store.getters.getMonth;
    },
    thisYear() {
      return this.$store.getters.getYear;
    },
    dateTime() {
      return this.$store.getters.getDateTime;
    },
  },

  async mounted() {
    this.$store.dispatch("getDay");
    this.$store.dispatch("getMonth");
    this.$store.dispatch("getDateTime");
    this.$store.dispatch("getYear");
    this.$store.dispatch("getShopInfo", this.owner);
    this.$store.dispatch("getPaymentMethods", this.owner);
    this.$store.dispatch("getCashierAcc", this.owner);
    this.$store.dispatch("getAllProductsByKitchen");
    console.log(this.tableCategories);
    // if(this.cashierAcc.counter === 'Bar' || this.cashierAcc.counter === 'Restaurant'){
    // }

    this.selectedTableCategory = this.cashierAcc.counter;

    this.$refs.barcodeSearch.focus();
    if (window.innerWidth < 500) {
      this.showSelectedBox = false;
      this.showDiscountBox = false;
      this.showCustomerBox = false;
    }

    if (localStorage.getItem("voucherStyle")) {
      this.voucherStyle = localStorage.getItem("voucherStyle");
    }
    this.$store.dispatch("getProductCategories", this.owner);
    this.$store.dispatch("getTableCategories", this.owner);
    this.$store.dispatch("fetchAllTables", this.owner);
    // await this.getAllProductsByKitchen();

    db
      .collection(this.owner.city)
      .doc(this.owner.shopId)
      .collection("sellProducts")
      .where("day", "==", this.today)
      .where("casherCode", "==", this.cashierAcc.accountCode)
      .onSnapshot((snapshot) => {
        this.sellItems = [];
        snapshot.forEach((doc) => {
          this.sellItems.push(doc.data());
        });
      });
    if (this.selectedTable) {
      await this.getTableOrders();
      await this.getTableReservations();

    }
  },

  methods: {
    async reserveNextReservation() {
      this.changeTableStatus();
      await db.collection(this.owner.city)
        .doc(this.owner.shopId)
        .collection("tableReservation")
        .doc(this.nextReserveInfo.id).update({
          status: 'serve'
        });
      if (this.nextReserveMenus !== []) {
        this.nextReserveMenus.forEach(menu => {
          db.collection(this.owner.city)
            .doc(this.owner.shopId)
            .collection("tables")
            .doc(this.selectedTable.id)
            .collection("orders").doc(menu.id).set(menu)
        })
      }
      this.showReservationReminder = false;
    },
    rejectNextReservation() {
      this.nextReserveInfo = '';
      db.collection(this.owner.city)
        .doc(this.owner.shopId)
        .collection("tableReservation")
        .doc(this.nextReserveInfo.id).update({
          status: 'reject'
        });
      this.showReservationReminder = false;

    },
    closeReservationReminder() {
      this.showReservationReminder = false;
      this.$store.state.selectedTable = "";
      this.selectedSellProduct = [];
      this.nextReserveInfo = '';
      // this.modalMessage ="Please choose other table! There is reservation by " + doc.data().customerName +' at ' + this.formatTime(doc.data().startTime);
      this.selectedTable = "";
    },
    formatTime(time) {
      let hour = parseInt(time.split(":")[0]);
      let minute = parseInt(time.split(":")[1]);
      let suffix = '';
      if (hour > 11) {
        suffix += "PM";
      } else {
        suffix += "AM";
      }
      if (hour > 12) {
        hour -= 12
      } else if (hour === 0) {
        hour = 12;
      }
      if (minute < 10) {
        minute = "0" + minute
      }
      return hour + ":" + minute + " " + suffix;


    },
    // async getAllProductsByKitchen() {
    //   if (this.cashierAcc.counter === "Bar") {
    //     db
    //       .collection(this.owner.city)
    //       .doc(this.owner.shopId)
    //       .collection("products")
    //       .where("barMenu", "==", "yes")
    //       .orderBy("itemName", "asc")
    //       .onSnapshot((snapshot) => {
    //         this.allProducts = [];
    //         snapshot.forEach((doc) => {
    //           this.allProducts.push(doc.data());
    //         });
    //       });
    //   } else {
    //     db
    //       .collection(this.owner.city)
    //       .doc(this.owner.shopId)
    //       .collection("products")
    //       .where("kitchenType", "==", this.selectedTableCategory)
    //       .orderBy("itemName", "asc")
    //       .onSnapshot((snapshot) => {
    //         this.allProducts = [];
    //         snapshot.forEach((doc) => {
    //           this.allProducts.push(doc.data());
    //         });
    //       });
    //   }
    // },
    async getTableOrders() {
      console.log("get table order");
      db.collection(this.owner.city)
        .doc(this.owner.shopId)
        .collection("tables")
        .doc(this.selectedTable.id)
        .collection("orders")
        .onSnapshot((snapshot) => {
          this.selectedSellProduct = [];
          snapshot.forEach((doc) => {
            this.selectedSellProduct.push(doc.data());
          });
        });
    },
    selectTableCategory(name) {
      this.selectedTableCategory = name;
      //this.getAllProductsByKitchen();
    },
    async chooseTable(table) {

      // this.selectedTable = table;
      this.nextReserveInfo = '';
      await this.$store.commit("SET_SELECTED_TABLE", table);
      // document.getElementById('close-table').click();
      await this.getTableOrders();
      await this.getTableReservations();

    },
    async getTableReservations() {
      let date = new Date();
      let currentTime = date.getHours() * 3600 + date.getMinutes() * 60;
      await db.collection(this.owner.city)
        .doc(this.owner.shopId)
        .collection("tableReservation")
        .where('status', '==', 'approve')
        .where('tableIdList', 'array-contains', this.selectedTable.id)
        .onSnapshot((snapshot) => {
          this.selectedTableReservationList = [];
          snapshot.forEach((doc) => {

            let startTime = (parseInt(doc.data().startTime.split(':')[0]) * 3600) + (parseInt(doc.data().startTime.split(':')[1]) * 60);
            console.log(startTime);
            let diffTime = startTime - currentTime;
            this.selectedTableReservationList.push({
              customerName: doc.data().customerName,
              startDate: doc.data().startDate,
              startTime: doc.data().startTime
            });
            if (diffTime >= 60 && diffTime <= (2 * 3600)) {
              this.nextReserveInfo = doc.data();
              db.collection(this.owner.city)
                .doc(this.owner.shopId)
                .collection("tableReservation")
                .doc(this.nextReserveInfo.id)
                .collection('orders')
                .onSnapshot((snapshot) => {
                  console.log(snapshot.size)
                  this.nextReserveMenus = [];
                  snapshot.forEach(doc => {
                    this.nextReserveMenus.push(doc.data())
                  })
                  console.log('next reserve menus:', this.nextReserveMenus)
                  this.showReservationReminder = true;

                })
            }
          });
        });
    },
    selectCate(name) {
      this.selectedCategory = name;
      this.currentPage = 0;
    },
    onPageChange(page) {
      console.log(page);
      this.currentPage = page;
    },
    onPageChangeTable(page) {
      console.log(page);
      this.currentPageTable = page;
    },
    focusInput() {
      this.$refs.barcodeSearch.focus();
    },
    setViewOption(value) {
      localStorage.setItem("gridView", value);
      this.gridView = value;
      window.location.reload();
    },

    showSearchBoxHandler() {
      if (window.innerWidth < 500) {
        this.showSearchBox = true;
        this.showSelectedBox = false;
      }
    },
    showSelectedBoxHandler() {
      if (window.innerWidth < 500) {
        this.showSelectedBox = true;
        this.showSearchBox = false;
      }
    },
    clearCartItems() {
      db.collection(this.owner.city)
        .doc(this.owner.shopId)
        .collection("tables")
        .doc(this.selectedTable.id)
        .collection("orders")
        .get()
        .then((snapshot) => {
          snapshot.docs.forEach((doc) => {
            db.collection(this.owner.city)
              .doc(this.owner.shopId)
              .collection("tables")
              .doc(this.selectedTable.id)
              .collection("orders")
              .doc(doc.data().id)
              .delete();
            // if(index === snapshot.size-1){
            // }
          });
        })
        .then(() => {
          this.changeTableStatusFree();
        });
    },
    selectSearchType(type) {
      this.focusInput();
      localStorage.setItem("selectedProductSearchType", type);
      if (this.selectedSearchType) {
        this.selectedSearchType = localStorage.getItem(
          "selectedProductSearchType"
        );
      }
    },
    clearSearch() {
      this.focusInput();

      this.products = [];
      this.search = "";
    },

    checkProduct(payload) {
      console.log("payload", payload);
      if (
        this.selectedSellProduct.some(
          (p) =>
            p.productId === this.selectedProduct.id &&
            p.relation === payload.relation
        )
      ) {
        let sameIndex = this.selectedSellProduct.findIndex(
          (p) =>
            p.productId === this.selectedProduct.id &&
            p.relation === payload.relation
        );
        let newCount = parseInt(this.selectedSellProduct[sameIndex].count) + 1;
        db.collection(this.owner.city)
          .doc(this.owner.shopId)
          .collection("tables")
          .doc(this.selectedTable.id)
          .collection("orders")
          .doc(this.selectedSellProduct[sameIndex].id)
          .update({
            count: newCount + "",
          });
      } else {
        this.$store.dispatch("getDateTime");
        this.$store.dispatch("getDay");
        this.$store.dispatch("getMonth");
        this.$store.dispatch("getYear");
        let orderRef = db
          .collection(this.owner.city)
          .doc(this.owner.shopId)
          .collection("tables")
          .doc(this.selectedTable.id)
          .collection("orders")
          .doc();
        orderRef.set({
          barcode: this.selectedProduct.barcode,
          buyPrice: this.selectedProduct.buyPrice,
          color: this.selectedProduct.color,
          count: payload.count + "",
          day: this.today,
          description: this.selectedProduct.description,
          discount: this.selectedProduct.discount,
          expireDate: this.selectedProduct.expireDate,
          id: orderRef.id,
          images: this.selectedProduct.images,
          itemCode: this.selectedProduct.itemCode,
          itemName: this.selectedProduct.itemName,
          month: this.thisMonth,
          productId: this.selectedProduct.id,
          rating: this.selectedProduct.rating,

          relation: payload.relation + "",
          relationNumber: payload.relationNumber + "",
          kitchenType: this.selectedProduct.kitchenType,
          kitchenId: this.selectedProduct.kitchenId,
          cookStatus: "Pending",
          remark: "",
          printCount: "0",
          sellPrice: payload.sellPrice,
          size: this.selectedProduct.size,
          stock: this.selectedProduct.stock,
          tableId: this.selectedTable.id,
          time: timestamp,
          type: this.selectedProduct.type,
          weight: this.selectedProduct.weight,
          year: this.thisYear,
        });
      }
    },
    confirmMenuItem(payload) {
      console.log(payload);
      this.checkProduct(payload);
      this.changeTableStatus();
    },
    changeTableStatus() {
      //alert(this.selectedTable.categoryType)
      db.collection(this.owner.city)
        .doc(this.owner.shopId)
        .collection("tables")
        .doc(this.selectedTable.id)
        .update({
          categoryType: "Service",
        });
    },
    async changeTableStatusFree() {
      //alert(this.selectedTable.categoryType)
      const tableRef = db
        .collection(this.owner.city)
        .doc(this.owner.shopId)
        .collection("tables")
        .doc(this.selectedTable.id);
      await tableRef
        .collection("orders")
        .get()
        .then((snapshot) => {
          if (snapshot.docs.length === 0) {
            console.log("no orders and free table");
            tableRef.update({
              categoryType: "Free",
            });
          }
        });
    },
    //selected products
    async selectForCart(product) {
      this.selectedProduct = product;
      await db
        .collection(this.owner.city)
        .doc(this.owner.shopId)
        .collection("products")
        .doc(this.selectedProduct.id)
        .collection("relation")
        .onSnapshot((snapshot) => {
          this.selectedRelations = [];
          snapshot.forEach((doc) => {
            this.selectedRelations.push(doc.data());
          });
          if (this.selectedRelations.length > 0) {
            console.log("relations", this.selectedRelations);
            this.showDialog = true;
          } else {
            if (product.stock !== "") {
              console.log("stock exist", this.selectedSellProduct);
              let totalCount = 0;
              if (
                this.selectedSellProduct.some(
                  (selected) => selected.productId === product.id
                )
              ) {
                console.log("same product");
                this.selectedSellProduct.forEach((prod, i) => {
                  if (prod.productId === product.id) {
                    totalCount +=
                      parseInt(prod.count) * parseInt(prod.relationNumber);
                    console.log("total count", totalCount, product.stock);
                    if (i + 1 === this.selectedProduct.length) {
                      if (totalCount <= parseInt(product.stock)) {
                        this.checkProduct({
                          count: "1",
                          relation: this.relation,
                          relationNumber: this.relationNumber,
                          sellPrice: this.selectedProduct.sellPrice,
                        });
                        this.changeTableStatus();
                      } else {
                        this.infoModalActive = true;
                        this.modalMessage = "Out of Stock!";
                      }
                    }
                  }
                });
              } else {
                this.checkProduct({
                  count: "1",
                  relation: this.relation,
                  relationNumber: this.relationNumber,
                  sellPrice: this.selectedProduct.sellPrice,
                });
                this.changeTableStatus();
              }
            } else {
              console.log("stock not exist");
              this.checkProduct({
                count: "1",
                relation: this.relation,
                relationNumber: this.relationNumber,
                sellPrice: this.selectedProduct.sellPrice,
              });
              this.changeTableStatus();
            }
          }
        });
    },

    removeFromCart(order) {
      db.collection(this.owner.city)
        .doc(this.owner.shopId)
        .collection("tables")
        .doc(this.selectedTable.id)
        .collection("orders")
        .doc(order.id)
        .delete();
    },
    //method for input change
    countChangeInput(order) {
      if (order.stock !== "") {
        if (order.relationNumber === "1") {
          db.collection(this.owner.city)
            .doc(this.owner.shopId)
            .collection("tables")
            .doc(this.selectedTable.id)
            .collection("orders")
            .doc(order.id)
            .get()
            .then((snapshot) => {
              if (parseInt(snapshot.data().stock) >= order.count) {
                db.collection(this.owner.city)
                  .doc(this.owner.shopId)
                  .collection("tables")
                  .doc(this.selectedTable.id)
                  .collection("orders")
                  .doc(order.id)
                  .update({
                    count: order.count + "",
                  });
              } else {
                this.infoModalActive = true;
                this.modalMessage = "Out of stock!";
              }
            });
        } else {
          let relationCount =
            parseInt(order.count) * parseInt(order.relationNumber);
          db.collection(this.owner.city)
            .doc(this.owner.shopId)
            .collection("tables")
            .doc(this.selectedTable.id)
            .collection("orders")
            .doc(order.id)
            .get()
            .then((snapshot) => {
              if (parseInt(snapshot.data().stock) >= relationCount) {
                db.collection(this.owner.city)
                  .doc(this.owner.shopId)
                  .collection("tables")
                  .doc(this.selectedTable.id)
                  .collection("orders")
                  .doc(order.id)
                  .update({
                    count: order.count + "",
                  });
              } else {
                this.infoModalActive = true;
                this.modalMessage = "Out of stock!";
              }
            });
        }
      } else {
        db.collection(this.owner.city)
          .doc(this.owner.shopId)
          .collection("tables")
          .doc(this.selectedTable.id)
          .collection("orders")
          .doc(order.id)
          .update({
            count: order.count + "",
          });
      }
    },

    increaseCount(order) {
      let a = parseInt(order.count);
      let totalCount = 0;
      a++;
      if (order.stock === "") {
        db.collection(this.owner.city)
          .doc(this.owner.shopId)
          .collection("tables")
          .doc(this.selectedTable.id)
          .collection("orders")
          .doc(order.id)
          .update({
            count: a + "",
          });
      } else {
        let relationCount = a * parseInt(order.relationNumber);
        if (
          this.selectedSellProduct.some(
            (selected) => selected.productId === order.productId
          )
        ) {
          console.log("same product with stock");
          this.selectedSellProduct.forEach((prod, i) => {
            console.log("same?", prod.productId === order.productId);
            if (prod.productId === order.productId) {
              totalCount +=
                parseInt(prod.count) * parseInt(prod.relationNumber);
            }
            if (i + 1 === this.selectedProduct.length) {
              console.log(totalCount, "=", relationCount);
              if (totalCount <= relationCount) {
                console.log("condition ok");
                db.collection(this.owner.city)
                  .doc(this.owner.shopId)
                  .collection("tables")
                  .doc(this.selectedTable.id)
                  .collection("orders")
                  .doc(order.id)
                  .update({
                    count: a + "",
                  });
              } else {
                this.infoModalActive = true;
                this.modalMessage = "Out of stock";
              }
            }
          });
        } else {
          db.collection(this.owner.city)
            .doc(this.owner.shopId)
            .collection("tables")
            .doc(this.selectedTable.id)
            .collection("orders")
            .doc(order.productId)
            .get()
            .then((snapshot) => {
              if (relationCount <= snapshot.data().stock) {
                db.collection(this.owner.city)
                  .doc(this.owner.shopId)
                  .collection("tables")
                  .doc(this.selectedTable.id)
                  .collection("orders")
                  .doc(order.id)
                  .update({
                    count: a + "",
                  });
              } else {
                this.infoModalActive = true;
                this.modalMessage = "Out of stock";
              }
            });
        }
      }
    },

    decreaseCount(order) {
      let a = parseInt(order.count);
      if (a > 1) {
        a--;
        db.collection(this.owner.city)
          .doc(this.owner.shopId)
          .collection("tables")
          .doc(this.selectedTable.id)
          .collection("orders")
          .doc(order.id)
          .update({
            count: a + "",
          });
      } else {
        db.collection(this.owner.city)
          .doc(this.owner.shopId)
          .collection("tables")
          .doc(this.selectedTable.id)
          .collection("orders")
          .doc(order.id)
          .delete();
      }
      this.changeTableStatusFree();
    },

    submitSale() {
      console.log("submit sale");
      this.checkoutItem.casherCode = this.cashierAcc.accountCode;
      let padNumber = this.sellItems.length + 1;
      this.checkoutItem.vouncherId = this.generateVoucherId(padNumber);

      this.selectedSellProduct.forEach((order) => {
        this.checkoutItem.nameList.push(order.itemName);
        this.checkoutItem.sellPriceList.push(order.sellPrice.toString());
        this.checkoutItem.buyPriceList.push(order.buyPrice.toString());
        this.checkoutItem.itemCodeList.push(order.itemCode);
        this.checkoutItem.productUnitList.push(order.relation);
        this.checkoutItem.productIdList.push(order.productId);
        this.checkoutItem.countList.push(order.count.toString());
        this.totalPrice += parseInt(order.sellPrice) * parseInt(order.count);
        this.costPerItem.push(
          parseInt(order.sellPrice) * parseInt(order.count)
        );
        this.checkoutItem.backNumberList.push(order.relationNumber);
        this.pcsList.push(parseInt(order.count));
      });

      let nextTotal = 0;
      if (this.shopInfo.tax !== "0") {
        this.checkoutItem.tax = (
          this.totalPrice *
          (parseInt(this.shopInfo.tax) / 100)
        ).toFixed(0);
        nextTotal = parseInt(this.totalPrice) + parseInt(this.checkoutItem.tax);
        this.checkoutItem.totalPrice = nextTotal.toString();
      } else {
        this.checkoutItem.totalPrice = this.totalPrice.toString();
      }

      this.showCart = true;

      this.$store.commit(
        "SET_SELECTED_VOUCHER_PRODUCT",
        this.selectedSellProduct
      );

      this.$store.commit("SET_VOUCHER", this.checkoutItem);
      console.log(this.checkoutItem);
      this.$router.push({ name: "RestaurantVoucher" });
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

    //Selecting search item

    clearCart() {
      this.totalPrice = 0;
      this.newDiscount = 0;
      this.focusInput();
    },

    confirm() {
      this.confirmActive = !this.confirmActive;
      db.collection(this.owner.city)
        .doc(this.owner.shopId)
        .collection("promotionCode")
        .doc(this.deleteId)
        .delete()
        .then(() => {
          this.modalMessage = "Deleted";
          this.infoModalActive = true;
        });
    },

    cancel() {
      this.confirmActive = !this.confirmActive;
      this.focusInput();
    },

    closeModal() {
      this.infoModalActive = !this.infoModalActive;
      this.focusInput();
    },

    closeDialog() {
      this.focusInput();
      this.showDialog = !this.showDialog;
    },

    getRandomStr() {
      const chars = "1234567890";
      let result = "";
      for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    },
  },
};
</script>

<style scoped>
.section-header {
  color: var(--text-color) !important;
  background-color: var(--light);
  border-radius: var(--border-radius);
  height: 60px;
  display: flex;
  align-items: center;
  padding: 5px;
}

tr,
td,
th {
  color: var(--text-color) !important;
  background-color: var(--white) !important;
}

.table-bottom {
  background-color: var(--light);
}

.table-bottom td {
  border-radius: 0px;
  border: none !important;
}

.table-voucher thead th,
.table-voucher tbody td {
  border: 2px solid var(--primary) !important;
}

.table-card {
  box-shadow: 0 0 50px -20px rgba(204, 204, 204, 0.8);
}

.table-card:hover {
  color: var(--text-color) !important;
  background-color: var(--secondary) !important;
}

.product-card {
  height: 210px;
  overflow: hidden;
  position: relative;
  margin-bottom: 10px;
  cursor: pointer;
  transition: 0.3s;
  padding-top: 5px;
  border-radius: var(--border-radius) !important;
  background-color: var(--white);
  box-shadow: 0 0 50px -20px rgba(204, 204, 204, 0.8);
}

.product-card:hover {
  color: var(--text-color) !important;
  background-color: var(--secondary) !important;
}

.product-box {
  position: sticky;
  padding: 10px;
  z-index: 1000;
  height: 73vh;
  overflow-y: scroll;
  overflow-x: hidden;
  border-radius: var(--border-radius);
  border: 2px solid var(--light);
}

.category-list:hover {
  color: var(--primary);
}

.modal-body-box {
  height: 80vh;
  overflow-x: hidden;
  overflow-y: scroll;
}

.voucher-box {
  height: 80vh;
  border-radius: var(--border-radius);
  overflow-x: hidden;
  overflow-y: scroll;
}

.active-btn {
  background-color: var(--btnLight);
}

.selected-box {
  border: 2px solid var(--light);
  border-radius: var(--border-radius);
  height: 73vh;
  overflow-y: scroll;
  overflow-x: hidden;
}

.content-box {
  top: 100px;
}

.customer-box {
  height: 79vh;
  color: var(--text-color) !important;
  background-color: var(--background-color) !important;
  border-radius: var(--border-radius) !important;
}

.discount-box {
  color: var(--text-color) !important;
  background-color: var(--background-color) !important;
  border-radius: var(--border-radius) !important;
}

.category-box {
  padding: 0;
  z-index: 1000;
  color: var(--text-color);
  position: sticky;
  box-sizing: border-box;
  width: 100%;
  height: inherit;
  align-items: center;
}

.dropdown-item {
  cursor: pointer;
}

.category-box ul {
  padding: 5px;
  height: inherit;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  box-sizing: border-box;
}

.category-list {
  cursor: pointer;
  border: none !important;
  border-bottom: 1px solid;
  height: inherit;
  min-width: 60px;
  text-align: center;
  display: inline;
  padding: 5px;
  margin-top: 4px;
  margin-left: 5px;
  transition: 0.3s;
}

.active-dot {
  width: 8px;
  height: 8px;
  padding: 3px;
  border-radius: 50%;
  margin: auto;
}

.category-list-active {
  background-color: var(--primary) !important;
}

.table-active {
  background-color: var(--white) !important;
  border: 3px solid var(--secondary);
}

.voucher-list-solid {
  border-top: 2px solid black;
}

.voucher-list-top {
  border-top: 2px dotted black;
}

.voucher-list-bottom {
  border-bottom: 2px dotted black;
}

.btn-group {
  width: 100%;
}

.check-btn {
  background-color: var(--secondary);
  border: none !important;
  width: 80px !important;
}

.btn-group .btn {
  border: 1px solid var(--primary);
  border: none !important;
  box-shadow: none !important;
  outline: none !important;
  border-radius: 0px !important;
}

.btn-check {
  border: none !important;
  border-radius: var(--border-radius) !important;
}

thead,
tbody {
  border: none !important;
  color: var(--dark);
}

.modal-header {
  padding: 2px !important;
  margin: 3px !important;
}

.modal-body {
  padding: 5px !important;
}

@media only screen and (max-width: 1030px) {}

.voucher-modal {
  height: 70vh;
  overflow-y: scroll;
}

@media only screen and (max-width: 800px) {
  .category-box {
    width: 30%;
  }

  .selected-box {
    height: 70vh;
  }
}

.voucher-modal {
  height: 80vh;
}

@media only screen and (max-width: 500px) {
  .voucher-modal {
    height: inherit !important;
  }

  .voucher-box {
    height: inherit !important;
  }

  .modal-body-box {
    height: inherit !important;
  }

  .modal-body-box {
    height: 75vh;
    overflow-x: hidden;
    overflow-y: scroll;
  }

  .category-box {
    width: 94%;
  }
}
</style>
