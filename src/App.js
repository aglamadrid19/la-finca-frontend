import { useEffect, useState } from 'react';
import './App.css';
import contract from './contracts/WMATIC.json';

const contractAddress = "0x384c3246F5888baa90F9835cd62dED5dD562a146";
const abi = contract.abi;

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [amountMatic, setAmountMatic] = useState("");

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
          setCurrentAccount(account);
      } else {
          console.log("No authorized wallet found");
      }
  }

  const connectWalletHandler = async () => { 
    const {ethereum} = window;

    if (!ethereum) {
        alert("Please install Metamask");
    }

    try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        console.log("Found an account! Address: ", accounts[0]);
        setCurrentAccount(accounts[0]);
    } catch (err) {
        console.log(err)
    }
  }

  const mintNftHandler = () => { }
  const stakeMaticAction = () => {
      console.log(amountMatic);
      console.log(typeof(amountMatic))
  }

  const connectWalletButton = () => {
    return (
      <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
        Connect Wallet
      </button>
    )
  }

  const stakeMaticButton = () => {
    return (
        <button onClick={stakeMaticAction} className="cta-button stake-matic-button">
            Stake MATIC
        </button>
    )
  }

  const disabledStakedMaticButton = () => {
    return (
        <button disabled className="cta-button disabled-stake-matic-button">
            Stake MATIC
        </button>
    )
  }

  const renderMaticStakeInputField = () => {
      if (Number(amountMatic) <= 0) {
          return disabledStakedMaticButton()
      }
      else {
          return stakeMaticButton()
      }
  } 

  const stakeBox = () => {
    return (
      <>
        <div className="stake-box">
            <div>
                <input
                    className="token-input-amount"
                    type="number"
                    placeholder="Enter MATIC to stake"
                    onChange={(e) => setAmountMatic(e.target.value)}
                    value={amountMatic}
                />
            </div>
            
            {renderMaticStakeInputField()}

            <p>User MATIC Staked: 10</p>
            <p>Total MATIC Staked: 20</p>
        </div>
        {/* <button onClick={mintNftHandler} className='cta-button mint-nft-button'>
            Ready to continue later!
        </button> */}
      </>
    )
  }

  useEffect(() => {
    checkWalletIsConnected();
  }, [])

  return (
    <div className='main-app'>
      <h1>La Finca</h1>
      <h3>A Polygon Staking and Yield Farming open project for Students</h3>
      <div>
        {currentAccount ? stakeBox() : connectWalletButton()}
      </div>
    </div>
  )
}

export default App;