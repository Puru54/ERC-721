const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config();
const { MNEMONIC, PROJECT_ID } = process.env;

module.exports = {
  networks: {
    development: {
      host: "host.docker.internal", // Localhost (default: none)
      port: 7545, // Use the default Ethereum RPC port (8545) or specify your custom port
      network_id: "*", // Match any network ID (default is "*")
    },
    // sepolia: {
    //   provider: () => {
    //     const provider = new HDWalletProvider(
    //       MNEMONIC,
    //       `https://sepolia.infura.io/v3/${PROJECT_ID}`
    //     );
    //     // console.log("Provider initialized:", provider);
    //     return provider;
    //   },
    //   network_id: 11155111,
    //   confirmations: 2,
    //   timeoutBlocks: 200,
    //   networkCheckTimeout: 10000, // Set the timeout in milliseconds
    //   skipDryRun: true,
    // },
  },

  // Set default mocha options here, use special reporters, etc.
  mocha: {
    // timeout: 100000
  },

  compilers: {
    solc: {
      version: "^0.8.17", // Fetch exact version from solc-bin (default: truffle's version)
      docker: false, // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
        evmVersion: "istanbul",
      },
    },
  },

};
