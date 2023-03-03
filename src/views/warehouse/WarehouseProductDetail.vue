<template>
  <Loading v-if="loadingActive"/>
  <InfoDialog v-if="infoModalActive" :modal-message="modalMessage" v-on:close-modal="closeModal"/>
  <confirm-dialog :modal-message="modalMessage" v-if="confirmActive" v-on:confirm="confirm" v-on:cancel="cancel"/>
  <!-- Discount Modal -->
  <div class="modal fade" style="z-index: 30000;" id="discountModal"  tabindex="-1" aria-labelledby="discountModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body">
          <p class="text-center">Add Discount</p>
          <p class="text-center">Please enter discount rate for this item</p>
          <input type="number" class="form-control " v-model="update_discount" placeholder="1-100">
        </div>
        <div class="modal-footer d-flex justify-content-between">
          <button type="button" class="btn text-primary" data-bs-dismiss="modal" @click="this.update_discount=''">cancel</button>
          <button type="button" class="btn text-warning" data-bs-dismiss="modal" @click="updateDiscount">submit</button>
        </div>
      </div>
    </div>
  </div>
  <!-- stock Modal -->
  <div class="modal fade" style="z-index: 30000;" id="stockModal"  tabindex="-1" aria-labelledby="stockModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body">
          <p class="text-center">Add Stock</p>
          <p class="text-center">Please add stock for this item</p>
          <input type="number" class="form-control " placeholder="Count" v-model="update_stock">
        </div>
        <div class="modal-footer d-flex justify-content-between">
          <button type="button" class="btn text-primary" data-bs-dismiss="modal" @click.prevent="this.update_stock=''">cancel</button>
          <button type="button" class="btn text-warning" data-bs-dismiss="modal" @click.prevent="updateStock">submit</button>
        </div>
      </div>
    </div>
  </div>
  <!-- waste Modal -->
  <div class="modal fade" style="z-index: 30000;" id="wasteModal"  tabindex="-1" aria-labelledby="wasteModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body">
          <p class="text-center fs-5">Add Waste</p>
          <p class="text-center">Please enter discount rate for this item</p>
          <input type="number" class="form-control " v-model="update_waste" placeholder="Count">
          <label class="form-label mt-2">Note (optional)</label>
          <input type="text" class="form-control " v-model="update_waste_note" placeholder="">
        </div>
        <div class="modal-footer d-flex justify-content-between">
          <button type="button" class="btn text-primary" data-bs-dismiss="modal" @click="this.update_waste=''">cancel</button>
          <button type="button" class="btn" data-bs-dismiss="modal" @click="updateWaste">submit</button>
        </div>
      </div>
    </div>
  </div>

  <!--  Relation Modal-->
  <div class="modal fade" style="z-index: 30000;" id="relationModal"  tabindex="-1" aria-labelledby="relationModal" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body">
          <p class="text-center fs-5">Add New Relation</p>
          <div class="d-flex justify-content-between">
            <div class="d-flex align-items-center justify-content-start">
              <label class="me-2">1</label>
              <input type="text" class="form-control " v-model="relation.frontUnit" placeholder="Unit">
            </div>
            <span>=</span>
            <div class="d-flex align-items-center justify-content-end ">
              <input type="number" class="form-control" v-model="relation.backNumber" placeholder="Count">
              <label class="ms-2">Pcs</label>
            </div>

          </div>

        </div>
        <div class="p-3">
          <input type="text" v-model="relation.sellPrice" class="form-control mb-2" placeholder="Sell Price" >
          <span class="fs-5 fw-bold">Relations Table</span>
          <div>
            <div class="card p-2 mt-2 " style="background-color: var(--side-bar-bg)!important;" v-for="(relation,index) in relations" :key="index">
              <div class="d-flex justify-content-between align-items-center">
                <span>1 {{ relation.frontUnit }} = {{relation.backNumber}} Pcs</span>
                <div>
                  <span class="text-success">{{relation.sellPrice}} Ks</span>
                  <button class="btn btn-sm ms-2 btn-danger rounded-circle" @click="deleteRelation(relation)"><i class="fas fa-trash"></i></button>
                </div>
              </div>

            </div>
          </div>

        </div>
        <div class="modal-footer d-flex justify-content-between">
          <button type="button" class="btn" data-bs-dismiss="modal" @click="this.update_waste=''">cancel</button>
          <button type="button" class="btn text-primary" @click="updateRelationTable">submit</button>
        </div>
      </div>
    </div>
  </div>

  <div class="container-fluid" style="background-color: var(--background-color);">
    <div class="row">
      <div class="col-lg-2 p-0"><AdminSidebar/></div>
      <div class="col-12 col-lg-10 mt-5">
        <div class="row">
          <div class="col-12">
            <div class="d-flex align-items-center rounded top-bar px-1 py-2 justify-content-between" >
              <div class="d-flex align-items-center">
                <button class="btn btn--white me-2" style="color: var(--text-color);" @click="$router.back()">
                  <i class="fas fa-chevron-left"> </i>
                </button>
                <span class="fs-3" style="color: var(--text-color);">Details</span>
              </div>
              <div class="dropdown d-none">
                <button class="btn btn-outline-dark" style="color: var(--text-color);" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="fas fa-ellipsis-vertical"></i>
                </button>
                <ul class="dropdown-menu " aria-labelledby="dropdownMenuButton1">
                  <li class="dropdown-item" data-bs-toggle="modal" data-bs-target="#discountModal">
                    <i class="fas fa-tags me-2"> </i>Discount
                  </li>
                  <router-link class="dropdown-item text-dark" :to="{name:'ProductEdit', params:{product_id:this.$route.params.product_id}}">
                    <i class="fas fa-pen-to-square me-2"> </i>Edit
                  </router-link>
                  <li class="dropdown-item" data-bs-toggle="modal" data-bs-target="#stockModal">
                    <i class="fas fa-square-plus me-2" > </i>Add Stock</li>
                  <li class="dropdown-item" data-bs-toggle="modal" data-bs-target="#relationModal">
                    <i class="fas fa-square-plus me-2" > </i>Add Relation</li>
                  <li class="dropdown-item" data-bs-toggle="modal" data-bs-target="#wasteModal">
                    <i class="fas fa-trash-can-arrow-up me-2" > </i>Waste</li>
                  <!--                  <li class="dropdown-item" @click="showStockHistory">
                                      <i class="fas fa-clipboard-list me-2" > </i>Stock History</li>
                                    <li class="dropdown-item"  @click="showSellHistory">
                                      <i class="fas fa-layer-group me-2"> </i>Sell History</li>-->
                  <li class="dropdown-item text-danger" @click="deleteProduct">
                    <i class="fas fa-trash me-2" ></i>Delete</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="row pt-5 content-box">
          <div class="col-12 col-lg-4">
            <div id="carouselExampleControls" class="carousel  slide" data-bs-ride="carousel">
              <div id="carouselExampleIndicators" class="carousel slide mx-auto" data-bs-ride="carousel">
                <div class="carousel-indicators">
                  <button type="button" v-for="(img,index) in currentProduct.images" :key="index" data-bs-target="#carouselExampleIndicators" :data-bs-slide-to="index" :class="index===0?'active':''" :aria-current="index===0?true:false" ></button>
                </div>
                <div class="carousel-inner border-secondary border-2 rounded-3"  v-if="currentProduct.images!==[]" >
                  <div class="carousel-item" :class="index===0?'active':''" v-for="(img, index) in currentProduct.images" :key="index">
                    <div :style="{ 'background-image': 'url(' + img + ')' }" class="rounded" style="background-size: cover; width:100%;height: 300px; position: center"></div>
                  </div>
                </div>
                <div v-else>
                  <img src="../../assets/flash/1.png" style="background-size: cover; width:100%;height: 300px; position: center" alt="">
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                  <span class="bg-secondary rounded-circle p-1" style="width: 40px;height: 40px;" aria-hidden="true"><i class="fas fa-angle-left fa-2x"></i></span>
                  <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                  <span class="bg-secondary rounded-circle p-1" style="width: 40px;height: 40px;" aria-hidden="true"><i class="fas fa-angle-right fa-2x"></i></span>
                  <span class="visually-hidden">Next</span>
                </button>
              </div>
            </div>

            <div class="my-1">
              <h2>{{currentProduct.itemCode}}</h2>
              <div class="d-flex justify-content-between">
                <span>Name</span>
                <span class="fs-5">{{currentProduct.itemName}}</span>
              </div>
              <div class="d-flex justify-content-between">
                <span>Barcode</span>
                <span class="fs-5">{{currentProduct.barcode}}</span>
              </div>
              <div class="d-flex justify-content-between" v-if="currentProduct.discount!=='0'">
                <span>Discount</span>
                <span class="fs-5">{{currentProduct.discount}} %</span>
              </div>
              <div class="d-flex justify-content-between">
                <span>Stock</span>
                <span class="fs-5">{{currentProduct.stock}}</span>
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <div class="card">
                  <div class="card-body d-flex flex-column">
                    <span class="text-warning">Buy Price</span>
                    <span class="fs-6">{{currentProduct.buyPrice}} Ks</span>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div class="card">
                  <div class="card-body d-flex flex-column">
                    <span class="text-success">Sell Price</span>
                    <span class="fs-6" v-if="currentProduct.discount"> {{currentProduct.sellPrice-(currentProduct.sellPrice*(currentProduct.discount/100))}} Ks</span>
                    <span class="fs-6" v-else>{{currentProduct.sellPrice}} Ks</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-lg-4">
            <h3 class="my-2">Others</h3>
            <div class="d-flex p-1 justify-content-between border-1 border-bottom">
              <span>Type</span>
              <span>{{currentProduct.type}}</span>
            </div>
            <div class="d-flex p-1 justify-content-between border-1 border-bottom">
              <span>Color</span>
              <span>{{currentProduct.color}}</span>
            </div>
            <div class="d-flex p-1 justify-content-between border-1 border-bottom">
              <span>Size</span>
              <span>{{currentProduct.size}}</span>
            </div>
            <div class="d-flex p-1 justify-content-between border-1 border-bottom">
              <span>Weight</span>
              <span>{{currentProduct.weight}}</span>
            </div>
            <h3 class="my-2">Description</h3>
            <p>{{currentProduct.description}}</p>
          </div>
          <div class="col-12 col-lg-4 ">
            <h3 class="my-2">Stock History</h3>
            <div class="stock-box">
              <div class="card-body">
                <div class="card mb-2" v-for="(history, index) in stockHistories" :key="index">
                  <div class="p-1 d-flex justify-content-between">
                    <span class="badge my-1 rounded bg-primary">{{history.process}}</span>
                  </div>
                  <div class="card-body">

                    <div class="d-flex justify-content-between">
                      <span>{{history.dateTime}}</span>
                      <div class="flex">
                        <span class="fs-4 text-primary" v-if="history.process==='discountUpdate'">{{history.discount}} %</span>
                        <span class="fs-4" :class="history.count<0?'text-danger':'text-success'" v-else>{{history.count}}</span>
                      </div>

                    </div>
                    <div v-if="history.process === 'received' || history.process === 'transfer'">
                      <span>{{history.note}}</span>
                    </div>
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
//import "firebase/compat/storage";
import db, {storage,timestamp} from "@/config/FirebaseInit";
import Loading from "../../components/Loading";
import InfoDialog from "@/components/InfoDialog";
import ConfirmDialog from "@/components/ConfirmDialog";
//import firebase from "firebase/compat";
import AdminSidebar from "@/components/AdminSidebar";
export default {
  components:{ConfirmDialog, InfoDialog, Loading, AdminSidebar},
  data(){
    return{
      infoModalActive:false,
      modalMessage:'',
      loadingActive:false,
      confirmActive:false,
      allSrc:[],
      currentProduct:'',
      update_discount:'',
      update_stock:'',
      update_waste:'',
      update_waste_note:'',
      stockHistories:'',
      relations:[],
      relation:{
        frontUnit:'',
        backUnit:'Pcs',
        frontNumber:1,
        backNumber:'',
        id:'',
        sellPrice:'',
      }
      /* product:{
         barcode: "",
         buyPrice: "",
         color: "",
         date: "",
         day: "",
         description: "",
         discount: "",
         id: "",
         images:[],
         temCode: "",
         itemName: "",
         month: "",
         rating: "",
         sellPrice: "",
         size: "",
         stock: "",
         type: "",
         weight: "",
         year: ""
       }*/
    }
  },
  computed:{
    owner(){
      return this.$store.getters.getShopOwner;
    },
    shopInfo(){
      return this.$store.getters.getShopInfo;
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
  async created(){
    this.$store.dispatch('getCurrentShop');
    this.$store.dispatch("getShopInfo",this.owner);
    await db.collection(this.$route.params.branch_city).doc(this.$route.params.branch_id).collection('products').doc(this.$route.params.product_id).onSnapshot(snapshot => {
      this.currentProduct = snapshot.data();
      db.collection(this.$route.params.branch_city).doc(this.$route.params.branch_id).collection('products').doc(this.$route.params.product_id).collection('records').orderBy('time','desc').onSnapshot(snapshot => {
        this.stockHistories =[];
        snapshot.forEach(doc=>{
          this.stockHistories.push(doc.data());
        })
      });

      db.collection(this.$route.params.branch_city).doc(this.$route.params.branch_id).collection('products').doc(this.$route.params.product_id).collection('relation').onSnapshot(snapshot=>{
        this.relations = [];
        snapshot.forEach(doc=>{
          this.relations.push(doc.data());

        });
        console.log(this.relations)
      });

    })
  },
  methods:{
    deleteProduct(){
      this.confirmActive = true;
      this.modalMessage="Are you sure to delete? Records of this product will be permanently deleted."
    },
    async confirm(){
      this.confirmActive = !this.confirmActive;
      this.loadingActive = true;
      const storageRef = await storage.ref();
      const fileRef = storageRef.child(`/${this.$route.params.branch_city}/${this.$route.params.branch_id}/products/${this.$route.params.product_id}`);
      await db.collection(this.$route.params.branch_city).doc(this.$route.params.branch_id).collection('products').doc(this.$route.params.product_id).collection('records').get().then(snapshot => {
        snapshot.forEach(doc => {
          doc.ref.delete()
        });
        fileRef.listAll()
            .then((dir) => {
              dir.items.forEach(fileRef => {
                fileRef.delete();
              });
            })
            .catch((err) => {
              this.loadingActive = false
              console.log(err);
            });
        db.collection(this.$route.params.branch_city).doc(this.$route.params.branch_id).collection('products').doc(this.$route.params.product_id).delete().then(()=>{
          this.loadingActive = false;
          this.$router.push({name:'ProductList'});
        })
      })
    },
    cancel(){
      this.confirmActive = !this.confirmActive;
    },
    closeModal(){
      this.infoModalActive = !this.infoModalActive;
    },
    async updateStock(){
      if(this.update_stock!==''){
        this.$store.dispatch("getDateTime");
        this.$store.dispatch("getDay");
        this.$store.dispatch("getMonth");
        this.$store.dispatch("getYear");
        this.loadingActive = true;
        let newStock = parseInt(this.currentProduct.stock)+this.update_stock;
        this.loadingActive = true;
        await db.collection(this.$route.params.branch_city).doc(this.$route.params.branch_id).collection('products').doc(this.$route.params.product_id).update(
            {
              'stock':newStock.toString()
            }
        ).then(()=>{
          const recordRef = db.collection(this.$route.params.branch_city).doc(this.$route.params.branch_id).collection('products').doc(this.$route.params.product_id).collection('records');
          recordRef.add(
              {
                'id':this.currentProduct.id,
                'recordId':recordRef.id,
                'itemCode':this.currentProduct.itemCode,
                'barcode':this.currentProduct.barcode,
                'itemName':this.currentProduct.itemName,
                'buyPrice':this.currentProduct.buyPrice,
                'sellPrice':this.currentProduct.sellPrice,
                'stock':this.currentProduct.stock.toString(),
                'description':this.currentProduct.description,
                'type':this.currentProduct.type,
                'color':this.currentProduct.color,
                'size':this.currentProduct.size,
                'weight':this.currentProduct.weight,
                'time':timestamp,
                'day':this.currentDay,
                'month':this.currentMonth,
                'year':this.currentYear,
                'dateTime':this.currentDateTime,
                'rating':this.currentProduct.rating,
                'discount':this.currentProduct.discount,
                'note':'default',
                'process': 'stockUpdate',
                'count':this.update_stock.toString()
              }
          ).then(()=>{
            this.loadingActive=false;
            this.modalMessage = 'Updated Successfully!'
            this.infoModalActive = true;
          })

        })
      }else {
        this.loadingActive = false;
        this.modalMessage = "Please fill stock!"
        this.infoModalActive = true;
      }
    },
    async updateDiscount(){
      if(this.update_discount!==''){
        this.$store.dispatch("getDateTime");
        this.$store.dispatch("getDay");
        this.$store.dispatch("getMonth");
        this.$store.dispatch("getYear");

        this.loadingActive = true;
        await db.collection(this.$route.params.branch_city).doc(this.$route.params.branch_id).collection('products').doc(this.$route.params.product_id).update(
            {
              'discount':this.update_discount.toString()
            }
        ).then(()=>{
          const recordRef = db.collection(this.$route.params.branch_city).doc(this.$route.params.branch_id).collection('products').doc(this.$route.params.product_id).collection('records');
          recordRef.add(
              {
                'id':this.currentProduct.id,
                'recordId':recordRef.id,
                'itemCode':this.currentProduct.itemCode,
                'barcode':this.currentProduct.barcode,
                'itemName':this.currentProduct.itemName,
                'buyPrice':this.currentProduct.buyPrice,
                'sellPrice':this.currentProduct.sellPrice,
                'stock':this.currentProduct.stock.toString(),
                'description':this.currentProduct.description,
                'type':this.currentProduct.type,
                'color':this.currentProduct.color,
                'size':this.currentProduct.size,
                'weight':this.currentProduct.weight,
                'time':timestamp,
                'day':this.currentDay,
                'month':this.currentMonth,
                'year':this.currentYear,
                'dateTime':this.currentDateTime,
                'rating':this.currentProduct.rating,
                'discount':this.update_discount.toString(),
                'note':'',
                'process': 'discountUpdate',
                'count':'0'
              }
          ).then(()=>{
            this.loadingActive=false;
            this.modalMessage = 'Updated Successfully!'
            this.infoModalActive = true;
          });
        });
      }else {
        this.loadingActive = false;
        this.modalMessage = "Please fill discount!"
        this.infoModalActive = true;
      }

    },
    async updateWaste(){
      if(this.update_waste!==''){
        if(this.update_waste_note==''){
          this.update_waste_note = 'default';
        }
        this.$store.dispatch("getDateTime");
        this.$store.dispatch("getDay");
        this.$store.dispatch("getMonth");
        this.$store.dispatch("getYear");
        this.loadingActive = true;
        let newStock = parseInt(this.currentProduct.stock)-this.update_waste;
        this.loadingActive = true;
        await db.collection(this.$route.params.branch_city).doc(this.$route.params.branch_id).collection('products').doc(this.$route.params.product_id).update(
            {
              'stock':newStock.toString()
            }
        ).then(()=>{
          const recordRef = db.collection(this.$route.params.branch_city).doc(this.$route.params.branch_id).collection('products').doc(this.$route.params.product_id).collection('records');
          recordRef.add(
              {
                'id':this.currentProduct.id,
                'recordId':recordRef.id,
                'itemCode':this.currentProduct.itemCode,
                'barcode':this.currentProduct.barcode,
                'itemName':this.currentProduct.itemName,
                'buyPrice':this.currentProduct.buyPrice,
                'sellPrice':this.currentProduct.sellPrice,
                'stock':this.currentProduct.stock.toString(),
                'description':this.currentProduct.description,
                'type':this.currentProduct.type,
                'color':this.currentProduct.color,
                'size':this.currentProduct.size,
                'weight':this.currentProduct.weight,
                'time':timestamp,
                'day':this.currentDay,
                'month':this.currentMonth,
                'year':this.currentYear,
                'dateTime':this.currentDateTime,
                'rating':this.currentProduct.rating,
                'discount':this.currentProduct.discount,
                'note':this.update_waste_note.toString(),
                'process': 'waste',
                'count':'-'+this.update_waste.toString()
              }
          ).then(()=>{
            this.loadingActive=false;
            this.modalMessage = 'Updated Successfully!'
            this.infoModalActive = true;
          })

        })
      }else {
        this.loadingActive = false;
        this.modalMessage = "Please fill stock!"
        this.infoModalActive = true;
      }
    },
    async updateRelationTable(){
      const relationRef = await  db.collection(this.$route.params.branch_city).doc(this.$route.params.branch_id).collection('products').doc(this.$route.params.product_id).collection('relation').doc();
      this.relation.id = relationRef.id;

      relationRef.set(this.relation).then(()=>{
        console.log('relation added')
      })

    },
    async deleteRelation(relation){
      await db.collection(this.$route.params.branch_city).doc(this.$route.params.branch_id).collection('products').doc(this.$route.params.product_id).collection('relation').doc(relation.id).delete().then(()=>{
        console.log('deleted')
      })
    },
    async showSellHistory(){

    },
    async showStockHistory(){

    }
  }
}
</script>
<style scoped>
.modal-dialog{
  border-radius: var(--border-radius) !important;
}
.content-box{
  color: var(--text-color) !important;
  background-color: var(--background-color);
  margin-top: 50px;
}
.top-bar{
  position: fixed;
  z-index: 1000;
  width:82%;
}
.card{
  background-color: var(--light) !important;
  margin: 0;
}
.dropdown-menu{
  background-color:white;
  padding: 10px;
}
.dropdown-menu li{
  margin-bottom: 4px;
  cursor: pointer;

}
.stock-box{
  position: fixed;
  height:75%;
  overflow-y: scroll;
  width: 25%;
}
.modal-footer .btn{
  background-color: var(--side-bar-bg) !important;
  border-radius: var(--border-radius) !important;
}

@media only screen and (max-width: 1030px) {
  .stock-box{
    position: absolute;
    width: 98%;
  }
  .top-bar{
    position: fixed;
    z-index: 1000;
    width: 95%;
  }
  /*  .stock-box{
      width: 90%;
      height: 100vh;

    }*/
  .content-box {
    margin-top: 60px;
  }
}
</style>