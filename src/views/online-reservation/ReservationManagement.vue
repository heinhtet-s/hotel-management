<template>

  <AdminSidebar>
    <Loading v-if="loadingActive" />
    <InfoDialog v-if="modalActive" :modal-message="modalMessage" v-on:close-modal="closeModal" />
    <confirm-dialog :modal-message="modalMessage" v-if="confirmActive" v-on:confirm="confirm" v-on:cancel="cancel" />
    <div class="">
      <!-- stock Modal -->
      <div class="modal fade" style="z-index: 30000" id="stockModal" tabindex="-1" aria-labelledby="stockModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-body">
              <p class="text-center fs-5">{{ $t("message.add_stock") }}</p>
              <div class="d-flex py-3 align-items-center justify-content-between">
                <span class="fs-5 text-truncate">{{
                  selectedProduct.itemName
                }}</span>
                <span class="badge bg-success rounded-pill">Stock: {{ selectedProduct.stock }} Pcs</span>
              </div>
              <span v-if="frontUnit !== 'Pcs'">1 {{ frontUnit }} = {{ selectedRelation.backNumber }} Pcs</span>
              <!--          <input type="number" class="form-control " placeholder="Count" v-model="update_stock">-->
            </div>
          </div>
        </div>
      </div>

      <!-- Excel Modal -->

      <div class="header-bar">
        <div class="d-flex align-items-center justify-content-between rounded mb-2">
          <div class="d-flex rounded align-items-center mt-2">
            <button @click="$router.back()" class="btn me-2 float-start border-0" style="color: var(--text-color)">
              <i class="fas fa-chevron-left"> </i>
            </button>
            <span class="fs-4"> {{ $t('message.reservation') }} </span>
          </div>
        </div>
        <div class="d-flex justify-content-between align-items-center">
          <ul class="text-start d-block list-unstyled border-0 align-center d-none">
            <li class="d-inline-block mx-1 category-list" :class="
              selectedCategory === 'restaurant' ? 'category-list-active' : ''
            " @click="selectCategory('restaurant')">
              <span class="mx-2">Restaurant</span>
            </li>
            <li class="d-inline-block mx-1 category-list"
              :class="selectedCategory === 'bar' ? 'category-list-active' : ''" @click="selectCategory('bar')">
              <span class="mx-2">Bar</span>
            </li>
          </ul>
          <button type="button" @click="selectCategory('admin')" class="btn btn-sm mx-2"
            style="background-color: var(--primary)">
            <span class="mx-2 text-nowrap" style="color: white"><i class="fas fa-plus-circle"></i> {{ $t('message.create_booking') }} | {{selectedCategory}}</span>
          </button>
        </div>

        <div class="d-flex justify-content-between align-items-center">
          <div class="dropdown">
              <button class="btn dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown"
                aria-expanded="false">
                <i class="fas fa-filter"></i>
                <span v-if="selectedFilterType === 'all'"> All </span>
                <span v-if="selectedFilterType === 'pending'"> pending </span>
                <span v-if="selectedFilterType === 'reject'">reject</span>
                <span v-if="selectedFilterType === 'approve'">approve</span>
              </button>
              <ul class="dropdown-menu" style="z-index: 5000" aria-labelledby="dropdownMenuButton1">
                <li style="cursor: pointer;">
                  <a class="dropdown-item" @click="selectFilterType('all')">
                    all
                  </a>
                </li>
                <li style="cursor: pointer;">
                  <a class="dropdown-item" @click="selectFilterType('pending')">
                    pending
                  </a>
                </li>
                <li style="cursor: pointer;">
                  <a class="dropdown-item" @click="selectFilterType('approve')">
                    approve
                  </a>
                </li>
                <li style="cursor: pointer;">
                  <a class="dropdown-item" @click="selectFilterType('reject')">reject</a>
                </li>
              </ul>
            </div>
            <input type="text" v-model="search" @input="searchRes"
              :placeholder="$t('message.search')" class="form-control w-25 mx-2" />
          <div class="btn-group p-1" role="group" aria-label="Basic radio toggle button group">
            <input type="radio" class="btn-check" @click="showDaily" name="btnradio" id="btnradio1" autocomplete="off"
              checked />
            <label class="btn check-btn" :class="dateType === 'day' ? 'btn-primary' : ''" for="btnradio1">{{
              $t("message.daily")
            }}</label>

            <input type="radio" class="btn-check" @click="showMonthly" name="btnradio" id="btnradio2"
              autocomplete="off" />
            <label class="btn check-btn" :class="dateType === 'month' ? 'btn-primary' : ''" for="btnradio2">{{
              $t("message.monthly")
            }}</label>
            <input type="radio" class="btn-check" @click="showYearly" name="btnradio" id="btnradio3"
              autocomplete="off" />
            <label class="btn check-btn" :class="dateType === 'year' ? 'btn-primary' : ''" for="btnradio3">{{
              $t("message.yearly")
            }}</label>
          </div>
          <div class="date-panel mt-2 mb-2">
            <div class="d-flex align-items-center rounded">
              <input type="date" @change="formatDate" class="form-control" v-if="dateType === 'day'" />
              <input v-if="dateType === 'month'" type="month" @change="filterMonth"
                class="form-control border-1 border-secondary" style="
                  background-color: var(--white) !important;
                border: 1px solid gray !important;
                " />
              <NextDatePicker v-if="dateType === 'year'" v-model="selectedYear" class="border-1 border-secondary"
                @change="yearChange" type="year" placeholder="Select year"></NextDatePicker>
            </div>
          </div>
        </div>


      </div>

      <div class="px-0 table-card table-responsive">
        <table class="table table-hover table-striped">
          <thead>
            <tr>
              <th class="text-nowrap">{{ $t('message.name') }}</th>
              <th class="text-nowrap">{{$t('message.phone')}}</th>
              <th class="text-nowrap">{{ $t('message.people_count') }}</th>
              <th class="text-nowrap">{{ $t('message.table_count') }}</th>
              <th class="text-nowrap" v-if="showStatus">{{$t('message.status')}}</th>
              <th class="text-nowrap">{{$t('message.booking_date')}}</th>

              <th class="text-nowrap">{{ $t('message.reserved_date') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="reservation in filterRes" class="align-middle" :key="reservation.id">
              <!--             {{product.buyPrice}}, {{product.sellPrice}}, {{product.stock}},{{product.itemName}}-->
              <td class="text-nowrap">
                {{ reservation.customerName }}
              </td>
              <td class="text-truncate">
                {{ reservation.customerPhone }}
              </td>
              <td class="text-nowrap">
                {{ reservation.peopleCount }}
              </td>
              <td class="text-nowrap">
                {{ reservation.tableCount }}
              </td>
              <td class="text-nowrap" v-if="showStatus">
                {{ reservation.status }}
              </td>
              <td class="text-nowrap">
                {{ reservation.startDate + " " + reservation.startTime }}
              </td>
              <td class="text-nowrap">
                {{ reservation.dateTime }}
              </td>

              <td class="text-nowrap text-center">
                <button class="btn btn-sm btn-primary me-2" @click="showReservationDetail(reservation)">
                  <i class="fas fa-info-circle"></i> Detail
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="w-100 d-flex align-items-center justify-content-center">
        <div v-if="ReservationData.length>pageCount">
          <pagination :totalPages="pageCount" :perPage="perPage" :currentPage="currentPage" :pages="ReservationData"
            @pagechanged="onPageChange" />
        </div>
        <!--          <button class="btn btn-primary my-3" @click="loadMore">LoadMore</button>-->
      </div>
    </div>
  </AdminSidebar>
</template>

<script>
// import axios from "axios";

import db, { timestamp } from "@/config/FirebaseInit";
import Loading from "@/components/Loading";
import InfoDialog from "@/components/InfoDialog";
import ConfirmDialog from "@/components/ConfirmDialog";
import AdminSidebar from "@/components/AdminSidebar";
import * as XLSX from "xlsx";
import "lodash/debounce";
import { debounce } from "lodash";
import Pagination from "@/components/Pagination";
export default {
  components: { ConfirmDialog, Loading, InfoDialog, AdminSidebar, Pagination },
  data() {
    return {
      //pagination
      currentPage: 0,
      selectedFilterType: "all",
      selectedDate: "",
      selectedYear: "",
      showVCalendar: false,
      dateType: "day",
      perPage: 10,
      //end pagination
      filterExportData: [],
      showLowStock: false,
      ReservationData: [],
      search: "",
      selectedCategory: "",
      selectedSearchType: "",
      confirmActive: false,
      modalActive: false,
      modalMessage: "",
      loadingActive: false,
      selectedId: "",
      excelProducts: [],
      // filterProducts:[],
      // searchProducts:[],
      productBeforeSlice: [],
      selectedProduct: "",
      frontUnit: "Pcs",
      frontNumber: 1,
      limit: 50,
      relations: [],
      update_stock: "",
      selectedRelation: "",
      // products:[],
      lastProduct: "",
      loadActive: false,
      lowStockProducts: [],
    };
  },
  computed: {
    showStatus() {
      return this.selectedFilterType === "all";
    },
    offsetCount() {
      return this.currentPage * this.perPage;
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
    products() {
      return this.$store.getters.getAllProducts;
    },
    filterExportProducts() {
      let filterInv = [];
      for (let i = 0; i < this.products.length; i++) {
        filterInv.push(this.products[i]);
      }
      return filterInv;
    },
    currentYear() {
      return this.$store.getters.getYear;
    },
    owner() {
      return this.$store.getters.getShopOwner;
    },
    filterCategories() {
      return this.productCategories.filter((p) => p.name !== "All");
    },
    productCategories() {
      return this.$store.getters.getProductCategories;
    },
    shopInfo() {
      return this.$store.getters.getShopInfo;
    },
    filterRes() {
      let filterInv = [];
      if (this.search !== "") {
        filterInv = this.ReservationData.filter(
          (pd) =>
            pd.customerName.toLowerCase().includes(this.search.toLowerCase()) ||
            pd.customerPhone.toString().includes(this.search.toLowerCase())
        );
        console.log("filtering", filterInv);
        return filterInv.slice(
          this.offsetCount,
          this.offsetCount + this.perPage
        );
      } else {
        console.log("no filtering", this.invoices);

        return this.ReservationData.slice(
          this.offsetCount,
          this.offsetCount + this.perPage
        );
      }
    },
    cashierAcc() {
      return this.$store.getters.getCashierAcc;
    },
    // searchProduct(){
    //   searchProducts = this.products.filter(
    //           (pd) =>
    //             pd.customerName.toLowerCase().includes(this.search.toLowerCase()) ||
    //             pd.phone.toLowerCase().includes(this.search.toLowerCase())
    //         );
    // }
    // filterProducts() {
    //   let searchProducts = [];
    //   // if (this.showLowStock) {
    //   //   let lowStockLists = [];
    //   //   for (let i = 0; i < this.products.length; i++) {
    //   //     if (
    //   //       parseInt(this.products[i].stock) <= parseInt(this.shopInfo.lowStock)
    //   //     ) {
    //   //       lowStockLists.push(this.products[i]);
    //   //     }
    //   //   }
    //   //   return {
    //   //     product: lowStockLists.slice(
    //   //       this.offsetCount,
    //   //       this.offsetCount + this.perPage
    //   //     ),
    //   //     prodCount: lowStockLists.length,
    //   //   };
    //   // } else
    //   if (this.search !== "") {
    //     searchProducts = this.products.filter(
    //       (pd) =>
    //         pd.customerName.toLowerCase().includes(this.search.toLowerCase()) ||
    //         pd.phone.toLowerCase().includes(this.search.toLowerCase())
    //     );
    //     return {
    //       product: searchProducts.slice(
    //         this.offsetCount,
    //         this.offsetCount + this.perPage
    //       ),
    //       prodCount: searchProducts.length,
    //     };
    //   } else if (this.selectedCategory !== "All") {
    //     searchProducts = this.products.filter(
    //       (pd) => pd.type === this.selectedCategory
    //     );
    //     return {
    //       product: searchProducts.slice(
    //         this.offsetCount,
    //         this.offsetCount + this.perPage
    //       ),
    //       prodCount: searchProducts.length,
    //     };
    //   } else {
    //     return {
    //       product: this.products.slice(
    //         this.offsetCount,
    //         this.offsetCount + this.perPage
    //       ),
    //       prodCount: this.products.length,
    //     };
    //   }
    // },

    pageCount() {
      return Math.ceil(this.ReservationData.length / this.perPage);
    },
  },
  async created() {
    this.selectedCategory = this.$route.params.type;
    console.log(this.$route.params.type);
    this.$store.dispatch("getDateTime");
    this.$store.dispatch("getDay");
    this.$store.dispatch("getMonth");
    this.$store.dispatch("getYear");
    this.$store.dispatch("getProductCategories", this.owner);
    this.$store.dispatch("getShopInfo", this.owner);
    this.$store.dispatch("getAllProducts", this.owner);
    this.$store.dispatch("getCashierAcc", this.owner);
    this.selectedCategory = this.cashierAcc.counter;
    if (localStorage.getItem("selectedProductSearchType")) {
      this.selectedSearchType = localStorage.getItem(
        "selectedProductSearchType"
      );
    }
  },

  async mounted() {
    // this.$route.params.category
    this.selectedDate = this.currentDay;
    this.fetchReservation();
  },
  methods: {
    showReservationDetail(data) {
      this.$store.commit("SET_TABLE_RESERVATION_DETAIL", data);
      this.$router.push({ name: "MakeReservation" });
    },
    onPageChange(page) {
      console.log(page);
      this.currentPage = page;
    },
    selectCategory(type) {
      if (type == "admin") {
        this.$router.push({ name: "adminReservation" });
        return;
      }
      this.$router.push({
        name: "reservationManagement",
        params: { type: type },
      });
      this.selectedCategory = type;
      this.fetchReservation();
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
      this.selectedDate = payload;
      this.dateType = "day";
      this.fetchReservation();
    },
    // TODO: delete all product function
    /* async deleteAll(){
     await db.collection('').doc('').collection('').where('day','==','25-Aug-2022').get().then(snapshot=>{
        console.log(snapshot.size)
        snapshot.forEach(doc=>{
          console.log(doc.data().itemName)
          db.collection('').doc('').collection('products').doc(doc.data().id).delete().then(()=>{
            console.log('deleted')
          });
        })
      })
    },*/

    async loadMore() {
      if (this.selectedCategory !== "All") {
        await db
          .collection(this.shopInfo.city)
          .doc(this.shopInfo.id)
          .collection("products")
          .where("type", "==", this.selectedCategory)
          .startAfter(this.lastProduct)
          .limit(this.limit)
          .onSnapshot((documentSnapshots) => {
            if (documentSnapshots.size < 1) {
              console.log("empty snapshot");
              this.modalActive = true;
              this.modalMessage = "That's All Products";
            } else {
              this.lastProduct =
                documentSnapshots.docs[documentSnapshots.docs.length - 1];
              documentSnapshots.docs.map((doc) => {
                /* if(this.searchProducts.some(p=>p.id !== doc.data().id)){
                   }*/
                this.searchProducts.push(doc.data());
              });
            }
          });
      } else {
        await db
          .collection(this.shopInfo.city)
          .doc(this.shopInfo.id)
          .collection("products")
          .startAfter(this.lastProduct)
          .limit(this.limit)
          .onSnapshot((documentSnapshots) => {
            if (documentSnapshots.size < 1) {
              console.log("empty snapshot");
              this.modalActive = true;
              this.modalMessage = "That's All Products";
            } else {
              this.lastProduct =
                documentSnapshots.docs[documentSnapshots.docs.length - 1];
              documentSnapshots.docs.map((doc) => {
                // if(this.products.some(p=>p.id !== doc.data().id)){
                // }
                this.products.push(doc.data());
              });
            }
          });
      }
    },
    searchRes(e) {
      console.log("search", this.search);
      console.log("search", e.target.value);
      console.log("search", this.searchReservation);
      if (e.target.value !== "") {
        this.ReservationData = this.searchReservation.filter(
          (pd) =>
            pd.customerName
              .toLowerCase()
              .includes(e.target.value.toLowerCase()) ||
            pd.customerPhone.toString().includes(e.target.value.toLowerCase())
        );
      } else {
        this.ReservationData = this.searchReservation;
      }
    },
    async yearChange() {
      let date = new Date(this.selectedYear);
      this.selectedDate = new Intl.DateTimeFormat("en", {
        year: "numeric",
      }).format(date);
      this.fileName = this.selectedDate + "-sell-report";
      this.dateType = "year";
      await this.fetchReservation();
    },
    async showDaily() {
      this.currentPage = 0;
      this.dateType = "day";
      this.selectedDate = this.currentDay;
      this.fileName = this.selectedDate + "-daily-sell-report";
      await this.fetchReservation();
    },
    async showMonthly() {
      this.currentPage = 0;
      this.dateType = "month";
      this.selectedDate = this.currentMonth;
      this.fileName = this.selectedDate + "-monthly-sell-report";
      await this.fetchReservation();
    },
    async showYearly() {
      this.currentPage = 0;
      this.dateType = "year";
      this.selectedDate = this.currentYear;
      this.fileName = this.selectedDate + "-yearly-sell-report";
      await this.fetchReservation();
    },
    async filterMonth(e) {
      let date = new Date(e.target.value);
      let month = new Intl.DateTimeFormat("en", { month: "short" }).format(
        date
      );
      let year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(
        date
      );
      this.selectedDate = month + "-" + year;
      console.log(this.selectedDate);
      this.fileName = this.selectedDate + "-sell-report";
      this.dateType = "month";
      await this.fetchReservation();
    },
    // .where('type','==',this.selectedCategory)
    fetchReservation() {
      console.log("ggls", this.$route.params.type);
      if (this.selectedFilterType === "all") {
        db.collection(this.owner.city)
          .doc(this.owner.shopId)
          .collection("tableReservation")
          .where("type", "==", this.selectedCategory)
          .where(this.dateType, "==", this.selectedDate)
          .onSnapshot((snapshot) => {
            this.ReservationData = [];
            this.searchReservation = [];
            snapshot.forEach((doc) => {
              // if(this.searchProducts.some(p=>p.id!==doc.data().id)){
              // }
              this.ReservationData.push(doc.data());
              this.searchReservation.push(doc.data());
              console.log("gg", doc.data());
            });
          });
      } else {
        db.collection(this.owner.city)
          .doc(this.owner.shopId)
          .collection("tableReservation")
          .where("status", "==", this.selectedFilterType)
          .where("type", "==", this.selectedCategory)
          .onSnapshot((snapshot) => {
            this.ReservationData = [];
            this.searchReservation = [];
            snapshot.forEach((doc) => {
              // if(this.searchProducts.some(p=>p.id!==doc.data().id)){
              // }
              this.ReservationData.push(doc.data());
              this.searchReservation.push(doc.data());
              console.log("gg", doc.data());
            });
          });
      }

      console.log("gg", this.ReservationData);
      // this.searchProducts.splice(0,this.searchProducts.length);
      // this.filterProducts.splice(0,this.filterProducts.length);
      // this.selectedCategory = name;
      // this.$router.replace({
      //   name: "ProductList",
      //   params: { category: this.selectedCategory },
      // });
      /*if(this.selectedCategory!=='All'){
        db.collection(this.shopInfo.city)
            .doc(this.shopInfo.id)
            .collection('products').where('type','==',this.selectedCategory).limit(this.limit).onSnapshot(snapshot => {
          snapshot.forEach(doc=>{
            // if(this.searchProducts.some(p=>p.id!==doc.data().id)){
            // }
            this.searchProducts.push(doc.data())

          });
          if(snapshot.size===50){
            this.loadActive = true;
          }
          this.lastProduct = snapshot.docs[snapshot.docs.length-1];
          console.log('cate')
          console.log('cate search',this.searchProducts.length)
        })
      }else {
        this.search='';
        db.collection(this.shopInfo.city)
            .doc(this.shopInfo.id)
            .collection('products').limit(this.limit).onSnapshot(snapshot => {
          snapshot.forEach(doc=>{
            this.filterProducts.push(doc.data())
          });
          if(snapshot.size===50){
            this.loadActive = true;
          }
          this.lastProduct = snapshot.docs[snapshot.docs.length-1];
          console.log('cate')
          console.log('cate search',this.searchProducts.length)
        })
      }*/
    },
    getSelectedRelation() {
      let selected = "";
      selected = this.relations.filter((relation) => {
        return relation.frontUnit === this.frontUnit.toString();
      });
      this.selectedRelation = selected[0];
    },

    async updateStock() {
      let newStock = 0;
      let count = 0;
      this.loadingActive = true;
      if (this.frontNumber !== "") {
        if (this.frontUnit !== "Pcs") {
          count =
            parseInt(this.selectedRelation.backNumber) *
            parseInt(this.frontNumber);
          newStock =
            parseInt(this.selectedProduct.stock) +
            parseInt(this.selectedRelation.backNumber) *
            parseInt(this.frontNumber);
        } else {
          count = this.frontNumber;
          if (this.selectedProduct.stock === "") {
            newStock = parseInt(this.frontNumber);
          } else {
            newStock =
              parseInt(this.selectedProduct.stock) + parseInt(this.frontNumber);
          }
        }
        await db
          .collection(this.owner.city)
          .doc(this.owner.shopId)
          .collection("products")
          .doc(this.selectedProduct.id)
          .update({
            stock: newStock.toString(),
          })
          .then(() => {
            console.log("stock update");
            const recordRef = db
              .collection(this.owner.city)
              .doc(this.owner.shopId)
              .collection("products")
              .doc(this.selectedProduct.id)
              .collection("records")
              .doc();
            recordRef
              .set({
                id: this.selectedProduct.id,
                recordId: recordRef.id,
                itemCode: this.selectedProduct.itemCode,
                barcode: this.selectedProduct.barcode,
                itemName: this.selectedProduct.itemName,
                buyPrice: this.selectedProduct.buyPrice,
                sellPrice: this.selectedProduct.sellPrice,
                stock: this.selectedProduct.stock.toString(),
                description: this.selectedProduct.description,
                type: this.selectedProduct.type,
                color: this.selectedProduct.color,
                size: this.selectedProduct.size,
                weight: this.selectedProduct.weight,
                time: timestamp,
                day: this.currentDay,
                month: this.currentMonth,
                year: this.currentYear,
                dateTime: this.currentDateTime,
                rating: this.selectedProduct.rating,
                discount: this.selectedProduct.discount,
                note: "default",
                process: "stockUpdate",
                count: "+" + count.toString(),
              })
              .then(() => {
                console.log("record updated");
                this.frontNumber = "";
                this.frontUnit = "Pcs";
                this.loadingActive = false;
                this.modalActive = true;
                this.modalMessage = "Updated Successfully!";
              });
          });
      } else {
        this.loadingActive = false;
        this.modalActive = true;
        this.modalMessage = "Please fill stock!";
      }
    },

    selectProduct(product) {
      this.selectedProduct = product;
      this.frontNumber = 1;
      this.frontUnit = "Pcs";
      db.collection(this.owner.city)
        .doc(this.owner.shopId)
        .collection("products")
        .doc(product.id)
        .collection("relation")
        .onSnapshot((snapshot) => {
          this.relations = [];
          snapshot.forEach((doc) => {
            this.relations.push(doc.data());
          });
          // console.log(this.relations)
        });
    },

    selectFilterType(type) {
      this.selectedFilterType = type;
      this.fetchReservation();
    },

    searchProduct: debounce(function (e) {
      if (this.search !== "") {
        if (
          this.selectedSearchType === "barcode" ||
          this.selectedSearchType === "itemCode"
        ) {
          this.search = this.search.replace(/\s/g, "");
          db.collection(this.owner.city)
            .doc(this.owner.shopId)
            .collection("products")
            .where(this.selectedSearchType, "==", this.search)
            .onSnapshot((snapshot) => {
              this.searchProducts = [];
              snapshot.forEach((doc) => {
                this.searchProducts.push(doc.data());
              });
            });
        } else {
          db.collection(this.owner.city)
            .doc(this.owner.shopId)
            .collection("products")
            .where("itemName", ">=", e.target.value)
            .where("itemName", "<=", e.target.value + "\uf8ff")
            .onSnapshot((snapshot) => {
              this.searchProducts = [];
              snapshot.docs.filter((e) => {
                const isDuplicate = this.products.includes(e.id);
                if (!isDuplicate) {
                  this.searchProducts.push(e.data());
                  return true;
                }
                return false;
              });
            });
        }
      }
    }, 500),

    onChangeInput(e) {
      let files = e.target.files,
        f = files[0];
      let reader = new FileReader();

      reader.onload = (e) => {
        let data = new Uint8Array(e.target.result);
        let workbook = XLSX.read(data, { type: "array" });
        let sheetName = workbook.SheetNames[0];
        /* DO SOMETHING WITH workbook HERE */
        console.log("workbook", workbook);
        let worksheet = workbook.Sheets[sheetName];
        this.excelProducts = XLSX.utils.sheet_to_json(worksheet);
      };
      reader.readAsArrayBuffer(f);
    },

    getRandomStr() {
      const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let result = "";
      for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    },

    getBarcodeForExcel() {
      this.excelProducts.forEach((p) => {
        p.barcode = this.shopInfo.shopCode + this.getRandomStr();
      });
    },

    //TODO: excel import
    extractExcel() {
      console.log(this.excelProducts);
      this.excelProducts.forEach((product) => {
        let productRef = db
          .collection(this.owner.city)
          .doc(this.owner.shopId)
          .collection("products")
          .doc();
        productRef
          .set({
            barcode: product.barcode.toString(),
            buyPrice: product.buyPrice.toString(),
            color: "All",
            youtubeLink: "",
            time: timestamp,
            day: this.currentDay,
            description: "",
            discount: "0",
            expireDate: "",
            id: productRef.id,
            images: [],
            itemCode: product.barcode + "",
            itemName: product.itemName + "",
            month: this.currentMonth,
            dateTime: this.currentDateTime,
            rating: "",
            sellPrice: product.sellPrice + "",
            size: product.size + "",
            stock: product.stock + "",
            type: product.type + "",
            weight: "",
            year: this.currentYear,
          })
          .then(() => {
            console.log("added");
            /*let productRefRecord = db.collection('Lashio').doc('flowerpharmacyfpy2022-07-04').collection('products').doc(productRef.id).collection('records').doc();
          productRefRecord.set({
            'id': productRefRecord.id,
            'recordId': productRefRecord.id,
            'itemCode': product.barcode,
            'barcode': product.barcode,
            'itemName': product.itemName,
            'buyPrice': product.buyPrice.toString(),
            'sellPrice': product.sellPrice.toString(),
            'stock': product.stock.toString(),
            'description': "",
            'type': product.type.toString(),
            'color': "All",
            'size': "Free",
            'weight': "",
            'time': timestamp,
            'day': this.currentDay,
            'month': this.currentMonth,
            'dateTime':this.currentDateTime,
            'year': this.currentYear,
            'rating':"",
            'discount':"",
            'note': '',
            'process': 'add',
            'count': product.stock.toString(),
          })*/
          });
      });
    },

    async showStock(e) {
      if (e.target.checked) {
        await db
          .collection(this.owner.city)
          .doc(this.owner.shopId)
          .update({
            showStock: "yes",
          })
          .then(() => {
            console.log("updated");
          });
      } else {
        await db
          .collection(this.owner.city)
          .doc(this.owner.shopId)
          .update({
            showStock: "no",
          })
          .then(() => {
            console.log("updated");
          });
      }
    },

    viewItemDetails(product) {
      this.$router.push({
        name: "ProductDetail",
        params: { product_id: product.id },
      });
    },

    closeModal() {
      this.modalActive = !this.modalActive;
    },
    async confirm() {
      this.confirmActive = !this.confirmActive;
      this.loadingActive = true;
      /*
            await db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(this.selectedId).collection('records').get().then(result=>{
              result.forEach(doc=>{
                doc.ref.delete()
              })
              db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(this.selectedId).delete().then(()=>{
                this.loadingActive = false;
                this.modalMessage = "Deleted Successfully";
                this.modalActive = true;
              })
            })
      */
    },
    cancel() {
      this.confirmActive = !this.confirmActive;
    },
    deleteProduct(id) {
      this.selectedId = id;
      this.modalMessage = `Are you sure to delete this id : ${this.selectedId}?`;
      this.confirmActive = true;
    },
  },
};
</script>

<style scoped>
.header-bar {
  top: 5px;
  background-color: var(--background-color);
}

tr,
td,
th {
  cursor: pointer;
  border: 1px solid var(--light) !important;
  color: var(--text-color) !important;
}

thead,
tbody {
  border: 1px solid var(--light) !important;
  color: var(--dark);
}

.category-box {
  width: 400px;
  /*z-index: 1000;*/
  /*background-color: var(--side-bar-bg);*/
  display: flex;
  position: sticky;
  box-sizing: border-box;
  height: inherit;
  align-items: center;
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
  background-color: var(--primary) !important;
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

.category-list-active {
  color: white;
  background-color: var(--primary) !important;
}

.category-list:hover {
  background-color: var(--primary);
}

.category-box ul {
  width: 100%;
  border-radius: var(--border-radius);
  background-color: var(--side-bar-bg);
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
  margin-left: 5px;
  border-radius: var(--border-radius);
  background-color: var(--white);
  transition: 0.3s;
}

.table-card {
  background-color: var(--light);
  height: 65vh;
  overflow-y: scroll;
}

@media only screen and (max-width: 1030px) {
  .category-box ul {
    width: 98%;
  }

  .header-bar {
    left: 0px;
    margin-top: 20px;
    width: 100%;
  }

  .table-card {
    margin-top: 200px;
  }
}
</style>
