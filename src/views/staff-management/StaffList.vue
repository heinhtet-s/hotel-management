<template>
  <!--  Shop-->
  <admin-sidebar>
    <Loading v-if="loadingActive" />
    <InfoDialog v-if="infoModalActive" :modal-message="modalMessage" v-on:close-modal="closeInfoModal" />
    <confirm-dialog :modal-message="modalMessage" v-if="confirmActive" v-on:confirm="confirm" v-on:cancel="cancel" />
    <div class="modal fade" style="z-index: 10000;" id="departmentModal" tabindex="-1" aria-labelledby="departmentModel"
      aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title" id="departmentModel">{{ $t('message.department') }}</h5>
            <button type="button" id="btn-close" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <form class="d-flex mb-2" @submit.prevent="createDepartment">
                <div class="form-floating w-75">
                  <input type="text" required class="form-control" v-model="departmentName" id="dept-name"
                    placeholder="enter name">
                  <label for="edit-staff-name">name</label>
                </div>
                <button type="submit" class="btn btn-sm ms-2 w-25 btn-primary">{{
                  department.id ? 'Update' : 'Add'
                }}</button>
              </form>
              <div>
                <div class="d-flex justify-content-between mb-2 p-2 align-items-center"
                  style="background-color: var(--light);border-radius: var(--border-radius);"
                  v-for="dept in departments" :key="dept.id">
                  <span>{{ dept.name }}</span>
                  <button class="btn" style="background-color: var(--primary);" @click="departmentName = dept.name"><i class="fas fa-edit"></i></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">

      <div class="d-flex align-items-center justify-content-between">
        <button @click="$router.back()" style="color: var(--primary);" class=" btn fs-5"><i
            class="fas fa-chevron-left"> </i>
            <span class="fs-3">{{ $t('message.staffs_management') }}</span>
        </button>
        <router-link :to="{name:'StaffAttendance'}" class="btn btn-success">{{ $t('message.take_attendance') }}</router-link>
      </div>
      <div class="col-12 col-lg-4">
        <div class="card">
          <div class="card-body">
            <button type="button" class="btn btn-warning mb-1" @click="openEditBox(staff)" data-bs-toggle="modal"
              data-bs-target="#departmentModal">
              <i class="fas fa-circle-plus"></i> {{ $t('message.department') }}
            </button>
            <form @submit.prevent="upload">
              <div class="text-start">
                <input type="file" @change="onChangePhotoInput" accept="image/*" id="img-input" multiple
                  class="form-control mb-3" ref="photo" placeholder="photo">
              </div>
              <div class="form-floating mb-3">
                <input type="text" required class="form-control" v-model="staff.name" id="staff-name"
                  placeholder="enter name">
                <label for="barcode-input">{{$t('message.name')}}</label>
              </div>
              <div class="form-floating mb-3">
                <input type="text" required class="form-control" v-model="staff.phone" id="staff-phone"
                  placeholder="enter phone">
                <label for="barcode-input">{{$t('message.phone')}}</label>
              </div>
              <div class="form-floating mb-3">
                <input type="text" required class="form-control" v-model="staff.address" id="staff-address"
                  placeholder="enter address">
                <label for="barcode-input">{{$t('message.address')}}</label>
              </div>
              <div class="form-floating mb-3">
                <input type="text" required class="form-control" v-model="staff.staffId" id="staff-id"
                  placeholder="enter address">
                <label for="barcode-input">{{$t('message.staff_id')}}</label>
              </div>
              <div class="form-floating mb-3">
                <select required class="form-select fs-6 form-control form-select-lg rounded"
                  style="border-radius: var(--border-radius) !important;" v-model="staff.department"
                  aria-label=".form-select-sm example">
                  <option :value="department.name" v-for="(department,i) in departments" :selected="i===0"  :key="department.id">{{
                    department.name
                  }}</option>
                </select>
                <label class="form-label">{{$t('message.department')}}</label>
              </div>
              <div class="form-floating mb-3">
                <input type="text" required class="form-control" v-model="staff.salary" id="staff-salary"
                  placeholder="enter address">
                <label for="barcode-input">{{ $t('message.basic_salary') }}</label>
              </div>
              <div class="form-floating mb-3">
                <input type="date" required class="form-control" v-model="staff.dateOfBirth" id="staff-dob"
                  placeholder="enter address">
                <label for="barcode-input">{{ $t('message.dob') }}</label>
              </div>
              <button type="submit" class="btn float-end text-white w-100" style="background-color: var(--primary);">{{ $t('message.add') }}</button>
            </form>
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-8 ">
        <div class="card" style="height: 80vh;overflow: scroll; background-color: var(--background-color);">
          <div class="d-flex justify-content-between">
            <h3 class="mt-2">{{$t('message.staffs') }}</h3>
            <div>
              <input type="text" v-model="search" @input="searchStaff" class="form-control" :placeholder="$t('message.search')">
            </div>
          </div>
          <div class="table-responsive">
            <table class="table table-hover table-striped">
              <thead>
                <tr>
                  <th class="text-nowrap">{{$t('message.staff_id')}}</th>
                  <th class="text-nowrap">{{$t('message.photo')}}</th>
                  <th class="text-nowrap">{{$t('message.name')}}</th>
                  <th class="text-nowrap">{{$t('message.phone')}}</th>
                  <th class="text-nowrap">{{$t('message.department')}}</th>
                  <th class="text-nowrap">{{$t('message.dob')}}</th>
                  <th class="text-nowrap">{{$t('message.basic_salary')}}</th>
                  <th class="text-nowrap text-center">{{$t('message.control')}}</th>
                  <!-- <th>Created At</th>-->
                </tr>
              </thead>
              <tbody>
                <tr v-for="(staff, index) in staffs" :key="index">
                  <td class="text-nowrap">{{ staff.staffId }}</td>
                  <td class="text-nowrap">
                    <img :src="staff.profile" v-if="staff.profile !== ''" width="50" height="50" class="rounded" alt="">
                    <img src="../../assets/flash/1.png" v-else width="50" height="50" class="rounded" alt="">
                  </td>
                  <td class="text-nowrap">{{ staff.name }}</td>
                  <td class="text-nowrap">{{ staff.phone }}</td>
                  <td class="text-nowrap">{{ staff.department }}</td>

                  <td class="text-nowrap">{{ staff.dateOfBirth }}</td>
                  <td class="text-nowrap text-danger">{{ staff.salary }} Ks</td>
                  <td class="text-nowrap text-center">
                    <button type="button" class="btn btn-primary btn-sm mx-1" @click="openDetailBox(staff)">
                      <i class="fas fa-info-circle"></i>
                    </button>
                    <button type="button" class="btn btn-warning btn-sm mx-1" @click="openEditBox(staff)"
                      data-bs-toggle="modal" data-bs-target="#staffEditModal">
                      <i class="fas fa-edit"></i>
                    </button>

                    <div class="modal fade" style="z-index: 10000;" id="staffEditModal" tabindex="-1"
                      aria-labelledby="liveCountModalLabel" aria-hidden="true">
                      <div class="modal-dialog">
                        <div class="modal-content">
                          <div class="modal-header border-0">
                            <h5 class="modal-title" id="liveCountModalLabel">{{ $t('message.edit') }}</h5>
                            <button type="button" id="btn-close" class="btn-close" data-bs-dismiss="modal"
                              aria-label="Close"></button>
                          </div>
                          <div class="modal-body">
                            <div class="row">
                              <div class="text-start d-flex align-items-center justify-content-center">
                                <img :src="selectedCustomer.profile" v-if="selectedCustomer.profile !== ''" class="m-1"
                                  width="100" height="100" style="border-radius: var(--border-radius);" alt="">
                                <img src="../../assets/flash/1.png" v-else width="100" height="100" alt="">
                              </div>
                              <form @submit.prevent="handleUpdateStaff">
                                <div>
                                  <label for="img-input" class="mb-2">Upload Images (Optional)</label>
                                  <input type="file" @change="onChangeUpdatePhotoInput" accept="image/*" id="img-input"
                                    multiple class="form-control mb-3" ref="updatePhoto" placeholder="photo">
                                </div>
                                <div class="form-floating mb-3">
                                  <input type="text" required class="form-control" v-model="selectedCustomer.name"
                                    id="edit-staff-name" placeholder="enter name">
                                  <label for="edit-staff-name">{{ $t('message.name') }}</label>
                                </div>
                                <div class="form-floating mb-3">
                                  <input type="text" required class="form-control" v-model="selectedCustomer.phone"
                                    id="edit-staff-phone" placeholder="enter phone">
                                  <label for="edit-staff-phone">{{ $t('message.phone') }}</label>
                                </div>
                                <div class="form-floating mb-3">
                                  <input type="text" required class="form-control" v-model="selectedCustomer.address"
                                    id="edit-staff-address" placeholder="enter address">
                                  <label for="edit-staff-address">{{ $t('message.address') }}</label>
                                </div>
                                <div class="form-floating mb-3">
                                  <input type="text" required class="form-control" v-model="selectedCustomer.staffId"
                                    id="edit-staff-id" placeholder="enter staff id">
                                  <label for="edit-staff-id">{{ $t('message.staff_id') }}</label>
                                </div>
                                <div class="form-floating mb-3">
                                <select required class="form-select fs-6 form-control form-select-lg rounded"
                                  style="border-radius: var(--border-radius) !important;" v-model="selectedCustomer.department"
                                  aria-label=".form-select-sm example">
                                  <option :value="department.name" v-for="(department,i) in departments" :selected="i===0"  :key="department.id">{{
                                    department.name
                                  }}</option>
                                </select>
                                <label class="form-label">{{$t('message.department')}}</label>
                              </div>
                                <div class="form-floating mb-3">
                                  <input type="text" required class="form-control" v-model="selectedCustomer.salary"
                                    id="edit-staff-salary" placeholder="enter staff basic salary">
                                  <label for="edit-staff-salary">{{ $t('message.basic_salary') }}</label>
                                </div>
                                <div class="form-floating mb-3">
                                  
                                  <input type="date" class="form-control" v-model="selectedCustomer.dateOfBirth"
                                    id="edit-staff-salary" placeholder="enter staff basic salary">
                                  <label for="edit-staff-salary">{{ $t('message.basic_salary') }}</label>
                                </div>
                                <div class="d-flex justify-content-end">
                                  <button type="submit" class="btn text-light" data-bs-dismiss="modal"
                                    style="background-color: var(--primary);">{{ $t('message.confirm') }}</button>

                                </div>
                              </form>


                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button class="btn btn-danger btn-sm me-1" @click="deleteCustomer(staff)"><i
                        class="fas fa-trash"></i></button>

                  </td>
                  <!--                <td><i class="fas fa-calendar m-1"></i> <span>{{customer.createdAt.toDate().toLocaleDateString()}}</span> <i class="fas fa-clock mx-1"></i> <span>{{customer.createdAt.toDate().toLocaleTimeString()}}</span></td>-->
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>

    </div>

  </admin-sidebar>

