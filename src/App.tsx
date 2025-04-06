import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletContextProvider } from './context/WalletContextProvider';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Tracker from './pages/Tracker';
import Minted from './pages/Minted';
import { useEffect } from 'react';
import { getOrCreateLDID } from './utils/ldid';
import './App.css';

function App() {
  useEffect(() => {
    // 앱 시작 시 LDID 초기화
    const ldid = getOrCreateLDID();
    console.log('User LDID:', ldid);
  }, []);

  return (
    <WalletContextProvider>
      <Router>
        <div className="min-h-screen bg-dark">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tracker" element={<Tracker />} />
            <Route path="/minted" element={<Minted />} />
          </Routes>
        </div>
      </Router>
    </WalletContextProvider>
  );
}

export default App;
