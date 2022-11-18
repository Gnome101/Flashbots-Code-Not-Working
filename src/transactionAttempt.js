const { Contract, providers, Wallet, BigNumber } = require("ethers");
const {
  ETHER,
  bigNumberToDecimal,
  getDefaultRelaySigningKey,
} = require("./utils");
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const {
  FlashbotsBundleProvider,
} = require("@flashbots/ethers-provider-bundle");
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;
const provider = new providers.JsonRpcProvider({
  url: GOERLI_RPC_URL,
});
// Standard json rpc provider directly from ethers.js. For example you can use Infura, Alchemy, or your own node.
const authSigner = new Wallet(getDefaultRelaySigningKey(), provider); // `authSigner` is an Ethereum private key that does NOT store funds and is NOT your bot's primary key.// This is an identifying key for signing payloads to establish reputation and whitelisting

const searcherWallet = new Wallet(PRIVATE_KEY, provider); // Create wallet to sign with
// Value Store address: 0x963C7950B97e2ce301Eb49Fb1928aA5C7fe8e8eC
//Bytecode of function call: 0x752783620000000000000000000000000000000000000000000000000000000000000001
async function main() {
  const gasFeeInfo = await provider.getFeeData();
  const gasPrice = gasFeeInfo.gasPrice.toString();
  console.log(
    "Searcher Wallet Address: " + (await searcherWallet.getAddress())
  );
  console.log(
    "Flashbots Relay Signing Wallet Address: " + (await authSigner.getAddress())
  );

  const flashbotsProvider = await FlashbotsBundleProvider.create(
    provider,
    authSigner,
    "https://relay-goerli.flashbots.net",
    "goerli"
  );

  //0x963C7950B97e2ce301Eb49Fb1928aA5C7fe8e8eC - address of valuestore contract on

  //console.log(gasFeeInfo);c
  console.log("Gas Fee Info", gasPrice);
  //console.log(valueStore.address);
  const transaction1 = {
    chainId: 5,
    type: 2,
    maxFeePerGas: parseInt(gasFeeInfo.maxFeePerGas),
    maxPriorityFeePerGas: parseInt(gasFeeInfo.maxPriorityFeePerGas),
    to: "0x291c245Fd1E5EcADA53166165838AD19Da79A881",
    value: 100000000000000,
  };
  const transaction2 = {
    chainId: 5,
    type: 2,
    maxFeePerGas: parseInt(gasFeeInfo.maxFeePerGas),
    maxPriorityFeePerGas: parseInt(gasFeeInfo.maxPriorityFeePerGas),
    to: "0x291c245Fd1E5EcADA53166165838AD19Da79A881",
    value: 50000000000000,
  };
  console.log("Transaction", transaction1);
  const bundledTransactions = [
    {
      signer: searcherWallet,
      transaction: transaction1,
    },
    {
      signer: searcherWallet,
      transaction: transaction2,
    },
  ];

  const signedTransactions = await flashbotsProvider.signBundle(
    bundledTransactions
  );

  const blockNumber = await provider.getBlockNumber();
  console.log(new Date());
  const simulation = await flashbotsProvider.simulate(
    signedTransactions,
    blockNumber + 1
  );
  console.log(new Date());
  console.log(simulation);
  console.log("Signed Transacitons", signedTransactions);
  const bundleSubmitResponse = await flashbotsProvider.sendRawBundle(
    signedTransactions,
    blockNumber + 1
  );

  // By exiting this function (via return) when the type is detected as a "RelayResponseError", TypeScript recognizes bundleSubmitResponse must be a success type object (FlashbotsTransactionResponse) after the if block.
  if ("error" in bundleSubmitResponse) {
    console.warn(bundleSubmitResponse.error.message);
    return;
  }
  console.log(bundleSubmitResponse);

  console.log("submitted for block # ", blockNumber + 1);
}
main();
