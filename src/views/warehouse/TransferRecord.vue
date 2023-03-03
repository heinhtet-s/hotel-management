<template>
  <AdminSidebar>
    <Loading v-if="loadingActive" />
    <InfoDialog v-if="modalActive" :modal-message="modalMessage" v-on:close-modal="closeModal" />
    <confirm-dialog :modal-message="modalMessage" v-if="confirmActive" v-on:confirm="confirm" v-on:cancel="cancel" />

    <div class="col-12 col-lg-10" v-if="shopInfo.packageStatus === 'ultra' || shopInfo.packageStatus === 'pro'">
      <!-- Modal -->
      <div class="modal fade" style="z-index: 10000;" id="exampleModal" tabindex="-1"
        aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Transfer Lists</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body d-flex" style="height: 400px;">

              <ul class="w-75 list-unstyled">
                <li class="p-1 m-1 "
                  style="background-color: var(--side-bar-bg);height: 50px; border-radius: var(--border-radius);"
                  v-for="(name, index) in selectedTransfer.productNameList" :key="index">{{ name }}</li>
              </ul>
              <ul class="w-25 list-unstyled ">
                <li class="p-1 m-1"
                  style="background-color: var(--side-bar-bg);height: 50px;border-radius: var(--border-radius);"
                  v-for="(count, index) in selectedTransfer.countList" :key="index">{{ count }}</li>
              </ul>

            </div>
            <div class="modal-footer justify-content-center align-items-center" v-if="receivePage">

              <button type="button" data-bs-dismiss="modal" data-bs-target="#exampleModal" class="btn"
                style="background-color: var(--light);" @click="cancelTransfer"
                :disabled="selectedTransfer.transferStatus === 'accepted'">Cancel</button>

              <button type="button" data-bs-dismiss="modal" data-bs-target="#exampleModal" class="btn text-light"
                style="background-color: var(--primary);" @click="acceptTransfer"
                :disabled="selectedTransfer.transferStatus === 'accepted'">Accept</button>
            </div>
          </div>
        </div>
      </div>

      <div class="position-fixed header-bar p-1 shadow-sm">
        <div class="d-flex flex-lg-row flex-column align-center justify-content-between rounded mt-4 mb-2">
          <div class="d-flex align-items-center">
            <button @click="$router.back()" class="btn border-0" style="color: var(--text-color);"><i
                class="fas fa-chevron-left"> </i></button>
            <router-link class="text-decoration-none fs-5" style="color: var(--text-color);"
              :class="$route.name === 'WarehouseManagement' ? 'activeRoute' : ''"
              :to="{ name: 'WarehouseManagement' }">Warehouse</router-link>
            <span class="mx-1">|</span>
            <router-link class="text-decoration-none fs-5" style="color: var(--text-color);"
              :class="$route.name === 'TransferRecord' ? 'activeRoute' : ''" :to="{ name: 'TransferRecord' }">Transfer
              History</router-link>
          </div>
          <div class="btn-group p-1" role="group" aria-label="Basic radio toggle button group">
            <input type="radio" class="btn-check" @click="showSent" name="btnradio" id="btnradio1" autocomplete="off"
              checked>
            <label class="btn check-btn btn-primary" for="btnradio1">Sent</label>

            <input type="radio" class="btn-check" @click="showReceived" name="btnradio" id="btnradio2"
              autocomplete="off">
            <label class="btn check-btn btn-primary" for="btnradio2">Received</label>
          </div>
        </div>


      </div>
      <div class="card-body px-0 table-card table-responsive">
        <table class="table table-hover table-bordered">
          <thead>
            <tr>
              <th class="text-nowrap">#</th>
              <th class="text-nowrap">Shop</th>
              <th class="text-nowrap">City</th>
              <th class="text-nowrap">Status</th>
              <th class="text-nowrap">Date</th>
              <th class="text-nowrap" v-if="receivePage">Control</th>
              <!--              <th v-if="shopInfo.branch==='main' && $route.params.branch_id!==shopInfo.id">Control</th>-->
            </tr>
          </thead>
          <tbody>

            <tr v-for="(record, index) in transferRecords" class="align-middle" :key="record.id">
              <td class="text-nowrap">{{ index+ 1}}</td>
              <td class="text-nowrap">{{ record.shopName }}</td>
              <td class="text-nowrap">{{ record.shopCity }}</td>
              <td class="text-nowrap">
                <span class="badge bg-success"
                  v-if="record.transferStatus === 'accepted'">{{ record.transferStatus }}</span>
                <span class="badge bg-danger"
                  v-else-if="record.transferStatus === 'cancelled'">{{ record.transferStatus }}</span>
                <span class="badge bg-warning" v-else>{{ record.transferStatus }}</span>
              </td>
              <td class="text-nowrap">{{ record.dateTime }}</td>
              <td class="text-nowrap">
                <button class="btn btn-sm border-0" style="background-color: var(--btnLight);"
                  @click="selectTransfer(record);" data-bs-toggle="modal" data-bs-target="#exampleModal"><i
                    class="fas fa-circle-info "></i>Detail</button>
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>
  </AdminSidebar>
