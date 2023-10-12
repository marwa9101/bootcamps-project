<template>
  <base-card>
    <base-button
      @click="setSelectedTab('all-bootcamps')"
      :mode="allBootcampsBtnMode"
      >Bootcamps</base-button
    >
    <base-button
      @click="setSelectedTab('add-bootcamp')"
      :mode="addBootcampBtnMode"
      >Add a bootcamp</base-button
    >
  </base-card>
  <keep-alive>
    <component :is='selectedTab'></component>
  </keep-alive>
</template>

<script>
import AllBootcamps from './AllBootcamps.vue';
import AddBootcamp from './AddBootcamp.vue';

export default {
  components: {
    AllBootcamps,
    AddBootcamp,
  },
  data() {
    return {
      selectedTab: '',
      bootcamps: [
        
      ],
    };
  },
  provide() {
    return {
      bootcamps: this.bootcamps,
      addNewBootcamp: this.addNewBootcamp
    };
  },
  computed: {
    allBootcampsBtnMode() {
      return this.selectedTab === 'all-bootcamps' ? 'selected' : null;
    },
    addBootcampBtnMode() {
      return this.selectedTab === 'add-bootcamp' ? 'selected' : null;
    },
  },
  methods: {
    setSelectedTab(tab) {
      this.selectedTab = tab;
    },
    addNewBootcamp(name, description, website, phone, email) {
      const newBootcamp = {
        id: new Date().toISOString(),
        name: name,
          description: description,
          website: website,
          phone: phone,
          email: email
        }
      this.bootcamps.push(newBootcamp);
      this.selectedTab = 'all-bootcamps';
    },
  },
};
</script>
