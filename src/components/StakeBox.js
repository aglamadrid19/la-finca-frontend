import React, {useState, useEffect} from 'react'
import {ethers} from 'ethers'
import wmatic from '../contracts/WMATIC.json'

const StakeBox = () => {

    const userAddress = "0x3984Cb100038b143e28b2145c9F826fcC0580e26"
    const WMATICContract = "0x5E19FEc10978e1a7E136Cb0e323A68592ECDc141"
    const WMATIC_ABI = wmatic.abi

    const [defaultAccount, setDefaultAccount] = useState("");
    const [accountMaticBalance, setAccountMaticBalance] = useState("")
	const [stakeMaticAmount, setStakeMaticAmount] = useState("")
    const [providerInjected, setProviderInjected] = useState(null)
    const [signerInjected, setSignerInjected] = useState(null)

    const [loadingStakeButton, setLoadingStakeButton] = useState(false)

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

            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()

            setProviderInjected(provider)
            setSignerInjected(signer)

            const balanceBN = await provider.getBalance(await signer.getAddress())
            const balance =  ethers.utils.formatEther(balanceBN)
            
            setAccountMaticBalance(balance)
        } else {
            alert("No authorized wallet found, please connect it");
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

            setProviderInjected(provider)
            setSignerInjected(signer)

            const balanceBN = await provider.getBalance(await signer.getAddress())
            const balance =  ethers.utils.formatEther(balanceBN)
            
            setAccountMaticBalance(balance)

            console.log("Found an account! Address: ", accounts[0]);
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
                gasLimit: 80000,
            });
            const receipt = await tx.wait()
            setLoadingStakeButton(false)
            
        }
        catch {
            console.log("tx not sent")
            // const price = window.ethersProvider.getGasPrice()
            // console.log(price)
            setLoadingStakeButton(false)
        }
    }

    const ConnectWalletButton = () => {
        return (
            <button onClick={connectWalletHandler} className="cta-button connect-wallet-button">
                Connect Wallet
            </button>
        )
    }

    const StakeMaticButton = () => {
        return (
            <button onClick={stakeMaticAction} className="cta-button stake-matic-button">
                {!loadingStakeButton ? "Stake MATIC" : "Waiting"}
            </button>
        )
    }

    useEffect(() => {
        
        checkWalletIsConnected()
        
    }, [])

    return (
        <>
        <div className="stake-box main-app">
            <div>
                {
                    defaultAccount 
                        ?
                    <input
                        className="token-input-amount"
                        type="number"
                        placeholder="Enter MATIC to stake"
                        onChange={(e) => setStakeMaticAmount(e.target.value)}
                        value={stakeMaticAmount}
                    />
                        :
                    <input
                        disabled
                        className="token-input-amount"
                        type="number"
                        placeholder="Enter MATIC to stake"
                        onChange={(e) => setStakeMaticAmount(e.target.value)}
                        value={stakeMaticAmount}
                    />   
                }
                
            </div>

            {defaultAccount ? StakeMaticButton() : ConnectWalletButton()}
            
            {defaultAccount 
                ? 
            <>
                <div>
                    <h5 className="remove-margin-bottom">Wallet Connected</h5>
                    <p className="remove-margin">{defaultAccount}</p>
                </div>
                <div>
                    <h5 className="remove-margin-bottom">Wallet MATIC Balance</h5>
                    <p className="remove-margin">{accountMaticBalance}</p>
                </div>
            </>
                :
            <h5>No Wallet Connted</h5>
            }
            <p>User MATIC Staked: 10</p>
            <p>Total MATIC Staked: 20</p>
        </div>
        </>
    )
}

export default StakeBox;