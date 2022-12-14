import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import useEthersProvider from '../../hooks/useEthersProvider';
import useWeb3Provider from '../../hooks/useWeb3Provider';
import LSP7Table from '../../components/LSP7Table/LSP7Table';
import LSP8Table from '../../components/LSP8Table/LSP8Table';
import fetchCreatedAssets from '../../utils/fetchCreatedAssets';
import getAssets from '../../utils/getAssets';

interface Props {
  isUniversalProfile: boolean;
  ownerAddress: string;
}

const CreatedAssets: React.FC<Props> = ({
  isUniversalProfile,
  ownerAddress,
}) => {
  const [lsp7Addresses, setLsp7Addresses] = useState<string[]>([]);
  const [lsp8Addresses, setLsp8Addresses] = useState<string[]>([]);

  const ethersProvider = useEthersProvider() as ethers.providers.BaseProvider;

  //ERC725 does not support ethers provider
  const web3Provider = useWeb3Provider();

  const getCreatedAssets = async () => {
    //fetch all received assets for specific up address
    const createdAssets = await fetchCreatedAssets(web3Provider, ownerAddress);

    const { lsp7Addresses, lsp8Addresses } = await getAssets(
      createdAssets,
      web3Provider,
      ethersProvider,
    );

    setLsp7Addresses(lsp7Addresses);
    setLsp8Addresses(lsp8Addresses);
  };

  useEffect(() => {
    isUniversalProfile && getCreatedAssets();
  }, [isUniversalProfile, ownerAddress]);
  return (
    <div>
      <div className="text-5xl text-center py-10">Created Assets</div>
      <div className="pb-2">
        <h2 className="border-b border-darkGray text-2xl pb-2">Tokens</h2>
        <LSP7Table
          addresses={lsp7Addresses}
          ownerAddress={ownerAddress}
          areCreatorLSP7s
        />
      </div>
      <div className="pb-2">
        <h2 className="border-b border-darkGray text-2xl pb-2 mt-6">NFTs</h2>
        <LSP8Table
          addresses={lsp8Addresses}
          ownerAddress={ownerAddress}
          areCreatorLSP8s
        />
      </div>
    </div>
  );
};

export default CreatedAssets;
