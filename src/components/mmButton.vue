<template>
  <Button label="Import metamask" :loading="isLoading" v-if="!mmStore.snapInstalled" @click="connectToMM()" />
  <div v-if="mmStore.snapInstalled">
    <Chip :label="'Metamask connected\nAddress: ' + mmStore.mmAddressString" icon="pi pi-check" class="p-mr-2" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import { installSnap, initStore } from "../util/snap";
import { useMetamaskStore } from "@/stores/metamask";
// import Button from 'primevue/button';

const mmStore = useMetamaskStore();
const router = useRouter();
const isLoading = ref(false);

async function connectToMM() {
  isLoading.value = true;
  if (window.ethereum) {
    window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((result: (string | undefined)[]) => {
        console.log("Setting MetaMask address!");
        mmStore.mmAddress = result[0];
      })
      .catch((err: Error) => {
        isLoading.value = false;
        console.error(err);
      });

    try {
      const result = await installSnap();
      if (result.isSnapInstalled) {
        const api = await result.snap?.getSSISnapApi();
        if (!api) return;
        isLoading.value = false;
        mmStore.snapApi = api;
        const DIDData = await initStore(api);
        if (DIDData) {
          mmStore.selectedDID = DIDData.selectedDID;
          mmStore.availableDIDs = DIDData.availableDIDs;
        }

        router.push("/");
      }
    } catch (err) {
      isLoading.value = false;
      console.error(err);
    }
  }
}
</script>

<style>
.p-chip {
  white-space: pre-line;
}
</style>
