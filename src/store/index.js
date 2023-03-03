import createPersistedState from 'vuex-persistedstate';
import { createStore } from 'vuex';
import db from '../config/FirebaseInit';
import { getAuth } from 'firebase/auth';
// import {getAuth} from "firebase/auth";

// const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
/*const products = {
  namespaced:true,
  state:{
    lists:[],
    loading:false
  },
  mutations:{
    SET_PRODUCTS(state, payload){
      state.lists = payload;
    },
  },
  actions:{
    async getAllProducts({commit}, payload){
      // console.log(payload)
      await db.collection(payload.city)
          .doc(payload.shopId)
          .collection('products').orderBy('itemName','asc').onSnapshot(snapshot => {
            const result = [];
            snapshot.forEach(doc=>{
              result.push(doc.data());
            }, error=>{
              console.log("Product",error.message)
            });
            // console.log(result)
            commit("SET_PRODUCTS", result)
          })
    },
  }
}*/
export default createStore({
  state: {
    cities: [],
    selectedLiveItem: '',
    payment_types: '',
    user: '',
    fcmToken: '',
    cashierAcc: '',
    ReservationDetail: {},
    selectedSellProduct: [],
    selectedSellProductLists: [],
    transferTempLists: [],
    receivedBranch: '',

    selectedPurchaseProducts: [],
    selectedTable: '',

    voucher: '',
    selectedVoucherProduct: '',

    shopTypes: [],
    branches: [],
    selectedBranch: '',
    shopOwner: '',
    admin: '',
    cart_info: '',
    cart_items: [],
    currentShopId: '',

    products: [],
    tables: [],
    cashiers: [],

    productCategories: [],
    tableCategories: [],
    brands: [],
    colors: [],
    sizes: [],
    weights: [],
    kitchens: [],
    apartmentTypes: [],
    apartments: [],

    paymentMethods: [],
    sellItems: [],
    selectedCashier: '',
    shopInfo: '',

    dateTime: "",
    day: "",
    month: "",
    year: "",

    swimmingPollCategory:[],
    swimmingPollPartyCategory:[],

  },
  
  getters: {
    getAllApartmentTypes(state) {
      return state.apartmentTypes;
    },
    getAllApartments(state) {
      return state.apartments;
    },
    //restaurant, table
    getAllTables(state) {
      return state.tables;
    },
    getTableCategories(state) {
      return state.tableCategories;
    },
    getSelectedTable(state) {
      return state.selectedTable;
    },

    //owner stock transfer
    getReceivedBranch(state) {
      return state.receivedBranch;
    },
    getTransferTempList(state) {
      return state.transferTempLists;
    },
    //end owner stock transfer

    getCurrentShopID(state) {
      return state.currentShopId;
    },
    getVoucher(state) {
      return state.voucher;
    },

    getSelectedVoucherProduct(state) {
      return state.selectedVoucherProduct;
    },

    getSelectedBranch(state) {
      return state.selectedBranch;
    },
    getBranches(state) {
      return state.branches;
    },
    getShopTypes(state) {
      return state.shopTypes;
    },
    getSelectedSellProduct(state) {
      return state.selectedSellProduct;
    },
    getSelectedPurchaseProducts(state) {
      return state.selectedPurchaseProducts;
    },
    getSelectedSellProductLists(state) {
      return state.selectedSellProductLists;
    },
    getCashierAcc(state) {
      return state.cashierAcc;
    },
    getFCM(state) {
      return state.fcmToken;
    },
    getPaymentMethods(state) {
      return state.paymentMethods;
    },
    getSelectedLiveItem(state) {
      return state.selectedLiveItem;
    },
    getAdmin(state) {
      return state.admin;
    },
    getShopOwner(state) {
      return state.shopOwner;
    },
    getCurrentUser(state) {
      return state.user;
    },
    getCities(state) {
      return state.cities;
    },
    getPaymentTypes(state) {
      return state.payment_types;
    },
    getCartInfo(state) {
      return state.cart_info;
    },
    getCartItems(state) {
      return state.cart_items;
    },
    getAllProducts(state) {
      return state.products;
    },
    getProductCategories(state) {
      return state.productCategories;
    },
    getBrands(state) {
      return state.brands;
    },
    getSizes(state) {
      return state.sizes;
    },
    getColors(state) {
      return state.colors;
    },
    getWeights(state) {
      return state.weights;
    },
    getKitchens(state) {
      return state.kitchens;
    },
    getAllCashier(state) {
      return state.cashiers;
    },
    getShopInfo(state) {
      return state.shopInfo;
    },
    getSellItems(state) {
      return state.sellItems;
    },
    getDateTime(state) {
      return state.dateTime;
    },
    getDay(state) {
      return state.day;
    },
    getMonth(state) {
      return state.month;
    },
    getYear(state) {
      return state.year;
    },
    getReservationDetail(state) {
      return state.ReservationDetail;
    },

    //GET SWIMMING POLL
    getAlLCategoriesSwimmingPool(state){
      return state.swimmingPollCategory;
    },

    //GET SWIMMING POLL party
    getAlLCategoriesSwimmingPoolParty(state){
      return state.swimmingPollPartyCategory;
    },

  },
  mutations: {
    // SWIMMING POLL PARTY CATEGORY
    SET_CATEGORIES_SWIMMING_POOL_PARTY(state, payload){
      state.swimmingPollPartyCategory = payload;
    },

    // SWIMMING POLL CATEGORY
    SET_CATEGORIES_SWIMMING_POOL(state, payload){
      state.swimmingPollCategory = payload;
    },

    SET_TABLE_RESERVATION_DETAIL(state, payload) {
      state.ReservationDetail = payload;
    },
    SET_APARTMENT_TYPES(state, payload) {
      state.apartmentTypes = payload;
    },
    SET_ALL_APARTMENTS(state, payload) {
      state.apartments = payload;
    },
    //restaurant table
    SET_SELECTED_TABLE(state, payload) {
      state.selectedTable = payload;
    },
    SET_ALL_TABLES(state, payload) {
      state.tables = payload;
    },
    //end restaurant table

    //owner stock transfer
    SET_RECEIVED_BRANCH(state, payload) {
      state.receivedBranch = payload;
    },
    SET_TRANSFER_TEMP_LISTS(state, payload) {
      state.transferTempLists.push(payload);
    },
    REMOVE_TRANSFER_TEMP(state, index) {
      state.transferTempLists.splice(index, 1);
    },
    CLEAR_TRANSFER_TEMP_LIST(state) {
      state.transferTempLists = [];
    },
    CLEAR_RECEIVED_BRANCH(state) {
      state.receivedBranch = '';
    },
    //end owner stock transfer

    //
    SET_CURRENT_SHOP_ID(state, payload) {
      state.currentShopId = payload;
    },
    SET_SHOP_TYPES(state, payload) {
      state.shopTypes = payload;
    },
    SET_SELECTED_BRANCH(state, payload) {
      state.selectedBranch = payload;
    },
    SET_BRANCHES(state, payload) {
      state.branches = payload;
    },

    //sell products
    updateSelectedSellProduct(state, count, id) {
      state.selectedSellProduct.forEach((p) => {
        if (p.id === id) {
          p.stock += count;
        }
      });
    },
    clearSelectedPurchaseProduct(state) {
      state.selectedPurchaseProducts = [];
    },
    clearSelectedSellProduct(state, payload) {
      //payload
      state.selectedSellProduct = [];
      let index = state.selectedSellProductLists.findIndex(
        (p) => p.index === payload
      );
      state.selectedSellProductLists[index].selection = [];
    },
    updatePurchaseProductBuyPrice(state, payload) {
      state.selectedPurchaseProducts[payload.index].buyPrice = payload.buyPrice;
    },
    updatePurchaseProductSellPrice(state, payload) {
      state.selectedPurchaseProducts[payload.index].sellPrice =
        payload.sellPrice;
    },
    updatePurchaseProductCount(state, payload) {
      state.selectedPurchaseProducts[payload.index].frontNumber = payload.count;
    },
    removeSelectedPurchaseProduct(state, index) {
      state.selectedPurchaseProducts.splice(index, 1);
    },
    removeSelectedSellProductByIndex(state, pLoad) {
      console.log(pLoad.index, pLoad.payload);
      let i = state.selectedSellProductLists.findIndex(
        (p) => p.index === pLoad.index
      );
      state.selectedSellProductLists[i].selection.splice(pLoad.payload, 1);
      // state.selectedSellProduct.splice(payload,1);
    },
    SET_SELECTED_PURCHASE_PRODUCT(state, payload) {
      state.selectedPurchaseProducts.push(payload);
    },
    SET_SELECTED_SELL_PRODUCT(state, payload) {
      state.selectedSellProduct.push(payload);
    },
    SET_VOUCHER(state, payload) {
      state.voucher = payload;
    },
    SET_SELECTED_VOUCHER_PRODUCT(state, payload) {
      state.selectedVoucherProduct = payload;
    },
    SET_SELECTED_SELL_PRODUCT_LISTS(state, payload) {
      if (
        state.selectedSellProductLists.some((p) => p.index === payload.index)
      ) {
        console.log('payload', payload.selection);
        let index = state.selectedSellProductLists.findIndex(
          (selection) => selection.index === payload.index
        );
        console.log(
          'selection',
          state.selectedSellProductLists[index].selection
        );
        state.selectedSellProductLists[index].selection.push(payload.selection);
      } else {
        state.selectedSellProductLists.push({
          index: payload.index,
          selection: [payload.selection],
        });
      }
    },
    SET_SELL_ITEMS(state, payload) {
      state.sellItems = payload;
    },
    SET_PAYMENT_METHODS(state, payload) {
      state.paymentMethods = payload;
    },
    //end sell products

    //live item
    SET_SELECTED_LIVE_ITEM(state, payload) {
      state.selectedLiveItem = payload;
    },

    //set account or profile data
    SET_ADMIN(state, payload) {
      state.admin = payload;
    },

    SET_USER(state, payload) {
      state.user = payload;
    },

    SET_SHOP_OWNER(state, payload) {
      state.shopOwner = payload;
    },

    SET_CASHIERS(state, payload) {
      state.cashiers = payload;
    },

    SET_SHOP_INFO(state, payload) {
      state.shopInfo = payload;
    },

    SET_CASHIER_ACC(state, payload) {
      state.cashierAcc = '';
      state.cashierAcc = payload;
    },

    SET_FCM(state, payload) {
      state.fcmToken = payload;
    },

    SET_CITIES(state, payload) {
      state.cities = payload;
    },
    SET_PAYMENTS(state, payload) {
      state.payment_types = payload;
    },

    //Add to cart
    SET_CART_INFO(state, payload) {
      state.cart_info = payload;
    },
    SET_CART_ITEMS(state, payload) {
      state.cart_items = payload;
    },
    filterCart(state, payload) {
      state.cart_items = state.cart_items.filter((cart) => {
        return cart.productId !== payload;
      });
    },
    //end add to cart

    // products and categories
    SET_PRODUCTS(state, payload) {
      state.products = payload;
    },
    SET_PRODUCT_CATEGORIES(state, payload) {
      state.productCategories = payload;
    },
    SET_TABLE_CATEGORIES(state, payload) {
      state.tableCategories = payload;
    },
    SET_BRANDS(state, payload) {
      state.brands = payload;
    },
    SET_SIZES(state, payload) {
      state.sizes = payload;
    },
    SET_COLORS(state, payload) {
      state.colors = payload;
    },
    SET_WEIGHTS(state, payload) {
      state.weights = payload;
    },
    SET_KITCHENS(state, payload) {
      state.kitchens = payload;
    },
    //end products and categories

    //Date and time
    SET_DATE_TIME(state, payload) {
      state.dateTime = payload;
    },
    SET_DAY(state, payload) {
      state.day = payload;
    },
    SET_MONTH(state, payload) {
      state.month = payload;
    },
    SET_YEAR(state, payload) {
      state.year = payload;
    },
    //end date and time
  },
  actions: {
    // GET CATEGORY SWIMMINGPOOL Party
    async getAlLCategoriesSwimmingPoolParty({commit}, payload){
      await db.collection(payload.city)
          .doc(payload.shopId)
          .collection('SwimmingPoolPartyCategory').onSnapshot(snapshot => {
            const result = [];
            snapshot.forEach(doc=>{
              result.push(doc.data());
            }, error=>{
              console.log("SwimmingPoolPartyCategory",error.message)
            });
            // console.log("rr",result)
            commit("SET_CATEGORIES_SWIMMING_POOL_PARTY", result)
          })
    },

    // GET CATEGORY SWIMMINGPOOL
    async getAlLCategoriesSwimmingPool({commit}, payload){
      // console.log("pp",payload.city)
      await db.collection(payload.city)
          .doc(payload.shopId)
          .collection('swimmingPoolCategory').onSnapshot(snapshot => {
            const result = [];
            snapshot.forEach(doc=>{
              result.push(doc.data());
            }, error=>{
              console.log("SwimmingPoolCategories",error.message)
            });
            // console.log("rr",result)
            commit("SET_CATEGORIES_SWIMMING_POOL", result)
          })
    },

    
    async getAllShopTypes({ commit }) {
      await db
        .collection('shopTypes')
        .get()
        .then((result) => {
          let results = [];
          result.forEach((doc) => {
            results.push(doc.data());
          });
          commit('SET_SHOP_TYPES', results);
        });
    },

    getDateTime({ commit }) {
      const date = new Date();
      let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(
        date
      );
      let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(
        date
      );
      let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
      let time = new Intl.DateTimeFormat('en-US', {
        hour12: true,
        hour: 'numeric',
        minute: 'numeric',
      }).format(date);
      let payload = day + '-' + month + '-' + year + ' ' + time;
      commit('SET_DATE_TIME', payload);
    },
    getDay({ commit }) {
      const date = new Date();
      let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(
        date
      );
      let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(
        date
      );
      let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
      let payload = day + '-' + month + '-' + year;
      commit('SET_DAY', payload);
    },
    getMonth({ commit }) {
      const date = new Date();
      let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(
        date
      );
      let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(
        date
      );
      let payload = month + '-' + year;
      commit('SET_MONTH', payload);
    },
    getYear({ commit }) {
      const date = new Date();
      let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(
        date
      );
      let payload = year;
      commit('SET_YEAR', payload);
    },
    async getCurrentUser({ commit }) {
      if (getAuth().currentUser) {
        await db
          .collection('users')
          .doc(getAuth().currentUser.uid)
          .onSnapshot((snapshot) => {
            const result = snapshot.data();
            commit('SET_USER', result);
          });
      }
    },
    async getAdmin({ commit }) {
      if (getAuth().currentUser) {
        await db
          .collection('admin')
          .doc(getAuth().currentUser.uid)
          .onSnapshot(
            (snapshot) => {
              const result = snapshot.data();
              commit('SET_ADMIN', result);
              // console.log(result)
            },
            (error) => {
              console.log(error.message);
            }
          );
      }
    },

    async getCurrentShop({ commit }) {
      /*if(getAuth().currentUser){
        await db.collection('shopRegistration').doc(getAuth().currentUser.uid).onSnapshot(snapshot => {
          const result = snapshot.data();
          commit("SET_SHOP_OWNER", result);
        },error=>{
          console.log(error.message)
        });
      }*/
      if (getAuth().currentUser) {
        await db
          .collection('shopRegistration')
          .where('emailList', 'array-contains', getAuth().currentUser.email)
          .onSnapshot(
            (snapshot) => {
              let shop = [];
              snapshot.forEach((doc) => {
                shop.push(doc.data());
              });
              const result = shop[0];
              commit('SET_SHOP_OWNER', result);
            },
            (error) => {
              console.log(error.message);
            }
          );
      }
    },

    async getShopInfo({ commit }, payload) {
      await db
        .collection(payload.city)
        .doc(payload.shopId)
        .onSnapshot(
          (snapshot) => {
            const result = snapshot.data();
            //console.log(result)
            commit('SET_SHOP_INFO', result);
          },
          (error) => {
            console.log(error.message);
          }
        );
    },

    async getPaymentMethods({ commit }, payload) {
      await db
        .collection(payload.city)
        .doc(payload.shopId)
        .collection('paymentMethods')
        .onSnapshot(
          (snapshot) => {
            const result = [];
            snapshot.forEach((doc) => {
              result.push(doc.data());
            });
            //console.log(result)
            commit('SET_PAYMENT_METHODS', result);
          },
          (error) => {
            console.log(error.message);
          }
        );
    },

    async getCities({ commit }) {
      await db
        .collection('city')
        .where('cityavailable', '==', 'yes')
        .onSnapshot((snapshot) => {
          const all_cities = [];
          snapshot.forEach((doc) => {
            all_cities.push(doc.data());
            /*
          if(!all_cities.some((city)=>city.name === doc.data().name)){
          }*/
          });
          commit('SET_CITIES', all_cities);
        });
    },

    async getProductCategories({ commit }, payload) {
      await db
        .collection(payload.city)
        .doc(payload.shopId)
        .collection('category')
        .onSnapshot((snapshot) => {
          const result = [];
          snapshot.forEach(
            (doc) => {
              // if(doc.data().name!=='All'){
              // }
              result.push(doc.data());
            },
            (error) => {
              console.log(error.message);
            }
          );
          commit('SET_PRODUCT_CATEGORIES', result);
        });
    },
    async getTableCategories({ commit }, payload) {
      await db
        .collection(payload.city)
        .doc(payload.shopId)
        .collection('tableCategory')
        .onSnapshot((snapshot) => {
          const result = [];
          snapshot.forEach(
            (doc) => {
              if (doc.data().name !== 'All') {
                result.push(doc.data());
              }
            },
            (error) => {
              console.log(error.message);
            }
          );
          commit('SET_TABLE_CATEGORIES', result);
        });
    },
    async getApartmentTypes({ commit }, payload) {
      await db
        .collection(payload.city)
        .doc(payload.shopId)
        .collection('apartmentTypes')
        .orderBy('name', 'asc')
        .onSnapshot((snapshot) => {
          const result = [];
          snapshot.forEach(
            (doc) => {
              result.push(doc.data());
            },
            (error) => {
              console.log(error.message);
            }
          );
          commit('SET_APARTMENT_TYPES', result);
        });
    },
    async fetchBrands({ commit }, payload) {
      await db
        .collection(payload.city)
        .doc(payload.shopId)
        .collection('brand')
        .orderBy('name', 'asc')
        .onSnapshot((snapshot) => {
          const result = [];
          snapshot.forEach(
            (doc) => {
              result.push(doc.data());
            },
            (error) => {
              console.log(error.message);
            }
          );
          commit('SET_BRANDS', result);
        });
    },
    async fetchSizes({ commit }, payload) {
      await db
        .collection(payload.city)
        .doc(payload.shopId)
        .collection('size')
        .orderBy('name', 'asc')
        .onSnapshot((snapshot) => {
          const result = [];
          snapshot.forEach(
            (doc) => {
              result.push(doc.data());
            },
            (error) => {
              console.log(error.message);
            }
          );
          commit('SET_SIZES', result);
        });
    },
    async fetchColors({ commit }, payload) {
      await db
        .collection(payload.city)
        .doc(payload.shopId)
        .collection('color')
        .orderBy('name', 'asc')
        .onSnapshot((snapshot) => {
          const result = [];
          snapshot.forEach(
            (doc) => {
              result.push(doc.data());
            },
            (error) => {
              console.log(error.message);
            }
          );
          commit('SET_COLORS', result);
        });
    },
    async fetchWeights({ commit }, payload) {
      await db
        .collection(payload.city)
        .doc(payload.shopId)
        .collection('wight')
        .orderBy('name', 'asc')
        .onSnapshot((snapshot) => {
          const result = [];
          snapshot.forEach(
            (doc) => {
              result.push(doc.data());
            },
            (error) => {
              console.log(error.message);
            }
          );
          commit('SET_WEIGHTS', result);
        });
    },
    async fetchKitchens({ commit }, payload) {
      await db
        .collection(payload.city)
        .doc(payload.shopId)
        .collection('kitchens')
        .orderBy('name', 'asc')
        .onSnapshot((snapshot) => {
          const result = [];
          snapshot.forEach(
            (doc) => {
              result.push(doc.data());
            },
            (error) => {
              console.log(error.message);
            }
          );
          commit('SET_KITCHENS', result);
        });
    },
    async getPaymentTypes({ commit }) {
      const payment = [];
      await db.collection('paymentCategories').onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
          payment.push(doc.data());
        });
        commit('SET_PAYMENTS', payment);
      });
    },

    async getCartItems({ commit }) {
      await db
        .collection('users')
        .doc(getAuth().currentUser.uid)
        .collection('cart')
        .doc('shop')
        .collection('items')
        .onSnapshot((snapshot) => {
          const result = [];
          snapshot.forEach((doc) => {
            result.push(doc.data());
          });
          commit('SET_CART_ITEMS', result);
        });
    },
    async getAllProductsByKitchen({ state, commit }) {
      console.log('get by kit',state.shopOwner.name)
      if(state.cashierAcc.counter !== 'Bar'){
        await db
        .collection(state.shopOwner.city)
        .doc(state.shopOwner.shopId)
        .collection('products')
        .where('kitchenType', '==', state.cashierAcc.counter)
        .orderBy('itemName', 'asc')
        .onSnapshot((snapshot) => {
          console.log(snapshot)
          const result = [];
          snapshot.forEach(
            (doc) => {
              result.push(doc.data());
            },
            (error) => {
              console.log('Product', error.message);
            }
          );
          // console.log(result)
          commit('SET_PRODUCTS', result);
        });
      }else{
        console.log('its bar menu')
        await db
        .collection(state.shopOwner.city)
        .doc(state.shopOwner.shopId)
        .collection('products')
        .where('barMenu', '==', 'yes')
        .orderBy('itemName', 'asc')
        .onSnapshot((snapshot) => {
          console.log(snapshot)
          const result = [];
          snapshot.forEach(
            (doc) => {
              result.push(doc.data());
            },
            (error) => {
              console.log('Product', error.message);
            }
          );
          // console.log(result)
          commit('SET_PRODUCTS', result);
        });
      }
      
    },
    async getAllProducts({ commit }, payload) {
      // console.log(payload)
      await db
        .collection(payload.city)
        .doc(payload.shopId)
        .collection('products')
        .orderBy('itemName', 'asc')
        .onSnapshot((snapshot) => {
          const result = [];
          snapshot.forEach(
            (doc) => {
              result.push(doc.data());
            },
            (error) => {
              console.log('Product', error.message);
            }
          );
          // console.log(result)
          commit('SET_PRODUCTS', result);
        });
    },
    async fetchAllTables({ commit }, payload) {
      // console.log(payload)
      await db
        .collection(payload.city)
        .doc(payload.shopId)
        .collection('tables')
        .orderBy('name', 'asc')
        .onSnapshot((snapshot) => {
          const result = [];
          snapshot.forEach(
            (doc) => {
              result.push(doc.data());
            },
            (error) => {
              console.log('table', error.message);
            }
          );
          // console.log(result)
          commit('SET_ALL_TABLES', result);
        });
    },
    async fetchAllApartments({ commit }, payload) {
      // console.log(payload)
      await db
        .collection(payload.city)
        .doc(payload.shopId)
        .collection('apartments')
        .orderBy('name', 'asc')
        .onSnapshot((snapshot) => {
          const result = [];
          snapshot.forEach(
            (doc) => {
              result.push(doc.data());
            },
            (error) => {
              console.log('apartment', error.message);
            }
          );
          // console.log(result)
          commit('SET_ALL_APARTMENTS', result);
        });
    },
    async getSellItems({ state, commit }, today) {
      // console.log('today', today)
      await db
        .collection(state.shopOwner.city)
        .doc(state.shopOwner.shopId)
        .collection('sellProducts')
        .where('day', '==', today)
        .orderBy('time', 'desc')
        .get()
        .then((snapshot) => {
          const result = [];
          snapshot.forEach((doc) => {
            result.push(doc.data());
          });
          commit('SET_SELL_ITEMS', result);
        });
    },


    async getCashierAcc({ commit }, payload) {
      await db
        .collection(payload.city)
        .doc(payload.shopId)
        .collection('account')
        .doc(getAuth().currentUser.uid)
        .onSnapshot((snapshot) => {
          commit('SET_CASHIER_ACC', snapshot.data());
        });
    },
    async getCashier({ commit }, payload) {
      await db
        .collection(payload.city)
        .doc(payload.shopId)
        .collection('account')
        .onSnapshot((snapshot) => {
          const result = [];
          snapshot.forEach((doc) => {
            if (doc.data.accountCode !== 'T1') {
              result.push(doc.data());
            }
          });
          commit('SET_CASHIERS', result);
        });
    },
    async getCartInfo({ commit }) {
      if (getAuth().currentUser.uid) {
        await db
          .collection('users')
          .doc(getAuth().currentUser.uid)
          .collection('cart')
          .doc('shop')
          .onSnapshot((snapshot) => {
            commit('SET_CART_INFO', snapshot.data());
          });
      }
    },
  },
  modules: {
    // products: products
  },
  plugins: [createPersistedState()],
});
