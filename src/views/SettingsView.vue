<template>
    <div class="settings">
        <h1 id="title">SSI Snap Configuration</h1>
        <div class="settingsContent">
            <div class="popups">
                <p>Used for toggling the built-in Metamask popups: </p>
                <wrappedButton id="togglePopups" label="Toggle popups" :method="togglePopups" />
            </div>

            <div class="infuraInput">
                <InputText id="infuraToken" type="text" placeholder="Input infura token" />
                <wrappedButton label="Change infura token" :method="changeInfuraToken" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import wrappedButton from '@/components/wrappedButton.vue';
import { useGeneralStore } from '@/stores/general';
import { useMetamaskStore } from '@/stores/metamask';
import type { ToastServiceMethods } from 'primevue/toastservice';
import type InputText from 'primevue/inputtext';

const mmStore = useMetamaskStore();
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
.settings {
    margin: 0 auto;
    max-width: 1000px;
    border: 1px solid red;
}

.settingsContent {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid blue;
}

.settingsContent * {
    margin: 0.5rem 1rem;
}

.popups {
    display: flex;
    align-items: center;
}

#title {
    text-align: center;
}
</style>
  