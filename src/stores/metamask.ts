import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { SSISnapApi } from '@blockchain-lab-um/ssi-snap-types';
import type { VerifiableCredential } from  '../util/interfaces'

/* interface VerifiableCredential {
    credentialSubject: {
        accomplishmentType: string,
        learnerName: string,
        achievement: string,
        courseProvider: string,
        id: string
    },
    issuer: {
        id: string
    },
    id: string,
    type: string[],
    credentialSchema: {
        id: string,
        type: string
    },
    "@context": string[],
    issuanceDate: string,
    proof: {
        type: string,
        jwt: string
    },
    key: string
}*/

const vc = {
    credentialSubject: {
        "accomplishmentType": "Developer Certificate",
        "learnerName": "tadej",
        "achievement": "Certified Solidity Developer 2",
        "courseProvider": "https://blockchain-lab.um.si/",
        "id": "did:ethr:rinkeby:0xc48199cc05054665b1991d36f0091a89b668c2c4"
    },
    issuer: {
        "id": "did:ethr:rinkeby:0x0241abd662da06d0af2f0152a80bc037f65a7f901160cfe1eb35ef3f0c532a2a4d"
    },
    id: "3b8c781e-6b96-47c2-bd19-3916572bbc6f",
    type: [
        "VerifiableCredential",
        "ProgramCompletionCertificate"
    ],
    credentialSchema: {
        id: "https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json",
        type: "JsonSchemaValidator2018"
    },
    "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json"
    ],
    issuanceDate: "2022-10-25T20:37:55.000Z",
    proof: {
        type: "JwtProof2020",
        jwt: "eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvcHJvZ3JhbS1jb21wbGV0aW9uLWNlcnRpZmljYXRlLzEuMC9sZC1jb250ZXh0Lmpzb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIlByb2dyYW1Db21wbGV0aW9uQ2VydGlmaWNhdGUiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWNjb21wbGlzaG1lbnRUeXBlIjoiRGV2ZWxvcGVyIENlcnRpZmljYXRlIiwibGVhcm5lck5hbWUiOiJ0YWRlaiIsImFjaGlldmVtZW50IjoiQ2VydGlmaWVkIFNvbGlkaXR5IERldmVsb3BlciAyIiwiY291cnNlUHJvdmlkZXIiOiJodHRwczovL2Jsb2NrY2hhaW4tbGFiLnVtLnNpLyJ9LCJjcmVkZW50aWFsU2NoZW1hIjp7ImlkIjoiaHR0cHM6Ly9iZXRhLmFwaS5zY2hlbWFzLnNlcnRvLmlkL3YxL3B1YmxpYy9wcm9ncmFtLWNvbXBsZXRpb24tY2VydGlmaWNhdGUvMS4wL2pzb24tc2NoZW1hLmpzb24iLCJ0eXBlIjoiSnNvblNjaGVtYVZhbGlkYXRvcjIwMTgifX0sInN1YiI6ImRpZDpldGhyOnJpbmtlYnk6MHhjNDgxOTljYzA1MDU0NjY1YjE5OTFkMzZmMDA5MWE4OWI2NjhjMmM0IiwianRpIjoiM2I4Yzc4MWUtNmI5Ni00N2MyLWJkMTktMzkxNjU3MmJiYzZmIiwibmJmIjoxNjY2NzMwMjc1LCJpc3MiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4MDI0MWFiZDY2MmRhMDZkMGFmMmYwMTUyYTgwYmMwMzdmNjVhN2Y5MDExNjBjZmUxZWIzNWVmM2YwYzUzMmEyYTRkIn0.LqDUjzBUXkihBkm1gxtODJB2Nn7shb_05aAkK4XUW7m1eEywixkSyLxmMNWNzXebSMisIDqGf6bz5AbVOPcAXQ"
    },
    key: "a40601f0-0a8b-4e7a-9cc1-3b46a5f8ffb7"
}

export const useMetamaskStore = defineStore('metamask', () => {
    const mmAddress = ref<string | undefined>(undefined);
    const snapApi = ref<SSISnapApi | undefined>(undefined);
    const verifiableCredential = ref<VerifiableCredential | undefined>(vc);
    const vcs = ref<VerifiableCredential[] | undefined>(undefined);
    const vcIssuerId = computed(()=>{return "did:ethr:rinkeby:0x0241abd662da06d0af2f0152a80bc037f65a7f901160cfe1eb35ef3f0c532a2a4d"});
    const snapInstalled = computed(()=>{ return (mmAddress.value && snapApi.value) ? true : false });

    return {
        snapInstalled,
        mmAddress,
        snapApi,
        verifiableCredential,
        vcs,
        vcIssuerId
    }
})
