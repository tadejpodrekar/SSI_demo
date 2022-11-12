<template>
    <div class="settings">
        <h1>This is a settings page</h1>
        <Button label="Toggle popups" @click="togglePopups()" />
        <Button label="Get DID methods" @click="getDIDMethods()" />
        <Button label="Get VC stores" @click="getVCStores()" />
        <Dropdown v-model="mmStore.selectedDID" :options="mmStore.availableDIDs" optionLabel="text" />
        <div class="infuraInput">
            <InputText id="infuraToken" type="text" placeholder="Input infura token" />
            <Button label="Change infura token" @click="changeInfuraToken()" />
        </div>
        <div>Selected: {{ mmStore.selectedDID }}</div>
    </div>
</template>

<script setup lang="ts">
import { useMetamaskStore } from '@/stores/metamask';
import type InputText from 'primevue/inputtext';

const mmStore = useMetamaskStore();
mmStore.$subscribe((mutation, state) => {
    console.log('🚀 ~ file: SettingsView.vue ~ line 23 ~ mmStore.$subscribe ~ state', state);
    console.log('🚀 ~ file: SettingsView.vue ~ line 23 ~ mmStore.$subscribe ~ mutation', mutation);
});

async function togglePopups() {
    const res = await mmStore.snapApi?.togglePopups();
    if (res) console.log('Success toggling popups.');
};

async function getDIDMethods() {
    const methods = await mmStore.snapApi?.getAvailableMethods();
    if (methods) {
        console.log(methods);
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

<style>
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
  