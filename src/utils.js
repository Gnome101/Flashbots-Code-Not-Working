const { BigNumber, Wallet } = require("ethers");

const ETHER = BigNumber.from(10).pow(18);

const bigNumberToDecimal = function (BigNumber, base) {
  const divisor = BigNumber.from(10).pow(base);
  return value.mul(10000).div(divisor).toNumber() / 10000;
};

const getDefaultRelaySigningKey = function () {
  console.warn(
    "You have not specified an explicity FLASHBOTS_RELAY_SIGNING_KEY environment variable. Creating random signing key, this searcher will not be building a reputation for next run"
  );
  return Wallet.createRandom().privateKey;
};

module.exports = { ETHER, bigNumberToDecimal, getDefaultRelaySigningKey };
