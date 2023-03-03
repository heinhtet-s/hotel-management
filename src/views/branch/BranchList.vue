<template>
  <div class="container-fluid" style="background-color: var(--background-color);  color: var(--text-color);" >
    <div class="row">
      <div class="col-lg-2 p-0">
        <AdminSidebar/>
      </div>
      <div class="col-12 col-lg-10" v-if="shopInfo.packageStatus === 'ultra'|| shopInfo.packageStatus==='pro'" >
        <div class="row mt-5">
          <div class="col-12 ">
            <div class="row">
              <div class="col-12 d-flex align-items-center">
                <button class="btn btn--white" @click="$router.back()"><i class="fas fa-chevron-left"></i></button>
                <span class="fs-4">{{ $t('message.branches') }}</span>
              </div>

              <div class="col-12" v-for="branch in branches" :key="branch.id">
                <div class="card p-1" @click="selectBranch(branch)">
<!--                  <router-link :to="{name:'BranchDetail',query:{city:branch.city, branch_id:branch.id}}">-->
<!--                   -->
<!--                  </router-link>-->
                  <div class="d-flex align-items-center mb-3">
                    <img :src="branch.profileUrl" width="80" style="border-radius: var(--border-radius);">
                    <span class="fs-2 ms-2">
                      {{branch.name}}
                    </span>
                  </div>
                  <div class="py-3" style="border-top: 2px solid var(--side-bar-bg);">
                    <div><i class="fas fa-phone"></i><span class="ms-2 mb-1">{{branch.phone}}</span></div>
                    <div><i class="fas fa-location"></i><span class="ms-2">{{branch.address}}</span></div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminSidebar from "@/components/AdminSidebar";
import db from "@/config/FirebaseInit";

export default {
  components:{AdminSidebar},
  data(){
    return{
      branches:[],
    }
  },
  computed:{
    shopInfo(){
      return this.$store.getters.getShopInfo;
    },
    owner(){
      return this.$store.getters.getShopOwner;
    },

    cashierAcc(){
      return this.$store.getters.getCashierAcc;
    }
  },
  mounted() {
    this.$store.dispatch("getCurrentShop");
    this.$store.dispatch("getShopInfo", this.owner);
    this.$store.dispatch("getCashierAcc",this.owner);
    this.getBranches();
  },

  methods:{
     getBranches(){
      this.shopInfo.listBranch.forEach((branch,index)=>{
        db.collection(this.shopInfo.branchCity[index]).doc(this.shopInfo.listBranch[index]).get().then(snapshot=>{
          this.branches.push(snapshot.data())
        })

      });
      this.$store.commit('SET_BRANCHES',this.branches)
    },
    selectBranch(branch){
       console.log(branch.city, branch.id)
       this.$store.commit('SET_SELECTED_BRANCH', branch);
       this.$router.push({name:'BranchDetail', params:{city:branch.city, branch_id:branch.id}})
    }
  }
}
</script>

<style scoped>
.card{
  cursor: pointer;
  transition: 0.5s;
  background-color: var(--light) !important;
}
.card:hover{
  background-color: var(--softPrimary) !important;
}
</style>