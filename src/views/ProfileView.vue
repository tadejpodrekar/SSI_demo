<template>
    <div class="profile">
        <h1>Available VCs</h1><button @click="logVCs()">Log vcs</button>
    </div>
</template>

<script lang="ts">
import { useMetamaskStore } from '@/stores/metamask';
import { checkForVCs } from '@/util/snap';
export default {
    setup() {
        const mmStore = useMetamaskStore();
        return { mmStore }
    },
    methods: {
        async logVCs() {
            const validVCs = await checkForVCs(this.mmStore.snapApi, this.mmStore.mmAddress);
            console.log('🚀 ~ file: mmButton.vue ~ line 36 ~ connectToMM ~ validVCs', validVCs);
            if (validVCs) {
                this.mmStore.vcs = validVCs;
            }
            console.log(this.mmStore.vcs?.values)
        }
    }
}
</script>

<style>
@media (min-width: 1024px) {
    .profile {
        display: grid;
        min-height: 100vh;
        align-items: center;
        margin-top: 1rem;
        justify-items: center;
        align-content: center;
    }
}
</style>
