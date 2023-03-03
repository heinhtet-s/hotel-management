<template>
 <AdminNavigation>
   <Loading v-if="loadingActive"/>
   <InfoDialog v-if="modalActive" :modal-message="modalMessage" v-on:close-modal="closeModal"/>
   <confirm-dialog :modal-message="modalMessage" v-if="confirmActive" v-on:confirm="confirm" v-on:cancel="cancel"/>

   <div class="container pt-5 bg-light" style="background-color: var(--background-color);color: var(--text-color);">
      <div class="row mt-5">
        <div class="d-flex rounded align-items-center">
          <button @click="$router.back()" class="btn me-2 float-start" style="color: var(--text-color);"><i class="fas fa-chevron-left"> </i></button>
          <span class="fs-4">Warehouse Management</span>
        </div>
        <div class="row">

          <div class="col-12 col-lg-6 mb-3">
            <label class="form-label">from</label>
            <select class="form-select border-0 fs-6 form-control rounded" style="height: 60px;" @change="getTransferBranch" v-model="transferCity" aria-label="example">
              <option v-for="(city, index) in cities" :key="index" :selected="index === 0" :value="city.name">{{city.name}}</option>
            </select>
          </div>

          <div class="col-12 col-lg-6 mb-3">
            <label class="form-label">To City</label>
            <select class="form-select border-0 fs-6 form-control rounded" style="height: 60px;" @change="getReceivedBranch" v-model="receivedCity" aria-label="example">
              <option v-for="(city, index) in cities" :key="index" :selected="index === 0" :value="city.name">{{city.name}}</option>
            </select>
          </div>

          <div class="col-12 col-lg-6 align-items-center">

            <div class="d-flex my-1 rounded align-items-center p-1 ">
              <button style="cursor: pointer;height: 50px;" @click="fromBranchInputToggle" class="border-0 p-1 form-control form-select text-start">{{selectedTransferBranch.name||'choose branch'}}</button>
            </div>

            <div class="pop-up shadow-sm p-2 "  v-if="fromBranchToggleClick" >
              <button class="btn" style="color:var(--text-color);" @click="this.fromBranchToggleClick = !this.fromBranchToggleClick"><i class="fas fa-times"></i></button>
              <li v-for="(fromBranch, index) in transferBranch" :key="index" class=" my-1 list-unstyled rounded p-1 text-start" @click="selectTransferBranch(fromBranch,'branch')">
                <div class="d-flex justify-content-between">
                  <span class="fw-bold">{{fromBranch.name}}</span>
                </div>
              </li>
            </div>

          </div>
          <div class="col-12 col-lg-6 align-items-center">

            <div class="d-flex my-1 rounded align-items-center p-1 ">
              <button style="cursor: pointer;height: 50px;" @click="toBranchInputToggle" class="border-0 p-1 form-control form-select text-start">{{selectedReceivedBranch.name||'choose branch'}}</button>
            </div>

            <div class="pop-up shadow-sm p-2 "  v-if="toBranchToggleClick" >
              <button class="btn" style="color:var(--text-color); " @click="this.toBranchToggleClick = !this.toBranchToggleClick"><i class="fas fa-times"></i></button>
              <li v-for="(rBranch, index) in receivedBranch" :key="index" :class="rBranch.id === transferBranch.id?'d-none':''" class=" my-1 list-unstyled rounded p-1 text-start" @click="selectReceivedBranch(rBranch)">
                <div class="d-flex justify-content-between">
                  <span class="fw-bold">{{rBranch.name}}</span>
                </div>
              </li>
            </div>

          </div>
          <div class="mt-5">
            <button class="btn w-50 mx-auto text-white" :disabled="selectedReceivedBranch ==='' && selectedTransferBranch===''" @click="replicateAll" style="background-color: var(--primary);">Replicate All Products</button>
          </div>
        </div>
      </div>
    </div>

  </AdminNavigation>
</template>

<script>
// import axios from "axios";

