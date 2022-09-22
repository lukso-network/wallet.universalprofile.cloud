import Web3 from 'web3';
import LSP7Artifact from '@lukso/lsp-smart-contracts/artifacts/LSP7DigitalAsset.json';
import LSP8Artifact from '@lukso/lsp-smart-contracts/artifacts/LSP8IdentifiableDigitalAsset.json';
import LSP9Artifact from '@lukso/lsp-smart-contracts/artifacts/LSP9Vault.json';

import { OperationType } from '../constants';

export const transferLSP7Asset = async (
  contractAddress: string,
  from: string,
  to: string,
  isReceiverUP: boolean,
  amount: number,
  web3: Web3,
) => {
  const lsp7Contract = new web3.eth.Contract(
    LSP7Artifact.abi as any,
    contractAddress,
  );
  const tx = await lsp7Contract.methods
    .transfer(from, to, amount, !isReceiverUP, '0x')
    .send({ from });
  return tx;
};

export const transferLSP7AssetFromVault = async (
  contractAddress: string,
  UPaddress: string,
  to: string,
  isReceiverUP: boolean,
  amount: number,
  web3: Web3,
  vaultAddress: string,
) => {
  const transactionValue = 0;

  const lsp7Contract = new web3.eth.Contract(
    LSP7Artifact.abi as any,
    contractAddress,
  );

  const vaultContract = new web3.eth.Contract(
    LSP9Artifact.abi as any,
    vaultAddress,
  );

  const transferBytes = lsp7Contract.methods
    .transfer(vaultAddress, to, amount, !isReceiverUP, '0x')
    .encodeABI();

  return vaultContract.methods
    .execute(
      OperationType.Call,
      contractAddress,
      transactionValue,
      transferBytes,
    )
    .send({ from: UPaddress });
};

export const transferLSP8Asset = async (
  contractAddress: string,
  from: string,
  to: string,
  isReceiverUP: boolean,
  tokenId: string,
  web3: Web3,
) => {
  const lsp8Contract = new web3.eth.Contract(
    LSP8Artifact.abi as any,
    contractAddress,
  );

  const tx = await lsp8Contract.methods
    .transfer(from, to, tokenId, !isReceiverUP, '0x')
    .send({ from });
  return tx;
};

export const transferLSP8AssetFromVault = (
  contractAddress: string,
  UPaddress: string,
  to: string,
  isReceiverUP: boolean,
  tokenId: string,
  web3: Web3,
  vaultAddress: string,
) => {
  const transactionValue = 0;

  const lsp8Contract = new web3.eth.Contract(
    LSP8Artifact.abi as any,
    contractAddress,
  );

  const vaultContract = new web3.eth.Contract(
    LSP9Artifact.abi as any,
    vaultAddress,
  );

  const transferBytes = lsp8Contract.methods
    .transfer(vaultAddress, to, tokenId, !isReceiverUP, '0x')
    .encodeABI();

  return vaultContract.methods
    .execute(
      OperationType.Call,
      contractAddress,
      transactionValue,
      transferBytes,
    )
    .send({ from: UPaddress });
};
