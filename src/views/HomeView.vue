<template>
    <div class="home">
        <Toast position="bottom-right" group="br" />
        <h1 id="title" v-if="!mmStore.snapInstalled">Please connect to metamask</h1>
        <div v-if="mmStore.snapInstalled" id="vcForm">
            <InputText id="nameInput" type="username" class="p-inputtext-sm" placeholder="Username" />
            <Button :loading="loadingVC" @click="VCCreate()" label="Create VC" class="p-button-sm" />
            <Button :loading="loadingVP" @click="VPCreate()" label="Create VP" class="p-button-sm" />
            <Button @click="showError()" label="Test error" class="p-button-danger" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useMetamaskStore } from '@/stores/metamask';
import { createVC, createVP, checkForVCs } from '@/util/snap';
import { useToast } from "primevue/usetoast";

const mmStore = useMetamaskStore();
const toast = useToast();
const loadingVC = ref(false);
const loadingVP = ref(false);

const showError = (message: string = 'Error Message', detail: string = 'Message Content') => {
    toast.add({ severity: 'error', summary: message, detail: detail, group: 'br', life: 3000 });
}

const showSuccess = (title: string = 'Success', message: string = 'Message Content') => {
    toast.add({ severity: 'success', summary: title, detail: message, group: 'br', life: 3000 });
}

const VCCreate = async () => {
    try {
        loadingVC.value = true;
        const nameInput = document.getElementById('nameInput') as HTMLInputElement;
        const vcs = await createVC(nameInput.value, mmStore.mmAddress, mmStore.snapApi);
        if(!vcs) {
            showError('Error', 'No VC created');
            loadingVC.value = false;
            return;
        }
        showSuccess('VC created');
        loadingVC.value = false;
    } catch (err: any) {
        showError('Error creating VC', err.message);
        console.error(err);
        loadingVC.value = false;
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
            showError('Error', 'No VP created');
            loadingVP.value = false;
            return;
        }
        showSuccess('VP created');
        loadingVP.value = false;
    } catch (err: any) {
        showError('Error creating VP', err.message);
        console.error(err);
        loadingVP.value = false;
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
  