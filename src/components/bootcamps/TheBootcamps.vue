<template>
  <base-card>
    <base-button
      @click="setSelectedTab('all-bootcamps')"
      :mode="allBootcampsBtnMode"
      ><router-link to="/bootcamps" :class="allBootcampsBtnClicked">All bootcamps</router-link></base-button
    >
    <base-button
      @click="setSelectedTab('add-bootcamp')"
      :mode="addBootcampBtnMode"
      ><router-link to="/new-bootcamp" :class="addBootcampBtnClicked">Add a bootcamp</router-link></base-button
    >
  </base-card>
</template>

<script>

export default {
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
    allBootcampsBtnClicked() {
      return this.selectedTab === 'all-bootcamps' ? 'selected' : null;
    },
    addBootcampBtnClicked() {
      return this.selectedTab === 'add-bootcamp' ? 'selected' : null;
    }
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
<style>
a{
  text-decoration: none;
  color: #640032;
  font-weight: 600;
  font-size: 14px;
}
.selected {
  color:white;
  border-color: #640032;
}

a:hover {
  color: white;
}
</style>
