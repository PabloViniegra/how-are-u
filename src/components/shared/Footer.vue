<script setup lang="ts">
import { ref } from 'vue'
import TermsModal from './TermsModal.vue'
import PrivacyModal from './PrivacyModal.vue'

const showTermsModal = ref(false)
const showPrivacyModal = ref(false)

const openTermsModal = () => {
  showTermsModal.value = true
}

const openPrivacyModal = () => {
  showPrivacyModal.value = true
}

const closeTermsModal = () => {
  showTermsModal.value = false
}

const closePrivacyModal = () => {
  showPrivacyModal.value = false
}
</script>

<template>
  <footer class="bg-card border-t border-border py-6 mt-auto">
    <div class="container mx-auto px-4">
      <div class="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-8">
        <p class="text-sm text-muted-foreground font-sans">
          © 2025 How Are U. Todos los derechos reservados.
        </p>
        <div class="flex space-x-6">
          <button
            @click="openTermsModal"
            class="text-sm text-muted-foreground hover:text-foreground transition-colors font-sans underline-offset-4 hover:underline"
          >
            Términos y Condiciones
          </button>
          <button
            @click="openPrivacyModal"
            class="text-sm text-muted-foreground hover:text-foreground transition-colors font-sans underline-offset-4 hover:underline"
          >
            Política de Privacidad
          </button>
        </div>
      </div>
    </div>
  </footer>

  <TermsModal :show="showTermsModal" @close="closeTermsModal" />
  <PrivacyModal :show="showPrivacyModal" @close="closePrivacyModal" />
</template>