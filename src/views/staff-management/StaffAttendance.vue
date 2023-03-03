<template>
    <!--  Shop-->
    <admin-sidebar>
        <Loading v-if="loadingActive" />
        <InfoDialog v-if="infoModalActive" :modal-message="modalMessage" v-on:close-modal="closeInfoModal" />
        <confirm-dialog :modal-message="modalMessage" v-if="confirmActive" v-on:confirm="confirm"
            v-on:cancel="cancel" />

        <div class="row" style="overflow-x: hidden;">

            <div class="d-flex justify-content-between align-items-center">
                <button @click="$router.back()" style="color: var(--primary);" class=" btn fs-5"><i
                        class="fas fa-chevron-left"> </i>
                    <span class="fs-3"> {{ $t("message.staff_attendance") }}</span>

                </button>
                <div class="btn-group p-1" role="group" aria-label="Basic radio toggle button group">
                    <input type="radio" class="btn-check" @click="showDaily" name="btnradio" id="btnradio1"
                        autocomplete="off" checked />
                    <label class="btn check-btn" :class="dateType === 'day' ? 'btn-primary' : ''" for="btnradio1">{{
                        $t("message.daily")
                    }}</label>

                    <input type="radio" class="btn-check" @click="showMonthly" name="btnradio" id="btnradio2"
                        autocomplete="off" />
                    <label class="btn check-btn" :class="dateType === 'month' ? 'btn-primary' : ''" for="btnradio2">{{
                        $t("message.monthly")
                    }}</label>

                    <input type="radio" class="btn-check" @click="showYearly" name="btnradio" id="btnradio3"
                        autocomplete="off" />
                    <label class="btn check-btn" :class="dateType === 'year' ? 'btn-primary' : ''" for="btnradio3">{{
                        $t("message.yearly")
                    }}</label>
                </div>
            </div>
            <div class="col-12 justify-content-between  d-flex my-3 align-items-center p-1"
                style="background-color: var(--light);border-radius: var(--border-radius);">
                <div class="d-flex align-items-center">
                    <i class="fas fa-qrcode fa-2x"></i>
                    <div class="ms-3">
                        <input type="text" class="form-control border-none" v-model="searchValue"
                            @keyup.enter="getStaffById" placeholder="scan here">
                    </div>
                </div>
                <div class="date-panel">
                    <div class="d-flex align-items-center rounded">
                        <div class="d-flex align-items-center p-1"
                            style="background-color:var(--white); border-radius: var(--border-radius);">
                            <i class="fas fa-search mx-2"></i>
                            <input type="text" v-model="staffSearch" class="form-control me-1" placeholder="STAFF ID">

                        </div>
                        <div>
                            <input type="date" @change="formatDate" class="form-control" v-if="dateType === 'day'" />

                        </div>
                        <div>
                            <input v-if="dateType === 'month'" type="month" @change="filterMonth"
                                class="form-control border-1 border-secondary"
                                style="background-color: var(--white) !important;border: 1px solid gray !important;" />

                        </div>
                        <NextDatePicker v-if="dateType === 'year'" v-model="selectedYear"
                            class="border-1 border-secondary" @change="yearChange" type="year"
                            placeholder="Select year"></NextDatePicker>

                        <vue-excel-xlsx :data="filterExportData" :columns="columns" :file-name="fileName" :file-type="'xlsx'"
                            :sheet-name="fileName"
                            class="btn btn-success ms-2 d-flex align-items-center border-success border-2">
                            <i class="fas fa-file-excel"></i><span class="ms-1"></span>
                        </vue-excel-xlsx>
                    </div>
                </div>

            </div>
            <div class="table-box" style="height: 65vh; overflow-y: scroll;">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Status</th>
                            <th>Name</th>
                            <th>Staff ID</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Working Hours</th>
                            <th>Department</th>
                            <th>Control</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(attendance, index) in filterAttendances" :key="attendance.id">
                            <td>{{ index+ 1 }}</td>
                            <td>
                                <span class="badge rounded text-black-50" style="background-color: var(--green);">{{
                                    attendance.status
                                }}</span>
                            </td>
                            <td>{{ attendance.name }}</td>
                            <td>{{ attendance.staffId }}</td>
                            <td>{{ formatTime(attendance.startTime )}}</td>
                            <td>{{ attendance.endTime?formatTime(attendance.endTime):"-" }}</td>
                            <td>{{ getWorkingHours(attendance.startTime, attendance.endTime) }}</td>
                            <td>{{ attendance.department }}</td>
                            <td>
                                <button class="btn btn-primary btn-sm me-2"><i class="fas fa-info-circle"></i></button>
                                <button class="btn btn-danger btn-sm"><i class="fas fa-trash"></i></button>

                            </td>
                        </tr>
                    </tbody>
                </table>

            </div>
            <div>
                <pagination :totalPages="pageCount" :perPage="perPage" :currentPage="currentPage" :pages="attendances"
                    @pagechanged="onPageChange" />
            </div>
        </div>

    </admin-sidebar>

