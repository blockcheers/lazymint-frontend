import { useState } from 'react'
import { ethers } from 'ethers'
import ErrorMessage from '../ErrorMessage'
import VerifyMessage from '../VerifyTransaction'

const lazyMintContractAddress = '0xDE90993c8469172943CAbC4957d9a34eb25566B6'

export default function SignMessage() {
  const [signatures, setSignatures] = useState([])
  const [error, setError] = useState()
  const [formData, setFormData] = useState({})
  const { tokenId, uri } = formData

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSign = async (e) => {
    e.preventDefault()
    const tokenNumber = parseInt(tokenId)
    const data = {
      tokenId: tokenNumber,
      uri,

    }
    const types = {
      // EIP712Domain: [
      //   { type: 'string', name: 'name' },
      //   { type: 'string', name: 'version' },
      //   { type: 'address', name: 'verifyingContract' },
      //   { type: 'uint256', name: 'chainId' },
      // ],
      NFTVoucher: [
        {name: "tokenId", type: "uint256"},
        {name: "uri", type: "string"},  
      ]
    }

    const formatVoucher = async () => {
      const domain = await signingDomain()
      return {
        domain,
        types,
        primaryType: 'NFTVoucher',
        message: data,
      }
    }

    const signingDomain = async () => {
      const domain = {
        name: 'LazyNFT-Voucher',
        version: '1',
        verifyingContract: lazyMintContractAddress,
        chainId: 4,
      }
      return domain
    }

    setError()
    const typedData = await formatVoucher(data)
    await window.ethereum.send('eth_requestAccounts')
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const address = await signer.getAddress()

    const signature = await signer.provider.send('eth_signTypedData_v4', [
      address,
      JSON.stringify(typedData),
    ])

    const sig = {
      tokenId: tokenNumber,
      uri,
      address,
      signature,
    }

    const sig0 = signature.substring(2)
    const r = '0x' + sig0.substring(0, 64)
    const s = '0x' + sig0.substring(64, 128)
    const v = parseInt(sig0.substring(128, 130), 16)

    console.log('signature: ', signature)
    console.log('Account: ', address)
    console.log('R: ', r)
    console.log('S: ', s)
    console.log('V: ', v)

    if (signature) {
      setSignatures([...signatures, sig])
    }
  }

  return (
    <>
      <form className='m-4' onSubmit={handleSign}>
        <div className='credit-card w-full mx-auto rounded-xl bg-white'>
          <main className='mt-4 p-4'>
            <h1 className='text-xl font-semibold text-gray-700 text-center'>
              Sign Message
            </h1>
            <div className='my-3'>
              <input
                required
                type='text'
                name='tokenId'
                className='textarea w-full h-24 textarea-bordered focus:ring focus:outline-none'
                placeholder='Token Id'
                onChange={(e) => {
                  onChange(e)
                }}
              />
            </div>
            <div className='my-3'>
              <input
                required
                type='text'
                name='uri'
                className='textarea w-full h-24 textarea-bordered focus:ring focus:outline-none'
                placeholder='Token URI'
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
              Sign message
            </button>
            <ErrorMessage message={error} />
          </footer>
        </div>
      </form>
      {signatures.map((sig, idx) => {
        return (
          <VerifyMessage
            tokenid={sig.tokenId}
            tokenuri={sig.uri}
            address={sig.address}
            signature={sig.signature}
          />
        )
      })}
    </>
  )
}
