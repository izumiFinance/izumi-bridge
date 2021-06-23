from web3 import Web3
from web3.middleware import geth_poa_middleware
import solcx
import os

# Mainnet web3 provider
# w3 = Web3(Web3.HTTPProvider('https://bsc-dataseed1.binance.org:443'))

# Testnet web3 provider
w3 = Web3(Web3.HTTPProvider('https://data-seed-prebsc-1-s1.binance.org:8545/'))

PRIVATE_KEY = ''
with open('secret.txt', 'r') as fs:
    PRIVATE_KEY = fs.readline()


# account = w3.eth.account.create()
# account recovered from PRIVATE_KEY
account = w3.eth.account.privateKeyToAccount(PRIVATE_KEY)
print(account.address)

# for POA chain, middleware is needed
w3.middleware_onion.inject(geth_poa_middleware, layer=0)

# https://github.com/ethereum/py-solc
# compile Bridge
def compile(contract_folder_name):
    path = '../contracts/' + contract_folder_name
    filenames = os.listdir(path) 
    solcfiles = []
    for i, name in enumerate(filenames):
        if name.__contains__('.sol'):
            solcfiles.append(path + '/' + name)

    return solcx.compile_files(solcfiles, solc_version="0.8.0", import_remappings=["@openzeppeling=$(pwd)/@openzeppelin"])

solcx.install_solc('0.8.0')
compiled = compile('Bridge')
Bridge_abi = compiled['../contracts/Bridge/Bridge.sol:Bridge']['abi']
Bridge_bytecode = compiled['../contracts/Bridge/Bridge.sol:Bridge']['bin']

BridgeContract = w3.eth.contract(abi=Bridge_abi, bytecode=Bridge_bytecode)

estimated_gas = BridgeContract.constructor().estimateGas()
transaction = {
    'gasPrice': w3.eth.gas_price,
    'chainId': 97
}
contract_data = BridgeContract.constructor().buildTransaction(transaction)
tx_hash = w3.eth.send_transaction(contract_data)


print(tx_hash)


# tx_hash = BridgeContract.constructor().transact()
print("TX_HASH: ", tx_hash)
tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
print("TX_RECEIPT: ", tx_receipt)

# if w3.isConnected():
#     print(w3.eth.get_block('latest'))
# else:
#     print("Connection failed!")