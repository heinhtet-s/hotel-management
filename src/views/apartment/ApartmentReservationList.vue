<template>
  <admin-sidebar>
    <ConfirmDialog
      :modal-message="checkInMsg"
      v-if="confirmCheckIn"
      v-on:confirm="handleCheckIn"
      v-on:cancel="confirmCheckIn = false"
    />
    <ConfirmDialog
      modal-message="Click Yes to cancel this reservation"
      v-if="confirmCancel"
      v-on:confirm="handleDelete"
      v-on:cancel="confirmCancel = false"
    />
    <Loading v-if="loadingActive" />
    <div class="">
      <div
        class="pb-1"
        style="
        position: sticky;
          z-index: 1000;
          top: 0px;
          background-color: var(--background-color);
        "
      >
        <div
          class="d-lg-flex d-md-flex align-items-center rounded justify-content-between mb-2"
        >
          <div class="d-flex align-items-center">
            <router-link
              :to="{ name: 'Apartment', params: { category: 'All' } }"
              style="color: var(--primary)"
              class="btn border-0 float-start"
            >
              <i class="fas fa-chevron-left"> </i>
              {{ $t('message.reservation_list') }}
            </router-link>
          </div>
        </div>
        <div class="">
          <div
            class="d-flex flex-lg-row flex-column justify-content-lg-between px-2"
          >
            <div class="d-flex p-1"  style="background-color: var(--light);border-radius: var(--border-radius);">
              <select
                class="form-select border-0 form-control mx-1"
                v-model="selectedApartment"
                aria-label="Default select example"
                style="width: 7rem"
              >
                <!-- :disabled="cashier.accountLevel !== 'admin'" -->
                <option
                  :value="apartment.id"
                  v-for="apartment in apartments"
                  :key="apartment.id"
                >
                  {{ apartment.name }}
                </option>
              </select>
              <input
                @change="onMonthChange($event)"
                type="month"
                style="width: 10rem"
                class="form-month border-0 form-control mx-1"
              />
              <input
                v-model="phoneSearch"
                type="number"
                placeholder="Search By Customer's Phone"
                style="width: 15rem"
                class="form-text border-0 form-control mx-1"
              />
            </div>
              <div class="d-flex align-items-center">
                <div class="p-1"  style="background-color: var(--light);border-radius: var(--border-radius);" >
                <form
                  @submit="dateFilter($event)"
                  class="d-flex align-items-center justify-content-end"
                >
                  <input
                    type="number"
                    name="startDate"
                    :placeholder="$t('message.start_date')+' (eg.1)'"
                    class="form-text border-0 form-control mx-1"
                    required
                    max="31"
                  />
                  <input
                    required
                    type="number"
                    name="endDate"
                    :placeholder="$t('message.end_date')+'(eg.2)'"
                    class="form-control form-text border-0 form-control mx-1"
                    max="31"
                  />
                  <button class="btn btn-warning border-0 ms-2"><i class="fas fa-filter"></i></button>
                </form>
                
              </div>

              <vue-excel-xlsx
                  :data="filterExportData"
                  :columns="columns"
                  :file-name="fileName"
                  :file-type="'xlsx'"
                  :sheet-name="fileName"
                  class="btn btn-success ms-2 d-flex align-items-center border-success border-2"
                >
                  <i class="fas fa-file-excel"></i><span class="ms-1"></span>
                </vue-excel-xlsx>
            </div>
          </div>
        </div>
      </div>
      <div
        class="mt-3 mb-2 border-bottom border-1"
        style="height: 70vh; overflow-y: scroll"
      >
        <table class="table table-striped">
          <thead>
            <tr class="border-bottom-0">
              <th class="text-nowrap text-start">
                {{ $t('message.name') }}
              </th>
              <th class="text-nowrap text-center">
                {{ $t('message.phone') }}
              </th>
              <th class="text-nowrap text-center">
                {{ $t('message.reserved_date') }}
              </th>
              <!--              <th class="text-nowrap text-center">{{ $t('message.sold_items') }}</th>-->
              <th class="text-nowrap text-end">
                {{ $t('message.adult_count') }}
              </th>
              <th class="text-nowrap text-end">
                {{ $t('message.infant_count') }}
              </th>
              <th class="text-nowrap text-end">
                {{ $t('message.paid_amount') }}
              </th>
              <th class="text-nowrap text-center">{{ $t('message.date') }}</th>
              <th class="text-nowrap text-center">
                {{ $t('message.control') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(reservation, index) in filteredReservations"
              :key="index"
              class="align-middle"
            >
              <td class="text-start">
                {{ reservation.customerName }}
              </td>
              <td class="text-nowrap text-center">
                {{ reservation.customerPhone }}
              </td>
              <td class="text-nowrap text-center" >
                <div style="max-height: 80px;overflow-y: scroll;">
                  <p v-for="(date, index) in reservation.dateList" :key="index">
                  {{ date }}
                </p>
                </div>
               
              </td>

              <td class="text-nowrap text-end">
                {{ reservation.numberOfAdults }}
              </td>
              <td class="text-nowrap text-center">
                {{ reservation.numberOfKids }}
              </td>
              <td class="text-nowrap text-end">
                {{ parseInt(reservation.paidAmount).toLocaleString() }} Ks
              </td>
              <td class="text-nowrap text-center">
                {{ reservation.dateTime }}
              </td>
              <td class="text-nowrap text-end">
                <button
                  v-if="reservation.id !== currentStayingID"
                  @click="clickCancel(reservation.id)"
                  style="margin-right: 1rem;border-radius: var(--border-radius);"
                  class="btn btn-danger border-0"
                >
                  <i class="fas fa-cancel"></i> {{ $t('message.cancel') }}
                </button>
                <button
                  v-if="reservation.status==='book'"
                  @click="clickCheckInBtn(reservation)"
                  class="btn btn-success border-0"
                  style="border-radius: var(--border-radius);"
                >
                  {{ $t('message.check_in') }}
                </button>
                <router-link
                  class="btn btn-primary border-0" style="border-radius: var(--border-radius);"
                  v-if="reservation.status==='checkIn'"
                  :to="{
                    name: 'CurrentStaying',
                    params: { roomID: selectedApartment },
                  }"
                  ><i class="fas fa-info-circle"></i> {{ $t('message.details') }}</router-link
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </admin-sidebar>
</template>

<script>
import db from '@/config/FirebaseInit';
import AdminSidebar from '@/components/AdminSidebar';
import Loading from '@/components/Loading';
import ConfirmDialog from '../../components/ConfirmDialog.vue';
export default {
  components: { AdminSidebar, Loading, ConfirmDialog },
  data() {
    return {
      reservationToTakeAction: null,
      checkInMsg: '',
      confirmCheckIn: false,
      confirmCancel: false,
      selectedApartment: null,
      selectedMonth: null,
      phoneSearch: '',
      loadingActive: false,
      limit: 50,
      reservations: [],
      filteredReservations: [],
      reservation: null,
      isCurrentStaying: false,
      currentStayingID: null,
      columns: [
        {
          label: 'Voucher Id',
          field: 'voucher-id',
        },
        {
          label: 'Sell Type',
          field: 'sellType',
        },

        {
          label: 'Item List',
          field: 'orderItems',
        },
        {
          label: 'Count List',
          field: 'orderCounts',
        },
        {
          label: 'Price List',
          field: 'orderPrices',
        },
        {
          label: 'Total Price',
          field: 'totalPrice',
        },

        {
          label: 'Date',
          field: 'date',
        },
        {
          label: 'Note',
          field: 'note',
        },
        {
          label: 'Customer Name',
          field: 'customer-name',
        },
        {
          label: 'Customer Phone',
          field: 'customer-phone',
        },
      ],
    };
  },

  computed: {
    apartments() {
      return this.$store.getters.getAllApartments;
    },
    owner() {
      return this.$store.getters.getShopOwner;
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
    dateTime() {
      return this.$store.getters.getDateTime;
    },

    filterreservations() {
      let filterInv = [];
      if (this.search !== '') {
        filterInv = this.reservations.filter((inv) =>
          inv.vouncherId.toLowerCase().includes(this.search.toLowerCase())
        );
        console.log('filtering', filterInv);
        return filterInv.slice(
          this.offsetCount,
          this.offsetCount + this.perPage
        );
      } else {
        return this.reservations.slice(
          this.offsetCount,
          this.offsetCount + this.perPage
        );
      }
    },
    dates() {
      return this.days.map((day) => day.date);
    },
    attributes() {
      return this.dates.map((date) => ({
        highlight: true,
        dates: date,
      }));
    },

    filterExportData() {
      if (this.selectedSellType !== 'All') {
        let filterInv = [];
        for (let i = 0; i < this.reservations.length; i++) {
          if (this.reservations[i].sellType === this.selectedSellType) {
            filterInv.push(this.reservations[i]);
          }
        }
        return filterInv;
        /*return this.filterData.filter(sell=>{
          return sell.sellType === this.selectedSellType
        })*/
      } else {
        return this.filterData;
      }
    },
  },

  
  async mounted() {
    this.fileName = this.currentDay + '-reservations';
    this.selectedDate = this.currentDay;
    this.selectedApartment = this.apartments[0].id;
    this.selectedMonth = this.currentMonth;
  },
  watch: {
    selectedApartment(apartment_id) {
      this.isCurrentStaying = false;
      this.getReservations(apartment_id, this.selectedMonth);
    },
    phoneSearch(value) {
      this.filterByPhone(value);
    },
  },

  methods: {
    getMonthName(month) {
      const date = new Date();
      date.setMonth(+month?.split('-')[1] - 1);

      return (
        date.toLocaleString([], { month: 'short' }) +
        '-' +
        +month?.split('-')[0]
      );
    },
    clickCheckInBtn(reservation) {
      this.reservationToTakeAction = reservation.id;
      this.checkInMsg =
        'Approve ' +
        reservation.customerName +
        "'s check in to " +
        reservation.apartmentName;
      this.reservation = reservation;
      this.confirmCheckIn = true;
    },
    clickCancel(id) {
      this.reservationToTakeAction = id;
      this.confirmCancel = true;
    },
    onMonthChange(event) {
      const month = event.target.value;
      const monthWithYear = this.getMonthName(month);
      this.selectedMonth = monthWithYear;
      this.getReservations(this.selectedApartment, monthWithYear);
    },

    async getReservations(apartment, month) {
      await db
        .collection(this.owner.city)
        .doc(this.owner.shopId)
        .collection('apartments')
        .doc(apartment)
        .collection('reservations')
        .where('month', '==', month)
        .orderBy("time","desc")
        .onSnapshot((snapshot) => {
          const result = [];
          this.reservations=[];
          this.filteredReservations = [];
          snapshot.forEach(
            (doc) => {
              const data = doc.data();
              if (data.status === 'checkIn') {
                this.currentStayingID = data.id;
                this.isCurrentStaying = true;
              }
              result.push(data);
            },
            (error) => {
              console.log('apartment', error.message);
            }
          );
          this.reservations = result;
          this.filteredReservations = result;
        });
    },

    filterByPhone(value) {
      const filtered = this.reservations?.filter((r) =>
        String(r.customerPhone)?.includes(value)
      );
      this.filteredReservations = filtered;
    },
    dateFilter(event) {
      event.preventDefault();
      const startDate = +event.target.startDate.value;
      const endDate = +event.target.endDate.value;
      const filtered = this.reservations.filter((reser) => {
        const checkIsIn = reser.dateList?.filter((date) => {
          const day = +date?.split('-')[0];
          return day >= startDate && day <= endDate;
        });
        return checkIsIn.length > 0;
      });
      this.filteredReservations = filtered;
    },

    async handleDelete() {
      await db
        .collection(this.owner.city)
        .doc(this.owner.shopId)
        .collection('apartments')
        .doc(this.selectedApartment)
        .collection('reservations')
        .doc(this.reservationToTakeAction)
        .delete()
        .then(() => {
          this.getReservations(this.selectedApartment);
          this.confirmCancel = false;
        });
    },
    async handleCheckIn() {
      await db
        .collection(this.owner.city)
        .doc(this.owner.shopId)
        .collection('apartments')
        .doc(this.selectedApartment)
        .collection('reservations')
        .doc(this.reservationToTakeAction)
        .update({ status: 'checkIn', checkInTime: this.dateTime })
        .then(() => {
          this.reservation = null;
          this.getReservations(this.selectedApartment);
          this.confirmCheckIn = false;
          // this.$router.push('/shop-owner/apartment/All');
        })
        .catch((err) => console.log('err >>', err));
    },
  },
};
</script>

<style scoped>
/*.date-box{*/
/*  right: 100px;*/
/*  top:150px;*/
/*}*/

tr,
th,
td {
  border: 1px solid var(--light) !important;
  color: var(--text-color) !important;
  cursor: pointer;
}
ol,
ul {
  list-style-type: none;
  padding: 0;
  color: var(--text-color);
}
.main-list li {
  color: var(--text-color) !important;
  text-align: start;
  font-size: 12px;
  height: 20px;
  background-color: var(--light);
  border-radius: var(--border-radius);
  color: var(--dark);
  margin: 2px;
  display: flex;
  padding: 2px;
}

.voucher-list {
  border-top: 2px dashed black;
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
  /* background-color: var(--primary) !important ; */
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

.item-header fixed-top {
  border-bottom: 2px solid var(--light);
}
.item-header fixed-top span {
  width: 20%;
  color: var(--primary);
  font-weight: bolder;
  height: 40px;
  border-radius: var(--border-radius);
  padding-left: 10px;
  margin: 10px 5px;
}
.item-row {
  border-bottom: 2px solid var(--light);
}
.item-row span {
  width: 20%;
  height: 40px;
  border-right: 2px solid var(--light);
  padding-left: 10px;
  margin: 10px 5px;
}

.user {
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 2px solid var(--light);
}
.user span {
  border-right: 2px solid var(--light);
  border-right: 2px solid var(--light);
  padding-left: 10px;
}
</style>