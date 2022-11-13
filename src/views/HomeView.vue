<template>
    <div class="home">
        <h1 id="title" v-if="!mmStore.snapInstalled">Please connect to metamask</h1>
        <div v-if="mmStore.snapInstalled" id="vcForm">
            <InputText id="nameInput" type="username" class="p-inputtext-sm" placeholder="Username" />
            <Button :loading="loadingVC.value" @click="funcWrapper(toast, VCCreate, loadingVC)" label="Create VC" class="p-button-sm" />
            <Button :loading="loadingVP.value" @click="funcWrapper(toast, VPCreate, loadingVP)" label="Create VP" class="p-button-sm" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useGeneralStore } from '@/stores/general';
import { useMetamaskStore } from '@/stores/metamask';
import { createVC, createVP, checkForVCs } from '@/util/snap';
import { funcWrapper } from '@/util/general';
import type { ToastServiceMethods } from 'primevue/toastservice';

const mmStore = useMetamaskStore();
const generalStore = useGeneralStore();

const toast = generalStore.toast as ToastServiceMethods;
const loadingVC = reactive({value: false});
const loadingVP = reactive({value: false});

const VCCreate = async () => {
    try {
        const nameInput = document.getElementById('nameInput');
        nameInput?.classList.remove('p-invalid');
        const nameInputValue = (nameInput as HTMLInputElement).value;
        if(!nameInputValue) {
            nameInput?.classList.add('p-invalid');
            return;
        }

        const vcs = await createVC(nameInputValue, mmStore.mmAddress, mmStore.snapApi);
        if(!vcs) {
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
#vcForm > * {
    margin: 0rem 0.5rem 0rem 0.5rem;
}

/*
@media (min-width: 1024px) {
    .home {
        min-height: 100vh;
        display: flex;
        align-items: center;
        margin-top: 1rem;
    }
} */
</style>
  