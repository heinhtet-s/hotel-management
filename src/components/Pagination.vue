<template>
  <nav class="Page navigation example m-2">
    <ul class="pagination justify-content-center">
      <li class="page-item">
        <button
            class="page-link"
            type="button"
            @click="onClickFirstPage"
            :disabled="isInFirstPage"
        >
          First
        </button>
      </li>

      <li class="page-item">
        <button
            class="page-link"

            type="button"
            @click="onClickPreviousPage"
            :disabled="isInFirstPage"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
      </li>

      <!-- Visible Buttons Start -->

      <li
          v-for="(page,id) in pages"
          class="page-item"
          :key="id"
      >
        <button
            class="page-link"
            type="button"
            @click="onClickPage(page.name)"
            :disabled="page.isDisabled"
            :class="{ active: isPageActive(page.name) }"
        >
          {{ page.name }}
        </button>
      </li>

      <!-- Visible Buttons End -->

      <li class="page-item">
        <button
            type="button"
            class="page-link"

            @click="onClickNextPage"
            :disabled="isInLastPage"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </li>

      <li class="page-item">
        <button
            type="button"
            class="page-link"

            @click="onClickLastPage"
            :disabled="isInLastPage"
        >
          Last
        </button>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    maxVisibleButtons: {
      type: Number,
      required: false,
      default: 3
    },
    totalPages: {
      type: Number,
      required: true
    },
    perPage: {
      type: Number,
      required: true
    },
    currentPage: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      isInFirstPage:false,
      isInLastPage:false,
    };
  },
  computed:{
    startPage() {
      // When on the first page
      // if (this.currentPage === 0) {
      //   return 1;
      // }

      // When on the last page
      if (this.currentPage === this.totalPages) {
        return (this.totalPages-1) - this.maxVisibleButtons;
      }

      // When inbetween
      return this.currentPage;
    },
    pages() {
      const range = [];
      for (
          let i = this.startPage;
          i <= Math.min(this.startPage + this.maxVisibleButtons - 1, this.totalPages);
          i++
      ) {
        range.push({
          name: i+1,
          isDisabled: i === this.currentPage
        });
      }

      return range;
    },
  },
  methods: {
    onClickFirstPage() {
    if(this.isInLastPage === true){
        this.isInLastPage = false;
      }
      this.$emit('pagechanged', 0);
    },
    onClickPreviousPage() {
      if(this.currentPage===0){
        this.isInFirstPage = true;
      }else if(this.isInLastPage === true){
        this.isInLastPage = false;
      }else{
        this.$emit('pagechanged', this.currentPage - 1);
      }
    },
    onClickPage(page) {
      if(this.currentPage!==0 && this.isInFirstPage === true){
        this.isInFirstPage = false;
      }
      this.$emit('pagechanged', page);
    },
    onClickNextPage() {
      if(this.isInFirstPage === true){
        this.isInFirstPage = false;
      }

      if(this.currentPage+1 === this.totalPages){
        this.isInLastPage = true;
      }else {
        this.$emit('pagechanged', this.currentPage + 1);

      }
    },
    onClickLastPage() {
      if(this.isInFirstPage === true){
        this.isInFirstPage = false;
      }
      this.$emit('pagechanged', this.totalPages-1);
    },
    isPageActive(page) {
      return this.currentPage === page-1;
    }
  }

}
</script>

<style scoped>
.pagination {
  list-style-type: none;
}
button{
  background-color: var(--white);
  border:2px solid var(--light);
  margin: 2px;
  border-radius: var(--border-radius) !important;
}

.pagination-item {
  display: inline-block;
}
.page-link{
  color: var(--primary) !important;
}
.active {
  background-color: var(--primary);
  color: #ffffff !important;
}
</style>