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

export async function installSnap(
  snapId?: string,
  supportedMethods?: ("did:ethr" | "did:key")[]
): Promise<SnapInitializationResponse> {
  try {
    console.log("Connecting to snap...");
    if (!supportedMethods) supportedMethods = ["did:ethr", "did:key"];
    const snapInstallationParams: SnapInstallationParams = {
      version: "latest",
      supportedMethods,
    };
    if (snapId) snapInstallationParams.snapId = snapId;
    if (supportedMethods)
      snapInstallationParams.supportedMethods = supportedMethods;

    const metamaskSSISnap = await enableSSISnap(snapInstallationParams);

    console.log("Snap installed!");
    return {
      isSnapInstalled: true,
      snap: metamaskSSISnap,
    } as SnapInitializationResponse;
  } catch (e) {
    console.error(e);
    return { isSnapInstalled: false } as SnapInitializationResponse;
  }
}

export async function checkForVCs(snapApi?: SSISnapApi) {
  try {
    if (!snapApi) throw new Error("No snap API found.");
    const vcs = await snapApi.getVCs();
    console.log("🚀 ~ file: snap.ts ~ line 44 ~ checkForVCs ~ vcs", vcs);
    if (!vcs.length) {
      throw new Error("No VCs found.");
    }
    return vcs as VerifiableCredential[];
  } catch (err: any) {
    throw err;
  }
}

export async function createVC(
  userName: string,
  mmAddress?: string,
  snapApi?: SSISnapApi
) {
  try {
    if (!snapApi) throw new Error("No snap API found.");
    if (!mmAddress) throw new Error("No metamask address found.");
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

    const res = await saveVC(VC, snapApi);
    if (res) {
      const validVCs = await checkForVCs(snapApi);
      console.log(
        "🚀 ~ file: mmButton.vue ~ line 36 ~ connectToMM ~ validVCs",
        validVCs
      );
      if (validVCs) {
        return validVCs;
      }
    }
  } catch (err) {
    console.error(err);
  }
}

export async function saveVC(VC: VerifiableCredential, snapApi?: SSISnapApi) {
  try {
    if (!snapApi) throw new Error("No snap API found.");
    const res = await snapApi?.saveVC(VC);
    if (res) {
      console.log("Saved VC.");
      return true;
    } else {
      console.log("VC not saved.");
      return false;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function createVP(VC: VerifiableCredential, snapApi?: SSISnapApi) {
  try {
    if (!snapApi) throw new Error("No snap API found.");
    const res = await snapApi?.getVP(VC.key);
    if (res) {
      console.log("Created VP.");
      return res;
    } else {
      console.log("VP not created.");
      return undefined;
    }
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

export async function testDIDMethods(snapApi?: SSISnapApi) {
  try {
    if (!snapApi) throw new Error("No snap API found.");
    const [did, availableMethods] = await Promise.all([
      snapApi.getDID(),
      snapApi.getAvailableMethods(),
    ]);
    console.log(did);
    console.log(availableMethods);
  } catch (error) {
    console.error(error);
  }
}

export function createDIDMethod(DID?: string) {
  if (!DID) return undefined;
  const splitDID = DID.split(":");
  if (splitDID.length < 2) return undefined;
  const didName = splitDID[1];
  return {
    value: splitDID[0] + ":" + splitDID[1],
    text: didName.charAt(0).toUpperCase() + didName.slice(1),
  };
}

export async function initStore(snapApi: SSISnapApi) {
  try {
    const [did, methods] = await Promise.all([
      snapApi.getDID(),
      snapApi.getAvailableMethods(),
    ]);

    let currDIDMethod, availableMethods;
    if (did) {
      currDIDMethod = createDIDMethod(did);
    }
    if (methods) {
      availableMethods = methods.map((method) => {
        let methodName = method.split(":")[1];
        return {
          value: method,
          text: methodName.charAt(0).toUpperCase() + methodName.slice(1),
        } as DIDMethod;
      });
    }
    return { did, currDIDMethod, availableMethods } as DIDInfo;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
