import { useContext, useEffect, useState } from 'react';

import {
  AssetsContext,
  Lps7AssetsType,
  AssetType,
} from '../../contexts/AssetsContext';
import useWeb3Provider from '../../hooks/useWeb3Provider';
import { LSPType } from '../../interfaces/lsps';
import fetchLSP7Assets from '../../utils/fetchLSP7Assets';
import LSP7Card from '../LSP7Card/LSP7Card';

interface Props {
  addresses: string[];
  ownerAddress: string;
  vaultAddress?: string;
  areCreatorLSP7s?: boolean;
}

const LSP7Table: React.FC<Props> = ({
  addresses,
  ownerAddress,
  areCreatorLSP7s,
}) => {
  const web3Provider = useWeb3Provider();
  const [isLoading, setIsLoading] = useState(false);
  const [lsp7s, setLsp7s] = useState<AssetType[]>([]);

  const { setLsp7Assets, lsp7Assets, setLsp7UPAssets, lsp7UPAssets } =
    useContext(AssetsContext);

  const fetchUPAssets = async () => {
    setLsp7Assets({});
    setIsLoading(true);
    let tempLsp7s: Lps7AssetsType = {};
    let tempAssets: AssetType[] = [];
    await Promise.all(
      addresses.map(async (assetAddress) => {
        const lsp7Asset = await fetchLSP7Assets(
          assetAddress,
          ownerAddress,
          web3Provider,
        );
        if (!lsp7Asset) {
          return;
        }
        tempLsp7s = {
          ...tempLsp7s,
          [assetAddress]: {
            name: lsp7Asset.name,
            symbol: lsp7Asset.symbol,
            icon: lsp7Asset.icon,
            amount: lsp7Asset.amount,
          },
        };
        tempAssets = [
          ...tempAssets,
          {
            address: assetAddress,
            type: LSPType.LSP7,
            tokenIdOrAmount: lsp7Asset.amount,
          },
        ];
        setIsLoading(false);
      }),
    );
    setLsp7Assets({ ...lsp7Assets, ...tempLsp7s });
    setLsp7UPAssets(tempAssets);
    setLsp7s(tempAssets);
  };

  //commented because was creating conflic with global context
  // const fetchCreatorAssets = async () => {
  //   setIsLoading(true);
  //   await Promise.all(
  //     addresses.map(async (assetAddress) => {
  //       const lsp7Assets = await fetchLSP7Assets(
  //         assetAddress,
  //         ownerAddress,
  //         web3Provider,
  //         true,
  //       );
  //       if (!lsp7Assets) {
  //         return;
  //       }
  //       setLsp7s((prev) => {...prev, lsp7Assets});
  //     }),
  //   );
  //   setIsLoading(false);
  // };

  useEffect(() => {
    setLsp7s([]);
    if (!web3Provider || !addresses.length) {
      return;
    }
    if (areCreatorLSP7s) {
      // fetchCreatorAssets();
      return;
    }
    fetchUPAssets();
  }, [web3Provider, addresses]);

  if (!lsp7s.length && !isLoading) {
    return <div className="text-sm">No token yet</div>;
  }

  return (
    <div className="grid lg:grid-cols-4 lg:gap-4 md:grid-cols-2 md:gap-3">
      {isLoading
        ? 'Loading tokens metadata...'
        : lsp7UPAssets.map((assetObj) => {
            return (
              <LSP7Card
                key={`lsp7-${assetObj.address}`}
                icon={lsp7Assets[assetObj.address]?.icon}
                amount={lsp7Assets[assetObj.address]?.amount}
                name={lsp7Assets[assetObj.address]?.name}
                symbol={lsp7Assets[assetObj.address]?.symbol}
                address={assetObj.address}
                isCreatorLsp7={areCreatorLSP7s}
                ownerAddress={ownerAddress}
              />
            );
          })}
    </div>
  );
};

export default LSP7Table;
