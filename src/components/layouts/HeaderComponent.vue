<template>
  <header>
    <div class="nav">
      <navigation-component title="DevCamp"></navigation-component>
    </div>
  </header>
</template>

<script>
import NavigationComponent from './NavigationComponent.vue';
export default {
  components: {
    NavigationComponent,
  },
};
</script>

<style scoped>
Header {
  width: 100%;
  height: 7rem;
  background-color: #640032;
  display: flex;
  justify-content: center;
  flex-direction: column;
}
header h2 {
  margin: 0;
  color: white;
}
.topHeader {
  margin: 0 auto;
}
.nav {
  padding: 0.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
</style>
