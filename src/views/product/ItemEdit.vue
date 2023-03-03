<template>

  <AdminSidebar>
    <Loading v-if="loadingActive" />
    <InfoDialog v-if="infoModalActive" :modal-message="modalMessage" v-on:close-modal="closeModal" />
    <confirm-dialog :modal-message="modalMessage" v-if="confirmActive" v-on:confirm="confirm" v-on:cancel="cancel" />

    <div class="col-12 col-lg-6 px-3"
      style="overflow-y:scroll;overflow-x:hidden;height:98vh;background-color: var(--background-color);color: var(--text-color);">
      <div class="d-flex rounded align-items-center mb-2">
        <button @click="$router.back()" class="btn me-1" style="color: var(--text-color);"><i
            class="fas fa-chevron-left"> </i></button>
        <span class="fs-4">{{ $t('message.edit') }}</span>
      </div>
      <form @keydown.prevent.stop.enter @submit.prevent="upload">
        <div class="p-1" v-if="previewImages.length > 0"
          style="background-color: var(--light);border-radius: var(--border-radius); width: 100%;">
          <div class="btn btn-sm bg-danger text-white float-end" @click="previewImages = [];">Clear</div>
          <div class="d-flex pb-3" style="background-color: var(--light);overflow-x: scroll; width: 100%;">
            <div class="rounded p-1 m-1" style="background-color: var(--light);"
              v-for="(previewImage, index) in previewImages" :key="index">
              <img :src="previewImage" width="100" height="100" @click="selectImage" alt="">
            </div>
          </div>
        </div>
        <div class="p-1" v-else
          style="background-color: var(--light);border-radius: var(--border-radius); width: 100%;">
          <div class="btn btn-sm bg-danger float-end text-white" @click="product.images = ''">Clear</div>
          <div class="d-flex pb-3" v-if="product.images !== []"
            style="background-color: var(--light);overflow-x: scroll; width: 100%;">
            <div class="rounded p-1 m-1" v-for="(imgUrl, index) in product.images" :key="index"
              style="background-color: var(--light);">
              <img :src="imgUrl" width="100" height="100" alt="">
            </div>
          </div>
          <div class="d-flex pb-3" v-else style="background-color: var(--light);overflow-x: scroll; width: 100%;">
            <div class="rounded p-1 m-1" style="background-color: var(--light);">
              <img src="../../assets/flash/1.png" width="100" height="100" alt="">
            </div>
          </div>
        </div>

        <div class="col-12 my-2" v-if="shopInfo.packageStatus !== 'basic'">
          <!--            <label class="form-label mt-1">Edit Photos:</label>-->
          <div class="btn btn-sm" @click="selectImage" style="background-color: var(--light);">
            <i class="fas fa-file-arrow-up"></i> Upload Photo
          </div>
          <input type="file" ref="fileInput" @change="pickFile" multiple accept="image/*" id="img-input"
            class="form-control d-none">
        </div>

        <div class="row">
          <div class="col-12 col-lg-6 col-md-6">
            <div class="d-flex align-items-center mb-3"
              style="background-color: var(--light);border-radius: var(--border-radius);">
              <div class="form-floating w-75">
                <input type="text" required @keydown.prevent.stop.enter class="form-control" autocomplete="off"
                  v-model="product.barcode" id="barcode-input" placeholder="enter shop name">
                <label for="barcode-input">{{ $t('message.barcode') }}</label>
              </div>
              <button class="btn ms-2" @click.prevent="generateBarcode" style="background-color: var(--btnLight);"><i
                  class="fas fa-barcode"></i></button>
            </div>
          </div>
          <div class="col-12 col-lg-6 col-md-6 form-floating mb-3 p-1">
            <input type="text" required class="form-control" @keydown.prevent.stop.enter v-model="product.itemName"
              id="name-input" placeholder="enter shop name">
            <label for="name-input">{{ $t('message.itemName') }}</label>
          </div>
          <div class="col-12 col-lg-6 col-md-6 form-floating mb-3 p-1">
            <input type="number" required class="form-control" v-model="product.buyPrice" id="buy-price-input"
              placeholder="enter shop name">
            <label for="buy-price-input">{{ $t('message.buy_price') }}</label>
          </div>
          <div class="col-12 col-lg-6 col-md-6 form-floating mb-3 p-1">
            <input type="number" required class="form-control" v-model="product.sellPrice" id="sell-price-input"
              placeholder="enter shop sell price">
            <label for="sell-price-input">{{ $t('message.sell_price') }}</label>
          </div>
          <div class="col-12 col-lg-6 col-md-6 form-floating mb-3 p-1">
            <input type="number" class="form-control" v-model="product.stock" id="stock-input"
              placeholder="enter stock">
            <label for="stock-input">{{ $t('message.stock') }} (Optional)</label>
          </div>
          <div class="col-12 col-lg-6 col-md-6 mb-3 p-1 form-floating">
            <select class="form-select form-control" style="border-radius: var(--border-radius);" required
              v-model="product.type" aria-label=".form-select-sm example">
              <option selected disabled>{{ $t('message.category') }}</option>
              <option :value="type.name" v-for="type in product_types" :key="type.id">{{ type.name }}</option>
            </select>
            <label>Category:</label>

          </div>

          <div class="col-12 col-lg-6 col-md-6 mb-2 p-1 form-floating">
            <select id="kitchen" required class="form-select form-control"
              style="border-radius: var(--border-radius) !important;" v-model="product.kitchenType"
              aria-label=".form-select-sm example">
              <option selected disabled>Choose Brand</option>
              <option :value="type.name" v-for="type in kitchens" :key="type.id">{{ type.name }}</option>
            </select>
            <label for="kitchen" class="floating-label">Kitchens</label>

          </div>
          <!--          <div class="col-12 col-lg-6 col-md-6 mb-2 p-1 form-floating">
            <select class="form-select fs-6 form-control rounded" style="border-radius: var(&#45;&#45;border-radius) !important;"  v-model="product.brand" aria-label=".form-select-sm example">
              <option selected disabled>Choose Brand</option>
              <option :value="type.name" v-for="type in product_brands" :key="type.id">{{ type.name }}</option>
            </select>
            <label for="">Brand</label>

          </div>
          <div class="col-12 col-lg-6 col-md-6 mb-2 p-1 form-floating">
            <select class="form-select fs-6 form-control" style="border-radius: var(&#45;&#45;border-radius) !important;"  v-model="product.color" aria-label=".form-select-sm example">
              <option selected disabled>Choose Color</option>
              <option :value="type.name" v-for="type in product_colors" :key="type.id">{{ type.name }}</option>
            </select>
            <label for="">Color</label>

          </div>
          <div class="col-12 col-lg-6 col-md-6 mb-2 p-1 form-floating">
            <select class="form-select fs-6 form-control form-select-lg rounded" style="border-radius: var(&#45;&#45;border-radius) !important;"  v-model="product.size" aria-label=".form-select-sm example">
              <option selected disabled>Choose Size</option>
              <option :value="type.name" v-for="type in product_sizes" :key="type.id">{{ type.name }}</option>
            </select>
            <label for="">Size</label>

          </div>
          <div class="col-12 col-lg-6 col-md-6 mb-2 p-1 form-floating">
            <select class="form-select fs-6 form-control rounded" style="border-radius: var(&#45;&#45;border-radius) !important;"  v-model="product.weight" aria-label=".form-select-sm example">
              <option selected disabled>Choose Weight</option>
              <option :value="type.name" v-for="type in product_weight" :key="type.id">{{ type.name }}</option>
            </select>
            <label for="">Weight</label>
          </div>-->

          <div class="col-12 col-lg-6 col-md-6 form-floating mb-3 p-1">
            <input type="date" class="form-control" v-model="product.expireDate" id="date-input"
              placeholder="enter expire date">
            <label for="date-input" v-if="product">{{ $t('message.expire_date') }}: {{ product.expireDate }}</label>

          </div>
          <!--          <div class="col12 p-1">
            <span v-if="product.youtubeLink"><span class="text-danger"><i class="fab fa-youtube"></i></span>https://youtu.be/{{product.youtubeLink}}</span>
            <div class="form-floating mb-3">
              <input type="text" class="form-control" v-model="youtubeLink" id="youtube-input" placeholder="enter youtube link">
              <label for="youtube-input" class="text-black-50">Youtube Link (Optional)</label>
            </div>
          </div>-->
          <div class="col-12 p-1">
            <textarea type="text" rows="5" cols="10" class="form-control" v-model="product.description"
              id="description-input" :placeholder="$t('message.description') + '(optional)'"></textarea>
            <div class="form-check m-2">
              <input class="form-check-input" type="checkbox" value="" :checked="product.barMenu === 'yes'"
                id="flexCheckChecked" @change="barMenuToggle">
              <label class="form-check-label" for="flexCheckChecked">
                Bar Menu ?
              </label>
            </div>
          </div>

        </div>

        <div class="row position-sticky shadow-sm " style="bottom: 1px; background-color: var(--background-color);">
          <button type="submit" class="btn mx-auto w-50 my-2 text-white" style="background-color: var(--primary);">
            {{ $t('message.confirm') }}</button>
        </div>
      </form>
    </div>
  </AdminSidebar>
