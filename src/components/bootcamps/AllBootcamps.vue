<template>
  <bootcamp-component
    v-for="bootcamp in bootcamps"
    :key="bootcamp.email"
    :name="bootcamp.name"
    :description="bootcamp.description"
    :phone="bootcamp.phone"
    :email="bootcamp.email"
    :website="bootcamp.website"
    :address="bootcamp.address"
    @update-bootcamp="updateBootcamp"
  ></bootcamp-component>
</template>

<script>
import BootcampComponent from './BootcampComponent.vue';

export default {
  components: {
    BootcampComponent,
  },
  inject: ['bootcamps'],
  methods: {
    updateBootcamp(email) {
      console.log(email);
      const bootcamp = this.bootcamps.find(
        (bootcamp) => bootcamp.email === email
      );
      console.log(bootcamp);
      alert(`your ${bootcamp.name} bootcamp has been updated successfully`);
    },
  },
};
</script>
