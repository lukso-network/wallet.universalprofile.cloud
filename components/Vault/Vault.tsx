import { useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';

import useWeb3Provider from '../../hooks/useWeb3Provider';
import useEthersProvider from '../../hooks/useEthersProvider';
import fetchReceivedAssets from '../../utils/fetchReceivedAssets';
import getAssets from '../../utils/getAssets';
import fetchLSP7Assets from '../../utils/fetchLSP7Assets';
import {
  AssetsContext,
  Lsp7AssetType,
  Lsp8AssetType,
  VaultType,
} from '../../contexts/AssetsContext';
import fetchLSP8Assets from '../../utils/fetchLSP8Assets';
import LSP7Card from '../LSP7Card';
import LSP8Card from '../LSP8Card';

interface Props {
  ownerAddress: string;
  vaultAddress: string;
  vaultIndex: number;
}

const Vault: React.FC<Props> = ({ ownerAddress, vaultAddress, vaultIndex }) => {
  const web3Provider = useWeb3Provider();
  const ethersProvider = useEthersProvider() as ethers.providers.BaseProvider;
  const [lsp7s, setLsp7s] = useState<Lsp7AssetType[]>([]);
  const [lsp8s, setLsp8s] = useState<Lsp8AssetType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const {
    setVaultsAssets,
    lsp7Assets,
    lsp8Assets,
    setLsp7Assets,
    setLsp8Assets,
  } = useContext(AssetsContext);
  const fetchVaultLSP7Assets = async (
    addresses: string[],
    vaultAddress: string,
  ) => {
    setIsLoading(true);
    let tempLsp7s: Lsp7AssetType[] = [];
    await Promise.all(
      addresses.map(async (assetAddress) => {
        const lsp7Assets = await fetchLSP7Assets(
          assetAddress,
          vaultAddress,
          web3Provider,
        );
        if (!lsp7Assets) {
          return;
        }
        tempLsp7s = [...tempLsp7s, lsp7Assets];
      }),
    );
    setLsp7s(tempLsp7s);
    return tempLsp7s;
  };

  const fetchVaultLSP8Assets = async (
    addresses: string[],
    vaultAddress: string,
  ) => {
    let tempLsp8s: Lsp8AssetType[] = [];
    await Promise.all(
      addresses.map(async (assetAddress) => {
        const lsp8AssetsObj = await fetchLSP8Assets(
          assetAddress,
          vaultAddress,
          web3Provider,
        );
        if (!lsp8AssetsObj) {
          return;
        }

        tempLsp8s = [...tempLsp8s, ...lsp8AssetsObj];
        lsp8AssetsObj.forEach((lsp8Asset) => {
          setLsp8Assets({
            ...lsp8Assets,
            [assetAddress]: {
              image: lsp8Asset.image,
              tokenId: lsp8Asset.tokenId,
              icon: lsp8Asset.icon,
              description: lsp8Asset.description,
              collection: lsp8Asset.collection,
            },
          });
        });
      }),
    );
    setLsp8s(tempLsp8s);
    return tempLsp8s;
  };

  const fetchAssets = async (vaultAddress: string) => {
    //fetch all received assets for specific up address
    const receivedAssets = await fetchReceivedAssets(
      vaultAddress,
      web3Provider,
    );

    if (!receivedAssets.length) {
      setIsLoading(false);
      return;
    }

    const { lsp7Addresses, lsp8Addresses } = await getAssets(
      receivedAssets,
      web3Provider,
      ethersProvider,
    );
    // const lsp7Assets: Lsp7AssetType[] = await fetchVaultLSP7Assets(
    //   lsp7Addresses,
    //   vaultAddress,
    // );
    // const lsp8Assets: Lsp8AssetType[] = await fetchVaultLSP8Assets(
    //   lsp8Addresses,
    //   vaultAddress,
    // );
    //TODO - fix this
    const newVaultAsset: VaultType = {
      vaultAddress,
      assets: {
        lsp8Assets,
        lsp7Assets,
      },
    };
    setVaultsAssets((prev) => [...prev, newVaultAsset]);
    setIsLoading(false);
  };

  useEffect(() => {
    if (vaultAddress && web3Provider) {
      fetchAssets(vaultAddress);
    }
  }, [vaultAddress, web3Provider]);

  if (isLoading) {
    return <div>Loading Vault {vaultIndex}...</div>;
  }

  if (!lsp7s.length && !lsp8s.length) {
    return <div>No Assets in Vault {vaultIndex}</div>;
  }

  return (
    <>
      <h1 className="text-xl mt-3">Vault {vaultIndex}</h1>
      <div>
        <h2 className="text-base mt-3 mb-2">Tokens</h2>
        <div className="grid lg:grid-cols-4 lg:gap-4 md:grid-cols-2 md:gap-3">
          {lsp7s.length ? (
            lsp7s.map((lsp7, i) => (
              <LSP7Card
                key={`lsp7.address-vault-${i + 1}`}
                icon={lsp7.icon}
                name={lsp7.name}
                address={lsp7.address}
                amount={lsp7.amount}
                symbol={lsp7.symbol}
                vaultAddress={vaultAddress}
                ownerAddress={ownerAddress}
              />
            ))
          ) : (
            <div>No tokens</div>
          )}
        </div>
      </div>
      <div>
        <h2 className="text-base mt-6 mb-2">NFTs</h2>
        <div className="grid lg:grid-cols-4 lg:gap-4 md:grid-cols-2 md:gap-3">
          {lsp8s.length ? (
            lsp8s.map((lsp8, i) => (
              <LSP8Card
                key={`lsp8.address-vault-${i + 1}`}
                assetJSON={lsp8}
                ownerAddress={ownerAddress}
                vaultAddress={vaultAddress}
              />
            ))
          ) : (
            <div>No NFTs</div>
          )}
        </div>
      </div>
    </>
  );
};

export default Vault;
