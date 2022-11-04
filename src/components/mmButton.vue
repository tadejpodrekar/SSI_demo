<template>
  <button class="mmButton" v-if="!mmStore.snapInstalled" @click="connectToMM()">
    Import metamask
  </button>
  <div id="mmAddress" v-if="mmStore.snapInstalled">
    {{ mmStore.mmAddress?.substring(0, 10) + "..." }}
  </div>
</template>

<script lang="ts">
import { installSnap, initStore } from "../util/snap";
import { useMetamaskStore } from "@/stores/metamask";
export default {
  setup() {
    const mmStore = useMetamaskStore();
    return { mmStore };
  },
  created() {
    console.log(this.mmStore.snapInstalled);
  },
  methods: {
    async connectToMM() {
      if (window.ethereum) {
        window.ethereum
          .request({ method: "eth_requestAccounts" })
          .then((result: (string | undefined)[]) => {
            console.log("Setting MetaMask address!");
            this.mmStore.mmAddress = result[0];
          })
          .catch((err: Error) => {
            console.error(err);
          });

        try {
          const result = await installSnap();
          if (result.isSnapInstalled) {
            const api = await result.snap?.getSSISnapApi();
            if (!api) return;
            this.mmStore.snapApi = api;
            const DIDData = await initStore(api);
            if (DIDData) {
              this.mmStore.selectedDID = DIDData.selectedDID;
              this.mmStore.availableDIDs = DIDData.availableDIDs;
            }

            this.$router.push("/");
            /* const validVCs = await checkForVCs(this.mmStore.snapApi, this.mmStore.mmAddress);
            console.log('🚀 ~ file: mmButton.vue ~ line 36 ~ connectToMM ~ validVCs', validVCs);
            if(!validVCs) return;
            // backend: https://bclabum.informatika.uni-mb.si/ssi-demo-backend
            const backend_url = "https://bclabum.informatika.uni-mb.si/ssi-demo-backend";
            let axiosConfig = {
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              },
            };
            let body = { name: 'TestName', id: 'did:ethr:rinkeby:' + this.mmStore.mmAddress };
            let VC = await axios
              .post(backend_url + '/api/vc/issue-vc', body, axiosConfig)
              .then(function (response: any) {
                return response.data;
              })
              .catch(function (error: any) {
                console.log(error);
              });
            console.log('🚀 ~ file: mmButton.vue ~ line 52 ~ connectToMM ~ VC', VC);
            

            
            const vc = JSON.parse(JSON.stringify(this.mmStore.verifiableCredential));
            console.log(JSON.parse(JSON.stringify(this.mmStore.verifiableCredential)));
            const res = await api?.saveVC(vc);
            console.log('🚀 ~ file: mmButton.vue ~ line 39 ~ connectToMM ~ res', res);
            const vcs = await api?.getVCs();

            console.log('list of VCs:', vcs);*/
          }
        } catch (err) {
          console.error(err);
        }
      }
    },
  },
};
</script>

<style>
.mmButton {
  align-items: center;
  appearance: none;
  background-image: radial-gradient(
    100% 100% at 100% 0,
    #8198ff 0,
    #6e54ff 100%
  );
  border: 0;
  border-radius: 6px;
  box-shadow: rgba(45, 35, 66, 0.4) 0 2px 4px,
    rgba(45, 35, 66, 0.3) 0 7px 13px -3px, rgba(58, 65, 111, 0.5) 0 -3px 0 inset;
  box-sizing: border-box;
  color: #fff;
  cursor: pointer;
  display: inline-flex;
  font-family: "JetBrains Mono", monospace;
  height: 48px;
  justify-content: center;
  line-height: 1;
  list-style: none;
  overflow: hidden;
  padding-left: 16px;
  padding-right: 16px;
  position: relative;
  text-align: left;
  text-decoration: none;
  transition: box-shadow 0.15s, transform 0.15s;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  white-space: nowrap;
  will-change: box-shadow, transform;
  font-size: 18px;
}

#mmAddress {
  align-items: center;
  appearance: none;
  background-image: radial-gradient(
    100% 100% at 100% 0,
    #8198ff 0,
    #6e54ff 100%
  );
  border: 0;
  border-radius: 6px;
  box-shadow: rgba(45, 35, 66, 0.4) 0 2px 4px,
    rgba(45, 35, 66, 0.3) 0 7px 13px -3px, rgba(58, 65, 111, 0.5) 0 -3px 0 inset;
  box-sizing: border-box;
  color: #fff;
  display: inline-flex;
  font-family: "JetBrains Mono", monospace;
  height: 48px;
  justify-content: center;
  line-height: 1;
  overflow: hidden;
  padding-left: 16px;
  padding-right: 16px;
  position: relative;
  text-align: left;
  text-decoration: none;
  font-size: 18px;
}

.mmButton:focus {
  box-shadow: #6247ff 0 0 0 1.5px inset, rgba(45, 35, 66, 0.4) 0 2px 4px,
    rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #6247ff 0 -3px 0 inset;
}

.mmButton:hover {
  box-shadow: rgba(45, 35, 66, 0.4) 0 4px 8px,
    rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #6247ff 0 -3px 0 inset;
  transform: translateY(-2px);
}

.mmButton:active {
  box-shadow: #6247ff 0 3px 7px inset;
  transform: translateY(2px);
}
</style>
