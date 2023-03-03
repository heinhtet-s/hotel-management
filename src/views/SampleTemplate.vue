<template>
    <!--  Shop-->
    <admin-sidebar>
        <Loading v-if="loadingActive" />
        <InfoDialog v-if="infoModalActive" :modal-message="modalMessage" v-on:close-modal="closeInfoModal" />
        <confirm-dialog :modal-message="modalMessage" v-if="confirmActive" v-on:confirm="confirm"
            v-on:cancel="cancel" />

        <div class="row">

            <div class="d-flex align-items-center">
                <button @click="$router.back()" style="color: var(--primary);" class=" btn fs-5"><i
                        class="fas fa-chevron-left"> </i>                
                        <span class="fs-3">{{$t("message.something")}}</span>

                </button>
            </div>

        </div>

    </admin-sidebar>

</template>

<script default>
import db from "@/config/FirebaseInit";
import Loading from "@/components/Loading";
import InfoDialog from "@/components/InfoDialog";
import ConfirmDialog from "@/components/ConfirmDialog";
import AdminSidebar from "@/components/AdminSidebar";
export default {
    components: { ConfirmDialog, InfoDialog, Loading, AdminSidebar },
    data() {
        return {
            attendances:[],   
            loadingActive:false,
            infoModalActive:false,
            confirmActive:false,
            modalMessage:'',         
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
       
    },
    async mounted() {
        this.$store.dispatch("getDateTime");
        this.$store.dispatch("getDay");
        this.$store.dispatch("getMonth");
        this.$store.dispatch("getYear");
        this.$store.dispatch("getShopInfo", this.owner);

        await db.collection(this.owner.city).doc(this.owner.shopId).collection('staffAttendance').onSnapshot(snapshot => {
            this.attendances = [];
            snapshot.forEach(doc => {
                this.attendances.push(doc.data());
            });
        });
       

    },
    methods: {
        
        closeInfoModal() {
            this.infoModalActive = !this.infoModalActive;
        },
        cancel() {
            this.confirmActive = !this.confirmActive;
        },
        async confirm() {
            this.confirmActive = false;
        
        },
       
        formatDate(payload) {
            const date = new Date(payload);
            let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
            let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
            let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
            return day + "-" + month + "-" + year;
        },
        
    }
}
</script>

<style scoped>
</style>