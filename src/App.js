import { useEffect, useState } from 'react';
import StakeBox from './components/StakeBox'
import './App.css';
import contract from './contracts/WMATIC.json';

function App() {
    return (
        <div className="App">
            <div className="main-app">
                <h1>La Finca</h1>
                <h3>A Polygon Staking and Yield Farming open project for Web3 developers</h3>
            </div>
            
            <StakeBox/>
        </div>
    );
}

export default App;