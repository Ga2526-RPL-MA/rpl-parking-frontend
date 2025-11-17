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
    if (countdown === 0) {
      setCountdown(null);
      setIsRunning(true);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);


  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) interval = setInterval(captureFrame, 10000);
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

      const detectResponse = await api.post("/vehicles/plate/realtime", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

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

  {/* fungsi back to dashboard by role */}
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
  <div className="flex flex-col items-center p-4 md:p-8 bg-linear-to-b from-gray-100 to-blue-50 min-h-screen">
    <h1 className="text-xl md:text-2xl font-bold mb-4">Real-time Plate Monitoring</h1>

        {/* COUNTDOWN OVERLAY */}
{countdown !== null && (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md">

    <div className="text-white text-2xl font-semibold mb-6 animate-pulse text-center">
      Plat diScan! Jaga device-mu tetap stabil ya..
    </div>

    {/* Countdown Circle */}
    <div className="flex flex-col items-center">

      <div className="flex items-center justify-center w-40 h-40 rounded-full border-4 border-white mb-6">
        <span className="text-6xl font-bold text-white">
          {countdown}
        </span>
      </div>

      {/* Mini webcam preview */}
      <div className="w-90 rounded-lg overflow-hidden border-2 border-white shadow-xl">
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: "environment" }}
          className="w-full h-auto"
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

    <Card className="p-4 shadow-lg w-full max-w-3xl">
      <CardContent className="flex flex-col items-center gap-3">

        {/* WEBCAM RESPONSIVE */}
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: "environment" }}
          className="rounded-lg border w-full h-auto"
        />

        {/* BUTTONS RESPONSIVE */}
        <div className="flex flex-wrap gap-3 mt-3 items-center justify-center">
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
              className={`px-4 py-2 rounded-lg text-white ${
                detections[0]?.matched ? "bg-green-500" : "bg-red-500"
              }`}
            >
              Last: {lastPlate}
            </div>
          )}
        </div>

        {/* TABLE WRAPPER RESPONSIVE */}
        <div className="mt-6 w-full max-h-[350px] overflow-y-auto overflow-x-auto text-sm">
          <table className="w-full min-w-[700px] border-collapse text-left">
            <thead className="bg-gray-200 sticky top-0">
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
                    d.matched ? "text-green-700 bg-green-50" : "text-red-700 bg-red-50"
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
