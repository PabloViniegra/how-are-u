import { createWebHistory, createRouter } from "vue-router";
import { useGlobalStore } from "@/shared/global-store";

const HomePage = () => import("@/pages/HomePage.vue");
const BeautyPage = () => import("@/pages/BeautyPage.vue");
const SummaryPage = () => import("@/pages/SummaryPage.vue");

const routes = [
  {
    path: "/",
    component: HomePage,
    name: "home",
    meta: {
      title: "Análisis de Atractivo Facial - IA",
      description:
        "Descubre tu puntuación de atractivo basada en criterios científicos",
      transition: "fade",
    },
  },
  {
    path: "/make-beauty",
    component: BeautyPage,
    name: "beauty",
    meta: {
      title: "Crea un análisis",
      description: "Crea un análisis de atractivo facial",
      transition: "fade",
    },
  },
  {
    path: "/summary/:id",
    component: SummaryPage,
    name: "summary",
    meta: {
      title: "Análisis de Atractivo Facial",
      description: "Visualiza un análisis de belleza compartido",
      transition: "fade",
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else if (to.hash) {
      return { el: to.hash, behavior: "smooth" };
    } else {
      return { top: 0, behavior: "smooth" };
    }
  },
});

router.beforeEach((_to, _from, next) => {
  const globalStore = useGlobalStore();

  globalStore.setLoading(true);

  next();
});

router.afterEach(() => {
  const globalStore = useGlobalStore();

  setTimeout(() => {
    globalStore.setLoading(false);
  }, 200);
});

router.onError((error) => {
  console.error("Router error:", error);
  const globalStore = useGlobalStore();
  globalStore.setLoading(false);
});

export default router;
