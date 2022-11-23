import React, {useState} from 'react';
import {ethers} from "ethers";
import abi from '../utils/abi.json';
import {contractAddress} from "../utils/ethereum";

function Eth() {
    const [errorMessage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [connButtonText, setConnButtonText] = useState('Connect Wallet');

    const [currentContractVal, setCurrentContractVal] = useState(null);

    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);

    const connectWalletHandler = async () => {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
            accountChangedHandler(accounts[0]);
            setConnButtonText('Wallet connected')
        } else {
            setErrorMessage('Need to install Metamask!')
        }
    }

    const accountChangedHandler = (account) => {
        setDefaultAccount(account)
        updateEthers()
    }

    const updateEthers = () => {
        let tempProvider = new ethers.providers.Web3Provider(window.ethereum)
        setProvider(tempProvider)

        let tempSigner = tempProvider.getSigner();
        setSigner(tempSigner)

        let tempContract = new ethers.Contract(contractAddress, abi, tempSigner)
        setContract(tempContract)
    }

    const setHandler = async (event) => {
        event.preventDefault()
        await contract.set(event.target.setText.value)
    }

    const getCurrentVal = async () => {
        let val = await contract.get()
        setCurrentContractVal(val)
    }

    return (
        <div>
            <h3>Get / Set interaction with contract</h3>
            <button onClick={connectWalletHandler}>{connButtonText}</button>
            <h3>Address : {defaultAccount}</h3>

            <form onSubmit={setHandler}>
                <input id='setText' type='text'/>
                <button type='submit'>Update Contract</button>
            </form>

            <button onClick={getCurrentVal}>Get Current Value</button>
            <h4>Current contract val: {currentContractVal}</h4>
            {errorMessage}
        </div>
    );
}

export default Eth;