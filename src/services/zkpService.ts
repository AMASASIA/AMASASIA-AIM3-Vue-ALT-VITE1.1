import * as snarkjs from "snarkjs";

/**
 * @title ZkpService
 * @dev Service for generating Zero-Knowledge Proofs on the client side using snarkjs.
 * This ensures private user data (like biometric-derived secrets) never leaves the device.
 */
export class ZkpService {
    /**
     * Generates a Groth16 proof for the identity verification circuit.
     * @param secret The private secret (derived from home/voice metrics).
     * @param publicHash The public hash already committed to the blockchain/SBT.
     */
    static async generateIdentityProof(secret: number, publicHash: string) {
        console.log("ZKP: Generating proof for identity...");

        // In a production setup, these assets would be hosted on a CDN or bundled.
        // They correspond to the compiled Circom circuit.
        const wasmPath = "/zkp/verify_secret.wasm";
        const zkeyPath = "/zkp/verify_secret.zkey";

        const input = {
            secret,
            publicHash
        };

        try {
            const { proof, publicSignals } = await snarkjs.groth16.fullProve(
                input,
                wasmPath,
                zkeyPath
            );

            // Format the proof data for Solidity Verifier contract call
            const calldata = await snarkjs.groth16.exportSolidityCallData(proof, publicSignals);
            const argv = calldata.replace(/["[\]\s]/g, "").split(",");

            // Map to the parameters expected by AtomicMint:
            // a: [2], b: [2][2], c: [2], input: [1]
            return {
                a: [argv[0], argv[1]],
                b: [
                    [argv[2], argv[3]],
                    [argv[4], argv[5]]
                ],
                c: [argv[6], argv[7]],
                input: [argv[8]]
            };
        } catch (error) {
            console.error("ZKP: Proof generation failed", error);
            throw error;
        }
    }
}
