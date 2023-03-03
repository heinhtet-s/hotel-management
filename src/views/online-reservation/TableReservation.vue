<template>
  <div class="container">
    <Loading v-show="loadingActive" />
    <InfoDialog
      v-if="modalActive"
      :modal-message="modalMessage"
      v-on:close-modal="closeInfoModal"
    />
    <div class="row mt-5 pt-2 justify-content-center">
      <div class="col-4 col-md-6">
        <div class="cardContainer">
          <h1 class="cardTitle">
            {{ this.$route.params.name === "bar" ? "Bar" : "Restaurant" }}
            Reservation Form
          </h1>
          <form class="row">
            <div class="col-12">
              <div class="form-floating mb-3">
                <input
                  type="text"
                  id="name"
                  v-model="form.customerName"
                  class="form-control"
                  required
                  placeholder="Enter your name"
                />
                <label for="name">Name</label>
              </div>
            </div>
            <div class="col-12">
              <div class="form-floating mb-3">
                <input
                  type="number"
                  id="phone"
                  v-model="form.customerPhone"
                  class="form-control"
                  required
                  placeholder="Enter your phone"
                />
                <label for="phone">Phone</label>
              </div>
            </div>
            <div class="col-12">
              <div class="form-floating mb-3">
                <input
                  type="number"
                  id="people"
                  v-model="form.peopleCount"
                  class="form-control"
                  required
                  placeholder="Enter Ms Code"
                />
                <label for="people">People Count</label>
              </div>
            </div>
            <div class="col-12">
              <div class="form-floating mb-3">
                <input
                  type="number"
                  id="table"
                  v-model="form.tableCount"
                  class="form-control"
                  required
                  placeholder="Enter Ms Code"
                />
                <label for="table">Table Count</label>
              </div>
            </div>
            <div class="col-12">
              <div class="form-floating mb-3">
                <input
                  type="date"
                  id="date"
                  v-model="form.startDate"
                  class="form-control"
                  required
                />
                <label for="date">Date</label>
              </div>
            </div>

            <div class="col-12">
              <div class="form-floating mb-3">
                <input
                  type="time"
                  id="time"
                  v-model="form.startTime"
                  class="form-control"
                  required
                />
                <label for="date">Time</label>
              </div>
            </div>
            <button
              style="background-color: var(--primary)"
              class="mt-3 btn text-white mx-auto"
              @click.prevent="tableFormSubmit"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Loading from "@/components/Loading";
import InfoDialog from "@/components/InfoDialog";
import db, { timestamp } from "@/config/FirebaseInit";
export default {
  name: "TableReservation",
  components: { InfoDialog, Loading },
  data() {
    return {
      form: {
        customerName: "",
        customerPhone: "",
        startTime: "",
        startDate: "",
        tableCount: "",
        peopleCount: "",
      },
      loadingActive: false,
      modalActive: false,
      modalMessage: "",
      error: null,
      errorMsg: "",
      type: "",
    };
  },
  computed: {
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
  methods: {
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
    async tableFormSubmit() {
      this.loadingActive = true;
      this.form.time = timestamp;
      console.log(this.form.startDate);
      this.form.startDate = this.formatDate(this.form.startDate);
      console.log(data);
      const ReservationRef = await db
        .collection("Taungyi")
        .doc("360degreebardgb2022-12-24")
        .collection("tableReservation")
        .doc();
      const data = {
        ...this.form,
        dateTime: this.dateTime,
        type: this.$route.params.name,
        day: this.day,
        month: this.month,
        year: this.year,
        tableIdList: [],
        status: "pending",
        id: ReservationRef.id,
      };
      ReservationRef.set(data)
        .then(() => {
          console.log("success");
          this.modalActive = true;
          this.modalMessage = "Reservation Success";
          this.form = {
            customerName: "",
            customerPhone: "",
            startTime: "",
            startDate: "",
            tableCount: "",
            peopleCount: "",
          };
          this.loadingActive = false;
          this.modalMessage = "Successfully Added ";
          this.modalActive = true;
        })
        .catch((error) => {
          this.loadingActive = false;
          this.modalActive = true;
          this.modalMessage = "Invalid Data";
          this.error = error;
          this.errorMsg = error.message;
        });
    },
    closeInfoModal() {
      this.modalActive = !this.modalActive;
    },
    closeModal() {
      this.modalActive = !this.modalActive;
    },
  },
};
</script>
<style scoped>
.cardContainer {
  border-radius: 10px;
  border: 1px solid #ced4da;
  padding: 20px;
}
.cardTitle {
  text-align: center;
  font-size: 25px;
  font-weight: 600;
  margin-bottom: 20px;
}
</style>
