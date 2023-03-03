<template>
  <AdminSidebar>
    <Loading v-if="loadingActive" />
    <div class="col-12 col-lg-12" style="height: 95vh; overflow-y: scroll">
      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
       </div>

      <div
        class="d-flex align-items-center justify-content-between rounded mt-2"
      >
        <div class="d-flex align-items-center rounded mt-2">
          <router-link
            :to="{ name: 'ListSwimmingPool' }"
            class="btn btn-sm me-2"
            style="color: var(--text-color)"
            ><i class="fas fa-chevron-left"> </i
          ></router-link>
          <span class="fs-3">{{$t('message.edit')}}</span>
        </div>
{{ voucherID }}
        <div
          class="
            category-box
            d-lg-flex
            justify-content-between
            align-items-center
          "
        >
          <div></div>
          <div>
            <!-- <router-link
              :to="{ name: 'CreatePartyPool' }"
              class="btn btn-lg ms-1 mb-3 p-2"
              style="
                color: var(--text-color);
                background-color: var(--btnLight);
              "
              ><i class="fas fa-plus-circle me-1"></i>Party</router-link
            > -->
          </div>
        </div>
      </div>

      <div class="mt-2">
        <div
          class="d-flex justify-content-around rounded mt-2"
          v-if="status === 'single'"
        >
          <form
            class="form"
            @keydown.prevent.stop.enter
            @submit.prevent="updatedSwimmingAddList"
          >
            <div class="row">
              <div class="col-12 col-lg-6 col-md-6 mb-2">
                <div class="form-floating mb-3 mt-4">
                  <input
                    type="number"
                    required
                    class="form-control"
                    id="name-input"
                    placeholder=""
                    v-model="adults.adultCount"
                    @input="handleChangeAdult($event)"
                  />
                  <label for="name-input">Adult Quantity</label>
                </div>
              </div>

              <div class="col-12 col-lg-6 col-md-6 mb-2">
                <div class="form-floating mb-3 mt-4">
                  <input
                    type="number"
                    required
                    class="form-control"
                    id="name-input"
                    placeholder=""
                    v-model="childs.childCount"
                    @input="handleChangeChild($event)"
                  />
                  <label for="name-input">Child Quantity</label>
                </div>
              </div>

              <div class="col-12 col-lg-6 col-md-6 mb-2">
                <div class="form-floating mb-3 mt-2">
                  <input
                    type="number"
                    required
                    disabled
                    class="form-control"
                    id="name-input"
                    placeholder=""
                    v-model="adultCategories.amount"
                  />
                  <label for="name-input">Adult Price</label>
                </div>
              </div>

              <div class="col-12 col-lg-6 col-md-6 mb-2">
                <div class="form-floating mb-3 mt-2">
                  <input
                    type="number"
                    required
                    disabled
                    class="form-control"
                    id="name-input"
                    placeholder=""
                    v-model="childCategories.amount"
                  />
                  <label for="name-input">Child Price</label>
                </div>
              </div>


              <div class="col-12 col-lg-6 col-md-6 mb-2">
                <div class="form-floating mb-3 mt-2">
                  <input
                    type="number"
                    required
                    disabled
                    class="form-control"
                    id="name-input"
                    placeholder=""
                    v-model="adults.totalPrice"
                  />
                  <label for="name-input">Adult Total </label>
                </div>
              </div>

              <div class="col-12 col-lg-6 col-md-6 mb-2">
                <div class="form-floating mb-3 mt-2">
                  <input
                    type="number"
                    required
                    disabled
                    class="form-control"
                    id="name-input"
                    placeholder=""
                    v-model="childs.totalPrice"
                  />
                  <label for="name-input">Child Total</label>
                </div>
              </div>

              <div
                class="position-sticky shadow-sm bottom-0 mt-5"
                style="background-color: var(--background-color)"
              >
                <button
                  type="submit"
                  class="btn w-100 my-2 text-white mx-auto"
                  style="background-color: var(--primary)"
                  v-print="'#printcontent'"
                >
                  {{$t('message.confirm')}}
                </button>
              </div>
            </div>
          </form>

          <!-- show -->
          <form
            class="form"
            style="margin-left: 30px; margin-right: 30px"
            @keydown.prevent.stop.enter
          >
            <div class="row d-flex flex-column">
              <div class="col-12 col-lg-12 col-md-12 mb-1">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Total</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="adults.adultCount != 0">
                      <td>{{ adultCategories.name }}</td>
                      <td>{{ adults.adultCount }}</td>
                      <td> {{ adults.adultPrice }} Ks</td>
                      <td>{{ adults.totalPrice }} Ks</td>
                      <td>
                        <button
                      class="btn btn-sm text-white"
                      style="background-color: var(--primary)"
                      @click.prevent="deleteAdult"
                    >
                      Delete
                    </button>
                      </td>
                    </tr>
                    <tr v-if="childs.childCount != 0">
                      <td>
                        {{ childCategories.name }}
                      </td>
                      <td>
                        {{ childs.childCount }}
                      </td>
                      <td>
                        {{ childs.childPrice }} Ks
                      </td>
                      <td>
                        {{ childs.totalPrice }} Ks
                      </td>
                      <td>
                        <button
                      class="btn btn-sm text-white"
                      style="background-color: var(--primary)"
                      @click.prevent="deleteChild"
                    >
                      Delete
                    </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
               
              </div>

              <div
                class="col-12 col-lg-12 col-md-12"
                style="margin-top: 50px"
                v-if="getPrice !== 0"
              >
                <div
                  class="
                    d-flex
                    align-items-center
                    justify-content-between
                    mt-10
                  "
                >
                  <div>
                    <p>Final Total</p>
                  </div>
                  <div>
                    <p>{{ getPrice }} Ks</p>
                  </div>
                </div>
              </div>
            </div>
          </form>
          <!-- end show -->
        </div>
        <!----------Voucher  -->
        <div style="display: none">
          <div class="voucher-box">
            <div
              class="bg-white p-2 text-black py-3 px-3"
              style="font-size: 12px"
              id="printcontent"
            >
              <div class="d-flex fw-bold align-items-center mb-2">
                <img
                  :src="shopInfo.profileUrl"
                  class="rounded me-2"
                  width="150"
                  height="150"
                  v-if="showLogo === 'true'"
                />
                <div
                  class="mt-1 d-flex flex-column w-100 px-2"
                  :class="showLogo === 'true' ? 'text-start' : 'text-center'"
                >
                  <span class="fs-5 fw-bolder"
                    >360 Swimming Pool Vouncher
                  </span>
                  <span class="my-1">{{ shopInfo.address }}</span>
                  <span
                    ><i class="fas fa-square-phone-flip"></i>
                    {{ shopInfo.phone }}</span
                  >
                </div>
              </div>
              <div
                class="
                  text-start
                  fw-bold
                  d-flex
                  flex-column
                  pt-1
                  voucher-list-solid
                "
              >
                <span class="mb-1"
                  >{{ $t("message.voucher_no") }}
                  {{ voucherID }}
                </span>

                <span class="mb-1"
                  >{{ $t("message.date") }}:
                  {{ currentDay }}
                </span>
              </div>

              <table
                class="
                  w-100
                  table-1
                  border-0
                  p-0
                  table
                  border-white
                  table-voucher
                "
              >
                <thead class="p-0 voucher-list-bottom">
                  <tr
                    class="py-1"
                    style="
                      border-bottom: 2px dotted black !important;
                      border-right: 0 !important;
                      border-left: 0 !important;
                      border-top: 0 !important;
                    "
                  >
                    <th
                      class="bg-white border-0 text-start text-wrap align-start"
                      style="width: 40%"
                    >
                      Type
                    </th>
                    <th
                      class="bg-white border-0 text-end text-nowrap align-start"
                    >
                      {{ $t("message.qty") }}
                    </th>
                    <th
                      class="bg-white border-0 text-end text-nowrap align-start"
                    >
                      {{ $t("message.price") }}
                    </th>
                    <th
                      class="bg-white border-0 text-end text-nowrap align-start"
                    >
                      SubTotal
                    </th>
                  </tr>
                </thead>
                <tbody class="border-0 fw-bold p-0">
                  <tr class="border-0 mb-1 py-1">
                    <td
                      class="border-0 text-start text-wrap align-start"
                      style="width: 40%"
                      v-if="adults.adultCount !== 0"
                    >
                      {{ adultCategories.name }}
                    </td>
                    <td
                      class="border-0 text-end text-nowrap align-start"
                      v-if="adults.adultCount !== 0"
                    >
                      {{ adults.adultCount }}
                    </td>
                    <td
                      class="border-0 text-end text-nowrap align-start"
                      v-if="adults.adultPrice !== 0"
                    >
                      {{ Number(adults.adultPrice).toLocaleString() }} Ksss
                    </td>
                    <td
                      class="border-0 text-end text-nowrap align-start"
                      v-if="adults.totalPrice !== 0"
                    >
                      {{ Number(adults.totalPrice).toLocaleString() }} Ks
                    </td>
                  </tr>

                  <tr class="border-0 mb-1 py-1">
                    <td
                      class="border-0 text-start text-wrap align-start"
                      style="width: 40%"
                      v-if="childs.childCount !== 0"
                    >
                      {{ childCategories.name }}
                    </td>
                    <td
                      class="border-0 text-end text-nowrap align-start"
                      v-if="childs.childCount !== 0"
                    >
                      {{ childs.childCount }}
                    </td>
                    <td
                      class="border-0 text-end text-nowrap align-start"
                      v-if="childs.childPrice !== 0"
                    >
                      {{ Number(childs.childPrice).toLocaleString() }} Ksss
                    </td>
                    <td
                      class="border-0 text-end text-nowrap align-start"
                      v-if="childs.totalPrice !== 0"
                    >
                      {{ Number(childs.totalPrice).toLocaleString() }} Ks
                    </td>
                  </tr>
                </tbody>
              </table>

              <div class="px-1 flex-column">
                <div class="d-flex fw-bold py-1 voucher-list-top">
                  <span class="w-75 text-start"> Final Total </span>
                  <span class="w-25 text-end">
                    {{ parseInt(getPrice).toLocaleString() }}
                    Ks</span
                  >
                </div>

                <div class="text-center">
                  <p class="fw-bold">{{ $t("message.thank") }}</p>
                  
                  <p class="mt-1">Power by Light Idea Software Development</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- </div> -->
      </div>

      <!-- --------------------------------for party -->
      <div
        class="d-flex justify-content-around rounded mt-2"
        v-if="status === 'party'"
      >
        <form
          class="form col-12 col-lg-6"
          style="height: 95vh; overflow-y: scroll"
          @keydown.prevent.stop.enter
        >
          <div class="row">
            <div class="col-12 col-lg-6 col-md-6 mb-2">
              <div class="d-flex align-items-center mt-4">
                <div class="w-100 form-floating">
                  <select
                    required
                    class="form-select fs-6 form-control form-select-lg rounded"
                    style="border-radius: var(--border-radius) !important"
                    aria-label=".form-select-sm example"
                    v-model="types"
                    @change="onChange()"
                  >
                    <option
                      v-for="category in swimmingPartyCategories"
                      :value="{
                        amount: category.amount,
                        name: category.name,
                      }"
                      :key="category.id"
                    >
                      {{ category.name }}
                    </option>
                  </select>
                  <label class="form-label">Choose Type</label>
                </div>
              </div>
            </div>

            <div class="col-12 col-lg-6 col-md-6 mb-2">
              <div class="date-panel mt-4">
                <div
                  class="
                    d-flex
                    align-items-center
                    justify-content-center
                    rounded
                  "
                >
                  <input
                    type="date"
                    class="form-control me-1"
                    @change="formatDate"
                    required
                  />
                </div>
              </div>
            </div>

            <div class="col-12 col-lg-6 col-md-6 mb-2">
              <div class="date-panel mt-4">
                <div
                  class="
                    d-flex
                    align-items-center
                    justify-content-center
                    rounded
                  "
                >
                  <input
                    v-if="types.name === 'Section'"
                    type="time"
                    id="sTime"
                    class="form-control me-1"
                    placeholder="Start"
                    @change="onTimeChangeStart"
                    required
                  />
                  <!-- v-model="startTime" -->
                </div>
              </div>
            </div>

            <div class="col-12 col-lg-6 col-md-6 mb-2">
              <div class="date-panel mt-4">
                <div
                  class="
                    d-flex
                    align-items-center
                    justify-content-center
                    rounded
                  "
                >
                  <input
                    v-if="types.name === 'Section'"
                    type="time"
                    id="eTime"
                    class="form-control"
                    placeholder="End"
                    @change="onTimeChangeEnd"
                    required
                  />
                  <!-- v-model="endTime" -->
                </div>
              </div>
            </div>

            <div class="col-12 col-lg-6 col-md-6 mb-2">
              <div class="form-floating mb-3 mt-4">
                <input
                  type="text"
                  required
                  class="form-control"
                  id="name-input"
                  placeholder=""
                  v-model="name"
                />
                <label for="name-input">Name</label>
              </div>
            </div>

            <div class="col-12 col-lg-6 col-md-6 mb-2">
              <div class="form-floating mb-3 mt-4">
                <input
                  type="text"
                  required
                  class="form-control"
                  id="name-input"
                  placeholder=""
                  v-model="phone"
                />
                <label for="name-input">Phone</label>
              </div>
            </div>
            <div class="col-12 col-lg-6 col-md-6 mb-2">
              <div class="form-floating mb-3 mt-4">
                <input
                  type="text"
                  required
                  class="form-control"
                  id="name-input"
                  placeholder=""
                  v-model="address"
                />
                <label for="name-input">Address</label>
              </div>
            </div>

            <div class="col-12 col-lg-6 col-md-6 mb-2">
              <div class="form-floating mb-3 mt-4">
                <input
                  type="text"
                  class="form-control"
                  id="name-input"
                  placeholder=""
                  v-model="nrc"
                />
                <label for="name-input">NRC</label>
              </div>
            </div>

            <div class="col-12 col-lg-6 col-md-6 mb-2">
              <div class="form-floating mb-3 mt-4">
                <input
                  type="text"
                  disabled
                  required
                  class="form-control"
                  id="name-input"
                  placeholder=""
                  v-model="types.amount"
                />
                <label for="name-input">Price</label>
              </div>
            </div>

            <div
              class="position-sticky shadow-sm bottom-0 mt-5"
              style="background-color: var(--background-color)"
            >
              <button
                @click.prevent="updatedSwimmingParty"
                type="submit"
                class="btn w-100 my-2 text-white mx-auto"
                style="background-color: var(--primary)"
                v-print="'#printcontentP'"
              >
                {{$t('message.confirm')}}
              </button>
            </div>
          </div>
        </form>

        <!----------Voucher  -->
        <div style="display: block">
          <div class="voucher-box">
            <div
              class="bg-white p-2 text-black py-3 px-3"
              style="font-size: 12px; min-width: 500px"
              id="printcontentP"
            >
              <div class="d-flex fw-bold align-items-center mb-2">
                <img
                  :src="shopInfo.profileUrl"
                  class="rounded me-2"
                  width="150"
                  height="150"
                  v-if="showLogo === 'true'"
                />
                <div
                  class="mt-1 d-flex flex-column w-100 px-2"
                  :class="showLogo === 'true' ? 'text-start' : 'text-center'"
                >
                  <span class="fs-5 fw-bolder"
                    >360 Swimming Pool Party Vouncher
                  </span>
                  <span class="my-1">{{ shopInfo.address }}</span>
                  <span
                    ><i class="fas fa-square-phone-flip"></i>
                    {{ shopInfo.phone }}</span
                  >
                </div>
              </div>

              <div class="d-flex justify-content-between align-items-center">
                <div
                  class="
                    text-start
                    fw-bold
                    d-flex
                    flex-column
                    pt-1
                    voucher-list-solid
                  "
                >
                  <span class="mb-1"
                    >{{ $t("message.voucher_no") }}
                    {{ voucherId }}
                  </span>

                  <span class="mb-1"
                    >Selected Date:
                    {{ selectedDate }}
                  </span>
                  <span class="mb-1"
                    >Current Date:
                    {{ currentDay }}
                  </span>
                </div>

                <div
                  class="
                    text-start
                    fw-bold
                    d-flex
                    flex-column
                    pt-1
                    voucher-list-solid
                  "
                >
                  <span class="mb-1"
                    >Name :
                    {{ name }}
                  </span>

                  <span class="mb-1"
                    >Phone :
                    {{ phone }}
                  </span>
                </div>
              </div>

              <div>
                <div
                  class="d-flex fw-bold py-1 voucher-list-top"
                  style="
                    border-bottom: 2px dotted black !important;
                    border-right: 0 !important;
                    border-left: 0 !important;
                    border-top: 0 !important;
                  "
                ></div>
                <div class="d-flex justify-content-between fw-bold text-start">
                  <p class="">Type</p>
                  <p class="text-start">{{ types.name }}</p>
                </div>
                <div
                  class="d-flex justify-content-between fw-bold text-start"
                  v-if="types.name === 'Section'"
                >
                  <p class="">Start Time</p>
                  <p class="">{{ startTime }}</p>
                </div>
                <div
                  class="d-flex justify-content-between fw-bold"
                  v-if="types.name === 'Section'"
                >
                  <p class="text-start">End Time</p>
                  <p class="text-start">{{ endTime }}</p>
                </div>
                <div
                  class="d-flex justify-content-between fw-bold"
                  v-if="types.name === 'Section'"
                >
                  <p class="text-start">Total Time</p>
                  <p class="text-start">{{ totalTime }}</p>
                </div>
                <div class="d-flex justify-content-between fw-bold">
                  <p class="text-start">Price</p>
                  <p class="text-start">
                    {{ Number(types.amount).toLocaleString() }} Ks
                  </p>
                </div>
                <div class="d-flex justify-content-between fw-bold">
                  <p class="text-start">SubTotals</p>
                  <p class="text-start">
                    {{
                      parseInt(getFinalTotal)
                        ? parseInt(getFinalTotal)
                        : 
                        Number(totalTime) * Number(types.amount)
                    }}
                    Ks
                  </p>
                </div>

                <div class="d-flex justify-content-between fw-bold" v-if="type === 'AllDay'">
                  <p class="text-start">SubTotalp</p>
                  <p class="text-start">
                    {{
                      Number(types.amount).toLocaleString()
                    }}
                    Ks
                  </p>
                </div>

              </div>
              <div class="px-1 flex-column">
                <div
                  class="d-flex fw-bold py-1 voucher-list-top"
                  style="
                    border-bottom: 2px dotted black !important;
                    border-right: 0 !important;
                    border-left: 0 !important;
                    border-top: 0 !important;
                  "
                ></div>

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
      <!-- --------------------------------end for party -->
    </div>
  </AdminSidebar>
