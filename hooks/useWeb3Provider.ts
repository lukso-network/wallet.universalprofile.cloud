import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { L16_RPC_URL } from '../constants';

const useWeb3Provider = () => {
  const [provider, setProvider] = useState<any>(); //web3 does not export httpProvider type

  useEffect(() => {
    const provider = new Web3.providers.HttpProvider(L16_RPC_URL);
    setProvider(provider);
  }, []);

  return provider;
};

export default useWeb3Provider;