</template>

<script>
import db, { timestamp } from "@/config/FirebaseInit";
import Loading from "@/components/Loading";
import InfoDialog from "@/components/InfoDialog";
import ConfirmDialog from "@/components/ConfirmDialog";
import AdminSidebar from "@/components/AdminSidebar";
import firebase from "firebase/compat";
import html2canvas from "html2canvas";
import _ from "lodash";
export default {
  components: { ConfirmDialog, InfoDialog, Loading, AdminSidebar },
  data() {
    return {
      dismissModal: 'true',
      file: '',
      staffs: [],
      newCategoryName: '',
      showTableVoucher: 'true',
      confirmStatus: '',
      editFile: '',
      selectedCustomer: '',
      productsOfCategory: [],
      staff: {
        name: "",
        id: "",
        image: "",
        age: "",
        staffId: "",
        dateOfBirth: "",
        department: "",
        address: "",
        salary: "",
        phone: "",
        profile: '',
        time: '',
      },
      departmentName: '',
      department: {
        name: "",
        id: ""
      },
      departments: [],
      selectedCustomerRecords: [],
      customerInvoice: [],
      selectedCustomerTotalCredit: '',
      selectedCustomerTotalDebit: '',
      toGetActive: true,

      searchedCustomerList: [],
      search: '',
      searchInvoiceValue: '',
      transactionDate: '',
      transactionAmount: '',
      transactionNote: '',

      costPerItem: [],
      invoiceHistories: [],
      selectedInvoice: '',

      loadingActive: false,
      infoModalActive: false,
      confirmActive: false,
      modalMessage: '',
      customerToDelete: '',

      showPaymentToggle: false,
      selectedPaymentType: '',
      showAllInvoiceActive: false,

    }
  },
  computed: {
    shopInfo() {
      return this.$store.getters.getShopInfo;
    },
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
    paymentMethods() {
      return this.$store.getters.getPaymentMethods;
    },
    creditInvoice() {
      if (!this.showAllInvoiceActive) {
        return this.customerInvoice.filter(invoice => invoice.credit > 0);
      } else if (this.searchInvoiceValue !== '') {
        return this.customerInvoice.filter(invoice => invoice.vouncherId.includes(this.searchInvoiceValue));
      } else {
        return this.customerInvoice;
      }
    }
  },
  async mounted() {
    this.$store.dispatch("getDateTime");
    this.$store.dispatch("getDay");
    this.$store.dispatch("getMonth");
    this.$store.dispatch("getYear");
    this.$store.dispatch("getPaymentMethods", this.owner);
    this.$store.dispatch("getShopInfo", this.owner);

    await db.collection(this.owner.city).doc(this.owner.shopId).collection('staffs').onSnapshot(snapshot => {
      this.staffs = [];
      snapshot.forEach(doc => {
        this.staffs.push(doc.data());
      });
    });
    await db.collection(this.owner.city)
      .doc(this.owner.shopId)
      .collection('department').onSnapshot(snapshot => {
        this.departments = [];
        snapshot.forEach(doc => {
          this.departments.push(doc.data());
        })
      })

  },
  methods: {
    async createDepartment() {
      if (this.department.id === "") {
        let deptRef = db.collection(this.owner.city)
          .doc(this.owner.shopId)
          .collection('department').doc();
        try {
          await deptRef.set({
            id: deptRef.id,
            name: this.departmentName
          })
          this.departmentName = "";
          console.log('success')
        } catch (error) {
          console.log(error.message)
        }

      } else {
        let deptRef = db.collection(this.owner.city)
          .doc(this.owner.shopId)
          .collection('department').doc(this.department.id);
        try {
          await deptRef.update({
            name: this.departmentName
          })
          this.department = '';
          this.departmentName = '';
          console.log('update success')
        } catch (error) {
          console.log(error.message)
        }
      }

    },
    searchStaff: _.debounce(function () {
      if (this.search !== '') {
        db.collection(this.owner.city)
          .doc(this.owner.shopId)
          .collection('staffs').orderBy('name').startAt(this.search).endAt(this.search + '~').onSnapshot(snapshot => {
            this.searchedCustomerList = [];
            snapshot.docs.filter(e => {
              this.searchedCustomerList.push(e.data());

            })
          })
      } else {
        this.searchedCustomerList = [];
      }
    }, 500),
    showAllInvoiceChange(e) {
      if (e.target.checked) {
        this.showAllInvoiceActive = true;
      } else {
        this.showAllInvoiceActive = false;
      }
    },
    resetPayment() {
      this.selectedPaymentType = '';
    },
    choosePaymentType(payment) {
      this.selectedPaymentType = payment;
      this.showPaymentToggle = !this.showPaymentToggle;
    },
    async printThis() {
      console.log("printing..");
      const el = this.$refs.printcontent;

      const options = {
        type: "dataURL",
      };
      const printCanvas = await html2canvas(el, options);

      const link = document.createElement("a");
      link.setAttribute('download', `${this.selectedProduct.vouncherId}.png`);
      link.setAttribute(
        "href",
        printCanvas
          .toDataURL("image/png")
          .replace("image/png", "image/octet-stream")
      );
      link.click();

      console.log("done");
    },

    getInvoiceFromTransaction(id) {
      this.costPerItem = [];
      this.totalPrice = 0;
      let filterInvoice = this.customerInvoice.filter(invoice => invoice.id === id);
      this.selectedInvoice = filterInvoice[0];
      db.collection(this.shopInfo.city).doc(this.shopInfo.id).collection('sellProducts').doc(this.selectedInvoice.id).collection('record').onSnapshot(snapshot => {
        this.invoiceHistories = [];
        snapshot.forEach(doc => {
          this.invoiceHistories.push(doc.data());
        })
      })
      for (let i = 0; i < this.selectedInvoice.countList.length; i++) {
        this.costPerItem.push(parseInt(this.selectedInvoice.sellPriceList[i]) * parseInt(this.selectedInvoice.countList[i]))
      }
      this.costPerItem.forEach(price => {
        this.totalPrice += parseInt(price);
      })
      /*db.collection(this.owner.city).doc(this.owner.shopId).collection('sellProducts').doc(id).onSnapshot(snapshot => {
        this.selectedInvoice = snapshot.data();
        console.log('selected credit',this.selectedInvoice);

      })*/
      // this.selectedInvoice = filterInvoice[0];

    },
    viewInvoice(invoice) {
      this.costPerItem = [];
      this.selectedInvoice = invoice;
      this.totalPrice = 0;
      //console.log(this.selectedProduct)
      for (let i = 0; i < this.selectedInvoice.countList.length; i++) {
        this.costPerItem.push(parseInt(this.selectedInvoice.sellPriceList[i]) * parseInt(this.selectedInvoice.countList[i]))
      }
      this.costPerItem.forEach(price => {
        this.totalPrice += parseInt(price);
      })
    },
    closeInfoModal() {
      this.infoModalActive = !this.infoModalActive;
    },
    cancel() {
      this.confirmActive = !this.confirmActive;
    },
    async deleteRecordAndDoc() {
      db.collection(this.owner.city).doc(this.owner.shopId).collection('staffs').doc(this.customerToDelete.id).delete().then(()=>{
        this.loadingActive = false;
      });

    },
    async confirm() {
      if (this.confirmStatus === 'delete') {
        this.loadingActive = true;
        this.confirmActive = !this.confirmActive;
        if (this.customerToDelete.image !== '') {
          const storageRef = await firebase.storage().ref();
          // Create a reference to the file to delete
          const imgRef = storageRef.child(`/${this.owner.city}/${this.owner.shopId}/staff/${this.customerToDelete.id}`)
          // Delete the file
          imgRef.delete().then(() => {
            console.log('delete ok');
            this.deleteRecordAndDoc();

            // File deleted successfully
          }).catch((error) => {
            console.log(error.message)
          });
        } else {
          await this.deleteRecordAndDoc()
        }

      } else {
        this.loadingActive = true;
        this.confirmActive = !this.confirmActive;
        console.log('edit confirmed')
        if (!this.editFile) {
          db.collection(this.owner.city).doc(this.owner.shopId).collection('staffs').doc(this.selectedCustomer.id).update({
            'name': this.selectedCustomer.name,
            'phone': this.selectedCustomer.phone,
            'address': this.selectedCustomer.address,
            'dateOfBirth':this.selectedCustomer.dateOfBirth,
            'salary':this.selectedCustomer.salary,
            'staffId':this.selectedCustomer.staffId,
            'department':this.selectedCustomer.department,
            
          }).then(() => {
            console.log('update ok')
          });
        } else {
          // console.log(this.selectedCustomer.id)
          const storageRef = firebase.storage().ref();
          const imgRef = storageRef.child(`/${this.owner.city}/${this.owner.shopId}/staff/${this.selectedCustomer.id}`)
          imgRef.put(this.editFile).on("state_changed", () => {
          }, error => {
            console.log(error);
          }, async () => {
            const img_src = await imgRef.getDownloadURL();
            this.selectedCustomer.image = img_src;
            await db.collection(this.owner.city).doc(this.owner.shopId).collection('staffs').doc(this.selectedCustomer.id).update({
              'name': this.selectedCustomer.name,
              'phone': this.selectedCustomer.phone,
              'address': this.selectedCustomer.address,
              'profile': img_src,
              'dateOfBirth':this.selectedCustomer.dateOfBirth,
              'salary':this.selectedCustomer.salary,
              'staffId':this.selectedCustomer.staffId,
              'department':this.selectedCustomer.department,
            }).then(() => {
              console.log('update ok')
            })
          })
        }
      }

    },
    deleteCustomer(customer) {
      this.customerToDelete = customer;
      this.confirmStatus = 'delete';
      this.modalMessage = 'Are you sure to Delete?'
      this.confirmActive = true;
    },
    async openEditBox(customer) {
      this.selectedCustomer = customer;

    },
    async openDetailBox(customer) {
      this.$router.push({ name: 'StaffDetail', params: { staff_id: customer.id } });
    },
    formatDate(payload) {
      const date = new Date(payload);
      let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
      let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
      let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
      return day + "-" + month + "-" + year;
    },
    onChangePhotoInput(e) {
      this.file = e.target.files[0];
    },
    onChangeUpdatePhotoInput(e) {
      this.editFile = e.target.files[0];
    },
    async handleUpdateStaff() {
      this.loadingActive = true;
      if (!this.editFile) {
        db.collection(this.owner.city).doc(this.owner.shopId).collection('staffs').doc(this.selectedCustomer.id).update({
          'name': this.selectedCustomer.name,
          'phone': this.selectedCustomer.phone,
          'department':this.selectedCustomer.department,
          'address':this.selectedCustomer.address,
          'dateOfBirth':this.selectedCustomer.dateOfBirth,
          'staffId':this.selectedCustomer.staffId,
          'salary':this.selectedCustomer.salary

        }).then(() => {
          console.log('update ok')
          this.loadingActive = false;
          document.getElementById('btn-close').click();
        })
      } else {
        console.log(this.selectedCustomer.id)
        const storageRef = firebase.storage().ref();
        const imgRef = storageRef.child(`/${this.owner.city}/${this.owner.shopId}/staff/${this.selectedCustomer.id}`)
        imgRef.put(this.editFile).on("state_changed", () => {
        }, error => {
          console.log(error);
        }, async () => {
          const img_src = await imgRef.getDownloadURL();
          this.selectedCustomer.image = img_src;
          await db.collection(this.owner.city).doc(this.owner.shopId).collection('staffs').doc(this.selectedCustomer.id).update({
            'name': this.selectedCustomer.name,
            'profile': img_src,
            'phone': this.selectedCustomer.phone,
            'department':this.selectedCustomer.department,
            'address':this.selectedCustomer.address,
            'dateOfBirth':this.formatDate(this.selectedCustomer.dateOfBirth),
            'staffId':this.selectedCustomer.staffId,
            'salary':this.selectedCustomer.salary
          }).then(() => {
            this.loadingActive = false;
            console.log('update ok')
            document.getElementById('btn-close').click();
          })
        })
      }


    },
    async upload() {
      if (this.staff.name !== '' && this.staff.phone != '') {
        this.loadingActive = true;
        const staffRef = await db.collection(this.owner.city).doc(this.owner.shopId).collection('staffs').doc()
        this.staff.id = staffRef.id;
        this.staff.time = timestamp;
        this.staff.dateOfBirth = this.formatDate(this.staff.dateOfBirth);
        if (this.file) {
          const storageRef = await firebase.storage().ref();
          const imgRef = storageRef.child(`/${this.owner.city}/${this.owner.shopId}/staff/${staffRef.id}`)
          imgRef.put(this.file).on("state_changed", () => {
          }, error => {
            console.log(error);
          }, async () => {
            const img_src = await imgRef.getDownloadURL();
            this.staff.profile = img_src;
            staffRef.set(this.staff).then(() => {
              this.loadingActive = false;
              this.infoModalActive = true;
              this.modalMessage = "Success"
              this.staff.name = '';
              this.staff.phone = '';
              this.staff.address = '';
              this.staff.dateOfBirth = '';
              this.staff.salary = "";
              this.staff.staffId = "";
              this.file = '';
            }).catch(error => {
              console.log(error.message)
            })
          });
        } else {
          staffRef.set(this.staff).then(() => {
            this.loadingActive = false;
            this.infoModalActive = true;
            this.modalMessage = "Success";
            this.staff.name = '';
            this.staff.phone = '';
            this.staff.address = '';
            this.staff.dateOfBirth = '';
            this.staff.salary = "";
            this.staff.staffId = "";
            this.file = '';
          }).catch(error => {
            console.log(error.message)
          })
        }
      } else {
        this.loadingActive = false;
        this.infoModalActive = true;
        this.modalMessage = "Enter Staff name and phone"
      }
    }
  }
}
</script>

<style scoped>
.btn-group {
  width: 100%;
}

.btn-group .btn {
  border: 1px solid var(--primary);
  border: none !important;
  box-shadow: none !important;
  outline: none !important;
  border-radius: 0px !important;
}

.btn-check {
  border: none !important;
  border-radius: var(--border-radius) !important;
}

.activeInvoice {
  background-color: var(--btnLight) !important;
}

tr {
  color: var(--text-color);
}

.card-container {
  height: 300px;
  overflow-y: scroll;
  overflow-x: hidden;
}

.btn-active {
  border-radius: 0px !important;
  border-bottom: 2px solid var(--primary) !important;
}

.voucher-list {
  border-top: 2px dashed black;
}

.voucher-box {
  height: 85vh;
  overflow-y: scroll;
}

.card-outside {
  border-radius: var(--border-radius);
  padding: 10px;
  height: 90vh;
  background-color: var(--light) !important;
}

@media only screen and (max-width: 1030px) {
  .content-box {
    margin-top: 90px;
  }
}
</style>