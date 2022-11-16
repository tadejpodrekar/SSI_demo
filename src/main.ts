import { createApp } from "vue";
import { createPinia } from "pinia";

import { primeVueComponents } from "./util/primeVue";

import App from "./App.vue";
import router from "./router";

//import "./assets/main.css";
import "./assets/default.css";
import 'primevue/resources/themes/tailwind-light/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

const app = createApp(App);

app.use(primeVueComponents.PrimeVue, {ripple: true});
app.use(createPinia());
app.use(router);

app
    .component("Button", primeVueComponents.Button)
    .component("InputText", primeVueComponents.InputText)
    .component("Textarea", primeVueComponents.Textarea)
    .component("Toast", primeVueComponents.Toast)
    .component("Dropdown", primeVueComponents.Dropdown)
    .component("Chip", primeVueComponents.Chip);

app.use(primeVueComponents.ToastService);

app.mount("#app");
