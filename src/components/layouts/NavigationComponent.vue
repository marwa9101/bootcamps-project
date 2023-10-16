<template>
  <div class="nav-left">
    <img class="icon" src="../../assets/logo.png" />
    <h3>{{ title }}</h3>
  </div>
  <div class="nav-right">
      <a>Bootcamps</a>
      <a>Courses</a>
      <a>About us</a>
      <router-link to="/login"><a>Login</a></router-link>
      <!-- <router-link to="/login">Login</router-link> -->
  </div>
</template>
<script>
export default {
  props: ['title'],
};
</script>

<style scoped>
.icon {
  padding-top: 0.3rem;
  width: 4rem;
}
.nav-left {
  display: flex;
  margin-right: 20px;
  flex-grow: 1;
}
.nav-left h3 {
  margin-left: 1rem;
  padding-top: 0.6rem;
  color: white;
}
.nav-right {
  display: flex;
}
a{
  margin-right: 80px; /* Ajoute de l'espace entre les liens */
  text-decoration: none; /* Supprime la décoration de lien par défaut */
  color: white; /* Couleur du texte des liens (ajustez selon vos préférences) */
}
</style>
