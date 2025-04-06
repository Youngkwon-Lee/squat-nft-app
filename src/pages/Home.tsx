import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen gradient-bg flex flex-col items-center justify-center p-4">
      <div className="glass-card p-12 max-w-2xl text-center">
        <h1 className="text-6xl font-bold mb-6 gradient-text">
          스쿼트 NFT
        </h1>
        <p className="text-xl mb-8 text-gray-300">
          매일 30개의 스쿼트를 완료하고<br />
          <span className="gradient-text font-bold">특별한 NFT</span>를 받으세요!
        </p>
        <div className="space-y-4">
          <Link to="/tracker" className="btn-primary inline-block">
            시작하기
          </Link>
          <p className="text-sm text-gray-400">
            Web3 피트니스의 새로운 시작
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home; 