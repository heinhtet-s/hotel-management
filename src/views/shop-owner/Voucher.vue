<template>

  <div class="container-fluid" style="background-color: var(--background-color);color: var(--text-color);">
    <!--  Dialog-->
  <Loading v-if="loadingActive"/>
  <InfoDialog v-if="infoModalActive" :modal-message="modalMessage" v-on:close-modal="closeModal"/>
  <ConfirmDialog :modal-message="modalMessage" v-if="confirmActive" v-on:confirm="confirm" v-on:cancel="cancel"/>
  <ProductSelectModal :selectedProduct="selectedProduct" :owner="owner" :selectedRelatons="selectedRelations" v-if="showDialog" v-on:confirm-modal="confirmItem" v-on:close-modal="closeDialog"/>
<!--  End Dialog-->

    <div class="row">

      <div class="col-lg-2 p-0">
        <AdminSidebar/>
      </div>

      <div class="col-12 col-lg-10 mt-5">
        <div class="row">
          <div class="" >
            <div class="d-flex justify-content-between border-0 align-items-center">

              <button class="btn fs-5 d-none d-lg-block" style="color: var(--text-color);" @click="$router.back()">
                <i class="fas fa-chevron-left"></i>
                <span class="ms-1">{{$t('message.sale_setup')}}</span>
              </button>

              <!-- Mobile View-->
              <div class="dropdown d-lg-none">
                <button class="btn btn-outline-light text-dark" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="fas fa-ellipsis-vertical"></i>
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                  <li @click="printThis"><a class="dropdown-item" href="#"><i class="fas fa-save"></i>Save as image</a></li>
                  <li v-print="'#printcontent'"><a class="dropdown-item" href="#" ><i class="fas fa-print"></i>Test Print</a></li>
                  <li @click="addPaymentMethod"><a class="dropdown-item" href="#" ><i class="fas fa-credit-card"></i> Payment Method</a></li>
                  <li @click="addDiscount"><a class="dropdown-item" href="#" ><i class="fas fa-tag"></i> Discount</a></li>
                  <li @click="addCustomer"><a class="dropdown-item" href="#" ><i class="fas fa-user-plus"></i> Add Customer</a></li>
                  <li @click="removeCustomer"><a class="dropdown-item text-danger" href="#" ><i class="fas fa-user-minus"></i> Remove Customer</a></li>
                </ul>
              </div>
              <!-- End Mobile View-->

              <div class="d-flex"  >
                <div class="d-none d-lg-block">
                  <button class="btn" style="color: var(--text-color)!important;" @click="printThis"><i class="fas fa-save"></i></button>
                  <button class="btn" style="color: var(--text-color)!important;" v-print="'#printcontent'"><i class="fas fa-print"></i></button>
                </div>
                <button type="button" style="color: var(--text-color)!important;" class="btn" data-bs-dismiss="modal" @click="$router.back()" aria-label="Close"><i class="fas fa-times"></i></button>
              </div>
            </div>

            <div class="voucher-modal">
              <div class="row p-1">
                <!-- For large Screen Discount box-->
                <div class="col-12 col-lg-4 mx-auto modal-body-box">
                  <!--discount box-->
                  <div class="">
                    <p class="alert alert-warning m-1" v-if="showAlert"><i  class="fas fa-triangle-exclamation"></i> {{alertMessage}}</p>
                    <div class="discount-box p-2" v-if="showDiscountBox">
                      <div class="d-flex justify-content-between align-items-center mb-1">
                        <label class="form-label">{{ $t('message.discount') }} (Optional)</label>
                        <button class="btn btn-sm" style="background-color: var(--light);color: var(--discountPrimary);" @click="resetDiscount">
                          {{ $t('message.reset') }}</button>
                      </div>
                      <select class="form-select form-control" v-model="discountType" @change="discountType = $event.target.value" aria-label="Default select example">
                        <option value="price">{{ $t('message.by_price') }}</option>
                        <option value="rate">{{$t('message.by_rate')}}</option>
                      </select>
                      <div class="mt-2" v-if="discountType === 'rate'">
                        <input type="number" id="floatingRate" placeholder="enter rate" class="form-control" v-model="newDiscount" @input="discountChange">

                        <!--                            <div class="form-floating">
                                                      <label for="floatingRate">{{$t('message.enter_discount_rate')}}</label>
                                                    </div>-->
                        <div class="d-flex mt-1 justify-content-end">
                          <button class="btn btn-sm text-black d-none" style="background-color: var(--btnLight);" @click="discountChange">
                            {{ $t('message.add') }}</button>

                        </div>
                      </div>
                      <form @submit.prevent="discountPriceChange" class=" mt-2" v-if="discountType === 'price'">
                        <input type="number" required id="floatingRate" placeholder="enter amount" class="form-control" v-model="newDiscountPrice" >

                        <!--                            <div class="form-floating">
                        &lt;!&ndash;                              @input="discountPriceChange($event.target.value)"&ndash;&gt;
                                                      <label for="floatingRate">{{$t('message.enter_discount_ks')}}</label>
                                                    </div>-->
                        <div class="d-flex mt-1 justify-content-end">
                          <button type="submit" class="btn btn-sm text-black" style="background-color: var(--btnLight);">{{$t('message.add')}}</button>
                        </div>
                      </form>
                    </div>
                  </div>
                  <!--payment box -->
                  <div class="mt-2 p-2 discount-box" v-if="showPaymentBox">
                    <p class="alert alert-warning mt-2 " v-if="showWarning"><i  class="fas fa-triangle-exclamation"></i> {{warningMessage}}</p>
                    <div class="d-flex justify-content-between align-items-center">
                      <span>{{$t('message.pay_amount')}}</span>
                      <button class="btn btn-sm" @click="resetPayment" style="background-color: var(--light);color: var(--discountPrimary);">
                        {{ $t('message.reset') }}</button>
                    </div>
                    <button class="form-select text-start form-control mt-2" @click="showPaymentToggle=!showPaymentToggle">{{selectedPaymentType.paymentType}}</button>
                    <div class="payment-pop-up shadow-sm p-2 rounded" style="background-color: var(--background-color);"  v-if="showPaymentToggle" >
                      <li v-for="(type, index) in paymentMethods" :key="index" class=" my-1 list-unstyled text-black rounded text-start px-1" style="cursor:pointer;background-color: var(--light);" @click="choosePaymentType(type)">
                        <div class="w-100 d-flex align-items-center justify-content-start">
                          <img :src="type.url" v-if="type.url!==''" class="rounded" width="40" height="40" alt="">
                          <img src="../../assets/flash/1.png" width="50" height="50" class="rounded" v-else alt="">
                          <div class="d-flex flex-column ms-2">
                            <div class="d-flex">
                              <span>{{type.paymentType}}</span> <span v-if="type.accountName!==''">({{type.accountName}})</span>
                            </div>
                            <span style="color: var(--secondary);">{{type.accountNumber}}</span>
                          </div>
                        </div>
                      </li>
                    </div>
                    <span>{{$t('message.pay_amount')}}</span>
                    <div class="">
                      <input type="number" ref="payInput" id="floatingRate"  @input="calculatePayAmount" class="form-control me-1" v-model="payAmount" autofocus>

                      <div class="form-floating">
                        <!--                            <label for="floatingRate">{{ $t('message.enter_pay_amount') }}</label>-->
                      </div>
                      <div class="d-flex mt-1 justify-content-end">
                        <button class="btn btn-sm d-none" style="background-color: var(--btnLight);" @click="calculatePayAmount">
                          {{ $t('message.add') }}</button>

                      </div>
                      <!--                          <input type="text" class="form-control me-1" v-model="payAmount" placeholder="enter amount">-->
                    </div>
                  </div>
                  <!--note box-->
                  <div class="mt-2 p-2 discount-box">
                    <textarea cols="50" class="form-control" rows="3" v-model="checkoutItem.note" placeholder="enter note (optional)"></textarea>
                  </div>
                </div>
                <!--Customer box-->
                <div class="col-12 col-lg-4 mx-auto modal-body-box customer-box" v-if="showCustomerBox">
                  <div class="p-1 discount-box" >
                    <div class="d-flex justify-content-between align-items-center p-1">
                      <button class="btn btn-sm"  style="color: var(--primary);background-color: var(--side-bar-bg);" @click="showCustomerAddBox = true"><i class="fas fa-circle-plus"></i></button>
                      <span class="fs-5 text-warning" v-if="customerAlert"><i  class="fas fa-triangle-exclamation"></i>Customers </span>
                      <span class="fs-5" v-else>{{$t('message.customers')}}</span>
                      <button class="btn" style="color: var(--discountPrimary);" @click="removeCustomer"><i class="fas fa-user-minus"></i></button>
                    </div>
                    <div class="p-1 mb-1" style="background-color: var(--background-color);border-radius: var(--border-radius);" v-if="showCustomerAddBox">
                      <form @submit.prevent="addNewCustomer">
                        <!--                            customer add box-->
                        <div class="form-floating mb-3">
                          <input type="text" required class="form-control" v-model="customer.name" id="customer-name" placeholder="enter name">
                          <label for="barcode-input">Name</label>
                        </div>
                        <div class="form-floating mb-3">
                          <input type="text" required class="form-control" v-model="customer.phone" id="customer-phone" placeholder="enter phone">
                          <label for="barcode-input">Phone</label>
                        </div>
                        <div class="form-floating mb-3">
                          <textarea type="text" required class="form-control" rows="3" v-model="customer.address" id="customer-address" placeholder="enter address"></textarea>
                          <label for="barcode-input">Address</label>
                        </div>
                        <div class="d-flex">
                          <button class="btn w-50" style="border: 2px solid var(--btnLight);" @click.prevent="showCustomerAddBox=false">Cancel</button>

                          <button type="submit" class="btn w-50" style="background-color: var(--btnLight);">Add</button>

                        </div>
                      </form>
                    </div>
                    <div>
                      <input type="text" class="form-control" autocomplete="off" :placeholder="$t('message.search')" v-model="searchCustomer" @input="searchCustomerHandler">

                    </div>

                    <!-- customer list-->


                    <div class="row mt-2" v-if="searchCustomer" >
                      <div class="col-12" v-for="(customer,index) in searchedCustomerList"  :key="index" @click="setCustomer(customer)">
                        <div class="card d-flex customer-card" :class="selectedCustomer.id ==  customer.id? 'activeCustomer':''">
                          <div class="d-flex p-1 align-items-center">
                            <img :src="customer.image" class="rounded-circle " v-if="customer.image!==''" style="background-position: center; background-size: cover;" width="50" height="50" alt="">
                            <img src="../../assets/flash/1.png" v-else style="background-position: center;border-radius: var(--border-radius); background-size: cover;" width="50" height="50" alt="">
                            <div class="d-flex ms-2 text-start flex-column">
                              <span><i class="fas fa-user"></i> {{customer.name}}</span>
                              <span class="text-black-50"><i class="fas fa-phone-flip"></i> {{customer.phone}}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                    <div class="row mt-2" v-else >
                      <div class="col-12" v-for="(customer,index) in customers"  :key="index" @click="setCustomer(customer)">
                        <div class="card d-flex customer-card" :class="selectedCustomer.id ==  customer.id? 'activeCustomer':''">
                          <div class="d-flex p-1 align-items-center">
                            <img :src="customer.image" class="rounded-circle " v-if="customer.image!==''" style="background-position: center; background-size: cover;" width="50" height="50" alt="">
                            <img src="../../assets/flash/1.png" v-else style="background-position: center;border-radius: var(--border-radius); background-size: cover;" width="50" height="50" alt="">
                            <div class="d-flex ms-2 text-start flex-column">
                              <span><i class="fas fa-user"></i> {{customer.name}}</span>
                              <span class="text-black-50"><i class="fas fa-phone-flip"></i> {{customer.phone}}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                <!-- voucher box-->
                <div class="col-12 col-lg-4 modal-body-box mx-auto" v-if="showVoucherBox">
                  <!--                      <div class="btn-group p-1" role="group" aria-label="Basic radio toggle button group">
                                          <input type="radio" class="btn-check" @click="showTableVoucher = false" name="btnradio" id="btnradio1" autocomplete="off" checked>
                                          <label class="btn check-btn btn-primary"  for="btnradio1"><i class="fas fa-bars"></i>{{$t('message.list_view')}}</label>

                                          <input type="radio" class="btn-check" @click="showTableVoucher = true" name="btnradio" id="btnradio2" autocomplete="off">
                                          <label class="btn check-btn btn-primary" for="btnradio2"><i class="fas fa-table-cells"></i> {{$t('message.table_view')}}</label>

                                        </div>-->
                  <!----------Voucher 1  -->
                  <div class="voucher-box" v-if="voucherStyle === 'listStyle'" >
                    <div class="bg-white p-2 text-black py-3 px-3 " style="font-size: 12px;" ref="printcontent" id="printcontent">
                      <div class="d-flex fw-bold align-items-center "  >
                        <img :src="shopInfo.profileUrl" class="rounded me-2" width="150" height="150" v-if="showLogo==='true'" />
                        <div class="mt-1 d-flex flex-column w-100 px-2" :class="showLogo==='true'?'text-start':'text-center'">
                          <span class="fs-5 fw-bolder">{{shopInfo.name}}</span>
                          <span class="my-1">{{shopInfo.address}}</span>
                          <span><i class="fas fa-square-phone-flip"></i> {{shopInfo.phone}}</span>
                        </div>
                      </div>

                      <div class="text-start fw-bold d-flex flex-column pt-1 mx-2 mt-2 mb-2 voucher-list-solid">
                        <span class="mb-1">{{$t('message.voucher_no')}}: {{this.checkoutItem.vouncherId}}</span>
                        <span class="mb-1"  v-if="showName==='true' && checkoutItem.customerName!==''">Customer Name: {{this.checkoutItem.customerName}}</span>
                        <span class="mb-1"  v-if="showPhone==='true' && checkoutItem.customerPhone!==''">Customer Phone: {{this.checkoutItem.customerPhone}}</span>
                        <span class="mb-1">{{ $t('message.date') }}: {{dateTime}}</span>
                      </div>
                      <table class="w-100 table-1 border-0 table border-white">
                        <thead class="px-2">
                        <tr class="py-1" style="border-bottom: 2px dotted black !important; border-right: 0 !important; border-left: 0 !important; border-top: 0 !important;">
                          <th class="bg-white border-0 text-start text-wrap align-start" style="width: 40%;">{{$t('message.items')}}</th>
                          <th class="bg-white border-0 text-end text-nowrap align-start">{{$t('message.qty')}}</th>
                          <th class="bg-white border-0 text-end text-nowrap align-start">{{ $t('message.price') }}</th>
                          <th class="bg-white border-0 text-end text-nowrap align-start">{{ $t('message.amount') }}</th>
                        </tr>
                        </thead>
                        <tbody class="border-0 fw-bold p-0">
                        <tr class="border-0 mb-1 px-0 py-1"  v-for="(name,index) in checkoutItem.nameList" :key="index">
                          <td class="border-0 text-start text-wrap align-start" style="width: 40%;">{{ name }}</td>
                          <td class="border-0 text-end text-nowrap align-start">{{ checkoutItem.countList[index]}} {{checkoutItem.productUnitList[index]}}</td>
                          <td class="border-0 text-end text-nowrap align-start">{{ parseInt(checkoutItem.sellPriceList[index]).toLocaleString()}}</td>
                          <td class="border-0 text-end text-nowrap align-start">{{ parseInt(costPerItem[index]).toLocaleString() }} Ks</td>
                        </tr>
                        </tbody>
                      </table>
                      <div class="px-2 flex-column">
                        <div class="d-flex fw-bold py-1 voucher-list-top">
                          <span class="w-75 text-start">{{ $t('message.total') }}</span>
                          <span class="w-25 text-end">{{ parseInt(totalPrice).toLocaleString() }} Ks</span>
                        </div>
                        <div class="d-flex fw-bold py-1" v-if="shopInfo.tax!=='0'">
                          <span class="w-75 text-start">{{$t('message.tax')}}</span>
                          <span class="w-25 text-end">{{checkoutItem.tax}} Ks</span>

