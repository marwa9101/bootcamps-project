<template>
  <base-card>
    <div class="formHeader">
      <div class="formTop">
        <img src="../../assets/online-education.png" alt="bootcamp-icon" />
        <h1>DevCamp</h1>
      </div>
      <div class="formTitle">
        <h2>New Bootcamp Creation</h2>
      </div>
    </div>
    <form v-on:submit.prevent="aNewBootcamp">
      <div class="form-complete">
        <div class="form-controls">
          <div class="controls-form-top">
            <div class="form-control">
              <label for="name">Bootcamp name</label>
              <input type="text" id="name" name="name" ref="bootcampName" />
            </div>
            <div class="form-control">
              <label for="Description">Description</label>
              <textarea
                id="Description"
                name="Description"
                rows="3"
                ref="bootcampDescription"
              ></textarea>
            </div>
            <div class="form-control">
              <label for="website">website</label>
              <input
                type="url"
                id="website"
                name="website"
                ref="bootcampWebsite"
              />
            </div>
            <div class="form-control">
              <label for="phone">Phone Number</label>
              <input type="tel" id="phone" name="phone" ref="bootcampPhone" />
            </div>
            <div class="form-control">
              <label for="email">E-mail</label>
              <input type="email" id="email" name="email" ref="bootcampEmail" />
            </div>
          </div>

          <div class="controls-form-bottom">
            <div class="form-control">
              <label for="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                ref="bootcampAddress"
              />
            </div>
            <div class="form-control">
              <label for="careers">Careers</label>
              <input
                type="text"
                id="careers"
                name="careers"
                ref="bootcampCareers"
              />
            </div>
            <div class="form-control">
              <label for="photo">Photo</label>
              <input type="url" id="photo" name="photo" ref="bootcampPhoto" />
            </div>
            <div class="form-control">
              <label for="housing">Housing</label>
              <input
                type="checkbox"
                id="housing"
                name="housing"
                ref="bootcampHousing"
              />
            </div>
            <div class="form-control">
              <label for="jobAssistance">Job Assistance</label>
              <input
                type="checkbox"
                id="jobAssistance"
                name="jobAssistance"
                ref="bootcampJobAssistance"
              />
            </div>
            <div class="form-control">
              <label for="jobGuarantee">Job Guarantee</label>
              <input
                type="checkbox"
                id="jobGuarantee"
                name="jobGuarantee"
                ref="bootcampJobGuarantee"
              />
            </div>
            <div class="form-control">
              <label for="acceptGi">accept Gi</label>
              <input
                type="checkbox"
                id="acceptGi"
                name="acceptGi"
                ref="bootcampAcceptGi"
              />
            </div>
          </div>
        </div>
        <div class="form-btn">
          <base-button type="submit" mode="submit-btn"
            >Add bootcamp</base-button
          >
        </div>
      </div>
    </form>
  </base-card>
</template>

<script>
export default {
  inject: ['addNewBootcamp'],
  data() {
    return {};
  },
  methods: {
    aNewBootcamp() {
      const name = this.$refs.bootcampName.value;
      const description = this.$refs.bootcampDescription.value;
      const website = this.$refs.bootcampWebsite.value;
      const phone = this.$refs.bootcampPhone.value;
      const email = this.$refs.bootcampEmail.value;

      this.addNewBootcamp(name, description, website, phone, email);
    },
  },
};
</script>

<style scoped>
.formHeader {
  font-size: 0.6rem;
  color: #ae115f;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.formHeader img {
  width: 1.8rem;
  margin-right: 0.7rem;
}
.formTop {
  display: flex;
  align-items: center;
  justify-content: center;
}
.formTitle {
  margin: 0.8rem;
  background-color: #64003230;
  height: 2.5rem;
  width: 85%;
  border-radius: 3px;
}
.formTitle h2 {
  margin: 0.6rem;
  display: flex;
  justify-content: center;
}

.form-controls {
  display: flex;
  justify-content: space-around;
}
label {
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
}
input,
textarea {
  display: block;
  width: 100%;
  font: inherit;
  padding: 0.15rem;
  border: 1px solid #ccc;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #3a0061;
  background-color: #f7ebff;
}

.form-control {
  margin: 1rem 0;
}
.form-btn {
  display: flex;
  justify-content: center;
}
button {
  width: 75%;
  border-color: #ae115f;
}
</style>
