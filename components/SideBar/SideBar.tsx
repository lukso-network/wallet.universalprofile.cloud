import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiPlus } from 'react-icons/fi';
import { AiOutlineEye } from 'react-icons/ai';
import { useContext, useEffect } from 'react';

import { WalletAddressContext } from '../../contexts/WalletAddressContext';
import { FiDollarSign } from 'react-icons/fi';
import { L16_CHAIN_ID } from '../../constants';
import { toast } from 'react-toastify';
import walletConnectConnector from '../../utils/walletConnectConnector';
import useWalletConnect from '../../hooks/useWalletConnect';

const SideBar: React.FC = () => {
  const router = useRouter();
  const isOverviewMode = router.pathname.includes('overview');

  const { setWalletAddress, walletAddress } = useContext(WalletAddressContext);

  useWalletConnect();

  const isValidChainId = () => {
    const chainId = parseInt(window.ethereum.networkVersion);
    if (chainId && window.ethereum.networkVersion != L16_CHAIN_ID) {
      toast('Please switch to L16 network');
      return false;
    }
    return true;
  };

  const isConnected = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      });
      if (accounts.length) {
        isValidChainId() && setWalletAddress(accounts[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const listenForAccountChanges = () => {
    const { ethereum } = window;

    if (!ethereum) return;

    //added this line below because when using walletconnect,
    //so that that listenForAccountChanges does not override the walletConnect account state
    //but this function will be useful when connected through UP extension
    const walletConnectorAccount = walletConnectConnector().accounts[0];
    if (walletConnectorAccount) {
      return;
    }

    ethereum.on('accountsChanged', function (accounts: string[]) {
      if (walletAddress) {
        return;
      }
      if (accounts.length) {
        setWalletAddress(accounts[0]);
        return;
      }
      setWalletAddress('');
    });

    ethereum.on('chainChanged', function (networkId: number) {
      if (networkId !== L16_CHAIN_ID) {
        setWalletAddress('');
        toast('Please switch to L16 network');
      }
    });
  };

  useEffect(() => {
    listenForAccountChanges();
    isConnected();
  }, []);

  const renderLogin = () => (
    <>
      <div className="text-gray-300 my-6 leading-5 text-sm h-12">
        Connect to the UP extension to manage your portfolio
      </div>
      <Link href="/connect-wallets">
        <button className="flex items-center rounded-lg py-1 px-4">
          <div className="text-2xl">
            <FiPlus className="text-white" />
          </div>
          <span className="mx-2 text-white text-sm">Connect</span>
        </button>
      </Link>
    </>
  );

  const renderLoggedIn = () => (
    <>
      <div className="text-gray-700 my-6 leading-5 text-sm h-12">
        Manage your portfolio
      </div>
      <Link href={`/${walletAddress}/overview`}>
        <button className="flex items-center rounded-lg bg-deepPink py-1 px-4">
          <div className="text-2xl">
            <FiDollarSign className="text-white" />
          </div>
          <span className="mx-2 text-white text-sm">View</span>
        </button>
      </Link>
    </>
  );

  return (
    <div
      className="fixed bg-mediumPink left-0 top-0 bottom-0
      w-[240px] flex flex-col px-4"
    >
      <div className="flex flex-col items-center my-8 text-center">
        <div className="text-darkGray font-ibmpBold ">{`Welcome to LUKSO's Wallet`}</div>
        {walletAddress ? renderLoggedIn() : renderLogin()}
      </div>
      <div className="border-t border-solid border-1 border-gray-800 py-3">
        <div className="text-sm flex flex-col">
          <Link href="/">
            <div
              className={`flex text-gray-300 items-center mb-10 py-3
                        px-2 rounded-lg hover:bg-gray-100 text-sm cursor-pointer
                        ${isOverviewMode ? 'text-deepPink' : ''}
                      `}
            >
              <AiOutlineEye className="text-2xl mr-3" />
              <div>Overview</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
