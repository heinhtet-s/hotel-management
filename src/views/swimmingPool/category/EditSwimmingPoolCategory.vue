<template>
    <AdminSidebar>
      <Loading v-if="loadingActive" />
      <div class="">
        <div class="header-bar">
          <div
            class="d-flex align-items-center justify-content-between rounded mb-2"
          >
            <div class="d-flex rounded align-items-center mt-2">
              <router-link :to="{ name: 'ListSwimmingPool' }" class="btn btn-lg">
                <button
                  class="btn me-2 float-start"
                  style="color: var(--text-color)"
                >
                  <i class="fas fa-chevron-left"> </i>
                </button>
              </router-link>
              <span class="fs-4">Edit Swimming Pool Category </span>
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
                :to="{ name: 'ListSwimmingPool' }"
                class="btn btn-lg ms-2 mb-3"
                style="
                  color: var(--text-color);
                  background-color: var(--btnLight);"
              >
                <i class="fa-sharp fa-solid fa-arrow-left"></i>
              </router-link>
            </div>
          </div>
  
          <div class="col-12 col-lg-6" style="height: 95vh; overflow-y: scroll">
            <form @keydown.prevent.stop.enter @submit.prevent="updatedCategory">
              <div class="row">
                <div class="col-12 col-lg-6 col-md-6 mb-2">
                  <div class="form-floating mb-3">
                    <input
                      type="text"
                      min="0"
                      required
                      v-model="categories.name"
                      class="form-control"
                      id="buy-price-input"
                      placeholder="enter shop name"
                    />
                    <label for="buy-price-input"> Category Name </label>
                  </div>
                </div>
                <div class="col-12 col-lg-6 col-md-6 mb-2">
                  <div class="form-floating mb-3">
                    <input
                      type="number"
                      min="0"
                      required
                      v-model="categories.amount"
                      class="form-control"
                      id="sell-price-input"
                      placeholder="enter shop sell price"
                    />
                    <label for="sell-price-input"> Amount </label>
                  </div>
                </div>
                <div
                  class="position-sticky shadow-sm bottom-0 mt-3"
                  style="background-color: var(--background-color)"
                >
                  <button
                    type="submit"
                    class="btn w-100 my-2 text-white mx-auto"
                    style="background-color: var(--primary)"
                  >
                    Update
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminSidebar>
  </template>
  
    <script>
  import AdminSidebar from "@/components/AdminSidebar";
  import Loading from "@/components/Loading";
  import db from "../../../config/FirebaseInit";
  
  export default {
    name: "EditSwimmingPoolCategory",
    props: ["id"],
    components: {
      AdminSidebar,
      Loading,
    },
    data() {
      return {
        categories: {
          name: "",
          amount: "",
          id: "",
          date: "",
        },
        categoryRef: "",
        loadingActive: false,
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
  
    async mounted() {
      this.categoryRef = await db
        .collection(this.owner.city)
        .doc(this.owner.shopId)
        .collection("swimmingPoolCategory")
        .doc();
  
      this.$store.dispatch("getDateTime");
      this.$store.dispatch("getDay");
      this.$store.dispatch("getMonth");
      this.$store.dispatch("getYear");
      this.$store.dispatch("getShopInfo", this.owner);
  
      db.collection(this.owner.city)
        .doc(this.owner.shopId)
        .collection("swimmingPoolCategory")
        .doc(this.id)
        .get()
        .then((snapshot) => {
          this.categories.name = snapshot.data().name;
          this.categories.amount = snapshot.data().amount;
          this.categories.id = snapshot.data().id;
          // console.info("product", snapshot.data());
        });
    },
  
    methods: {
      async updatedCategory() {
        try {
          this.categories.amount = this.categories.amount.toString();
          
          let categoryRef = await db
            .collection(this.owner.city)
            .doc(this.owner.shopId)
            .collection("swimmingPoolCategory")
            .doc(this.categories.id);
  
          this.loadingActive = true;
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
              console.log("Updated Swimming Category");
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
  @media only screen and (max-width: 1030px) {
    .content-box {
      margin-top: 50px;
    }
  }
  </style>