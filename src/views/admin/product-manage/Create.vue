<template>
  <AdminNavigation>
    <Loading v-if="loadingActive"/>
    <InfoDialog v-if="infoModalActive" :modal-message="modalMessage" v-on:close-modal="closeModal"/>
    <confirm-dialog :modal-message="modalMessage" v-if="confirmActive" v-on:confirm="confirm" v-on:cancel="cancel"/>
    <div class="container-fluid" style="background-color: var(--background-color); color: var(--text-color) !important;">
      <div class="row">
        <div class="col-8 mx-auto">
          <div class="d-flex my-5 align-items-center">
            <button class="btn fs-5" @click="$router.back()"><i class="fas fa-chevron-left"></i> {{owner.name}}</button>
          </div>

          <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered border-0">
              <div class="modal-content border-0 " style="border-radius:var(--border-radius);background-color: var(--background-color);color: var(--text-color);">
                <div class="modal-header border-0">
                  <h5 class="modal-title" id="exampleModalLabel">{{ $t('message.create_category') }}</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <label for="" class="form-label">{{ $t('message.category_name') }}</label>
                  <input type="text" v-model="categoryName" class="form-control" required>
                </div>
                <div class="modal-footer border-0">
                  <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="createNewCategory">{{ $t('message.confirm') }}</button>
                </div>
              </div>
            </div>
          </div>

          <form class="form" @keydown.prevent.stop.enter @submit.prevent="upload">
            <div class="p-1 mb-2" style="background-color: var(--light);border-radius: var(--border-radius); width: 100%;" v-if="shopInfo.packageStatus !=='basic'">
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
                <input type="file" @change="pickFile" hidden   accept="image/*" id="img-input" multiple class="form-control mb-3" ref="photo" placeholder="photo">
                <!--            <input type="file" @change="onChangePhotoInput"   accept="image/*" id="img-input" multiple class="form-control mb-3" ref="photo" placeholder="photo">-->
              </div>
            </div>

            <div class="row">
              <div class="col-12 col-lg-6 col-md-6">
                <div class="d-flex">
                  <div class="form-floating mb-3" aria-autocomplete="none" style="width: 90%;">
                    <input type="text" required @keydown.prevent.stop.enter  class="form-control" v-model="product.barcode" id="barcode-input" autocomplete="off" placeholder="enter shop name">
                    <label for="barcode-input">{{ $t('message.barcode') }}</label>
                  </div>
                  <button class="btn btn-sm ms-1"   @click.prevent="generateBarcode" style="width: 55px; height: 55px; background-color: var(--btnLight);"><i class="fas fa-barcode"></i></button>
                </div>
              </div>
              <div class="col-12 col-lg-6 col-md-6">
                <div class="form-floating mb-3">
                  <input type="text" required class="form-control" v-model="product.itemName" id="name-input" placeholder="enter shop name">
                  <label for="name-input">{{$t('message.itemName')}}</label>
                </div>

              </div>
            </div>
            <div class="row">
              <div class="col-12 col-lg-6 col-md-6"><div class="form-floating mb-3">
                <input type="number" min="0" required class="form-control" v-model="product.buyPrice" id="buy-price-input" placeholder="enter shop name">
                <label for="buy-price-input">{{ $t('message.buy_price') }}</label>
              </div></div>
              <div class="col-12 col-lg-6 col-md-6"> <div class="form-floating mb-3">
                <input type="number" min="0" required class="form-control" v-model="product.sellPrice" id="sell-price-input" placeholder="enter shop sell price">
                <label for="sell-price-input">{{$t('message.sell_price')}}</label>
              </div></div>
            </div>
            <div class="row">
              <div class="col-12 col-lg-6 col-md-6">
                <div class="form-floating mt-3">
                  <input type="number" class="form-control" v-model="product.stock" id="stock-input" placeholder="enter stock">
                  <label for="stock-input">{{ $t('message.stock') }} (optional)</label>
                </div>
              </div>
              <div class="col-12 col-lg-6 col-md-6 mb-3">
                <label>{{ $t('message.category') }}</label>
                <div class="d-flex align-items-center">
                  <div class="w-75">
                    <select required class="form-select fs-6 form-control form-select-lg rounded" style="height:50px;border-radius: var(--border-radius) !important;"  v-model="product.type" aria-label=".form-select-sm example">
                      <option selected disabled>Choose Category</option>
                      <option :value="type.name" v-for="type in product_types" :key="type.id">{{ type.name }}</option>
                    </select>
                  </div>
                  <button class="btn ms-3" style="background-color: var(--btnLight);" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class="fas fa-circle-plus"></i></button>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12 col-lg-6 col-md-6">
                <div class="form-floating">
                  <input type="text"  class="form-control" v-model="product.color" id="color-input" placeholder="enter color">
                  <label for="color-input">{{ $t('message.color') }} (Optional)</label>
                </div>
              </div>
              <div class="col-12 col-lg-6 col-md-6"> <div class="form-floating mb-3">
                <input type="text" required class="form-control" v-model="product.size" id="size-input" placeholder="enter size">
                <label for="size-input">{{ $t('message.size') }} (Optional)</label>
              </div></div>
            </div>
            <div class="row mb-5">
              <div class="col-12 col-lg-6 col-md-6"><div class="form-floating mb-3">
                <input type="text" class="form-control" v-model="product.weight" id="weight-input" placeholder="enter weight">
                <label for="weight-input">{{ $t('message.size') }} (optional)</label>
              </div>
              </div>
              <div class="col-12 col-lg-6 col-md-6">
                <div class="form-floating mb-3">
                  <input type="date" class="form-control" v-model="product.expireDate" id="name-input" placeholder="enter youtube link">
                  <label for="name-input">{{ $t('message.expire_date') }} (optional)</label>
                </div>
              </div>
              <div class="col-12 col-lg-6 col-md-6">
                <div class="form-floating mb-3">
                  <input type="text" class="form-control" v-model="product.youtubeLink" id="name-input" placeholder="enter youtube link">
                  <label for="name-input">Youtube Link (Optional)</label>
                </div>
              </div>


              <div class="col-12">
                <textarea type="text" rows="5" cols="10" class="form-control" v-model="product.description" id="description-input" :placeholder="$t('message.description') +'(Optional)'"></textarea>

              </div>
            </div>
            <div class="position-sticky shadow-sm bottom-0 mt-5" style="background-color: var(--background-color);">
              <button type="submit" class="btn w-100 my-2 text-white mx-auto" style="background-color: var(--primary);">{{$t('message.confirm')}}</button>

            </div>


          </form>
        </div>
      </div>
    </div>
  </AdminNavigation>


