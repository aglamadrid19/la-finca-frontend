// Core dependencies
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

// Core Components
import StakeAndWithdrawMatic from './components/StakeAndWithdrawMatic';

// Core CSS
import './App.css';

// Contracts ABI
import wmatic_abi from './contracts/WMATIC.json';

function App() {

    // Static Addresses
    const WMATICContract = "0x5E19FEc10978e1a7E136Cb0e323A68592ECDc141"

    // APP STATE
    // Account and Amount
    const [defaultAccount, setDefaultAccount] = useState("");

    // WALLET CONNECTION
    // Function to check for already connected wallet
    const checkWalletIsConnected = async () => { 
        const {ethereum} = window;
        
        if (!ethereum) {
            console.log("Make sure you have Metamask installed");
            return;
        } else {
            console.log("Wallet exists! We're ready to go");
        }

        const accounts = await ethereum.request({method: 'eth_accounts'});
    
        if (accounts.length !== 0) {
            const account = accounts[0];
            console.log("Found an authorized account: ", account);
            
            setDefaultAccount(account)
        }
    }

    // Function to connect wallet (metamask)
    const connectWalletHandler = async () => { 
        const {ethereum} = window;
    
        if (!ethereum) {
            alert("Please install Metamask");
        }
    
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            setDefaultAccount(accounts[0]);

        } catch (err) {
            console.log(err)
        }
    }

    // UI COMPONENTS
    // Connect Wallet Button
    const ConnectWalletButton = () => {
        return (
            <button onClick={connectWalletHandler} className="cta-button connect-wallet-button">
                Connect Wallet
            </button>
        )
    }

    const WalletConnectedInfo = () => {
        return (
            <div>
                <h5 className="remove-margin-bottom">Wallet Connected</h5>
                <p className="remove-margin">{defaultAccount}</p>
            </div>
        )
    }

    useEffect(() => {
        checkWalletIsConnected()
    }, [])

    return (
        <div className="App">
            <div className="main-app">
                <h1>La Finca</h1>
                <h3>A Polygon Staking and Yield Farming open project for Web3 Developers</h3>
            </div>

            <div className='stake-box main-app'>
                {defaultAccount ? <WalletConnectedInfo></WalletConnectedInfo> : null}
            </div>

            <div className='stake-box main-app'>
                {defaultAccount ? <StakeAndWithdrawMatic></StakeAndWithdrawMatic> : <ConnectWalletButton></ConnectWalletButton>}
            </div>
        </div>
        
    );
}

export default App;