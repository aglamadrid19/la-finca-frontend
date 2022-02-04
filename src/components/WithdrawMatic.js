// Core Modules
import { useState } from "react";
import { ethers } from "ethers";

// Contracts ABI
import wmatic_abi from '../contracts/WMATIC.json';

// Static Address
const WMATICAddress = "0x5E19FEc10978e1a7E136Cb0e323A68592ECDc141"

export default function WithdrawMatic(props) {

    // State
    const [withdrawMaticAmount, setWithdrawMaticAmount] = useState('');
    const [loadingWithdrawButton, setLoadingWithdrawButton] = useState(false)

    // Utils for input field
    const handleChange = (e) => {
        setWithdrawMaticAmount(e.target.value);
    };

    // Function to Withdraw MATIC
    const withdrawMaticAction = async () => {
        setLoadingWithdrawButton(true)

        try {
            const wmaticContract = new ethers.Contract(WMATICAddress, wmatic_abi, props.signerInjected);
            
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

  return (
    <div>
        <input
            className="token-input-amount"
            type="number"
            name="matic-stake-amount"
            value={withdrawMaticAmount}
            onChange={handleChange}
        />

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

