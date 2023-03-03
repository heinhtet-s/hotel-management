<template>
  <Loading v-if="loadingActive"/>
  <InfoDialog v-if="infoModalActive" :modal-message="modalMessage" v-on:close-modal="closeModal"/>

  <AdminSidebar>
    <div class="col-12 col-lg-6">
      <div class="d-flex align-items-center rounded mt-2">
        <button class="btn btn-sm me-2" style="color: var(--text-color);" @click="$router.back()"><i class="fas fa-chevron-left"> </i></button>
        <span class="fs-3">{{ $t('message.update_table') }}</span>
      </div>
      <form class="form" @submit.prevent="upload">
        <div class="row pt-5">
          <div class="col-12 col-lg-6 col-md-6 mb-2">
            <div class="form-floating mb-3">
              <input type="text" required class="form-control" v-model="selectedTable.name" id="name-input" placeholder="enter shop name">
              <label for="name-input">Name</label>
            </div>
          </div>
          <div class="col-12 col-lg-6 col-md-6">
            <div class="form-floating">
              <select id="cate" class="form-select rounded" v-model="selectedTable.category" aria-label=".form-select-sm example">
                <option selected disabled>Choose category</option>
                <option :value="type.name" v-for="type in tableCategories" :key="type.id">{{ type.name }}</option>
              </select>
              <label for="cate">Category</label>

            </div>

          </div>

          <div class="position-sticky shadow-sm bottom-0 mt-5" style="background-color: var(--background-color);">
            <button type="submit" class="btn w-100 my-2 text-white mx-auto" style="background-color: var(--primary);">{{$t('message.update')}}</button>
          </div>
        </div>
      </form>

    </div>

  </AdminSidebar>

</template>

<script>
import db from "@/config/FirebaseInit";
import Loading from "@/components/Loading";
import InfoDialog from "@/components/InfoDialog";
import AdminSidebar from "@/components/AdminSidebar";
export default {
  components:{InfoDialog, Loading, AdminSidebar},
  data(){
    return{
      infoModalActive:false,
      modalMessage:'',
      confirmActive:false,
      loadingActive:false,
      table:{
        category:"",
        categoryType:"",
        categoryTypeId:"",
        id:"",
        name:"",
        startTime:""
      },
      selectedTable:""
    }
  },
  computed:{
    tableCategories(){
      return this.$store.getters.getTableCategories
    },
    owner(){
      return this.$store.getters.getShopOwner;
    },
    tables(){
      return this.store.getters.getAllTables
    },
    currentDateTime(){
      const date = new Date();
      let time = new Intl.DateTimeFormat('en-US',
          {
            hour12: true,
            hour: 'numeric',
            minute: 'numeric'
          }).format(date);
      return time;
    },
    shopInfo(){
      return this.$store.getters.getShopInfo;
    }

  },
  async mounted() {
    this.table.category = this.$route.params.category;
    this.$store.dispatch("getDateTime");
    this.$store.dispatch("getDay");
    this.$store.dispatch("getMonth");
    this.$store.dispatch("getYear");
    this.$store.dispatch("getShopInfo", this.owner);
    db.collection(this.owner.city).doc(this.owner.shopId).collection('tables').doc(this.$route.params.table_id).get().then(snapshot=>{
      this.selectedTable = snapshot.data();
      console.log('selected table', this.selectedTable)
    });
  },
  methods:{

    closeModal(){
      this.infoModalActive = !this.infoModalActive;

    },
    cancel(){
      this.confirmActive = !this.confirmActive;

    },
    confirm(){
      this.confirmActive = !this.confirmActive;

    },

    upload(){
      const tableRef = db.collection(this.owner.city).doc(this.owner.shopId).collection('tables').doc(this.selectedTable.id);
      this.table.id = tableRef.id;
      tableRef.update({
        name:this.selectedTable.name,
        category:this.selectedTable.category
      });
      this.infoModalActive = true;
      this.modalMessage = "Updated Successfully";
      this.$router.back();
    },
  }
}
</script>
<style scoped>
@media only screen and (max-width: 1030px) {

  .content-box {
    margin-top: 50px;
  }
}
</style>