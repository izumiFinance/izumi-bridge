from web3 import Web3
# from solc import compile_standard

# Mainnet web3 provider
# w3 = Web3(Web3.HTTPProvider('https://bsc-dataseed1.binance.org:443'))

# Testnet web3 provider
w3 = Web3(Web3.HTTPProvider('https://data-seed-prebsc-1-s1.binance.org:8545'))

PRIVATE_KEY = ''
with open('secret.txt', 'r') as fs:
    PRIVATE_KEY = fs.readline()

# account recovered from PRIVATE_KEY
account = w3.eth.account.privateKeyToAccount(PRIVATE_KEY)

# if w3.isConnected():
#     print(w3.eth.get_block('latest'))
# else:
#     print("Connection failed!")