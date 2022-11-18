//Check the rate for WETH to DAI
//Swap WETH for DAI
//Check by console.logging DAI balance
const { ethers, getNamedAccounts, network } = require("hardhat");
const { BigNumber } = require("@ethersproject/bignumber");
const { providers, Wallet } = require("ethers");

//WETH address  0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
//DAI address   0x6B175474E89094C44Da98b954EedeAC495271d0F
async function main() {
  const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL;

  const provider = new providers.JsonRpcProvider({
    url: POLYGON_RPC_URL,
  });
  const gasFeeInfo = await provider.getFeeData();
  const gasPrice = gasFeeInfo.gasPrice.toString();
  const valueStore = await ethers.getContract("ValueStore");
  const { deployer } = await getNamedAccounts();
  //await valueStore.addNum("10");
  console.log(valueStore.address);
  let params = ["1"];
  const action = "addNum";
  const unsignedTx1 = await valueStore.populateTransaction[action](...params, {
    gasPrice: BigNumber.from(parseInt(gasPrice) * 2),
    gasLimit: BigNumber.from(1000000),
  });
  const PRIVATE_KEY = process.env.PRIVATE_KEY;
  const searcherWallet = new Wallet(PRIVATE_KEY, provider); // Create wallet to sign with

  await searcherWallet.sendTransaction(unsignedTx1);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
