import { useState, useCallback, useEffect } from "react";

const CONTRACT_ID = "CC2RQTAM5OVTXEMRPD4LR22CMKXWQIFFUUWQQVKRFETSKYB6D6UAT2M3";
const RPC_URL = "https://soroban-testnet.stellar.org";

function hexToBytes(hex) {
  const h = hex.startsWith("0x") ? hex.slice(2) : hex;
  const len = h.length / 2;
  const bytes = Buffer.alloc(len);
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
      const { SorobanRpc, Contract, scValToNative } = await import("@stellar/stellar-sdk");
      const rpc = new SorobanRpc.Server(RPC_URL);

      let tx = new Contract(CONTRACT_ID).call("total");
      tx = await rpc.prepareTransaction(tx);
      let result;
      try {
        const sim = await rpc.simulateTransaction(tx);
        if (SorobanRpc.Api.isSimulationSuccess(sim)) {
          result = scValToNative(sim.result.retval);
        }
      } catch (_) {}
      if (result !== undefined) {
        setTotalProofs(Number(result));
        setNetworkOk(true);
      }

      tx = new Contract(CONTRACT_ID).call("admin");
      tx = await rpc.prepareTransaction(tx);
      try {
        const sim = await rpc.simulateTransaction(tx);
        if (SorobanRpc.Api.isSimulationSuccess(sim)) {
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
      const { SorobanRpc, xdr, Address, Contract } = await import("@stellar/stellar-sdk");
      const rpc = new SorobanRpc.Server(RPC_URL);

      if (!window.freighter) throw new Error("Freighter not installed");
      const network = await window.freighter.getNetwork();
      if (network !== "TESTNET") throw new Error("Switch Freighter to Testnet");

      const account = await rpc.getAccount(pubKey);

      const proofA = hexToBytes(data.proof_a);
      const proofB = hexToBytes(data.proof_b);
      const proofC = hexToBytes(data.proof_c);
      const vkX = hexToBytes(data.vk_x);
      const sourceHash = hexToBytes(data.source_hash);
      const nullifier = hexToBytes(data.nullifier);


      let tx = new SorobanRpc.TransactionBuilder(account, {
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

      tx = await rpc.prepareTransaction(tx);
      const signed = await window.freighter.signTransaction(tx.toXDR(), "TESTNET");
      const sendTx = SorobanRpc.TransactionBuilder.fromXDR(
        signed,
        "Test SDF Network ; September 2015",
      );

      const response = await rpc.sendTransaction(sendTx);
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
      const { SorobanRpc, Contract, xdr, scValToNative } = await import("@stellar/stellar-sdk");
      const rpc = new SorobanRpc.Server(RPC_URL);
      const nf = hexToBytes(nullifierHex);
      let tx = new Contract(CONTRACT_ID).call("is_nullifier_spent", xdr.ScVal.scvBytes(nf));
      tx = await rpc.prepareTransaction(tx);
      const sim = await rpc.simulateTransaction(tx);
      if (SorobanRpc.Api.isSimulationSuccess(sim)) {
        return scValToNative(sim.result.retval);
      }
    } catch (_) {}
    return null;
  }, []);

  const setVk = useCallback(async (vkHex, pubKey) => {
    setLoading(true);
    try {
      const { SorobanRpc, xdr, Address, Contract } = await import("@stellar/stellar-sdk");
      const rpc = new SorobanRpc.Server(RPC_URL);

      if (!window.freighter) throw new Error("Freighter not installed");
      const network = await window.freighter.getNetwork();
      if (network !== "TESTNET") throw new Error("Switch Freighter to Testnet");

      const account = await rpc.getAccount(pubKey);
      const vkBytes = hexToBytes(vkHex);

      let tx = new SorobanRpc.TransactionBuilder(account, {
        fee: "100000",
        networkPassphrase: "Test SDF Network ; September 2015",
      })
        .addOperation(new Contract(CONTRACT_ID).call(
          "set_verification_key",
          new Address(pubKey).toScVal(),
          xdr.ScVal.scvBytes(vkBytes),
        ))
        .setTimeout(30)
        .build();

      tx = await rpc.prepareTransaction(tx);
      const signed = await window.freighter.signTransaction(tx.toXDR(), "TESTNET");
      const sendTx = SorobanRpc.TransactionBuilder.fromXDR(signed, "Test SDF Network ; September 2015");
      const response = await rpc.sendTransaction(sendTx);

      if (response.status === "PENDING" || response.status === "SUCCESS") {
        return { success: true, txHash: response.hash };
      }
      return { success: false, error: response.status };
    } catch (e) {
      return { success: false, error: e.message || String(e) };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading, totalProofs, admin, networkOk,
    fetchStats, submitProof, checkNullifier, setVk,
    contractId: CONTRACT_ID,
  };
}
