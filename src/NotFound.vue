<template>
  <div>
    <div class="container-fluid">
      <div class="container">
        <div class="row min-vh-100" >
          <div class="col-12 col-lg-6 mx-auto text-center">
            <Vue3Lottie :animationData="NotFoundJSON" :height="300" :width="300" />
            <h1 class="my-5" style="color: var(--dark);">Oops! The page not found.</h1>
            <router-link class="breadcrumb-item text-decoration-none text-primary" :to="{name:'Home'}">Back to main page?</router-link>

          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
const NotFoundJSON = require('./assets/lotties/NotFound.json')
export default {
  data() {
    return {
      NotFoundJSON,
    }
  },

}
</script>

<style scoped>

</style>