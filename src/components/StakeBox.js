import React, {useState, useEffect} from 'react'
import ReactDOM from "react-dom";
import {ethers} from 'ethers'
import wmatic from '../contracts/WMATIC.json'

export default function StakeBox() {

    const userAddress = "0x3984Cb100038b143e28b2145c9F826fcC0580e26"
    const WMATICContract = "0x5E19FEc10978e1a7E136Cb0e323A68592ECDc141"

    const [defaultAccount, setDefaultAccount] = useState("");
    const [accountMaticBalance, setAccountMaticBalance] = useState("")
	const [accountWMATICBalance, setAccountWMATICBalance] = useState("")
    const [stakeMaticAmount, setStakeMaticAmount] = useState(undefined)
    const [withdrawMaticAmount, setWithdrawMaticAmount] = useState(undefined)


    const [providerInjected, setProviderInjected] = useState(null)
    const [signerInjected, setSignerInjected] = useState(null)

    const [loadingStakeButton, setLoadingStakeButton] = useState(false)
    const [loadingWithdrawButton, setLoadingWithdrawButton] = useState(false)


    const checkWalletIsConnected = async () => { 
        const {ethereum} = window;
        
        if (!ethereum) {
            console.log("Make sure you have Metamask installed");
            return;
        } else {
            console.log("Wallet exists! We're ready to go");
        }

        const accounts = await ethereum.request({method: 'eth_accounts'});
        
        // const balance = await provider.getBalance(defaultAccount)
    
        if (accounts.length !== 0) {
            const account = accounts[0];
            console.log("Found an authorized account: ", account);
            
            setDefaultAccount(account)

            // Load provider and signer
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()

            // Load WMATIC from provider
            const wmaticContract = new ethers.Contract(WMATICContract, wmatic, provider);

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
            const wmaticContract = new ethers.Contract(WMATICContract, wmatic, provider);

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

    const stakeMaticAction = async () => {
        setLoadingStakeButton(true)
        console.log(stakeMaticAmount)
        try {
            const tx = await signerInjected.sendTransaction({
                to: WMATICContract,
                value: ethers.utils.parseEther(stakeMaticAmount.toString()),
            });
            const receipt = await tx.wait()
            setLoadingStakeButton(false)
            checkWalletIsConnected()
        }
        catch {
            console.log("tx not sent")
            // const price = window.ethersProvider.getGasPrice()
            // console.log(price)
            setLoadingStakeButton(false)
        }
    }

    const withdrawMaticAction = async () => {
        setLoadingWithdrawButton(true)
        // console.log(withdrawMaticAction)
        try {
            // Load WMATIC from signer
            // console.log(signerInjected)
            const wmaticContract = new ethers.Contract(WMATICContract, wmatic, signerInjected);
            
            const tx = await wmaticContract.withdraw(ethers.utils.parseUnits(withdrawMaticAmount.toString()));
            // const tx = await signerInjected.sendTransaction({
            //     to: WMATICContract,
            //     value: ethers.utils.parseEther(stakeMaticAmount.toString()),
            // });
            const receipt = await tx.wait()
            console.log(receipt)
            setLoadingWithdrawButton(false)
            checkWalletIsConnected()
        }
        catch {
            console.log("tx not sent")
            // const price = window.ethersProvider.getGasPrice()
            // console.log(price)
            setLoadingWithdrawButton(false)
        }
    }

    const ConnectWalletButton = () => {
        return (
            <button onClick={connectWalletHandler} className="cta-button connect-wallet-button">
                Connect Wallet
            </button>
        )
    }

    const InputStakeMatic = () => {

        return(
            <input
                className="token-input-amount"
                placeholder="Enter MATIC to stake"
                onChange={(e) => setStakeMaticAmount(e.target.value)}
                value={stakeMaticAmount}
            >
            </input>
        )
    }

    const InputWithdrawMatic = () => {
        return(
            <input
                className="token-input-amount"
                placeholder="Enter MATIC to withdraw"
                onChange={(e) => setWithdrawMaticAmount(e.target.value.toString())}
                value={withdrawMaticAmount}
            />
        )
    }

    const StakeMaticButton = () => {
        return (
            <button onClick={stakeMaticAction} className="cta-button stake-matic-button">
                {!loadingStakeButton ? "Stake MATIC" : "Waiting"}
            </button>
        )
    }

    const WaitingStakeMaticButton = () => {
        return (
            <button disabled onClick={stakeMaticAction} className="cta-button stake-matic-button-disabled">
                {!loadingStakeButton ? "Stake MATIC" : "Waiting"}
            </button>
        )
    }


    const WithdrawMaticButton = () => {

        return (
            <button onClick={withdrawMaticAction} className="cta-button stake-matic-button">
                {!loadingWithdrawButton ? "Withdraw MATIC" : "Waiting"}
            </button>
        )
    }

    const WaitingWithdrawMaticButton = () => {
        return (
            <button disabled onClick={stakeMaticAction} className="cta-button stake-matic-button-disabled">
                {!loadingWithdrawButton ? "Withdraw MATIC" : "Waiting"}
            </button>
        )
    }

    const IsStakingOrWaitingOnTransaction = () => {
        const loadingStakeAction = loadingStakeButton;
        if (loadingStakeAction) {
            return <WaitingStakeMaticButton/>
        } else {
            return <StakeMaticButton/>
        }
    }

    const IsWithdrawingOrWaitingOnTransaction = () => {
        const loadingWithdrawAction = loadingWithdrawButton;
        if (loadingWithdrawAction) {
            return <WaitingWithdrawMaticButton/>
        } else {
            return <WithdrawMaticButton/>
        }
    }

    useEffect(() => {
        
        checkWalletIsConnected()
        
    }, [])

    return (
        <>
        <div className="stake-box main-app">

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

            {defaultAccount ? <InputStakeMatic/> : null}

            {/* {signerInjected ? <IsStakingOrWaitingOnTransaction/> : <ConnectWalletButton/>}

            {defaultAccount ? <InputWithdrawMatic/> : null} 

            {signerInjected ? <IsWithdrawingOrWaitingOnTransaction/> : null} */}
            
            {/* <p>Total MATIC Staked: 20</p> */}
        </div>
        </>
    )
}