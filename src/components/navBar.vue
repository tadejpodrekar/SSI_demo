<template>
    <TabMenu :model="items" @tabChange="onTabChange" />
</template>

<script setup lang="ts">
import { useMetamaskStore } from "../stores/metamask";
import TabMenu from 'primevue/tabmenu';

const mmStore = useMetamaskStore();

const items = [
    { label: 'Home', icon: 'pi pi-fw pi-home', to: '/' },
    { label: 'Profile', icon: 'pi pi-fw pi-user', to: '/profile', visible: () => mmStore.snapInstalled },
    { label: 'Settings', icon: 'pi pi-fw pi-cog', to: '/settings', visible: () => mmStore.snapInstalled },
    { label: 'About', icon: 'pi pi-fw pi-info-circle', to: '/about' },
];

function onTabChange(e: any) {
    console.log('🚀 ~ file: NavBar.vue ~ line 13 ~ onTabChange ~ e', e);
}
</script>

<style>
.p-reset {
    padding: 0 2rem !important;
}

.p-tabmenu-nav {
    padding: 0 2rem !important;
}
</style>