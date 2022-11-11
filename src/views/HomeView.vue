<template>
    <div class="home">
        <h1 id="title" v-if="!mmStore.snapInstalled">Please connect to metamask</h1>
        <div v-if="mmStore.snapInstalled" id="vcForm">
            <label>Insert your name: </label>
            <input type="text" id="nameInput" />
            <button @click="VCCreate()">Create VC</button>
            <button @click="VPCreate()">Create VP</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useMetamaskStore } from '@/stores/metamask';
import { createVC, createVP, checkForVCs } from '@/util/snap';

const mmStore = useMetamaskStore();

const VCCreate = () => {
    const nameInput = document.getElementById('nameInput') as HTMLInputElement;
    createVC(nameInput.value, mmStore.mmAddress, mmStore.snapApi);
}

const VPCreate = async () => {
    const VCs = await checkForVCs(mmStore?.snapApi);
    if (!VCs) {
        console.error('No VCs found.');
        return;
    }
    const res = await createVP(VCs[0], mmStore.snapApi);
    console.log('🚀 ~ file: HomeView.vue ~ line 32 ~ VPCreate ~ res', res);
}
</script>

<style>
#vcForm {
    margin-top: 2rem;
}

@media (min-width: 1024px) {
    .home {
        min-height: 100vh;
        display: flex;
        align-items: center;
        margin-top: 1rem;
    }
}
</style>
  