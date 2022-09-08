import { useContext, useState } from 'react';

import { WalletAddressContext } from '../../contexts/WalletAddressContext';
import { LSPType } from '../../interfaces/lsps';
import AssetTransferModal from '../AssetTransferModal';

interface Props {
  icon: string;
  amount: number;
  name: string;
  symbol: string;
  address: string;
  isCreatorLsp7?: boolean;
  vaultAddress?: string;
  ownerAddress: string;
}

const LSP7Card: React.FC<Props> = ({
  icon,
  amount,
  name,
  symbol,
  ownerAddress,
  isCreatorLsp7,
  vaultAddress,
  address,
}) => {
  const { walletAddress } = useContext(WalletAddressContext);

  const [isTransferModalOpen, setIsTransferModalOpen] =
    useState<boolean>(false);

  const isAssetTransferable = () => {
    if (!isCreatorLsp7 && ownerAddress === walletAddress) {
      return true;
    }
  };

  return (
    <div className="border border-darkGray p-3 rounded-lg h-[280px] mt-8">
      <div className="rounded h-[180px] overflow-hidden mb-2">
        <img
          src={icon}
          alt="nft-image"
          className="object-none rounded w-full h-full bg-cover bg-repeat bg-center"
        />
      </div>
      <div className="flex justify-between items-end">
        <div>
          <div className="text-sm font-bold text-gray-600 leading-6">
            {name}
          </div>
          <div className="leading-6">{symbol}</div>
          {amount != 0 && (
            <div className="text-xs leading-6">{amount} tokens</div>
          )}
        </div>
        {isAssetTransferable() && (
          <div className="flex justify-end">
            <button
              className="mt-2 border border-red-400 py-1 px-2 text-red-400 rounded h-8 mb-2"
              onClick={() => setIsTransferModalOpen(true)}
            >
              Send
            </button>
          </div>
        )}
      </div>
      {isTransferModalOpen && (
        <AssetTransferModal
          assetAddress={address}
          assetImage={icon}
          assetType={LSPType.LSP7}
          ownerAddress={ownerAddress}
          setIsTransferModalOpen={setIsTransferModalOpen}
          amount={amount}
          vaultAddress={vaultAddress}
        />
      )}
    </div>
  );
};

export default LSP7Card;
