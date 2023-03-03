<template>
  <AdminSidebar>
    <Loading v-if="loadingActive" />
    <InfoDialog
      v-if="infoModalActive"
      :modalMessage="modalMessage"
      @close-modal="closeInfoModal"
    />
    <confirm-dialog
      :modalMessage="modalMessage"
      v-if="confirmActive"
      @confirm="confirm"
      v-on:cancel="cancel"
    />

    <div class="col-12 col-lg-12" style="height: 95vh; overflow-y: scroll">
      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      ></div>

      <div
        class="d-flex align-items-center justify-content-between rounded mt-2"
      >
        <div class="d-flex align-items-center rounded mt-2">
          <router-link
            :to="{ name: 'ListSwimmingPool' }"
            class="btn btn-sm me-2 fs-4"
            style="color: var(--primary)"
            ><i class="fas fa-chevron-left"> </i
          >
          <span>{{ $t('message.details') }}</span>

        </router-link>
        </div>

        <div
          class="
            category-box
            d-lg-flex
            justify-content-between
            align-items-center
          "
        >
          <div>
            <button
              class="btn btn-sm btn-danger me-2"
              @click="deleteSwimming(id)"
            >
              <i class="fa-sharp fa-solid fa-trash"></i> Delete
            </button>
          </div>
          <div></div>
        </div>
      </div>

      <div class="mt-2">
        <!----------Voucher Pool  -->
        <div style="display: block" v-if="status === 'single'">
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
                  {{ printVoucherId }}
                </span>

                <span class="mb-1"
                  >{{ $t("message.date") }}:
                  {{ day }}
                </span>
              </div>

              <table
                class="
                  w-100
                  table-1
                  border-0
                  p-0
                  m-0
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
                      {{ adults.name }}
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
                      {{ Number(adults.subTotal).toLocaleString() }} Ks
                    </td>
                  </tr>

                  <tr class="border-0 mb-1 py-1">
                    <td
                      class="border-0 text-start text-wrap align-start"
                      style="width: 40%"
                      v-if="childs.childCount !== 0"
                    >
                      {{ childs.name }}
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
                      {{ Number(childs.subTotal).toLocaleString() }} Ks
                    </td>
                  </tr>
                </tbody>
              </table>

              <div
                class="d-flex fw-bold py-1 voucher-list-top"
                style="
                  border-bottom: 2px dotted black !important;
                  border-right: 0 !important;
                  border-left: 0 !important;
                  border-top: 0 !important;
                "
              ></div>
              <div class="px-1 flex-column m-3">
                <div class="d-flex fw-bold py-1 voucher-list-top">
                  <span class="w-75 text-start"> Final Total </span>
                  <span class="w-25 text-end">
                    {{ Number(finalTotal).toLocaleString() }}
                    Ks</span
                  >
                </div>

                <div class="text-center">
                  <p class="fw-bold">Thank You</p>
                  <p class="mt-1">Power by Light Idea Software Development</p>
                </div>
              </div>

              <div>
                <button
                  style="background-color: var(--primary)"
                  v-print="'#printcontent'"
                  type="button"
                  class="btn w-100 my-2 text-white mx-auto"
                  data-bs-dismiss="modal"
                >
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- end pool -->
        <!-- vouncher party -->
        <div style="display: block" v-if="status === 'party'">
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
                    {{ partyPrintVouncherId }}
                  </span>

                  <span class="mb-1"
                    >Selected Date:
                    {{ partySelectedDate }}
                  </span>
                  <span class="mb-1">
                    Date:
                    {{ partyDay }}
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
                    {{ partyName }}
                  </span>

                  <span class="mb-1"
                    >Phone :
                    {{ partyPhone }}
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
                  <p class="text-start">{{ partyType }}</p>
                </div>
                <div
                  class="d-flex justify-content-between fw-bold text-start"
                  v-if="partyType === 'Section'"
                >
                  <p class="">Start Time</p>
                  <p class="">{{ partyStartTime }}</p>
                </div>
                <div
                  class="d-flex justify-content-between fw-bold"
                  v-if="partyType === 'Section'"
                >
                  <p class="text-start">End Time</p>
                  <p class="text-start">{{ partyEndTime }}</p>
                </div>
                <div
                  class="d-flex justify-content-between fw-bold"
                  v-if="partyType === 'Section'"
                >
                  <p class="text-start">Total Time</p>
                  <p class="text-start">
                    {{ partyTotalTime }}
                  </p>
                </div>
                <div class="d-flex justify-content-between fw-bold">
                  <p class="text-start">Price</p>
                  <p class="text-start">{{ partyOnePrice }} Ks</p>
                </div>
                <div
                  class="d-flex fw-bold py-1 voucher-list-top"
                  style="
                    border-bottom: 2px dotted black !important;
                    border-right: 0 !important;
                    border-left: 0 !important;
                    border-top: 0 !important;
                  "
                ></div>
                <div class="d-flex justify-content-between fw-bold">
                  <p class="text-start">SubTotal</p>
                  <p class="text-start">
                    {{ parseInt(partyGetTotalPrice).toLocaleString() }} Ks
                  </p>
                </div>
              </div>

              <div class="px-1 flex-column mt-3">
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
              <div>
                <button
                  style="background-color: var(--primary)"
                  v-print="'#printcontentP'"
                  type="button"
                  class="btn w-100 my-2 text-white mx-auto"
                  data-bs-dismiss="modal"
                >
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- vouncher party end -->
      </div>
    </div>
  </AdminSidebar>
