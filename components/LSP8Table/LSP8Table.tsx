import { useContext, useEffect, useState } from 'react';
import { AssetsContext, AssetType } from '../../contexts/AssetsContext';

import LSP8Card from '../LSP8Card/LSP8Card';
import useWeb3Provider from '../../hooks/useWeb3Provider';
import fetchLSP8Assets from '../../utils/fetchLSP8Assets';
import fetchLSP4Metadata from '../../utils/fetchLSP4Metadata';
import { formatIntoLSP8AssetType } from '../../utils/utils';
import { LSPType } from '../../interfaces/lsps';

interface Props {
  addresses: string[];
  ownerAddress: string;
  vaultAddress?: string;
  areCreatorLSP8s?: boolean;
}

const LSP8Table: React.FC<Props> = ({
  addresses,
  ownerAddress,
  areCreatorLSP8s,
}) => {
  const web3Provider = useWeb3Provider();
  const [isLoading, setIsLoading] = useState(false);
  const [lsp8s, setLsp8s] = useState<AssetType[]>([]);
  const { setLsp8Assets, lsp8Assets } = useContext(AssetsContext);

  const fetchUPAssets = async () => {
    setLsp8Assets({});
    setIsLoading(true);
    let tempAssets: AssetType[] = [];
    await Promise.all(
      addresses.map(async (assetAddress) => {
        const lsp8Assets = await fetchLSP8Assets(
          assetAddress,
          ownerAddress,
          web3Provider,
        );
        if (!lsp8Assets) {
          return;
        }

        lsp8Assets.forEach((lsp8Asset) => {
          setLsp8Assets((prev) => ({
            ...prev,
            [assetAddress]: {
              image: lsp8Asset.image,
              icon: lsp8Asset.icon,
              tokenId: lsp8Asset.tokenId,
              description: lsp8Asset.description,
              collection: {
                name: lsp8Asset.collection.name,
                description: lsp8Asset.collection.description,
                image: lsp8Asset.collection.image,
                icon: lsp8Asset.collection.icon,
                address: lsp8Asset.collection.address,
              },
            },
          }));
          tempAssets = [
            ...tempAssets,
            {
              address: assetAddress,
              type: LSPType.LSP8,
              tokenIdOrAmount: lsp8Asset.tokenId,
            },
          ];
          setLsp8s((prev) => [...prev, ...tempAssets]);
        });
      }),
    );

    setIsLoading(false);
  };

  //commented because was creating conflicts with global context
  // const fetchCreatorLSP8s = async () => {
  //   // setLsp8Assets([]);
  //   setIsLoading(true);
  //   await Promise.all(
  //     addresses.map(async (assetAddress) => {
  //       const [collectionName, , collectionLSP4Metadata] =
  //         await fetchLSP4Metadata(assetAddress, web3Provider);
  //       const lsp8Asset = formatIntoLSP8AssetType(
  //         collectionName,
  //         collectionLSP4Metadata,
  //         assetAddress,
  //       );

  //       setLsp8s((prev) => [...prev, lsp8Asset]);
  //     }),
  //   );
  // };

  useEffect(() => {
    setLsp8s([]);
    if (!web3Provider || !addresses.length) {
      return;
    }
    if (areCreatorLSP8s) {
      // fetchCreatorLSP8s();
    }
    fetchUPAssets();
  }, [web3Provider, addresses]);

  if (!lsp8s.length && !isLoading) {
    return <div className="text-sm">No NFTs yet</div>;
  }

  return (
    <>
      <div className="grid lg:grid-cols-4 lg:gap-4 md:grid-cols-2 md:gap-3">
        {isLoading
          ? 'Loading NFTs metadata...'
          : lsp8s.map((assetObj, index) => {
              const asset = lsp8Assets[assetObj.address];
              return (
                <LSP8Card
                  key={`lsp8-${index}`}
                  assetJSON={{
                    icon: asset.icon,
                    image: asset.image,
                    tokenId: asset.tokenId,
                    description: asset.description,
                    collection: asset.collection,
                  }}
                  ownerAddress={ownerAddress}
                  areCreatorLSP8s={areCreatorLSP8s}
                />
              );
            })}
      </div>
    </>
  );
};

export default LSP8Table;
