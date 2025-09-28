<script setup lang="ts">
import Background from "@/components/shared/Background.vue";
import Footer from "@/components/shared/Footer.vue";
import { Toaster } from "vue-sonner";
import "vue-sonner/style.css";
</script>
<template>
  <div class="min-h-screen flex flex-col">
    <Background />
    <Toaster />
    <main class="flex-1">
      <router-view />
    </main>
    <Footer />
  </div>
</template>
