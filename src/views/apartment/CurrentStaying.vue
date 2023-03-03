<template>
  <div>
    <Loading v-if="loadingActive" />
    <ConfirmDialog modal-message="Click Yes to add these items to order" v-if="showConfirmDialog"
      v-on:confirm="confirmOrder" v-on:cancel="showConfirmDialog = false" />
    <AdminSidebar>
      <div class="" style="overflow: hidden;">
        <div class="pb-1" style="position: sticky;z-index: 1000;top: 0px;background-color: var(--background-color);
        ">
          <div class="d-lg-flex d-md-flex align-items-center rounded justify-content-between mb-2">
            <div class="d-flex align-items-center">
              <button @click="this.$router.back()" style="color: var(--primary)" class="btn border-0 float-start">
                <i class="fas fa-chevron-left"> </i>
               {{ $t('message.checkin_detail') }}
              </button>
            </div>
           
          </div>
          <div v-if="currentStaying" class="row" style="overflow-y: hidden">
            <div class="col-8 col-lg-3">
              <div v-if="currentStaying" class="d-flex flex-column">
                <table class="table">
                  <tbody>
                    <tr>
                      <td>{{ $t('message.customer_name') }}</td>
                      <td>{{ currentStaying?.customerName }} </td>
                    </tr>
                    <tr>
                      <td>{{ $t('message.phone') }}</td>
                      <td>
                        <a :href="'tel:'+currentStaying?.customerPhone">{{ currentStaying?.customerPhone }}</a>

                      </td>
                    </tr>
                    <tr>
                      <td>
                        {{ $t('message.room') }}
                      </td>
                      <td>
                        {{ currentStaying?.apartmentName }}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <hr>
              <h4 class="py-1">{{ $t('message.reserved_dates') }}</h4>
              <ul class="list-style-none ps-0">
                <li v-for="(date, id) in currentStaying.dateList" class="mb-2 p-2" style="background-color: var(--light);border-radius: var(--border-radius);" :key="id">
                  {{ date }}
                </li>
              </ul>
              <hr>
              <div class="d-flex align-items-center justify-content-between" style="height: max-content">
                  <div class="d-flex align-items-center">
                    <span>
                    {{$t('message.extra_bed')}} :
                  </span>
                  <input v-if="bedEdit" class="form-control" style="width: 2rem; margin-right: 0.5rem" type="number" v-model="extraBed" />
                  <p v-else style="
                  width: 2rem;
                     margin-right: 0.5rem;
                      padding-top: 1rem;
                      padding-left: 0.5rem;
                    ">
                    {{ extraBed }}
                  </p>
                  </div>
                  <button class="btn btn-sm btn-warning" v-if="bedEdit" @click="handleExtraBed">
                    {{$t('message.save')}}
                  </button>
                  <button class="btn btn-sm btn-warning" v-else @click="bedEdit = true">
                    {{$t('message.edit')}}
                  </button>
                </div>
            </div>
            </div>
            <div class="col-8 col-lg-3">
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
                  <div class="col-6" v-for="(product, index) in filterProducts.product" :key="index"
                    @click="handleSelectProduct(product)">
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
                            <span class="fw-bold" style="color: var(--text-color)">{{ product.itemName }}</span>
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
            <div class="col-12 col-lg-3 rounded">
              <div class="section-header justify-content-between">
                <button class="btn btn-sm btn-danger" @click="selectedSellProduct = []">
                  <i class="fa fa-filter-circle-xmark"></i>
                  <span class="ms-2">{{ $t('message.clear_all') }}</span>
                </button>
              </div>
              <div class="category-box px-2 mb-3">
                <div class="d-flex py-3 justify-content-between align-items-center">
                  <div class="">
                    <span class="text-end">{{ $t('message.total') }}</span>
                  </div>
                  <div>{{ selectedProductTotal }} Ks</div>
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
                        <div class="m-0" style="
                            background-color: var(
                              --background-color
                            ) !important;
                          ">
                          <div class="d-flex justify-content-between align-items-center align-items-start">
                            <div class="d-flex flex-column text-start">
                              <span style="color: var(--text-color)">{{
                                order.itemName.length > 80
                                  ? order.itemName.slice(0, 80) + '...'
                                  : order.itemName
                              }}</span>
                              <span style="color: var(--primary)">{{
                                parseInt(order.sellPrice).toLocaleString()
                              }}
                                Ks</span>
                            </div>
                            <!--                    <button class="btn btn-sm btn-sm" :id="order.id" @click="removeFromCart(order, index)"><i class="fas fa-trash"></i></button>-->
                            <div class="d-flex rounded justify-content-between align-items-center p-1"
                              style="width: 150px">
                              <button class="btn btn-sm text-white" style="background-color: var(--primary)"
                                @click="handleCount(order.id, 'decrease')">
                                -
                              </button>
                              <input class="form-control text-center border-0" disabled @focus="$event.target.select()"
                                style="background-color: blue" v-model="order.count" @input="countChangeInput(order)" />
                              <button class="btn btn-sm text-white" style="background-color: var(--primary)"
                                @click="handleCount(order.id, 'increase')">
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
              <div class="d-flex p-1 justify-content-center" style="background-color: var(--background-color)">
                <button style="background-color: var(--primary); width: 80%" :disabled="selectedSellProduct.length <= 0"
                  class="btn text-white" @click="showConfirmDialog = true">
                  {{ $t('message.add') }}
                </button>
              </div>
            </div>
            <div class="col-8 col-lg-3">
              <div style="height: 80vh; overflow-y: scroll">
                <div class="section-header justify-content-between">
                  <div class="">
                    <h3>{{ $t('message.ordered_foods') }}</h3>
                  </div>
                </div>
                <div>
                  <div v-for="(order, index) in addons" :key="index" style="margin-top: 1rem">
                    <h6 class="text-sm">{{ order.time }}</h6>
                    <div class="mt-3">
                      <div v-for="(item, index) in order.orders" :key="index"
                        class="rounded-1 mt-1 d-flex justify-content-between align-items-center"
                        style="background-color: var(--light); padding: 0.25rem">
                        <div class="d-flex flex-column text-start">
                          <span style="color: var(--text-color)">{{
                            item.itemName.length > 80
                              ? item.itemName.slice(0, 80) + '...'
                              : item.itemName
                          }}</span>
                          <span style="color: var(--primary)">{{
                            parseInt(item.sellPrice).toLocaleString()
                          }}
                            Ks</span>
                        </div>
                        <p>{{ item.count }} Pcs</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="d-flex w-full justify-content-between align-items-center pt-3">
                
                <router-link :to="{
                  name: 'ApartmentCheckout',
                  params: {
                    reservation_id: this.currentStaying?.id,
                  },
                  query: {
                    room_id: this.currentStaying?.apartmentId,
                  },
                }" class="btn btn-primary w-100 mt-2">
                  {{ $t('message.checkout') }}
                </router-link>
              </div>
            </div>
          </div>
          <div v-else class="w-100 d-flex align-items-center justify-content-center"
            style="height: 70vh; font-size: 1.5rem">
            There is no customer staying in this room
          </div>
        </div>
      </div>
    </AdminSidebar>
  </div>
