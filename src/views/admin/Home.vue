<template>
  <AdminNavigation>
    <div class="container pt-5">
      <div class="row mt-4">
        <div class="col-12 col-lg-6 mx-auto">
          <router-link
              :to="{ name: 'ShopManagement' }"
              class="text-decoration-none"
          >
            <div class="card">
              <div class="card-body d-flex align-items-center">
                <div
                    class="p-3 d-inline"
                    style="
                    background-color: var(--softPrimary);
                    border-radius: var(--border-radius);
                  "
                >
                  <i class="fas fa-shop fa-2x"></i>
                </div>
                <h4 class="fw-bold ms-2">Shop Management</h4>
              </div>
            </div>
          </router-link>
        </div>
        <div class="col-12 col-lg-6 mx-auto">
          <router-link
              :to="{ name: 'UserControl' }"
              class="text-decoration-none"
          >
            <div class="card">
              <div class="card-body d-flex align-items-center">
                <div
                    class="p-3 d-inline"
                    style="
                    background-color: var(--softPrimary);
                    border-radius: var(--border-radius);
                  "
                >
                  <i class="fas fa-user-gear fa-2x"></i>
                </div>
                <h4 class="fw-bold ms-2">User Management</h4>
              </div>
            </div>
          </router-link>
        </div>
        <div class="col-12 col-lg-6 mx-auto">
          <router-link
              :to="{ name: 'CreateDeliveryService' }"
              class="text-decoration-none"
          >
            <div class="card">
              <div class="card-body d-flex align-items-center">
                <div
                    class="p-3 d-inline"
                    style="
                    background-color: var(--softPrimary);
                    border-radius: var(--border-radius);
                  "
                >
                  <i class="fas fa-truck fa-2x"></i>
                </div>
                <h4 class="fw-bold ms-2">Delivery Management</h4>
              </div>
            </div>
          </router-link>
        </div>
        <div class="col-12 col-lg-6 mx-auto">
          <router-link
              :to="{ name: 'WarehouseTransfer' }"
              class="text-decoration-none"
          >
            <div class="card">
              <div class="card-body d-flex align-items-center">
                <div
                    class="p-3 d-inline"
                    style="
                    background-color: var(--softPrimary);
                    border-radius: var(--border-radius);
                  "
                >
                  <i class="fas fa-truck fa-2x"></i>
                </div>
                <h4 class="fw-bold ms-2">Warehouse Management</h4>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>

  </AdminNavigation>

</template>

<script>
import { inject } from "vue";

import AdminNavigation from "@/components/AdminNavigation";
export default {
  components: { AdminNavigation },
  inject: ["messaging"],
  mounted() {
    console.log("Firebase cloud messaging object", this.$messaging);
  },
  //composition api
  setup() {
    const messaging = inject("messaging");

    console.log("Firebase cloud messaging object", messaging);
    const token = messaging.getToken({
      vapidKey:
        "BJMMGbfQ4hOe2acXMe11F99lGUArrGheO2nXLAFzs1D3Oh2MCuJCkWPiawTRR4h_roDqBaiqJ6NLVo5o2gu5mXo",
    });
    console.log("FCM token", token);
  },
};
</script>

<style scoped>
.card,
.card-body {
  background-color: var(--light) !important;
  transition: 0.4s;
}
.card:hover,
.card-body:hover {
  background-color: var(--side-bar-bg) !important;
}
</style>
