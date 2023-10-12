import { createApp } from 'vue';
import App from './App.vue';

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
  components,
  directives,
});

import NavigationComponent from './components/layouts/NavigationComponent.vue';
import BaseCard from './components/UI/BaseCard.vue';
import BaseButton from './components/UI/BaseButton.vue';

const app = createApp(App);

app.component('navigation-component', NavigationComponent);
app.component('base-card', BaseCard);
app.component('base-button', BaseButton);

app.use(vuetify);
app.mount('#app');