</template>
    
    <script>
import AdminSidebar from "@/components/AdminSidebar";
import db from "@/config/FirebaseInit";
import Loading from "../../components/Loading.vue";
import InfoDialog from "../../components/InfoDialog";
import ConfirmDialog from "../..//components/ConfirmDialog";
export default {
  components: { AdminSidebar, Loading, InfoDialog, ConfirmDialog },
  props: ["id"],
  data() {
    return {
      // new updated
      confirmActive: false,
      loadingActive: false,
      infoModalActive: false,
      modalMessage: "",
      deleteId: "",

      oneMenPrice: "",
      oneChildPrice: "",

      quantity: 0,
      subTotal: 0,
      swimmingArray: [],

      name: "",
      qty: 0,
      onePrice: 0,
      getPrice: 0,
      getTotalPrice: 0,
      printVoucherId: "",
      day: "",

      adults: {
        adultCount: 0,
        adultPrice: 0,
        totalPrice: 0,
        day: "",
        name: "",
      },

      // FinalTotal: "",

      childs: {
        childCount: 0,
        childPrice: 0,
        totalPrice: 0,
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
      partyOnePrice: "",
      partyGetTotalPrice: "",
      partyPrintVouncherId: "",
      partyDay: "",
      partyCurrent: "",
      partySelectedDate: "",

      // end new updated
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

    cashierAcc() {
      return this.$store.getters.getCashierAcc;
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
    // console.log("this.id", this.id);
    this.categoryRef = await db
      .collection(this.owner.city)
      .doc(this.owner.shopId)
      .collection("swimmingPoolCategory")
      .doc();

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
        // console.info("product", snapshot.data());

        if (snapshot.data().status === "single") {
          this.finalTotal = snapshot.data().totalPrice;

          this.adults.adultCount = snapshot.data().adultCount;
          this.adults.name = snapshot.data().adultCount !== 0 ? "men" : "";
          this.adults.adultPrice = snapshot.data().adultPrice;
          this.adults.subTotal =
            Number(snapshot.data().adultPrice) *
            Number(snapshot.data().adultCount);
          this.adults.totalPrice = snapshot.data().totalPrice;

          this.childs.childCount = snapshot.data().childCount;
          this.childs.name = snapshot.data().childCount !== 0 ? "child" : "";
          this.childs.childPrice = snapshot.data().childPrice;
          this.childs.subTotal =
            Number(snapshot.data().childPrice) *
            Number(snapshot.data().childCount);
          this.childs.totalPrice = snapshot.data().totalPrice;

          this.printVoucherId = snapshot.data().vouncherId;
          this.day = snapshot.data().day;

          // this.onePrice =
          //   snapshot.data().adultPrice === 0
          //     ? snapshot.data().childPrice
          //     : snapshot.data().adultPrice;
          // this.getTotalPrice = snapshot.data().totalPrice;
          // this.name = snapshot.data().type;
        }

        if (snapshot.data().status === "party") {
          this.partyName = snapshot.data().name;
          this.partyPrintVouncherId = snapshot.data().voucherId;
          this.partyPhone = snapshot.data().phone;
          this.partySelectedDate = snapshot.data().selectedDay;
          this.partyDay = snapshot.data().day;
          this.partyOnePrice = snapshot.data().partyOnePrice;
          this.partyGetTotalPrice = snapshot.data().totalPrice;
          this.partyStartTime = snapshot.data().startTime;
          this.partyEndTime = snapshot.data().endTime;
          this.partyTotalTime = snapshot.data().totalTime;
          this.partyType = snapshot.data().type;
        }
      });
  },

  methods: {
    // new updated
    onChangeCategory() {
      this.people.price = this.categories.amount;
    },

    handleChangeQty($event) {
      this.quantity = $event.target.value;
      this.people.count = $event.target.value;
      this.people.totalPrice = this.people.price * $event.target.value;
      this.subTotal = this.people.totalPrice;
    },

    async deleteSwimming(id) {
      this.deleteId = id;
      this.confirmActive = true;
      this.confirmStatus = "delete";
    },

    async confirm() {
      if (this.confirmStatus === "delete") {
        this.loadingActive = true;
        this.confirmActive = !this.confirmActive;
        await db
          .collection(this.owner.city)
          .doc(this.owner.shopId)
          .collection("swimmingPoolVouchers")
          .doc(this.deleteId)
          .delete()
          .then(() => {
            this.loadingActive = false;
            console.log("delete is success");
            this.modalMessage = this.$t("message.deleted");
            // this.infoModalActive = true;

            this.$router.replace({
              name: "ListSwimmingPool",
              params: {},
            });
          });
      }
    },

    closeInfoModal() {
      this.infoModalActive = !this.infoModalActive;
    },

    cancel() {
      this.confirmActive = !this.confirmActive;
      this.loadingActive = false;
    },

    async submitSwimming() {
      let padNumber = this.swimmingArray.length + 1;
      this.people.vouncherId = this.generateVoucherId(padNumber);

      try {
        let categoryRefChild = await db
          .collection(this.owner.city)
          .doc(this.owner.shopId)
          .collection("swimmingPoolVouchers")
          .doc();

        let categoryRefMen = await db
          .collection(this.owner.city)
          .doc(this.owner.shopId)
          .collection("swimmingPoolVouchers")
          .doc();

        if (this.swimmingArray.length > 0) {
          this.loadingActive = true;

          this.swimmingArray.forEach((order) => {
            // console.log("order", order.count);
            if (order.name === "men") {
              categoryRefMen
                .set({
                  adultCount: order.count,
                  adultPrice: order.price,

                  childCount: 0,
                  childPrice: 0,
                  dateTime: this.currentDateTime,
                  day: this.currentDay,
                  endTime: "",
                  startTime: "",
                  name: "",
                  phone: "",
                  address: "",
                  nrc: "",
                  type: "",
                  status: "single",

                  id: categoryRefMen.id,
                  month: this.currentMonth,
                  totalPrice: Number(order.count) * Number(order.price),
                  vouncherId: this.people.vouncherId,
                  year: this.currentYear,
                })
                .then(() => {
                  this.loadingActive = false;
                  console.log("Add SwimmingMen Pool Vouchers");
                })
                .catch((error) => {
                  console.log(error);
                });
            }

            if (order.name === "child") {
              categoryRefChild
                .set({
                  adultCount: 0,
                  adultPrice: 0,

                  childCount: order.count,
                  childPrice: order.price,
                  dateTime: this.currentDateTime,
                  day: this.currentDay,
                  endTime: "",
                  startTime: "",
                  name: "",
                  phone: "",
                  address: "",
                  nrc: "",
                  type: "",
                  status: "single",

                  id: categoryRefMen.id,
                  month: this.currentMonth,
                  totalPrice: Number(order.count) * Number(order.price),
                  vouncherId: this.people.vouncherId,
                  year: this.currentYear,
                })
                .then(() => {
                  this.loadingActive = false;
                  console.log("Add SwimmingMen Pool Vouchers");
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          });

          // this.swimmingArray = [];
        }
        this.loadingActive = false;
      } catch (error) {
        console.log(error);
      }
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

    // end new updated

    async submitCategory() {
      try {
        this.categories.amount = this.categories.amount.toString();
        let categoryRef = await db
          .collection(this.owner.city)
          .doc(this.owner.shopId)
          .collection("swimmingPoolCategory")
          .doc();

        this.loadingActive = true;

        console.log("first", this.categories.name);
        console.log("am", this.categories.amount);
        await categoryRef
          .set({
            name: this.categories.name,
            id: categoryRef.id,
            amount: this.categories.amount,
            date: this.currentDay,
          })
          .then(() => {
            (this.categories.name = ""),
              (this.categories.amount = ""),
              (this.loadingActive = false);
            console.log("Add Swimming Category");
          })
          .catch((error) => {
            console.log(error);
          });

        this.loadingActive = false;
      } catch (error) {
        console.log(error);
      }
      // console.log("first", this.categories.amount);
    },
  },
};
</script>
    
    <style scoped>
</style>