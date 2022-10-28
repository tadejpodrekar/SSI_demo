<template>
    <div class="settings">
        <h1>This is a settings page</h1>
        <button @click="togglePopups()">Toggle popups</button>
    </div>
</template>

<script lang="ts">
import { useMetamaskStore } from '@/stores/metamask';
export default {
    setup() {
        const mmStore = useMetamaskStore();
        return { mmStore }
    },
    methods: {
        async togglePopups() {
            const res = await this.mmStore.snapApi?.togglePopups();
            if(res) console.log("Success toggling popups.");
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
  