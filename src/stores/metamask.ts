import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { SSISnapApi } from "@blockchain-lab-um/ssi-snap-types";
import type { VerifiableCredential, DIDMethod } from "../util/interfaces";

export const useMetamaskStore = defineStore("metamask", () => {
  // Store values
  const mmAddress = ref<string | undefined>(undefined);
  const snapApi = ref<SSISnapApi | undefined>(undefined);
  const selectedDID = ref<DIDMethod | undefined>(undefined);
  const availableDIDs = ref<DIDMethod[] | undefined>(undefined);
  const verifiableCredential = ref<VerifiableCredential | undefined>(undefined);
  const vcs = ref<VerifiableCredential[] | undefined>(undefined);

  // Read only values
  const vcIssuerId = computed(() => {
    return "did:ethr:rinkeby:0x0241abd662da06d0af2f0152a80bc037f65a7f901160cfe1eb35ef3f0c532a2a4d";
  });
  const snapInstalled = computed(() => {
    return mmAddress.value && snapApi.value ? true : false;
  });

  // Mutations - write as function export

  return {
    snapInstalled,
    mmAddress,
    snapApi,
    selectedDID,
    availableDIDs,
    verifiableCredential,
    vcs,
    vcIssuerId,
  };
});
