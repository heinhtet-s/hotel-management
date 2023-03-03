<template>
  <!--  Shop-->
  <admin-sidebar>
    <Loading v-if="loadingActive" />
    <InfoDialog
      v-if="infoModalActive"
      :modal-message="modalMessage"
      v-on:close-modal="closeInfoModal"
    />
    <confirm-dialog
      :modal-message="modalMessage"
      v-if="confirmActive"
      v-on:confirm="confirm"
      v-on:cancel="cancel"
    />

    <div class="row">
      <div class="d-flex align-items-center">
        <button
          @click="$router.back()"
          style="color: var(--text-color)"
          class="btn fs-5"
        >
          <i class="fas fa-chevron-left"> </i>
        </button>
        <span class="fs-3 p-1">{{ $t('message.voucher_details') }}</span>
      </div>
      <!-- <div class="col-md-4">
        <div class="card-outside overflow-scroll">
          <span class="fs-5 p-1">{{ $t('message.customer_info') }}</span>

          <div
            class="d-flex"
            style="
              background-color: var(--side-bar-bg);
              border-radius: var(--border-radius);
            "
          >
            <div
              class="text-start d-flex align-items-center justify-content-center"
            >
              <img
                src="../../assets/flash/1.png"
                class="m-1"
                width="100"
                height="100"
                style="border-radius: var(--border-radius)"
                alt=""
              />
            </div>
            <div class="form-floating mb-3 ms-2 d-flex flex-column">
              <span><i class="fas fa-user"></i> sdfsdfsdfd</span>
              <span><i class="fas fa-phone"></i> sdfsdf</span>
              <span class="text-black-50"
                ><i class="fa-solid fa-location-crosshairs"></i> sdfsdf</span
              >
            </div>
          </div>
          <div class="">
            <div class="d-flex justify-content-between align-items-center">
              <span>{{ $t('message.total_credit') }}</span>
              <div>
                <input
                  type="text"
                  v-model="searchInvoiceValue"
                  class="form-control form-control-sm mt-1"
                  placeholder="search"
                />
              </div>
            </div>
            <div class="d-flex justify-content-between">
              <span class="text-danger">44444 Ks</span>
            </div>
          </div>
          <div class="d-flex align-items-end"></div>
        </div>
      </div> -->
      <!-- invoice -->

      <div class="col-md-8 card-outside" v-if="selectedInvoice !== ''">
        <div class="row">
          <div class="d-flex align-items-center">
            <button
              class="btn me-3"
              style="background-color: var(--btnLight)"
              @click="printThis"
            >
              <i class="fas fa-save"></i> {{ $t('message.save') }}
            </button>
            <button
              class="btn text-white"
              style="background-color: var(--primary)"
              v-print="'#printcontent'"
              data-bs-dismiss="modal"
            >
              <i class="fas fa-print"></i> {{ $t('message.print') }}
            </button>
          </div>
          <div class="col-md-7 p-1 voucher-outer-box">
            <div class="m-1" v-if="selectedInvoice">
              <!----------Voucher 1  -->
              <div class="voucher-box" v-if="voucherStyle === 'listStyle'">
                <div
                  class="bg-white p-2 text-black py-3 px-3"
                  style="font-size: 12px"
                  ref="printcontent"
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
                      :class="
                        showLogo === 'true' ? 'text-start' : 'text-center'
                      "
                    >
                      <span class="fs-5 fw-bolder">{{ shopInfo.name }}</span>
                      <span class="my-1">{{ shopInfo.address }}</span>
                      <span
                        ><i class="fas fa-square-phone-flip"></i>
                        {{ shopInfo.phone }}</span
                      >
                    </div>
                  </div>
                  <div
                    class="text-start fw-bold d-flex flex-column pt-1 voucher-list-solid"
                  >
                    <span class="mb-1"
                      >{{ $t('message.voucher_no') }}
                      {{ this.selectedInvoice.voucherId }}</span
                    >
                    <span class="mb-1"
                      >Customer Name:
                      {{ this.selectedInvoice.customerName }}</span
                    >
                    <span class="mb-1"
                      >Customer Phone:
                      {{ this.selectedInvoice.customerPhone }}</span
                    >
                    <span class="mb-1"
                      >{{ $t('message.date') }}:
                      {{ this.selectedInvoice.dateTime }}</span
                    >
                  </div>
                  <table
                    class="w-100 table-1 border-0 p-0 table border-white table-voucher"
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
                          {{ $t('message.items') }}
                        </th>
                        <th
                          class="bg-white border-0 text-end text-nowrap align-start"
                        >
                          {{ $t('message.qty') }}
                        </th>
                        <th
                          class="bg-white border-0 text-end text-nowrap align-start"
                        >
                          {{ $t('message.price') }}
                        </th>
                        <th
                          class="bg-white border-0 text-end text-nowrap align-start"
                        >
                          {{ $t('message.amount') }}
                        </th>
                      </tr>
                    </thead>
                    <tbody class="border-0 fw-bold p-0">
                      <tr class="border-0 mb-1 px-0 py-1">
                        <td
                          class="border-0 text-start text-wrap align-start"
                          style="width: 40%"
                        >
                          Stayed
                        </td>
                        <td class="border-0 text-end text-nowrap align-start">
                          {{ selectedInvoice.dateList?.length }} days
                        </td>
                        <td class="border-0 text-end text-nowrap align-start">
                          {{
                            parseInt(
                              selectedInvoice.apartmentPrice
                            ).toLocaleString()
                          }}
                          Ks
                        </td>
                        <td class="border-0 text-end text-nowrap align-start">
                          {{
                            parseInt(
                              selectedInvoice.dateList?.length *
                                selectedInvoice.apartmentPrice
                            ).toLocaleString()
                          }}
                          Ks
                        </td>
                      </tr>
                      <tr
                        v-if="selectedInvoice.extraBed"
                        class="border-0 mb-1 px-0 py-1"
                      >
                        <td
                          class="border-0 text-start text-wrap align-start"
                          style="width: 40%"
                        >
                          Extra Bed
                        </td>
                        <td class="border-0 text-end text-nowrap align-start">
                          {{ selectedInvoice.extraBed }}
                        </td>
                        <td class="border-0 text-end text-nowrap align-start">
                          {{
                            parseInt(
                              selectedInvoice.extraBedFee
                            ).toLocaleString()
                          }}
                          Ks
                        </td>
                        <td class="border-0 text-end text-nowrap align-start">
                          {{
                            parseInt(
                              selectedInvoice.extraBed *
                                selectedInvoice.extraBedFee
                            ).toLocaleString()
                          }}
                          Ks
                        </td>
                      </tr>
                      <tr
                        class="border-0 mb-1 py-1"
                        v-for="(name, index) in selectedInvoice.nameList"
                        :key="index"
                      >
                        <td
                          class="border-0 text-start text-wrap align-start"
                          style="width: 40%"
                        >
                          {{ name }}
                        </td>
                        <td class="border-0 text-end text-nowrap align-start">
                          {{ selectedInvoice.countList[index] }}
                          Pcs
                        </td>
                        <td class="border-0 text-end text-nowrap align-start">
                          {{
                            parseInt(
                              selectedInvoice.sellPriceList[index]
                            ).toLocaleString()
                          }}
                          Ks
                        </td>
                        <td class="border-0 text-end text-nowrap align-start">
                          {{ parseInt(costPerItem[index]).toLocaleString() }}
                          Ks
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div class="px-1 flex-column">
                    <div class="d-flex fw-bold py-1 voucher-list-top">
                      <span class="w-75 text-start">{{
                        $t('message.total')
                      }}</span>
                      <span class="w-25 text-end"
                        >{{
                          parseInt(selectedInvoice.totalPrice).toLocaleString()
                        }}
                        Ks</span
                      >
                    </div>
                    <div
                      class="d-flex fw-bold py-1"
                      v-if="shopInfo.tax !== '0'"
                    >
                      <span class="w-75 text-start">{{
                        $t('message.tax')
                      }}</span>
                      <!--                          {{((selectedInvoice.totalPrice*(parseInt(shopInfo.tax)/100)).toFixed(0)).toLocaleString()-->
                      <span class="w-25 text-end"
                        >{{ selectedInvoice.tax.toLocaleString() }} Ks</span
                      >
                    </div>
                    <div
                      class="d-flex fw-bold py-1"
                      v-if="selectedInvoice.discount > 0"
                    >
                      <span class="w-75 text-start">{{
                        $t('message.discount')
                      }}</span>
                      <span class="w-25 text-end"
                        >{{
                          parseInt(selectedInvoice.discount).toLocaleString()
                        }}
                        Ks</span
                      >
                    </div>

                    <div class="d-flex fw-bold py-1 voucher-list-top">
                      <span class="text-start w-75">{{
                        $t('message.net_amount')
                      }}</span>
                      <span class="text-end w-25"
                        >{{
                          parseInt(selectedInvoice.totalPrice).toLocaleString()
                        }}
                        Ks</span
                      >
                    </div>
                    <div class="d-flex fw-bold py-1">
                      <span class="text-start w-75"
                        >{{ this.selectedInvoice.paymentMethod }}
                        {{ $t('message.cash_received') }}</span
                      >
                      <span class="text-end w-25"
                        >{{
                          parseInt(
                            selectedInvoice.cashReceived
                          ).toLocaleString()
                        }}
                        Ks</span
                      >
                    </div>
                    <div
                      class="d-flex fw-bold py-1 voucher-list-top"
                      v-if="selectedInvoice.credit > 0"
                    >
                      <span class="text-start w-75">{{
                        $t('message.credit')
                      }}</span>
                      <span class="text-end w-25"
                        >{{
                          parseInt(selectedInvoice.credit).toLocaleString()
                        }}
                        Ks</span
                      >
                    </div>
                    <div class="d-flex fw-bold py-1 voucher-list-top" v-else>
                      <span class="text-start w-75">{{
                        $t('message.change')
                      }}</span>
                      <span class="text-end w-25"
                        >{{
                          parseInt(selectedInvoice.change).toLocaleString()
                        }}
                        Ks</span
                      >
                    </div>

                    <div class="text-center">
                      <p class="fw-bold">{{ $t('message.thank') }}</p>
                     
                      <p class="mt-1">
                        Power by Light Idea Software Development
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!----------Voucher 2  -->
              <div class="voucher-box" v-else>
                <div
                  class="bg-white text-black p-3"
                  style="font-size: 12px"
                  ref="printcontent"
                  id="printcontent"
                >
                  <div class="text-center">
                    <div
                      class="d-flex align-items-center text-start p-1"
                      style="background-color: var(--light)"
                    >
                      <img
                        :src="shopInfo.profileUrl"
                        class="rounded"
                        width="70"
                        height="70"
                      />
                      <div class="ms-2 d-flex flex-column">
                        <span class="fs-6">{{ shopInfo.name }}</span>
                        <span class="my-1">{{ shopInfo.address }}</span>
                        <span>Ph: {{ shopInfo.phone }}</span>
                      </div>
                    </div>
                    <div class="text-start d-flex justify-content-between pt-1">
                      <span class="mb-1"
                        >Slip No: {{ selectedInvoice.voucherId }}</span
                      >
                      <span class="mb-1"
                        >Date: {{ selectedInvoice.dateTime }}</span
                      >
                    </div>
                    <div class="text-start d-flex">
                      <span class="mb-1"
                        >Customer :{{ selectedInvoice.customerName }},
                      </span>
                      <span class="mb-1 ms-1">{{
                        selectedInvoice.customerPhone
                      }}</span>
                    </div>
                    <table class="table">
                      <thead>
                        <tr>
                          <th class="text-start">Item</th>
                          <th>Qty</th>
                          <th class="text-nowrap">Price</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td class="text-start">Stayed</td>
                          <td class="text-nowrap text-center">
                            {{ selectedInvoice.dateList.length }} days
                          </td>
                          <td class="text-nowrap text-end">
                            {{
                              parseInt(
                                selectedInvoice.apartmentPrice
                              ).toLocaleString()
                            }}
                            Ks
                          </td>
                          <td class="text-nowrap text-end">
                            {{
                              parseInt(
                                selectedInvoice.apartmentPrice *
                                  selectedInvoice.dateList.length
                              ).toLocaleString()
                            }}
                            Ks
                          </td>
                        </tr>
                        <tr v-if="selectedInvoice.extraBed">
                          <td class="text-start">Extra Bed</td>
                          <td class="text-nowrap text-center">
                            {{ selectedInvoice.extraBed }}
                          </td>
                          <td class="text-nowrap text-end">
                            {{
                              parseInt(
                                selectedInvoice.extraBedFee
                              ).toLocaleString()
                            }}
                            Ks
                          </td>
                          <td class="text-nowrap text-end">
                            {{
                              parseInt(
                                selectedInvoice.extraBed *
                                  selectedInvoice.extraBedFee
                              ).toLocaleString()
                            }}
                            Ks
                          </td>
                        </tr>
                        <tr
                          v-for="(name, index) in selectedInvoice.nameList"
                          :key="index"
                        >
                          <td class="text-start">{{ name }}</td>
                          <td class="text-nowrap text-center">
                            {{
                              parseInt(
                                selectedInvoice.countList[index]
                              ).toLocaleString()
                            }}
                            Pcs
                          </td>
                          <td class="text-nowrap text-end">
                            {{
                              parseInt(
                                selectedInvoice.sellPriceList[index]
                              ).toLocaleString()
                            }}
                            Ks
                          </td>
                          <td class="text-nowrap text-end">
                            {{ parseInt(costPerItem[index]).toLocaleString() }}
                            Ks
                          </td>
                        </tr>
                        <tr class="table-bottom">
                          <td colspan="3" class="text-end text-nowrap">
                            Total:
                          </td>
                          <td class="text-end">
                            {{
                              parseInt(
                                selectedInvoice.totalPrice
                              ).toLocaleString()
                            }}
                            Ks
                          </td>
                        </tr>
                        <tr class="table-bottom" v-if="shopInfo.tax !== '0'">
                          <td colspan="3" class="text-end text-nowrap">
                            Tax :
                          </td>
                          <td class="text-end">
                            {{ selectedInvoice.tax.toLocaleString() }} Ks
                          </td>
                        </tr>
                        <tr
                          class="table-bottom"
                          v-if="selectedInvoice.discount > 0"
                        >
                          <td colspan="3" class="text-end text-nowrap">
                            Discount:
                          </td>
                          <td class="text-nowrap text-end">
                            {{
                              parseInt(
                                selectedInvoice.discount
                              ).toLocaleString()
                            }}
                            Ks
                          </td>
                        </tr>
                        <tr class="table-bottom">
                          <td colspan="3" class="text-end text-nowrap">
                            Net Amount:
                          </td>
                          <td class="text-nowrap text-end">
                            {{
                              parseInt(
                                selectedInvoice.totalPrice
                              ).toLocaleString()
                            }}
                            Ks
                          </td>
                        </tr>
                        <tr class="table-bottom">
                          <td colspan="3" class="text-end text-nowrap">
                            {{ selectedInvoice.paymentMethod }} Received:
                          </td>
                          <td class="text-nowrap text-end">
                            {{
                              parseInt(
                                selectedInvoice.cashReceived
                              ).toLocaleString()
                            }}
                            Ks
                          </td>
                        </tr>
                        <tr class="table-bottom">
                          <td colspan="3" class="text-end text-nowrap">
                            Change:
                          </td>
                          <td class="text-nowrap text-end">
                            {{
                              parseInt(selectedInvoice.change).toLocaleString()
                            }}
                            Ks
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <p class="fw-bold">Thank You!</p>
                    <p class="mt-1">Power by Light Idea Software Development</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-5">
            <div class="" style="background-color: var(--light)">
              <div class="history-container m-0 mt-1">
                <span class="my-1 d-flex align-items-center"
                  ><i class="fa-solid fa-clock-rotate-left"></i>
                  {{ $t('message.payment_history') }}</span
                >
                <div
                  class="card mb-1"
                  style="
                    background-color: var(--side-bar-bg) !important;
                    font-size: 12px;
                  "
                >
                  <div class="p-1">
                    <span class="text-black-50">{{
                      selectedInvoice.checkoutTime
                    }}</span>
                    <div class="d-flex justify-content-between">
                      <div class="d-flex flex-column">
                        <span class="text-success"
                          >{{ selectedInvoice.paymentMethod }}
                          {{ $t('message.cash_received') }}
                        </span>
                        <span>{{ selectedInvoice.cashReceived }} Ks</span>
                      </div>
                      <div
                        v-if="selectedInvoice.change !== '0'"
                        class="d-flex flex-column text-end"
                      >
                        <span class="text-success">Change</span>
                        <span class="text-success"
                          >{{ selectedInvoice.change }} Ks</span
                        >
                      </div>
                    </div>
                    <div>
                      <span>{{ selectedInvoice.note }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </admin-sidebar>
</template>

<script>
import db from '@/config/FirebaseInit';
import Loading from '@/components/Loading';
import InfoDialog from '@/components/InfoDialog';
import ConfirmDialog from '@/components/ConfirmDialog';
import AdminSidebar from '@/components/AdminSidebar';
import html2canvas from 'html2canvas';
export default {
  components: { ConfirmDialog, InfoDialog, Loading, AdminSidebar },
  data() {
    return {
      dismissModal: 'true',
      file: '',
      showTableVoucher: 'true',
      confirmStatus: '',
      toGetActive: true,

      searchInvoiceValue: '',
      transactionDate: '',
      transactionAmount: '',
      transactionNote: '',
      voucherStyle: '',

      costPerItem: [],
      invoiceHistories: [],
      selectedInvoice: '',

      loadingActive: false,
      infoModalActive: false,
      confirmActive: false,
      modalMessage: '',

      showPaymentToggle: false,
      selectedPaymentType: '',
      showAllInvoiceActive: false,
    };
  },
  computed: {
    showLogo() {
      return localStorage.getItem('showLogoImage');
    },
    shopInfo() {
      return this.$store.getters.getShopInfo;
    },
    owner() {
      return this.$store.getters.getShopOwner;
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
    paymentMethods() {
      return this.$store.getters.getPaymentMethods;
    },
  },
  async created() {
    await this.getInvoiceFroRouteId();
  },
  async mounted() {
    this.$store.dispatch('getDateTime');
    this.$store.dispatch('getDay');
    this.$store.dispatch('getMonth');
    this.$store.dispatch('getYear');
    this.$store.dispatch('getPaymentMethods', this.owner);
    this.$store.dispatch('getShopInfo', this.owner);
    if (localStorage.getItem('voucherStyle')) {
      this.voucherStyle = localStorage.getItem('voucherStyle');
    }
  },
  methods: {
    async getInvoiceFroRouteId() {
      await db
        .collection(this.owner.city)
        .doc(this.owner.shopId)
        .collection('apartmentVouchers')
        .where('voucherId', '==', this.$route.query.voucher_id)
        .onSnapshot((snapshot) => {
          const invoices = [];
          snapshot.forEach((doc) => invoices.push(doc.data()));
          console.log('in >>', invoices[0]);
          this.selectedInvoice = invoices[0];
          this.totalPrice = 0;
          for (let i = 0; i < this.selectedInvoice.countList.length; i++) {
            this.costPerItem.push(
              parseInt(this.selectedInvoice.sellPriceList[i]) *
                parseInt(this.selectedInvoice.countList[i])
            );
          }
          this.costPerItem.forEach((price) => {
            this.totalPrice += parseInt(price);
          });
        });
    },
    showAllInvoiceChange(e) {
      if (e.target.checked) {
        this.showAllInvoiceActive = true;
      } else {
        this.showAllInvoiceActive = false;
      }
    },
    resetPayment() {
      this.selectedPaymentType = '';
      this.transactionAmount = '';
    },
    choosePaymentType(payment) {
      this.selectedPaymentType = payment;
      this.showPaymentToggle = !this.showPaymentToggle;
    },
    printVoucher() {
      // Get HTML to print from element
      const prtHtml = document.getElementById('printcontent').innerHTML;

      // Get all stylesheets HTML
      let stylesHtml = '';
      for (const node of [
        ...document.querySelectorAll('link[rel="stylesheet"], style'),
      ]) {
        stylesHtml += node.outerHTML;
      }

      // Open the print window
      const WinPrint = window.open(
        '',
        '',
        'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0'
      );

      WinPrint.document.write(`<!DOCTYPE html>
         <html>
           <head>
             ${stylesHtml}
           </head>
           <body>
             ${prtHtml}
           </body>
         </html>`);

      WinPrint.document.close();
      WinPrint.focus();
      WinPrint.print();
      WinPrint.close();
    },
    async printThis() {
      console.log('printing..');
      const el = this.$refs.printcontent;

      const options = {
        type: 'dataURL',
      };
      const printCanvas = await html2canvas(el, options);

      const link = document.createElement('a');
      link.setAttribute('download', `${this.selectedInvoice.voucherId}.png`);
      link.setAttribute(
        'href',
        printCanvas
          .toDataURL('image/png')
          .replace('image/png', 'image/octet-stream')
      );
      link.click();

      console.log('done');
    },

    closeInfoModal() {
      this.infoModalActive = !this.infoModalActive;
    },
    cancel() {
      this.confirmActive = !this.confirmActive;
    },

    formatDate(payload) {
      const date = new Date(payload);
      let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(
        date
      );
      let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(
        date
      );
      let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
      return day + '-' + month + '-' + year;
    },

    onChangePhotoInput(e) {
      this.file = e.target.files[0];
    },
    onChangeUpdatePhotoInput(e) {
      this.editFile = e.target.files[0];
    },
  },
};
</script>

<style scoped>
.btn-group {
  width: 100%;
}
thead,
tbody {
  border: none !important;
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
.activeInvoice {
  background-color: var(--btnLight) !important;
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
tr {
  color: var(--text-color);
}

.card-container {
  height: 65vh;
  overflow-y: scroll;
  overflow-x: hidden;
}

.history-container {
  border-radius: var(--border-radius);
  background-color: var(--background-color);
  height: 36vh;
  padding-bottom: 50px;
  overflow-y: scroll;
  overflow-x: hidden;
}
.btn-active {
  border-radius: 0px !important;
  border-bottom: 2px solid var(--primary) !important;
}
.voucher-list {
  border-top: 2px dashed black;
}
.voucher-box {
  height: 75vh;
  overflow-y: scroll;
}
.voucher-outer-box {
  border-radius: var(--border-radius);
  height: 82vh;
}
.card-outside {
  border-radius: var(--border-radius);
  padding: 10px;
  height: 85vh;
  background-color: var(--light) !important;
}
@media only screen and (max-width: 1030px) {
  .content-box {
    margin-top: 90px;
  }
}
</style>
