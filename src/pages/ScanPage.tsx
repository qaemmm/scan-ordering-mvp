import { Button, Card, DotLoading, Empty, Input, Space, Toast } from "antd-mobile";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import { useSessionStore } from "../state/session";
import type { OrderMode, ScanState, Store, Table } from "../types/domain";

type StoreRes = { store: Store; tables: Table[]; modes: OrderMode[] };

type ScanPayload = {
  storeId: string;
  mode: OrderMode;
  tableNo?: string;
};

const orderModes: OrderMode[] = ["DINE_IN", "DELIVERY", "PICKUP"];

function parseMode(raw: string | null): OrderMode | null {
  if (!raw) return null;
  const upper = raw.toUpperCase() as OrderMode;
  return orderModes.includes(upper) ? upper : null;
}

function parseScanText(raw: string, fallbackStoreId: string): ScanPayload | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed);
    const storeId = url.searchParams.get("storeId") ?? fallbackStoreId;
    const mode = parseMode(url.searchParams.get("mode")) ?? "DINE_IN";
    const tableNo = url.searchParams.get("tableNo") ?? undefined;
    return { storeId, mode, tableNo };
  } catch {
    return {
      storeId: fallbackStoreId,
      mode: "DINE_IN",
      tableNo: trimmed.toUpperCase(),
    };
  }
}

export function ScanPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionStoreId = useSessionStore((state) => state.storeId);
  const applyScanContext = useSessionStore((state) => state.applyScanContext);

  const [scanState, setScanState] = useState<ScanState>("SCAN_IDLE");
  const [error, setError] = useState("");
  const [storeInfo, setStoreInfo] = useState<Store | null>(null);
  const [tables, setTables] = useState<Table[]>([]);
  const [manualInput, setManualInput] = useState("");
  const [loadingStore, setLoadingStore] = useState(true);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<number | null>(null);

  const targetStoreId = searchParams.get("storeId") ?? sessionStoreId;

  useEffect(() => {
    let disposed = false;
    setLoadingStore(true);

    void (async () => {
      try {
        const res = await api.get<StoreRes>(`/api/stores/${targetStoreId}`);
        if (!disposed) {
          setStoreInfo(res.store);
          setTables(res.tables);
        }
      } catch (err) {
        if (!disposed) {
          setError(err instanceof Error ? err.message : "门店不存在");
          setScanState("SCAN_FALLBACK");
        }
      } finally {
        if (!disposed) setLoadingStore(false);
      }
    })();

    return () => {
      disposed = true;
    };
  }, [targetStoreId]);

  const validTableSet = useMemo(() => new Set(tables.map((table) => table.tableNo)), [tables]);

  const stopScanner = () => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopScanner();
  }, []);

  const applyPayload = useCallback(
    (payload: ScanPayload) => {
      if (!payload.storeId || !payload.mode) {
        setError("二维码缺少必要参数");
        setScanState("SCAN_FALLBACK");
        return;
      }

      if (!orderModes.includes(payload.mode)) {
        setError("二维码点餐模式不合法");
        setScanState("SCAN_FALLBACK");
        return;
      }

      if (payload.mode === "DINE_IN") {
        if (!payload.tableNo) {
          setError("堂食二维码缺少桌号");
          setScanState("SCAN_FALLBACK");
          return;
        }

        if (!validTableSet.has(payload.tableNo)) {
          setError(`桌号 ${payload.tableNo} 不在当前门店配置中`);
          setScanState("SCAN_FALLBACK");
          return;
        }
      }

      applyScanContext({
        storeId: payload.storeId,
        mode: payload.mode,
        tableNo: payload.mode === "DINE_IN" ? payload.tableNo : undefined,
        addressId: undefined,
        pickupTime: undefined,
      });

      setScanState("SCAN_SUCCESS");
      Toast.show({ content: "扫码成功，正在进入菜单", duration: 900 });
      navigate(`/store/${payload.storeId}/menu`);
    },
    [applyScanContext, navigate, validTableSet],
  );

  useEffect(() => {
    if (loadingStore) return;
    const mode = parseMode(searchParams.get("mode"));
    const tableNo = searchParams.get("tableNo") ?? undefined;
    if (!searchParams.get("storeId") && !mode && !tableNo) return;

    applyPayload({
      storeId: targetStoreId,
      mode: mode ?? "DINE_IN",
      tableNo: tableNo ? tableNo.toUpperCase() : undefined,
    });
  }, [applyPayload, loadingStore, searchParams, targetStoreId]);

  const decodeWithCamera = async () => {
    if (!("BarcodeDetector" in window)) {
      setError("当前浏览器不支持摄像头扫码，已切换手动输入");
      setScanState("SCAN_FALLBACK");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
      });
      streamRef.current = stream;
      if (!videoRef.current) return;

      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setError("");
      setScanState("SCAN_ACTIVE");

      const detector = new BarcodeDetector({ formats: ["qr_code"] });
      const tick = async () => {
        if (!videoRef.current) return;

        const results = await detector.detect(videoRef.current);
        if (results.length && results[0].rawValue) {
          stopScanner();
          const payload = parseScanText(results[0].rawValue, targetStoreId);
          if (payload) {
            applyPayload(payload);
            return;
          }
          setError("二维码内容无法解析");
          setScanState("SCAN_FALLBACK");
          return;
        }

        frameRef.current = requestAnimationFrame(() => void tick());
      };

      frameRef.current = requestAnimationFrame(() => void tick());
    } catch {
      setError("无法访问摄像头，已切换手动输入");
      setScanState("SCAN_FALLBACK");
      stopScanner();
    }
  };

  const submitManualInput = () => {
    const payload = parseScanText(manualInput, targetStoreId);
    if (!payload) {
      setError("请输入桌号或完整扫码链接");
      return;
    }
    applyPayload(payload);
  };

  if (loadingStore) {
    return (
      <div className="mobile-page center">
        <DotLoading color="primary" />
      </div>
    );
  }

  if (!storeInfo) {
    return (
      <div className="mobile-page">
        <Empty description="门店信息加载失败" />
      </div>
    );
  }

  return (
    <div className="mobile-page page-scan">
      <div className="hero-banner">
        <p className="hero-kicker">SCAN ORDER</p>
        <h2>扫码点单</h2>
        <p>{storeInfo.name}</p>
      </div>

      {error && (
        <Card>
          <p style={{ color: "#b42318", margin: 0 }}>{error}</p>
        </Card>
      )}

      <Card title="摄像头扫码">
        <Space direction="vertical" block>
          <Button color="primary" onClick={() => void decodeWithCamera()}>
            启动扫码
          </Button>
          <video ref={videoRef} muted playsInline className="scan-video" />
          {scanState === "SCAN_ACTIVE" && <p className="muted">对准桌码后会自动跳转</p>}
        </Space>
      </Card>

      <Card title="手动输入（兜底）">
        <Input
          value={manualInput}
          onChange={setManualInput}
          placeholder="输入桌号（如 A01）或粘贴扫码链接"
          clearable
        />
        <div style={{ marginTop: 12 }}>
          <Button block onClick={submitManualInput}>
            继续点单
          </Button>
        </div>
      </Card>

      <Button
        fill="none"
        onClick={() => {
          stopScanner();
          navigate("/");
        }}
      >
        返回首页
      </Button>
    </div>
  );
}