</template>

<script>
// import axios from "axios";

import Loading from "../..//components/Loading";
import InfoDialog from "../../components/InfoDialog";
import ConfirmDialog from "@/components/ConfirmDialog";
import AdminSidebar from "@/components/AdminSidebar";
import db, { timestamp } from "@/config/FirebaseInit";
export default {
  components: { ConfirmDialog, Loading, InfoDialog, AdminSidebar },
  data() {
    return {
      loadingActive: false,
      modalActive: false,
      modalMessage: '',
      confirmActive: '',
      transferRecords: [],
      receivePage: false,
      selectedTransfer: '',
    }

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
    }
  },
  async mounted() {
    this.$store.dispatch("getDateTime");
    this.$store.dispatch("getDay");
    this.$store.dispatch("getMonth");
    this.$store.dispatch("getYear");
    await this.$store.dispatch("getShopInfo", this.owner);
    await this.getTransferRecord();
  },

  methods: {
    selectTransfer(record) {
      this.selectedTransfer = record;
    },
    cancel() {
      this.confirmActive = !this.confirmActive;

    },
    confirm() {
      this.confirmActive = !this.confirmActive;
      this.loadingActive = true;
      db.collection(this.selectedTransfer.shopCity).doc(this.selectedTransfer.shopId).collection('transfer').doc(this.selectedTransfer.id).update({
        'transferStatus': 'cancelled'
      }).then(() => {
        db.collection(this.shopInfo.city).doc(this.shopInfo.id).collection('transfer').doc(this.selectedTransfer.id).update({
          'transferStatus': 'cancelled'
        }).then(() => {
          this.loadingActive = false;
        })
      });
    },
    closeModal() {
      this.modalActive = !this.modalActive;
    },
    getTransferRecord() {
      db.collection(this.shopInfo.city).doc(this.shopInfo.id).collection('transfer').where('status', '==', 'sent').orderBy('time', 'desc').onSnapshot(snapshot => {
        this.transferRecords = [];
        snapshot.forEach(doc => {
          this.transferRecords.push(doc.data())
        })
      })
    },
    showSent() {
      this.receivePage = false;
      db.collection(this.shopInfo.city).doc(this.shopInfo.id).collection('transfer').where('status', '==', 'sent').orderBy('time', 'desc').onSnapshot(snapshot => {
        this.transferRecords = [];
        snapshot.forEach(doc => {
          this.transferRecords.push(doc.data())
        })
      })

    },
    showReceived() {
      this.receivePage = true;
      db.collection(this.shopInfo.city).doc(this.shopInfo.id).collection('transfer').where('status', '==', 'received').orderBy('time', 'desc').onSnapshot(snapshot => {
        this.transferRecords = [];
        snapshot.forEach(doc => {
          this.transferRecords.push(doc.data())
        })
      })

    },
    async cancelTransfer() {
      this.confirmActive = true;
      this.modalMessage = "Are you sure to cancel the transfer?"


    },

    async acceptTransfer() {
      this.loadingActive = true;
      //Adding product and update
      this.selectedTransfer.productIdList.forEach((id, index) => {
        console.log(this.selectedTransfer.productIdList.length, '==', index)
        db.collection(this.selectedTransfer.shopCity).doc(this.selectedTransfer.shopId).collection('products').doc(id).get().then((snapshot) => {
          let productInfo = snapshot.data();
          db.collection(this.selectedTransfer.shopCity).doc(this.selectedTransfer.shopId).collection('transfer').doc(this.selectedTransfer.id).update({
            'transferStatus': 'accepted'
          }).then(() => {
            db.collection(this.shopInfo.city).doc(this.shopInfo.id).collection('transfer').doc(this.selectedTransfer.id).update({
              'transferStatus': 'accepted'
            }).then(() => {
              db.collection(this.shopInfo.city).doc(this.shopInfo.id).collection('products').doc(id).get().then((snapshot) => {
                if (snapshot.exists) {
                  console.log('exist');
                  let newCount = '';
                  if (snapshot.data().stock !== '') {
                    newCount = parseInt(snapshot.data().stock) + parseInt(this.selectedTransfer.countList[index]);
                  } else {
                    newCount = '';
                  }
                  let existedProduct = snapshot.data();
                  let receivedRef = db.collection(this.shopInfo.city).doc(this.shopInfo.id).collection('products').doc(id);
                  receivedRef.update({
                    'stock': newCount.toString()
                  }).then(() => {
                    console.log('receiver stock update');
                    let receiverRecordRef = receivedRef.collection('records').doc();
                    receiverRecordRef.set({
                      'id': existedProduct.id,
                      'recordId': receiverRecordRef.id,
                      'itemCode': existedProduct.itemCode,
                      'barcode': existedProduct.barcode,
                      'itemName': existedProduct.itemName,
                      'buyPrice': existedProduct.buyPrice,
                      'sellPrice': existedProduct.sellPrice,
                      'stock': this.selectedTransfer.countList[index],
                      'description': existedProduct.description,
                      'type': existedProduct.type,
                      'color': existedProduct.color,
                      'size': existedProduct.size,
                      'weight': existedProduct.weight,
                      'time': timestamp,
                      'day': this.currentDay,
                      'month': this.currentMonth,
                      'dateTime': this.currentDateTime,
                      'year': this.currentYear,
                      'rating': existedProduct.rating,
                      'discount': existedProduct.discount,
                      'note': 'Get from ' + this.selectedTransfer.shopName,
                      'process': 'received',
                      'count': this.selectedTransfer.countList[index],
                    });
                  }).then(() => {
                    console.log('receiver record added')
                    let senderRef = db.collection(this.selectedTransfer.shopCity).doc(this.selectedTransfer.shopId).collection('products').doc(id);
                    senderRef.get().then((snapshot) => {
                      let newCount2 = '';
                      if (snapshot.data().stock !== '') {
                        newCount2 = parseInt(snapshot.data().stock) - parseInt(this.selectedTransfer.countList[index]);
                      } else {
                        newCount2 = '';
                      }
                      senderRef.update({ 'stock': '' + newCount2 }).then(() => {
                        console.log('sender stock updated')
                        let senderRecordRef = senderRef.collection('records').doc();
                        senderRecordRef.set({
                          'id': existedProduct.id,
                          'recordId': senderRecordRef.id,
                          'itemCode': existedProduct.itemCode,
                          'barcode': existedProduct.barcode,
                          'itemName': existedProduct.itemName,
                          'buyPrice': existedProduct.buyPrice,
                          'sellPrice': existedProduct.sellPrice,
                          'stock': existedProduct.stock.toString(),
                          'description': existedProduct.description,
                          'type': existedProduct.type,
                          'color': existedProduct.color,
                          'size': existedProduct.size,
                          'weight': existedProduct.weight,
                          'time': timestamp,
                          'day': this.currentDay,
                          'month': this.currentMonth,
                          'dateTime': this.currentDateTime,
                          'year': this.currentYear,
                          'rating': existedProduct.rating,
                          'discount': existedProduct.discount,
                          'note': 'Sent to ' + this.shopInfo.name,
                          'process': 'transfer',
                          'count': '-' + this.selectedTransfer.countList[index],
                        }).then(() => {
                          console.log('sender record added')
                          this.loadingActive = false;
                          this.modalActive = true;
                          this.modalMessage = 'Accepted Successfully'
                        })
                      })

                    })
                  })

                } else {
                  console.log('not exist');
                  productInfo.stock = this.selectedTransfer.countList[index].toString();
                  productInfo.dateTime = this.currentDateTime;
                  productInfo.day = this.currentDay;
                  productInfo.month = this.currentMonth;
                  productInfo.year = this.currentYear;
                  productInfo.time = timestamp;
                  let receivedRef = db.collection(this.shopInfo.city).doc(this.shopInfo.id).collection('products').doc(id);
                  receivedRef.set(productInfo).then(() => {
                    let receiverRecordRef = receivedRef.collection('records').doc();
                    receiverRecordRef.set({
                      'id': productInfo.id,
                      'recordId': receiverRecordRef.id,
                      'itemCode': productInfo.itemCode,
                      'barcode': productInfo.barcode,
                      'itemName': productInfo.itemName,
                      'buyPrice': productInfo.buyPrice,
                      'sellPrice': productInfo.sellPrice,
                      'stock': productInfo.stock.toString(),
                      'description': productInfo.description,
                      'type': productInfo.type,
                      'color': productInfo.color,
                      'size': productInfo.size,
                      'weight': productInfo.weight,
                      'time': timestamp,
                      'day': this.currentDay,
                      'month': this.currentMonth,
                      'dateTime': this.currentDateTime,
                      'year': this.currentYear,
                      'rating': productInfo.rating,
                      'discount': productInfo.discount,
                      'note': 'Get from ' + this.selectedTransfer.shopName,
                      'process': 'received',
                      'count': this.selectedTransfer.countList[index],
                    }).then(() => {
                      console.log('receiver record added')
                      let senderRef = db.collection(this.selectedTransfer.shopCity).doc(this.selectedTransfer.shopId).collection('products').doc(id);
                      senderRef.get().then((snapshot) => {
                        let newCount2 = '';
                        if (snapshot.data().stock !== '') {
                          newCount2 = parseInt(snapshot.data().stock) - parseInt(this.selectedTransfer.countList[index]);
                        } else {
                          newCount2 = '';
                        }
                        senderRef.update({ 'stock': newCount2 + '' }).then(() => {
                          console.log('sender stock updated')
                          let senderRecordRef = senderRef.collection('records').doc();
                          senderRecordRef.set({
                            'id': productInfo.id,
                            'recordId': senderRecordRef.id,
                            'itemCode': productInfo.itemCode,
                            'barcode': productInfo.barcode,
                            'itemName': productInfo.itemName,
                            'buyPrice': productInfo.buyPrice,
                            'sellPrice': productInfo.sellPrice,
                            'stock': productInfo.stock.toString(),
                            'description': productInfo.description,
                            'type': productInfo.type,
                            'color': productInfo.color,
                            'size': productInfo.size,
                            'weight': productInfo.weight,
                            'time': timestamp,
                            'day': this.currentDay,
                            'month': this.currentMonth,
                            'dateTime': this.currentDateTime,
                            'year': this.currentYear,
                            'rating': productInfo.rating,
                            'discount': productInfo.discount,
                            'note': 'Sent to ' + this.shopInfo.name,
                            'process': 'transfer',
                            'count': '-' + this.selectedTransfer.countList[index],
                          }).then(() => {
                            console.log('sender record added')
                            this.loadingActive = false;
                            this.modalActive = true;
                            this.modalMessage = 'Accepted Successfully';
                          })
                        })

                      })
                    })

                    /*receivedRef.collection('relation');
                    db.collection(this.selectedTransfer.shopCity).doc(this.selectedTransfer.shopId).collection('products').doc(id).collection('relation').get().then(snapshot=>{
                      if(snapshot){
                        console.warn('relation exists')
                        exitRelation.push({'productId':id,'snapshot':snapshot});
                        console.log('Exit Relation', exitRelation)

                        /!*snapshot.forEach((doc,index)=>{
                          receivedRef.collection('relation').doc(doc.data().id).set(doc.data());
                          if(snapshot.size === index+1){
                          }
                        })*!/
                      }else {
                        console.log('receiver product added without relation');
                        let receiverRecordRef = receivedRef.collection('records').doc();
                        receiverRecordRef.set({
                          'id': productInfo.id,
                          'recordId': receiverRecordRef.id,
                          'itemCode': productInfo.itemCode,
                          'barcode': productInfo.barcode,
                          'itemName': productInfo.itemName,
                          'buyPrice': productInfo.buyPrice,
                          'sellPrice': productInfo.sellPrice,
                          'stock': productInfo.stock.toString(),
                          'description': productInfo.description,
                          'type': productInfo.type,
                          'color': productInfo.color,
                          'size': productInfo.size,
                          'weight': productInfo.weight,
                          'time': timestamp,
                          'day': this.currentDay,
                          'month':this.currentMonth,
                          'dateTime':this.currentDateTime,
                          'year': this.currentYear,
                          'rating': productInfo.rating,
                          'discount': productInfo.discount,
                          'note': 'get from '+this.selectedTransfer.shopName,
                          'process': 'received',
                          'count': this.selectedTransfer.countList[index],
                        }).then(()=>{
                            console.log('receiver record added')
                            let senderRef = db.collection(this.selectedTransfer.shopCity).doc(this.selectedTransfer.shopId).collection('products').doc(id);
                            senderRef.get().then((snapshot)=>{
                              let newCount2 = parseInt(snapshot.data().stock) - parseInt(this.selectedTransfer.countList[index]);
                              senderRef.update({'stock':newCount2.toString()}).then(()=>{
                                console.log('sender stock updated')
                                let senderRecordRef = senderRef.collection('records').doc();
                                senderRecordRef.set({
                                  'id': productInfo.id,
                                  'recordId': senderRecordRef.id,
                                  'itemCode': productInfo.itemCode,
                                  'barcode': productInfo.barcode,
                                  'itemName': productInfo.itemName,
                                  'buyPrice': productInfo.buyPrice,
                                  'sellPrice': productInfo.sellPrice,
                                  'stock': productInfo.stock.toString(),
                                  'description': productInfo.description,
                                  'type': productInfo.type,
                                  'color': productInfo.color,
                                  'size': productInfo.size,
                                  'weight': productInfo.weight,
                                  'time': timestamp,
                                  'day': this.currentDay,
                                  'month':this.currentMonth,
                                  'dateTime':this.currentDateTime,
                                  'year': this.currentYear,
                                  'rating': productInfo.rating,
                                  'discount': productInfo.discount,
                                  'note': 'transfer to '+this.shopInfo.name,
                                  'process': 'transfer',
                                  'count':'-'+this.selectedTransfer.countList[index],
                                }).then(()=>{
                                  console.log('sender record added')
                                  this.loadingActive = false;
                                  this.modalActive = true;
                                  this.modalMessage = 'Accepted Successfully';
                                })
                              })
                            })
                        });
                      }
                    })*/;

                  });
                }
              })
            });
          });
        });
      });
      //Adding Relations to products
      this.selectedTransfer.productIdList.forEach((id, index) => {
        console.log(this.selectedTransfer.productIdList.length, '==', index);
        db.collection(this.selectedTransfer.shopCity).doc(this.selectedTransfer.shopId).collection('products').doc(id).collection('relation').get().then(snapshot => {
          if (snapshot) {
            console.warn('relation exists');
            snapshot.forEach(doc => {
              db.collection(this.shopInfo.city).doc(this.shopInfo.id).collection('products').doc(id).collection('relation').doc(doc.data().id).set(doc.data()).then(() => {
                console.warn('relation added')
              });
            })
          }
        });
      });
    }

  }

}
</script>

<style scoped>
.header-bar {
  background-color: var(--background-color);
  top: 20px;
  width: 82%;
  z-index: 1000;
}

tr {
  cursor: pointer;
  color: var(--text-color) !important;
}

.category-box ul {
  height: inherit;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  box-sizing: border-box;
}

.table-card {
  margin-top: 120px;
}

.btn-group .btn {
  border-radius: 0px !important;
}

.check-btn {
  width: 100px !important;
}

.btn {
  border: 2px solid var(--primary);
  box-shadow: none !important;
  outline: none !important;
}

.btn-primary {
  background-color: white;
  color: black;
}

.activeRoute {
  border-bottom: 2px solid var(--primary);
}

@media only screen and (max-width: 1030px) {

  .header-bar {
    left: 0px;
    margin-top: 20px;
    width: 100%;
  }

  .btn-group {
    width: 100%;
  }

  .table-card {
    margin-top: 180px;
  }


}
</style>