<!--                          <span class="w-25 text-end">{{((totalPrice*(parseInt(shopInfo.tax)/100)).toFixed(0)).toLocaleString()}} Ks</span>-->
                        </div>
                        <div class="d-flex fw-bold  py-1" v-if="checkoutItem.discount>0">
                          <span class="w-75 text-start">{{ $t('message.discount') }}</span>
                          <span class="w-25 text-end">{{parseInt(checkoutItem.discount).toLocaleString()}} Ks</span>
                        </div>

                        <div class="d-flex fw-bold py-1 voucher-list-top">
                          <span class="text-start w-75">{{$t('message.net_amount')}}</span>
                          <span class="text-end w-25">{{parseInt(checkoutItem.totalPrice).toLocaleString()}} Ks</span>
                        </div>
                        <div class="d-flex fw-bold  py-1">
                          <span class="text-start w-75">{{this.checkoutItem.paymentMethod}} {{ $t('message.cash_received') }}</span>
                          <span class="text-end w-25">{{ parseInt(checkoutItem.cashReceived).toLocaleString() }} Ks</span>
                        </div>
                        <div class="d-flex fw-bold py-1 voucher-list-top" v-if="checkoutItem.credit>0">
                          <span class="text-start w-75">{{ $t('message.credit') }}</span>
                          <span class="text-end w-25">{{ parseInt(checkoutItem.credit).toLocaleString() }} Ks</span>
                        </div>
                        <div class="d-flex fw-bold py-1 voucher-list-top" v-else>
                          <span class="text-start w-75">{{$t('message.change')}}</span>
                          <span class="text-end w-25">{{parseInt( checkoutItem.change).toLocaleString() }} Ks</span>
                        </div>
                        <div v-if="checkoutItem.note!==''">
                          <span class="mb-1" >* {{this.checkoutItem.note}}</span>
                        </div>
                        <div v-if="showRefund==='true'">
                          <span class="mb-1" >{{$t('message.restrict_refund')}}</span>

                        </div>


                        <div class="text-center">

                          <p class="fw-bold">{{$t('message.thank')}}</p>
                          <p class="mt-1">Power by Light Idea Software Development</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!----------Voucher 2  -->

                  <div class="voucher-box" v-else>
                    <div class="bg-white text-black p-3" ref="printcontent" id="printcontent">
                      <div class="text-center">
                        <div class="d-flex align-items-center text-start p-1" >
                          <img :src="shopInfo.profileUrl" class="rounded" width="70" height="70"/>
                          <div class="ms-2 d-flex flex-column">
                            <span class=" fs-5 fw-bolder">{{shopInfo.name}}</span>
                            <span class="my-1" style="font-size: 12px;">{{shopInfo.address}}</span>
                            <span style="font-size: 12px;"><i class="fas fa-phone-flip"></i> {{shopInfo.phone}}</span>
                          </div>
                        </div>
                        <div class="text-start d-flex justify-content-between pt-1">
                          <span class="mb-1" style="font-size: 12px;">{{ $t('message.voucher_no') }}: {{this.checkoutItem.vouncherId}}</span>
                          <span class="mb-1" style="font-size: 12px;">{{$t('message.date')}}: {{dateTime}}</span>
                        </div>
                        <div class="text-start d-flex">
                          <span class="mb-1"  v-if="showName==='true' && checkoutItem.customerName!==''">Customer :{{this.checkoutItem.customerName}}, </span>
                          <span class="mb-1 ms-1"  v-if="showPhone==='true' && checkoutItem.customerPhone!==''">{{this.checkoutItem.customerPhone}}</span>
                        </div>
                        <table class="table table-voucher">
                          <thead>
                          <tr>
                            <th class="text-start">{{$t('message.items')}}</th>
                            <th>{{ $t('message.qty') }}</th>
                            <th class="text-nowrap">{{$t('message.price')}}</th>
                            <th>{{$t('message.amount')}}</th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr v-for="(name,index) in checkoutItem.nameList" :key="index">
                            <td class="text-start">{{name}}</td>
                            <td class="text-nowrap text-center">{{ parseInt(checkoutItem.countList[index]).toLocaleString()}} {{checkoutItem.productUnitList[index]}}</td>
                            <td class="text-nowrap text-end">{{ parseInt(checkoutItem.sellPriceList[index]).toLocaleString() }} Ks</td>
                            <td class="text-nowrap text-end">{{parseInt( costPerItem[index]).toLocaleString() }} Ks</td>
                          </tr>
                          <tr class="table-bottom">
                            <td colspan="3" class=" text-end text-nowrap">{{ $t('message.total') }}:</td>
                            <td class="text-end ">{{parseInt(totalPrice).toLocaleString()}} Ks</td>
                          </tr>
                          <tr class="table-bottom" v-if="shopInfo.tax!=='0'" >
                            <td colspan="3" class="text-end text-nowrap">{{$t('message.tax')}}({{(shopInfo.tax).toLocaleString()}})%:</td>
                            <td class="text-end">{{(totalPrice*(parseInt(shopInfo.tax)/100)).toFixed(0).toLocaleString()}} Ks</td>
                          </tr>
                          <tr class="table-bottom" v-if="checkoutItem.discount>0">
                            <td colspan="3" class="text-end text-nowrap">{{ $t('message.discount') }}</td>
                            <td class="text-nowrap text-end">{{parseInt(checkoutItem.discount).toLocaleString()}} Ks</td>
                          </tr>
                          <tr class="table-bottom">
                            <td colspan="3" class="text-end text-nowrap" >{{$t('message.net_amount')}}</td>
                            <td class="text-nowrap text-end">{{parseInt(checkoutItem.totalPrice).toLocaleString()}} Ks</td>
                          </tr>
                          <tr class="table-bottom">
                            <td colspan="3" class="text-end text-nowrap">{{this.checkoutItem.paymentMethod}}{{$t('message.cash_received')}}</td>
                            <td class="text-nowrap text-end">{{ parseInt(checkoutItem.cashReceived).toLocaleString() }} Ks</td>
                          </tr>
                          <tr class="table-bottom" v-if="checkoutItem.credit>0">
                            <td colspan="3" class="text-end text-nowrap">{{$t('message.credit')}}</td>
                            <td class="text-nowrap text-end">{{ parseInt(checkoutItem.credit).toLocaleString() }} Ks</td>
                          </tr>
                          <tr class="table-bottom" v-else>
                            <td colspan="3" class="text-end text-nowrap">{{$t('message.change')}}</td>
                            <td class="text-nowrap text-end">{{parseInt( checkoutItem.change).toLocaleString() }} Ks</td>
                          </tr>
                          </tbody>
                        </table>

                        <p class="fw-bold">{{$t('message.thank')}}</p>
                        <p class="mt-1">Power by Light Idea Software Development</p>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
              <!-- <button class="btn btn-primary mx-auto w-50 mt-5">Print</button>-->
            </div>
            <div class="d-flex p-1 modal-footer align-items-center justify-center" style="z-index: 1000; background-color: var(--light);">
              <!-- <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>-->
              <button class="btn btn-primary mx-auto my-1 w-50" :disabled="sellNowActive==false" @click="sellNow" v-print="'#printcontent'" data-bs-dismiss="modal" >{{$t('message.sell_now')}}</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas';
