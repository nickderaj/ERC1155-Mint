import { ethers } from "hardhat";

async function main() {
  const timestamp = Math.round(Date.now() / 1000);
  const contract = await ethers.deployContract("Mint");
  await contract.waitForDeployment();

  console.log(
    `Contract deployed to ${String(contract.target)} at timestamp ${timestamp}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
