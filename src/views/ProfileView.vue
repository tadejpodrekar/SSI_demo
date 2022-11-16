<template>
  <div class="profile">
    <h1>Available VCs</h1>
    <wrappedButton :label="'Log vcs'" :method="logVCs" />
    <Textarea v-model="VCImport" rows="5" cols="30" />
    <wrappedButton label="Import VC" :method="importVC" />
  </div>
</template>

<script setup lang="ts">
import wrappedButton from "@/components/wrappedButton.vue";
import { ref } from "vue";
import { useMetamaskStore } from "@/stores/metamask";
import { checkForVCs, saveVC } from "@/util/snap";
import type { VerifiableCredential } from "../util/interfaces";

const mmStore = useMetamaskStore();
const VCImport = ref('');

const logVCs = async () => {
  try {
    const validVCs = await checkForVCs(
      mmStore.snapApi,
      mmStore.mmAddress
    );
    console.log("🚀 ~ file: ProfileView.vue ~ line 36 ~ logVCs ~ validVCs", validVCs);
    if (validVCs) {
      mmStore.vcs = validVCs;
    }
    return 'Success getting VCs';
  } catch (err: any) {
    console.error(err);
    throw err;
  }
}

const importVC = async () => {
  let VC: VerifiableCredential;
  try {
    VC = JSON.parse(VCImport.value) as VerifiableCredential;
  } catch (err: any) {
    throw err;
  }
  console.log('🚀 ~ file: ProfileView.vue ~ line 54 ~ importVC ~ VC', VC);
  try {
    const res = saveVC(VC, mmStore.snapApi);
    if (!res) throw new Error('Failed to save VC');
    console.log('🚀 ~ file: ProfileView.vue ~ line 48 ~ importVC ~ res', res);
    return 'Success importing VC';
  } catch (err: any) {
    console.error(err);
    throw err;
  }
}
</script>

<style>
</style>
