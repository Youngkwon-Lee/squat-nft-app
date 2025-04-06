import { Metaplex } from '@metaplex-foundation/js';
import { Connection } from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';

const METADATA_URL = 'https://raw.githubusercontent.com/Youngkwon-Lee/squat-nft-app/main/public/metadata.json';

export const mintNFT = async (connection: Connection, wallet: WalletContextState) => {
  try {
    const metaplex = new Metaplex(connection);
    metaplex.use(wallet.adapter);

    const { nft } = await metaplex.nfts().create({
      uri: METADATA_URL,
      name: 'Squat NFT',
      symbol: 'SQAT',
      sellerFeeBasisPoints: 500, // 5%
    });

    return nft;
  } catch (error) {
    console.error('NFT 민팅 실패:', error);
    throw error;
  }
}; 