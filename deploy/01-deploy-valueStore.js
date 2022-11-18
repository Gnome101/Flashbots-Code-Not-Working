const { network } = require("hardhat");
module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  log("------------------------------------------------------------");

  let args = [];
  const valueStore = await deploy("ValueStore", {
    from: deployer,
    args: args,
    log: true,
    blockConfirmations: 2,
  });
  console.log(valueStore.address);

  log("------------------------------------------------------------");
};
module.exports.tags = ["all", "store"];
