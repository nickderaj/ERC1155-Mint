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

## Variables

- `tokenTypes`: An array of the token types that are currently available.
- `mintedTokens`: An array of the token IDs that have been minted.
- `tokenPrices`: A mapping of the prices for each token type.
- `canMint`: A mapping of whether or not a token type can be minted.
- `baseUri`: The base URI for the NFTs.

## Functions

### addTokenType

```
function addTokenType(uint256 initialSupply, uint256 price, bool mintPermission) public onlyOwner
```

This function allows the contract owner to add a new token type to the contract. It requires the contract owner's address to call the function. The function takes three parameters:

- initialSupply: The initial supply of tokens to be minted for the new token type.
- price: The price of each token in ETH for the new token type.
- mintPermission: A boolean value indicating whether minting is allowed for this token type.

The function performs the following actions:

- Generates a new typeId for the token type.
- Adds the typeId to the tokenTypes array.
- Sets the initial supply of tokens for the new token type in the mintedTokens array.
- Sets the token price for the new token type in the tokenPrices mapping.
- Sets the minting permission for the new token type in the canMint mapping.
- Mints the initial supply of tokens and assigns them to the contract owner.

### mint

```
function mint(address toAddress, uint256 typeId, uint256 amount) public payable
```

This function allows users to mint new tokens of a specific token type. It requires the caller to provide payment in ETH according to the token's price, and the minting permission for the specified token type must be allowed. The function takes three parameters:

- toAddress: The address where the minted tokens will be assigned.
- typeId: The ID of the token type to be minted.
- amount: The number of tokens to mint.

The function performs the following validations and actions:

- Checks if the specified typeId corresponds to an existing token type.
- Verifies that minting is allowed for the specified token type.
- Ensures that the caller provides enough funds to cover the minting cost.
- Mints the specified number of tokens and assigns them to the toAddress.
- Updates the mintedTokens array to reflect the new total supply of tokens for the token type.

### setBaseUri

```
function setBaseUri(string memory newBaseUri) public onlyOwner
```

This function allows the contract owner to update the base URI for the token metadata. The function takes one parameter:

- newBaseUri: The new base URI for the token metadata.

The function simply updates the baseUri variable with the provided newBaseUri.

### setPrice

```
function setPrice(uint256 typeId, uint256 newPrice) public onlyOwner
```

This function allows the contract owner to update the price of a specific token type. The function takes two parameters:

- typeId: The ID of the token type for which the price will be updated.
- newPrice: The new price for the specified token type.

The function performs the following actions:

- Checks if the specified typeId corresponds to an existing token type.
- Updates the tokenPrices mapping with the new price for the token type.

### toggleMintPermission

```
function toggleMintPermission(uint256 typeId) public onlyOwner
```

This function allows the contract owner to toggle the minting permission for a specific token type. When minting permission is toggled, it either allows or disallows minting for the specified token type. The function takes one parameter:

- typeId: The ID of the token type for which the minting permission will be toggled.

The function performs the following actions:

- Checks if the specified typeId corresponds to an existing token type.
- Toggles the minting permission for the specified token type in the canMint mapping.

### getTokenTypes

```
function getTokenTypes() external view returns (uint256[] memory)
```

This function allows external parties to query the available token types in the contract. It returns an array containing the IDs of all existing token types.

### getMintedTokens

```
function getMintedTokens() external view returns (uint256[] memory)
```

This function allows external parties to query the total supply of tokens for each token type in the contract. It returns an array containing the total supply of tokens for each existing token type.

### withdrawAll

```
function withdrawAll() public onlyOwner
```

This function allows the contract owner to withdraw all the funds available in the contract. The function transfers the entire contract balance to the owner's address. It requires the contract owner's address to call the function.

### uri

```
function uri(uint256 \_typeId) override public view returns (string memory)
```

This function is an overridden function from the ERC1155 interface, and it returns the URI for the metadata of a specific token type. It takes one parameter:

- typeId: The ID of the token type for which the URI will be generated.

The function returns the concatenated string of the baseUri, the string representation of the typeId, and the baseExtension. This results in the final URI for the metadata of the specified token type.

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
