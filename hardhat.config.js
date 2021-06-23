// hardhat.config.js

/**
 * @type import('hardhat/config').HardhatUserConfig
 * Check out here for detail configuration https://hardhat.org/config/#solidity-configuration
 */
module.exports = {
    solidity: {
        version: "0.8.0",
        settings: {
            "optimizer": {
                "enabled": true,
                "runs": 200
            },
            "outputSelection": {
                "*": {
                    "*": [
                        "evm.bytecode",
                        "evm.deployedBytecode",
                        "abi"
                    ]
                }
            },
            "libraries": {}
        }
    },
    paths: {
        sources: "./contracts",
        cache: "./build/cache",
        artifacts: "./build/artifacts"
    },
    mocha: {
        timeout: 20000
    }

};