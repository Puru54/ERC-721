var TGNFT = artifacts.require("TurfGuardian");
module.exports = async (deployer, network, addresses) => {
    let proxyRegistryAddress = "";
    if (network === "rinkeby") {
        proxyRegistryAddress = "0x1E525EEAF261cA41b809884CBDE9DD9E1619573A";
    } else {
        proxyRegistryAddress = "0x8838ada415d5F00D3a1dBe72425798Bff2950401";
    }
    await deployer.deploy(TGNFT, proxyRegistryAddress);
};
