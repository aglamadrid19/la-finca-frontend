// Core dependencies
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

// Core CSS
import './App.css';

// Contracts ABI
import wmatic_abi from './contracts/WMATIC.json';

// Core Components
import StakeMatic from './components/StakeMatic';
import WithdrawMatic from './components/WithdrawMatic';

function App() {

    // Static Addresses
    const WMATICContract = "0x5E19FEc10978e1a7E136Cb0e323A68592ECDc141"

    // APP STATE
    // Account and Amount
    const [defaultAccount, setDefaultAccount] = useState("");
    const [accountMaticBalance, setAccountMaticBalance] = useState("")
	const [accountWMATICBalance, setAccountWMATICBalance] = useState("")
    // const [stakeMaticAmount, setStakeMaticAmount] = useState("")
    // const [withdrawMaticAmount, setWithdrawMaticAmount] = useState("")

    // // Provider and Signer
    const [providerInjected, setProviderInjected] = useState(null)
    const [signerInjected, setSignerInjected] = useState(null)

    
    // const [loadingWithdrawButton, setLoadingWithdrawButton] = useState(false)

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

            // Load provider and signer
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()

            // Load WMATIC from provider
            const wmaticContract = new ethers.Contract(WMATICContract, wmatic_abi, provider);

            // Store in state provider and signer
            setProviderInjected(provider)
            setSignerInjected(signer)

            // Fetch Wallet MATIC Balance
            const balanceBN = await provider.getBalance(await signer.getAddress())
            const balance = ethers.utils.formatEther(balanceBN)

            // Fetch Wallet WMATIC balance
            const balanceWMATICBN = await wmaticContract.balanceOf(signer.getAddress())
            const balanceWMATIC = ethers.utils.formatEther(balanceWMATICBN)
            
            setAccountMaticBalance(balance)
            setAccountWMATICBalance(balanceWMATIC)
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

            // GET ACCOUNT Balance
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()

            // Load WMATIC from provider
            const wmaticContract = new ethers.Contract(WMATICContract, wmatic_abi, provider);

            // Store in state provider and signer
            setProviderInjected(provider)
            setSignerInjected(signer)

            // Fetch Wallet MATIC Balance
            const balanceBN = await provider.getBalance(await signer.getAddress())
            const balance = ethers.utils.formatEther(balanceBN)

            // Fetch Wallet WMATIC balance
            const balanceWMATICBN = await wmaticContract.balanceOf(signer.getAddress())
            const balanceWMATIC = ethers.utils.formatEther(balanceWMATICBN)
            
            setAccountMaticBalance(balance)
            setAccountWMATICBalance(balanceWMATIC)
        } catch (err) {
            console.log(err)
        }
    }

    // TOKEN TRANSACTION
    // Function to stake MATIC
    // const stakeMaticAction = async () => {
    //     setLoadingStakeButton(true)
    //     console.log(stakeMaticAmount)
    //     try {
    //         const tx = await signerInjected.sendTransaction({
    //             to: WMATICContract,
    //             value: ethers.utils.parseEther(stakeMaticAmount.toString()),
    //         });
    //         const receipt = await tx.wait()
    //         setLoadingStakeButton(false)
    //         checkWalletIsConnected()
    //     }
    //     catch {
    //         console.log("tx not sent")
    //         // const price = window.ethersProvider.getGasPrice()
    //         // console.log(price)
    //         setLoadingStakeButton(false)
    //     }
    // }

    // Function to Withdraw MATIC
    // const withdrawMaticAction = async () => {
    //     setLoadingWithdrawButton(true)

    //     try {
    //         const wmaticContract = new ethers.Contract(WMATICContract, wmatic_abi, signerInjected);
            
    //         const tx = await wmaticContract.withdraw(ethers.utils.parseUnits(withdrawMaticAmount.toString()));
    //         const receipt = await tx.wait()
    //         console.log(receipt)
    //         setLoadingWithdrawButton(false)
    //         checkWalletIsConnected()
    //     }
    //     catch {
    //         console.log("tx not sent")
    //         // const price = window.ethersProvider.getGasPrice()
    //         // console.log(price)
    //         setLoadingWithdrawButton(false)
    //     }
    // }

    // UI COMPONENTS
    // Connect Wallet Button
    const ConnectWalletButton = () => {
        return (
            <button onClick={connectWalletHandler} className="cta-button connect-wallet-button">
                Connect Wallet
            </button>
        )
    }

    

    // // Withdraw MATIC input
    // const InputWithdrawMatic = () => {
    //     return(
    //         <input
    //             type="number"
    //             className="token-input-amount"
    //             placeholder="Enter MATIC to withdraw"
    //             onChange={(e) => setWithdrawMaticAmount(e.target.value.toString())}
    //             value={withdrawMaticAmount}
    //         />
    //     )
    // }

    // Stake MATIC Button
    // const StakeMaticButton = () => {
    //     return (
    //         <button onClick={stakeMaticAction} className="cta-button stake-matic-button">
    //             {!loadingStakeButton ? "Stake MATIC" : "Waiting"}
    //         </button>
    //     )
    // }

    // Withdraw MATIC Button
    // const WithdrawMaticButton = () => {
    //     return (
    //         <button onClick={withdrawMaticAction} className="cta-button stake-matic-button">
    //             {!loadingWithdrawButton ? "Withdraw MATIC" : "Waiting"}
    //         </button>
    //     )
    // }

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
                {defaultAccount ?  
                <>
                <div>
                    <h5 className="remove-margin-bottom">Wallet Connected</h5>
                    <p className="remove-margin">{defaultAccount}</p>
                </div>

                <div>
                    <h5 className="remove-margin-bottom">Wallet MATIC Balance</h5>
                    <p className="remove-margin">{accountMaticBalance}</p>
                </div>

                <div>
                    <h5 className="remove-margin-bottom">Wallet WMATIC Balance</h5>
                    <p className="remove-margin">{accountWMATICBalance}</p>
                </div>
                </>

                :
            
                <h5>No Wallet Connected</h5>}
            </div>

            <div className='stake-box main-app'>
                {defaultAccount ? <StakeMatic signerInjected={signerInjected}></StakeMatic> : <ConnectWalletButton></ConnectWalletButton>}
                {defaultAccount ? <WithdrawMatic signerInjected={signerInjected}></WithdrawMatic> : null}
            </div>
        </div>
        
    );
}

export default App;