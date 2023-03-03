<template>
  <AdminSidebar>
    <Loading v-if="loadingActive" />
    <div class="">
      <div class="header-bar">
        <div
          class="d-flex align-items-center justify-content-between rounded mb-2"
        >
          <div class="d-flex rounded align-items-center mt-2">
            <router-link
              :to="{ name: '' }"
              class="btn btn-lg ms-2"
              style="color: var(--text-color)"
              ><i class="fas fa-chevron-left"> </i
            ></router-link>
            <span class="fs-4">Swimming Pool Party Category List </span>
          </div>
        </div>

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
            <router-link
              :to="{ name: 'CreatePartyCategory' }"
              class="btn btn-lg ms-2 mb-3"
              style="
                color: var(--text-color);
                background-color: var(--btnLight);
              "
              ><i class="fas fa-plus-circle"></i
            ></router-link>
          </div>
        </div>
      </div>

      <div class="px-0 table-card table-responsive">
        <table class="table table-hover table-striped">
          <thead>
            <!-- <tr>
              <th class="text-nowrap">Category Name</th>
              <th class="text-nowrap">Amount</th>
              <th class="text-nowrap">Date</th>
              <th class="text-nowrap text-center">Control</th>
            </tr> -->
            <tr>
              <th class="text-nowrap">{{ $t("message.category_name") }}</th>
              <th class="text-nowrap">{{ $t("message.amount") }}</th>
              <th class="text-nowrap">{{ $t("message.date") }}</th>
              <th class="text-nowrap text-center">
                {{ $t("message.control") }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="align-middle"
              v-for="category in parties"
              :key="category.id"
            >
              <td class="text-nowrap">{{ category.name }}</td>
              <td class="text-nowrap">{{ category.amount }}</td>
              <td class="text-truncate">{{ category.date }}</td>

              <td class="text-nowrap text-center">
                <button
                  class="btn btn-sm btn-danger me-2"
                  @click="deleteCategory(category.id)"
                >
                  <i class="fa-sharp fa-solid fa-trash"></i> Delete
                </button>

                <button
                  type="button"
                  class="btn btn-outline-warning btn-sm mx-1"
                  @click="openEditBox(category)"
                  data-bs-toggle="modal"
                  data-bs-target="#liveCountModal"
                >
                  <i class="fas fa-edit"></i>Edit
                </button>
                <!-- edit -->
                <div
                  class="modal fade"
                  style="z-index: 10000"
                  id="liveCountModal"
                  tabindex="-1"
                  aria-labelledby="liveCountModalLabel"
                  aria-hidden="true"
                >
                  <div class="modal-dialog">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="liveCountModalLabel">
                          {{ $t("message.update_category") }}
                        </h5>
                        <button
                          type="button"
                          id="btn-close"
                          class="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div class="modal-body">
                        <form @submit.prevent="updatedCategory">
                          <div class="text-start">
                            <div class=""></div>

                            <!-- @change="onChangeUpdatePhotoInput" multiple -->
                          </div>
                          <div class="form-floating mb-3">
                            <input
                              type="text"
                              required
                              class="form-control"
                              v-model="newCategoryName"
                              id="barcode-input"
                              placeholder="enter shop name"
                            />
                            <label for="barcode-input">{{
                              $t("message.category_name")
                            }}</label>
                          </div>
                          <div class="form-floating mb-3">
                            <input
                              type="text"
                              required
                              class="form-control"
                              v-model="newCategoryPrice"
                              id="barcode-input"
                              placeholder="enter shop name"
                            />
                            <label for="barcode-input"> Category Price </label>
                          </div>
                          <div class="d-flex align-items-center">
                            <button
                              type="button"
                              class="btn btn-sm me-2 w-50"
                              style="background-color: var(--light)"
                              data-bs-dismiss="modal"
                            >
                              {{ $t("message.cancel") }}
                            </button>
                            <button
                              type="submit"
                              class="btn btn-sm w-50"
                              style="
                                background-color: var(--btnLight);
                                color: var(--text-color);
                              "
                            >
                              {{ $t("message.confirm") }}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- end edit -->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AdminSidebar>
</template>
    
    <script>
import Loading from "@/components/Loading";
import AdminSidebar from "@/components/AdminSidebar";
import db from "../../../config/FirebaseInit";
// import { collection, getDocs } from "firebase/firestore";

export default {
  name: "ListPartyPool",
  components: { AdminSidebar, Loading },
  data() {
    return {
      swimming: {
        typeAge: "",
        date: "",
      },

      categories: [],
      parties: [],

      loadingActive: false,
      selectedId: "",

      newCategoryName: "",
      newCategoryPrice: "",
      selectedCategory: "",
      productsOfCategory: [],
    };
  },

  computed: {
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

  async created() {},

  async mounted() {
    this.$store.dispatch("getAlLCategoriesSwimmingPool", this.owner);
    await this.getPartyCategory();
  },

  methods: {
    async openEditBox(category) {
      // console.log("name", category);
      this.selectedCategory = category;
      this.newCategoryName = category.name;
      this.newCategoryPrice = category.amount;
      this.newCategoryId = category.id;
      // await this.getProductsOfCategory();
    },

    async updatedCategory() {
      try {
        let categoryRef = await db
          .collection(this.owner.city)
          .doc(this.owner.shopId)
          .collection("SwimmingPoolPartyCategory")
          .doc(this.newCategoryId);

        this.loadingActive = true;
        await categoryRef
          .set({
            name: this.newCategoryName,
            id: categoryRef.id,
            amount: this.newCategoryPrice,
            date: this.currentDay,
          })
          .then(() => {
            (this.categories.name = ""),
              (this.categories.amount = ""),
              (this.loadingActive = false);
            console.log("Updated Swimming Category");
            this.getPartyCategory();
            document.getElementById("btn-close").click();
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

    async deleteCategory(id) {
      this.loadingActive = true;
      db.collection(this.owner.city)
        .doc(this.owner.shopId)
        .collection("SwimmingPoolPartyCategory")
        .doc(id)
        .delete()
        .then(() => {
          this.loadingActive = false;
          this.modalMessage = "Deleted Successfully";
          this.getPartyCategory();
        });
    },

    async getPartyCategory() {
      this.parties = [];
      await db
        .collection(this.owner.city)
        .doc(this.owner.shopId)
        .collection("SwimmingPoolPartyCategory")
        .orderBy("date", "desc")
        .onSnapshot((snapshot) => {
          snapshot.forEach((doc) => {
            // console.log("doc", doc.data());
            this.parties.push(doc.data());
          });

          // this.$router.replace({
          //   name: "ListPartyPool",
          //   params: {},
          // });
        });
    },
  },
};
</script>
    
    <style scoped>
</style>