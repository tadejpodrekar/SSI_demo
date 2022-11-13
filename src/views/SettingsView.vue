<template>
    <div class="settings">
        <div class="grid">
            <h1>This is a settings page</h1>
        </div>
        <div class="grid">

        </div>
        <div class="field">
            <label for="togglePopups">Toggle showing metamask popups</label>
            <Button id="togglePopups" label="Toggle popups" @click="togglePopups()" />
        </div>

        <Button id="getDIDMethods" label="Get DID methods" @click="funcWrapper(toast, getDIDMethods, loadingDIDMethods)" :loading="loadingDIDMethods.value" />
        <Button id="getVCStores" label="Get VC stores" @click="getVCStores()" :visible="false"/>
        <Dropdown v-model="mmStore.selectedDID" :options="mmStore.availableDIDs" optionLabel="text" />
        <div class="infuraInput">
            <InputText id="infuraToken" type="text" placeholder="Input infura token" />
            <Button label="Change infura token" @click="changeInfuraToken()" />
        </div>
        <div>Selected: {{ mmStore.selectedDID }}</div>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useGeneralStore } from '@/stores/general';
import { useMetamaskStore } from '@/stores/metamask';
import { funcWrapper } from '@/util/general';
import type { ToastServiceMethods } from 'primevue/toastservice';
import type InputText from 'primevue/inputtext';

const loadingDIDMethods = reactive({value: false});

const mmStore = useMetamaskStore();
mmStore.$subscribe((mutation, state) => {
    console.log('🚀 ~ file: SettingsView.vue ~ line 23 ~ mmStore.$subscribe ~ state', state);
    console.log('🚀 ~ file: SettingsView.vue ~ line 23 ~ mmStore.$subscribe ~ mutation', mutation);
});
const generalStore = useGeneralStore();
const toast = generalStore.toast as ToastServiceMethods;

async function togglePopups() {
    const res = await mmStore.snapApi?.togglePopups();
    if (res) console.log('Success toggling popups.');
};

async function getDIDMethods() {
    try {
        const methods = await mmStore.snapApi?.getAvailableMethods();
        if (methods) {
            console.log(methods);
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

async function getVCStores() {
    const vcStores = await mmStore.snapApi?.getAvailableVCStores();
    if (vcStores) console.log('🚀 ~ file: SettingsView.vue ~ line 45 ~ getVCStores ~ vcStores', vcStores);
};

async function changeInfuraToken() {
    const infuraToken = (<HTMLInputElement>document.getElementById('infuraToken'))?.value;
    console.log('🚀 ~ file: SettingsView.vue ~ line 49 ~ changeInfuraToken ~ infuraToken', infuraToken);
    if (!infuraToken) {
        console.error('No infura token input.');
        return;
    };
    const res = await mmStore.snapApi?.changeInfuraToken(infuraToken);
    if (res) {
        console.log('Success changing infura token');
        (<HTMLInputElement>document.getElementById('infuraToken')).value = '';
    }
};

function log(value: any) {
    console.log('🚀 ~ file: SettingsView.vue ~ line 44 ~ log ~ value', value?.target?.value);
    console.log(value);
}
</script>

<style scoped>
.field * {
    display: block;
}

/*
@media (min-width: 1024px) {
    .settings {
        display: grid;
        min-height: 100vh;
        align-items: center;
        margin-top: 1rem;
        justify-items: center;
        align-content: center;
    }
} */
</style>
  