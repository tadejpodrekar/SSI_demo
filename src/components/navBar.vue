<template>
    <TabMenu :model="items" :activeIndex="activeItem" @tabChange="onTabChange" />

</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useMetamaskStore } from "../stores/metamask";
import TabMenu from 'primevue/tabmenu';

const mmStore = useMetamaskStore();

const items = [
    { label: 'Home', icon: 'pi pi-fw pi-home', to: '/' },
    { label: 'Profile', icon: 'pi pi-fw pi-user', to: '/profile', visible: () => mmStore.snapInstalled },
    { label: 'Settings', icon: 'pi pi-fw pi-cog', to: '/settings', visible: () => mmStore.snapInstalled },
    { label: 'About', icon: 'pi pi-fw pi-info-circle', to: '/about' },
];

const activeItem = ref(0);

function onTabChange(e: any) {
    console.log('🚀 ~ file: NavBar.vue ~ line 13 ~ onTabChange ~ e', e);
}
</script>

<style>
</style>