<template>

  <AdminSidebar>
    <Loading v-if="loadingActive"/>
    <InfoDialog v-if="infoModalActive" :modal-message="modalMessage" v-on:close-modal="closeModal"/>
    <ImageView v-if="imageViewActive" :image="imageUrl" v-on:close-modal="closeImageModal"/>

    <confirm-dialog :modal-message="modalMessage" v-if="confirmActive" v-on:confirm="confirm" v-on:cancel="cancel"/>
    <!-- Discount Modal -->
    <div class="modal fade" style="z-index: 30000;" id="discountModal"  tabindex="-1" aria-labelledby="discountModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-body">
            <p class="text-center">{{$t('message.add_discount')}}</p>
            <input type="number" class="form-control " v-model="update_discount" placeholder="1-100">
          </div>
          <div class="modal-footer d-flex justify-content-between">
            <button type="button" class="btn text-danger" data-bs-dismiss="modal" @click="this.update_discount=''">
              {{ $t('message.cancel') }}</button>
            <button type="button" class="btn text-white" style="background-color: var(--primary)!important;" data-bs-dismiss="modal" @click="updateDiscount">{{ $t('message.confirm') }}</button>
          </div>
        </div>
      </div>
    </div>
    <!-- stock Modal -->
    <div class="modal fade" style="z-index: 30000;" id="stockModal"  tabindex="-1" aria-labelledby="stockModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-body">
            <p class="text-center">{{$t('message.add_stock')}}</p>
            <span v-if="frontUnit!=='Pcs'">1 {{frontUnit}} = {{selectedRelation.backNumber}} Pcs</span>
            <!--          <input type="number" class="form-control " placeholder="Count" v-model="update_stock">-->
            <div class="d-flex">
              <input type="number" class="form-control me-2" v-model="frontNumber">
              <select class="form-select fs-6 form-control form-select-lg rounded" @change="getSelectedRelation" style="height: 50px;background-color:var(--side-bar-bg)!important;border-radius: var(--border-radius) !important;"  v-model="frontUnit" aria-label=".form-select-sm example">
                <option value="Pcs">Pcs</option>
                <option :value="relation.frontUnit" v-for="(relation, index) in relations" :key="index">{{ relation.frontUnit }}</option>
              </select>

            </div>
          </div>
          <div class="modal-footer d-flex justify-content-between">
            <button type="button" class="btn text-danger" data-bs-dismiss="modal" @click.prevent="this.update_stock=''">{{$t('message.cancel')}}</button>
            <button type="button" class="btn text-white" style="background-color: var(--primary)!important;" data-bs-dismiss="modal" @click.prevent="updateStock">{{ $t('message.confirm') }}</button>
          </div>
        </div>
      </div>
    </div>
    <!-- waste Modal -->
    <div class="modal fade" style="z-index: 30000;" id="wasteModal"  tabindex="-1" aria-labelledby="wasteModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-body">
            <p class="text-center fs-5">{{$t('message.waste')}}</p>
            <div class="p-1 mb-2" style="background-color: var(--light);border-radius: var(--border-radius); width: 100%;">
              <div class="btn btn-sm bg-danger text-white float-end" @click="clearFile">Clear</div>
              <div class="d-flex pb-3" style="background-color: var(--light);overflow-x: scroll; width: 100%;">
                <div class="rounded p-1 m-1" style="background-color: var(--light);" v-for="(previewImage,index) in previewImages" :key="index">
                  <img :src="previewImage" width="100" height="100"  @click="selectImage" alt="">
                </div>
              </div>
              <div class="btn btn-sm " @click="selectImage" style="background-color: var(--background-color);">
                <i class="fas fa-file-arrow-up"></i> Upload Photo
              </div>
              <div class="text-start" >
                <input type="file" @change="pickFile" hidden accept="image/*" id="img-input" class="form-control mb-3" ref="photo" placeholder="photo">
                <!--            <input type="file" @change="onChangePhotoInput"   accept="image/*" id="img-input" multiple class="form-control mb-3" ref="photo" placeholder="photo">-->
              </div>
            </div>
            <input type="number" class="form-control " v-model="update_waste" :placeholder="$t('message.count')">
            <label class="form-label mt-2">{{ $t('message.note') }} (optional)</label>
            <input type="text" class="form-control " v-model="update_waste_note" placeholder="">
          </div>
          <div class="modal-footer d-flex justify-content-between">
            <button type="button" class="btn text-danger" data-bs-dismiss="modal" @click="this.update_waste=''">{{ $t('message.cancel') }}</button>
            <button type="button" class="btn text-white" style="background-color: var(--primary)!important;" data-bs-dismiss="modal" @click="updateWaste">{{ $t('message.confirm') }}</button>
          </div>
        </div>
      </div>
    </div>

    <!--  Relation Modal-->
    <div class="modal fade" style="z-index: 30000;" id="relationModal"  tabindex="-1" aria-labelledby="relationModal" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content border-0" style="background-color: var(--background-color);border-radius: var(--border-radius);">
          <div class="modal-header d-flex border-0 p-1 justify-content-end">
            <button type="button" class="btn btn--white" data-bs-dismiss="modal"><i class="fas fa-times"></i></button>
          </div>
          <div class="modal-body">
            <p class="text-center fs-5">{{ $t('message.add_relation') }}</p>

            <div class="d-flex justify-content-between p-2" style="background-color: var(--side-bar-bg);border-radius: var(--border-radius);">
              <form @submit.prevent="updateRelationTable">
                <div class="d-flex align-items-center">
                  <div class="d-flex align-items-center justify-content-start">
                    <label class="me-2">1</label>
                    <input type="text" required class="form-control " v-model="relation.frontUnit" :placeholder="$t('message.unit')">
                  </div>
                  <span class="mx-2">=</span>
                  <div class="d-flex align-items-center justify-content-end ">
                    <input type="number" required class="form-control" v-model="relation.backNumber" :placeholder="$t('message.count')">
                    <label class="ms-2">Pcs</label>
                  </div>
                </div>
                <div class="form-floating mx-2">
                  <input type="number" required id="sellPrice" v-model="relation.sellPrice" class="form-control my-2" placeholder="Sell Price" >
                  <label class="form-label" for="sellPrice">{{ $t('message.sell_price') }}</label>
                </div>
                <div class="d-flex align-items-center justify-content-center">
                  <button type="submit" class="btn w-50 text-white" style="background-color: var(--secondary);">{{ $t('message.confirm') }}</button>
                </div>
              </form>
            </div>

          </div>
          <div class="p-3">
            <span class="fs-5 fw-bold">{{$t('message.relations_table')}}</span>
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
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12 mb-2">
        <div class="d-flex align-items-center rounded top-bar px-1 py-2 justify-content-between" >
          <div class="d-flex align-items-center">
            <button class="btn btn--white me-2" style="color: var(--text-color);" @click="$router.back()">
              <i class="fas fa-chevron-left"> </i>
            </button>
            <span class="fs-3" style="color: var(--text-color);">{{$t('message.product_details')}}</span>
          </div>
          <div class="dropdown">
            <button class="btn btn-sm dropdown-toggle" style="color: black;background-color: var(--btnLight)!important;" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
              {{ $t('message.more_options') }}
            </button>
            <ul class="dropdown-menu " aria-labelledby="dropdownMenuButton1">
              <li class="dropdown-item" data-bs-toggle="modal" v-if="cashierAcc.editStatus==='yes'" data-bs-target="#discountModal">
                <i class="fas fa-tags me-2"> </i>{{$t('message.discount')}}
              </li>
              <router-link class="dropdown-item text-dark" v-if="cashierAcc.editStatus==='yes'" :to="{name:'ProductEdit', params:{product_id:product_id}}">
                <i class="fas fa-pen-to-square me-2"> </i> {{ $t('message.edit') }}
              </router-link>
              <li class="dropdown-item" data-bs-toggle="modal" data-bs-target="#stockModal">
                <i class="fas fa-square-plus me-2" > </i>{{ $t('message.add_stock') }}</li>
              <li class="dropdown-item" data-bs-toggle="modal" data-bs-target="#relationModal">
                <i class="fas fa-link me-2" > </i>{{ $t('message.add_relation') }}</li>
              <li class="dropdown-item" data-bs-toggle="modal" v-if="cashierAcc.editStatus==='yes'" data-bs-target="#wasteModal">
                <i class="fas fa-trash-can-arrow-up me-2" > </i>{{ $t('message.waste') }}</li>
              <!--                  <li class="dropdown-item" @click="showStockHistory">
                                  <i class="fas fa-clipboard-list me-2" > </i>Stock History</li>
                                <li class="dropdown-item"  @click="showSellHistory">
                                  <i class="fas fa-layer-group me-2"> </i>Sell History</li>-->
              <li class="dropdown-item text-danger" v-if="cashierAcc.editStatus==='yes'" @click="deleteProduct">
                <i class="fas fa-trash me-2" ></i>{{ $t('message.delete') }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="row content-box">
      <div class="col-12 col-lg-4">
        <div id="carouselExampleControls" class="carousel slide" style="border-radius: var(--border-radius);" data-bs-ride="carousel">
          <div id="carouselExampleIndicators" class="carousel slide mx-auto" data-bs-ride="carousel">
            <div class="carousel-indicators" v-if="currentProduct.images.length>0">
              <button type="button" v-for="(img,index) in currentProduct.images"  :key="index" data-bs-target="#carouselExampleIndicators" :data-bs-slide-to="index" :class="index===0?'active':''" :aria-current="index===0?true:false" ></button>
            </div>
            <div class="carousel-inner"  v-if="currentProduct.images.length>0" >
              <div class="carousel-item" style="width: 350px;" :class="index===0?'active':''" v-for="(img, index) in currentProduct.images" :key="index">
                <img :src="img" class="w-100" style="object-fit: cover; position: center;max-height: 50vh;">
              </div>
            </div>
            <div class="carousel-inner" v-else >
              <div class="carousel-item active" style="width: 350px;">
                <img src="../../assets/flash/1.png" class="w-100"  style="object-fit: cover;position: center;" alt="">
              </div>
            </div>
            <button class="carousel-control-prev" v-if="currentProduct.images.length>1" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
              <span class="bg-secondary rounded-circle p-1" style="width: 40px;height: 40px;" aria-hidden="true"><i class="fas fa-angle-left fa-2x"></i></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" v-if="currentProduct.images.length>1" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
              <span class="bg-secondary rounded-circle p-1" style="width: 40px;height: 40px;" aria-hidden="true"><i class="fas fa-angle-right fa-2x"></i></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
        </div>
        <div class="mt-2 border border-1" v-if="currentProduct.barcode!==''">
          <div class="py-2  d-flex flex-column justify-content-center" ref="printcontent" id="printcontent">
            <div class="w-75 text-center text-wrap" style="font-size: 12px">
              <span>{{ currentProduct.itemName}},  </span>
              <span class="ms-1"> {{currentProduct.sellPrice}} Ks</span>
            </div>
            <vue-barcode :value="currentProduct.barcode" tag="svg" :options="{ displayValue: true }"></vue-barcode>
          </div>
          <button class="btn btn-primary my-2 d-none" v-print="'#printcontent'" ><i class="fas fa-print"></i> print</button>
          <button class="btn btn-primary my-2 ms-2" @click="printThis"><i class="fas fa-save"></i> Save</button>

        </div>

      </div>
      <div class="col-12 col-lg-4">
        <div class="my-1 p-1 " style="background-color: var(--light);border-radius: var(--border-radius);">
          <div class="d-flex mb-2 justify-content-between">
            <span class="fs-4 text-end">{{currentProduct.itemName}}</span>
          </div>
          <div class="d-flex mb-2 justify-content-between">
            <span class="text-start">{{ $t('message.itemCode') }}</span>
            <span class=" text-end">{{currentProduct.itemCode}}</span>
          </div>
          <div class="d-flex mb-2 justify-content-between">
            <span>{{ $t('message.barcode') }}</span>
            <span class="">{{currentProduct.barcode}}</span>
          </div>
          <div class="d-flex mb-2 justify-content-between" v-if="currentProduct.discount!=='0'">
            <span>{{ $t('message.discount') }}</span>
            <span class="">{{currentProduct.discount}} %</span>
          </div>
          <div class="d-flex mb-2 justify-content-between">
            <span>{{ $t('message.stock') }}</span>
            <span class="text-primary">{{currentProduct.stock}}</span>
          </div>
        </div>
        <div class="row">
          <div class="col-6" v-if="cashierAcc?.accountLevel==='admin'">
            <div class="card p-1">
              <div class=" d-flex flex-column">
                <span class="text-warning">{{ $t('message.buy_price') }}</span>
                <span class="fs-6">{{currentProduct.buyPrice}} Ks</span>
              </div>
            </div>
          </div>
          <div class="col-6">
            <div class="card p-1">
              <div class=" d-flex flex-column">
                <span class="text-success">{{ $t('message.sellPrice') }}</span>
                <span class="fs-6" v-if="currentProduct.discount"> {{currentProduct.sellPrice-(currentProduct.sellPrice*(currentProduct.discount/100))}} Ks</span>
                <span class="fs-6" v-else>{{currentProduct.sellPrice}} Ks</span>
              </div>
            </div>
          </div>
        </div>
        <hr>

        <div class="col-12">
          <h4 class="my-2">{{ $t('message.other') }}</h4>
          <div class="d-flex p-1 justify-content-between border-1 border-bottom">
            <span>{{ $t('message.type') }}</span>
            <span>{{currentProduct.type}}</span>
          </div>
          <div class="d-flex p-1 justify-content-between border-1 border-bottom">
            <span>{{ $t('message.color') }}</span>
            <span>{{currentProduct.color}}</span>
          </div>
          <div class="d-flex p-1 justify-content-between border-1 border-bottom">
            <span>{{ $t('message.size') }}</span>
            <span>{{currentProduct.size}}</span>
          </div>
          <div class="d-flex p-1 justify-content-between border-1">
            <span>{{ $t('message.weight') }}</span>
            <span>{{currentProduct.weight}}</span>
          </div>
          <hr>
          <h3 class="my-2">{{ $t('message.description') }}</h3>
          <p>{{currentProduct.description}}</p>
        </div>
      </div>
      <div class="col-12 col-lg-4 ">
        <h5 class="my-2">{{ $t('message.product_history') }}</h5>
        <div class=" my-1">
          <select v-model="selectedHistoryType" @change="filterStockHistory" class="form-select mb-1">
            <option value="all">
              {{$t('message.all')}}
            </option>
            <option value="offlineSell">
              {{$t('message.in_shop_sell')}}
            </option>
            <option value="add">
              {{$t('message.first_added')}}
            </option>
            <option value="onlineSell">
              {{$t('message.online_sell')}}
            </option>
            <option value="liveSell">
              {{$t('message.live_sell')}}
            </option>
            <option value="infoUpdate">
              {{$t('message.info_update')}}
            </option>
            <option value="buyPrice">
              {{$t('message.buy_price')}}
            </option>
            <option value="sellPrice">
              {{$t('message.sell_price')}}
            </option>
            <option value="stockUpdate">
              {{ $t('message.stock_update')}}
            </option>
            <option value="waste">
              {{ $t('message.waste')}}
            </option>
            <option value="refund">
              {{ $t('message.refund')}}
            </option>
          </select>
        </div>

        <div class="stock-box mt-1" style="background-color: var(--light);border-radius: var(--border-radius);">
          <div class="p-1 mb-2" style="background-color: var(--background-color);!important;border-radius: var(--border-radius);" v-for="(history, index) in filterStockHistories" :key="index">
            <div class="p-1 d-flex justify-content-between">
              <!--                  <span>{{history.process}}</span>-->
              <span class="badge my-1 rounded bg-primary" v-if="history.process==='offlineSell'">
                    {{$t('message.in_shop_sell')}}
                  </span>
              <span class="badge my-1 rounded bg-primary" v-if="history.process==='add'">
                    {{$t('message.first_added')}}
                  </span>
              <span class="badge my-1 rounded bg-warning" v-else-if="history.process==='onlineSell'">
                    {{$t('message.online_sell')}}
                  </span>
              <span class="badge my-1 rounded bg-danger" v-else-if="history.process==='liveSell'">
                    {{$t('message.live_sell')}},
                  </span>
              <span class="badge my-1 rounded bg-success" v-else-if="history.process==='infoUpdate'">
                    {{$t('message.info_update')}}
                  </span>
              <span class="badge my-1 rounded bg-secondary" v-else-if="history.process==='buyPrice' || history.process==='sellPrice'">
                    {{ history.note}}
                  </span>
              <span class="badge my-1 rounded bg-dark" v-else-if="history.process==='stockUpdate'">
                    {{ $t('message.stock_update')}}
                  </span>
              <span class="badge my-1 rounded bg-danger" v-else-if="history.process==='waste'">
                    {{ $t('message.waste')}}
                  </span>
              <span class="badge my-1 rounded bg-warning" v-else-if="history.process==='refund'">
                    {{ $t('message.refund')}}
                  </span>
              <div v-if="history.image" @click="openImage(history)" >
                <img :src="history.image" class="border border-1 border-primary rounded p-1" width="40" height="40"/>
              </div>
            </div>
            <div class="d-flex justify-content-between">
              <span style="font-size: 12px;">{{history.dateTime}}</span>
              <div class="flex">

                <span class="fs-4 text-primary" v-if="history.process==='discountUpdate'">{{history.discount}} %</span>
                <span class="fs-4" v-if="history.count!=='0'" :class="history.count<0?'text-danger':'text-success'">{{history.count}}</span>
              </div>

            </div>
            <div v-if="history.process === 'received' || history.process === 'transfer' || history.process === 'refund'">
              <span>{{history.note}}</span>
            </div>
          </div>
        </div>

      </div>
    </div>

  </AdminSidebar>
</template>

<script>
//import "firebase/compat/storage";
import db, {storage,timestamp} from "@/config/FirebaseInit";
import Loading from "../../components/Loading";
import InfoDialog from "@/components/InfoDialog";
import ConfirmDialog from "@/components/ConfirmDialog";
//import firebase from "firebase/compat";

import AdminSidebar from "@/components/AdminSidebar";
import html2canvas from "html2canvas";
import ImageView from "@/components/ImageView";
export default {
  props:['product_id'],
  components:{ImageView, ConfirmDialog, InfoDialog, Loading, AdminSidebar},
  data(){
    return{
      infoModalActive:false,
      modalMessage:'',
      loadingActive:false,
      confirmActive:false,
      allSrc:[],
      previewImages:[],
      currentProduct:'',
      update_discount:'',
      update_stock:'',
      update_waste:'',
      update_waste_note:'',
      stockHistories:'',
      relations:[],
      frontNumber: '1',
      frontUnit: 'Pcs',
      selectedHistoryType:'all',
      imageViewActive:false,
      imageUrl:'',
      relation:{
        frontUnit:'',
        backUnit:'Pcs',
        frontNumber:1,
        backNumber:'',
        id:'',
        sellPrice:'',
      },
      selectedRelation:'',
      filterStockHistories:[],
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
    cashierAcc(){
      return this.$store.getters.getCashierAcc;
    },
    owner(){
      return this.$store.getters.getShopOwner;
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
    },


  },
  async created(){
    this.$store.dispatch("getDateTime");
    this.$store.dispatch("getDay");
    this.$store.dispatch("getMonth");
    this.$store.dispatch("getYear");
    this.$store.dispatch("getCashierAcc",this.owner);

    await db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(this.product_id).onSnapshot(snapshot => {
      this.currentProduct = snapshot.data();
      db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(this.product_id).collection('records').orderBy('time','desc').onSnapshot(snapshot => {
        this.stockHistories =[];
        snapshot.forEach(doc=>{
          this.stockHistories.push(doc.data());
        });
        this.filterStockHistories =  this.stockHistories;
      });
      db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(this.product_id).collection('relation').onSnapshot(snapshot=>{
        this.relations = [];
        snapshot.forEach(doc=>{
          this.relations.push(doc.data());

        });
        // console.log(this.relations)
      });

    })
  },
  methods:{
    openImage(history){
      this.imageUrl = history.image;
      this.imageViewActive = true;
    },
    selectImage() {
      this.$refs.photo.click()
    },
    clearFile() {
      this.previewImages = [];
      this.allSrc = [];
      console.log('clear all src', this.allSrc)

    },
    pickFile(e) {
      // let input = this.$refs.fileInput
      const files = e.target.files;
      if (files) {
        this.allSrc.push(files[0]);
        let reader = new FileReader
        reader.onload = e => {
          this.previewImages.push(e.target.result);
        }
        reader.readAsDataURL(files[0])
        this.$emit('input', files[0])
        // for (let i = 0; i < files.length; i++) {
        //
        // }

      }
      console.log('allsrc', this.allSrc)
    },
    filterStockHistory(){
      this.filterStockHistories =[];
      if(this.selectedHistoryType !== 'all'){
        for(let i =0; i<this.stockHistories.length;i++){
          console.log(this.stockHistories[i].process)
          if(this.selectedHistoryType === this.stockHistories[i].process){
            this.filterStockHistories.push(this.stockHistories[i])
          }
        }
      }else {
        this.filterStockHistories =  this.stockHistories;
      }
    },
    getSelectedRelation(){
      let selected = '';

      selected = this.relations.filter(relation => {
        return relation.frontUnit === this.frontUnit.toString();
      });
      this.selectedRelation = selected[0];
    },
    deleteProduct(){
      this.confirmActive = true;
      this.modalMessage=this.$t('message.product_delete_warning')
    },
    async confirm(){
      this.confirmActive = !this.confirmActive;
      const storageRef = await storage.ref();
      const fileRef = storageRef.child(`/${this.owner.city}/${this.owner.shopId}/products/${this.product_id}`);
      if(this.currentProduct.images.length>0){
        this.loadingActive = true;
        console.log('relations deleted');
        fileRef.listAll()
            .then((dir) => {
              dir.items.forEach(fileRef => {
                fileRef.delete();
              });
            })
            .catch((err) => {
              this.loadingActive = false
              console.log(err);
            }).then(()=>{
              this.deleteDoc();
          console.log('img deleted')
        })
      }else {
        await this.deleteDoc();
      }

    },
    async deleteDoc(){
      await db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(this.product_id).collection('records').get().then(snapshot => {
        snapshot.forEach(doc => {
          doc.ref.delete();
        });
      })
      console.log('records deleted')
      await db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(this.product_id).collection('relation').get().then(snapshot=>{
        if(snapshot.size>0){
          snapshot.forEach(doc=>{
            doc.ref.delete();
          })
        }
      })
      await db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(this.product_id).delete();
      this.loadingActive = false;
      this.$router.back();


    },
    cancel(){
      this.confirmActive = !this.confirmActive;
    },
    closeModal(){
      this.infoModalActive = !this.infoModalActive;
    },
    closeImageModal(){
      this.imageViewActive = !this.imageViewActive;
    },
    async updateStock(){
      this.loadingActive = true;
      let newStock =0;
      let count =0;

      if(this.frontNumber!==''){
        if(this.frontUnit!=='Pcs'){
          count = (parseInt(this.selectedRelation.backNumber) * parseInt(this.frontNumber))
          newStock = parseInt(this.currentProduct.stock) + (parseInt(this.selectedRelation.backNumber) * parseInt(this.frontNumber));
        }else {
          count = this.frontNumber;
          if(this.currentProduct.stock ===''){
            newStock = parseInt(this.frontNumber);
          }else {
            newStock = parseInt(this.currentProduct.stock)+parseInt(this.frontNumber);
          }
        }
        // this.loadingActive = true;
        // this.loadingActive = true;
        await db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(this.product_id).update(
            {
              'stock':newStock.toString()
            }
        );
        const recordRef =await db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(this.product_id).collection('records');
        await recordRef.add(
            {
              'id': this.currentProduct.id,
              'recordId': recordRef.id,
              'itemCode': this.currentProduct.itemCode,
              'barcode': this.currentProduct.barcode,
              'itemName': this.currentProduct.itemName,
              'buyPrice': this.currentProduct.buyPrice,
              'sellPrice': this.currentProduct.sellPrice,
              'stock': this.currentProduct.stock.toString(),
              'description': this.currentProduct.description,
              'type': this.currentProduct.type,
              'color': this.currentProduct.color,
              'size': this.currentProduct.size,
              'weight': this.currentProduct.weight,
              'time': timestamp,
              'day': this.currentDay,
              'month': this.currentMonth,
              'year': this.currentYear,
              'dateTime': this.currentDateTime,
              'rating': this.currentProduct.rating,
              'discount': this.currentProduct.discount,
              'note': 'default',
              'process': 'stockUpdate',
              'count': count.toString()
            }
        );
        this.loadingActive=false;
        /*then(()=>{
          this.loadingActive=false;
          this.modalMessage = 'Updated Successfully!'
          this.infoModalActive = true;
        })*/
      }else {
        // this.loadingActive = false;
        this.modalMessage = "Please fill stock!";
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
        await db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(this.product_id).update(
            {
              'discount':this.update_discount.toString()
            }
        ).then(()=>{
          const recordRef = db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(this.product_id).collection('records');
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
                'note':'default',
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
        this.$store.dispatch("getDateTime");    ` `
        this.$store.dispatch("getDay");
        this.$store.dispatch("getMonth");
        this.$store.dispatch("getYear");
        this.loadingActive = true;
        let newStock = parseInt(this.currentProduct.stock)-this.update_waste;
        this.loadingActive = true;

        await db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(this.product_id).update(
            {
              'stock':newStock.toString()
            }
        ).then(()=>{
          const recordRef = db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(this.product_id).collection('records').doc();
          if (this.allSrc.length > 0) {
            this.loadingActive = true;
            const storageRef = storage.ref();
            const imgRef = storageRef.child(`/${this.owner.city}/${this.owner.shopId}/products/${this.product_id}/waste/${recordRef.id}`)
            imgRef.put(this.allSrc[0]).on("state_changed", () => {
            }, error => {
              console.log(error)
            }, async () => {
              const img_src = await imgRef.getDownloadURL();
              recordRef.set(
                  {
                    'id':this.currentProduct.id,
                    'recordId':recordRef.id,
                    'image':img_src,
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
          } else {
            recordRef.set(
                {
                  'id':this.currentProduct.id,
                  'recordId':recordRef.id,
                  'image':'',
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
          }

        })
      }else {
        this.loadingActive = false;
        this.modalMessage = "Please fill stock!"
        this.infoModalActive = true;
      }
    },
    async updateRelationTable(){
      if(this.relation.frontUnit!=='' && this.relation.backNumber!=='' && this.relation.sellPrice!==''){
        const relationRef = await  db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(this.product_id).collection('relation').doc();
        await relationRef.set({
          'frontUnit': this.relation.frontUnit.toString(),
          'backUnit': this.relation.backUnit,
          'frontNumber': this.relation.frontNumber.toString(),
          'backNumber': this.relation.backNumber.toString(),
          'id': relationRef.id,
          'sellPrice': this.relation.sellPrice.toString(),
        })
        this.relation.frontUnit = '';
        this.relation.backNumber ='';
        this.relation.sellPrice ='';
      }else {
        this.infoModalActive = true;
        this.modalMessage="Please fill all fields";
      }


    },
    async deleteRelation(relation){
      await db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(this.product_id).collection('relation').doc(relation.id).delete().then(()=>{
        console.log('deleted')
      })
    },
    async showSellHistory(){

    },
    async showStockHistory(){

    },
    async printThis() {
      console.log("printing..");
      const el = this.$refs.printcontent;

      const options = {
        type: "dataURL",
      };
      const printCanvas = await html2canvas(el, options);

      const link = document.createElement("a");
      link.setAttribute('download', `${this.currentProduct.itemName}.png`);
      link.setAttribute(
          "href",
          printCanvas
              .toDataURL("image/png")
              .replace("image/png", "image/octet-stream")
      );
      link.click();

      console.log("done");
    },

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
  width:92%;
}
.modal-content{
  color: var(--text-color);
}
.btn--white{
  color: var(--text-color);
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
  width: 30%;
  padding:10px;
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