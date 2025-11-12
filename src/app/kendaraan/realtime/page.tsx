"use client";

import { useEffect,useRef, useState } from "react";
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
  const [isRunning, setIsRunning] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [lastPlate, setLastPlate] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) interval = setInterval(captureFrame, 2000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const captureFrame = async () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    try {
      const blob = await fetch(imageSrc).then((res) => res.blob());
      const formData = new FormData();
      formData.append("plate", blob, "frame.jpg");

      const detectResponse = await api.post("/vehicles/plate", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const detectedPlate =
        detectResponse.data?.data?.plateNumber?.trim()?.toUpperCase() ?? "UNKNOWN";
      if (detectedPlate === "UNKNOWN") {
        toast.warning("Plat tidak terdeteksi");
        return;
      }

      if (detectedPlate === lastPlate) return;
      setLastPlate(detectedPlate);

      let vehicleData = null;
      try {
        const vehicleResponse = await api.get(`/vehicles/${detectedPlate}`);
        vehicleData = vehicleResponse.data?.data;
      } catch {
        vehicleData = null;
      }

      const matched = !!vehicleData;
      setDetections((prev) => [
        {
          plate: detectedPlate,
          matched,
          image: vehicleData?.image,
          time: new Date().toLocaleTimeString(),
          ownerName: vehicleData?.ownerName ?? "-",
          type: vehicleData?.type ?? "-",
          brand: vehicleData?.brand ?? "-",
          model: vehicleData?.model ?? "-",
          color: vehicleData?.color ?? "-",
        },
        ...prev.slice(0, 19),
      ]);

      if (matched) {
        toast.success(`Plat ${detectedPlate} terdaftar`);
      } else {
        toast.warning(`Plat ${detectedPlate} tidak dikenal`);
      }
    } catch (error) {
      console.error("Detection error:", error);
      toast.error("Terjadi kesalahan saat memproses frame");
    }
  };

  return (
    <div className="flex flex-col items-center p-8 bg-gradient-to-b from-gray-100 to-blue-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Real-time Plate Monitoring</h1>
      <Card className="p-4 shadow-lg w-[800px]">
        <CardContent className="flex flex-col items-center gap-3">
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "environment" }}
            className="rounded-lg border"
            width={700}
            height={400}
          />
          <div className="flex gap-3 mt-3 items-center">
            <Button
              onClick={() => setIsRunning(!isRunning)}
              className={isRunning ? "bg-red-600" : "bg-green-600"}
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
          <div className="mt-6 w-full max-h-[350px] overflow-y-auto text-sm">
            <table className="w-full border-collapse text-left">
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
                      d.matched
                        ? "text-green-700 bg-green-50"
                        : "text-red-700 bg-red-50"
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
