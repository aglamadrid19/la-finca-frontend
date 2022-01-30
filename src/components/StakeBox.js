import React, {useState, useEffect} from 'react'
import {ethers} from 'ethers'

const StakeBox = () => {
	
    const [defaultAccount, setDefaultAccount] = useState("");
    const [accountMaticBalance, setAccountMaticBalance] = useState("")
	const [stakeMaticAmount, setStakeMaticAmount] = useState("")
    const [providerWeb3, setProviderWeb3] = useState(null)
    const [signerWeb3, setSignerWeb3] = useState(null)

    const checkWalletIsConnected = async () => { 
        const {ethereum} = window;
        
        if (!ethereum) {
            console.log("Make sure you have Metamask installed");
            return;
        } else {
            console.log("Wallet exists! We're ready to go");
        }
    
        const accounts = await ethereum.request({method: 'eth_accounts'});
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        console.log(provider)
        
        // const balance = await provider.getBalance(defaultAccount)
    
        if (accounts.length !== 0) {
            const account = accounts[0];
            console.log("Found an authorized account: ", account);
            setProviderWeb3(provider)
            // setSignerWeb3(signer)
            setDefaultAccount(account);
            console.log(providerWeb3)
            // console.log(signerWeb3)
            // setAccountMaticBalance(balance);
        } else {
            alert("No authorized wallet found, please connect it");
        }

        // Get Wallet Balance
    }

    const connectWalletHandler = async () => { 
        const {ethereum} = window;
    
        if (!ethereum) {
            alert("Please install Metamask");
        }
    
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()

            setDefaultAccount(accounts[0]);
            setProviderWeb3(provider)
            setSignerWeb3(signer)

            console.log("Found an account! Address: ", accounts[0]);
        } catch (err) {
            console.log(err)
        }
    }


    const stakeMaticAction = () => {
        console.log("miau")
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
                Stake MATIC
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
                    <p className="remove-margin">{defaultAccount}</p>
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