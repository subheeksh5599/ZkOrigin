import { useState, useCallback, useEffect } from "react";

const CONTRACT_ID = "CC6VEWZRGUI4TFN4N4ZUTITDTW5A4CTUH6AQR67AOWXLX5XW4WE6AARP";
const RPC_URL = "https://soroban-testnet.stellar.org";

export function useContract() {
  const [loading, setLoading] = useState(false);
  const [totalProofs, setTotalProofs] = useState(0);
  const [admin, setAdmin] = useState(null);
  const [networkOk, setNetworkOk] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const { SorobanRpc, xdr, Address, Contract, scValToNative } = await import("@stellar/stellar-sdk");
      const rpc = new SorobanRpc.Server(RPC_URL);

      // Simulate total()
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

      // Simulate admin()
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

  const submitProof = useCallback(async (sourceHash, nullifier, pubKey) => {
    setLoading(true);
    try {
      const { SorobanRpc, xdr, Address, Contract, scValToNative, nativeToScVal } = await import("@stellar/stellar-sdk");
      const rpc = new SorobanRpc.Server(RPC_URL);

      if (!window.freighter) throw new Error("Freighter not installed");
      const network = await window.freighter.getNetwork();
      if (network !== "TESTNET") throw new Error("Switch Freighter to Testnet");

      const account = await rpc.getAccount(pubKey);
      const contract = new Contract(CONTRACT_ID);

      let tx = new SorobanRpc.TransactionBuilder(account, {
        fee: "100000",
        networkPassphrase: "Test SDF Network ; September 2015",
      })
        .addOperation(contract.call(
          "verify_proof",
          new Address(pubKey).toScVal(),
          nativeToScVal(sourceHash, { type: "bytes" }),
          nativeToScVal(nullifier, { type: "bytes" }),
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

  const checkNullifier = useCallback(async (nullifier) => {
    try {
      const { SorobanRpc, Contract, scValToNative, nativeToScVal } = await import("@stellar/stellar-sdk");
      const rpc = new SorobanRpc.Server(RPC_URL);
      let tx = new Contract(CONTRACT_ID).call("is_nullifier_spent", nativeToScVal(nullifier, { type: "bytes" }));
      tx = await rpc.prepareTransaction(tx);
      const sim = await rpc.simulateTransaction(tx);
      if (SorobanRpc.Api.isSimulationSuccess(sim)) {
        return scValToNative(sim.result.retval);
      }
    } catch (_) {}
    return null;
  }, []);

  return { loading, totalProofs, admin, networkOk, fetchStats, submitProof, checkNullifier, contractId: CONTRACT_ID };
}