import db, {timestamp} from "../../config/FirebaseInit";
import ConfirmDialog from "@/components/ConfirmDialog";
import InfoDialog from "@/components/InfoDialog";
import Loading from "@/components/Loading";
import AdminSidebar from "@/components/AdminSidebar";
import ProductSelectModal from "@/components/ProductSelectModal";
import 'lodash/debounce';
export default {
  components: {Loading, ConfirmDialog, InfoDialog, AdminSidebar, ProductSelectModal},
  data(){
    return{

      showCart:false,
      showTableVoucher:false,
      infoModalActive:false,
      modalMessage:'',
      loadingActive:false,
      confirmActive:false,

      //modal
      showDiscountInput:false,
      showPromotionInput:false,
      showDiscountPriceInput:false,

      showDiscountBox:true,
      showPaymentBox:true,
      showVoucherBox:true,
      showCustomerBox:true,

      selectedSellProductContainer:1,
      newDiscount:'',
      newDiscountPrice:'',
      newPromotion:'',
      showDialog:false,

      products:[],
      tax:0,

      totalPrice:0,
      originalProduct:"",
      showSearch:false,

      showAlert:false,
      alertMessage:'',
      discountType:'price',

      cashier:[],
      productCategories:[],

      selectedCategory:'All',
      selectedSearchType:'',
      selectedSelectionIndex:'',

      //for count*price of each order
      costPerItem:[],
      casherCode:'',

      //Relations
      relation:[],
      selectedProduct:'',
      frontNumber: 1,
      frontUnit: 'Pcs',
      selectedRelation:'',
      selectedRelations:[],

      pcsList:[],
      customers:[],
      searchCustomer:'',

      showPaymentToggle:false,
      showCustomerAddBox:false,
      customerAlert:false,
      voucherStyle:'',
      // paymentMethods:[],
      filterProducts:[],
      selectedPaymentType:'',
      payAmount:'',
      selectedCustomer:'',
      limit:20,
      showWarning:true,
      warningMessage:'',
      sellNowActive:true,
      // sellItems:'',
      searchedCustomerList:[],
      customer:{
        name:"",
        id:"",
        image:"",
        debt:"0",
        address:"",
        phone:"",
        month:"",
        day:"",
        year:"",
        time:"",
      },
      timeout:null,
      finalSelection :[]
    }
  },
  computed:{
    checkoutItem(){
      return this.$store.getters.getVoucher;
    },
    selectedSellProduct(){
      return this.$store.getters.getSelectedVoucherProduct
    },
    selectedSellProductLists(){
      return this.$store.getters.getSelectedSellProductLists;
    },

    showName(){
      return localStorage.getItem('showCustomerName');
    },
    showLogo(){
      return localStorage.getItem('showLogoImage');
    },
    paymentMethods(){
      return this.$store.getters.getPaymentMethods;
    },
    showPhone(){
      return localStorage.getItem('showCustomerPhone');
    },
    showRefund(){
      return localStorage.getItem('showRefund');
    },
    cashierAcc(){
      return this.$store.getters.getCashierAcc;
    },

    owner(){
      return this.$store.getters.getShopOwner;
    },
    shopInfo(){
      return this.$store.getters.getShopInfo;
    },
    today(){
      return this.$store.getters.getDay;
    },
    thisMonth(){
      return this.$store.getters.getMonth;
    },
    thisYear(){
      return this.$store.getters.getYear;
    },
    dateTime(){
      return this.$store.getters.getDateTime;
    },
  },
  async mounted() {
    this.$refs.payInput.focus();


    if(localStorage.getItem('voucherStyle')){
      this.voucherStyle =localStorage.getItem('voucherStyle');
    }

    this.warningMessage = this.$t('message.enter_pay_amount');
    this.$store.dispatch("getShopInfo",this.owner);
    this.$store.dispatch("getDay");
    this.$store.dispatch("getMonth");
    this.$store.dispatch("getDateTime");
    this.$store.dispatch("getYear");
    this.$store.dispatch("getPaymentMethods",this.owner);
    this.$store.dispatch("getCashierAcc",this.owner);
    // await db.collection(this.shopInfo.city).doc(this.shopInfo.id).collection('sellProducts').where('day','==',this.today).where('casherCode','==',this.cashierAcc.accountCode).onSnapshot(snapshot => {
    //   this.sellItems = [];
    //   snapshot.forEach(doc=>{
    //     this.sellItems.push(doc.data());
    //   })
    //   console.log('sell item length',this.sellItems.length)
    // });

    if(this.paymentMethods.length>0){
      this.paymentMethods.forEach(doc=>{
        if(doc.paymentType === 'Cash'){
          // console.log('cash',doc)
          this.selectedPaymentType = doc;
          console.log('selected payment',this.selectedPaymentType)
          this.checkoutItem.paymentMethod=this.selectedPaymentType.paymentType;
          // console.log(this.selectedPaymentType)
        }
      })
    }

    await db.collection(this.shopInfo.city).doc(this.shopInfo.id).collection('customer').orderBy('time','desc').onSnapshot(snapshot => {
      this.customers = [];
      snapshot.forEach(doc=>{
        this.customers.push(doc.data());
      })
    });

    this.selectedSellProduct.forEach(item=>{
      this.totalPrice += parseInt(item.sellPrice ) * parseInt(item.frontNumber);
      this.costPerItem.push(parseInt(item.sellPrice ) * parseInt(item.frontNumber));
      this.pcsList.push(parseInt(item.count))
    });
    this.selectedSellProduct.forEach(product=>{
      if(this.finalSelection.some(p=>p.id===product.id)){
        const duplicateId = this.finalSelection.findIndex(p => {
          return p.id === product.id
        });
        this.finalSelection[duplicateId].count += product.count;
      }else {
        this.finalSelection.push({
          "id":product.id,
          "count":product.count
        })
      }
    });
    console.log('final selection', this.finalSelection)
    console.log('pcs list',this.pcsList);
    console.log('selection', this.selectedSellProduct)
    this.payAmount =parseInt(this.checkoutItem.totalPrice);
    this.checkoutItem.cashReceived = this.checkoutItem.totalPrice;
    this.checkoutItem.credit = "0";
    this.checkoutItem.change = "0";
  },
  methods:{
    setViewOption(value){
      localStorage.setItem('gridView',value );
      this.gridView = value;
      window.location.reload();
    },

    inputFocus(){
      if(this.selectedSearchType === 'barcode'){
        this.$refs.barcodeSearch.focus();
      }
    },

    async addNewCustomer(){
      let customerRef = await db.collection(this.shopInfo.city).doc(this.shopInfo.id).collection('customer').doc();
      this.customer.id = customerRef.id;
      this.customer.day = this.today;
      this.customer.month = this.thisMonth;
      this.customer.year = this.thisYear;
      this.customer.time = timestamp;
      console.log(this.customer)
      await customerRef.set(this.customer).then(()=>{
        console.log('added new Customer');
        this.customer.name='';
        this.customer.phone='';
        this.customer.address='';
        this.showCustomerAddBox = false;
      }).then(()=>{
        console.log('customer added')
      })
    },

    resetPayment(){
      this.checkoutItem.cashReceived = '0';
      this.checkoutItem.credit='0';
      this.checkoutItem.change='0';
      this.payAmount = '';
      /*if(window.innerWidth<500){
        this.showPaymentBox = false;
      }*/
      this.customerAlert=false;
      this.showWarning = true;
      this.warningMessage = this.$t('message.enter_pay_amount')
      this.sellNowActive = false;
    },

    resetDiscount(){
      this.sellNowActive = false;
      this.checkoutItem.totalPrice = parseInt(this.checkoutItem.totalPrice) + parseInt(this.checkoutItem.discount);
      if(parseInt(this.checkoutItem.cashReceived)> parseInt(this.checkoutItem.totalPrice)){
        this.checkoutItem.change = parseInt(this.checkoutItem.cashReceived) - parseInt(this.checkoutItem.totalPrice);
      }else {
        this.checkoutItem.credit = parseInt(this.checkoutItem.totalPrice) - parseInt(this.checkoutItem.cashReceived);
      }
      if(this.checkoutItem.credit!=="0"){
        this.sellNowActive = false;
      }else {
        this.sellNowActive = true;
      }
      this.checkoutItem.discount = '0';
      this.newDiscountPrice='';
      this.newDiscount ='';
    },

    calculatePayAmount(e){
      this.payAmount = e.target.value;
      // this.showPaymentBox = !this.showPaymentBox;
      console.log(this.sellNowActive)
      this.checkoutItem.change='0';
      if(this.selectedPaymentType!==''){
        let credit = 0;
        let change = 0;
        this.checkoutItem.paymentMethod = this.selectedPaymentType.paymentType
        this.checkoutItem.cashReceived = this.payAmount.toString();
        if(this.payAmount!==''){
          if(this.selectedCustomer!==''){
            this.sellNowActive = true;
          }
          if(parseInt(this.payAmount)<parseInt(this.checkoutItem.totalPrice)){
            credit = parseInt(this.checkoutItem.totalPrice)-parseInt(this.checkoutItem.cashReceived);
            this.checkoutItem.credit = credit.toString();
            this.checkoutItem.change = '0';
            if(this.selectedCustomer===''){
              this.sellNowActive = false;
              this.showWarning = true;
              this.warningMessage = this.$t('message.please_add_customer');
              this.customerAlert = true;
              // this.payAmount = '';
            }
          }else {
            this.checkoutItem.cashReceived='0';
            this.showWarning = false;
            this.customerAlert=false;
            this.warningMessage = '';
            this.checkoutItem.cashReceived = this.payAmount.toString();
            change = parseInt(this.checkoutItem.cashReceived) - parseInt(this.checkoutItem.totalPrice);
            this.checkoutItem.change = change.toString();
            this.checkoutItem.credit='0';
            this.sellNowActive = true;
          }
        }else {
          this.warningMessage = this.$t('message.enter_pay_amount');
          this.showWarning = true;
          this.checkoutItem.cashReceived='0';
          this.sellNowActive = false;
        }
      }else {
        this.warningMessage = this.$t('message.please_choose_payment')
        this.showWarning = true;
        setTimeout(()=>{
          this.showWarning = false;
        },3000)
      }

    },

    choosePaymentType(type){
      this.selectedPaymentType = type;
      this.checkoutItem.paymentMethod = type.paymentType;
      this.checkoutItem.paymentId = type.id;
      this.showPaymentToggle = !this.showPaymentToggle;
    },

    setCustomer(customer){
      this.customerAlert = false;
      this.showWarning = false;
      this.warningMessage='';
      this.selectedCustomer = customer;
      if(window.innerWidth<500){
        this.showCustomerBox= false;
        this.showVoucherBox = true;
      }
      this.checkoutItem.customerName = customer.name;
      this.checkoutItem.customerId = customer.id;
      this.checkoutItem.customerPhone = customer.phone;
      this.checkoutItem.customerAddress = customer.address;
      if(this.selectedCustomer!==''){
        if(this.payAmount!==''){
          this.sellNowActive = true;
          this.showWarning = false;
        }else {
          this.showWarning = true;
          this.sellNowActive = false;
          this.warningMessage = this.$t('message.enter_pay_amount')
        }
      }else {
        this.sellNowActive = false;
      }

    },

    removeCustomer(){
      if(this.checkoutItem.totalPrice>this.checkoutItem.cashReceived){
        this.sellNowActive = false;
        this.customerAlert = true;
      }else {
        this.sellNowActive = true;
        this.customerAlert = false;
      }
      this.selectedCustomer='';
      if(window.innerWidth<500){
        this.showCustomerBox= false;
        this.showPaymentBox = true;
        this.showVoucherBox = true;
      }
      this.checkoutItem.customerName = "";
      this.checkoutItem.customerId = "";
      this.checkoutItem.customerPhone = "";
      this.checkoutItem.customerAddress = "";
    },

    countChangeInput(order){
      let tempStock = order.stock;
      if(order.stock>order.count){
        order.stock = order.stock-order.count;
      }else {
        order.count=0;
        order.stock = tempStock;
      }
    },

    generateVoucherId(padNumber){
      const date = new Date();
      let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
      let twoDigitMonth = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date);
      let twoDigitYear = date.getFullYear().toString().slice(-2);
      let vId='';
      //TODO: must be used owner selected casherCode
      vId = this.shopInfo.shopCode+this.cashierAcc.accountCode+twoDigitYear+twoDigitMonth+day+padNumber.toString().padStart(5,'0');
      return vId;
    },

   /* async sellNow(){
      this.recordBatchWrite();
    },*/

    async sellRecord(){
  
      this.finalSelection.forEach((p, i)=>{
        db.collection(this.shopInfo.city)
            .doc(this.shopInfo.id)
            .collection('products')
            .doc(p.id).get().then((snapshot)=>{
          let originalProduct = snapshot.data()
          let originalStock = originalProduct.stock;
          console.log('Original Stock', originalStock)
          let finalStock = 0;

          if(originalStock !==''){
            finalStock = parseInt(originalStock) - p.count;
            db.collection(this.shopInfo.city)
                .doc(this.shopInfo.id)
                .collection('products')
                .doc(p.id).update({'stock':finalStock+""});
            console.log('stock update', i);
          }else {
            finalStock = originalStock;
          }

          const recordRef = db.collection(this.shopInfo.city)
              .doc(this.shopInfo.id)
              .collection('products')
              .doc(p.id).collection("records").doc();

          recordRef.set({
            'id':originalProduct.id,
            'recordId':recordRef.id,
            'itemCode':originalProduct.itemCode,
            'barcode':originalProduct.barcode,
            'itemName':originalProduct.itemName,
            'buyPrice':originalProduct.buyPrice.toString(),
            'sellPrice':originalProduct.sellPrice.toString(),
            'stock':finalStock+"",
            'description':originalProduct.description,
            'type':originalProduct.type,
            'color':originalProduct.color,
            'size':originalProduct.size,
            'weight':originalProduct.weight,
            'time':timestamp,
            'day':this.today,
            'month':this.thisMonth,
            'year':this.thisYear,
            'dateTime':this.dateTime,
            'rating':originalProduct.rating,
            'discount':originalProduct.discount,
            'note':'default',
            'process': 'offlineSell',
            'count':'-'+p.count
          });

          console.log('record update', i)

          if(this.finalSelection.length === i+1){
            this.loadingActive = false;
            this.selectedSellProduct = [];
            this.pcsList = [];
            this.selectedCustomer='';
            this.checkoutItem=[];
            this.payAmount ='';
            this.totalPrice=0;
            console.log('product record ok');
            this.$store.commit('clearSelectedSellProduct',localStorage.getItem('selectedSelection'));
            this.loadingActive = false;
            this.$router.back();
          }
        })
      });
     /* for(let i = 0; i<this.finalSelection.length;i++)
      {

      }*/
    },

    async sellNow(){
      this.loadingActive=true;
      let sellProductDB = db.collection(this.shopInfo.city).doc(this.shopInfo.id).collection('sellProducts').doc();
      this.checkoutItem.id=sellProductDB.id;
      this.checkoutItem.paymentId = this.selectedPaymentType.id;
      this.checkoutItem.month=this.thisMonth;
      this.checkoutItem.day = this.today;
      this.checkoutItem.dateTime =this.dateTime;
      this.checkoutItem.year = this.thisYear;
      this.checkoutItem.time = timestamp;

      let batch = db.batch();
      let customerName = '';
      let customerId ='';

      if(this.selectedCustomer!==''){
        customerName = this.selectedCustomer.name;
        customerId = this.selectedCustomer.id;
      }

      console.log('checkout items',this.checkoutItem);

      let sellProductRef = db.collection(this.shopInfo.city).doc(this.shopInfo.id).collection('sellProducts').doc(this.checkoutItem.id);
      batch.set(sellProductRef,this.checkoutItem);


      let voucherRecordRef =  db.collection(this.shopInfo.city).doc(this.shopInfo.id).collection('sellProducts').doc(this.checkoutItem.id).collection('record').doc();
      batch.set(voucherRecordRef,{
        'id':voucherRecordRef.id,
        'totalPrice':this.checkoutItem.totalPrice,
        'credit':this.checkoutItem.credit,
        'cashReceived':this.checkoutItem.cashReceived,
        'change':this.checkoutItem.change,
        'note':"",
        'paymentMethod':this.checkoutItem.paymentMethod,
        'dateTime':this.dateTime,
        'time':timestamp
      });

      let paymentRef = db.collection(this.shopInfo.city).doc(this.shopInfo.id).collection('paymentMethods').doc(this.selectedPaymentType.id).collection('transaction').doc();
      batch.set(paymentRef,{
        'id':paymentRef.id,
        'customerId':customerId,
        'customerName':customerName,
        'vouncherId':this.checkoutItem.vouncherId,
        'sellProductId':this.checkoutItem.id,
        'cashReceived':this.checkoutItem.cashReceived.toString(),
        'change':this.checkoutItem.change.toString(),
        'credit':this.checkoutItem.credit.toString(),
        'day':this.today,
        'month':this.thisMonth,
        'year':this.thisYear,
        'dateTime':this.dateTime,
        'time':timestamp
      });

      let paymentReceivedRef = db.collection(this.shopInfo.city).doc(this.shopInfo.id).collection('paymentReceived').doc();
      batch.set(paymentReceivedRef,{
        'day': this.today,
        'id': paymentReceivedRef.id,
        'month': this.thisMonth,
        'paymentId':paymentRef.id,
        'paymentName': this.checkoutItem.paymentMethod,
        'receivedAmount': this.checkoutItem.cashReceived.toString(),
        'status': "sell",
        'time':timestamp,
        'vouncherId':this.checkoutItem.vouncherId,
        'year':this.thisYear,
      });

      if(this.selectedCustomer!==''){
        let debt='';
        debt =(parseInt(this.selectedCustomer.debt) + parseInt(this.checkoutItem.credit));
        let customerDebtRef = db.collection(this.shopInfo.city).doc(this.shopInfo.id).collection('customer').doc(this.selectedCustomer.id);
        batch.update(customerDebtRef,{
          'debt':debt.toString()
        })
      }

      await batch.commit();
      this.sellRecord();
          /*.then(()=>{
        console.log('all record update')
      }).catch(err=>{
        console.log(err.message);
        this.modalMessage="Please Try again!";
        this.infoModalActive = true;
        this.loadingActive = false;
      });*/
    },

    afterSaleSave(){
      this.printThis();
      this.selectedSellProduct = [];
      this.pcsList = [];
    },

    afterSalePrint(){
      this.selectedSellProduct = [];
      this.pcsList = [];
    },

    async showSearchProduct(){
      this.showSearch = true;
      this.selectedCategory = "All";
    },

    discountChange(e){ //by rate
      this.newDiscount = e.target.value;
      console.log(this.newDiscount)
      let tax = (this.totalPrice*(this.checkoutItem.tax/100)).toFixed(0);
      if(this.newDiscount>=0 && this.newDiscount<=100){
        let discountPrice = ((this.newDiscount/100) * this.totalPrice).toFixed(0);
        this.checkoutItem.discount = discountPrice.toString();
        // this.newDiscount= discountPrice;
        if(parseInt(this.checkoutItem.totalPrice)>parseInt(this.checkoutItem.discount)){
          this.checkoutItem.totalPrice = ((this.totalPrice-parseInt(this.checkoutItem.discount)) + parseInt(tax)).toString();
          if(this.checkoutItem.cashReceived!=='0'){
            if(parseInt(this.checkoutItem.totalPrice)>parseInt(this.checkoutItem.cashReceived)){
              this.checkoutItem.change ='0';
              this.checkoutItem.credit = parseInt(this.checkoutItem.totalPrice) - parseInt(this.checkoutItem.cashReceived);
              if(this.selectedCustomer!==''){
                this.showWarning = true;
                this.warningMessage = this.$t('message.please_add_customer');
                this.sellNowActive = false;
              }else {
                this.sellNowActive = true;
              }
            }else {
              this.showWarning = false;
              this.checkoutItem.credit ='0';
              this.checkoutItem.change = (parseInt(this.checkoutItem.cashReceived) - parseInt(this.checkoutItem.totalPrice)).toString();
              this.sellNowActive = true;
            }
          }
          this.showDiscountInput = false;
          // this.newDiscountPrice='';
          // this.newDiscount='';
          // this.showDiscountInput = false;
        }else {
          this.showAlert = true;
          this.alertMessage = this.$t('message.discount_greater_total');
          this.checkoutItem.discount='0';
          this.newDiscountPrice ='';
          this.newDiscount='';
          setTimeout(()=>{
            this.showAlert = false;
          },3000)
        }

      }else {
        this.checkoutItem.discount='0';
        // this.newDiscount = '';
        // this.newDiscountPrice='';
        this.showAlert = true;
        this.alertMessage = this.$t('message.enter_discount_rate')
        setTimeout(()=>{
          this.showAlert = false;
        },3000);
      }
    },

    discountPriceChange(){ //discount, time =500
      console.log(this.newDiscount);
      let tax = (this.totalPrice*(this.checkoutItem.tax/100)).toFixed(0);
      if(this.newDiscountPrice!==''){
        let discountPrice = this.newDiscountPrice+parseInt(this.checkoutItem.discount);
        this.checkoutItem.discount =discountPrice.toString();
        if(parseInt(this.checkoutItem.totalPrice)>parseInt(this.checkoutItem.discount)){
          this.checkoutItem.totalPrice = ((this.totalPrice-parseInt(this.checkoutItem.discount)) + parseInt(tax)).toString();
          if(this.checkoutItem.cashReceived!=='0'){
            if(parseInt(this.checkoutItem.totalPrice)>parseInt(this.checkoutItem.cashReceived)){
              this.checkoutItem.change ='0';
              this.checkoutItem.credit = parseInt(this.checkoutItem.totalPrice) - parseInt(this.checkoutItem.cashReceived);
              if(this.checkoutItem.credit!=='0'){
                this.showWarning = true;
                this.warningMessage = this.$t('message.please_add_customer');
                this.sellNowActive = false;
              }else {
                if(this.selectedCustomer!==''){
                  this.showWarning = true;
                  this.warningMessage = this.$t('message.please_add_customer');
                  this.sellNowActive = false;
                }else {
                  this.sellNowActive = true;
                }
              }

            }else {
              this.showWarning = false;
              this.checkoutItem.credit ='0';
              this.checkoutItem.change = (parseInt(this.checkoutItem.cashReceived) - parseInt(this.checkoutItem.totalPrice)).toString();
              this.sellNowActive = true;
            }
          }
          this.showDiscountInput = false;
          this.newDiscountPrice='';
          // this.newDiscount='';
          // this.showDiscountInput = false;
        }else {
          this.showAlert = true;
          this.alertMessage = this.$t('message.discount_greater_total');
          this.checkoutItem.discount='0';
          this.newDiscountPrice ='';
          this.newDiscount='';
          setTimeout(()=>{
            this.showAlert = false;
          },3000)
        }

      }else {
        this.checkoutItem.discount='0';
        // this.newDiscount = '';
        // this.newDiscountPrice='';
        this.showAlert = true;
        this.alertMessage = this.$t('message.enter_discount_ks')
        setTimeout(()=>{
          this.showAlert = false;
        },3000)
      }
      /*clearTimeout(this.timeout);

      this.timeout = setTimeout(() => {

      }, time)*/

    },

    addPaymentMethod(){
      if(window.innerWidth<500){
        this.showPaymentBox = true;
        this.showCustomerBox = false;
        this.showDiscountBox = false;
        this.showVoucherBox = true;
      }

    },

    addDiscount(){
      this.newDiscount = 0;
      this.newDiscountPrice = 0;
      this.showDiscountInput = true;
      this.showDiscountBox = true;
    },

    addCustomer(){
      if(window.innerWidth<500){
        this.showCustomerBox = true;
        this.showDiscountBox = false;
        this.showPaymentBox = false;
        this.showVoucherBox = false;
      }
    },

    addPromotion(){
      this.showDiscountInput = false;
      this.showPromotionInput = true;
      this.showDiscountPriceInput = false;
    },

    confirm(){
      //this.loadingActive = true;
      this.confirmActive = !this.confirmActive;
      //console.log(this.checkoutItem)
      db.collection(this.shopInfo.city).doc(this.shopInfo.id).collection('promotionCode').doc(this.deleteId).delete().then(()=>{
        //this.loadingActive = false;
        this.modalMessage='Deleted';
        this.infoModalActive=true;
      });
    },

    cancel(){
      this.confirmActive = !this.confirmActive;
    },

    closeModal(){
      this.infoModalActive = !this.infoModalActive;
    },

    closeDialog(){
      if(this.selectedSearchType === 'barcode'){
        this.$refs.barcodeSearch.focus();
      }
      this.showDialog = !this.showDialog;

    },

    getRandomStr(){
      const chars = "1234567890";
      let result = '';
      for ( let i = 0; i < 8; i++ ) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    },

    async printThis() {
      console.log("printing..");
      const el = this.$refs.printcontent;

      const options = {
        type: "dataURL",
      };
      const printCanvas = await html2canvas(el, options);

      const link = document.createElement("a");
      link.setAttribute('download', `${this.checkoutItem.vouncherId}.png`);
      link.setAttribute(
          "href",
          printCanvas
              .toDataURL("image/png")
              .replace("image/png", "image/octet-stream")
      );
      link.click();

      console.log("done");
    },

  },

}
</script>

