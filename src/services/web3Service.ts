import { createPublicClient, http, encodeFunctionData, Hex } from "viem";
import { baseSepolia } from "viem/chains";
import { createSmartAccountClient } from "permissionless";
import { signerToSimpleSmartAccount } from "permissionless/accounts";
import { privateKeyToAccount } from "viem/accounts";

/**
 * @title Web3Service
 * @dev Handles Account Abstraction (ERC-4337) and interaction with OKE contracts.
 * Uses permissionless.js and wagmi/viem.
 */
export class Web3Service {
    private static publicClient = createPublicClient({
        chain: baseSepolia,
        transport: http(import.meta.env.VITE_RPC_URL || "https://sepolia.base.org")
    });

    /**
     * Generates a Smart Account Client for a user.
     * In production, the signer would be derived from a Passkey or ZKP-generated key.
     */
    static async getSmartAccountClient(privateKey: string) {
        const owner = privateKeyToAccount(privateKey as Hex);

        const smartAccount = await signerToSimpleSmartAccount(this.publicClient, {
            signer: owner,
            factoryAddress: (import.meta.env.VITE_TBA_FACTORY as Hex) || "0x9406Cc6185a346906296840746125a0E44976454",
            entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789" // EntryPoint v0.6 usually
        });

        return createSmartAccountClient({
            account: smartAccount,
            chain: baseSepolia,
            bundlerTransport: http(import.meta.env.VITE_BUNDLER_URL),
            paymasterTransport: http(import.meta.env.VITE_PAYMASTER_URL),
            publicClient: this.publicClient
        });
    }

    /**
     * Executes the Atomic Mint with ZKP verification via Account Abstraction.
     */
    static async mintWithZkp(
        client: any,
        userAddress: string,
        metadataUri: string,
        nullifier: string,
        proof: any
    ) {
        console.log("Web3: Initiating Atomic Mint with ZKP via AA...");

        // AtomicMint.mintWithProof(address user, string metadataURI, bytes32 nullifier, uint[2] a, uint[2][2] b, uint[2] c, uint[1] input)
        const atomicMintAddress = import.meta.env.VITE_ATOMIC_MINT_ADDRESS as Hex;

        // We encode the function call manually for UserOperation
        const hash = await client.sendTransaction({
            to: atomicMintAddress,
            data: encodeFunctionData({
                abi: [
                    {
                        name: "mintWithProof",
                        type: "function",
                        inputs: [
                            { name: "user", type: "address" },
                            { name: "metadataURI", type: "string" },
                            { name: "nullifier", type: "bytes32" },
                            { name: "a", type: "uint256[2]" },
                            { name: "b", type: "uint256[2][2]" },
                            { name: "c", type: "uint256[2]" },
                            { name: "input", type: "uint256[1]" }
                        ]
                    }
                ],
                args: [
                    userAddress,
                    metadataUri,
                    nullifier,
                    proof.a,
                    proof.b,
                    proof.c,
                    proof.input
                ]
            })
        });

        console.log("Web3: UserOperation Hash:", hash);
        return hash;
    }
}
