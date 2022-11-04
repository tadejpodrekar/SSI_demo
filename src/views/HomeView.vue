<template>
    <div class="home">
        <h1 id="title" v-if="!mmStore.snapInstalled">Please connect to metamask</h1>
        <div v-if="mmStore.snapInstalled" id="vcForm">
            <label>Insert your name: </label>
            <input type="text" id="nameInput" />
            <button @click="callCreate()">Create VC</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useMetamaskStore } from '@/stores/metamask';
import { createVC } from '@/util/snap';

const mmStore = useMetamaskStore();

function callCreate() {
    createVC((<HTMLInputElement>document.getElementById('nameInput')).value, this.mmStore.mmAddress, this.mmStore.snapApi);
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
  