<template>
    <div class="settings">
        <h1>This is a settings page</h1>
        <button @click="togglePopups()">Toggle popups</button>
        <button @click="getDIDMethods()">Get DID methods</button>
        <button @click="getVCStores()">Get VC stores</button>
        <select v-model="mmStore.selectedDID">
            <option v-for="option in mmStore.availableDIDs" :value="option">
                {{ option.text }}
            </option>
        </select>
        <div class="infuraInput">
            <input id="infuraToken" type="text" placeholder="Input infura token" />
            <button @click="changeInfuraToken()">Change infura token</button>
        </div>

        <div>Selected: {{ mmStore.selectedDID }}</div>
    </div>
</template>

<script lang="ts">
import { useMetamaskStore } from '@/stores/metamask';
export default {
    setup() {
        const mmStore = useMetamaskStore();
        mmStore.$subscribe((mutation, state) => {
            console.log('🚀 ~ file: SettingsView.vue ~ line 23 ~ mmStore.$subscribe ~ state', state);
            console.log('🚀 ~ file: SettingsView.vue ~ line 23 ~ mmStore.$subscribe ~ mutation', mutation);
        });
        return { mmStore }
    },
    methods: {
        async togglePopups() {
            const res = await this.mmStore.snapApi?.togglePopups();
            if (res) console.log('Success toggling popups.');
        },
        async getDIDMethods() {
            const methods = await this.mmStore.snapApi?.getAvailableMethods();
            if (methods) {
                console.log(methods);
            }
        },
        async getVCStores() {
            const vcStores = await this.mmStore.snapApi?.getAvailableVCStores();
            if (vcStores) console.log('🚀 ~ file: SettingsView.vue ~ line 45 ~ getVCStores ~ vcStores', vcStores);
        },
        async changeInfuraToken() {
            const infuraToken = (<HTMLInputElement>document.getElementById('infuraToken'))?.value;
            console.log('🚀 ~ file: SettingsView.vue ~ line 49 ~ changeInfuraToken ~ infuraToken', infuraToken);
            if (!infuraToken) {
                console.error('No infura token input.');
                return;
            };
            const res = await this.mmStore.snapApi?.changeInfuraToken(infuraToken);
            if (res) {
                console.log('Success changing infura token');
                (<HTMLInputElement>document.getElementById('infuraToken')).value = '';
            }
        },
        log(value: any) {
            console.log('🚀 ~ file: SettingsView.vue ~ line 44 ~ log ~ value', value?.target?.value);
            console.log(value);
        }
    }
}
</script>

<style>
@media (min-width: 1024px) {
    .settings {
        display: grid;
        min-height: 100vh;
        align-items: center;
        margin-top: 1rem;
        justify-items: center;
        align-content: center;
    }
}
</style>
  