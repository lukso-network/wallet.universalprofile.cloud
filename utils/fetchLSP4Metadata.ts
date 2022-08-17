import { IPFS_GATEWAY_BASE_URL} from '../constants';
import ERC725js, { ERC725JSONSchema } from '@erc725/erc725.js';
import LSP4DigitalAssetSchema from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json';
import { validateLSP4MetaData } from './validateLSP4Metdata';
import { LSP4Metadata } from '../interfaces/lsps';
import { URLDataWithHash, URLDataWithJson } from '@erc725/erc725.js/build/main/src/types';



const fetchLSP4Metadata = async (address: string,
  provider:any):Promise<[string, string, LSP4Metadata]> => {
  const options = {
    ipfsGateway: IPFS_GATEWAY_BASE_URL,
  };

  const erc725Asset = new ERC725js(LSP4DigitalAssetSchema as ERC725JSONSchema[],address, provider, options);

  try {

    const LSP4DigitalAsset = await erc725Asset.fetchData(['LSP4TokenName', 'LSP4TokenSymbol', 'LSP4Metadata']);
    const LSP4TokenName =  LSP4DigitalAsset[0].value as string;
    const LSP4TokenSymbol =  LSP4DigitalAsset[1].value as string;
    const LSP4Metadata =  validateLSP4MetaData(LSP4DigitalAsset[2].value as URLDataWithHash);
    return [LSP4TokenName, LSP4TokenSymbol, LSP4Metadata];
  } catch (error) {
    console.log(error);
    return ['','',{"LSP4Metadata":{
      description: '',
      links: [],
      images: [[]],
      icons: [],
      assets: [],
    }}];
  }
}

export default fetchLSP4Metadata
