export const L16_RPC_URL = 'https://rpc.l16.lukso.network';

export const L16_CHAIN_ID = 2828;

export const INTERFACE_IDS = {
  LSP7DigitalAsset: '0xe33f65c3',
  LSP8IdentifiableDigitalAsset: '0x49399145',
  LSP3UniversalProfile: '0xabe425d6',
};

export enum OperationType {
  Call = 0,
  Create = 1,
  Create2 = 2,
  StaticCall = 3,
  DelegateCall = 4,
}

export const COMMON_ABIS = {
  supportsInterface: [
    {
      inputs: [
        {
          internalType: 'bytes4',
          name: 'interfaceId',
          type: 'bytes4',
        },
      ],
      name: 'supportsInterface',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  ],
};

export const IPFS_GATEWAY_BASE_URL = 'https://ipfs.io/ipfs/'; //'https://2eff.lukso.dev/ipfs/' not working;

export const luksoImg =
  'https://uploads-ssl.webflow.com/629f44560745074760731ba4/62ad910dcff6e02d12a15c35_03_ICON_TOOLS_SMALL.png';