</template>
    
<script>
import AdminSidebar from "@/components/AdminSidebar";
import db from "@/config/FirebaseInit";
import Loading from "../../components/Loading.vue";

export default {
  components: { AdminSidebar, Loading },
  props: ["id"],
  data() {
    return {
      // for party
      types: {
        name: "",
        amount: "",
      },

      name: "",
      type: "",
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
      voucherId: "",
      //category end

      //end for party
      //updated
      adultCategories: {
        amount: "25000",
        name: "Adult",
      },

      childCategories: {
        amount: "15000",
        name: "Child",
      },

      ///add updatedddddd
      adults: {
        adultCount: 0,
        adultPrice: 0,
        totalPrice: 0,
        subTotal: 0,
        day: "",
        name: "",
      },

      // FinalTotal: "",
      getPrice: 0,
      getId: "",
      loadingActive: false,
      voucherID: "",
      //   status: "",

      childs: {
        childCount: 0,
        childPrice: 0,
        totalPrice: 0,
        subTotal: 0,
        day: "",
        name: "",
      },

      //for party
      partyName: "",
      partyType: "",
      partyPhone: "",
      partyNrc: "",
      status: "",
      partyAddress: "",
      partyStartTime: "",
      partyEndTime: "",
      partyTotalTime: "",

      partyQty: "",
      //   partyOnePrice: "",
      partyGetTotalPrice: "",
      partyPrintVoucherId: "",
      partyDay: "",
      partyCurrent: "",
      partySelectedDate: "",
    };
  },

  computed: {
    totalPrice: {
      get() {
        if (this.swimming.totalPrice && !this.swimmingMen.totalPrice) {
          return this.swimming.totalPrice;
        } else {
          return this.swimmingMen.totalPrice;
        }
      },
    },

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

    swimmingPartyCategories() {
      return this.$store.getters.getAlLCategoriesSwimmingPoolParty;
    },

    showLogo() {
      return localStorage.getItem("showLogoImage");
    },

    swimmingCategories() {
      return this.$store.getters.getAlLCategoriesSwimmingPool;
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
      .collection("swimmingPoolCategory")
      .doc();

    this.$store.dispatch("getAlLCategoriesSwimmingPoolParty", this.owner);
    this.$store.dispatch("getAlLCategoriesSwimmingPool", this.owner);
    this.$store.dispatch("getCashierAcc", this.owner);

    this.$store.dispatch("getDateTime");
    this.$store.dispatch("getDay");
    this.$store.dispatch("getMonth");
    this.$store.dispatch("getYear");
    this.$store.dispatch("getShopInfo", this.owner);

    db.collection(this.owner.city)
      .doc(this.owner.shopId)
      .collection("swimmingPoolVouchers")
      .doc(this.id)
      .get()
      .then((snapshot) => {
        this.status = snapshot.data().status;
        this.type = snapshot.data().type;

        // console.info("product id", snapshot.data());

        this.getId = snapshot.data().id;

        if (snapshot.data().status === "single") {
          this.finalTotal = snapshot.data().totalPrice;

          this.adults.adultCount = snapshot.data().adultCount;
          this.adults.name = snapshot.data().adultCount !== 0 ? "men" : "";
          this.adults.adultPrice = snapshot.data().adultPrice;
          this.adults.totalPrice =
            Number(snapshot.data().adultPrice) *
            Number(snapshot.data().adultCount);
          this.adults.subTotal =
            Number(snapshot.data().adultPrice) *
            Number(snapshot.data().adultCount);
          this.adults.finalTotalPrice = snapshot.data().totalPrice;

          this.childs.childCount = snapshot.data().childCount;
          this.childs.name = snapshot.data().childCount !== 0 ? "child" : "";
          this.childs.childPrice = snapshot.data().childPrice;
          this.childs.totalPrice =
            Number(snapshot.data().childPrice) *
            Number(snapshot.data().childCount);

          this.childs.subTotal =
            Number(snapshot.data().childPrice) *
            Number(snapshot.data().childCount);
          this.childs.finalTotalPrice = snapshot.data().totalPrice;
          this.printVoucherId = snapshot.data().voucherId;
          this.voucherID = snapshot.data().voucherId;
          this.day = snapshot.data().day;
          this.getPrice = Number(snapshot.data().totalPrice);
        }

        if (snapshot.data().status === "party") {
          this.address = snapshot.data().address;
          this.name = snapshot.data().name;
          this.phone = snapshot.data().phone;
          this.nrc = snapshot.data().nrc;
          this.types.amount = snapshot.data().partyOnePrice;
          this.types.name = snapshot.data().type;
          this.startTime = snapshot.data().startTime;
          this.endTime = snapshot.data().endTime;
          this.totalTime = snapshot.data().totalTime;
          this.selectedDate = snapshot.data().selectedDay;
          this.selectedMonth = snapshot.data().month;
          this.voucherId = snapshot.data().voucherId;
          // console.log("is ok", this.name);

        //   if (this.types.name == this.name) {
        // }

          // console.log("selectedMonth", this.selectedMonth)
          // this.totalPrice = snapshot.data().totalPrice;
          // this.getFinalTotal = snapshot.data().totalPrice;

          // let timeSplit = snapshot.data().startTime.split(":");
          // let endTimeSplit = snapshot.data().endTime.split(":");

          // let hour = timeSplit[0];
          // let endHour = endTimeSplit[0];

          // let minutes = timeSplit[1];
          // let endMinutes = endTimeSplit[1];

          // let minutesSplit = minutes.split(" ");
          // let endMinutesSplit = endMinutes.split(" ");

          // let updatedMinutes = minutesSplit[0];
          // let updatedEndMinutes = endMinutesSplit[0];

          // console.log("minutes", endMinutes);
          // console.log("updatedEndMinutes", endMinutesSplit[0]);

          // if(hour < 12){
          //   hour = Number(hour) + 12
          // }

          // if(endHour < 12){
          //   endHour = Number(endHour) + 12
          // }

          // this.startTime = hour + ":" + updatedMinutes;
          // this.endTime = endHour + ":" + updatedEndMinutes;
          // console.log("hour updated", hour + ":" + updatedEndMinutes );

          // this.partyName = snapshot.data().name;
          // this.partyPrintVoucherId = snapshot.data().voucherId;
          // this.partyPhone = snapshot.data().phone;
          // this.partySelectedDate = snapshot.data().selectedDay;
          // this.partyDay = snapshot.data().day;
          //   this.partyOnePrice = snapshot.data().partyOnePrice;
          // this.partyGetTotalPrice = snapshot.data().totalPrice;
          // this.partyStartTime = snapshot.data().startTime;
          // this.partyEndTime = snapshot.data().endTime;
          // this.partyTotalTime = snapshot.data().totalTime;
          // this.partyType = snapshot.data().type;
        }

        
      });
  },

  methods: {
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

    onChange() {
      this.sectiontPrice = 0;
      this.allDayPrice = 0;
      console.log("dsfsdfsdf");
      if (this.types.name === "Section" && this.sectiontPrice === 0) {
        this.sectiontPrice = this.types.amount;
      }

      if (this.types.name === "AllDay" && this.allDayPrice === 0) {
        this.startTime = "";
        this.endTime = "";
        this.allDayPrice = this.types.amount;
        console.log("this endtime", this.startTime);
        console.log("this endtime", this.endTime);
      }
    },

    async updatedSwimmingParty() {

      try {
        let categoryRefAll = await db
          .collection(this.owner.city)
          .doc(this.owner.shopId)
          .collection("swimmingPoolVouchers")
          .doc(this.getId);
        // let categoryRefSection = await db
        //   .collection(this.owner.city)
        //   .doc(this.owner.shopId)
        //   .collection("swimmingPoolVouchers")
        //   .doc(this.getId);

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
              voucherId: this.voucherId, //voucher id
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
              this.$router.replace({
              name: "ListSwimmingPool",
              params: {},
            });
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
              voucherId: this.voucherId, //voucher id
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
              this.$router.replace({
              name: "ListSwimmingPool",
              params: {},
            });
            })
            .catch((error) => {
              console.log(error);
            });
        }
        this.loadingActive = false;
      } catch (error) {
        console.log(error);
      }
    },

    async deleteAdult() {
      this.getPrice = Number(this.getPrice) - Number(this.adults.totalPrice);
      console.log("delete adult");
      this.adults.adultCount = 0;
      this.adults.adultPrice = 0;
      this.adults.totalPrice = 0;
    },

    async deleteChild() {
      this.getPrice = Number(this.getPrice) - Number(this.childs.totalPrice);
      console.log("delete child");
      this.childs.childCount = 0;
      this.childs.childPrice = 0;
      this.childs.totalPrice = 0;
    },

    handleChangeAdult($event) {
      // this.adultCategories.name = this.categories.name;
      // this.adultCategories.amount = this.categories.amount;

      this.quantity = $event.target.value;
      this.adults.adultCount = $event.target.value;
      this.adults.adultPrice = this.adultCategories.amount;
      this.adults.totalPrice =
        Number(this.adultCategories.amount) * $event.target.value;
      this.subTotal = this.adults.totalPrice;

      this.getPrice =
        Number(this.adults.totalPrice) + Number(this.childs.totalPrice);
    },

    handleChangeChild($event) {
      // this.childCategories.name = this.categories.name;
      // this.childCategories.amount = this.categories.amount;

      this.quantity = $event.target.value;
      this.childs.childCount = $event.target.value;
      this.childs.childPrice = this.childCategories.amount;
      this.childs.totalPrice =
        Number(this.childCategories.amount) * $event.target.value;
      this.subTotal = this.childs.totalPrice;
      this.getPrice =
        Number(this.childs.totalPrice) + Number(this.adults.totalPrice);
    },

    async updatedSwimmingAddList() {
      if (this.adults.adultCount == 0) {
        this.voucherID = this.generateVoucherId(1);
      } else if (this.childs.childCount === 0) {
        this.voucherID = this.generateVoucherId(1);
      } else {
        this.voucherID = this.generateVoucherId(2);
      }

      let categoryRefMen = await db
        .collection(this.owner.city)
        .doc(this.owner.shopId)
        .collection("swimmingPoolVouchers")
        .doc(this.getId);

      this.loadingActive = true;
      categoryRefMen
        .set({
          adultCount: this.adults.adultCount ? this.adults.adultCount : 0,
          adultPrice: this.adults.adultPrice ? this.adults.adultPrice : 0,

          childCount: this.childs.childCount ? this.childs.childCount : 0,
          childPrice: this.childs.childPrice ? this.childs.childPrice : 0,

          dateTime: this.currentDateTime,
          day: this.currentDay,
          selectedDay: "",

          endTime: "",
          startTime: "",
          totalTime: "",
          name: "",
          phone: "",
          address: "",
          nrc: "",
          type: "",
          status: "single",

          id: categoryRefMen.id,
          month: this.currentMonth,
          totalPrice: this.getPrice,
          partyOnePrice: "",
          voucherId: this.voucherID,
          year: this.currentYear,
        })
        .then(() => {
          this.loadingActive = false;
          this.$router.back();
          console.log("Add SwimmingMen Pool Vouchers OKhhh");
        });
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
td, th{
  white-space: nowrap !important;
}    
</style>