</template>

<script>
import db, { storage, timestamp } from "@/config/FirebaseInit";
import Loading from "../../components/Loading";
import InfoDialog from "@/components/InfoDialog";
import ConfirmDialog from "@/components/ConfirmDialog";
import AdminSidebar from "@/components/AdminSidebar";
export default {
  props: ['product_id'],
  components: { ConfirmDialog, InfoDialog, Loading, AdminSidebar },
  data() {
    return {
      confirmStatus: '',
      removedIndex: '',
      infoModalActive: false,
      confirmActive: false,
      modalMessage: '',
      loadingActive: false,
      allSrc: [],
      updateProduct: '',
      product: '',
      originalStock: '',
      originalSellPrice: '',
      originalBuyPrice: '',
      previewImages: [],

    }
  },
  computed: {
    owner() {
      return this.$store.getters.getShopOwner;
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
    shopInfo() {
      return this.$store.getters.getShopInfo;
    },
    product_types() {
      return this.$store.getters.getProductCategories;
    },
    product_sizes() {
      return this.$store.getters.getSizes;
    },
    product_brands() {
      return this.$store.getters.getBrands;
    },
    product_colors() {
      return this.$store.getters.getColors;
    },
    product_weight() {
      return this.$store.getters.getWeights;
    },
    kitchens() {
      return this.$store.getters.getKitchens;
    },
  },
  mounted() {
    this.$store.dispatch("getCurrentShop");
    this.$store.dispatch("getShopInfo", this.owner);

    this.$store.dispatch('getProductCategories', this.owner);
    this.$store.dispatch('fetchBrands', this.owner);
    this.$store.dispatch('fetchSizes', this.owner);
    this.$store.dispatch('fetchColors', this.owner);
    this.$store.dispatch('fetchWeights', this.owner);
    this.$store.dispatch('fetchKitchens', this.owner);
    db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(this.product_id).get().then(snapshot => {
      this.product = snapshot.data();
      this.originalBuyPrice = snapshot.data().buyPrice;
      this.originalStock = snapshot.data().stock;
      this.originalSellPrice = snapshot.data().sellPrice;
      console.log(this.originalStock)
      console.info('product', this.product)
    })
  },
  methods: {
    barMenuToggle(e) {
      if (e.target.checked) {
        this.product.barMenu = "yes"
      } else {
        this.product.barMenu = "no"
      }
    },
    onChangePhotoInput(e) {
      const files = e.target.files;
      for (let i = 0; i < files.length; i++) {
        this.allSrc.push(files[i])
      }
    },
    selectImage() {
      this.$refs.fileInput.click()
    },
    pickFile(e) {
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
    closeModal() {
      this.infoModalActive = !this.infoModalActive;
    },
    formatDate(payload) {
      if (payload !== '') {
        let date = new Date(payload);
        let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
        let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
        let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
        return day + "-" + month + "-" + year;
      } else {
        return "";
      }
    },
    async confirm() {
      console.log(this.product)
      this.loadingActive = true;
      const storageRef = await storage.ref();
      this.confirmActive = false;
      this.$store.dispatch("getDateTime");
      this.$store.dispatch("getDay");
      this.$store.dispatch("getMonth");
      this.$store.dispatch("getYear");
      let expDate = '';
      console.log(this.product.expireDate);

      if (this.product.expireDate !== undefined) {
        if (this.product.expireDate !== '') {
          expDate = this.formatDate(this.product.expireDate)
        } else {
          expDate = '';
        }
      }
      if (this.product.buyPrice === '') {
        this.product.buyPrice = "0"
      }
      if (this.product.sellPrice === '') {
        this.product.sellPrice = "0"
      }
      this.updateProduct = {
          'barMenu': this.product.barMenu,
          'barcode': this.product.barcode,
          'buyPrice': this.product.buyPrice.toString(),
          'color': this.product.color.toString(),
          'time': this.product.time,
          'day': this.product.day,
          'description': this.product.description.toString(),
          'discount': this.product.discount.toString(),
          'id': this.product.id,
          'images': this.product.images,
          'itemCode': this.product.itemCode,
          'itemName': this.product.itemName,
          'month': this.product.month,
          'rating': this.product.rating,
          'expireDate': expDate,
          'sellPrice': this.product.sellPrice.toString(),
          'size': this.product.size.toString(),
          'stock': this.product.stock.toString(),
          'type': this.product.type,
          'brand': this.product.brand,
          'kitchenType': this.product.kitchenType,
          'weight': this.product.weight.toString(),
          'year': this.product.year,
        };

      console.log(this.product.images)
      console.log(this.updateProduct)
      if (this.allSrc.length > 0) {
        this.updateProduct.images = [];
        console.log(this.updateProduct)
        const fileRef = await storageRef.child(`/${this.owner.city}/${this.owner.shopId}/products/${this.product_id}`);
        await fileRef.listAll()
          .then((dir) => {
            dir.items.forEach(fileRef => {
              fileRef.delete()
            });
            console.log("image cleared");
          })
          .catch((err) => {
            this.loadingActive = false
            console.log(err);
          });
        for (let i = 0; i < this.allSrc.length; i++) {
          const imgRef = storageRef.child(`/${this.owner.city}/${this.owner.shopId}/products/${this.product_id}/${i + this.product_id}`)
          imgRef.put(this.allSrc[i]).on("state_changed", () => {
            console.log('image uploaded, ', i);
          }, error => {
            this.loadingActive = false;
            console.log(error)
          }, async () => {
            const img_src = await imgRef.getDownloadURL();
            this.updateProduct.images.push(img_src);
            if (i + 1 === this.allSrc.length) {
              await db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(this.product_id).update(this.updateProduct).then(() => {
              }).then(() => {
                this.addRecord();
              })

            }

          })
        }

      } else {
        this.updateProduct.images = this.product.images;
        //TODO: to check stock update or not in info update
        await db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(this.product_id).update(this.updateProduct).then(() => {
          /* const recordRef = db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(this.product_id).collection('records').doc();
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
        }).catch(err => {
          this.loadingActive = false;
          console.log(err.message)
        });
      }
    },
    async addRecord() {
      console.log(timestamp)
      const recordRef = await db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(this.product_id).collection('records').doc();
      console.log('original stock:', this.originalStock, 'original sellPrice:', this.originalSellPrice, 'original buyPrice:', this.originalBuyPrice);
      console.log('update stock:', this.updateProduct.stock, 'update sellPrice:', this.updateProduct.sellPrice, 'update buyPrice:', this.updateProduct.buyPrice);
      await recordRef.set({
        'id': this.updateProduct.id,
        'recordId': recordRef.id,
        'itemCode': this.updateProduct.itemCode,
        'barcode': this.updateProduct.barcode,
        'itemName': this.updateProduct.itemName,
        'buyPrice': this.updateProduct.buyPrice,
        'sellPrice': this.updateProduct.sellPrice,
        'stock': "" + this.updateProduct.stock,
        'description': this.updateProduct.description,
        'type': this.updateProduct.type,
        'color': this.updateProduct.color,
        'size': this.updateProduct.size.toString(),
        'weight': this.updateProduct.weight.toString(),
        'time': timestamp,
        'day': this.currentDay,
        'month': this.currentMonth,
        'year': this.currentYear,
        'expireDate': this.updateProduct.expireDate,
        'dateTime': this.currentDateTime,
        'rating': this.updateProduct.rating,
        'discount': this.updateProduct.discount,
        'note': 'default',
        'process': 'infoUpdate',
        'count': '0'
      });

      if (this.originalStock !== this.updateProduct.stock) {
        let newStock;
        if (this.updateProduct.stock !== '') {
          if (this.originalStock === '') {
            newStock = parseInt(this.updateProduct.stock);
          } else {
            newStock = parseInt(this.updateProduct.stock) - parseInt(this.originalStock);
          }
        } else {
          newStock = "";
        }

        console.log('buy price not same')
        const recordRef3 = await db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(this.product_id).collection('records').doc();
        await recordRef3.set({
          'id': this.updateProduct.id,
          'recordId': recordRef3.id,
          'itemCode': this.updateProduct.itemCode,
          'barcode': this.updateProduct.barcode,
          'itemName': this.updateProduct.itemName,
          'buyPrice': this.updateProduct.buyPrice,
          'sellPrice': this.updateProduct.sellPrice,
          'stock': this.updateProduct.stock + "",
          'description': this.updateProduct.description,
          'type': this.updateProduct.type,
          'color': this.updateProduct.color,
          'size': this.updateProduct.size.toString(),
          'weight': this.updateProduct.weight.toString(),
          'time': timestamp,
          'day': this.currentDay,
          'month': this.currentMonth,
          'year': this.currentYear,
          'expireDate': this.updateProduct.expireDate,
          'dateTime': this.currentDateTime,
          'rating': this.updateProduct.rating,
          'discount': this.updateProduct.discount,
          'note': 'default',
          'process': 'stockUpdate',
          'count': newStock + ""
        }).then(() => {
          this.loadingActive = false;
          this.infoModalActive = true;
          this.modalMessage = 'Updated Successfully!';
          //this.$router.push({name:'ProductDetail', params:{product_id:this.product.id}});
        })
      }
      if (this.originalBuyPrice !== this.updateProduct.buyPrice) {
        console.log('buy price not same')
        const recordRef3 = await db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(this.product_id).collection('records').doc();
        await recordRef3.set({
          'id': this.updateProduct.id,
          'recordId': recordRef3.id,
          'itemCode': this.updateProduct.itemCode,
          'barcode': this.updateProduct.barcode,
          'itemName': this.updateProduct.itemName,
          'buyPrice': this.updateProduct.buyPrice,
          'sellPrice': this.updateProduct.sellPrice,
          'stock': this.updateProduct.stock + "",
          'description': this.updateProduct.description,
          'type': this.updateProduct.type,
          'color': this.updateProduct.color,
          'size': this.updateProduct.size.toString(),
          'weight': this.updateProduct.weight.toString(),
          'time': timestamp,
          'day': this.currentDay,
          'month': this.currentMonth,
          'year': this.currentYear,
          'expireDate': this.updateProduct.expireDate,
          'dateTime': this.currentDateTime,
          'rating': this.updateProduct.rating,
          'discount': this.updateProduct.discount,
          'note': 'Buy price - change (' + this.originalBuyPrice + ' -> ' + this.product.buyPrice + ')',
          'process': 'buyPrice',
          'count': '0'
        }).then(() => {
          this.loadingActive = false;
          this.infoModalActive = true;
          this.modalMessage = 'Updated Successfully!';
          //this.$router.push({name:'ProductDetail', params:{product_id:this.product.id}});
        })
      }
      if (this.originalSellPrice !== this.updateProduct.sellPrice) {
        console.log('sell price not same')
        const recordRef4 = await db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(this.product_id).collection('records').doc();
        await recordRef4.set({
          'id': this.updateProduct.id,
          'recordId': recordRef4.id,
          'itemCode': this.updateProduct.itemCode,
          'barcode': this.updateProduct.barcode,
          'itemName': this.updateProduct.itemName,
          'buyPrice': this.updateProduct.buyPrice,
          'sellPrice': this.updateProduct.sellPrice,
          'stock': this.updateProduct.stock + "",
          'description': this.updateProduct.description,
          'type': this.updateProduct.type,
          'color': this.updateProduct.color,
          'size': this.updateProduct.size.toString(),
          'weight': this.updateProduct.weight.toString(),
          'time': timestamp,
          'day': this.currentDay,
          'month': this.currentMonth,
          'year': this.currentYear,
          'expireDate': this.updateProduct.expireDate,
          'dateTime': this.currentDateTime,
          'rating': this.updateProduct.rating,
          'discount': this.updateProduct.discount,
          'note': 'sellPrice - change (' + this.originalSellPrice + ' -> ' + this.product.sellPrice + ')',
          'process': 'sellPrice',
          'count': '0'
        }).then(() => {
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
    cancel() {
      this.confirmActive = !this.confirmActive;
    },
    getRandomStr() {
      const chars = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let result = '';
      for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    },
    generateBarcode() {
      this.product.barcode = this.shopInfo.shopCode + this.getRandomStr();
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
.content-box {
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

@media screen and (max-width: 1030px) {
  .content-box {
    margin-top: 60px;
  }
}
</style>