// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Mint is ERC1155, Ownable {
    string public baseUri;
    uint256[] public tokenTypes;
    uint256[] public mintedTokens;
    mapping(uint256 => uint256) public tokenPrices; // Mapping to store token prices
    mapping(uint256 => bool) public canMint; // Mapping to control minting permission for each token type

    constructor(string memory _baseUri) ERC1155(_baseUri) {
        baseUri = _baseUri;
        addTokenType(10**18, 0, true); // id: 1, with 10^18 tokens minted
        addTokenType(10**27, 0, true); // id: 2, with 10^27 tokens minted
        addTokenType(1, 0, true);      // id: 3, with 1 token minted
    }

    function addTokenType(uint256 initialSupply, uint256 price, bool mintPermission) public onlyOwner {
        uint256 typeId = tokenTypes.length;
        tokenTypes.push(typeId);
        mintedTokens.push(initialSupply);
        tokenPrices[typeId] = price; // Set the token price
        canMint[typeId] = mintPermission; // Set the minting permission
        _mint(msg.sender, typeId, initialSupply, "");
    }

    function mint(address toAddress, uint256 typeId, uint256 amount) public payable {
        require(typeId > 0 && typeId <= tokenTypes.length, "Token type doesn't exist.");
        require(canMint[typeId], "Minting not allowed for this token type.");
        require(msg.value >= tokenPrices[typeId], "Insufficient funds.");
        _mint(toAddress, typeId, amount, "");
        mintedTokens[typeId - 1] += amount;
    }

    function setBaseUri(string memory newBaseUri) public onlyOwner {
        baseUri = newBaseUri;
    }

    function setPrice(uint256 typeId, uint256 newPrice) public onlyOwner {
        require(typeId > 0 && typeId <= tokenTypes.length, "Token type doesn't exist.");
        tokenPrices[typeId] = newPrice;
    }

    function toggleMintPermission(uint256 typeId) public onlyOwner {
        require(typeId > 0 && typeId <= tokenTypes.length, "Token type doesn't exist.");
        canMint[typeId] = !canMint[typeId]; // Toggle the minting permission
    }

    function getTokenTypes() external view returns (uint256[] memory) {
        return tokenTypes;
    }

    function getMintedTokens() external view returns (uint256[] memory) {
        return mintedTokens;
    }

    function withdrawAll() public onlyOwner {
        uint256 contractBalance = address(this).balance;
        require(contractBalance > 0, "No funds available for withdrawal.");
        payable(owner()).transfer(contractBalance);
    }

    function uri(uint256 _typeId) override public view returns (string memory) {
        return string(
            abi.encodePacked(
                baseUri, // Use the updated base URI
                Strings.toString(_typeId),
                ".json"
            )
        );
    }
}