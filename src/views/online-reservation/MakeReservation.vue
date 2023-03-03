<template>
  <admin-sidebar>
    <Loading v-if="loadingActive" />
    <InfoDialog v-if="infoModalActive" :modal-message="modalMessage" @close-modal="closeModal" />
    <ConfirmDialog :modal-message="modalMessage" v-if="confirmActive" @confirm="confirm" @cancel="cancel" />
    <RestRelationMenuDialog :selectedProduct="selectedProduct" :selectedSellProduct="selectedSellProduct" :owner="owner"
      :selectedRelations="selectedRelations" v-if="showDialog" @confirm-modal="confirmMenuItem"
      @close-modal="closeDialog" />
    <div class="row" style="overflow-y: hidden">
      <div class="d-flex align-items-center justify-content-between rounded mb-2">
        <div class="d-flex rounded align-items-center mt-2">
          <button @click="$router.back()" class="btn me-2 fs-4 float-start border-0" style="color: var(--primary)">
            <i class="fas fa-chevron-left"> </i>
            <span> Back </span>
          </button>
        </div>
      </div>
      <div class="col-12 col-lg-3">
        <table class="table table-striped">
          <tbody>
            <tr>
              <td>
                {{ $t("message.name") }}
              </td>
              <td>
                {{ getDetailData.customerName }}
              </td>
            </tr>
            <tr>
              <td>
                {{ $t("message.phone") }}
              </td>
              <td>
                <a :href="'tel:' + getDetailData.customerPhone">{{
                  getDetailData.customerPhone
                }}</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="col-12 col-lg-3" v-show="!getDetailData?.adminReservation">
        <div class="section-header justify-content-between">
          <div class="">
            <h3>{{ $t("message.menu") }}</h3>
          </div>
          <div class="d-flex align-items-end p-1" style="
              background-color: var(--background-color);
              border-radius: var(--border-radius);
            ">
            <button class="btn" style="color: var(--text-color)">
              <i class="fas fa-search"></i>
            </button>
            <input type="text" ref="barcodeSearch" autofocus v-model="search" @input="filterProducts"
              :placeholder="$t('message.search')" class="form-control border-0" @click="showSearchBoxHandler" />
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
            <div class="col-6" v-for="(product, index) in filterProductItem.product" :key="index"
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
      <div class="col-12 col-lg-3 rounded" v-if="!getDetailData?.adminReservation">
        <div class="section-header justify-content-between">
          <!-- <span class="fs-4"
            >{{ selectedTable?.category }}/ {{ selectedTable?.name }}</span
          > -->
          <button class="btn btn-sm btn-danger" @click="clearCartItems">
            <i class="fa fa-filter-circle-xmark"></i>
            <span class="ms-2">{{ $t("message.clear_all") }}</span>
          </button>
        </div>
        <div class="category-box px-2 mb-3">
          <div class="d-flex py-3 justify-content-between align-items-center">
            <div class="">
              <span class="text-end">{{ $t("message.total") }}</span>
            </div>
            <!-- <div>
              <span v-if="shopInfo.tax !== '0'">
                + tax {{ shopInfo.tax }} %
              </span>
              <span class="text-success"
                >{{ parseInt(totalForShow).toLocaleString() }} Ks</span
              >
            </div> -->
          </div>
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
                      </div>
                      <!--                    <button class="btn btn-sm btn-sm" :id="order.id" @click="removeFromCart(order, index)"><i class="fas fa-trash"></i></button>-->
                      <div class="d-flex rounded justify-content-between align-items-center p-1" style="width: 150px">
                        <button class="btn btn-sm text-white" style="background-color: var(--primary)"
                          @click="decreaseCount(order)">
                          -
                        </button>
                        <span class="mx-2">{{order.count}}{{order.relation}}</span>
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
          <!-- <button
            style="background-color: var(--primary); width: 100%"
            :disabled="selectedSellProduct.length <= 0"
            class="btn text-white"
            @click="submitSale"
          >
            submit
            {{ $t("message.submit_sales") }}
          </button> -->
        </div>
      </div>
      <div v-bind:class="{
        'col-12 col-lg-3': !getDetailData.adminReservation,
        'col-12 col-lg-8': getDetailData.adminReservation,
      }">
        <div class="section-header d-flex justify-content-between text-nowrap">
          <h3>{{ $t("message.tables") }}</h3>
          <div style="width: 200px">
            <input type="date" id="date" v-model="startDate" class="form-control" @change="filterTableList" required />
          </div>
        </div>
        <div class="product-box mb-4">
          <div class="row">
            <div class="col-6" v-for="product in filterTable" :key="product.id">
              <div class="card table-card" style="cursor: pointer" @click="chooseTable(product)">
                <div class="card-body" :class="
                  selectedTable.includes(product.id) ? 'table-active' : ''
                ">
                  <div class="d-flex flex-column align-items-center justify">
                    <p class="">{{ product.name }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <pagination :totalPages="pageCountTable" :perPage="perPageTable" :currentPage="currentPageTable"
          :pages="filterTable" @pagechanged="onPageChangeTable" />
        <div class="d-flex p-1" style="background-color: var(--background-color)">
          <button class="btn me-2 text-nowrap" style="
              border: 2px solid var(--softPrimary);
              color: var(--text-color);
            " @click="cancelReservation">
            {{ $t("message.cancel") }}
          </button>
          <button style="background-color: var(--primary); width: 70%" :disabled="selectedTable.length <= 0"
            class="btn text-white text-nowrapr" @click="submitReservation">
            {{ $t("message.confirm") }}
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
import Loading from "@/components/Loading";
import AdminSidebar from "@/components/AdminSidebar";
import RestRelationMenuDialog from "@/components/RestRelationMenuDialog";
import "lodash/debounce";
import Pagination from "@/components/Pagination";
export default {
  components: {
    Loading,
    ConfirmDialog,
    InfoDialog,
    AdminSidebar,
    Pagination,
    RestRelationMenuDialog,
  },
  data() {
    return {
      //pagination
      startDate: "",
      currentPage: 0,
      perPage: 20,
      currentPageTable: 0,
      perPageTable: 20,
      filterTable: [],
      tableList: [],
      tableCategory: "restaurant",
      selectedTable: [],
      form: {
        customerName: "",
        customerPhone: "",
        startTime: "",
        startDate: "",
        tableCount: "",
        peopleCount: "",
      },
      filterProductItem: {
        product: [],
        prodCount: 0,
      },
      //end pagination
      // selectedTable:'',
      selectedSellProduct: [],
      selectedCategory: "All",
      selectedTableCategory: "",
      showCart: false,
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
      allProducts: [],
      search: "",
      relation: "Pcs",
      relationNumber: "1",
      //search data
    };
  },
  computed: {
    // selectedTable() {
    //   return this.$store.getters.getSelectedTable;
    // },
    productCategories() {
      return this.$store.getters.getProductCategories;
    },
    filterCategories() {
      return this.productCategories.filter((cate) => cate.name !== "All");
    },
    getDetailData() {
      console.log(this.$store.getters.getReservationDetail);
      return this.$store.getters.getReservationDetail;
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
      return Math.ceil(this.filterTable.length / this.perPageTable);
    },
    offsetCountTable() {
      return this.currentPageTable * this.perPageTable;
    },
    tables() {
      return this.$store.getters.getAllTables;
    },

    pageCount() {
      return Math.ceil(this.allProducts.length / this.perPage);
    },
    offsetCount() {
      return this.currentPage * this.perPage;
    },
    gridView() {
      return localStorage.getItem("gridView");
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
    dateTime() {
      return this.$store.getters.getDateTime;
    },
    day() {
      return this.$store.getters.getDay;
    },
    month() {
      return this.$store.getters.getMonth;
    },
    year() {
      return this.$store.getters.getYear;
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
    // if(this.cashierAcc.counter === 'Bar' || this.cashierAcc.counter === 'Restaurant'){
    // }
    if (this.getDetailData.status !== "reject") {
      this.selectedTable = [...this.getDetailData.tableIdList] || [];
    }
    this.selectedTableCategory = this.cashierAcc.counter;
    this.startDate = this.formatDateForInput(this.getDetailData.startDate);
    console.log(this.getDetailData.startDate, "start date");
    console.log(this.startDate, "start date");
    if (window.innerWidth < 500) {
      this.showSelectedBox = false;
      this.showDiscountBox = false;
      this.showCustomerBox = false;
    }
    let tableCategoryType =
      this.getDetailData.type === "restaurant" ? "Restaurant" : "Bar";
    await db
      .collection(this.owner.city)
      .doc(this.owner.shopId)
      .collection("tables")
      .where("category", "==", tableCategoryType)
      .onSnapshot((snapshot) => {
        this.tableList = [];
        snapshot.forEach((doc) => {
          this.tableList.push(doc.data());
        });
      });
    await db
      .collection(this.owner.city)
      .doc(this.owner.shopId)
      .collection("tableReservation")
      .doc(this.getDetailData.id)
      .collection("orders")
      .onSnapshot((snapshot) => {
        this.selectedSellProduct = [];
        snapshot.forEach((doc) => {
          this.selectedSellProduct.push(doc.data());
        });
        console.log(this.selectedSellProduct, "selectedSellProduct");
      });
    console.log("done");
    this.filterTableList();
    this.getAllProductsByKitchen();
  },
  methods: {
    filterProducts() {
      console.log("gggg", this.allProducts);
      let filterProduct = [];
      this.filterProductItem = {
        product: [],
        prodCount: 0,
      };
      if (this.search !== "") {
        console.log("search", this.search);
        filterProduct = this.allProducts.filter(
          (pro) => {
            return (
              pro.itemName.toLowerCase().includes(this.search.toLowerCase()) ||
              pro.barcode.toLowerCase().includes(this.search.toLowerCase())
            );
          }
          // pro.barcode.toLowerCase().includes(this.search.toLowerCase()) ||
          // pro.itemName.toLowerCase().includes(this.search.toLowerCase())
        );
        this.filterProductItem = {
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
        this.filterProductItem = {
          product: filterProduct.slice(
            this.offsetCount,
            this.offsetCount + this.perPage
          ),
          prodCount: filterProduct.length,
        };
      } else {
        this.filterProductItem = {
          product: this.allProducts.slice(
            this.offsetCount,
            this.offsetCount + this.perPage
          ),
          prodCount: this.allProducts.length,
        };
      }
    },
    async getAllProductsByKitchen() {
      if (this.getDetailData.type !== "restaurant") {
        console.log("bar");
        await db
          .collection(this.owner.city)
          .doc(this.owner.shopId)
          .collection("products")
          .where("barMenu", "==", "yes")
          .onSnapshot((snapshot) => {
            this.allProducts = [];
            snapshot.forEach((doc) => {
              this.allProducts.push(doc.data());
            });
            console.log(this.allProducts, "snapshot");
            this.filterProducts();
          });
      } else {
        await db
          .collection(this.owner.city)
          .doc(this.owner.shopId)
          .collection("products")
          .where("kitchenType", "==", "Restaurant")
          .orderBy("itemName", "asc")
          .onSnapshot((snapshot) => {
            this.allProducts = [];
            console.log(snapshot, "snapshot");
            snapshot.forEach((doc) => {
              this.allProducts.push(doc.data());
            });
            console.log(this.allProducts, "snapshot");
            this.filterProducts();
          });
      }
    },
    formatDateForInput(payload) {
      var date = new Date(payload);
      // Get year, month, and day part from the date
      var year = date.toLocaleString("default", { year: "numeric" });
      var month = date.toLocaleString("default", { month: "2-digit" });
      var day = date.toLocaleString("default", { day: "2-digit" });

      return year + "-" + month + "-" + day;
    },
    formatDate(payload) {
      if (payload !== "") {
        let date = new Date(payload);
        let year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(
          date
        );
        let month = new Intl.DateTimeFormat("en", { month: "short" }).format(
          date
        );
        let day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(
          date
        );
        return day + "-" + month + "-" + year;
      } else {
        return "";
      }
    },
    selectCate(name) {
      this.selectedCategory = name;
      this.currentPage = 0;
    },
    confirmMenuItem(payload) {
      console.log(payload);
      this.checkProduct(payload);
    },
    async submitReservation() {
      console.log("submit reservation", this.getDetailData);
      db.collection(this.owner.city)
        .doc(this.owner.shopId)
        .collection("tableReservation")
        .doc(this.getDetailData.id)
        .update({
          status: "approve",
          tableIdList: this.selectedTable,
          startDate: this.formatDate(this.startDate),
        })
        .then(() => {
          db.collection(this.owner.city)
            .doc(this.owner.shopId)
            .collection("tableReservation")
            .doc(this.getDetailData.id)
            .collection("orders")
            .onSnapshot((snapshot) => {
              snapshot.forEach(async (doc) => {
                await db
                  .collection(this.owner.city)
                  .doc(this.owner.shopId)
                  .collection("tableReservation")
                  .doc(this.getDetailData.id)
                  .collection("orders")
                  .doc(doc.id)
                  .update({
                    tableId: this.selectedTable,
                  });
              });
              this.$router.push({name:'reservationManagement',params:{type:this.cashierAcc.counter}});
            });
        });
    },
    async cancelReservation() {
      await db
        .collection(this.owner.city)
        .doc(this.owner.shopId)
        .collection("tableReservation")
        .doc(this.getDetailData.id)
        .update({
          status: "reject",
        })
        .then(() => {
          this.$router.back();
        });
    },
    async filterTableList() {
      console.log(this.startDate, "filter table list");
      await db
        .collection(this.owner.city)
        .doc(this.owner.shopId)
        .collection("tableReservation")
        .where("status", "==", "approve")
        .where("startDate", "==", this.formatDate(this.startDate))
        .onSnapshot((snapshot) => {
          this.filterTable = this.tableList;

          snapshot.forEach((doc) => {
            this.filterTable = this.filterTable.filter((el) => {
              if (doc.data().id === this.getDetailData.id) {
                return true;
              }
              return !doc.data().tableIdList.includes(el.id);
            });

            // this.tableList.filter(doc.data());
          });
        });
    },
    chooseTable(item) {
      if (this.selectedTable.includes(item.id)) {
        this.selectedTable = this.selectedTable.filter(
          (table) => table !== item.id
        );
      } else {
        this.selectedTable.push(item.id);
      }
    },
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
            console.log("fejfio", product);
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
              }
            } else {
              console.log("stock not exist");
              this.checkProduct({
                count: "1",
                relation: this.relation,
                relationNumber: this.relationNumber,
                sellPrice: this.selectedProduct.sellPrice,
              });
              // this.changeTableStatus();
            }
          }
        });
    },
    async checkProduct(payload) {
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
        this.selectedSellProduct[sameIndex].count =
          parseInt(this.selectedSellProduct[sameIndex].count) + 1;

        // db.collection(this.owner.city)
        //   .doc(this.owner.shopId)
        //   .collection("tableReservation")
        //   .doc(this.selectedTable.id)
        //   .collection("orders")
        //   .doc(this.selectedSellProduct[sameIndex].id)
        //   .update({
        //     count: newCount + "",
        //   });
      } else {
        this.$store.dispatch("getDateTime");
        this.$store.dispatch("getDay");
        this.$store.dispatch("getMonth");
        this.$store.dispatch("getYear");
        // let orderRef = db
        //   .collection(this.owner.city)
        //   .doc(this.owner.shopId)
        //   .collection("tables")
        //   .doc(this.selectedTable.id)
        //   .collection("orders")
        //   .doc();
        const submitData = {
          barcode: this.selectedProduct.barcode,
          buyPrice: this.selectedProduct.buyPrice,
          color: this.selectedProduct.color,
          count: payload.count + "",
          day: this.today,
          description: this.selectedProduct.description,
          discount: this.selectedProduct.discount,
          expireDate: this.selectedProduct.expireDate,
          images: this.selectedProduct.images,
          itemCode: this.selectedProduct.itemCode,
          itemName: this.selectedProduct.itemName,
          month: this.month,
          productId: this.selectedProduct.id,
          rating: this.selectedProduct.rating,
          relation: payload.relation + "",
          relationNumber: payload.relationNumber + "",
          kitchenType: this.selectedProduct.kitchenType || "",
          kitchenId: this.selectedProduct.kitchenId || "",
          cookStatus: "Pending",
          remark: "",
          printCount: "0",
          sellPrice: payload.sellPrice,
          size: this.selectedProduct.size,
          stock: this.selectedProduct.stock,
          tableId: this.getDetailData.tableIdList,
          time: timestamp,
          type: this.selectedProduct.type,
          weight: this.selectedProduct.weight,
          year: this.year,
        };
        console.log("dfwdwq", submitData);
        this.selectedSellProduct.push(submitData);

        const OrderRef = await db
          .collection(this.owner.city)
          .doc(this.owner.shopId)
          .collection("tableReservation")
          .doc(this.getDetailData.id)
          .collection("orders")
          .doc();
        OrderRef.set({
          ...submitData,
          id: OrderRef.id,
        });
      }
    },
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
        let sameIndex = this.selectedSellProduct.findIndex(
          (p) => p.productId === order.productId
        );
        console.log("has");
        this.selectedSellProduct[sameIndex].count = parseInt(order.count) + 1;
        db.collection(this.owner.city)
          .doc(this.owner.shopId)
          .collection("tableReservation")
          .doc(this.getDetailData.id)
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
                  .collection("tableReservation")
                  .doc(this.getDetailData.id)
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
            .collection("tableReservation")
            .doc(this.getDetailData.id)
            .collection("orders")
            .doc(order.id)
            .update({
              count: a + "",
            });
        }
      }

      // db.collection(this.owner.city)
      //   .doc(this.owner.shopId)
      //   .collection("tables")
      //   .doc(this.selectedTable.id)
      //   .collection("orders")
      //   .doc(order.id)
      //   .update({
      //     count: a + "",
      //   });
      // }

      // else {
      //   let relationCount = a * parseInt(order.relationNumber);
      //   if (
      //     this.selectedSellProduct.some(
      //       (selected) => selected.productId === order.productId
      //     )
      //   ) {
      //     console.log("same product with stock");
      //     this.selectedSellProduct.forEach((prod, i) => {
      //       console.log("same?", prod.productId === order.productId);
      //       if (prod.productId === order.productId) {
      //         totalCount +=
      //           parseInt(prod.count) * parseInt(prod.relationNumber);
      //       }
      //       if (i + 1 === this.selectedProduct.length) {
      //         console.log(totalCount, "=", relationCount);
      //         if (totalCount <= relationCount) {
      //           console.log("condition ok");
      //           db.collection(this.owner.city)
      //             .doc(this.owner.shopId)
      //             .collection("tables")
      //             .doc(this.selectedTable.id)
      //             .collection("orders")
      //             .doc(order.id)
      //             .update({
      //               count: a + "",
      //             });
      //         } else {
      //           this.infoModalActive = true;
      //           this.modalMessage = "Out of stock";
      //         }
      //       }
      //     });
      //   } else {
      //     db.collection(this.owner.city)
      //       .doc(this.owner.shopId)
      //       .collection("tables")
      //       .doc(this.selectedTable.id)
      //       .collection("orders")
      //       .doc(order.productId)
      //       .get()
      //       .then((snapshot) => {
      //         if (relationCount <= snapshot.data().stock) {
      //           db.collection(this.owner.city)
      //             .doc(this.owner.shopId)
      //             .collection("tables")
      //             .doc(this.selectedTable.id)
      //             .collection("orders")
      //             .doc(order.id)
      //             .update({
      //               count: a + "",
      //             });
      //         } else {
      //           this.infoModalActive = true;
      //           this.modalMessage = "Out of stock";
      //         }
      //       });
      //   }
      // }
    },

    async decreaseCount(order) {
      let a = parseInt(order.count);
      let sameIndex = this.selectedSellProduct.findIndex(
        (p) => p.productId === order.productId
      );
      if (a > 1) {
        a--;
        await db
          .collection(this.owner.city)
          .doc(this.owner.shopId)
          .collection("tableReservation")
          .doc(this.getDetailData.id)
          .collection("orders")
          .doc(order.id)
          .update({
            count: parseInt(order.count) - 1,
          });
        this.selectedSellProduct[sameIndex].count = parseInt(order.count) - 1;
      } else {
        this.selectedSellProduct = this.selectedSellProduct.filter((el) => {
          return el.id !== order.id;
        });

        await db
          .collection(this.owner.city)
          .doc(this.owner.shopId)
          .collection("tableReservation")
          .doc(this.getDetailData.id)
          .collection("orders")
          .doc(order.id)
          .delete();
      }
    },
    // setViewOption(value) {
    //   localStorage.setItem("gridView", value);
    //   this.gridView = value;
    //   window.location.reload();
    // },
    /*searchProductFromServer:debounce(function (e){
      if(e.target.value!==''){
        //orderBy(this.selectedSearchType).startAt(this.search).endAt(this.search+"~")
        db.collection(this.owner.city)
            .doc(this.owner.shopId)
            .collection('products').where('itemName',">=",e.target.value).where("itemName","<=",e.target.value+'\uf8ff').onSnapshot(snapshot=>{
          this.products = [];
          snapshot.docs.filter(e=>{
            const isDuplicate = this.products.includes(e.id);
            if(!isDuplicate){
              this.products.push(e.data());
              return true;
            }
            return false;
          })
        })
      }else {
        this.products = [];
      }
    }, 500),*/

    //Selecting search item

    cancel() {
      this.confirmActive = !this.confirmActive;
      this.focusInput();
    },
    closeModal() {
      this.infoModalActive = !this.infoModalActive;
      this.focusInput();
    },

    closeDialog() {
      this.showDialog = !this.showDialog;
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
  height: 60vh;
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