</template>

<script>
import db from '@/config/FirebaseInit';
import AdminSidebar from '@/components/AdminSidebar';
import ConfirmDialog from '../../components/ConfirmDialog.vue';
import Loading from '@/components/Loading';
import Pagination from '@/components/Pagination'
export default {
  name: 'CurrentStaying',
  components: { AdminSidebar, ConfirmDialog, Loading, Pagination },
  data() {
    return {
      loadingActive: true,
      reservation: [],
      selectedProductTotal: 0,
      showConfirmDialog: false,
      apartment: null,
      addons: [],
      currentStaying: null,
      allProducts: [],
      selectedCategory: 'All',
      search: '',
      currentPage: 0,
      selectedSellProduct: [],
      extraBed: 0,
      bedEdit: false,

      perPage: 20,
    };
  },
  computed: {
    dateTime() {
      return this.$store.getters.getDateTime;
    },
    owner() {
      return this.$store.getters.getShopOwner;
    },
    productCategories() {
      return this.$store.getters.getProductCategories;
    },
    filterCategories() {
      return this.productCategories.filter((cate) => cate.name !== 'All');
    },
    filterProducts() {
      let filterProduct = [];
      if (this.search !== '') {
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
      } else if (this.selectedCategory !== 'All') {
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
      return Math.ceil(this.filterProducts?.prodCount / this.perPage);
    },
    offsetCount() {
      return this.currentPage * this.perPage;
    },
  },
  async mounted() {
    this.getApartment();
    await this.getAllProductsByKitchen();
  },
  watch: {
    selectedSellProduct: {
      handler(products) {
        console.log('called');
        console.log({ products });
        this.selectedProductTotal = products.reduce((acc, cur) => {
          const price = +cur.count * +cur.sellPrice;
          return acc + price;
        }, 0);
      },
      deep: true,
    },
  },

  methods: {
    async getApartment() {
      await db
        .collection(this.owner.city)
        .doc(this.owner.shopId)
        .collection('apartments')
        .doc(this.$route.params.roomID)
        .collection('reservations')
        .where('status', '==', 'checkIn')
        .onSnapshot((snapshot) => {
          const result = [];
          snapshot.forEach(
            (doc) => {
              const data = doc.data();
              result.push(data);
            },
            (error) => {
              this.loadingActive = false;
              console.log('apartment', error.message);
            }
          );
          this.loadingActive = false;

          this.currentStaying = result[0];
          this.extraBed = result[0].extraBed ? result[0].extraBed : 0;
          this.getOrderMenus(result[0].id);
        });
    },
    async getOrderMenus(id) {
      await db
        .collection(this.owner.city)
        .doc(this.owner.shopId)
        .collection('apartments')
        .doc(this.$route.params.roomID)
        .collection('reservations')
        .doc(id)
        .collection('orderMenu')
        .orderBy('time', 'desc')
        .onSnapshot((snapshot) => {
          const result = [];
          snapshot.forEach(
            (doc) => {
              const data = doc.data();
              result.push(data);
            },
            (error) => {
              this.loadingActive = false;
              console.log('apartment', error.message);
            }
          );
          this.addons = result;
          this.loadingActive = false;
        });
    },
    selectCate(name) {
      this.selectedCategory = name;
      this.currentPage = 0;
    },
    async getAllProductsByKitchen() {
      await db
        .collection(this.owner.city)
        .doc(this.owner.shopId)
        .collection('products')
        .where('kitchenType', '==', 'Restaurant')
        .orderBy('itemName', 'asc')
        .onSnapshot((snapshot) => {
          const products = [];

          snapshot.forEach((doc) => {
            products.push(doc.data());
          });
          this.allProducts = products;
        });
    },
    async handleSelectProduct(product) {
      const isExist = this.checkItsExist(product.id);
      if (isExist) {
        this.handleCount(product.id, 'increase');
        return;
      }
      this.selectedSellProduct.push({
        ...product,
        count: 1,
        cookStatus: 'pending',
      });
    },
    checkItsExist(id) {
      return (
        this.selectedSellProduct.filter((product) => product.id === id).length >
        0
      );
    },
    handleCount(id, method) {
      const product = this.selectedSellProduct.find((pro) => pro.id === id);
      if (method === 'decrease' && product.count === 1) {
        this.selectedSellProduct = this.selectedSellProduct.filter(
          (pro) => pro.id !== id
        );
        return;
      }
      if (method === 'decrease' && !product.count < 1)
        return (product.count -= 1);
      if (
        method === 'increase' &&
        product.count < (product.stock ? +product.stock : 999)
      )
        return (product.count += 1);
    },
    async confirmOrder() {
      if (this.selectedSellProduct.length === 0) return;
      await db
        .collection(this.owner.city)
        .doc(this.owner.shopId)
        .collection('apartments')
        .doc(this.$route.params.roomID)
        .collection('reservations')
        .doc(this.currentStaying.id)
        .collection('orderMenu')
        .add({
          time: this.dateTime,
          orders: this.selectedSellProduct,
        })
        .then(() => {
          this.selectedSellProduct = [];
          this.showConfirmDialog = false;
        });
    },
    async handleExtraBed() {
      await db
        .collection(this.owner.city)
        .doc(this.owner.shopId)
        .collection('apartments')
        .doc(this.$route.params.roomID)
        .collection('reservations')
        .doc(this.currentStaying.id)
        .update({
          extraBed: this.extraBed,
        })
        .then(() => {
          this.bedEdit = false;
        });
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
  height: 65vh;
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
