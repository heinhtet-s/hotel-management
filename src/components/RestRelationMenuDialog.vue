<template>
  <div class="modal">
    <div class="card rounded shadow-lg">
      <div
        class="d-flex flex-column card-body text-center justify-content-center align-items-center"
      >
        <div class="modal-body m-0">
          <!--              <p class="alert alert-warning" v-if="warningActive">{{warningMessage}}</p>-->
          <div class="d-flex">
            <img
              :src="selectedProduct.images[0]"
              v-if="selectedProduct.images.length !== 0"
              width="100"
              height="100"
              style="border-radius: var(--border-radius)"
              alt=""
            />
            <img
              src="../assets/flash/1.png"
              v-else
              width="100"
              height="100"
              style="border-radius: var(--border-radius)"
              alt=""
            />
            <div class="d-flex flex-column text-start ms-1">
              <span> {{ selectedProduct.itemName }}</span>
              <span v-if="selectedProduct.style !== ''"
                >{{ $t("message.stock") }} :{{ selectedProduct.stock }}
              </span>
              <span
                >{{ $t("message.barcode") }}:
                {{ selectedProduct.barcode }}</span
              >
            </div>
          </div>
          <div class="d-flex flex-column my-2">
            <span
              class="badge mb-1"
              style="
                background-color: var(--side-bar-bg);
                color: var(--text-color);
              "
              >1 Pcs =
              {{ parseInt(selectedProduct.sellPrice).toLocaleString() }}
              Ks</span
            >
            <span
              class="badge mb-1"
              style="
                background-color: var(--side-bar-bg);
                color: var(--text-color);
              "
              v-if="selectedRelation.length > 0"
              >1 {{ selectedRelation[0].frontUnit }} ({{
                selectedRelation[0].backNumber
              }}
              Pcs) =
              {{ parseInt(selectedRelation[0].sellPrice).toLocaleString() }}
              Ks</span
            >
          </div>
          <div class="d-flex mb-2">
            <input
              type="number"
              min="1"
              class="form-control me-2"
              v-model="frontNumber"
            />
            <select
              class="form-select fs-6 form-control form-select-lg rounded"
              @change="getSelectedRelation"
              style="
                height: 50px;
                background-color: var(--side-bar-bg) !important;
                border-radius: var(--border-radius) !important;
              "
              v-model="frontUnit"
              aria-label=".form-select-sm example"
            >
              <option value="Pcs">Pcs</option>
              <option
                :value="relation.frontUnit"
                v-for="(relation, index) in selectedRelations"
                :key="index"
              >
                {{ relation.frontUnit }}
              </option>
            </select>
          </div>
          <div
            class="d-flex mt-3 w-100 border-0 align-items-center justify-content-between"
          >
            <button
              type="button"
              class="btn me-1"
              @click="closeModal"
              style="background-color: var(--light); color: var(--text-color)"
            >
              {{ $t("message.cancel") }}
            </button>
            <button
              type="button"
              class="btn text-white"
              ref="confirmBtn"
              @click="addToCart"
              style="background-color: var(--primary)"
            >
              {{ $t("message.confirm") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import db from "@/config/FirebaseInit";

export default {
  props: {
    selectedProduct: {
      type: Object,
    },
    selectedRelations: {
      type: Array,
      required: true,
    },
    owner: {
      type: Object,
    },
    selectedSellProduct: {
      type: Object,
    },
  },
  data() {
    return {
      frontNumber: 1,
      frontUnit: "Pcs",
      selectedRelation: "",
      warningMessage: "",
      warningActive: false,
      relationBuyPrice: false,
    };
  },
  name: "ProductSelectModal",

  computed: {
    selectedPurchaseProducts() {
      return this.$store.getters.getSelectedPurchaseProducts;
    },
  },
  async mounted() {
    console.log("child relation", this.selectedRelations);
    this.$refs.confirmBtn.focus();

    /*console.log('child', this.selectedPurchaseProducts);
    // console.log('child mounted', this.owner)
    await db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(this.selectedProduct.id).collection('relation').onSnapshot(snapshot => {
      snapshot.forEach(doc=>{
        this.selectedRelations.push(doc.data())
      });
    });*/
  },
  methods: {
    closeModal() {
      this.$emit("close-modal");
    },
    getSelectedRelation() {
      this.$refs.confirmBtn.focus();
      if (this.frontUnit !== "Pcs") {
        this.selectedRelation = this.selectedRelations.filter((relation) => {
          return relation.frontUnit === this.frontUnit;
        });
      } else {
        this.selectedRelation = [];
      }
    },
    addToCart() {
      let sellPrice = "";
      let backNum = "";
      if (this.selectedRelation) {
        sellPrice = this.selectedRelation[0].sellPrice;
        backNum = this.selectedRelation[0].backNumber;
      } else {
        sellPrice = this.selectedProduct.sellPrice;
        backNum = "1";
      }
      console.log(sellPrice);
      console.log(backNum);
      this.$emit("confirm-modal", {
        count: this.frontNumber,
        relation: this.frontUnit,
        relationNumber: backNum,
        sellPrice: sellPrice,
      });
      this.closeModal();
    },
  },
};
</script>

<style scoped>
.modal {
  top: 0;
  z-index: 999999;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  /*backdrop-filter: blur(3px);*/
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
}
.card {
  border-radius: 20px !important;
}
button {
  width: 150px;
  border-radius: var(--border-radius);
}
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
/*
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
*/

/*.toast-enter-from{
  opacity: 0;
  transform:translateY(-60px) ;
}
.toast-enter-to{
  opacity: 1;
  transform: translateY(0);

}
.toast-enter-active{
  transition: all 0.5s ease;
}
.toast-leave-from{
  opacity: 1;
  transform: translateY(0);
}
.toast-leave-to{
  opacity: 0;
  transform:translateY(-60px) ;
}
.toast-leave-active{
  transition: all 0.5s ease;
}
@keyframes wobble {
  0% {transform:translateY(-60px);opacity: 0}
  50% {transform:translateY(-60px);opacity: 1}
}*/
</style>
