<template>
  <header>
    <div class="grid nav">
      <div class="col-6 mainTitle">
        <greetingTitle msg="SSI Snap dApp" />
      </div>
      <div class="col-* mmCenter">
        <didSelector />
        <mmButton />
      </div>
    </div>
    <div class="wrapper">
      <navBar />
    </div>
  </header>
  <RouterView />
  <Toast position="bottom-right" group="br" />
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import { useGeneralStore } from "@/stores/general";
import { useToast } from 'primevue/usetoast';
import greetingTitle from "./components/greetingTitle.vue";
import didSelector from "./components/didSelector.vue";
import navBar from "./components/navBar.vue";
import mmButton from "./components/mmButton.vue";

const generalStore = useGeneralStore();
generalStore.toast = useToast();
</script>

<style scoped>
.col-6 {
  padding: 0rem 1.5rem !important;
}

.nav {
  justify-content: space-between;
}

.grid {
  margin: -0.5rem 0rem;
}

.mmCenter {
  margin-right: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mmCenter * {
  margin: 0rem 0.5rem;
}
</style>
