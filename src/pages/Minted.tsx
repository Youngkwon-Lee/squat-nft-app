import { Link } from 'react-router-dom';

const Minted = () => {
  return (
    <div className="min-h-screen gradient-bg flex flex-col items-center justify-center p-4">
      <div className="glass-card p-8 w-full max-w-md text-center">
        <h1 className="text-5xl font-bold mb-6 gradient-text">
          축하합니다! 🎉
        </h1>
        
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-xl blur-xl opacity-30"></div>
            <img
              src="/placeholder-nft.png"
              alt="NFT"
              className="w-64 h-64 rounded-xl relative z-10"
            />
          </div>
        </div>
        
        <p className="text-xl text-gray-300 mb-4">
          오늘의 스쿼트를 모두 완료하셨습니다!
        </p>
        <p className="text-lg gradient-text font-bold mb-8">
          NFT가 성공적으로 민팅되었습니다
        </p>
        
        <Link
          to="/"
          className="btn-primary inline-block"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
};

export default Minted; 