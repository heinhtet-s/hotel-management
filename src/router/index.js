import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import ErrorDisplay from "../views/ErrorDisplay";
import ForgotPassword from "../views/ForgotPassword";
import UserProfile from "../views/UserProfile";
import ShopRegistration from "../views/admin/ShopRegistration";
import Dashboard from "../views/shop-owner/Inventory";
import ShopHome from "../views/shop-owner/Home";
import OwnerProfile from "../views/shop-owner/Profile";
import { getAuth } from "firebase/auth";
import "firebase/compat/auth";
import ShopOwnerLogin from "../views/shop-owner/ShopOwnerLogin";
import ItemCreate from "../views/product/ItemCreate";
import ItemList from "../views/product/ItemList";
import ShopOwnerCategoryManagement from "../views/category/ShopOwnerCategoryManagement";
import ItemEdit from "../views/product/ItemEdit";
import ItemDetil from "../views/product/ItemDetil";
import UsersControl from "../views/admin/UsersControl";
import ShopManagement from "../views/admin/ShopManagement";
import AdminHome from "../views/admin/Home";
import ShopEdit from "../views/admin/ShopEdit";
import ShopType from "../views/category/ShopType";
import DisplayPromoType from "../views/category/DisplayPromoType";
import CityCategory from "../views/category/CityCategory";
import TermsOfService from "../views/TermsOfService";
import NotFound from "@/NotFound";
import CreatePaymentTypes from "@/views/category/CreatePaymentTypes";
import PaymentMethods from "@/views/shop-owner/PaymentMethods";
import SellReport from "@/views/shop-owner/SellReport";
import GeneralSetting from "../views/shop-owner/GeneralSetting";
import CreateDeliveryService from "@/views/delivery/CreateDeliveryService";
import OwnerDeliveryService from "@/views/shop-owner/OwnerDeliveryService";
import AdminLogin from "@/views/admin/AdminLogin";
import store from "@/store";
import UserLogin from "@/views/UserLogin";
import FinancialDashboard from "../views/finanacial/FinancialDashboard";
import ShopDetail from "@/views/admin/ShopDetail";
import About from "@/views/About";
import OnlinePromotion from "@/views/promotion/OnlinePromotion";
import ExpireLists from "@/views/shop-owner/ExpireLists";
import Customer from "@/views/finanacial/Customer";
import ProductSellReport from "@/views/shop-owner/ProductSellReport";
import WarehouseManagement from "@/views/warehouse/WarehouseManagement";
import WarehouseProductDetail from "@/views/warehouse/WarehouseProductDetail";
import Supplier from "@/views/finanacial/Supplier";
import TransferRecord from "@/views/warehouse/TransferRecord";
import WareHouseTransfer from "@/views/admin/WareHouseTransfer";
import CustomerDetail from "@/views/finanacial/CustomerDetail";
import PaymentDetail from "@/views/shop-owner/PaymentDetail";
import Cashier from "@/views/shop-owner/Cashier";
import Expneses from "@/views/finanacial/Expneses";
import Refund from "@/views/shop-owner/Refund";
import BranchList from "@/views/branch/BranchList";
import BranchDetail from "@/views/branch/BranchDetail";
import Voucher from "@/views/shop-owner/Voucher";
import PurchaseVoucher from "@/views/shop-owner/PurchaseVoucher";
import PurchaseList from "@/views/shop-owner/PurchaseList";
import AddStock from "@/views/admin/product-manage/AddStock";
import Create from "@/views/admin/product-manage/Create";
import Detail from "@/views/admin/product-manage/Detail";
import Edit from "@/views/admin/product-manage/Edit";
import AdminSellReport from "@/views/admin/sell-report/AdminSellReport";
import AdminProductSellReport from "@/views/admin/sell-report/AdminProductSellReport";
import AdminRefund from "@/views/admin/sell-report/AdminRefund";
import AdminCustomerDetail from "@/views/admin/sell-report/AdminCustomerDetail";
import SellProductRestaurant from "@/views/restaurant/SellProductRestaurant";
import TableList from "@/views/restaurant/table/TableList";
import TableCreate from "@/views/restaurant/table/TableCreate";
import TableUpdate from "@/views/restaurant/table/TableUpdate";
import RestaurantVoucher from "@/views/restaurant/RestaurantVoucher";
import ApartmentHome from "@/views/apartment/ApartmentHome";
import CreateSwimmingPool from "@/views/swimmingPool/CreateSwimmingPool";
import DetailPool from "@/views/swimmingPool/DetailPool";
import EditSwimmingPool from "@/views/swimmingPool/EditSwimmingPool";
import ListSwimmingPool from "@/views/swimmingPool/ListSwimmingPool";
//swimming pool category
import ListSwimmingPoolCategory from "@/views/swimmingPool/category/ListSwimmingPoolCategory.vue";
import CreateSwimmingPoolCategory from "@/views/swimmingPool/category/CreateSwimmingPoolCategory.vue";
import EditSwimmingPoolCategory from "@/views/swimmingPool/category/EditSwimmingPoolCategory.vue";
//swimming pool party
import ListPartyPool from "@/views/swimmingPool/party/ListPartyPool.vue";
import CreatePartyPool from "@/views/swimmingPool/party/CreatePartyPool.vue";
import EditPartyPool from "@/views/swimmingPool/party/EditPartyPool.vue";
//swimming pool party category
import CreatePartyCategory from "@/views/swimmingPool/partyCategory/CreatePartyCategory.vue";
import CurrentStaying from "@/views/apartment/CurrentStaying";
import ApartmentCheckout from "@/views/apartment/ApartmentCheckout";

