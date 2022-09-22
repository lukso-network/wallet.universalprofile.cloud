import { useState } from 'react';
import identicon from 'ethereum-blockies-base64';

import { LSPType } from '../../interfaces/lsps';
import AssetTransferModal from '../AssetTransferModal';

interface Props {
  assetJSON: {
    icon: string;
    image: string;
    tokenId: string;
    description: string;
    collection: {
      name: string;
      description: string;
      image: string;
      icon: string;
      address: string;
    };
  };
  ownerAddress: string;
  vaultAddress?: string;
  areCreatorLSP8s?: boolean;
}

const LSP8Card: React.FC<Props> = ({
  assetJSON,
  ownerAddress,
  vaultAddress,
  areCreatorLSP8s,
}) => {
  const [showSendBtn, setShowSendBtn] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  return (
    <div
      className="border hover:scale-105 relative border-gray-300 rounded-xl h-[280px] overflow-hidden mt-8"
      onMouseEnter={() => setShowSendBtn(true)}
      onMouseLeave={() => setShowSendBtn(false)}
    >
      <div className="rounded h-[180px] overflow-hidden mb-2">
        <img
          src={assetJSON.image}
          alt="nft-image"
          className="object-cover rounded w-full h-full bg-cover bg-repeat bg-center"
        />
      </div>
      <div className="px-3">
        <div className="font-ibmpBold text-gray-600 leading-6">
          {assetJSON.collection.name}
        </div>
        {assetJSON.tokenId && (
          <div className="text-sm leading-6">
            #{parseInt(assetJSON.tokenId)}
          </div>
        )}
        <div className="absolute bottom-[-30%] right-[-30%] rotate-45">
          <img
            src={identicon(assetJSON.collection.address)}
            alt="address identicon"
          />
        </div>
      </div>
      {showSendBtn && !areCreatorLSP8s && (
        <div className="absolute z-1 top-0 left-0 w-full h-full bg-white bg-opacity-50 flex items-center justify-center">
          <button className="px-3 py-2 font-bold bg-deepPink rounded text-white">
            Send
          </button>
        </div>
      )}
      {isTransferModalOpen && (
        <AssetTransferModal
          vaultAddress={vaultAddress}
          setIsTransferModalOpen={setIsTransferModalOpen}
          assetType={LSPType.LSP8}
          assetAddress={assetJSON.collection.name}
          tokenId={assetJSON.tokenId}
          assetImage={assetJSON.image}
          ownerAddress={ownerAddress}
        />
      )}
    </div>
  );
};

export default LSP8Card;
