import { useState, useCallback, useEffect } from "react";
import { isConnected, getNetwork, signTransaction } from "@stellar/freighter-api";

const CONTRACT_ID = "CC2RQTAM5OVTXEMRPD4LR22CMKXWQIFFUUWQQVKRFETSKYB6D6UAT2M3";
const RPC_URL = "https://soroban-testnet.stellar.org";

function hexToBytes(hex) {
  const h = hex.startsWith("0x") ? hex.slice(2) : hex;
  const len = h.length / 2;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = parseInt(h.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

export function useContract() {
  const [loading, setLoading] = useState(false);
  const [totalProofs, setTotalProofs] = useState(0);
  const [admin, setAdmin] = useState(null);
  const [networkOk, setNetworkOk] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const { rpc, Contract, scValToNative } = await import("@stellar/stellar-sdk");
      const server = new rpc.Server(RPC_URL);

      let tx = new Contract(CONTRACT_ID).call("total");
      tx = await server.prepareTransaction(tx);
      let result;
      try {
        const sim = await server.simulateTransaction(tx);
        if (rpc.Api.isSimulationSuccess(sim)) {
          result = scValToNative(sim.result.retval);
        }
      } catch (_) {}
      if (result !== undefined) {
        setTotalProofs(Number(result));
        setNetworkOk(true);
      }

      tx = new Contract(CONTRACT_ID).call("admin");
      tx = await server.prepareTransaction(tx);
      try {
        const sim = await server.simulateTransaction(tx);
        if (rpc.Api.isSimulationSuccess(sim)) {
          setAdmin(scValToNative(sim.result.retval));
        }
      } catch (_) {}
    } catch (e) {
      console.error("Contract fetch failed:", e);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const submitProof = useCallback(async (data, pubKey) => {
    setLoading(true);
    try {
      const { rpc, xdr, Address, Contract, TransactionBuilder } = await import("@stellar/stellar-sdk");
      const server = new rpc.Server(RPC_URL);

      const connectedRes = await isConnected();
      if (!connectedRes || !connectedRes.isConnected) {
        throw new Error("Freighter not installed");
      }
      const netRes = await getNetwork();
      if (!netRes || netRes.network !== "TESTNET") {
        throw new Error("Switch Freighter to Testnet");
      }

      const account = await server.getAccount(pubKey);

      const proofA = hexToBytes(data.proof_a);
      const proofB = hexToBytes(data.proof_b);
      const proofC = hexToBytes(data.proof_c);
      const vkX = hexToBytes(data.vk_x);
      const sourceHash = hexToBytes(data.source_hash);
      const nullifier = hexToBytes(data.nullifier);

      let tx = new TransactionBuilder(account, {
        fee: "100000",
        networkPassphrase: "Test SDF Network ; September 2015",
      })
        .addOperation(new Contract(CONTRACT_ID).call(
          "verify_proof",
          new Address(pubKey).toScVal(),
          xdr.ScVal.scvBytes(proofA),
          xdr.ScVal.scvBytes(proofB),
          xdr.ScVal.scvBytes(proofC),
          xdr.ScVal.scvBytes(vkX),
          xdr.ScVal.scvBytes(sourceHash),
          xdr.ScVal.scvBytes(nullifier),
        ))
        .setTimeout(30)
        .build();

      tx = await server.prepareTransaction(tx);
      const { signedTxXdr, error: signError } = await signTransaction(tx.toXDR(), {
        networkPassphrase: "Test SDF Network ; September 2015",
      });
      if (signError) {
        throw new Error(signError);
      }
      const sendTx = TransactionBuilder.fromXDR(
        signedTxXdr,
        "Test SDF Network ; September 2015",
      );

      const response = await server.sendTransaction(sendTx);
      if (response.status === "PENDING" || response.status === "SUCCESS") {
        fetchStats();
        return { success: true, txHash: response.hash };
      }
      return { success: false, error: response.status };
    } catch (e) {
      return { success: false, error: e.message || String(e) };
    } finally {
      setLoading(false);
    }
  }, [fetchStats]);

  const checkNullifier = useCallback(async (nullifierHex) => {
    try {
      const { rpc, Contract, xdr, scValToNative } = await import("@stellar/stellar-sdk");
      const server = new rpc.Server(RPC_URL);
      const nf = hexToBytes(nullifierHex);
      let tx = new Contract(CONTRACT_ID).call("is_nullifier_spent", xdr.ScVal.scvBytes(nf));
      tx = await server.prepareTransaction(tx);
      const sim = await server.simulateTransaction(tx);
      if (rpc.Api.isSimulationSuccess(sim)) {
        return scValToNative(sim.result.retval);
      }
    } catch (_) {}
    return null;
  }, []);

  return {
    loading, totalProofs, admin, networkOk,
    fetchStats, submitProof, checkNullifier,
    contractId: CONTRACT_ID,
  };
}
