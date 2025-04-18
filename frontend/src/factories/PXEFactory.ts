import { PXE } from '@aztec/circuit-types';
import { createPXEClient, waitForPXE } from "@aztec/aztec.js";

const PXE_URL = import.meta.env.VITE_PXE_URL as string;

export class PXEFactory {
  private static pxeInstance: PXE | null = null;

  public static async getPXEInstance(): Promise<PXE> {
    if (!PXEFactory.pxeInstance) {
      PXEFactory.pxeInstance = createPXEClient(PXE_URL);
      await waitForPXE(PXEFactory.pxeInstance);
    }
    return PXEFactory.pxeInstance;
  }
}