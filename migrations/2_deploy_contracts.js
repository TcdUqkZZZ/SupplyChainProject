var ClientRole  = artifacts.require('../contracts/accesscontrol/ClientRole.sol');
var MinerRole  = artifacts.require('../contracts/accesscontrol/MinerRole.sol');
var GraderRole  = artifacts.require('../contracts/accesscontrol/GraderRole.sol');
var LapidaryRole  = artifacts.require('../contracts/accesscontrol/LapidaryRole.sol');
var MerchantRole  = artifacts.require('../contracts/accesscontrol/MerchantRole.sol');
var SupplyChain  = artifacts.require('../contracts/base/SupplyChain.sol');

module.exports = function(deployer) {
    deployer.deploy(ClientRole);
    deployer.deploy(MinerRole);
    deployer.deploy(GraderRole);
    deployer.deploy(LapidaryRole);
    deployer.deploy(MerchantRole);
    deployer.deploy(SupplyChain);
}