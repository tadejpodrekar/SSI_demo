<template>
  <div class="home">
    <h1 id="title" v-if="!mmStore.snapInstalled">Please connect to metamask</h1>
    <h1 id="title" v-if="mmStore.snapInstalled">Home page</h1>
    <div v-if="mmStore.snapInstalled" id="vcForm">
      <InputText id="nameInput" type="username" class="p-inputtext-sm" placeholder="Username" />
      <!--<Button :loading="loadingVC.value" @click="funcWrapper(toast, VCCreate, loadingVC)" label="Create VC" class="p-button-sm" />
            <Button :loading="loadingVP.value" @click="funcWrapper(toast, VPCreate, loadingVP)" label="Create VP" class="p-button-sm" />-->
      <WrappedButton label='Create VC' :method="VCCreate" cssClass="p-button-sm" />
      <WrappedButton label='Create VP' :method="VPCreate" cssClass="p-button-sm" />
    </div>
    <button @click="testDIDMethods(mmStore.snapApi)">Test</button>
  </div>
</template>

<script setup lang="ts">
import { useMetamaskStore } from '@/stores/metamask';
import { createVC, createVP, checkForVCs, testDIDMethods } from '@/util/snap';
import WrappedButton from '@/components/wrappedButton.vue';

const mmStore = useMetamaskStore();

const testFunc = async () => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    throw new Error('Test error');
    return 'success';
  } catch (error) {
    console.error;
    throw error;
  }
}

const VCCreate = async () => {
  try {
    const nameInput = document.getElementById('nameInput');
    nameInput?.classList.remove('p-invalid');
    const nameInputValue = (nameInput as HTMLInputElement).value;
    if (!nameInputValue) {
      nameInput?.classList.add('p-invalid');
      return;
    }

    const vcs = await createVC(nameInputValue, mmStore.mmAddress, mmStore.snapApi);
    if (!vcs) {
      throw new Error('Failed to create VC');
    }
    return 'VC created';
  } catch (err: any) {
    throw new Error(err.message);
  }
}

const VPCreate = async () => {
  try {
    const VCs = await checkForVCs(mmStore?.snapApi);
    if (!VCs) {
      console.error('No VCs found.');
      return;
    }
    const vp = await createVP(VCs[0], mmStore.snapApi);
    console.log('🚀 ~ file: HomeView.vue ~ line 32 ~ VPCreate ~ res', vp);
    if (!vp) {
      throw new Error('Failed to create VP');
    }
    return 'VP created';
  } catch (err: any) {
    throw new Error(err.message);
  }
}
</script>

<style>
/* center the h1 content */
h1 {
  text-align: center;
}

#vcForm>* {
  margin: 0rem 0.5rem 0rem 0.5rem;
}

.home {
  margin: 0 auto;
  max-width: 800px;
  padding: 0 1rem;
  border: 1px solid red;
}
</style>
  