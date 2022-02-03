import { useState } from "react";

export default function WithdrawMatic() {
  const [stakeMaticAmount, setStakeMaticAmount] = useState('');

  const handleChange = (e) => {
    setStakeMaticAmount(e.target.value);
  };

  const stakeMaticAction = () => {
      console.log("Matic Staked")
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
        <button onClick={stakeMaticAction} className="cta-button stake-matic-button">
            Withdraw MATIC
        </button>
    </div>
      
  );
};

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