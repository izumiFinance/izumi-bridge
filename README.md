# Izumi-contracts

This is the repo for Izumi Contracts.

## Setting up the ENV

1. At root level, run `npm install`

2. If you are using vscode and have never installed `openzepplin` package before, then:
    1. press `shift+command+p` to enter command prompt. 
    2. type `Open Settings` and choose the `JSON` version
    3. insert the openzepplin setting: 
        ```json
        "solidity.packageDefaultDependenciesContractsDirectory": "",
        "solidity.packageDefaultDependenciesDirectory": "node_modules",
        ```

3. Setup your private key in `src/secret.js` file:
    ```
    export const PRIVATEKEY = "0x1234567890ABCDEFGH...";
    ```

## Deploy Contracts
