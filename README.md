# NFT Contract

1. [Screenshots](#screenshots)
2. [Constants](#constants)
3. [Variables](#variables)
4. [Deploying](#deploying)

This contract is an ERC721 Non-Fungible Token (NFT) contract. It allows users to mint NFTs, and to transfer and sell them to other users.

## Screenshots

| <img src="screenshots\1.png" width="500"> |
| :---------------------------------------: |
|         **Figure 1.** _Compiling_         |

| <img src="screenshots\2.png" width="500"> |
| :---------------------------------------: |
|       **Figure 2.** _Running Tests_       |

| <img src="screenshots\3.png" width="500"> |
| :---------------------------------------: |
|    **Figure 3.** _Deploying Contract_     |

| <img src="screenshots\4.png" width="500"> |
| :---------------------------------------: |
|    **Figure 4.** \_Verifying Contract     |


## Constants

- `MAX_TOKENS`: The maximum number of NFTs that can be minted.
- `TOKENS_RESERVED`: The number of NFTs that are reserved for the contract owner.
  price: The price of an NFT in ETH.
- `MAX_MINT_PER_TX`: The maximum number of NFTs that can be minted in a single transaction.
- `MAX_MINT_PER_WALLET`: The maximum number of NFTs that can be minted by a single wallet.

## Variables

- `saleEndDate`: A number that indicates the end date of the sale in UNIX time.
- `totalSupply`: The total number of NFTs that have been minted.
- `mintedPerWallet`: A mapping that tracks the number of NFTs that have been minted by each wallet.
- `baseUri`: The base URI for the NFTs.
- `baseExtension`: The extension for the NFT metadata files.

## Functions

- `mint(uint256 \_numTokens)`: Mints \_numTokens NFTs to the caller.
- `setEndDate()`: Toggles the end date of the contract if you want to extend.
- `setBaseUri(string memory \_baseUri)`: Sets the base URI for the NFTs.
- `setPrice(uint256 \_price)`: Sets the price of an NFT.
- `withdrawAll()`: Withdraws all of the funds from the contract to the owner.
- `tokenURI(uint256 tokenId)`: Returns the URI for the NFT with the specified ID.

## Deploying

1. Set up .env variables:

```
ETHERSCAN_API_KEY=abc
SEPOLIA_PRIVATE_KEY=abc
ALCHEMY_API_KEY=abc
```

2. (Optional) Set up any variables in the contract itself (e.g. price, base URI, etc.).
3. `yarn compile` will compile the smart contract.
4. `yarn test` will run all the test cases to ensure the contract is working as expected.
5. `yarn deploy-stg` will deploy the contract to the sepolia network.
6. `yarn verify-stg` will verify the contract on the sepolia network (you will have to edit the contract address in package.json to reflect the newly deployed contract).
7. Verify on etherscan, e.g. https://sepolia.etherscan.io/address/0x31444Ec97a79692b04d46949f73440AA954f2073#code
8. Once live, configure things like the base URI (with an ipfs) and price if you don't want a free mint.
9. Set the contract address in shared/constants/contract.constants.ts & update the ABI if the contract is changed.

An example of the ipfs is: ipfs://QmPUBhCe53ZkuqZweYtPnaBpiCz9AsusuopbDWN5dKoDcZ/
I created this ipfs data for my personal NFT creation, Ghost Cat NFT.