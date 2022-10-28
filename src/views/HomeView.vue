<template>
    <div class="home">
        <h1 id="title" v-if="!mmStore.snapInstalled">Please connect to metamask</h1>
        <div v-if="mmStore.snapInstalled" id="vcForm">
            <label>Insert your name: </label>
            <input type="text" id="nameInput" />
            <button @click="createVC()">Create VC</button>
        </div>
    </div>
</template>

<script lang="ts">
import { useMetamaskStore } from '@/stores/metamask';
import { checkForVCs } from '@/util/snap';
import axios from 'axios';
export default {
    setup() {
        const mmStore = useMetamaskStore();
        return { mmStore }
    },
    created() {
        console.log(this.mmStore.snapApi)
        console.log(this.mmStore.mmAddress)
        console.log(this.mmStore.snapInstalled)
    },
    methods: {
        async createVC() {
            try {
                // backend: https://bclabum.informatika.uni-mb.si/ssi-demo-backend
                const backend_url = "https://bclabum.informatika.uni-mb.si/ssi-demo-backend";
                let axiosConfig = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                };
                const userName = (<HTMLInputElement>document.getElementById("nameInput"))?.value;
                console.log('🚀 ~ file: HomeView.vue ~ line 37 ~ createVC ~ userName', userName)
                let body = { name: userName, id: 'did:ethr:rinkeby:' + this.mmStore.mmAddress };
                let VC = await axios
                    .post(backend_url + '/api/vc/issue-vc', body, axiosConfig)
                    .then(function (response: any) {
                        return response.data;
                    })
                    .catch(function (error: any) {
                        console.log(error);
                    });
                console.log('🚀 ~ file: mmButton.vue ~ line 52 ~ connectToMM ~ VC', VC);

                // const vc = JSON.parse(JSON.stringify(this.mmStore.verifiableCredential));
                // console.log(JSON.parse(JSON.stringify(this.mmStore.verifiableCredential)));
                const res = await this.mmStore.snapApi?.saveVC(VC);
                if (res) {
                    console.log("Saved VC.")
                    const validVCs = await checkForVCs(this.mmStore.snapApi, this.mmStore.mmAddress);
                    console.log('🚀 ~ file: mmButton.vue ~ line 36 ~ connectToMM ~ validVCs', validVCs);
                    if(validVCs) {
                        this.mmStore.vcs = validVCs;
                    }
                } else console.log("VC not saved.")
            } catch (err) {
                console.error(err);
            }
        }
    }
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
  