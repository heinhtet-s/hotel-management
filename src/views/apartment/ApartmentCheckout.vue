<template>
  <div>
    <Loading v-if="loadingActive" />
    <InfoDialog v-if="infoModalActive" :modal-message="modalMessage" v-on:close-modal="closeModal" />
    <ConfirmDialog :modal-message="modalMessage" v-if="confirmActive" v-on:confirm="confirm" v-on:cancel="cancel" />
    <AdminSidebar>
      <div class="row">
        <div class="d-flex justify-content-between border-0 align-items-center">
          <button class="btn d-none d-lg-block" style="color: var(--text-color)" @click="$router.back()">
            <i class="fas fa-chevron-left"></i>
            <span class="ms-1">Back</span>
          </button>
          <div class="d-flex">
            <div class="d-none d-lg-block">
              <button class="btn" style="color: var(--text-color) !important" @click="printThis">
                <i class="fas fa-save"></i>
              </button>
              <button class="btn" style="color: var(--text-color) !important" v-print="'#printcontent'">
                <i class="fas fa-print"></i>
              </button>
            </div>
            <button type="button" style="color: var(--text-color) !important" class="btn" data-bs-dismiss="modal"
              @click="$router.back()" aria-label="Close">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
        <div class="row p-1">
          <!-- For large Screen Discount box-->
          <div class="col-12 col-lg-4 mx-auto modal-body-box">
            <!--discount box-->
            <div class="">
              <p class="alert alert-warning m-1" v-if="showAlert">
                <i class="fas fa-triangle-exclamation"></i> {{ alertMessage }}
              </p>
              <div class="discount-box p-2" v-if="showDiscountBox">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <label class="form-label">{{ $t('message.discount') }} (Optional)</label>
                  <button class="btn btn-sm" style="
                      background-color: var(--light);
                      color: var(--discountPrimary);
                    " @click="addedDiscount = {}">
                    {{ $t('message.reset') }}
                  </button>
                </div>
                <select class="form-select form-control" v-model="discountType"
                  @change="discountType = $event.target.value" aria-label="Default select example">
                  <option value="price">{{ $t('message.by_price') }}</option>
                  <option value="rate">{{ $t('message.by_rate') }}</option>
                </select>
                <form @submit.prevent="discountChange" class="mt-2">
                  <input type="number" required id="floatingRate" placeholder="enter amount" class="form-control"
                    v-model="newDiscount" />
                  <div class="d-flex mt-1 justify-content-end">
                    <button type="submit" class="btn btn-sm text-black" style="background-color: var(--btnLight)">
                      {{ $t('message.add') }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <!--payment box -->
            <hr>
            <div class="mt-2 p-2 discount-box" v-if="showPaymentBox">
              <p class="alert alert-warning mt-2" v-if="showWarning">
                <i class="fas fa-triangle-exclamation"></i> {{ warningMessage }}
              </p>
              <div class="d-flex justify-content-between align-items-center">
                <span>{{ $t('message.pay_amount') }}</span>
                <button class="btn btn-sm" @click="resetPayment" style="
                  background-color: var(--light);
                    color: var(--discountPrimary);
                  ">
                  {{ $t('message.reset') }}
                </button>
              </div>
              <button class="form-select text-start form-control mt-2" @click="showPaymentToggle = !showPaymentToggle">
                {{ selectedPaymentType.paymentType }}
              </button>
              <div class="payment-pop-up shadow-sm p-2 rounded" style="background-color: var(--background-color)"
                v-if="showPaymentToggle">
                <li v-for="(type, index) in paymentMethods" :key="index"
                  class="my-1 list-unstyled text-black rounded text-start px-1"
                  style="cursor: pointer; background-color: var(--light)" @click="choosePaymentType(type)">
                  <div class="w-100 d-flex align-items-center justify-content-start">
                    <img :src="type.url" v-if="type.url !== ''" class="rounded" width="40" height="40" alt="" />
                    <img src="../../assets/flash/1.png" width="50" height="50" class="rounded" v-else alt="" />
                    <div class="d-flex flex-column ms-2">
                      <div class="d-flex">
                        <span>{{ type.paymentType }}</span>
                        <span v-if="type.accountName !== ''">({{ type.accountName }})</span>
                      </div>
                      <span style="color: var(--secondary)">{{
                        type.accountNumber
                      }}</span>
                    </div>
                  </div>
                </li>
              </div>
              <div class="text-success fs-5 my-1">
                <p>{{ $t('message.paid_amount') }} = {{ parseInt(reservationDetail?.paidAmount).toLocaleString() }} Ks
                </p>
              </div>
              <span>{{ $t('message.enter_pay_amount') }}</span>
              <div class="">
                <input type="number" ref="payInput" id="floatingRate" @input="calculatePayAmount"
                  class="form-control me-1" v-model="payAmount" autofocus :disabled="!selectedPaymentType" />

                <div class="form-floating"></div>
                <div class="d-flex mt-1 justify-content-end">
                  <button class="btn btn-sm d-none" style="background-color: var(--btnLight)"
                    @click="calculatePayAmount">
                    {{ $t('message.add') }}
                  </button>
                </div>
              </div>
            </div>

            <!--note box-->
            <div class="mt-2 p-2 discount-box">
              <textarea cols="50" class="form-control" rows="3" v-model="note"
                placeholder="enter note (optional)"></textarea>
            </div>
          </div>
          <!--Customer box-->
          <div class="col-12 col-lg-4 mx-auto modal-body-box customer-box">
            <p style="font-size: 1.25rem">{{ $t('message.guest_info') }}</p>
            <div class="mt-3">
              <div class="w-full d-flex align-items-center justify-content-between mt-1 p-1"
                style="background-color: #eee; border-radius: 0.25rem">
                <p>{{$t('message.start_time')}}</p>
                <p>{{ reservationDetail.checkInTime }}</p>
              </div>

              <div class="w-full d-flex align-items-center justify-content-between mt-1 p-1"
                style="background-color: #eee; border-radius: 0.25rem">
                <p>{{$t('message.name')}}</p>
                <p>{{ reservationDetail.customerName }}</p>
              </div>
              <div class="w-full d-flex align-items-center justify-content-between mt-1 p-1"
                style="background-color: #eee; border-radius: 0.25rem">
                <p>{{$t('message.phone')}}</p>
                <p>{{ reservationDetail.customerPhone }}</p>
              </div>
              <div class="w-full d-flex align-items-center justify-content-between mt-1 p-1"
                style="background-color: #eee; border-radius: 0.25rem">
                <p>{{$t('message.adult_count')}}</p>
                <p>{{ reservationDetail.numberOfAdults }}</p>
              </div>
              <div class="w-full d-flex align-items-center justify-content-between mt-1 p-1"
                style="background-color: #eee; border-radius: 0.25rem">
                <p>{{ $t('message.infant_count') }}</p>
                <p>{{ reservationDetail.numberOfKids }}</p>
              </div>
              <div class="w-full d-flex align-items-start justify-content-between mt-1 p-1"
                style="background-color: #eee; border-radius: 0.25rem">
                <p>{{$t('message.date')}}</p>
                <div>
                  <p v-for="date in reservationDetail.dateList" :key="date">
                    {{ date }}
                  </p>
                </div>
              </div>
              <div class="w-full d-flex align-items-center justify-content-between mt-1 p-1"
                style="background-color: #eee; border-radius: 0.25rem">
                <p>{{$t('message.room')}}</p>
                <p>{{ reservationDetail.apartmentName }}</p>
              </div>
            </div>
          </div>

          <!-- voucher box-->
          <div class="col-12 col-lg-4 modal-body-box mx-auto">
            <div class="voucher-box" v-if="voucherStyle === 'listStyle'">
              <div class="bg-white p-2 text-black py-3 px-3" style="font-size: 12px" ref="printcontent"
                id="printcontent">
                <div class="d-flex fw-bold align-items-center">
                  <img :src="shopInfo.profileUrl" class="rounded me-2" width="150" height="150"
                    v-if="showLogo === 'true'" />
                  <div class="mt-1 d-flex flex-column w-100 px-2"
                    :class="showLogo === 'true' ? 'text-start' : 'text-center'">
                    <span class="fs-5 fw-bolder">{{ shopInfo.name }}</span>
                    <span class="my-1">{{ shopInfo.address }}</span>
                    <span><i class="fas fa-square-phone-flip"></i>
                      {{ shopInfo.phone }}</span>
                  </div>
                </div>

                <div class="text-start fw-bold d-flex flex-column pt-1 mx-2 mt-2 mb-2 voucher-list-solid">
                  <span class="mb-1">{{ $t('message.voucher_no') }}: {{ vId }}</span>
                  <span class="mb-1">Room: {{ reservationDetail.apartmentName }}</span>
                  <span class="mb-1">Customer Name: {{ reservationDetail.customerName }}</span>
                  <span class="mb-1">Customer Phone: {{ reservationDetail.customerPhone }}</span>
                  <span class="mb-1">{{ $t('message.date') }}: {{ dateTime }}</span>
                </div>
                <table class="w-100 table-1 border-0 table border-white">
                  <thead class="px-2">
                    <tr class="py-1" style="
                        border-bottom: 2px dotted black !important;
                        border-right: 0 !important;
                        border-left: 0 !important;
                        border-top: 0 !important;
                      ">
                      <th class="bg-white border-0 text-start text-wrap align-start" style="width: 40%">
                        {{ $t('message.items') }}
                      </th>
                      <th class="bg-white border-0 text-end text-nowrap align-start">
                        {{ $t('message.qty') }}
                      </th>
                      <th class="bg-white border-0 text-end text-nowrap align-start">
                        {{ $t('message.price') }}
                      </th>
                      <th class="bg-white border-0 text-end text-nowrap align-start">
                        {{ $t('message.amount') }}
                      </th>
                    </tr>
                  </thead>
                  <tbody class="border-0 fw-bold p-0">
                    <tr class="border-0 mb-1 px-0 py-1">
                      <td class="border-0 text-start text-wrap align-start" style="width: 40%">
                        Stayed
                      </td>
                      <td class="border-0 text-end text-nowrap align-start">
                        {{ reservationDetail.dateList?.length }} days
                      </td>
                      <td class="border-0 text-end text-nowrap align-start">
                        {{ parseInt(apartment.price) }} Ks
                      </td>
                      <td class="border-0 text-end text-nowrap align-start">
                        {{
                          parseInt(
                            reservationDetail.dateList?.length * apartment.price
                                                )
                        }}
                        Ks
                      </td>
                    </tr>
                    <tr v-if="reservationDetail.extraBed" class="border-0 mb-1 px-0 py-1">
                      <td class="border-0 text-start text-wrap align-start" style="width: 40%">
                        Extra Bed
                      </td>
                      <td class="border-0 text-end text-nowrap align-start">
                        {{ reservationDetail.extraBed }}
                      </td>
                      <td class="border-0 text-end text-nowrap align-start">
                        {{ parseInt(apartment.extraBadFee) }} Ks
                      </td>
                      <td class="border-0 text-end text-nowrap align-start">
                        {{
                          parseInt(
                            reservationDetail.extraBed * apartment.extraBadFee
                                                )
                        }}
                        Ks
                      </td>
                    </tr>
                    <tr v-for="(item, index) in orders" :key="index" class="border-0 mb-1 px-0 py-1">
                      <td class="border-0 text-start text-wrap align-start" style="width: 40%">
                        {{ item?.itemName }}
                      </td>
                      <td class="border-0 text-end text-nowrap align-start">
                        {{ item?.count }}
                      </td>
                      <td class="border-0 text-end text-nowrap align-start">
                        {{ parseInt(item?.sellPrice) }} Ks
                      </td>
                      <td class="border-0 text-end text-nowrap align-start">
                        {{ parseInt(+ item?.count * +item?.sellPrice) }}
                        Ks
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class="px-2 flex-column">
                  <div class="d-flex fw-bold py-1 voucher-list-top">
                    <span class="w-75 text-start">{{
                      $t('message.total')
                    }}</span>
                    <span class="w-25 text-end">{{
                      parseInt(this.totalAmount).toLocaleString()
                    }}
                      Ks</span>
                  </div>
                  <div class="d-flex fw-bold py-1" v-if="addedDiscount.amount > 0">
                    <span class="w-75 text-start">{{
                      $t('message.discount')
                    }}</span>
                    <span class="w-25 text-end">{{
                      parseInt(addedDiscount.amount).toLocaleString()
                    }}
                      Ks</span>
                  </div>

                  <div class="d-flex fw-bold py-1 voucher-list-top">
                    <span class="text-start w-75">{{
                      $t('message.net_amount')
                    }}</span>
                    <span class="text-end w-25">{{ parseInt(netAmount).toLocaleString() }} Ks</span>
                  </div>
                  <div class="d-flex fw-bold py-1">
                    <span class="text-start w-75">
                      {{ $t('message.cash_received') }}</span>
                    <span class="text-end w-25">{{
                      parseInt(
                        payAmount + +reservationDetail.paidAmount
                    ).toLocaleString()
                    }}
                      Ks</span>
                  </div>

                  <div class="d-flex fw-bold py-1 voucher-list-top">
                    <span class="text-start w-75">{{
                      $t('message.change')
                    }}</span>
                    <span class="text-end w-25">{{
                      parseInt(
                        payAmount + +reservationDetail.paidAmount - netAmount
                    ).toLocaleString()
                    }}
                      Ks</span>
                  </div>
                  <div v-if="note !== ''">
                    <span class="mb-1">* {{ note }}</span>
                  </div>
                  <div v-if="showRefund === 'true'">
                    <span class="mb-1">{{
                      $t('message.restrict_refund')
                    }}</span>
                  </div>

                  <div class="text-center">
                    <p class="fw-bold">{{ $t('message.thank') }}</p>
                    <p class="mt-1">Power by Light Idea Software Development</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="d-flex p-1 align-items-center justify-center" style="z-index: 1000; background-color: var(--light)">
          <!-- <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>-->
          <button class="btn mx-auto my-1 w-50 text-light text-uppercase fw-bold"
            style="background-color: var(--primary)" :disabled="sellNowActive == false" @click="handleCheckout"
            data-bs-dismiss="modal" v-print="'#printcontent'">
            {{ $t('message.checkout') }}
          </button>
        </div>
      </div>
    </AdminSidebar>
  </div>
</template>

<script>
import html2canvas from 'html2canvas';
import db from '../../config/FirebaseInit';
import ConfirmDialog from '@/components/ConfirmDialog';
import InfoDialog from '@/components/InfoDialog';
import Loading from '@/components/Loading';
import AdminSidebar from '@/components/AdminSidebar';
import 'lodash/debounce';
export default {
  components: {
    Loading,
    ConfirmDialog,
    InfoDialog,
    AdminSidebar,
  },
  data() {
    return {
      reservationDetail: {},
      totalAmount: 0,
      orders: [],
      apartment: {},
      addedDiscount: {},
      note: '',

      loadingActive: true,

      showDiscountBox: true,
      showPaymentBox: true,
      showCustomerBox: true,

      newDiscount: '',
      discountType: 'price',

      casherCode: '',

      showPaymentToggle: false,
      showCustomerAddBox: false,
      customerAlert: false,
      selectedPaymentType: '',
      payAmount: '',
      selectedCustomer: '',
      showWarning: true,
      warningMessage: '',
      sellNowActive: false,
      vId: '',
    };
  },
  computed: {
    netAmount() {
      return this.addedDiscount.amount
        ? this.totalAmount - this.addedDiscount.amount
        : this.totalAmount;
    },
    checkoutItem() {
      return this.$store.getters.getVoucher;
    },

    showLogo() {
      return localStorage.getItem('showLogoImage');
    },
    paymentMethods() {
      return this.$store.getters.getPaymentMethods;
    },
    showPhone() {
      return localStorage.getItem('showCustomerPhone');
    },
    showRefund() {
      return localStorage.getItem('showRefund');
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
    apartments() {
      return this.$store.getters.getAllApartments;
    },
  },
  watch: {
    payAmount(value) {
      if (value + +this.reservationDetail.paidAmount >= this.netAmount)
        this.sellNowActive = true;
      else this.sellNowActive = false;
    },
    reservationDetail(value) {
      if (this.payAmount + +value.paidAmount >= this.netAmount)
        this.sellNowActive = true;
      else this.sellNowActive = false;
    },
  },
  async mounted() {
    this.apartment = this.apartments.filter(
      (ap) => ap.id === this.$route.query.room_id
    )[0];
    this.$refs.payInput.focus();

    if (localStorage.getItem('voucherStyle')) {
      this.voucherStyle = localStorage.getItem('voucherStyle');
    }

    this.warningMessage = this.$t('message.enter_pay_amount');
    this.$store.dispatch('getShopInfo', this.owner);
    this.$store.dispatch('getDay');
    this.$store.dispatch('getMonth');
    this.$store.dispatch('getDateTime');
    this.$store.dispatch('getYear');
    this.$store.dispatch('getPaymentMethods', this.owner);
    this.selectedPaymentType = this.paymentMethods[0]
    this.$store.dispatch('getCashierAcc', this.owner);
    this.getReservationDetail();
    this.generateVoucherId();
  },
  methods: {
    async handleCheckout() {
      this.loadingActive = true;
      let sellPriceList = [];
      let productIdList = [];
      let nameList = [];
      let itemCodeList = [];
      let countList = [];
      let buyPriceList = [];

      if (this.orders.length > 0) {
        this.orders.forEach((order) => {
          sellPriceList.push(order.sellPrice);
          itemCodeList.push(order.itemCode);
          productIdList.push(order.id);
          nameList.push(order.itemName);
          countList.push(order.count);
          buyPriceList.push(order.buyPrice);
        });
      }
      const {
        year,
        day,
        description,
        status,
        totalAmount,
        paidAmount,
        ...rest
      } = this.reservationDetail;
      console.log({ year, day, description, status, totalAmount });
      let data = {
        ...rest,
        checkoutTime: this.dateTime,
        cashReceived: +this.payAmount + +paidAmount,
        totalPrice: this.netAmount,
        change: +this.payAmount + +paidAmount - +this.netAmount,
        voucherId: this.vId,
        sellPriceList,
        productIdList,
        nameList,
        itemCodeList,
        countList,
        buyPriceList,
        day: this.today,
        month: this.thisMonth,
        year: this.thisYear,
        note: this.note,
        apartmentPrice: this.apartment.price,
        extraBedFee: this.apartment.extraBadFee,
      };
      if (this.addedDiscount.amount) {
        data.discount = this.addedDiscount.amount;
      }
      db.collection(this.owner.city)
        .doc(this.owner.shopId)
        .collection('apartmentVouchers')
        .add(data)
        .then(() => {
          this.deleteReservation();
          this.loadingActive = false;
          this.$router.push('/shop-owner/apartment/All');
        })
        .catch((err) => console.log(err));
    },
    async getReservationDetail() {
      db.collection(this.owner.city)
        .doc(this.owner.shopId)
        .collection('apartments')
        .doc(this.$route.query.room_id)
        .collection('reservations')
        .doc(this.$route.params.reservation_id)
        .onSnapshot(
          (res) => {
            const data = res.data();
            this.reservationDetail = data;
            this.getOrderMenus(data.id);
            this.totalAmount = +this.apartment.price * data.dateList.length;
            if (data.extraBed)
              this.totalAmount += this.apartment.extraBadFee * data.extraBed;
          },
          () => (this.loadingActive = false)
        );
    },
    async deleteReservation() {
      db.collection(this.owner.city)
        .doc(this.owner.shopId)
        .collection('apartments')
        .doc(this.$route.query.room_id)
        .collection('reservations')
        .doc(this.$route.params.reservation_id)
        .delete()
        .catch((err) => console.log(err));
    },
    async getOrderMenus(id) {
      await db
        .collection(this.owner.city)
        .doc(this.owner.shopId)
        .collection('apartments')
        .doc(this.$route.query.room_id)
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
          if (result.length > 0) this.rearrangeOrders(result);
          this.loadingActive = false;
        });
    },
    rearrangeOrders(orders) {
      const onlyOrders = [];
      orders?.forEach((obj) =>
        obj.orders?.forEach((ord) => {
          this.totalAmount += +ord.count * +ord.sellPrice;
          const existed = onlyOrders.find((oord) => oord?.id === ord.id);
          if (existed) existed.count += ord.count;
          else onlyOrders.push(ord);
        })
      );
      this.orders = onlyOrders;
    },
    discountChange() {
      if (this.discountType === 'price') {
        this.addedDiscount = {
          type: 'price',
          discount: this.newDiscount,
          amount: this.newDiscount,
        };
      } else {
        const amount = ((this.newDiscount / 100) * this.totalAmount).toFixed();
        this.addedDiscount = {
          type: 'rate',
          discount: this.newDiscount,
          amount,
        };
      }
      this.newDiscount = '';
    },

    inputFocus() {
      if (this.selectedSearchType === 'barcode') {
        this.$refs.barcodeSearch.focus();
      }
    },

    choosePaymentType(type) {
      this.selectedPaymentType = type;
      this.checkoutItem.paymentMethod = type.paymentType;
      this.checkoutItem.paymentId = type.id;
      this.showPaymentToggle = !this.showPaymentToggle;
    },
    async generateVoucherId() {
      let size = null;
      await db
        .collection(this.owner.city)
        .doc(this.owner.shopId)
        .collection('apartmentVouchers')
        .get()
        .then((snap) => (size = snap.size + 1))
        .catch((err) => console.log(err));
      if (!size) size = 1;
      const date = new Date();
      let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
      let twoDigitMonth = new Intl.DateTimeFormat('en', {
        month: '2-digit',
      }).format(date);
      let twoDigitYear = date.getFullYear().toString().slice(-2);
      let vId = '';
      //TODO: must be used owner selected casherCode
      vId =
        this.shopInfo.shopCode +
        this.cashierAcc.accountCode +
        twoDigitYear +
        twoDigitMonth +
        day +
        size.toString().padStart(3, '0');

      this.vId = vId;
    },

    getRandomStr() {
      const chars = '1234567890';
      let result = '';
      for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    },

    async printThis() {
      console.log('printing..');
      const el = this.$refs.printcontent;

      const options = {
        type: 'dataURL',
      };
      const printCanvas = await html2canvas(el, options);

      const link = document.createElement('a');
      link.setAttribute('download', `${this.checkoutItem.vouncherId}.png`);
      link.setAttribute(
        'href',
        printCanvas
          .toDataURL('image/png')
          .replace('image/png', 'image/octet-stream')
      );
      link.click();

      console.log('done');
    },
  },
};
</script>

<style scoped>
tr,
td,
th {
  color: black !important;
  background-color: white !important;
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

.modal-body-box {
  height: 85vh;
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
  height: inherit;
  max-height: 80vh;
  overflow-y: scroll;
  overflow-x: hidden;
  padding-bottom: 100px;
}

.customer-box {
  height: 79vh;
  color: var(--text-color) !important;
  border: 2px solid var(--light) !important;
  border-radius: var(--border-radius) !important;
}

.discount-box {
  color: var(--text-color) !important;
  border: 2 px solid var(--light) !important;
  border-radius: var(--border-radius) !important;
}

.dropdown-item {
  cursor: pointer;
}

.voucher-list-solid {
  border-top: 2px solid black;
}

.voucher-list-top {
  border-top: 2px dotted black;
}

thead,
tbody {
  border: none !important;
  color: var(--dark);
}

.alert-warning {
  border-radius: var(--border-radius) !important;
}

.customer-card {
  background-color: var(--light) !important;
  transition: 0.3s;
  cursor: pointer;
}

.customer-card:hover {
  background-color: var(--softPrimary) !important;
}

.activeCustomer {
  background-color: var(--softPrimary) !important;
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
}
</style>
