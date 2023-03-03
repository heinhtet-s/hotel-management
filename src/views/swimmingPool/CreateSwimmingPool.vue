<template>
  <AdminSidebar>
    <InfoDialog v-if="infoModalActive" :modal-message="modalMessage" v-on:close-modal="closeModal" />

    <Loading v-if="loadingActive" />
    <div class="col-12" style="height: 95vh; overflow-y: scroll">


      <div class="d-flex justify-content-between align-items-center rounded mt-2">
        <router-link :to="{ name: 'ListSwimmingPool' }" class="btn btn-sm me-2 fs-4" style="color: var(--primary)"><i
            class="fas fa-chevron-left"> </i> <span>{{ $t('message.ticket') }}</span>
        </router-link>
       
      </div>
      <div class="row">
        <div class="col-6 mx-auto">
        <div class="d-flex">
        <div class="me-3">
          <form class="form" @submit.prevent="submitSwimmingAddList">
            <div class="mb-1">
              <label for="name-input mb-1">{{ $t('message.adult_count') }}</label>

              <input type="number" class="form-control" id="name-input" placeholder="" v-model="ticket.adultCount" />
            </div>

            <div class="">
              <label for="name-input mb-1">{{ $t('message.infant_count') }}</label>
              <input type="number" class="form-control" id="name-input" placeholder="" v-model="ticket.childCount" />
            </div>
            <div class="col-12">
              <button v-print="'#printcontent'" class="btn mt-3 w-100 text-light"
                style="background-color: var(--primary);">{{ $t('message.confirm') }}</button>
            </div>
          </form>
        </div>

        <div class="voucher-box border border-1 rounded">
          <div class="bg-white p-2 text-black py-3 px-3" id="printcontent">
            <div class="d-flex fw-bold align-items-center mb-2">
              <img :src="shopInfo.profileUrl" class="rounded me-2" width="150" height="150"
                v-if="showLogo === 'true'" />
              <div class="mt-1 d-flex flex-column w-100 px-2"
                :class="showLogo === 'true' ? 'text-start' : 'text-center'">
                <span class="fs-4 fw-bolder">360 Swimming Pool Vouncher
                </span>
                <span class="my-1">{{ shopInfo.address }}</span>
                <span><i class="fas fa-square-phone-flip"></i>
                  {{ shopInfo.phone }}</span>
              </div>
            </div>
            <div class="
                  text-start
                  fw-bold
                  d-flex
                  flex-column
                  pt-1
                  voucher-list-solid
                ">
              <span class="mb-1">{{ $t("message.voucher_no") }}
                {{ voucherID }}
              </span>

              <span class="mb-1">{{ $t("message.date") }}:
                {{ currentDay }}
              </span>
            </div>

            <table class="
                  w-100
                  table-1
                  border-0
                  p-0
                  m-0
                  table
                  border-white
                  table-voucher
                ">
              <thead class="p-0 voucher-list-bottom">
                <tr class="py-1" style="
                      border-bottom: 2px dotted black !important;
                      border-right: 0 !important;
                      border-left: 0 !important;
                      border-top: 0 !important;
              ">
                  <th class="bg-white border-0 text-start text-wrap align-start" style="width: 40%">
                    <!-- {{ $t("message.items") }} -->
                    Type
                  </th>
                  <th class="bg-white border-0 text-end text-nowrap align-start">
                    {{ $t("message.qty") }}
                  </th>
                  <th class="bg-white border-0 text-end text-nowrap align-start">
                    {{ $t("message.price") }}
                  </th>
                  <th class="bg-white border-0 text-end text-nowrap align-start">
                    <!-- {{ $t("message.amount") }} -->
                    SubTotal
                  </th>
                </tr>
              </thead>
              <tbody class="border-0 fw-bold p-0">
                <tr class="border-0 mb-1 py-1" v-if="ticket.adultCount">
                  <td class="border-0 text-start text-wrap align-start" style="width: 40%">
                    Adult
                  </td>
                  <td class="border-0 text-end text-nowrap align-start">
                    {{ ticket.adultCount }}
                  </td>
                  <td class="border-0 text-end text-nowrap align-start">
                    {{ Number(ticket.adultPrice).toLocaleString() }} Ks
                  </td>
                  <td class="border-0 text-end text-nowrap align-start">
                    {{ (Number(ticket.adultCount) * Number(ticket.adultPrice)).toLocaleString() }} Ks
                  </td>
                </tr>

                <tr class="border-0 mb-1 py-1" v-if="ticket.childCount">
                  <td class="border-0 text-start text-wrap align-start" style="width: 40%">
                    Child
                  </td>
                  <td class="border-0 text-end text-nowrap align-start">
                    {{ ticket.childCount }}
                  </td>
                  <td class="border-0 text-end text-nowrap align-start">
                    {{ Number(ticket.childPrice).toLocaleString() }} Ksss
                  </td>
                  <td class="border-0 text-end text-nowrap align-start">
                    {{ (Number(ticket.childPrice) * Number(ticket.childCount)).toLocaleString() }} Ks
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="py-1" style="
              border-bottom: 2px dotted black !important;
                border-right: 0 !important;
                border-left: 0 !important;
                border-top: 0 !important;"></div>
            <div class="px-1 flex-column">
              <div class="d-flex fw-bold py-1 voucher-list-top">
                <span class="w-75 text-start"> Final Total </span>
                <span class="w-25 text-end">
                  {{ totalPrice }}Ks</span>
              </div>


              <div class="text-center">
                <p class="fw-bold">{{ $t("message.thank") }}</p>
                <p class="mt-1">Power by Light Idea Software Development</p>
              </div>
            </div>
          </div>
        </div>
       </div>

      </div>
      </div>

     


    </div>
    
  </AdminSidebar>
