"use client";

import { useState } from "react";

export default function UploadFile() {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-72 rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
      <input
        type="file"
        onChange={handleUpload}
        accept="image/*"
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="cursor-pointer text-gray-500">
        {file ? (
          <p className="font-medium text-gray-700">{file.name}</p>
        ) : (
          <>
            <div className="mb-2 text-4xl">📤</div>
            <p>Upload files here</p>
            <p className="mt-1 text-sm text-gray-400">Max Size: 3MB</p>
          </>
        )}
      </label>
    </div>
  );
}
