export enum PROVIDERS {
  RPC = 'RPC',
  INJECTED = 'INJECTED',
}

export enum STORAGE_KEY {
  CONNECTION_EXPIRY = 'connectionExpiry',
  CURRENCY_STORE = 'currency',
  APP_STORE = 'app',
}

export enum CACHE_KEY {
  SETTINGS = 'settings',
  HASHED_IMAGE = 'hashed-images',
}

export enum STANDARDS {
  EOA = 'EOA',
  LSP3 = 'LSP0ERC725Account',
  LSP7 = 'LSP7DigitalAsset',
  LSP8 = 'LSP8IdentifiableDigitalAsset',
  UNKNOWN = 'UnknownContract',
}

export const STANDARDS_ABBREVIATIONS = {
  EOA: 'EOA',
  LSP7DigitalAsset: 'LSP7',
  LSP8IdentifiableDigitalAsset: 'LSP8',
  LSP0ERC725Account: 'LSP3',
  UnknownContract: 'UNKNOWN',
}
