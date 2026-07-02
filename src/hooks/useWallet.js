import { useState, useEffect, useCallback } from "react";

const FREIGHTER_URL = "https://www.freighter.app";

export function useWallet() {
  const [address, setAddress] = useState(null);
  const [network, setNetwork] = useState(null);
  const [connected, setConnected] = useState(false);
  const [freighterInstalled, setFreighterInstalled] = useState(false);

  useEffect(() => {
    setFreighterInstalled(typeof window !== "undefined" && !!window.freighter);
  }, []);

  const connect = useCallback(async () => {
    if (!window.freighter) {
      window.open(FREIGHTER_URL, "_blank");
      return;
    }
    try {
      const pubKey = await window.freighter.getPublicKey();
      const net = await window.freighter.getNetwork();
      setAddress(pubKey);
      setNetwork(net);
      setConnected(true);
    } catch (e) {
      console.error("Freighter connection failed:", e);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setNetwork(null);
    setConnected(false);
  }, []);

  return { address, network, connected, freighterInstalled, connect, disconnect };
}