import CreateApartment from "@/views/apartment/CreateApartment";
import UpdateApartment from "@/views/apartment/UpdateApartment";
import TableReservation from "@/views/online-reservation/TableReservation";
import ReservationManagement from "@/views/online-reservation/ReservationManagement";
import AdminReservation from "@/views/online-reservation/AdminReservation";
import MakeReservation from "@/views/online-reservation/MakeReservation";
import DetailApartment from "@/views/apartment/DetailApartment";
import ApartmentReservationList from "@/views/apartment/ApartmentReservationList";
import ApartmentSellReport from "@/views/apartment/ApartmentSellReport";
import ApartmentProductSellReport from "@/views/apartment/ApartmentProductSellReport";
import ApartmentSellReportDetail from "@/views/apartment/ApartmentSellReportDetail";
import StaffList from "@/views/staff-management/StaffList";
import StaffDetail from "@/views/staff-management/StaffDetail";
import StaffAttendance from "@/views/staff-management/StaffAttendance";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/terms-of-services",
    name: "TermsOfService",
    component: TermsOfService,
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/online-reservation/:name",
    name: "TableReservation",
    component: TableReservation,
  },
  //Owner
  {
    path: "/shop-owner",
    name: "ShopHome",
    component: ShopHome,
    meta: {
      title: "Shop Home",
      shopAuth: true,
    },
  },
  {
    path: "/shop-owner/sell-product-restaurant",
    name: "SellProductRestaurant",
    component: SellProductRestaurant,
    meta: {
      title: "Sell Product Restaurant",
      shopAuth: true,
    },
  },
  {
    path: "/reservation-management/:type",
    name: "reservationManagement",
    component: ReservationManagement,
  },
  {
    path: "/make-reservation",
    name: "MakeReservation",
    component: MakeReservation,
  },
  {
    path: "/make-reservation/:id",
    name: "MakeReservationId",
    component: MakeReservation,
  },
  {
    path: "/admin-reservation",
    name: "adminReservation",
    component: AdminReservation,
  },
  {
    path: "/shop-owner/voucher-setup",
    name: "Voucher",
    component: Voucher,
    meta: {
      title: "Sell Voucher",
      shopAuth: true,
    },
  },
  {
    path: "/shop-owner/restaurant-voucher-setup",
    name: "RestaurantVoucher",
    component: RestaurantVoucher,
    meta: {
      title: "Sell RestaurantVoucher",
      shopAuth: true,
    },
  },
  {
    path: "/shop-owner/sell-Report/:date_type/:selected_date?",
    name: "SellReport",
    component: SellReport,
    meta: {
      title: "Sell Report",
      shopAuth: true,
    },
  },
  {
    path: "/shop-owner/product-sell-Report",
    name: "ProductSellReport",
    component: ProductSellReport,
    meta: {
      title: "Product Sell Report",
      shopAuth: true,
    },
  },

  {
    path: "/shop-owner/dashboard",
    name: "ShopDashboard",
    component: Dashboard,
    meta: {
      title: "Owner Dashboard",
      shopAuth: true,
    },
  },
  {
    path: "/shop-owner/products/:category",
    props: true,
    name: "ProductList",
    component: ItemList,
    meta: {
      title: "Products",
      shopAuth: true,
    },
  },

  //  table start
  {
    path: "/shop-owner/table/:category",
    props: true,
    name: "TableList",
    component: TableList,
    meta: {
      title: "Table",
      shopAuth: true,
    },
  },
  {
    path: "/shop-owner/create-table/:category?",
    props: true,
    name: "TableCreate",
    component: TableCreate,
    meta: {
      title: "Create Product",
      shopAuth: true,
    },
  },
  {
    path: "/shop-owner/update-table/:table_id",
    props: true,
    name: "TableUpdate",
    component: TableUpdate,
    meta: {
      title: "Update Product",
      shopAuth: true,
    },
  },
  //  Table end

  //Apartment
  {
    path: "/shop-owner/apartment/:category",
    props: true,
    name: "Apartment",
    component: ApartmentHome,
    meta: {
      title: "Apartment",
      shopAuth: true,
    },
  },
  {
    path: "/shop-owner/apartment/create/:category?",
    props: true,
    name: "CreateApartment",
    component: CreateApartment,
    meta: {
      title: "Create Apartment",
      shopAuth: true,
    },
  },
  {
    path: "/shop-owner/apartment/update/:apartment_id",
    props: true,
    name: "UpdateApartment",
    component: UpdateApartment,
    meta: {
      title: "Update Apartment",
      shopAuth: true,
    },
  },
  {
    path: "/shop-owner/apartment/detail/:apartment_id",
    props: true,
    name: "DetailApartment",
    component: DetailApartment,
    meta: {
      title: "Detail Apartment",
      shopAuth: true,
    },
  },

  {
    path: "/shop-owner/apartment/reservation/:date_type?/:selected_date",
    props: true,
    name: "ApartmentReservationList",
    component: ApartmentReservationList,
    meta: {
      title: "Apartment Reservation",
      shopAuth: true,
    },
  },
  {
    path: "/shop-owner/apartment/checkout/:reservation_id",
    props: true,
    name: "ApartmentCheckout",
    component: ApartmentCheckout,
    meta: {
      title: "ApartmentCheckout",
      shopAuth: true,
    },
  },
  {
    path: "/shop-owner/apartment/current-staying/:roomID",
    props: true,
    name: "CurrentStaying",
    component: CurrentStaying,
    meta: {
      title: "CurrentStaying",
      shopAuth: true,
    },
  },
  {
    path: "/shop-owner/apartment/sell-report/:date_type/:selected_date",
    props: true,
    name: "ApartmentSellReport",
    component: ApartmentSellReport,
    meta: {
      title: "ApartmentSellReport",
      shopAuth: true,
    },
  },
  {
    path: "/shop-owner/apartment/product-sell-report",
    props: true,
    name: "ApartmentProductSellReport",
    component: ApartmentProductSellReport,
    meta: {
      title: "ApartmentProductSellReport",
      shopAuth: true,
    },
  },
  {
    path: "/shop-owner/apartment/sell-report/detail",
    props: true,
    name: "ApartmentSellReportDetail",
    component: ApartmentSellReportDetail,
    meta: {
      title: "ApartmentSellReportDetail",
      shopAuth: true,
    },
  },

  //  Apartment end
  //  Staff Management
  {
    path: "/shop-owner/staff-management/staff",
    props: true,
    name: "StaffList",
    component: StaffList,
    meta: {
      title: "Staff Management",
      shopAuth: true,
    },
  },
  {
    path: "/shop-owner/staff-management/staff/:staff_id",
    props: true,
    name: "StaffDetail",
    component: StaffDetail,
    meta: {
      title: "Staff Detail",
      shopAuth: true,
    },
  },
  {
    path: "/shop-owner/staff-management/attendance",
    props: true,
    name: "StaffAttendance",
    component: StaffAttendance,
    meta: {
      title: "Staff Attendance",
      shopAuth: true,
    },
  },
 

  //  Staff Management
  //  Swimming Pool
  {
    path: "/shop-owner/swimming-pool-list",
    props: true,
    name: "ListSwimmingPool",
    component: ListSwimmingPool,
    meta: {
      title: "List Swimming Pool",
      shopAuth: true,
    },
  },
  {
    path: "/shop-owner/swimming-pool-create",
    props: true,
    name: "CreateSwimmingPool",
    component: CreateSwimmingPool,
    meta: {
      title: "Create Swimming Pool",
      shopAuth: true,
    },
  },
  {
    path: "/shop-owner/swimming-pool-detail/:id",
    props: true,
    name: "DetailSwimmingPool",
    component: DetailPool,
    meta: {
      title: "Detail Swimming Pool",
      shopAuth: true,
    },
  },
  {
    path: "/shop-owner/swimming-pool-edit/:id",
    props: true,
    name: "EditSwimmingPool",
    component: EditSwimmingPool,
    meta: {
      title: "Edit Swimming Pool",
      shopAuth: true,
    },
  },
  //  Swimming Pool end

  // route for swimming pool
  {
    path: '/shop-owner/swimming-pool-category-list',
    props: true,
    name: 'ListSwimmingPoolCategory',
    component: ListSwimmingPoolCategory,
    meta: {
      title: "SwimmingPoll",
      shopAuth: true,
    }
  },
  {
    path: '/shop-owner/swimming-pool-category-create',
    props: true,
    name: 'CreateSwimmingPoolCategory',
    component: CreateSwimmingPoolCategory,
    meta: {
      title: "SwimmingPollCategoryCreate",
      shopAuth: true,
    }
  },
  {
    path: '/shop-owner/swimming-pool-category-edit/:id',
    props: true,
    name: 'EditSwimmingPoolCategory',
    component: EditSwimmingPoolCategory,
    meta: {
      title: "SwimmingPollCategoryEdit",
      shopAuth: true,
    }
  },
  // end swimming pool party 


  // swimming pool party  
  {
    path: '/shop-owner/swimming-party-category-list',
    props: true,
    name: 'ListPartyPool',
    component: ListPartyPool,
    meta: {
      title: "ListSwimmingPoolPartyCategory",
      shopAuth: true,
    }
  },
  {
    path: '/shop-owner/swimming-party-category-create',
    props: true,
    name: 'CreatePartyPool',
    component: CreatePartyPool,
    meta: {
      title: "CreateSwimmingPoolPartyCategory",
      shopAuth: true,
    }
  },
  {
    path: '/shop-owner/swimming-party-category-create',
    props: true,
    name: 'EditPartyPool',
    component: EditPartyPool,
    meta: {
      title: "EditSwimmingPoolPartyCategory",
      shopAuth: true,
    }
  },
  // end swimming pool party 
  // swimming party category  CreatePartyCategory
  {
    path: '/shop-owner/party-category-create',
    props: true,
    name: 'CreatePartyCategory',
    component: CreatePartyCategory,
    meta: {
      title: "CreatePartyCategory",
      shopAuth: true,
    }
  },
  // end swimming party category 
  // party
  {
    path: '/shop-owner/party-pool-create',
    props: true,
    name: 'CreatePartyPool',
    component: CreatePartyPool,
    meta: {
      title: "PartyPoolCreate",
      shopAuth: true,
    }
  },
  // party

  
  {
    path: "/shop-owner/purchase-voucher",
    props: true,
    name: "PurchaseVoucher",
    component: PurchaseVoucher,
    meta: {
      title: "PurchaseVoucher",
      shopAuth: true,
    },
  },
  {
    path: "/shop-owner/purchase-lists",
    props: true,
    name: "PurchaseList",
    component: PurchaseList,
    meta: {
      title: "PurchaseList",
      shopAuth: true,
    },
  },
  {
    path: "/shop-owner/expire-lists",
    name: "ExpireLists",
    component: ExpireLists,
    meta: {
      title: "Expire Lists",
      shopAuth: true,
    },
  },
  {
    path: "/shop-owner/create-product/:category?",
    props: true,
    name: "ProductCreate",
    component: ItemCreate,
    meta: {
      title: "Create Product",
      shopAuth: true,
    },
  },

  {
    path: "/shop-owner/product-edit/:product_id",
    props: true,
    name: "ProductEdit",
    component: ItemEdit,
    meta: {
      title: "Edit Product",
      shopAuth: true,
    },
  },
  {
    path: "/shop-owner/product-detail/:product_id",
    props: true,
    name: "ProductDetail",
    component: ItemDetil,
    meta: {
      title: "Product Detail",
      shopAuth: true,
    },
  },
  {
    path: "/shop-owner/create-category",
    name: "ShopOwnerCategoryManagement",
    component: ShopOwnerCategoryManagement,
    meta: {
      title: "Create Category",
      shopAuth: true,
    },
  },
  /*{
    path: '/shop-owner/promotion',
    name:'CreatePromotionCategory',
    component: CreatePromotionCategory,
    meta:{
      title:"In Shop Promotion",
      shopAuth: true,
    }
  },*/
  {
    path: "/shop-owner/online-promotion",
    name: "OnlinePromotion",
    component: OnlinePromotion,
    meta: {
      title: "Online Promotion",
      shopAuth: true,
    },
  },

  {
    path: "/shop-owner/payment-method",
    name: "PaymentMethods",
    component: PaymentMethods,
    meta: {
      title: "Payment Methods",
      shopAuth: true,
    },
  },
  {
    path: "/shop-owner/payment-method/:payment_id",
    name: "PaymentDetail",
    component: PaymentDetail,
    meta: {
      title: "Payment Details",
      shopAuth: true,
    },
  },
  {
    path: "/shop-owner/delivery-services",
    name: "OwnerDeliveryService",
    component: OwnerDeliveryService,
    meta: {
      title: "Delivery Services",
      shopAuth: true,
    },
  },
  {
    path: "/shop-owner/general-setting",
    name: "GeneralSetting",
    component: GeneralSetting,
    meta: {
      title: "General Setting",
      shopAuth: true,
    },
  },

  {
    path: "/shop-owner/profile",
    name: "OwnerProfile",
    component: OwnerProfile,
    meta: {
      title: "Owner Profile",
      shopAuth: true,
    },
  },

  {
    path: "/owner-login",
    name: "ShopOwnerLogin",
    component: ShopOwnerLogin,
  },
  {
    path: "/shop-owner/financial",
    name: "FinancialDashboard",
    component: FinancialDashboard,
    meta: {
      title: "Financial Dashboard",
      shopAuth: true,
    },
  },
  {
    path: "/shop-owner/financial/customer/:customer_id?/voucher/:voucher_id?",
    props: true,
    name: "CustomerDetail",
    component: CustomerDetail,
    meta: {
      title: "Customer Detail",
      shopAuth: true,
    },
  },
  {
    path: "/shop-owner/refund/customer/:customer_id?/voucher/:voucher_id?",
    props: true,
    name: "Refund",
    component: Refund,
    meta: {
      title: "Refund",
      shopAuth: true,
    },
  },

  {
    path: "/shop-owner/warehouses/:branch_city?/:branch_id?",
    name: "WarehouseManagement",
    component: WarehouseManagement,
    meta: {
      title: "Warehouse",
      shopAuth: true,
    },
  },
  {
    path: "/shop-owner/warehouses/product",
    name: "WarehouseProductDetail",
    component: WarehouseProductDetail,
    meta: {
      title: "Warehouse product",
      shopAuth: true,
    },
  },
  {
    path: "/shop-owner/warehouses/transfer-record",
    name: "TransferRecord",
    component: TransferRecord,
    meta: {
      title: "Transfer Record",
      shopAuth: true,
    },
  },
  {
    path: "/shop-owner/branches",
    name: "Branches",
    component: BranchList,
    meta: {
      title: "Branches",
      shopAuth: true,
    },
  },
  {
    path: "/shop-owner/branches/:city/:branch_id",
    props: true,
    // props: route => ({city:route.query.city, branch_id:route.query.branch_id}),
    name: "BranchDetail",
    component: BranchDetail,
    meta: {
      title: "Branch Detail",
      shopAuth: true,
    },
  },
  {
    path: "/shop-owner/customer",
    name: "Customer",
    component: Customer,
    meta: {
      title: "customer",
      shopAuth: true,
    },
  },
  {
    path: "/shop-owner/supplier",
    name: "Supplier",
    component: Supplier,
    meta: {
      title: "Supplier",
      shopAuth: true,
    },
  },
  {
    path: "/shop-owner/expenses",
    name: "Expenses",
    component: Expneses,
    meta: {
      title: "Expenses",
      shopAuth: true,
    },
  },
  {
    path: "/shop-owner/cashiers",
    name: "Cashier",
    component: Cashier,
    meta: {
      title: "Cashier",
      shopAuth: true,
    },
  },

  //admin
  {
    path: "/admin-login",
    name: "AdminLogin",
    component: AdminLogin,
    meta: {
      title: "Admin Home",
      adminAuth: false,
    },
  },
  {
    path: "/admin/home",
    name: "AdminHome",
    component: AdminHome,
    meta: {
      title: "Admin Home",
      adminAuth: true,
    },
  },
  {
    path: "/admin/shop-management",
    name: "ShopManagement",
    component: ShopManagement,
    meta: {
      title: "Admin Home",
      adminAuth: true,
    },
  },
  {
    path: "/admin/shop-management/warehouse",
    name: "WarehouseTransfer",
    component: WareHouseTransfer,
    meta: {
      title: "Admin Warehouse",
      adminAuth: true,
    },
  },
  {
    path: "/admin/shop-management/shop-type",
    name: "ShopType",
    component: ShopType,
    meta: {
      title: "Admin Home",
      adminAuth: true,
    },
  },
  {
    path: "/admin/shop-management/promo-display-type",
    name: "DisplayPromoType",
    component: DisplayPromoType,
    meta: {
      title: "Admin Home",
      adminAuth: true,
    },
  },
  {
    path: "/admin/shop-management/city-category",
    name: "CityCategory",
    component: CityCategory,
    meta: {
      title: "Admin Home",
      adminAuth: true,
    },
  },
  {
    path: "/admin/user/control",
    name: "UserControl",
    component: UsersControl,
    meta: {
      title: "Admin Home",
      adminAuth: true,
    },
  },
  {
    path: "/admin/shop-management/registration",
    name: "ShopRegistration",
    component: ShopRegistration,
    meta: {
      title: "Admin Home",
      adminAuth: true,
    },
  },
  {
    path: "/admin/shop-management/detail/:shop_id",
    props: true,
    name: "ShopDetail",
    component: ShopDetail,
    meta: {
      title: "Shop Detail",
      adminAuth: true,
    },
  },
  {
    path: "/admin/shop-management/edit/:shop_id",
    props: true,
    name: "ShopEdit",
    component: ShopEdit,
    meta: {
      title: "Shop Edit",
      adminAuth: true,
    },
  },
  {
    path: "/admin/shop-management/:shop_id/products",
    props: true,
    name: "AddStock",
    component: AddStock,
    meta: {
      title: "Shop Stock",
      adminAuth: true,
    },
  },
  {
    path: "/admin/shop-management/:shop_id/create-product",
    props: true,
    name: "Create",
    component: Create,
    meta: {
      title: "Add New Product",
      adminAuth: true,
    },
  },
  {
    path: "/admin/shop-management/:shop_id/product-detail/:product_id",
    props: true,
    name: "Detail",
    component: Detail,
    meta: {
      title: "Add New Product",
      adminAuth: true,
    },
  },
  {
    path: "/admin/shop-management/:shop_id/product-edit/:product_id",
    props: true,
    name: "Edit",
    component: Edit,
    meta: {
      title: "Edit Product",
      adminAuth: true,
    },
  },
  {
    path: "/admin/shop-management/:shop_id/sell-report",
    props: true,
    name: "AdminSellReport",
    component: AdminSellReport,
    meta: {
      title: "SellReport",
      adminAuth: true,
    },
  },
  {
    path: "/admin/shop-management/:shop_id/sell-product-report/customer/:customer_id/voucher/:voucher_id",
    props: true,
    name: "AdminProductSellReport",
    component: AdminProductSellReport,
    meta: {
      title: "Admin Product SellReport",
      adminAuth: true,
    },
  },

  {
    path: "/admin/shop-management/:shop_id/refund-voucher/:voucher_id/customer/:customer_id?",
    props: true,
    name: "AdminRefund",
    component: AdminRefund,
    meta: {
      title: "Admin Refund",
      adminAuth: true,
    },
  },
  {
    path: "/admin/shop-management/:shop_id/customer-detail/:voucher_id/customer/:customer_id?",
    props: true,
    name: "AdminCustomerDetail",
    component: AdminCustomerDetail,
    meta: {
      title: "Admin Customer Detail",
      adminAuth: true,
    },
  },

  {
    path: "/admin/shop-management/payment-method",
    name: "CreatePaymentTypes",
    component: CreatePaymentTypes,
    meta: {
      title: "Shop Payment",
      adminAuth: true,
    },
  },
  {
    path: "/admin/shop-management/delivery",
    name: "CreateDeliveryService",
    component: CreateDeliveryService,
    meta: {
      title: "Shop Delivery",
      adminAuth: true,
    },
  },
  //end admin

  //customer
  {
    path: "/profile",
    name: "UserProfile",
    component: UserProfile,
    meta: {
      title: "User Profile",
      requiresAuth: true,
    },
  },
  {
    path: "/user-login",
    name: "UserLogin",
    component: UserLogin,
    meta: {
      title: "User Login",
      requiresAuth: false,
    },
  },

  //end customer

  {
    path: "/error/:error",
    name: "ErrorDisplay",
    props: true,
    components: ErrorDisplay,
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    components: ForgotPassword,
  },
  {
    path: "/:catchAll(.*)",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    document.getElementById("app").scrollIntoView();
  },
});

router.beforeEach(async (to, from, next) => {
  //const currentUser = await firebase.getCurrentUser();
  // this.$store.dispatch('getCurrentShop');
  const shopOwner = store.getters.getShopOwner;
  const shopAuth = to.matched.some((record) => record.meta.shopAuth);
  if (shopAuth && !shopOwner) {
    next({ name: "ShopOwnerLogin" });
  } else {
    next();
  }
});

router.beforeEach(async (to, from, next) => {
  const currentUser = getAuth().currentUser;
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  if (requiresAuth && !currentUser) {
    next("/");
  } else {
    next();
  }
});

router.beforeEach(async (to, from, next) => {
  //const currentUser = await firebase.getCurrentUser();
  //const currentUser = getAuth().currentUser;
  const admin = store.getters.getAdmin;
  const requiresAuth = to.matched.some((record) => record.meta.adminAuth);
  // console.log(currentUser);

  if ((requiresAuth && admin === "") || undefined) {
    next({ name: "AdminLogin" });
  } else {
    next();
  }
});

export default router;
