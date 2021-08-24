/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * trufflesuite.com/docs/advanced/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like @truffle/hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura accounts
 * are available for free at: infura.io/register.
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */
// const fs = require('fs');

// const infuraKey = "fj4jll3k.....";
//
// const fs = require('fs');
// const mnemonic = fs.readFileSync(".secret").toString().trim();

const secret = require('./.secret.js')
const pk = secret.pk
const apikeyBscscan = secret.apikey_bscscan
const apikeyBscTestscan = secret.apikey_bscscan
const apikeyMaticTestscan = secret.apikey_polygonscan
const apikeyMaticscan = secret.apikey_polygonscan
const apikeyFtmscan = secret.apikey_ftmscan
const apikeyHecoscan = secret.apikey_hecoscan

const HDWalletProvider = require('@truffle/hdwallet-provider');

const bscTestRpcUrl = 'https://data-seed-prebsc-1-s1.binance.org:8545/'
const bscRpcUrl = 'https://bsc-dataseed.binance.org'
const maticTestRpcUrl = 'https://rpc-mumbai.maticvigil.com'
const maticRpcUrl = 'https://rpc-mainnet.maticvigil.com'
const fantomRpcUrl = 'https://rpcapi.fantom.network'
const harmonyRpcUrl = 'https://api.harmony.one'
const hecoRpcUrl = 'https://http-mainnet-node.huobichain.com'
const optimismRpcUrl = 'https://mainnet.optimism.io'
const optimismTestRpcUrl = 'https://kovan.optimism.io'

module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

  networks: {
    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // You should run a client (like ganache-cli, geth or parity) in a separate terminal
    // tab if you use this network and you must also set the `host`, `port` and `network_id`
    // options below to some value.
    //
    // development: {
    //  host: "127.0.0.1",     // Localhost (default: none)
    //  port: 8545,            // Standard Ethereum port (default: none)
    //  network_id: "*",       // Any network (default: none)
    // },
    // Another network with more advanced options...
    // advanced: {
    // port: 8777,             // Custom port
    // network_id: 1342,       // Custom network
    // gas: 8500000,           // Gas sent with each transaction (default: ~6700000)
    // gasPrice: 20000000000,  // 20 gwei (in wei) (default: 100 gwei)
    // from: <address>,        // Account to send txs from (default: accounts[0])
    // websocket: true        // Enable EventEmitter interface for web3 (default: false)
    // },
    // Useful for deploying to a public network.
    // NB: It's important to wrap the provider as a function.
    // ropsten: {
    // provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/YOUR-PROJECT-ID`),
    // network_id: 3,       // Ropsten's id
    // gas: 5500000,        // Ropsten has a lower block limit than mainnet
    // confirmations: 2,    // # of confs to wait between deployments. (default: 0)
    // timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
    // skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    // },
    // Useful for private networks
    // private: {
    // provider: () => new HDWalletProvider(mnemonic, `https://network.io`),
    // network_id: 2111,   // This network is yours, in the cloud.
    // production: true    // Treats this network as if it was a public net. (default: false)
    // }

    OP: {
        network_id: 10,
        gasPrice: 15000000, /// need white list
        gas: 500000000,
        provider: () => new HDWalletProvider(pk, optimismRpcUrl),
    },
    OPTestnet: {
        network_id: 69,
        gasPrice: 15000000,
        gas: 12000000000,
        provider: () => new HDWalletProvider(pk, optimismTestRpcUrl),
    },
    BSCTestnet: {
        network_id: 97,
        gasPrice: 20000000000,
        gas: 5500000,
        provider: () => new HDWalletProvider(pk, bscTestRpcUrl),
    },
    BSC: {
        network_id: 56,
        gasPrice: 5000000000,
        gas: 5500000,
        provider: () => new HDWalletProvider(pk, bscRpcUrl),
    },
    MaticTestnet: {
        network_id: 80001,
        gasPrice: 20000000000,
        gas: 5000000,
        provider: () => new HDWalletProvider(pk, maticTestRpcUrl),
    },
    Matic: {
        network_id: 137,
        gasPrice: 5000000000,
        gas: 5500000,
        provider: () => new HDWalletProvider(pk, maticRpcUrl),
    },
    Fantom: {
        network_id: 250,
        gasPrice: 100000000000,
        gas: 5500000,
        provider: () => new HDWalletProvider(pk, fantomRpcUrl),
    },
    Harmony: {
        network_id: 1666600000,
        gasPrice: 5000000000,
        gas: 5500000,
        provider: () => new HDWalletProvider(pk, harmonyRpcUrl),
    },
    Heco: {
        network_id: 128,
        gasPrice: 2500000000,
        gas: 5500000,
        provider: () => new HDWalletProvider(pk, hecoRpcUrl),
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
       version: "0.8.0",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  },

  // Truffle DB is currently disabled by default; to enable it, change enabled: false to enabled: true
  //
  // Note: if you migrated your contracts prior to enabling this field in your Truffle project and want
  // those previously migrated contracts available in the .db directory, you will need to run the following:
  // $ truffle migrate --reset --compile-all

  db: {
    enabled: false
  },
  plugins: [
    'truffle-plugin-verify'
  ],
  api_keys: {
      bscscan: apikeyBscscan,
      polygonscan: apikeyMaticscan,
      ftmscan: apikeyFtmscan,
      hecoinfo: apikeyHecoscan,
  },
  contracts_directory: '/home/yong/Prod/Izumi-contracts/contracts'
};
