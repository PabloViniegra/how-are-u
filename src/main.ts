import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
// @ts-ignore
import "@fontsource-variable/fira-code";
// @ts-ignore
import "@fontsource-variable/inter";
// @ts-ignore
import "@fontsource-variable/onest";
import { VueQueryPlugin } from "@tanstack/vue-query";
import { createPinia } from "pinia";
import router from "@/router";

const vueQueryConfig = {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 5 * 60 * 1000,
      },
      mutations: {
        retry: 2,
      },
    },
  },
};

const app = createApp(App);

const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(VueQueryPlugin, vueQueryConfig);

app.mount("#app");
