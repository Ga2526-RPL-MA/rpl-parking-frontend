"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { toast } from "sonner";

import api from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Detection {
  plate: string;
  matched: boolean;
  image?: string;
  time: string;
  ownerName?: string;
  type?: string;
  brand?: string;
  model?: string;
  color?: string;
}

export default function RealTimePlateMonitor() {
  const webcamRef = useRef<Webcam>(null);
  const router = useRouter();
  const [isRunning, setIsRunning] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [lastPlate, setLastPlate] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [userRole, setUserRole] = useState<string>("user");

  // Countdown 10 detik sebelum monitoring dimulai
  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 10) {
      setIsRunning(true); // Langsung jalan saat countdown dimulai
    }

    if (countdown === 0) {
      setCountdown(null); // Overlay hilang
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) interval = setInterval(captureFrame, 7000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning]);

  const captureFrame = async () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    try {
      const blob = await fetch(imageSrc).then((res) => res.blob());
      const formData = new FormData();
      formData.append("plate", blob, "frame.jpg");

      const detectResponse = await api.post(
        "/vehicles/plate/realtime",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const detectedData = detectResponse.data?.data;
      if (!detectedData) {
        toast.warning("Plat tidak terdeteksi");
        return;
      }

      // Jika backend mengirim "UNKNOWN"
      if (detectedData === "UNKNOWN") {
        toast.warning("Plat tidak terdeteksi");
        return;
      }

      const plateNumber = detectedData.plateNumber;
      const vehicle = detectedData.vehicle;

      if (!plateNumber) {
        toast.warning("Plat tidak terdeteksi");
        return;
      }

      if (plateNumber === lastPlate) return;
      setLastPlate(plateNumber);

      const matched = !!vehicle;
      const ownerName = vehicle?.user?.name ?? "-";

      setDetections((prev) => [
        {
          plate: plateNumber,
          matched,
          image: undefined,
          time: new Date().toLocaleTimeString(),
          ownerName,
          type: vehicle?.type ?? "-",
          brand: vehicle?.brand ?? "-",
          model: vehicle?.modelName ?? "-",
          color: vehicle?.color ?? "-",
        },
        ...prev.slice(0, 19),
      ]);

      if (matched) {
        toast.success(`Plat ${plateNumber} terdaftar (${ownerName})`);
      } else {
        toast.warning(`Plat ${plateNumber} tidak dikenal`);
      }
    } catch (error) {
      console.error("Detection error:", error);
      toast.error("Terjadi kesalahan saat memproses frame");
    }
  };

  {
    /* fungsi back to dashboard by role */
  }
  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserRole(user.role?.toLowerCase() || "user");
    }
  }, []);

  const getDashboardPath = () =>
    userRole === "admin" ? "/dashboard" : "/dashboard/user";

  return (
    <div className="flex min-h-screen flex-col items-center bg-linear-to-b from-gray-100 to-blue-50 p-4 md:p-8">
      <h1 className="mb-4 text-xl font-bold md:text-2xl">
        Real-time Plate Monitoring
      </h1>

      {/* COUNTDOWN OVERLAY */}
      {countdown !== null && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md">
          <div className="mb-6 animate-pulse text-center text-2xl font-semibold text-white">
            Plat diScan! Jaga device-mu tetap stabil ya..
          </div>

          {/* Countdown Circle */}
          <div className="flex flex-col items-center">
            <div className="mb-6 flex h-40 w-40 items-center justify-center rounded-full border-4 border-white">
              <span className="text-6xl font-bold text-white">{countdown}</span>
            </div>

            {/* Mini webcam preview */}
            <div className="w-90 overflow-hidden rounded-lg border-2 border-white shadow-xl">
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: "environment" }}
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>
      )}

      <div className="mt-1 text-center">
        <Button
          variant="ghost"
          onClick={() => router.push(getDashboardPath())}
          className="flex items-center gap-1 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Dashboard
        </Button>
      </div>

      <Card className="w-full max-w-3xl p-4 shadow-lg">
        <CardContent className="flex flex-col items-center gap-3">
          {/* WEBCAM RESPONSIVE */}
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "environment" }}
            className="h-auto w-full rounded-lg border"
          />

          {/* BUTTONS RESPONSIVE */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
            <Button
              onClick={() => {
                if (isRunning) {
                  setIsRunning(false);
                } else {
                  setCountdown(10); // countdown 10s
                }
              }}
              className={isRunning ? "bg-red-600" : "bg-blue-600"}
            >
              {isRunning ? "Stop Monitoring" : "Start Monitoring"}
            </Button>

            {lastPlate && (
              <div
                className={`rounded-lg px-4 py-2 text-white ${
                  detections[0]?.matched ? "bg-green-500" : "bg-red-500"
                }`}
              >
                Last: {lastPlate}
              </div>
            )}
          </div>

          {/* TABLE WRAPPER RESPONSIVE */}
          <div className="mt-6 max-h-[350px] w-full overflow-x-auto overflow-y-auto text-sm">
            <table className="w-full min-w-[700px] border-collapse text-left">
              <thead className="sticky top-0 bg-gray-200">
                <tr>
                  <th className="p-2">Waktu</th>
                  <th className="p-2">Plat</th>
                  <th className="p-2">Pemilik</th>
                  <th className="p-2">Jenis</th>
                  <th className="p-2">Merk</th>
                  <th className="p-2">Model</th>
                  <th className="p-2">Warna</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {detections.map((d, idx) => (
                  <tr
                    key={idx}
                    className={`border-b ${
                      d.matched
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    <td className="p-2">{d.time}</td>
                    <td className="p-2 font-semibold">{d.plate}</td>
                    <td className="p-2">{d.ownerName}</td>
                    <td className="p-2">{d.type}</td>
                    <td className="p-2">{d.brand}</td>
                    <td className="p-2">{d.model}</td>
                    <td className="p-2">{d.color}</td>
                    <td className="p-2">
                      {d.matched ? "✔ Terdaftar" : "✖ Tidak dikenal"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
