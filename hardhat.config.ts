import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
dotenv.config({ path: __dirname + "/.env" });

const ETHERSCAN_KEY = process.env.ETHERSCAN_API_KEY ?? "";
const ALCHEMY_KEY = process.env.ALCHEMY_API_KEY ?? "";
const PRIVATE_KEY = process.env.PRIVATE_KEY ?? "";

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  etherscan: { apiKey: ETHERSCAN_KEY },
  networks: {
    testnet: {
      // BSC Testnet
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      accounts: [PRIVATE_KEY],
    },
    mainnet: {
      // BSC Mainnet
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      accounts: [PRIVATE_KEY],
    },
    sepolia: {
      // ETH Sepolia
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`,
      accounts: [PRIVATE_KEY],
    },
  },
};

export default config;
