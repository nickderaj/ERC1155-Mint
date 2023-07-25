import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers, network } from "hardhat";
import { sampleUri } from "../util/constants";

describe("Mint", function () {
  // Fixture:
  async function deployContract(withBalance: boolean = false) {
    const [owner] = await ethers.getSigners();

    const Mint = await ethers.getContractFactory("Mint");
    const mint = await Mint.deploy(sampleUri);

    if (withBalance) {
      await network.provider.send("hardhat_setBalance", [
        await mint.getAddress(),
        "0x1000",
      ]);
    }

    return { mint, owner };
  }

  async function deployContractWithBalance() {
    return deployContract(true);
  }

  describe("Deployment", function () {
    it("Should create a contract with 3 NFTs", async function () {
      const { mint } = await loadFixture(deployContract);
      const arr = await mint.getTokenTypes();

      expect(arr).to.eql([0n, 1n, 2n]);
    });

    it("Should have minted the right number of each NFT", async function () {
      const { mint } = await loadFixture(deployContract);
      const arr = await mint.getMintedTokens();

      expect(arr).to.eql([
        1000000000000000000n,
        1000000000000000000000000000n,
        1n,
      ]);
    });

    it("Should have a set base uri function", async function () {
      const { mint } = await loadFixture(deployContract);
      expect(await mint.baseUri()).to.equal(sampleUri);

      await mint.setBaseUri("https://example.com/");
      expect(await mint.baseUri()).to.equal("https://example.com/");
    });

    it("Can't set price if token doesn't exist", async function () {
      const { mint } = await loadFixture(deployContract);

      expect(mint.setPrice(4343, 999999999999)).to.be.revertedWith(
        "Token type doesn't exist."
      );
    });
  });

  describe("Minting", function () {
    it("Should be able to mint if user can afford it", async function () {
      const { mint, owner } = await loadFixture(deployContract);

      const balance = await mint.balanceOf(owner, 1);
      expect(await mint.mint(owner, 1, 10)).to.not.be.reverted;
      expect(await mint.balanceOf(owner, 1)).to.equal(balance + 10n);
    });

    it("Should not be able to mint if user can't afford it", async function () {
      const { mint, owner } = await loadFixture(deployContract);

      const balance = await mint.balanceOf(owner, 1);
      await mint.setPrice(1, 999999999999);

      expect(mint.mint(owner, 1, 10)).to.be.revertedWith("Insufficient funds.");
      expect(await mint.balanceOf(owner, 1)).to.equal(balance + 0n);
    });

    it("Should not be able to mint if token type doesn't exist", async function () {
      const { mint, owner } = await loadFixture(deployContract);

      expect(mint.mint(owner, 4, 10)).to.be.revertedWith(
        "Token type doesn't exist."
      );
    });

    it("Should be able to mint to other account", async function () {
      const { mint } = await loadFixture(deployContract);

      const dummyAccount = "0xc374859630b54bAB650c7D1e9955A130bb71dAad";
      const balance = await mint.balanceOf(dummyAccount, 1);

      await mint.mint(dummyAccount, 1, 10);
      expect(await mint.balanceOf(dummyAccount, 1)).to.equal(balance + 10n);
    });

    it("Can disable the sales of a specific token", async function () {
      const { mint, owner } = await loadFixture(deployContract);

      await mint.toggleMintPermission(1);

      expect(mint.mint(owner, 1, 10)).to.be.revertedWith(
        "Minting not allowed for this token type."
      );
    });

    it("Should be able to add new token types", async function () {
      const { mint, owner } = await loadFixture(deployContract);

      await mint.addTokenType(1000000n, 0, true);
      expect(await mint.getTokenTypes()).to.eql([0n, 1n, 2n, 3n]);
      expect(await mint.getMintedTokens()).to.eql([
        1000000000000000000n,
        1000000000000000000000000000n,
        1n,
        1000000n,
      ]);
      expect(await mint.mint(owner, 3, 10)).to.not.be.reverted;
    });

    it("Should not be able to mint new type that has canMint set to false", async function () {
      const { mint, owner } = await loadFixture(deployContract);

      await mint.addTokenType(0, 0, false);
      expect(await mint.getTokenTypes()).to.eql([0n, 1n, 2n, 3n]);
      expect(await mint.getMintedTokens()).to.eql([
        1000000000000000000n,
        1000000000000000000000000000n,
        1n,
        0n,
      ]);
      expect(mint.mint(owner, 3, 10)).to.be.revertedWith(
        "Minting not allowed for this token type."
      );
    });
  });

  describe("Withdrawals", function () {
    it("Should transfer the funds to the owner", async function () {
      const { mint, owner } = await loadFixture(deployContractWithBalance);

      await expect(mint.withdrawAll()).to.changeEtherBalances(
        [owner, mint],
        [4096, -4096]
      );
    });

    it("Should not transfer if the contract is empty", async function () {
      const { mint, owner } = await loadFixture(deployContract);

      await expect(mint.withdrawAll()).to.be.revertedWith(
        "No funds available for withdrawal."
      );
    });
  });
});
