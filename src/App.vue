<template>
  <header-component></header-component>
  <the-bootcamps></the-bootcamps>
  <router-view></router-view>
</template>

<script>
import HeaderComponent from './components/layouts/HeaderComponent.vue';
import TheBootcamps from './components/bootcamps/TheBootcamps.vue';

export default {
  components: {
    HeaderComponent,
    TheBootcamps
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat&family=Raleway&display=swap');
h2 {
  font-family: 'Montserrat', sans-serif;
}
body {
  font-family: 'Raleway', sans-serif;
}
</style>
