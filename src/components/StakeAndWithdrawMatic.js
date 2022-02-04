// Core Modules
import { useState, useEffect } from "react";
import { ethers } from "ethers";

// Import ABI
import wmatic_abi from '../contracts/WMATIC.json'

// Static Address
const WMATICAddress = "0x5E19FEc10978e1a7E136Cb0e323A68592ECDc141"

export default function StakeAndWithdrawMatic() {

    // State
    const [stakeMaticAmount, setStakeMaticAmount] = useState('');
    const [withdrawMaticAmount, setWithdrawMaticAmount] = useState('');
    const [loadingStakeButton, setLoadingStakeButton] = useState(false)
    const [loadingWithdrawButton, setLoadingWithdrawButton] = useState(false)
    const [accountMaticBalance, setAccountMaticBalance] = useState("")
    const [accountWMATICBalance, setAccountWMATICBalance] = useState("")

    // Utils for input field
    const handleChangeInput = (e) => {
        setStakeMaticAmount(e.target.value);
    };

    // Utils for withdraw field
    const handleChangeWithdraw = (e) => {
        setWithdrawMaticAmount(e.target.value);
    };

    // Utils input fields
    const preventMinus = (e) => {
        if (e.code === 'Minus') {
            e.preventDefault();
        }
    };

    const disableScrollInput = (e) => {
        e.target.blur()
    }

    // Refresh balance utils
    const refreshBalances = async () => { 
        const accounts = await ethereum.request({method: 'eth_accounts'});
    
        if (accounts.length !== 0) {
            const account = accounts[0];
            // Load provider and signer
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()

            // Fetch Wallet MATIC Balance
            const balanceBN = await provider.getBalance(await signer.getAddress())
            const balance = ethers.utils.formatEther(balanceBN)
            setAccountMaticBalance(balance)

            // Load WMATIC from provider
            const wmaticContract = new ethers.Contract(WMATICAddress, wmatic_abi, provider);

            // Fetch Wallet WMATIC balance
            const balanceWMATICBN = await wmaticContract.balanceOf(signer.getAddress())
            const balanceWMATIC = ethers.utils.formatEther(balanceWMATICBN)
            
            setAccountWMATICBalance(balanceWMATIC)
        }
    }

    // Function to stake MATIC
    const stakeMaticAction = async () => {
        setLoadingStakeButton(true)
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()

            const tx = await signer.sendTransaction({
                to: WMATICAddress,
                value: ethers.utils.parseEther(stakeMaticAmount.toString()),
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

    // Function to Withdraw MATIC
    const withdrawMaticAction = async () => {
        setLoadingWithdrawButton(true)

        try {
            // Load provider and signer
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            
            const wmaticContract = new ethers.Contract(WMATICAddress, wmatic_abi, signer);
            
            const tx = await wmaticContract.withdraw(ethers.utils.parseUnits(withdrawMaticAmount.toString()));
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

    useEffect(() => {
        refreshBalances()
    })

  return (
    <div>
        <div>
            <h5 className="remove-margin-bottom">Wallet MATIC Balance</h5>
            <p className="remove-margin">{accountMaticBalance}</p>
        </div>
        <input
            onWheel={disableScrollInput}
            onKeyPress={preventMinus}
            className="token-input-amount"
            type="number"
            value={stakeMaticAmount}
            onChange={handleChangeInput}
        ></input>

        {
            !loadingStakeButton ?
            <button onClick={stakeMaticAction} className="cta-button stake-matic-button">
                Stake MATIC
            </button> :
            <button disabled className="cta-button stake-matic-button-disabled">
                Waiting
            </button>
        }
        <div>
            <h5 className="remove-margin-bottom">Wallet WMATIC Balance</h5>
            <p className="remove-margin">{accountWMATICBalance}</p>
        </div>
        <input
            onWheel={disableScrollInput}
            onKeyPress={preventMinus}
            className="token-input-amount"
            type="number"
            value={withdrawMaticAmount}
            onChange={handleChangeWithdraw}
        ></input>

        {
            !loadingWithdrawButton ?
            <button onClick={withdrawMaticAction} className="cta-button stake-matic-button">
                Withdraw MATIC
            </button> :
            <button disabled className="cta-button stake-matic-button-disabled">
                Waiting
            </button>
        }
    </div>
      
  );
};

