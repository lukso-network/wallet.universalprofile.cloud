import { ethers, Signer } from 'ethers';
import { INTERFACE_IDS, COMMON_ABIS } from '../constants';
import { LSPType } from '../interfaces/lsps';

const supportsInterface = async (
  contractAddress: string,
  interfaceId: string,
  provider: Signer | ethers.providers.BaseProvider,
) => {
  const supportsInterfaceAbi = COMMON_ABIS.supportsInterface as any;
  const supportsInterfaceContract = new ethers.Contract(
    contractAddress,
    supportsInterfaceAbi,
    provider,
  );

  try {
    if (
      await supportsInterfaceContract.supportsInterface(
        INTERFACE_IDS.LSP7DigitalAsset,
      )
    ) {
      return LSPType.LSP7;
    }
    if (
      await supportsInterfaceContract.supportsInterface(
        INTERFACE_IDS.LSP8IdentifiableDigitalAsset,
      )
    ) {
      return LSPType.LSP8;
    }
  } catch (err) {
    console.error(
      `Error checking supportInterface for contract: ${contractAddress} and interfaceId: ${interfaceId}`,
      err,
    );
    return false;
  }
};

const isLSP7orLSP8 = async (
  contractAddress: string,
  provider: Signer | ethers.providers.BaseProvider,
): Promise<LSPType> => {
  const lspType = await supportsInterface(
    contractAddress,
    INTERFACE_IDS.LSP7DigitalAsset,
    provider,
  );
  if (lspType === LSPType.LSP7) {
    return LSPType.LSP7;
  }

  if (lspType === LSPType.LSP8) {
    return LSPType.LSP8;
  }

  return LSPType.Unknown;
};

export default isLSP7orLSP8;
