<template>
  <header>
    <div class="grid">
      <div class="col-fixed" style="width:100px">
        <img alt="SSI logo" class="logo" src="https://blockchain-lab-um.github.io/ssi-snap-docs/img/ssi_snap_logo_2.svg"
          width="100" height="100" />
      </div>
      <div class="col-*">
        <greetingTitle msg="SSI Snap Demo" />
      </div>
    </div>
    <div class="wrapper">
      <navBar />
      <mmButton></mmButton>
    </div>
  </header>
  <RouterView />
  <Toast position="bottom-right" group="br" />
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import { useGeneralStore } from "@/stores/general";
import greetingTitle from "./components/greetingTitle.vue";
import navBar from "./components/navBar.vue";
import mmButton from "./components/mmButton.vue";
import { useToast } from 'primevue/usetoast';

const generalStore = useGeneralStore();
generalStore.toast = useToast();
</script>

<style scoped>
.nav a {
  margin: 0.5rem;
}

html {
  padding: 0rem 1rem 0rem 1rem;
}
</style>
