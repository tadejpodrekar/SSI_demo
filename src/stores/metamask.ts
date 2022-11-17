import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { SSISnapApi } from "@blockchain-lab-um/ssi-snap-types";
import type { VerifiableCredential, DIDMethod } from "../util/interfaces";

export const useMetamaskStore = defineStore("metamask", () => {
  // Store values
  const mmAddress = ref<string | undefined>(undefined);
  const snapApi = ref<SSISnapApi | undefined>(undefined);
  const DID = ref<string | undefined>(undefined);
  const currDIDMethod = ref<DIDMethod | undefined>(undefined);
  const availableMethods = ref<DIDMethod[] | undefined>(undefined);
  const verifiableCredential = ref<VerifiableCredential | undefined>(undefined);
  const vcs = ref<VerifiableCredential[]>([] as VerifiableCredential[]);

  // Read only values
  const vcIssuerId = computed(() => {
    return "did:ethr:rinkeby:0x0241abd662da06d0af2f0152a80bc037f65a7f901160cfe1eb35ef3f0c532a2a4d";
  });

  const snapInstalled = computed(() => {
    return mmAddress.value && snapApi.value ? true : false;
  });

  const mmAddressString = computed(() => {
    return DID.value
      ? DID.value.substring(0, 20) +
          "..." +
          DID.value.substring(DID.value.length - 4)
      : "No DID";
  });

  const didMethodString = computed(() => {
    return DID.value
      ? DID.value.split(":")[0] + ":" + DID.value.split(":")[1]
      : undefined;
  });

  return {
    snapInstalled,
    mmAddress,
    mmAddressString,
    snapApi,
    DID,
    didMethodString,
    currDIDMethod,
    availableMethods,
    verifiableCredential,
    vcs,
    vcIssuerId,
  };
});