<style scoped>
tr, td, th{
  color: black !important;
  background-color: white !important;
}
.table-bottom{
  background-color: var(--light);
}
.table-bottom td{
  border-radius: 0px;
  border: none !important;
}

.table-voucher thead th, .table-voucher tbody td {
  border:2px solid var(--primary) !important;
}

.modal-body-box{
  height: 80vh;
  overflow-x: hidden;
  overflow-y: scroll;
}
.voucher-box{
  height: 80vh;
  border-radius: var(--border-radius);
  overflow-x: hidden;
  overflow-y: scroll;
}
.active-btn{
  background-color: var(--btnLight);
}
.selected-box{
  height: inherit;
  max-height: 80vh;
  overflow-y: scroll;
  overflow-x: hidden;
  padding-bottom: 100px;
}


.customer-box{
  height: 79vh;
  color: var(--text-color) !important;
  border: 2px solid var(--light) !important;
  border-radius: var(--border-radius) !important;
}
.discount-box{
  color: var(--text-color) !important;
  border:2 px solid var(--light) !important;
  border-radius: var(--border-radius) !important;
}

.dropdown-item{
  cursor: pointer;
}

.voucher-list-solid{
  border-top: 2px solid black;
}
.voucher-list-top{
  border-top: 2px dotted black;
}

thead, tbody{
  border: none !important;
  color: var(--dark);
}

.alert-warning{
  border-radius: var(--border-radius)!important;
}
.customer-card{
  background-color: var(--light)!important;
  transition: 0.3s;
  cursor: pointer;
}
.customer-card:hover{
  background-color: var(--softPrimary) !important;
}
.activeCustomer{
  background-color: var(--softPrimary)!important;
}
.voucher-modal{
  height: 70vh;
  overflow-y: scroll;
}

.voucher-modal{
  height: 80vh;
}

@media only screen and (max-width: 500px) {
  .voucher-modal{
    height: inherit !important;
  }
  .voucher-box{
    height: inherit !important;
  }
  .modal-body-box{
    height: inherit !important;
  }

  .modal-body-box{
    height:75vh;
    overflow-x: hidden;
    overflow-y: scroll;
  }


}
</style>