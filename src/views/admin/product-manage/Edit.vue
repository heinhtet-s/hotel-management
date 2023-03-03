<template>
  <AdminNavigation>
    <Loading v-if="loadingActive"/>
    <InfoDialog v-if="infoModalActive" :modal-message="modalMessage" v-on:close-modal="closeModal"/>
    <confirm-dialog :modal-message="modalMessage" v-if="confirmActive" v-on:confirm="confirm" v-on:cancel="cancel"/>

    <div class="container-fluid" style="background-color: var(--background-color);">
      <div class="row mt-3">
        <div class="col-12 col-lg-6 mt-5 mx-auto" style="background-color: var(--background-color);color: var(--text-color);">
          <div class="d-flex rounded align-items-center mb-2">
            <button @click="$router.back()" class="btn me-1" style="color: var(--text-color);"><i class="fas fa-chevron-left"> </i></button>
            <span class="fs-4">{{ $t('message.edit') }}</span>
          </div>
          <form @keydown.prevent.stop.enter @submit.prevent="upload">
            <div class="p-1" v-if="previewImages.length>0" style="background-color: var(--light);border-radius: var(--border-radius); width: 100%;">
              <div class="btn btn-sm bg-danger text-white float-end" @click="previewImages=[];">Clear</div>
              <div class="d-flex pb-3" style="background-color: var(--light);overflow-x: scroll; width: 100%;">
                <div class="rounded p-1 m-1" style="background-color: var(--light);" v-for="(previewImage,index) in previewImages" :key="index">
                  <img :src="previewImage" width="100" height="100"  @click="selectImage" alt="">
                </div>
              </div>
            </div>
            <div class="p-1" v-else style="background-color: var(--light);border-radius: var(--border-radius); width: 100%;">
              <div class="btn btn-sm bg-danger float-end text-white" @click="product.images=''">Clear</div>
              <div class="d-flex pb-3" v-if="product.images!==[]" style="background-color: var(--light);overflow-x: scroll; width: 100%;">
                <div class="rounded p-1 m-1" v-for="(imgUrl,index) in product.images" :key="index" style="background-color: var(--light);">
                  <img :src="imgUrl" width="100" height="100" alt="">
                </div>
              </div>
              <div class="d-flex pb-3" v-else style="background-color: var(--light);overflow-x: scroll; width: 100%;">
                <div class="rounded p-1 m-1" style="background-color: var(--light);">
                  <img src="../../../assets/flash/1.png" width="100" height="100" alt="">
                </div>
              </div>
            </div>

            <div class="col-12 my-2" v-if="shopInfo.packageStatus!=='basic'">
              <!--            <label class="form-label mt-1">Edit Photos:</label>-->
              <div class="btn btn-sm" @click="selectImage" style="background-color: var(--light);">
                <i class="fas fa-file-arrow-up"></i> Upload Photo
              </div>
              <input type="file"  ref="fileInput" @change="pickFile" multiple accept="image/*" id="img-input" class="form-control d-none">
            </div>

            <div class="row">
              <div class="col-12 col-lg-6 col-md-6">
                <div class="d-flex align-items-center" style="background-color: var(--light);border-radius: var(--border-radius);">
                  <div class="form-floating w-75">
                    <input type="text" required @keydown.prevent.stop.enter class="form-control" autocomplete="off" v-model="product.barcode" id="barcode-input" placeholder="enter shop name">
                    <label for="barcode-input">{{ $t('message.barcode') }}</label>
                  </div>
                  <button class="btn ms-2" @click.prevent="generateBarcode" style="background-color: var(--btnLight);"><i class="fas fa-barcode"></i></button>
                </div>
              </div>
              <div class="col-12 col-lg-6 col-md-6">
                <div class="form-floating mb-3">
                  <input type="text" required class="form-control" @keydown.prevent.stop.enter v-model="product.itemName" id="name-input" placeholder="enter shop name">
                  <label for="name-input">{{$t('message.itemName')}}</label>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12 col-lg-6 col-md-6"><div class="form-floating mb-3">
                <input type="number" required class="form-control" v-model="product.buyPrice" id="buy-price-input" placeholder="enter shop name">
                <label for="buy-price-input">{{ $t('message.buy_price') }}</label>
              </div></div>
              <div class="col-12 col-lg-6 col-md-6"> <div class="form-floating mb-3">
                <input type="number" required class="form-control" v-model="product.sellPrice" id="sell-price-input" placeholder="enter shop sell price">
                <label for="sell-price-input">{{ $t('message.sell_price') }}</label>
              </div></div>
            </div>
            <div class="row">
              <div class="col-12 col-lg-6 col-md-6"><div class="form-floating mt-3">
                <input type="number" class="form-control" v-model="product.stock" id="stock-input" placeholder="enter stock">
                <label for="stock-input">{{ $t('message.stock') }} (Optional)</label>
              </div></div>
              <div class="col-12 col-lg-6 col-md-6 mb-3">
                <label>Category:</label>
                <select class="form-select fs-6 form-control form-select-lg bg-transparent rounded" required style="height: 50px"  v-model="product.type" aria-label=".form-select-sm example">
                  <option selected disabled>{{ $t('message.category') }}</option>
                  <option :value="type.name" v-for="type in product_types" :key="type.id">{{ type.name }}</option>
                </select>
              </div>

            </div>
            <div class="row">
              <div class="col-12 col-lg-6 col-md-6">
                <div class="form-floating mb-3">
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
                <label for="weight-input">{{ $t('message.weight') }} (optional)</label>
              </div></div>
              <div class="col-12 col-lg-6 col-md-6">
                <div class="form-floating mb-3">
                  <input type="date" class="form-control" v-model="product.expireDate" id="date-input" placeholder="enter expire date">
                  <label for="date-input" v-if="product">{{ $t('message.expire_date') }}: {{product.expireDate}}</label>
                </div>
              </div>
              <div class="col12">
                <span v-if="product.youtubeLink"><span class="text-danger"><i class="fab fa-youtube"></i></span>https://youtu.be/{{product.youtubeLink}}</span>
                <div class="form-floating mb-3">
                  <input type="text" class="form-control" v-model="youtubeLink" id="youtube-input" placeholder="enter youtube link">
                  <label for="youtube-input" class="text-black-50">Youtube Link (Optional)</label>
                </div>
              </div>
              <div class="col-12">
                <textarea type="text" rows="5" cols="10" class="form-control" v-model="product.description" id="description-input" :placeholder="$t('message.description') +'(optional)'"></textarea>
              </div>
            </div>
            <div class="row position-sticky shadow-sm" style="bottom: 1px; background-color: var(--background-color);">
              <button type="submit" class="btn mx-auto w-50 my-2 text-white" style="background-color: var(--primary);">
                {{ $t('message.confirm') }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AdminNavigation>


</template>

<script>
// import firebase from "firebase/compat/app";
// import "firebase/compat/storage";
import db, {storage,timestamp} from "@/config/FirebaseInit";
import Loading from "@/components/Loading";
import InfoDialog from "@/components/InfoDialog";
import ConfirmDialog from "@/components/ConfirmDialog";
import AdminNavigation from "@/components/AdminNavigation";
export default {
  name:"Edit",
  components:{ConfirmDialog, InfoDialog, Loading, AdminNavigation},
  data(){
    return{
      confirmStatus:'',
      removedIndex:'',
      infoModalActive:false,
      confirmActive:false,
      modalMessage:'',
      loadingActive:false,
      allSrc:[],
      product_types:[],
      updateProduct:'',
      product:'',
      youtubeLink: '',
      originalStock:'',
      originalSellPrice:'',
      originalBuyPrice:'',
      previewImages:[],
      owner:'',

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
  async mounted(){
    this.$store.dispatch("getCurrentShop");

    await db.collection('shopRegistration').doc(this.$route.params.shop_id).get().then(async(result)=> {
      this.owner = await result.data();
      console.log('owner', this.owner);
      await db.collection(this.owner.city).doc(this.owner.shopId).collection('category').onSnapshot(snapshot => {
        snapshot.forEach(doc=>{
          this.product_types.push(doc.data());
        });
      });

      await db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(this.$route.params.product_id).get().then(snapshot => {
        let tempProduct = snapshot.data();
        this.originalBuyPrice = snapshot.data().buyPrice;
        this.originalStock = snapshot.data().stock;
        this.originalSellPrice = snapshot.data().sellPrice;
        console.log(this.originalStock)
        if(tempProduct.youtubeLink === undefined){
          db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(tempProduct.id).update({
            'youtubeLink':'',
          }).then(()=>{
            db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(this.$route.params.product_id).get().then(snapshot => {
              this.product = snapshot.data();
            }).then(()=>{
              console.log('update youtube link')
            })
          })
        }else {
          this.product = tempProduct;
        }
        console.info('product', this.product)

      })
    })

  },
  methods:{
    onChangePhotoInput(e) {
      const files = e.target.files;
      for (let i = 0; i < files.length; i++) {
        this.allSrc.push(files[i])
      }
    },
    selectImage () {
      this.$refs.fileInput.click()
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
      console.log(this.allSrc)
    },
    closeModal(){
      this.infoModalActive = !this.infoModalActive;
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
    async confirm(){
      this.loadingActive = true;
      const storageRef = await storage.ref();
      this.confirmActive = false;
      this.$store.dispatch("getDateTime");
      this.$store.dispatch("getDay");
      this.$store.dispatch("getMonth");
      this.$store.dispatch("getYear");
      if(this.youtubeLink!==''){
        this.youtubeLink = this.youtubeLink.split('be/')[1];
      }else {
        this.youtubeLink = this.product.youtubeLink;
      }
      let expDate = '';
      console.log(this.product.expireDate);

      if(this.product.expireDate!==undefined){
        if(this.product.expireDate!==''){
          expDate =this.formatDate(this.product.expireDate)
        }else {
          expDate = '';
        }
      }
      if(this.product.buyPrice === ''){
        this.product.buyPrice = "0"
      }
      if(this.product.sellPrice===''){
        this.product.sellPrice = "0"
      }
      this.updateProduct={
        'barcode': this.product.barcode,
        'buyPrice': this.product.buyPrice.toString(),
        'color': this.product.color.toString(),
        'time': this.product.time,
        'day': this.product.day,
        'description': this.product.description.toString(),
        'discount': this.product.discount.toString(),
        'id': this.product.id,
        'images':this.product.images,
        'itemCode': this.product.itemCode,
        'itemName': this.product.itemName,
        'month': this.product.month,
        'rating': this.product.rating,
        'expireDate':expDate,
        'sellPrice': this.product.sellPrice.toString(),
        'size': this.product.size.toString(),
        'stock': this.product.stock.toString(),
        'type': this.product.type,
        'weight': this.product.weight.toString(),
        'year': this.product.year,
        'youtubeLink':this.youtubeLink,
      };
      console.log(this.product.images)
      console.log(this.updateProduct)
      if(this.allSrc.length>0){
        this.updateProduct.images = [];
        console.log(this.updateProduct)
        const fileRef = await storageRef.child(`/${this.owner.city}/${this.owner.shopId}/products/${this.$route.params.product_id}`);
        await fileRef.listAll()
            .then((dir) => {
              dir.items.forEach(fileRef=> {
                fileRef.delete()
              });
              console.log("image cleared");
            })
            .catch((err) => {
              this.loadingActive = false
              console.log(err);
            });
        for(let i = 0; i<this.allSrc.length; i++){
          const imgRef = storageRef.child(`/${this.owner.city}/${this.owner.shopId}/products/${this.$route.params.product_id}/${i+this.$route.params.product_id}`)
          imgRef.put(this.allSrc[i]).on("state_changed", () => {
            console.log('image uploaded, ',i);
          },error => {
            this.loadingActive = false;
            console.log(error)
          },async ()=> {
            const img_src = await imgRef.getDownloadURL();
            this.updateProduct.images.push(img_src);
            if(i+1 ===this.allSrc.length) {
              await db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(this.$route.params.product_id).update(this.updateProduct).then(()=> {
              }).then(()=>{
                this.addRecord();
              })

            }

          })
        }

      }else{
        this.updateProduct.images = this.product.images;
        //TODO: to check stock update or not in info update
        await db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(this.$route.params.product_id).update(this.updateProduct).then(()=>{
          /* const recordRef = db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(this.$route.params.product_id).collection('records').doc();
           recordRef.set({
             'id':this.updateProduct.id,
             'recordId':recordRef.id,
             'itemCode':this.updateProduct.itemCode,
             'barcode':this.updateProduct.barcode,
             'itemName':this.updateProduct.itemName,
             'buyPrice':this.updateProduct.buyPrice,
             'sellPrice':this.updateProduct.sellPrice,
             'stock':this.updateProduct.stock.toString(),
             'description':this.updateProduct.description,
             'type':this.updateProduct.type,
             'color':this.updateProduct.color,
             'size':this.updateProduct.size.toString(),
             'weight':this.updateProduct.weight.toString(),
             'time':timestamp,
             'day':this.currentDay,
             'month':this.currentMonth,
             'year':this.currentYear,
             'expireDate':this.updateProduct.expireDate,
             'youtubeLink':this.updateProduct.youtubeLink,
             'dateTime':this.currentDateTime,
             'rating':this.updateProduct.rating,
             'discount':this.updateProduct.discount,
             'note':'default',
             'process': 'infoUpdate',
             'count':'0'
           }).then(()=>{
             this.loadingActive = false;
             this.infoModalActive = true;
             this.modalMessage = 'Updated Successfully!';
             this.$router.push({name:'ProductDetail', params:{product_id:this.product.id}})
           }).catch(err=>{
             this.loadingActive = false;
             console.log(err)
           })*/
          this.addRecord();
        }).catch(err=>{
          this.loadingActive = false;
          console.log(err.message)
        });
      }
    },
    async addRecord(){
      const recordRef = await db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(this.$route.params.product_id).collection('records').doc();
      await recordRef.set({
        'id':this.updateProduct.id,
        'recordId':recordRef.id,
        'itemCode':this.updateProduct.itemCode,
        'barcode':this.updateProduct.barcode,
        'itemName':this.updateProduct.itemName,
        'buyPrice':this.updateProduct.buyPrice,
        'sellPrice':this.updateProduct.sellPrice,
        'stock':""+this.updateProduct.stock,
        'description':this.updateProduct.description,
        'type':this.updateProduct.type,
        'color':this.updateProduct.color,
        'size':this.updateProduct.size.toString(),
        'weight':this.updateProduct.weight.toString(),
        'time':timestamp,
        'day':this.currentDay,
        'month':this.currentMonth,
        'year':this.currentYear,
        'expireDate':this.updateProduct.expireDate,
        'youtubeLink':this.updateProduct.youtubeLink,
        'dateTime':this.currentDateTime,
        'rating':this.updateProduct.rating,
        'discount':this.updateProduct.discount,
        'note':'default',
        'process': 'infoUpdate',
        'count':'0'
      });
      console.log('original stock',this.originalStock);
      console.log('update stock',this.updateProduct.stock);
      if (this.originalStock!==this.updateProduct.stock){
        let newStock;
        if(this.updateProduct.stock!==''){
          if(this.originalStock===''){
            newStock = parseInt(this.updateProduct.stock);
          }else
          {
            newStock =  parseInt(this.updateProduct.stock)-parseInt(this.originalStock);
          }
        }else {
          newStock = "";
        }

        console.log('buy price not same')
        const recordRef3 =await db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(this.$route.params.product_id).collection('records').doc();
        await recordRef3.set({
          'id':this.updateProduct.id,
          'recordId':recordRef3.id,
          'itemCode':this.updateProduct.itemCode,
          'barcode':this.updateProduct.barcode,
          'itemName':this.updateProduct.itemName,
          'buyPrice':this.updateProduct.buyPrice,
          'sellPrice':this.updateProduct.sellPrice,
          'stock':this.updateProduct.stock+"",
          'description':this.updateProduct.description,
          'type':this.updateProduct.type,
          'color':this.updateProduct.color,
          'size':this.updateProduct.size.toString(),
          'weight':this.updateProduct.weight.toString(),
          'time':timestamp,
          'day':this.currentDay,
          'month':this.currentMonth,
          'year':this.currentYear,
          'expireDate':this.updateProduct.expireDate,
          'youtubeLink':this.updateProduct.youtubeLink,
          'dateTime':this.currentDateTime,
          'rating':this.updateProduct.rating,
          'discount':this.updateProduct.discount,
          'note':'default',
          'process': 'stockUpdate',
          'count':newStock+""
        }).then(()=>{
          this.loadingActive = false;
          this.infoModalActive = true;
          this.modalMessage = 'Updated Successfully!';
          //this.$router.push({name:'ProductDetail', params:{product_id:this.product.id}});
        })
      }
      if(this.originalBuyPrice!==this.updateProduct.buyPrice){
        console.log('buy price not same')
        const recordRef3 =await db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(this.$route.params.product_id).collection('records').doc();
        await recordRef3.set({
          'id':this.updateProduct.id,
          'recordId':recordRef3.id,
          'itemCode':this.updateProduct.itemCode,
          'barcode':this.updateProduct.barcode,
          'itemName':this.updateProduct.itemName,
          'buyPrice':this.updateProduct.buyPrice,
          'sellPrice':this.updateProduct.sellPrice,
          'stock':this.updateProduct.stock+"",
          'description':this.updateProduct.description,
          'type':this.updateProduct.type,
          'color':this.updateProduct.color,
          'size':this.updateProduct.size.toString(),
          'weight':this.updateProduct.weight.toString(),
          'time':timestamp,
          'day':this.currentDay,
          'month':this.currentMonth,
          'year':this.currentYear,
          'expireDate':this.updateProduct.expireDate,
          'youtubeLink':this.updateProduct.youtubeLink,
          'dateTime':this.currentDateTime,
          'rating':this.updateProduct.rating,
          'discount':this.updateProduct.discount,
          'note':'Buy price - change ('+this.originalBuyPrice+' -> '+this.product.buyPrice+')',
          'process': 'buyPrice',
          'count':'0'
        }).then(()=>{
          this.loadingActive = false;
          this.infoModalActive = true;
          this.modalMessage = 'Updated Successfully!';
          //this.$router.push({name:'ProductDetail', params:{product_id:this.product.id}});
        })
      }
      if(this.originalSellPrice!==this.updateProduct.sellPrice){
        console.log('sell price not same')
        const recordRef4 =await db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(this.$route.params.product_id).collection('records').doc();
        await recordRef4.set({
          'id':this.updateProduct.id,
          'recordId':recordRef4.id,
          'itemCode':this.updateProduct.itemCode,
          'barcode':this.updateProduct.barcode,
          'itemName':this.updateProduct.itemName,
          'buyPrice':this.updateProduct.buyPrice,
          'sellPrice':this.updateProduct.sellPrice,
          'stock':this.updateProduct.stock+"",
          'description':this.updateProduct.description,
          'type':this.updateProduct.type,
          'color':this.updateProduct.color,
          'size':this.updateProduct.size.toString(),
          'weight':this.updateProduct.weight.toString(),
          'time':timestamp,
          'day':this.currentDay,
          'month':this.currentMonth,
          'year':this.currentYear,
          'expireDate':this.updateProduct.expireDate,
          'youtubeLink':this.updateProduct.youtubeLink,
          'dateTime':this.currentDateTime,
          'rating':this.updateProduct.rating,
          'discount':this.updateProduct.discount,
          'note':'sellPrice - change ('+this.originalSellPrice+' -> '+this.product.sellPrice+')',
          'process': 'sellPrice',
          'count':'0'
        }).then(()=>{
          this.loadingActive = false;
          this.infoModalActive = true;
          this.modalMessage = 'Updated Successfully!';
          //this.$router.push({name:'ProductDetail', params:{product_id:this.product.id}});
        })
      }
      this.loadingActive = false;
      this.infoModalActive = true;
      this.modalMessage = 'Updated Successfully!';
      this.$router.back();

      //this.$router.push({name:'ProductDetail', params:{product_id:this.product.id}});
    },
    cancel(){
      this.confirmActive = !this.confirmActive;
    },
    getRandomStr(){
      const chars = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let result = '';
      for ( let i = 0; i < 8; i++ ) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    },
    generateBarcode(){
      this.product.barcode = this.shopInfo.shopCode+this.getRandomStr();
    },

    /*async removeImage(){
      this.modalMessage = 'Are you Sure to delete?';
      this.confirmActive = true;
      this.confirmStatus = 'delete';
    },*/
    async upload() {
      this.modalMessage = 'Are you Sure to Update?';
      this.confirmActive = true;
    }
  }
}
</script>
<style>
</style>
<style scoped>

.content-box{
  margin-top: 20px;
}
input#session-date {
  display: inline-block;
  position: relative;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  background: transparent;
  bottom: 0;
  color: transparent;
  cursor: pointer;
  height: auto;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: auto;
}
.imagePreviewWrapper {
  width: 80px;
  height: 80px;
  display: block;
  cursor: pointer;
  background-size: cover;
  background-position: center center;
}
@media screen and (max-width: 1030px){
  .content-box{
    margin-top:60px;
  }
}
</style>