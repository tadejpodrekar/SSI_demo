<template>
    <div class="settings">
        <div class="grid">
            <h1>This is a settings page</h1>
        </div>
        <div class="grid">

        </div>
        <div class="field">
            <label for="togglePopups">Toggle showing metamask popups</label>
            <wrappedButton id="togglePopups" label="Toggle popups" :method="togglePopups" />
        </div>

        <Button id="getDIDMethods" label="Get DID methods" @click="funcWrapper(toast, getDIDMethods, loadingDIDMethods)"
            :loading="loadingDIDMethods.value" />
        <Button id="getVCStores" label="Get VC stores" @click="getVCStores()" :visible="false" />
        <Dropdown v-model="mmStore.currDIDMethod" :options="mmStore.availableMethods" @change="changeDIDMethod(undefined, $event)" optionLabel="text" />
        <div class="infuraInput">
            <InputText id="infuraToken" type="text" placeholder="Input infura token" />
            <wrappedButton label="Change infura token" :method="changeInfuraToken" />
        </div>
        <div>Selected: {{ mmStore.currDIDMethod }}</div>
    </div>
</template>

<script setup lang="ts">
import wrappedButton from '@/components/wrappedButton.vue';
import { reactive } from 'vue';
import { useGeneralStore } from '@/stores/general';
import { useMetamaskStore } from '@/stores/metamask';
import { funcWrapper } from '@/util/general';
import type { ToastServiceMethods } from 'primevue/toastservice';
import type InputText from 'primevue/inputtext';

const loadingDIDMethods = reactive({ value: false });

const mmStore = useMetamaskStore();
mmStore.$subscribe((mutation, state) => {
    //console.log('🚀 ~ file: SettingsView.vue ~ line 23 ~ mmStore.$subscribe ~ state', state);
    //console.log('🚀 ~ file: SettingsView.vue ~ line 23 ~ mmStore.$subscribe ~ mutation', mutation?.events?.newValue?.value);
    //changeDIDMethod(mutation?.events?.newValue?.value);
});
const generalStore = useGeneralStore();
const toast = generalStore.toast as ToastServiceMethods;

async function togglePopups() {
    try {
        const res = await mmStore.snapApi?.togglePopups();
        if (!res) throw new Error('Failed to toggle popups');
        return 'Success toggling popups.';
    } catch (error) {
        throw error;
    }
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

const testDIDChange = async (method: string, event?: any) => {
    try {
        console.log(event)
        return 'Success changing DID method';
    } catch (error) {
        throw error;
    }
};

const changeDIDMethod = async (method?: string, event?: any) => {
    try {
        if(event.value.value === mmStore?.didMethodsString) return;
        if(!method) method = mmStore.currDIDMethod?.value;
        if(!method) throw new Error('No method selected');
        const res = await mmStore.snapApi?.switchMethod(method);
        if (res) {
            const did = await mmStore.snapApi?.getDID();
            if(did) mmStore.DID = did;
            toast.add({ severity: 'success', summary: 'Success', detail: 'Success changing DID method.', group: 'br', life: 3000 });
            console.log('Success changing DID method.');
        }
    } catch (error: any) {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, group: 'br', life: 3000 });
    }
};

async function getVCStores() {
    const vcStores = await mmStore.snapApi?.getAvailableVCStores();
    if (vcStores) console.log('🚀 ~ file: SettingsView.vue ~ line 45 ~ getVCStores ~ vcStores', vcStores);
};

async function changeInfuraToken() {
    try {
        const infuraInput = document.getElementById('infuraToken');
        infuraInput?.classList.remove('p-invalid');
        const infuraToken = (infuraInput as HTMLInputElement)?.value;
        console.log('🚀 ~ file: SettingsView.vue ~ line 49 ~ changeInfuraToken ~ infuraToken', infuraToken);
        if (!infuraToken) {
            infuraInput?.classList.add('p-invalid');
            return;
        }
        const res = await mmStore.snapApi?.changeInfuraToken(infuraToken);
        if (!res) throw new Error('Failed to change infura token.');
        (<HTMLInputElement>document.getElementById('infuraToken')).value = '';
        return 'Success changing infura token';
    } catch (error) {
        console.error(error);
        throw error;
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
  