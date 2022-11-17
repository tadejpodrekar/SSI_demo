<template>
  <div class="home">
    <h1 id="title" v-if="!mmStore.snapInstalled">Please connect to metamask</h1>
    <h1 id="title" v-if="mmStore.snapInstalled">Home page</h1>
    <div class="content" v-if="mmStore.snapInstalled">
      <Button v-if="!generalStore.courseStarted" label="Start course" @click="openVCCourse()" />
      <vcCourse v-if="generalStore.courseStarted" />
    </div>
  </div>
</template>

<script setup lang="ts">
import vcCourse from '@/components/vcCourse.vue';
import { useMetamaskStore } from '@/stores/metamask';
import { useGeneralStore } from '@/stores/general';

const mmStore = useMetamaskStore();
const generalStore = useGeneralStore();

const openVCCourse = () => {
  generalStore.courseStarted = true;
}

const testFunc = async () => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    throw new Error('Test error');
    return 'success';
  } catch (error) {
    console.error;
    throw error;
  }
}

</script>

<style>
/* center the h1 content */
#title {
  text-align: center;
}

.home {
  margin: 0 auto;
  max-width: 1000px;
  padding: 0 1rem;
  border: 1px solid red;
}

.content {
  display: flex;
  justify-content: center;
}
</style>
  