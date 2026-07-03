import { useState, useEffect, useCallback } from "react";

const FREIGHTER_URL = "https://www.freighter.app";

function getFreighter() {
  if (typeof window === "undefined") return null;
  return window.freighter || window.freighterApi || null;
}

export function useWallet() {
  const [address, setAddress] = useState(null);
  const [network, setNetwork] = useState(null);
  const [connected, setConnected] = useState(false);
  const [freighterInstalled, setFreighterInstalled] = useState(null);

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 20;

    function check() {
      attempts++;
      const f = getFreighter();
      if (f) {
        setFreighterInstalled(true);
        return;
      }
      if (attempts < maxAttempts) {
        setTimeout(check, 250);
      } else {
        setFreighterInstalled(false);
      }
    }

    check();
  }, []);

  const connect = useCallback(async () => {
    const f = getFreighter();
    if (!f) {
      window.open(FREIGHTER_URL, "_blank");
      return;
    }
    try {
      const pubKey = await f.getPublicKey();
      const net = await f.getNetwork();
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
