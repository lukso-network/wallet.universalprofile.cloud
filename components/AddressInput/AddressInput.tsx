import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import identicon from 'ethereum-blockies-base64';

import { ERC725, ERC725JSONSchema } from '@erc725/erc725.js';

import lsp3Schema from '@erc725/erc725.js/schemas/LSP3UniversalProfileMetadata.json';

import useWeb3Provider from '../../hooks/useWeb3Provider';
import useEthersProvider from '../../hooks/useEthersProvider';
import { validateLSP3 } from '../../utils/validateLSP3';

import { LSP3Profile, LSPType } from '../../interfaces/lsps';
import { IPFS_GATEWAY_BASE_URL } from '../../constants';
import detectLSPInterface from '../../utils/detectLSPInterface';

const config = { ipfsGateway: IPFS_GATEWAY_BASE_URL };

interface AddressInfo {
  address: string;
  isUniversalProfile: boolean;
  isVault: boolean;
  LSP3JSON?: LSP3Profile;
}

interface Props {
  inputAddress: string;
  onChange: (updatedAddressInfos: AddressInfo) => void;
}

const AddressInput: React.FC<Props> = ({ inputAddress, onChange }) => {
  const [addressError, setAddressError] = useState<boolean>();
  const [addressInfos, setAddressInfos] = useState<AddressInfo>();
  const [address, setAddress] = useState(inputAddress);

  const web3Provider = useWeb3Provider();
  const ethersProvider = useEthersProvider() as
    | ethers.Signer
    | ethers.providers.BaseProvider;

  useEffect(() => {
    if (!addressInfos) {
      return;
    }
    onChange(addressInfos);
  }, [addressInfos]);

  const addressAvatar = (LSP3JSON: LSP3Profile, address: string): string => {
    if (LSP3JSON.LSP3Profile?.profileImage[0]?.url) {
      const LSP3ProfileImage = LSP3JSON.LSP3Profile.profileImage[0].url;
      if (LSP3ProfileImage.includes('ipfs://')) {
        return `${IPFS_GATEWAY_BASE_URL}${
          LSP3ProfileImage.split('ipfs://')[1]
        }`;
      }

      return LSP3JSON?.LSP3Profile?.profileImage[0].url;
    }
    return identicon(address);
  };

  const checkAddress = async (address: string) => {
    try {
      const isVault = await detectLSPInterface(
        address,
        LSPType.LSP9,
        web3Provider,
        ethersProvider,
      );
      if (isVault) {
        setAddressInfos({
          address,
          isUniversalProfile: false,
          isVault: true,
        });
        return;
      }
    } catch (error) {
      console.log(error);
    }

    try {
      const isUP = await detectLSPInterface(
        address,
        LSPType.LSP3,
        web3Provider,
        ethersProvider,
      );

      if (isUP) {
        const erc725 = new ERC725(
          lsp3Schema as ERC725JSONSchema[],
          address,
          web3Provider,
          config,
        );

        // Fetch LSP3 metadata contents
        const proxyAccountMetadataResult = await erc725.fetchData([
          'LSP3Profile',
        ]);

        const formattedLSP3 = validateLSP3(proxyAccountMetadataResult[0].value);

        setAddressInfos({
          address,
          isUniversalProfile: true,
          LSP3JSON: formattedLSP3,
          isVault: false,
        });

        return;
      } else {
        setAddressInfos({
          address,
          isUniversalProfile: false,
          isVault: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAddressInfo = (address: string) => {
    setAddressError(false);
    if (!ethers.utils.isAddress(address)) {
      setAddressError(true);
      return;
    }

    checkAddress(address);
  };

  const renderUPInfos = (addressInfos: AddressInfo) => (
    <div className="mt-2 ml-1">
      <h1>{addressInfos?.LSP3JSON?.LSP3Profile.name}</h1>
      <img
        src={addressAvatar(
          addressInfos.LSP3JSON as LSP3Profile, //checked before render
          addressInfos.address,
        )}
        className="w-20 h-20 mt-1"
        alt="UP Profile Image"
      />
    </div>
  );

  return (
    <>
      <input
        onChange={(e) => {
          fetchAddressInfo(e.target.value);
          setAddress(e.target.value);
        }}
        value={address}
        type="text"
        placeholder="Enter an address"
        spellCheck="false"
        className="bg-darkGray focus:outline-none px-3 text-gray-400 focus:shadow-outline rounded-lg py-2 px-4 block w-full appearance-none "
      />
      {addressError && <div className="text-red-500">Invalid address</div>}
      {addressInfos?.isUniversalProfile ? (
        renderUPInfos(addressInfos)
      ) : addressInfos?.isVault ? (
        <div>Address is a Vault 🔐</div>
      ) : (
        <div className="text-orange-500">
          Address is not a Universal Profile nor Vault
        </div>
      )}
    </>
  );
};

export default AddressInput;
