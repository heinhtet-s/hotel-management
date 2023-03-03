<template>
  <div class="container">
    <div class="row">
      <div class="col-12 col-lg-6 mx-auto">
        <h4>Oops! There is an error:</h4>
        <p>{{error}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:['error']
}
</script>

<style scoped>

</style>