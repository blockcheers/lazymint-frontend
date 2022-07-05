const hre = require('hardhat')

async function main() {
  const [deployer] = await ethers.getSigners()

  console.log("Deployer's Account: ", deployer.address)

  const Token = await hre.ethers.getContractFactory('LazyNFT')
  const token = await Token.deploy('0xc204526A3b5EFa75E488e2D7aB34E1416a5667c8')

  console.log('Token address:', token.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

// npx hardhat run scripts/deploy.js --network rinkeby

// npx hardhat verify --network rinkeby 0xDE90993c8469172943CAbC4957d9a34eb25566B6 0xc204526A3b5EFa75E488e2D7aB34E1416a5667c8

// https://rinkeby.etherscan.io/address/0xDE90993c8469172943CAbC4957d9a34eb25566B6#code
