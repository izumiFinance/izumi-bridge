const Migrations = artifacts.require("Bridge");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
};
