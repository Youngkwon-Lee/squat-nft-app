import { useState } from 'react';
import SquatDetector from '../components/SquatDetector';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { mintNFT } from '../utils/nft';
import { getLDID } from '../utils/ldid';

const Tracker = () => {
  const [count, setCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const { connection } = useConnection();
  const { wallet, publicKey } = useWallet();
  const ldid = getLDID();

  const handleSquatComplete = () => {
    const newCount = count + 1;
    setCount(newCount);
    
    if (newCount >= 30) {
      setIsCompleted(true);
    }
  };

  const handleMintNFT = async () => {
    if (!wallet || !publicKey) {
      alert('지갑을 연결해주세요.');
      return;
    }

    try {
      setIsMinting(true);
      const nft = await mintNFT(connection, wallet);
      console.log('NFT 민팅 성공:', nft);
      alert('NFT 민팅이 완료되었습니다!');
    } catch (error) {
      console.error('민팅 실패:', error);
      alert('NFT 민팅에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">스쿼트 트래커</h1>
      <div className="glass-card p-8">
        <SquatDetector onSquatComplete={handleSquatComplete} />
        <div className="mt-8 text-center">
          <p className="text-2xl mb-4">
            현재 스쿼트 횟수: <span className="text-primary">{count}</span> / 30
          </p>
          {isCompleted && (
            <button
              onClick={handleMintNFT}
              disabled={isMinting}
              className="btn-primary"
            >
              {isMinting ? '민팅 중...' : 'NFT 받기'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tracker; 