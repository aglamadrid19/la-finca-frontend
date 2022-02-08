// Core Modules
import { useState, useEffect } from "react";
import { ethers } from "ethers";

// Import ABI
import laFinca_abi from '../contracts/LaFinca.json'

// Static Address
const LaFincaAddress = "0x5B1cA8860F7D72EBD2E08DABeD39045129764Fd9"

export default function StakeAndWithdrawMatic() {

    // State
    const [stakeMaticAmount, setStakeMaticAmount] = useState('');
    const [withdrawMaticAmount, setWithdrawMaticAmount] = useState('');
    const [loadingStakeButton, setLoadingStakeButton] = useState(false)
    const [loadingWithdrawButton, setLoadingWithdrawButton] = useState(false)
    const [loadingRefreshAll, setLoadingRefreshAll] = useState(false)
    const [loadingClaimButton, setLoadingClaimButton] = useState(false)
    const [accountMaticBalance, setAccountMaticBalance] = useState("")
    const [accountWMATICBalance, setAccountWMATICBalance] = useState("")
    const [pendingMango, setPendingMango] = useState("0")

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
        setLoadingRefreshAll(true)
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

            // Fetch Pending Mango and WMATIC Balance
            const LaFincaContract = new ethers.Contract(LaFincaAddress, laFinca_abi, signer)

            const pendingMango = await LaFincaContract.pendingReward(accounts[0])
            setPendingMango(ethers.utils.formatEther(pendingMango))

            const balanceWMATICBN = await LaFincaContract.userInfo(accounts[0])
            setAccountWMATICBalance(ethers.utils.formatEther(balanceWMATICBN.amount))
        }

        setLoadingRefreshAll(false)
    }

    // Function to stake MATIC
    const stakeMaticAction = async () => {
        setLoadingStakeButton(true)
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()

            const LaFincaContract = new ethers.Contract(LaFincaAddress, laFinca_abi, signer)

            const tx = await LaFincaContract.connect(signer).deposit({
                value: ethers.utils.parseEther(stakeMaticAmount.toString())
            })

            const receipt = await tx.wait()
            console.log(receipt)
            setLoadingStakeButton(false)
        }
        catch {
            console.log("tx not sent")
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

            const LaFincaContract = new ethers.Contract(LaFincaAddress, laFinca_abi, signer)

            const tx = await LaFincaContract.connect(signer).withdraw(ethers.utils.parseEther(withdrawMaticAmount.toString()))
            
            const receipt = await tx.wait()
            console.log(receipt)
            setLoadingWithdrawButton(false)
        }
        catch {
            console.log("tx not sent")
            // const price = window.ethersProvider.getGasPrice()
            // console.log(price)
            setLoadingWithdrawButton(false)
        }
    }

    // Function to claim MANGO
    const claimMangoAction = async () => {
        setLoadingClaimButton(true)
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()

            const LaFincaContract = new ethers.Contract(LaFincaAddress, laFinca_abi, signer)

            const tx = await LaFincaContract.connect(signer).deposit()

            const receipt = await tx.wait()
            console.log(receipt)
            setLoadingClaimButton(false)
        }
        catch {
            console.log("tx not sent")
            setLoadingClaimButton(false)
        }
    }

    useEffect(() => {
        refreshBalances()
    })

  return (
    <div>
        <div>
            
            <h5 className="remove-margin-bottom">Pending Mango</h5>
            <p className="remove-margin-top">{pendingMango}</p>
            {
            !loadingClaimButton ?
            <button onClick={claimMangoAction} className="cta-button stake-matic-button">
                Claim
            </button> :
            <button disabled className="cta-button stake-matic-button-disabled">
                Waiting
            </button>
            }
        </div>
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
            <h5 className="remove-margin-bottom">Wallet MATIC Staked</h5>
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

