<template>
  <AdminSidebar>
    <div class="row">
      <div class="col-12">
        <button
          class="btn"
          style="color: var(--primary)"
          @click="$router.back()"
        >
          <i class="fas fa-chevron-left"></i>
          <span class="fs-5 ms-2 mt-1" style="color: var(--text-color)">{{
            $t("message.home_page")
          }}</span>
        </button>
      </div>

      <div
        class="col-12 col-lg-3 col-md-4"
        v-if="cashierAcc.counter==='Bar' || cashierAcc.counter=='Restaurant' || cashierAcc.counter==='Coffee Counter'"
      >
        <router-link
          :to="{ name: 'SellProductRestaurant' }"
          class="text-decoration-none m-4"
        >
          <div class="card">
            <div
              class="card-body mx-lg-auto text-center d-flex flex-lg-column justify-content-lg-center align-items-center"
            >
              <div class="icon-badge p-2">
                <i class="fas icon fa-cash-register fa-2x"></i>
              </div>
              <h4 class="text-center mt-3 ms-2 ms-lg-0">
                {{ $t("message.sell_product") }}
              </h4>
            </div>
          </div>
        </router-link>
      </div>

      <div class="col-12 col-lg-3 col-md-4">
        <router-link
          :to="{ name: 'ShopDashboard' }"
          class="text-decoration-none m-4"
        >
          <div class="card">
            <div
              class="card-body mx-lg-auto text-center d-flex flex-lg-column justify-content-lg-center align-items-center"
            >
              <div class="icon-badge p-2">
                <i class="fas icon fa-boxes-stacked fa-2x"></i>
              </div>
              <h4 class="text-center mt-3 ms-2 ms-lg-0">
                {{ $t("message.inventory") }}
              </h4>
            </div>
          </div>
        </router-link>
      </div>
      <div class="col-12 col-lg-3 col-md-4">
        <router-link
          :to="{ name: 'FinancialDashboard' }"
          class="text-decoration-none m-4"
        >
          <div class="card">
            <div
              class="card-body mx-lg-auto text-center d-flex flex-lg-column justify-content-lg-center align-items-center"
            >
              <div class="icon-badge p-2">
                <i class="fas icon fa-coins fa-2x"></i>
              </div>
              <h4 class="text-center mt-3 ms-2 ms-lg-0">
                {{ $t("message.financial_report") }}
              </h4>
            </div>
          </div>
        </router-link>
      </div>
      <div class="col-12 col-lg-3 col-md-4">
        <router-link
          :to="{ name: 'Customer' }"
          class="text-decoration-none m-4"
        >
          <div class="card">
            <div
              class="card-body mx-lg-auto text-center d-flex flex-lg-column justify-content-lg-center align-items-center"
            >
              <div class="icon-badge p-2">
                <i class="fas fa-users fa-2x"></i>
              </div>
              <h4 class="text-center mt-3 ms-2 ms-lg-0">
                {{ $t("message.customers") }}
              </h4>
            </div>
          </div>
        </router-link>
      </div>
      <div class="col-12 col-lg-3 col-md-4" v-if="cashierAcc.counter === 'Admin' || cashierAcc.counter === 'HR'">
        <router-link
            :to="{ name: 'StaffList' }"
            class="text-decoration-none m-4"
        >
          <div class="card">
            <div
                class="card-body mx-lg-auto text-center d-flex flex-lg-column justify-content-lg-center align-items-center"
            >
              <div class="icon-badge p-2">
                <i class="fas fa-users fa-2x"></i>
              </div>
              <h4 class="text-center mt-3 ms-2 ms-lg-0">
                {{ $t("message.staffs_management") }}
              </h4>
            </div>
          </div>
        </router-link>
      </div>
      <div class="col-12 col-lg-3 col-md-4" v-if="cashierAcc.counter==='Restaurant' || cashierAcc.counter==='Bar' ">
        <router-link
          :to="{
            name: 'reservationManagement',
            params: { type: cashierAcc.counter },
          }"
          class="text-decoration-none m-4"
        >
          <div class="card">
            <div
              class="card-body mx-lg-auto text-center d-flex flex-lg-column justify-content-lg-center align-items-center"
            >
              <div class="icon-badge p-2">
                <i class="fa-solid fa-book fa-2x"></i>
              </div>
              <h4 class="text-center mt-3 ms-2 ms-lg-0">
                {{$t('message.reservation')}}
              </h4>
            </div>
          </div>
        </router-link>
      </div>
      <div class="col-12 col-lg-3 col-md-4">
        <router-link
          :to="{ name: 'PaymentMethods' }"
          class="text-decoration-none m-4"
        >
          <div class="card">
            <div
              class="card-body mx-lg-auto text-center d-flex flex-lg-column justify-content-lg-center align-items-center"
            >
              <div class="icon-badge p-2">
                <i class="fas fa-money-check-dollar fa-2x"></i>
              </div>
              <h4 class="text-center mt-3 ms-2 ms-lg-0">
                {{ $t("message.payment_management") }}
              </h4>
            </div>
          </div>
        </router-link>
      </div>
      <div
        class="col-12 col-lg-3 col-md-4"
        v-if="cashierAcc.accountLevel === 'admin'"
      >
        <router-link :to="{ name: 'Cashier' }" class="text-decoration-none m-4">
          <div class="card">
            <div
              class="card-body mx-lg-auto text-center d-flex flex-lg-column justify-content-lg-center align-items-center"
            >
              <div class="icon-badge p-2">
                <i class="fas fa-computer fa-2x"></i>
              </div>
              <h4 class="text-center mt-3 ms-2 ms-lg-0">
                {{ $t("message.cashier_management") }}
              </h4>
            </div>
          </div>
        </router-link>
      </div>
      <div
        class="col-12 col-lg-3 col-md-4"
        v-if="
          shopInfo.packageStatus === 'ultra' || shopInfo.packageStatus === 'pro'
        "
      >
        <router-link
          :to="{ name: 'WarehouseManagement' }"
          class="text-decoration-none m-4"
        >
          <div class="card">
            <div
              class="card-body mx-lg-auto text-center d-flex flex-lg-column justify-content-lg-center align-items-center"
            >
              <div class="icon-badge p-2">
                <i class="fas fa-warehouse fa-2x"></i>
              </div>
              <h4 class="text-center mt-3 ms-2 ms-lg-0">
                {{ $t("message.warehouse") }}
              </h4>
            </div>
          </div>
        </router-link>
      </div>
      <div
        class="col-12 col-lg-3 col-md-4"
        v-if="
          shopInfo.packageStatus === 'ultra' || shopInfo.packageStatus === 'pro'
        "
      >
        <router-link
          :to="{ name: 'Branches' }"
          class="text-decoration-none m-4"
        >
          <div class="card">
            <div
              class="card-body mx-lg-auto text-center d-flex flex-lg-column justify-content-lg-center align-items-center"
            >
              <div class="icon-badge p-2">
                <i class="fas fa-shop fa-2x"></i>
              </div>
              <h4 class="text-center mt-3 ms-2 ms-lg-0">
                {{ $t("message.branches") }}
              </h4>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </AdminSidebar>
</template>

<script>
import AdminSidebar from "@/components/AdminSidebar";
export default {
  components: { AdminSidebar },
  data() {
    return {
      lucky: 0,
    };
  },
  computed: {
    shopInfo() {
      return this.$store.getters.getShopInfo;
    },
    owner() {
      return this.$store.getters.getShopOwner;
    },
    cashier() {
      return this.$store.getters.getCashierAcc;
    },
    cashierAcc() {
      return this.$store.getters.getCashierAcc;
    },
  },
};
</script>

<style scoped>
.card {
  box-shadow: 0 0 50px -20px rgba(204, 204, 204, 0.8);
  padding: 5px;
}
.card-body {
  padding: 5px;
  margin: 0 !important;
  width: 100%;
}
.card-body:hover {
  transform: scale(1.01);
  background-color: var(--softPrimary) !important;
}
h4 {
  font-size: 18px;
}
.icon-badge {
  margin: 20px 0;
  width: 70px;
  height: 70px;
  border-radius: var(--border-radius);
  background-color: var(--white);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
