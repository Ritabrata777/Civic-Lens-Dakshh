const { ethers } = require("ethers");

const HARDHAT_RPC = "http://localhost:8545";
const FUNDED_PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // Hardhat Account #0
const TARGET_WALLET = "0x07e28def8DC590A442790c80Fd6A3A5240Df0184"; // User's wallet
const AMOUNT = "10"; // Send 10 ETH

async function fundWallet() {
    try {
        console.log("Connecting to Hardhat network at", HARDHAT_RPC);
        const provider = new ethers.JsonRpcProvider(HARDHAT_RPC);
        const wallet = new ethers.Wallet(FUNDED_PRIVATE_KEY, provider);
        
        console.log("Funded account:", wallet.address);
        console.log("Sending", AMOUNT, "ETH to", TARGET_WALLET);
        
        const tx = await wallet.sendTransaction({
            to: TARGET_WALLET,
            value: ethers.parseEther(AMOUNT),
        });
        
        console.log("Transaction sent:", tx.hash);
        const receipt = await tx.wait();
        console.log("Transaction confirmed!");
        console.log("Receipt:", receipt);
    } catch (error) {
        console.error("Error funding wallet:", error);
        process.exit(1);
    }
}

fundWallet();
