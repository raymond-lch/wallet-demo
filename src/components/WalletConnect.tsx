import { useState, useEffect } from 'react';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const WalletConnect = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    checkIfWalletIsConnected();
    
   
  }, []);


  const checkIfWalletIsConnected = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setIsConnected(true);
          setAccount(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setIsConnected(true);
        setAccount(accounts[0]);
      } catch (error) {
        console.error('Error connecting to wallet:', error);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const disconnectWallet = async () => {
    if (window.ethereum) {
      try {
        // Revoke permissions
        await window.ethereum.request({
          method: 'wallet_revokePermissions',
          params: [{ eth_accounts: {} }],
        });
        
        // Clear local state
        setIsConnected(false);
        setAccount(null);
        setShowMenu(false);
      } catch (error) {
        console.error('Error disconnecting wallet:', error);
        // Fallback to just clearing local state if revoke fails
        setIsConnected(false);
        setAccount(null);
        setShowMenu(false);
      }
    } else {
      // If no ethereum provider, just clear local state
      setIsConnected(false);
      setAccount(null);
      setShowMenu(false);
    }
  };

  const popupMetamask = async () => {
    if (window.ethereum) {
      try {
        // Request permissions with additional parameters to force popup
        await window.ethereum.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }]
        });
        
        // Get the current accounts after permissions are granted
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setIsConnected(true);
          setAccount(accounts[0]);
        }
      } catch (error) {
        console.error('Error opening MetaMask:', error);
      }
    } else {
      alert('Please install MetaMask!');
    }
    setShowMenu(false);
  };

  const handleMetamask = () => {
    if (isConnected) {
      popupMetamask();
    } else {
      connectWallet();
    }
  };
  

  return (
    <div style={{ textAlign: 'center', margin: '20px' }}>
      <div>
        {isConnected ? (
          <p>Connected: {account?.slice(0, 6)}...{account?.slice(-4)}</p>
        ) : (
          <p>Not connected</p>
        )}
        <div 
          style={{ position: 'relative', display: 'inline-block' }}
          onMouseEnter={() => isConnected && setShowMenu(true)}
        >
          <button 
            onClick={() => handleMetamask()} 
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Let's start
          </button>
          {showMenu && isConnected && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '4px',
              padding: '10px',
              marginTop: '5px',
              minWidth: '150px'
            }}>
              <button 
                onMouseLeave={() => setShowMenu(false)}
                onClick={disconnectWallet} 
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '8px',
                  marginBottom: '5px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Disconnect wallet
              </button>              
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletConnect; 