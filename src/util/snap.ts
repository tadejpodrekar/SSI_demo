import axios from "axios";
import { enableSSISnap } from "@blockchain-lab-um/ssi-snap-connector";
import type { SSISnapApi } from "@blockchain-lab-um/ssi-snap-types";
import type {
  SnapInstallationParams,
  VerifiableCredential,
  DIDMethod,
  DIDInfo,
  SnapInitializationResponse,
} from "./interfaces";

const backend_url = "https://bclabum.informatika.uni-mb.si/ssi-demo-backend";
const vcIssuerId =
  "did:ethr:rinkeby:0x0241abd662da06d0af2f0152a80bc037f65a7f901160cfe1eb35ef3f0c532a2a4d";

export async function installSnap(snapId?: string) {
  try {
    console.log("Connecting to snap...");

    const snapInstallationParams: SnapInstallationParams = {
      version: "latest",
      supportedMethods: ["did:ethr", "did:key"],
    };
    if (snapId) snapInstallationParams.snapId = snapId;

    const metamaskSSISnap = await enableSSISnap(snapInstallationParams);

    console.log("Snap installed!");
    return <SnapInitializationResponse>{
      isSnapInstalled: true,
      snap: metamaskSSISnap,
    };
  } catch (e) {
    console.error(e);
    return <SnapInitializationResponse>{ isSnapInstalled: false };
  }
}

export async function checkForVCs(snapApi?: SSISnapApi, mmAddress?: string) {
  try {
    if (!snapApi) throw new Error("No snap API found.");
    const vcs = await snapApi.getVCs();
    if (!vcs.length) {
      console.log("No VCs found.");
      return undefined;
    }
    if (mmAddress) {
      vcs.map((vc: any) => {
        console.log(
          vc.credentialSubject.id.split(":")[3].toString().toUpperCase(),
          mmAddress,
          vcIssuerId.toUpperCase(),
          vc.issuer.id.toString().toUpperCase()
        );
        if (
          vc.credentialSubject.id.split(":")[3].toString().toUpperCase() ===
            mmAddress.toUpperCase() &&
          vc.issuer.id.toString().toUpperCase() === vcIssuerId.toUpperCase()
        ) {
          console.log("Valid VC found!");
        }
      });
    }
    return <VerifiableCredential[]>vcs;
  } catch (err: any) {
    console.error(err.message);
    return undefined;
  }
}

export async function createVC(userName: string, mmAddress?: string, snapApi?: SSISnapApi) {
  try {
    if(!snapApi) throw new Error("No snap API found.");
    if(!mmAddress) throw new Error("No metamask address found.");
    let axiosConfig = {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
    let body = {
      name: userName,
      id: "did:ethr:rinkeby:" + mmAddress,
    };
    let VC = await axios
      .post(backend_url + "/api/vc/issue-vc", body, axiosConfig)
      .then((response: any) => {
        return response.data;
      })
      .catch((error: any) => {
        console.log(error);
      });
    console.log("🚀 ~ file: mmButton.vue ~ line 52 ~ connectToMM ~ VC", VC);

    const res = await snapApi?.saveVC(VC);
    if (res) {
      console.log("Saved VC.");
      const validVCs = await checkForVCs(
        snapApi,
        mmAddress
      );
      console.log(
        "🚀 ~ file: mmButton.vue ~ line 36 ~ connectToMM ~ validVCs",
        validVCs
      );
      if (validVCs) {
        return validVCs;
      }
    } else console.log("VC not saved.");
  } catch (err) {
    console.error(err);
  }
}

export async function initStore(snapApi: SSISnapApi) {
  let selectedDID, availableDIDs;
  const method = await snapApi?.getMethod();
  if (method) {
    selectedDID = <DIDMethod>{ value: method, text: method.split(":")[1] };
  }

  const methods = await snapApi?.getAvailableMethods();
  if (methods) {
    console.log(methods);
    availableDIDs = methods.map((method) => {
      return <DIDMethod>{ value: method, text: method.split(":")[1] };
    });
  }

  return <DIDInfo>{ selectedDID, availableDIDs };
}
