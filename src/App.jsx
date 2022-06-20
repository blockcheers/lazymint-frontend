import React, { useState } from 'react'
import { ethers } from 'ethers'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignMessage from './components/SignTransaction'
import VerifyMessage from './components/VerifyTransaction'

function App() {
  // wallet connection
  const [connButtonText, setConnButtonText] = useState('Connect Wallet')
  const [errorMessage, setErrorMessage] = useState(null)
  const [defaultAccount, setDefaultAccount] = useState(null)
  // const [connButtonText, setConnButtonText] = useState('Connect Wallet')

  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)

  const connectWalletHandler = () => {
    let results
    if (window.ethereum) {
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((result) => {
          accountChangeHandler(result[0])
          setConnButtonText('connected')
          results = result[0]
        })
    } else {
      setErrorMessage('INSTALL METAMASK!!!')
    }
  }

  const accountChangeHandler = async (newAccount) => {
    setDefaultAccount(newAccount)
    updateEthers()
  }

  const updateEthers = () => {
    // ethers provider from metamask and it's read only
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(tempProvider)

    let tempSigner = tempProvider.getSigner()
    setSigner(tempSigner)
  }

  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route
            path='/'
            element={
              <SignMessage
                connButtonText={connButtonText}
                defaultAccount={defaultAccount}
                connectWalletHandler={connectWalletHandler}
              />
            }
          />
          <Route path='/verify' element={<VerifyMessage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
