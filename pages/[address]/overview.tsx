import type { NextPage } from 'next';
import { ethers } from 'ethers';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import erc725Schema from '@erc725/erc725.js/schemas/LSP3UniversalProfileMetadata.json';

import AddressError from '../../components/AddressError/AddressError';
import UserInfos from '../../components/UserInfos/UserInfos';
import { ERC725, ERC725JSONSchema } from '@erc725/erc725.js';
import { IPFS_GATEWAY_BASE_URL } from '../../constants';
import { LSP3Profile } from '../../interfaces/lsps';
import { validateLSP3 } from '../../utils/validateLSP3';
import Vaults from '../../components/Vaults/Vaults';
import ReceivedAssets from '../../components/ReceivedAssets';
import useWeb3Provider from '../../hooks/useWeb3Provider';
import CreatedAssets from '../../components/CreatedAssets';

const config = { ipfsGateway: IPFS_GATEWAY_BASE_URL };

const AdressOverview: NextPage = () => {
  const router = useRouter();
  const [address, setAddress] = useState('');
  const [addressError, setAddressError] = useState<string>('');
  const [isUniversalProfile, setIsUniversalProfile] = useState<boolean>(false);
  const [isLoadingUp, setIsLoadingUp] = useState<boolean>(false);

  const [lsp3JSON, setLsp3JSON] = useState<LSP3Profile>();

  const web3Provider = useWeb3Provider();

  const checkIsUP = async (address: string) => {
    const erc725 = new ERC725(
      erc725Schema as ERC725JSONSchema[],
      address,
      web3Provider,
      config,
    );
    try {
      setIsLoadingUp(true);
      const LSP3Profile = await erc725.fetchData(['LSP3Profile']);
      setIsUniversalProfile(true);
      const formattedLSP3 = validateLSP3(LSP3Profile[0].value);
      setLsp3JSON(formattedLSP3);
      setIsLoadingUp(false);
    } catch (error) {
      console.log(error);
      setAddressError('Address is not a Universal Profile');
      setIsUniversalProfile(false);
      setIsLoadingUp(false);
      setLsp3JSON(undefined);
    }
  };

  useEffect(() => {
    if (router.query.address) {
      setAddress(router.query.address as string);
    }
  }, [router.query.address]);

  useEffect(() => {
    if (address && web3Provider) {
      setAddressError('');
      if (!ethers.utils.isAddress(address)) {
        setAddressError('Invalid Address');
      } else {
        checkIsUP(address);
      }
    }
  }, [address, web3Provider]);

  return (
    <div className="mx-8">
      {address && <UserInfos lsp3JSON={lsp3JSON} address={address} />}
      {isLoadingUp && (
        <div className="text-5xl flex justify-center mt-20">
          Loading Universal Profile...
        </div>
      )}
      {!isLoadingUp && addressError ? (
        <AddressError message={addressError} />
      ) : (
        <div />
      )}

      <CreatedAssets
        isUniversalProfile={isUniversalProfile}
        ownerAddress={address}
      />
      <ReceivedAssets
        isUniversalProfile={isUniversalProfile}
        ownerAddress={address}
      />
      <div className="mt-8">
        <div className="pb-2 py-6">
          <h2 className="border-b border-darkGray text-2xl pb-2">Vaults</h2>
          <Vaults ownerAddress={address} />
        </div>
      </div>
    </div>
  );
};

export default AdressOverview;
