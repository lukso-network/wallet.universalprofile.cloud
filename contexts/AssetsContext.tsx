import { createContext, useState } from 'react';
import { LSPType } from '../interfaces/lsps';

export type Lsp7AssetType = {
  name: string;
  symbol: string;
  icon: string;
  amount: number;
};

export type Lps7AssetsType = {
  [address: string]: Lsp7AssetType;
};

export type Lsp8AssetType = {
  image: string;
  icon: string;
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

export type Lps8AssetsType = {
  [address: string]: Lsp8AssetType;
};

export type AssetType = {
  type: LSPType.LSP7 | LSPType.LSP8;
  tokenIdOrAmount: number | string;
  address: string;
};

export type VaultType = {
  vaultAddress: string;
  assets: AssetType[];
};

interface AssetsContextInterface {
  lsp7Assets: Lps7AssetsType;
  setLsp7Assets: React.Dispatch<React.SetStateAction<Lps7AssetsType>>;
  lsp7UPAssets: AssetType[];
  setLsp7UPAssets: React.Dispatch<React.SetStateAction<AssetType[]>>;
  lsp8Assets: Lps8AssetsType;
  setLsp8Assets: React.Dispatch<React.SetStateAction<Lps8AssetsType>>;
  vaultsAssets: VaultType[];
  setVaultsAssets: React.Dispatch<React.SetStateAction<VaultType[]>>;
}

const initalContext = {
  lsp7Assets: {},
  setLsp7Assets: () => {},
  lsp7UPAssets: [],
  setLsp7UPAssets: () => [],
  lsp8Assets: {},
  setLsp8Assets: () => {},
  vaultsAssets: [],
  setVaultsAssets: () => [],
};

export const AssetsContext =
  createContext<AssetsContextInterface>(initalContext);

interface Props {
  children: React.ReactNode;
}

const AssetsProvider: React.FC<Props> = ({ children }) => {
  const [lsp7Assets, setLsp7Assets] = useState<Lps7AssetsType>({});
  const [lsp7UPAssets, setLsp7UPAssets] = useState<AssetType[]>([]);

  const [lsp8Assets, setLsp8Assets] = useState<Lps8AssetsType>({});

  const [vaultsAssets, setVaultsAssets] = useState<VaultType[]>([]);

  return (
    <AssetsContext.Provider
      value={{
        lsp7Assets,
        setLsp7Assets,
        lsp8Assets,
        setLsp8Assets,
        vaultsAssets,
        setVaultsAssets,
        lsp7UPAssets,
        setLsp7UPAssets,
      }}
    >
      {children}
    </AssetsContext.Provider>
  );
};

export default AssetsProvider;
