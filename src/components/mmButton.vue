<template>
  <Button label="Import metamask" :loading="isLoading" v-if="!mmStore.snapInstalled" @click="connectToMM()" />
  <div id="mmAddress" v-if="mmStore.snapInstalled">
    {{ mmStore.mmAddress?.substring(0, 10) + "..." }}
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import { installSnap, initStore } from "../util/snap";
import { useMetamaskStore } from "@/stores/metamask";
import Button from 'primevue/button';

const mmStore = useMetamaskStore();
const router = useRouter();
const isLoading = ref(false);

async function connectToMM() {
  isLoading.value = !isLoading.value;
  if (window.ethereum) {
    window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((result: (string | undefined)[]) => {
        console.log("Setting MetaMask address!");
        mmStore.mmAddress = result[0];
      })
      .catch((err: Error) => {
        console.error(err);
      });

    try {
      const result = await installSnap();
      if (result.isSnapInstalled) {
        const api = await result.snap?.getSSISnapApi();
        if (!api) return;
        mmStore.snapApi = api;
        const DIDData = await initStore(api);
        if (DIDData) {
          mmStore.selectedDID = DIDData.selectedDID;
          mmStore.availableDIDs = DIDData.availableDIDs;
        }

        router.push("/");
      }
    } catch (err) {
      console.error(err);
    }
  }
}
</script>

<style>
.mmButton {
  align-items: center;
  appearance: none;
  background-image: radial-gradient(100% 100% at 100% 0,
      #8198ff 0,
      #6e54ff 100%);
  border: 0;
  border-radius: 6px;
  box-shadow: rgba(45, 35, 66, 0.4) 0 2px 4px,
    rgba(45, 35, 66, 0.3) 0 7px 13px -3px, rgba(58, 65, 111, 0.5) 0 -3px 0 inset;
  box-sizing: border-box;
  color: #fff;
  cursor: pointer;
  display: inline-flex;
  font-family: "JetBrains Mono", monospace;
  height: 48px;
  justify-content: center;
  line-height: 1;
  list-style: none;
  overflow: hidden;
  padding-left: 16px;
  padding-right: 16px;
  position: relative;
  text-align: left;
  text-decoration: none;
  transition: box-shadow 0.15s, transform 0.15s;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  white-space: nowrap;
  will-change: box-shadow, transform;
  font-size: 18px;
}

#mmAddress {
  align-items: center;
  appearance: none;
  background-image: radial-gradient(100% 100% at 100% 0,
      #8198ff 0,
      #6e54ff 100%);
  border: 0;
  border-radius: 6px;
  box-shadow: rgba(45, 35, 66, 0.4) 0 2px 4px,
    rgba(45, 35, 66, 0.3) 0 7px 13px -3px, rgba(58, 65, 111, 0.5) 0 -3px 0 inset;
  box-sizing: border-box;
  color: #fff;
  display: inline-flex;
  font-family: "JetBrains Mono", monospace;
  height: 48px;
  justify-content: center;
  line-height: 1;
  overflow: hidden;
  padding-left: 16px;
  padding-right: 16px;
  position: relative;
  text-align: left;
  text-decoration: none;
  font-size: 18px;
}

.mmButton:focus {
  box-shadow: #6247ff 0 0 0 1.5px inset, rgba(45, 35, 66, 0.4) 0 2px 4px,
    rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #6247ff 0 -3px 0 inset;
}

.mmButton:hover {
  box-shadow: rgba(45, 35, 66, 0.4) 0 4px 8px,
    rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #6247ff 0 -3px 0 inset;
  transform: translateY(-2px);
}

.mmButton:active {
  box-shadow: #6247ff 0 3px 7px inset;
  transform: translateY(2px);
}
</style>
