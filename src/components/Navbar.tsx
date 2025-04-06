import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-card mx-4 my-4 px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold gradient-text">
          스쿼트 NFT
        </div>
        <WalletMultiButton className="!bg-primary hover:!bg-primary-dark !text-dark" />
      </div>
    </nav>
  );
};

export default Navbar; 