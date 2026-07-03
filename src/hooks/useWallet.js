import { useState, useEffect, useCallback } from "react";
import {
  isConnected,
  getAddress,
  requestAccess,
  getNetwork,
} from "@stellar/freighter-api";

const FREIGHTER_URL = "https://www.freighter.app";

export function useWallet() {
  const [address, setAddress] = useState(null);
  const [network, setNetwork] = useState(null);
  const [connected, setConnected] = useState(false);
  const [freighterInstalled, setFreighterInstalled] = useState(null);

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 20;

    async function check() {
      attempts++;
      try {
        const res = await isConnected();
        if (!cancelled) {
          if (res.isConnected) {
            setFreighterInstalled(true);
            const addrRes = await getAddress();
            if (addrRes.address) {
              setAddress(addrRes.address);
              setConnected(true);
              const netRes = await getNetwork();
              if (netRes.network) setNetwork(netRes.network);
            }
          } else if (attempts < maxAttempts) {
            setTimeout(check, 250);
            return;
          } else {
            setFreighterInstalled(false);
          }
        }
      } catch (e) {
        if (!cancelled && attempts < maxAttempts) {
          setTimeout(check, 250);
        } else if (!cancelled) {
          setFreighterInstalled(false);
        }
      }
    }

    check();
    return () => { cancelled = true; };
  }, []);

  const connect = useCallback(async () => {
    try {
      const res = await isConnected();
      if (!res.isConnected) {
        window.open(FREIGHTER_URL, "_blank");
        return;
      }

      const addrRes = await requestAccess();
      if (addrRes.error) throw new Error(addrRes.error.message || addrRes.error);

      setAddress(addrRes.address);
      setConnected(true);

      const netRes = await getNetwork();
      if (netRes.network) setNetwork(netRes.network);
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