</template>
  
<script>
import AdminSidebar from "@/components/AdminSidebar";
import db from "@/config/FirebaseInit";
import Loading from "@/components/Loading";
import html2canvas from 'html2canvas'
import InfoDialog from "@/components/InfoDialog";
export default {
  components: { AdminSidebar, Loading, InfoDialog },
  data() {
    return {
      loadingActive: false,
      infoModalActive: false,
      modalMessage: '',

      ticket: {
        amount: "",
        name: "",
        adultCount: "",
        adultPrice: "",
        childCount: "",
        childPrice: "",
        totalPrice: "",
      },

      voucherID: "",
      voucherCount: '',

    };
  },

  computed: {
    totalPrice() {
      let total = 0;
      let childCount = this.ticket.childCount ? this.ticket.childCount : 0
      let childCost = parseInt(childCount) * parseInt(this.ticket.childPrice);

      let adultCount = this.ticket.adultCount ? this.ticket.adultCount : 0
      let adultCost = parseInt(adultCount) * parseInt(this.ticket.adultPrice);
      console.log(adultCost, ",", childCost);
      total = adultCost + childCost;
      console.log(total);
      return total;
    },

    cashierAcc() {
      return this.$store.getters.getCashierAcc;
    },

    showLogo() {
      return localStorage.getItem("showLogoImage");
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
    this.$store.dispatch("getCashierAcc", this.owner);

    this.$store.dispatch("getDateTime");
    this.$store.dispatch("getDay");
    this.$store.dispatch("getMonth");
    this.$store.dispatch("getYear");
    this.$store.dispatch("getShopInfo", this.owner);

    await this.getSwimmingCategories();
    await db
      .collection(this.owner.city)
      .doc(this.owner.shopId)
      .collection("swimmingPoolVouchers")
      .where("day", "==", this.currentDay)
      .onSnapshot(snapshot => {
        this.voucherCount = snapshot.size + 1;
      })
  },

  methods: {
    closeModal() {
      this.infoModalActive = !this.infoModalActive;
    },

    async submitSwimmingAddList() {
      if (this.ticket.childCount !== "" || this.ticket.adultCount !== "") {
        let categoryRefMen = await db
          .collection(this.owner.city)
          .doc(this.owner.shopId)
          .collection("swimmingPoolVouchers")
          .doc();
        const data = {
          adultCount: this.ticket.adultCount ? this.ticket.adultCount + "" : 0 + "",
          adultPrice: this.ticket.adultPrice ? this.ticket.adultPrice + "" : 0 + "",

          childCount: this.ticket.childCount ? this.ticket.childCount + "" : 0 + "",
          childPrice: this.ticket.childPrice ? this.ticket.childPrice + "" : 0 + "",

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
          totalPrice: this.totalPrice + "",
          partyOnePrice: "",
          voucherId: this.generateVoucherId(),
          year: this.currentYear,
        }
        console.log(data)


        categoryRefMen
          .set(data)
          .then(() => {
            this.loadingActive = false;
            this.$router.back();
          });
      } else {
        this.infoModalActive = true;
        this.modalMessage = "Enter Adult or Child Count!"
      }

    },

    generateVoucherId() {
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
        this.voucherCount.toString().padStart(5, "0");
      return vId;
    },

    async getSwimmingCategories() {
      await db
        .collection(this.owner.city)
        .doc(this.owner.shopId)
        .collection("swimmingPoolCategory")
        .orderBy("date", "desc")
        .onSnapshot((snapshot) => {
          snapshot.forEach((doc) => {
            if (doc.data().name === "Adult") {
              this.ticket.adultPrice = doc.data().amount;
              // console.log("doc", doc.data().name);
            }

            if (doc.data().name === "Child") {
              this.ticket.childPrice = doc.data().amount;
            }
          });
        });
    },
    async printThis() {
      console.log("printing..");
      const el = this.$refs.printcontent;

      const options = {
        type: "dataURL",
      };
      const printCanvas = await html2canvas(el, options);

      const link = document.createElement("a");
      link.setAttribute('download', `${this.checkoutItem.vouncherId}.png`);
      link.setAttribute(
        "href",
        printCanvas
          .toDataURL("image/png")
          .replace("image/png", "image/octet-stream")
      );
      link.click();

      console.log("done");
    },
  },
};
</script>
  
<style scoped>

</style>