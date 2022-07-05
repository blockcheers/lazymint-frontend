import { useState } from 'react'
import { ethers } from 'ethers'
import LazyMint from '../../artifacts/contracts/LazyNFT.sol/LazyNFT.json'

const lazyMintContractAddress = '0xDE90993c8469172943CAbC4957d9a34eb25566B6'

const VerifyMessage = ({ tokenid, tokenuri, address, signature }) => {
  const [walletAddress, setWalletAddress] = useState()
  const [formData, setFormData] = useState({})

  const token = parseInt(tokenid)
  const data = {
    tokenId: token,
    uri: tokenuri,
    signature
  }

  const connectWallet = async () => {
    // Check if MetaMask is installed on user's browser
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })
      // const chainId = await window.ethereum.request({ method: 'eth_chainId' })

      // Check if user is connected to Mainnet
      if (true) {
        let wallet = accounts[0]
        setWalletAddress(wallet)
      }
    } else {
      alert('Please install Mask')
    }
  }

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleVerification = async (e) => {
    e.preventDefault()
    console.log('DATA: ', data)

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(
      lazyMintContractAddress,
      LazyMint.abi,
      signer
    )

    console.log('Signature: ', signature)
    console.log('Signer: ', address)

    let result = await contract.mint(
      address,
      walletAddress,
      data
    )
    result = await result.wait()
    console.log(result)

    contract.on('isCheckAddresses', (signer, signerVerify) => {
      console.log('isCheckAddresses', signer, signerVerify)
    })

    contract.on('handleMint', (status) => {
      console.log('Mint Status', status)
    })
  }

  return (
    <>
      <button className='btn btn-light text-dark' onClick={connectWallet}>
        Connect {walletAddress}
      </button>
      <form className='m-4' onSubmit={handleVerification}>
        <div className='credit-card w-full mx-auto rounded-xl bg-white'>
          <main className='mt-4 p-4'>
            {/* <Link to='/'>Sign Transaction</Link> */}

            <h1 className='text-xl font-semibold text-gray-700 text-center'>
              Mint NFT
            </h1>
            <div className='my-3'>
              <input
                required
                type='text'
                name='tokenid'
                className='textarea w-full h-24 textarea-bordered focus:ring focus:outline-none'
                placeholder='Token Id'
                value={tokenid}
                onChange={(e) => {
                  onChange(e)
                }}
              />
            </div>
            <div className='my-3'>
              <input
                required
                type='text'
                name='tokenuri'
                className='textarea w-full h-24 textarea-bordered focus:ring focus:outline-none'
                placeholder='Token URI'
                value={tokenuri}
                onChange={(e) => {
                  onChange(e)
                }}
              />
            </div>
            <div className='my-3'>
              <input
                required
                type='text'
                name='signatures'
                className='textarea w-full h-24 textarea-bordered focus:ring focus:outline-none'
                placeholder='Signature'
                value={signature}
                onChange={(e) => {
                  onChange(e)
                }}
              />
            </div>
            <div className='my-3'>
              <input
                required
                type='text'
                name='address'
                className='textarea w-full input input-bordered focus:ring focus:outline-none'
                placeholder='Signer address'
                value={address}
                onChange={(e) => {
                  onChange(e)
                }}
              />
            </div>
          </main>
          <footer className='p-4'>
            <button
              type='submit'
              className='btn btn-primary submit-button focus:ring focus:outline-none w-full'
            >
              Mint
            </button>
          </footer>
        </div>
      </form>
    </>
  )
}

export default VerifyMessage
