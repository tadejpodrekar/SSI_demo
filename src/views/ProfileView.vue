<template>
  <div class="profile">
    <h1 id="title">Available VCs</h1>
    <div>
      <DataTable :value="mmStore.vcs" responsiveLayout="scroll" removableSort v-model:selection="selectedVC"
        selectionMode="single" dataKey="id">
        <template #header>
          <div class="table-header">
            Verifiable Credentials
            <div class="dtButtons">
              <Button @click="openModal" label="Import VC" icon="pi pi-file-import" />
              <wrappedButton label="Load VCs" :method="loadVCs" icon="pi pi-refresh" />
              <wrappedButton label="Create VP" :method="vpCreate" icon="pi pi-upload" />
            </div>

          </div>
        </template>
        <Column field="id" header="VC Id" />
        <Column field="issuanceDate" header="Issuance Date" :sortable="true">
          <template #body="slotProps">
            {{ ISOtoLocaleString(slotProps.data.issuanceDate) }}
          </template>
        </Column>
        <Column field="issuer.id" header="Issuer Id" />
        <template #footer>
          In total there are {{ mmStore.vcs ? mmStore.vcs.length : 0 }} VCs.
        </template>
      </DataTable>
    </div>
    <Dialog header="Import VC (JSON)" v-model:visible="displayModal" :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
      :style="{ width: '50vw' }" :modal="true">
      <Textarea id="VCImportArea" v-model="VCImport" autofocus :autoResize="true" class="vcImport" />
      <template #footer>
        <Button label="Cancel" icon="pi pi-times" @click="closeModal()" class="p-button-text" />
        <wrappedButton label="Import" :method="importVC" icon="pi pi-check" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import wrappedButton from "@/components/wrappedButton.vue";
import { ref } from "vue";
import { useMetamaskStore } from "@/stores/metamask";
import { ISOtoLocaleString } from "@/util/general";
import { checkForVCs, saveVC, createVP } from "@/util/snap";
import type { VerifiableCredential } from "../util/interfaces";

const mmStore = useMetamaskStore();
const VCImport = ref('');
const displayModal = ref(false);
const selectedVC = ref<VerifiableCredential | undefined>(undefined);

const openModal = () => {
  displayModal.value = true;
};

const closeModal = () => {
  VCImport.value = '';
  displayModal.value = false;
}

const loadVCs = async () => {
  try {
    const validVCs = await checkForVCs(
      mmStore.snapApi
    );
    // console.log("🚀 ~ file: ProfileView.vue ~ line 36 ~ loadVCs ~ validVCs", validVCs);
    if (validVCs) {
      mmStore.vcs = validVCs;
    }
    return 'Success getting VCs';
  } catch (err: any) {
    console.error(err);
    throw err;
  }
}

const vpCreate = async () => {
  try {
    if (!selectedVC.value) {
      throw new Error('No VC selected');
    }
    const vp = await createVP(selectedVC.value, mmStore.snapApi);
    // console.log('🚀 ~ file: HomeView.vue ~ line 32 ~ VPCreate ~ res', vp);
    if (!vp) {
      throw new Error('Failed to create VP');
    }
    return 'VP created';
  } catch (err: any) {
    throw new Error(err.message);
  }
}

const importVC = async () => {
  let VC: VerifiableCredential;
  try {
    VC = JSON.parse(VCImport.value) as VerifiableCredential;
  } catch (err: any) {
    throw err;
  }
  // console.log('🚀 ~ file: ProfileView.vue ~ line 54 ~ importVC ~ VC', VC);
  try {
    const res = await saveVC(VC, mmStore.snapApi);
    if (!res) throw new Error('Failed to save VC');
    // console.log('🚀 ~ file: ProfileView.vue ~ line 48 ~ importVC ~ res', res);
    mmStore.vcs.push(VC);
    closeModal();
    return 'Success importing VC';
  } catch (err: any) {
    console.error(err);
    throw err;
  }
}
</script>

<style lang="scss" scoped>
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dtButtons button {
  margin: 0px 5px;
}

.vcImport {
  width: 100%;
}

#title {
  text-align: center;
}

.profile {
  margin: 0 5rem;
}
</style>
