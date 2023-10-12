<template>
  <base-card>
    <h2>{{ name }}</h2>
    <p>{{ description }}</p>
    <base-button @click="toggleContacts" :mode="selectedBtn">Contact us</base-button>
    <ul v-if="contactsAreVisible">
      <li>Phone: {{ phone }}</li>
      <li>Email: {{ email }}</li>
      <li>Website:<a :href="website">{{website}}</a></li>
      <li>Address: {{ address }}</li>
    </ul>
    <div>
      <base-button mode="" @click="updateBootcamp">Update bootcamp</base-button>
      <base-button mode="">delete bootcamp</base-button>
    </div>
  </base-card>
</template>

<script>
export default {
  props: ['name', 'description', 'website', 'phone', 'address', 'email'],
  emits: ['update-bootcamp'],
  data() {
    return {
      contactsAreVisible: false
    };
  },
  methods: {
    toggleContacts() {
      this.contactsAreVisible = !this.contactsAreVisible;
    },
    updateBootcamp() {
      this.$emit('update-bootcamp', this.email);
    },
  },
  computed: {
    selectedBtn() {
      return this.contactsAreVisible ? 'selected' : null
    },
  }
};
</script>