</template>

<script>
import db,{storage,timestamp} from "@/config/FirebaseInit";
import Loading from "@/components/Loading";
import InfoDialog from "@/components/InfoDialog";
import ConfirmDialog from "@/components/ConfirmDialog";
import AdminNavigation from "@/components/AdminNavigation";
export default {
  components:{ConfirmDialog, InfoDialog, Loading, AdminNavigation},
  data(){
    return{
      infoModalActive:false,
      modalMessage:'',
      confirmActive:false,
      loadingActive:false,
      allSrc:[],
      product_types:[],
      categoryName:'',
      previewImages:[],
      owner:'',
      productRef:'',
      product:{
        barcode: "",
        buyPrice: "",
        color: "All",
        youtubeLink:'',
        time: "",
        day: "",
        description: "",
        discount: "0",
        expireDate:"",
        id: "",
        images:[],
        itemCode: "",
        itemName: "",
        month: "",
        dateTime:"",
        rating: "",
        sellPrice: "",
        size: "Free",
        stock: "",
        type: "",
        weight: "",
        year: ""
      },
    }

  },
  computed:{
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
    shopInfo(){
      return this.$store.getters.getShopInfo;
    }

  },
  async mounted() {
    this.$store.dispatch("getDateTime");
    this.$store.dispatch("getDay");
    this.$store.dispatch("getMonth");
    this.$store.dispatch("getYear");
    await db.collection('shopRegistration').doc(this.$route.params.shop_id).onSnapshot((result)=>{
      this.owner = result.data();
      console.log(this.owner)
      this.$store.dispatch('getShopInfo', this.owner)
      db.collection(this.owner.city).doc(this.owner.shopId).collection('category').onSnapshot(snapshot => {
        this.product_types=[];
        snapshot.forEach(doc=>{
          this.product_types.push(doc.data());
        });
      });
      this.productRef = db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc();

    });

  },
  methods:{
    clearFile(){
      this.previewImages=[];
      this.allSrc =[];
      console.log('clear all src',this.allSrc)

    },
    pickFile(e) {
      // let input = this.$refs.fileInput
      const files = e.target.files;
      if (files) {
        for (let i = 0; i < files.length; i++) {
          this.allSrc.push(files[i]);
          let reader = new FileReader
          reader.onload = e => {
            this.previewImages.push(e.target.result);
          }
          reader.readAsDataURL(files[i])
          this.$emit('input', files[i])
        }
      }
      console.log('allsrc',this.allSrc)
    },
    selectImage () {
      this.$refs.photo.click()
    },
    async createNewCategory(){
      let cateRef =await db.collection(this.owner.city).doc(this.owner.shopId).collection('category').doc();
      await cateRef.set({
        name:this.categoryName,
        id:cateRef.id,
        url:"default",
      }).then(()=>{
        console.log('category added')
      });
    },
    closeModal(){
      this.infoModalActive = !this.infoModalActive;
    },
    cancel(){
      this.confirmActive = !this.confirmActive;
    },
    confirm(){
      this.confirmActive = !this.confirmActive;
    },
    onChangePhotoInput(e) {
      const files = e.target.files;
      for (let i = 0; i < files.length; i++) {
        this.allSrc.push(files[i])
      }
    },
    getRandomStr(){
      const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let result = '';
      for ( let i = 0; i < 8; i++ ) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    },
    generateBarcode(){
      this.product.barcode = this.shopInfo.shopCode+this.getRandomStr();
    },
    formatDate(payload){
      if(payload!==''){
        let date = new Date(payload);
        let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
        let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
        let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
        return day+"-"+month+"-"+year;
      }else {
        return "";
      }
    },
    async upload() {
      //TODO: to check when user does not select files
      const product_id = this.productRef.id;
      if (this.allSrc.length > 0) {
        this.loadingActive = true;
        const storageRef = await storage.ref();
        this.allSrc.forEach((img, index) => {
          const imgRef = storageRef.child(`/${this.owner.city}/${this.owner.shopId}/products/${product_id}/${index+product_id}`)
          imgRef.put(img).on("state_changed", () => {
          },error => {
            console.log(error)
          },async ()=>{
            const img_src = await imgRef.getDownloadURL();
            this.product.images.push(img_src);
            if(this.allSrc.length===this.product.images.length) {
              await this.uploadDoc()
            }
          })
        })
      }else {
        await this.uploadDoc()
      }

    },

    async uploadDoc(){
      let count;
      this.product.id = this.productRef.id;
      this.product.itemCode=this.owner.shopCode+this.getRandomStr();
      //TODO: check again the expire date filled or not
      if(this.product.expireDate!==''){
        this.product.expireDate = this.formatDate(this.product.expireDate);
      }else {
        this.product.expireDate ='';
      }
      this.product.month=this.currentMonth;
      this.product.day = this.currentDay;
      this.product.dateTime = this.currentDateTime;
      this.product.year = this.currentYear;
      this.product.time = timestamp;

      this.product.buyPrice = this.product.buyPrice.toString();
      this.product.sellPrice = this.product.sellPrice.toString();
      this.product.stock = this.product.stock.toString();
      this.product.discount = this.product.discount.toString();
      this.product.weight = this.product.weight.toString();
      this.product.size = this.product.size.toString();
      this.product.color = this.product.color.toString();
      if(this.product.youtubeLink!==''){
        this.product.youtubeLink = this.product.youtubeLink.split('be/')[1];
      }else {
        this.product.youtubeLink = "";
      }
      if(this.product.buyPrice === ''){
        this.product.buyPrice = "0"
      }
      if(this.product.sellPrice===''){
        this.product.sellPrice = "0"
      }
      this.productRef.set(this.product).then(() => {
        console.log('product added')
      }).catch(error => {
        // this.loadingActive = false;
        console.log(error)
      });
      if(this.product.stock===''){
        count = '0'
      }else {
        count = this.product.stock.toString();
      }
      const recordRef = this.productRef.collection("records").doc();
      recordRef.set({
        'id': this.product.id,
        'recordId': recordRef.id,
        'itemCode': this.product.itemCode,
        'barcode': this.product.barcode,
        'itemName': this.product.itemName,
        'buyPrice': this.product.buyPrice,
        'sellPrice': this.product.sellPrice,
        'stock': this.product.stock.toString(),
        'description': this.product.description,
        'type': this.product.type,
        'color': this.product.color,
        'size': this.product.size,
        'weight': this.product.weight,
        'time': this.product.time,
        'day': this.product.day,
        'month': this.product.month,
        'dateTime':this.product.dateTime,
        'year': this.product.year,
        'rating': this.product.rating,
        'discount': this.product.discount,
        'note': 'default',
        'process': 'add',
        'count': count,
      }).then(()=>{
        console.log('record added')
      })
      // this.product={};
      this.imgRef=[];
      this.loadingActive = false;
      // this.modalMessage = "Upload Success!";
      // this.infoModalActive = true;
      this.allSrc = [];
      /*this.product.barcode="";
      this.product.buyPrice="";
      this.product.color="All";
      this.product.time="";
      this.product.day="";
      this.product.description="";
      this.product.discount="0";
      this.product.id="";
      this.product.images=[];
      this.product.itemCode="";
      this.product.itemName="";
      this.product.youtubeLink="";
      this.product.month="";
      this.product.dateTime="";
      this.product.rating="";
      this.product.sellPrice="";
      this.product.size="Free";
      this.product.stock="";
      this.product.type="";
      this.product.weight="";
      this.product.year="";
      this.$refs.photo.value = null;*/
      this.$router.back();
    },


  }
}
</script>
<style>

</style>
<style scoped>

@media only screen and (max-width: 1030px) {

  .content-box {
    margin-top: 50px;
  }
}
</style>