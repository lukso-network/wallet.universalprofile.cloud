import { useEffect, useState } from 'react';

import useWeb3Provider from '../../hooks/useWeb3Provider';
import fetchVaultsAddresses from '../../utils/fetchVaultAddresses';
import Vault from '../Vault/Vault';

interface Props {
  ownerAddress: string;
}

const Vaults: React.FC<Props> = ({ ownerAddress }) => {
  const web3Provider = useWeb3Provider();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [vaultsAddresses, setVaultsAddresses] = useState<string[]>([]);

  useEffect(() => {
    if (!web3Provider || !ownerAddress) {
      return;
    }
    const fetch = async () => {
      const vaultAddresses = await fetchVaultsAddresses(
        ownerAddress,
        web3Provider,
      );
      setVaultsAddresses(vaultAddresses);
      setIsLoading(false);
    };
    fetch();
  }, [ownerAddress, web3Provider]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isLoading && !vaultsAddresses.length) {
    return <div>No vault yet</div>;
  }

  return (
    <>
      {vaultsAddresses.map((vaultAddress, index) => {
        return (
          <Vault
            key={vaultAddress}
            ownerAddress={ownerAddress}
            vaultAddress={vaultAddress}
            vaultIndex={index + 1}
          />
        );
      })}
    </>
  );
};

export default Vaults;
