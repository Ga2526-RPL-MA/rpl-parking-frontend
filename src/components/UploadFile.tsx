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
    <div className="border-dashed border-2 border-gray-300 rounded-lg p-6 text-center w-72">
      <input type="file" onChange={handleUpload} accept="image/*" className="hidden" id="file-upload" />
      <label htmlFor="file-upload" className="cursor-pointer text-gray-500">
        {file ? (
          <p className="text-gray-700 font-medium">{file.name}</p>
        ) : (
          <>
            <div className="text-4xl mb-2">📤</div>
            <p>Upload files here</p>
            <p className="text-sm text-gray-400 mt-1">Max Size: 3MB</p>
          </>
        )}
      </label>
    </div>
  );
}