import db,{timestamp} from "../../config/FirebaseInit";
import Loading from "../..//components/Loading";
import InfoDialog from "../../components/InfoDialog";
import ConfirmDialog from "@/components/ConfirmDialog";
import AdminNavigation from "@/components/AdminNavigation";
export default {
  components: {AdminNavigation,ConfirmDialog, Loading, InfoDialog},
  data(){
    return{
      fromBranchToggleClick:false,
      toBranchToggleClick:false,
      confirmActive:false,
      modalActive:false,
      modalMessage:'',
      loadingActive:false,
      showControl:false,

      transferCity:'',
      receivedCity:'',
      selectedReceivedBranch:'',
      selectedTransferBranch:'',

      transferBranch:'',
      receivedBranch:'',
      transferStock:0,
      transferToggleClick:false,
    }
  },
  computed:{
    cities(){
      return this.$store.state.cities;
    },
    currentDateTime(){
      return this.$store.getters.getDateTime;
    },
    currentDay(){
      return this.$store.getters.getDay;
    },
    currentMonth(){
      return this.$store.getters.getMonth;
    },
    currentYear(){
      return this.$store.getters.getYear;
    }
  },

  async mounted() {
    this.$store.dispatch("getDateTime");
    this.$store.dispatch("getDay");
    this.$store.dispatch("getMonth");
    this.$store.dispatch("getYear");
    this.$store.dispatch("getCities");
  },

  methods:{
    async replicateAll(){
      this.loadingActive = true;
      let replicateRef = db.collection('warehouse').doc();
      let replicate = {
        'fromName':this.selectedReceivedBranch.name,
        'toName':this.selectedTransferBranch.name,
        'fromId':this.selectedTransferBranch.id,
        'toId':this.selectedReceivedBranch.id,
        'fromCity':this.selectedTransferBranch.city,
        'toCity':this.selectedReceivedBranch.city,
        'day':this.currentDay,
        'dateTime':this.currentDateTime,
        'id':replicateRef.id,
        'time':timestamp,
        'month':this.currentMonth,
        'year':this.currentYear,
      }
      replicateRef.set(replicate).then(()=>{
        this.loadingActive = false;
        this.modalActive = true;
        this.modalMessage = 'Replicate Ok';
        this.selectedTransferBranch ='';
        this.selectedReceivedBranch='';
      })
      console.log(replicate)
    },
    async getTransferBranch(){
      await db.collection(this.transferCity).onSnapshot(snapshot => {
        this.transferBranch=[];
        snapshot.forEach(doc=>{
          this.transferBranch.push(doc.data());
        });
      });
    },
    async getReceivedBranch(){
      await db.collection(this.receivedCity).onSnapshot(snapshot => {
        this.receivedBranch=[];
        snapshot.forEach(doc=>{
          this.receivedBranch.push(doc.data());
        });
      });
    },
    cancel(){
      this.confirmActive = !this.confirmActive;
    },
    async selectTransferBranch(branch){
      this.selectedTransferBranch = branch;
      this.fromBranchToggleClick = !this.fromBranchToggleClick;

    },
    selectReceivedBranch(branch){
      this.selectedReceivedBranch = branch;
      this.toBranchToggleClick = ! this.toBranchToggleClick;
    },

    closeModal(){
      this.modalActive = !this.modalActive;
    },
    fromBranchInputToggle(){
      this.fromBranchToggleClick = !this.fromBranchToggleClick;
      this.toBranchToggleClick = false;
    },
    toBranchInputToggle(){
      this.toBranchToggleClick = !this.toBranchToggleClick;
      this.fromBranchToggleClick = false;
    },
  }

}
</script>

<style scoped>
.search-box{
  padding:5px;
  width:250px;
  background-color: var(--light);
  border-radius: var(--border-radius) !important;
}
.from-pop-up{
  z-index: 3000;
  background-color: var(--side-bar-bg);
  border: 2px solid white;
  position: absolute;
  overflow-y: scroll;
  height: 300px;
  width: 250px;
  border-radius: var(--border-radius) !important;
  padding-bottom: 50px;
  top: 100px;
}
.to-pop-up{
  z-index: 3000;
  background-color: var(--side-bar-bg);
  border: 2px solid white;
  position: absolute;
  overflow-y: scroll;
  height: 300px;
  width: 250px;
  border-radius: var(--border-radius) !important;
  padding-bottom: 50px;
  top: 100px;
}
.pop-up{
  background-color: var(--side-bar-bg);
  border: 2px solid white;
  overflow-y: scroll;
  height: 200px;
  border-radius: var(--border-radius) !important;
  padding-bottom: 50px;
}
li{
  cursor: pointer;
  background-color: var(--light);
}
li:hover{
  background-color: var(--softPrimary) !important;
}
.header-bar{
  background-color: var(--background-color);
  top:20px;
  width: 82%;
  z-index: 1000;
}
tr{
  cursor: pointer;
  color: var(--text-color) !important;
}
.category-box{
  padding: 5px;
  z-index: 2000;
  background-color: var(--side-bar-bg);
  border-radius: var(--border-radius);
  position: sticky;
  box-sizing: border-box;
  margin-top:5px;
  margin-left: 0px;
  height: inherit;
  align-items: center;
}
.category-list-active{
  background-color: var(--btnLight) !important;
}
.category-list:hover{
  background-color: var(--primary);
}
.category-box ul{
  height: inherit;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  box-sizing: border-box;
}
.category-list{
  cursor: pointer;
  border: none !important;
  border-bottom: 1px solid ;
  height: inherit;
  min-width: 60px;
  text-align: center;
  display: inline;
  padding: 5px;
  margin-top: 4px;
  margin-bottom: 4px;
  margin-left: 5px;
  border-radius: var(--border-radius);
  background-color: var(--btnLight);
  transition: 0.3s;
}
.table-card{
  margin-top: 250px;
}
@media only screen and (max-width: 1030px) {

  .header-bar{
    left: 0px;
    margin-top: 20px;
    width: 100%;
  }

  .search-box{
    width: 100%;
  }
  .table-card{
    margin-top: 400px;
  }
  .from-pop-up, .to-pop-up {
    top: 140px;
    width: 98%;
    right: 5px;
  }
  .to-pop-up {
    top: 220px;
    width: 98%;
    right: 5px;
  }

  .session-pop-up2{
    top:400px;
    width: 90%;
  }
}
</style>