</template>

<script default>
import db, { timestamp } from "@/config/FirebaseInit";
import Loading from "@/components/Loading";
import InfoDialog from "@/components/InfoDialog";
import ConfirmDialog from "@/components/ConfirmDialog";
import AdminSidebar from "@/components/AdminSidebar";
import Pagination from "@/components/Pagination"
export default {
    components: { ConfirmDialog, InfoDialog, Loading, AdminSidebar, Pagination },
    data() {
        return {
            attendances: [],
            loadingActive: false,
            infoModalActive: false,
            confirmActive: false,
            modalMessage: '',
            searchValue: '',
            staffs: '',
            dateType: "day",
            selectedDate: '',
            selectedYear: '',
            staffSearch: '',

            //pagination
            currentPage: 0,
            perPage: 31,
            exportData: [],
            fileName: "",
            scannedAttendance:'',

            //end pagination
            columns: [
                {
                    label: "Staff Name",
                    field: "name",
                },
                {
                    label: "Staff ID",
                    field: "staffId",
                },

                {
                    label: "Start Time",
                    field: "startTime",
                },
                {
                    label: "End Time",
                    field: "endTime",
                },
                {
                    label: "Status",
                    field: "status",
                },
                {
                    label: "Department",
                    field: "department",
                },{
                    label:"Date Time",
                    field:"dateTime"
                }
            
            ],
        }
    },
    computed: {
        filterExportData() {
            if (this.staffSearch !== "") {
                let filterAtten = [];
                for (let i = 0; i < this.attendances.length; i++) {
                    if (this.attendances[i].staffId.toLocaleLowerCase() === this.staffSearch.toLocaleLowerCase()) {
                        filterAtten.push(this.attendances[i]);
                    }
                }
                return filterAtten;
            } else {
                return this.exportData;
            }
        },
        filterAttendances() {
            let filtAttens = [];
            if (this.staffSearch !== "") {
                filtAttens = this.attendances.filter((attendance) =>
                    attendance.staffId.toLowerCase().includes(this.staffSearch.toLowerCase())
                );
                console.log("filtering", filtAttens);
                return filtAttens.slice(
                    this.offsetCount,
                    this.offsetCount + this.perPage
                );
            } else {
                return this.attendances.slice(
                    this.offsetCount,
                    this.offsetCount + this.perPage
                );
            }

        },
        pageCount() {
            return Math.ceil(this.attendances.length / this.perPage);
        },
        offsetCount() {
            return this.currentPage * this.perPage;
        },
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
        console.log(this.currentDay)
        this.dateType = "day";
        this.selectedDate = this.currentDay;
        this.fileName = this.currentDay+"-attendance"
        console.log(this.dateType, this.selectedDate)

        await this.getStaffAttendance();
    },
    methods: {
        getWorkingHours(startTime, endTime){
            if(endTime){
                const startSeconds = (parseInt(startTime.split(":")[0])*3600) + (parseInt(startTime.split(":")[1])*60)
                const endSeconds = (parseInt(endTime.split(":")[0])*3600) + (parseInt(endTime.split(":")[1])*60)
                const totalSeconds = Math.abs(startSeconds - endSeconds);
                const totalMinutes = Math.floor(totalSeconds / 60);
                // const seconds = totalSeconds % 60;
                const hours = Math.floor(totalMinutes / 60);
                const minutes = totalMinutes % 60;
                return hours+" hours" + "," + minutes+" minutes"
            }else{
                let currentDate = new Date();
                const startSeconds = (parseInt(startTime.split(":")[0])*3600) + (parseInt(startTime.split(":")[1])*60)
                const endSeconds = (currentDate.getHours()*3600) + (currentDate.getMinutes()*60)
                console.log(startSeconds, endSeconds)
                const totalSeconds = Math.abs(startSeconds - endSeconds);
                const totalMinutes = Math.floor(totalSeconds / 60);
                const hours = Math.floor(totalMinutes / 60);
                const minutes = totalMinutes % 60;
                return hours+" hours" + ", " + minutes+" minutes"
            }
        },
        onPageChange(page) {
            console.log(page);
            this.currentPage = page;
        },
        async getStaffById() {
            await db.collection(this.owner.city).doc(this.owner.shopId).collection('staffs').where("staffId", "==", this.searchValue).onSnapshot(snapshot => {
                let result = snapshot.docs[0].data();
                if (!this.attendances.some(att => att.staffId === result.staffId)) {
                    this.addAttendance(result);
                    this.searchValue = ""
                } else {
                    this.scannedAttendance = this.attendances.filter(att => att.staffId === result.staffId)[0];
                    console.log(this.scannedAttendance)
                    this.confirmActive = true;
                    this.modalMessage = "Finished working hour? Click yes to add end time."
                    this.searchValue = ""
                }
            });
        },
        currentTime() {
            let date = new Date();
            // const time = new Intl.DateTimeFormat('en-US', {
            //     hour12: true,
            //     hour: 'numeric',
            //     minute: 'numeric',
            // }).format(date);
            // console.log(time);
            return date.getHours()+":"+date.getMinutes();

        },
        formatTime(time){
            let ampm = parseInt(time.split(":")[0])>=12?'PM':'AM';
            let hours = parseInt(time.split(":")[0]) % 12 || 12;
            let minutes = time.split(":")[1]
            return hours+":"+minutes+" "+ampm;
        },
        addAttendance(staff) {
            let attendanceRef = db.collection(this.owner.city).doc(this.owner.shopId).collection('staffAttendance').doc();
            const data = {
                id: attendanceRef.id,
                name: staff.name,
                staffId: staff.staffId,
                department: staff.department,
                startTime: this.currentTime(),
                endTime: "",
                status: "Presence",
                dateTime:this.currentDateTime,
                day: this.currentDay,
                month: this.currentMonth,
                year: this.currentYear,
                time: timestamp
            }
            console.log(data)
            attendanceRef.set(data)
        },
        async getStaffAttendance() {
            console.log('datetype and date', this.dateType, this.selectedDate)
            await db.collection(this.owner.city).doc(this.owner.shopId).collection('staffAttendance').where(this.dateType, "==", this.selectedDate).onSnapshot(snapshot => {
                this.attendances = [];
                this.exportData = [];
                console.log(snapshot.docs.length)
                snapshot.forEach(doc => {
                    this.addToFilterOrders(doc.data())
                    this.attendances.push(doc.data());
                });
            });
        },

        closeInfoModal() {
            this.infoModalActive = !this.infoModalActive;
        },
        cancel() {
            this.confirmActive = !this.confirmActive;
        },
        async confirm() {
            this.confirmActive = false;
            let attendanceRef = db.collection(this.owner.city).doc(this.owner.shopId).collection('staffAttendance').doc(this.scannedAttendance.id);
            attendanceRef.update({
                endTime: this.currentTime()
            })

        },
        async filterMonth(e) {
            let date = new Date(e.target.value);
            let month = new Intl.DateTimeFormat("en", { month: "short" }).format(
                date
            );
            let year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(
                date
            );
            this.selectedDate = month + "-" + year;
            console.log(this.selectedDate);
            this.fileName = this.selectedDate + "-attendance";
            this.dateType = "month";
            await this.getStaffAttendance();
        },

        formatDate(e) {
            let date = new Date(e.target.value);
            let year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(
                date
            );
            let month = new Intl.DateTimeFormat("en", { month: "short" }).format(
                date
            );
            let day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);
            // return  day+"-"+month+"-"+year;
            let payload = day + "-" + month + "-" + year;
            this.selectedDate = payload;
            this.dateType = "day";
            this.getStaffAttendance();
        },

        async yearChange() {
            let date = new Date(this.selectedYear);
            this.dateType = "year";
            this.selectedDate = new Intl.DateTimeFormat("en", {
                year: "numeric",
            }).format(date);
            this.fileName = this.selectedDate + "-attendance";
            await this.getStaffAttendance();
        },
        async showDaily() {
            this.currentPage = 0;
            this.dateType = "day";
            this.selectedDate = this.currentDay;
            this.fileName = this.selectedDate + "-daily-attendance";
            await this.getStaffAttendance();
        },
        async showMonthly() {
            this.currentPage = 0;
            this.dateType = "month";
            this.selectedDate = this.currentMonth;
            this.fileName = this.selectedDate + "-monthly-attendance";
            await this.getStaffAttendance();
            
        },
        async showYearly() {
            this.currentPage = 0;
            this.dateType = "year";
            this.selectedDate = this.currentYear;
            this.fileName = this.selectedDate + "-yearly-attendance";
            await this.getStaffAttendance();
        },
        addToFilterOrders(doc) {
            const exportData = {
                staffId: doc.staffId,
                name: doc.name,
                status: doc.status,
                startTime: doc.startTime,
                endTime:doc.endTime,
                department: doc.department,
                dateTime:doc.dateTime
            };
            this.exportData.push(exportData);
        },

    }
}
</script>

<style scoped>
.check-btn {
    width: 80px !important;
}

.btn-group {
    border: 1px solid var(--primary);
    border-radius: var(--border-radius) !important;
    width: 35%;
}

.btn-group .btn {
    border-radius: var(--border-radius) !important;
}

.btn-check {
    border-radius: var(--border-radius) !important;
}

.btn-primary {
    border: 1px solid var(--primary) !important;
    background-color: var(--primary) !important;
}
</style>