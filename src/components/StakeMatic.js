// Core Modules
import { useState } from "react";
import { ethers } from "ethers";

// Static Address
const WMATICAddress = "0x5E19FEc10978e1a7E136Cb0e323A68592ECDc141"

export default function StakeMatic(props) {

    // State
    const [stakeMaticAmount, setStakeMaticAmount] = useState('');
    const [loadingStakeButton, setLoadingStakeButton] = useState(false)

    // Utils for input field
    const handleChange = (e) => {
        setStakeMaticAmount(e.target.value);
    };

    // Function to stake MATIC
    const stakeMaticAction = async () => {
        setLoadingStakeButton(true)
        try {
            const tx = await props.signerInjected.sendTransaction({
                to: WMATICAddress,
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

  return (
    <div>
        <input
            className="token-input-amount"
            type="number"
            name="matic-stake-amount"
            value={stakeMaticAmount}
            onChange={handleChange}
        />

        {
            !loadingStakeButton ?
            <button onClick={stakeMaticAction} className="cta-button stake-matic-button">
                Stake MATIC
            </button> :
            <button disabled className="cta-button stake-matic-button-disabled">
                Waiting
            </button>
        }

    </div>
      
  );
};

