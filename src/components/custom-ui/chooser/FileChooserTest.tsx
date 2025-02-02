import { Check, CloudDownload, CloudUpload } from "lucide-react";
import { useTranslation } from "react-i18next";
import React, { useRef, useState } from "react";
import UploadButton from "@rpldy/upload-button";
import ChunkedUploady from "@rpldy/chunked-uploady";
import { isFile } from "@/validation/utils";
import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import SimpleProgressBar from "./SimpleProgressBar";
export interface FileType {
  pending_id: string;
  path: string;
  name: string;
  extension: string;
  size: string;
}
export interface FileChooserTestProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  requiredHint?: string;
  name: string;
  parentClassName?: string;
  errorMessage?: string;
  defaultFile: File | FileType;
  maxSize: number;
  validTypes: string[];
  disabled?: boolean;
  downloadParam?: { path: string; fileName: string };
  uploadParam?: any;
  onComplete: (record: any) => Promise<void>;
  onStart: (file: File) => Promise<void>;
}

const FileChooserTest = React.forwardRef<
  HTMLInputElement,
  FileChooserTestProps
>((props, _ref: any) => {
  const { defaultFile, onComplete, onStart, uploadParam, errorMessage } = props;
  const { t } = useTranslation();
  const [uploaded, setUploaded] = useState(false);
  const downloadRef = useRef<HTMLLIElement>(null);
  const lockUpload = (lock: boolean) => {
    if (downloadRef.current) {
      downloadRef.current.style.pointerEvents = lock ? "none" : "auto";
      downloadRef.current.style.opacity = lock ? "0.5" : "1";
    }
  };
  console.log(errorMessage);
  return (
    <ul className="gap-x-2 grid w-full grid-cols-[auto_auto_auto] sm:grid-cols-[auto_1fr_auto_1fr] items-center">
      <li className="flex items-center gap-x-4 px-2 rtl:text-lg-rtl ltr:text-lg-ltr font-semibold">
        {uploaded && (
          <Check className="size-[22px] text-green-500 rounded-sm" />
        )}
        {isFile(defaultFile) ? (
          <h1 className="text-[15px] font-normal max-w-36 text-ellipsis overflow-hidden">
            {defaultFile?.name}
          </h1>
        ) : (
          defaultFile?.name && (
            <>
              <h1 className="text-[15px] font-normal max-w-36 text-ellipsis overflow-hidden">
                {defaultFile?.name}
              </h1>
              <Downloader
                cancelText={t("cancel")}
                filetoDownload={defaultFile}
                downloadText={t("download")}
                errorText={t("error")}
                lockUpload={lockUpload}
              />
            </>
          )
        )}
      </li>
      <li className=" sm:col-span-1" ref={downloadRef}>
        <ChunkedUploady
          withCredentials={true}
          method="POST"
          destination={{
            url: `${import.meta.env.VITE_API_BASE_URL}/api/v1/file/upload`,
            headers: {
              "X-API-KEY": import.meta.env.VITE_BACK_END_API_TOKEN,
              "X-SERVER-ADDR": import.meta.env.VITE_BACK_END_API_IP,
              Authorization:
                "Bearer " +
                localStorage.getItem(import.meta.env.VITE_TOKEN_STORAGE_KEY),
            },
            params: uploadParam,
          }}
          chunkSize={1400000}
          inputFieldName={"file"}
        >
          <div className="flex items-center gap-x-4">
            <UploadButton text="">
              <label className="flex flex-col items-center justify-center h-full py-3 transition-opacity duration-150 cursor-pointer hover:opacity-80">
                <CloudUpload className="size-[30px] bg-primary text-primary-foreground rounded-full p-[4px]" />
                <strong className="text-sm font-medium text-primary-text">
                  {t("select_a_file")}
                </strong>
              </label>
            </UploadButton>

            <SimpleProgressBar
              onStart={async (file: File) => {
                onStart(file);
              }}
              onFailed={async (failed: boolean) => {
                if (failed) {
                  setUploaded(false);
                }
              }}
              onComplete={async (response: any) => {
                setUploaded(true);
                await onComplete(response);
              }}
              failedMessage={t("failed_to_upld")}
              cancelText={t("cancel")}
            />
          </div>
        </ChunkedUploady>
      </li>
      {errorMessage && (
        <h1 className="rtl:text-sm-rtl col-span-full ltr:text-sm-ltr capitalize text-start text-red-400">
          {errorMessage}
        </h1>
      )}
    </ul>
  );
});

export default FileChooserTest;

interface DownloaderProps {
  downloadText: string;
  filetoDownload: FileType;
  errorText: string;
  cancelText: string;
  lockUpload: (lock: boolean) => void;
}
const Downloader = (props: DownloaderProps) => {
  const { downloadText, filetoDownload, errorText, cancelText, lockUpload } =
    props;
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [cancelTokenSource, setCancelTokenSource] = useState<any>(null); // New state to store the cancel token

  const download = async () => {
    // 1. Create token
    const source = axios.CancelToken.source();
    setCancelTokenSource(source); // Store the source
    try {
      lockUpload(true);
      setIsDownloading(true);
      const response = await axiosClient.get(`media/${filetoDownload?.path}`, {
        responseType: "blob", // Important to handle the binary data (PDF)
        cancelToken: source.token, // Pass the cancel token here
        onDownloadProgress: (progressEvent) => {
          // Calculate download progress percentage
          const total = progressEvent.total || 0;
          const current = progressEvent.loaded;
          const progress = Math.round((current / total) * 100);
          setDownloadProgress(progress); // Update progress state
        },
      });
      if (response.status == 200) {
        // Create a URL for the file blob
        const file = new Blob([response.data], {
          type: filetoDownload.extension,
        });
        // const file = new Blob([response.data], { type: "application/pdf" });
        const fileURL = window.URL.createObjectURL(file);

        const link = document.createElement("a");
        link.href = fileURL;
        link.download = filetoDownload.name;
        link.click();

        // Clean up the URL object after download
        window.URL.revokeObjectURL(fileURL);
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: errorText,
        description: error.response.data.message,
      });
      console.log(error);
    }
    setIsDownloading(false); // Reset downloading state
    lockUpload(false);
  };

  const cancelDownload = () => {
    if (cancelTokenSource) {
      cancelTokenSource.cancel("Download canceled by user.");
      setIsDownloading(false); // Reset downloading state
    }
  };
  return (
    <>
      <label
        onClick={download}
        className="flex flex-col items-center justify-center h-full py-3 transition-opacity duration-150 cursor-pointer hover:opacity-80"
      >
        <CloudDownload className="size-[30px] bg-tertiary text-primary-foreground rounded-full p-[4px]" />
        <strong className="text-sm font-medium text-primary-text">
          {downloadText}
        </strong>
      </label>
      {isDownloading && (
        <>
          <div className="relative mx-[4px] mb-[6px] w-[50px] h-[50px]">
            {/* Background Circle */}
            <svg
              className="absolute transform rotate-90"
              width="50"
              height="50"
            >
              <circle
                cx="25"
                cy="25"
                r="22"
                stroke="rgba(200, 200, 200, 0.2)"
                strokeWidth="5"
                fill="none"
              />
            </svg>

            {/* Progress Circle */}
            <svg
              className="absolute transform rotate-90"
              width="50"
              height="50"
            >
              <circle
                cx="25"
                cy="25"
                r="22"
                stroke="#34D399" // Adjust to match your desired color (primary/tertiary)
                strokeWidth="5"
                fill="none"
                strokeDasharray="138.2" // Circumference of the smaller circle (2 * PI * radius)
                strokeDashoffset={138.2 - (138.2 * downloadProgress) / 100} // Dynamically adjust stroke dashoffset based on progress
              />
            </svg>

            {/* Text inside circle */}
            <div className="absolute text-primary text-[11px] font-semibold top-0 bottom-0 left-0 flex items-center justify-center w-full h-full">
              {downloadProgress}%
            </div>
          </div>
          <h1
            onClick={cancelDownload}
            className="rtl:text-[14px] ltr:text-[12px] font-semibold shadow-lg cursor-pointer hover:shadow bg-red-500 px-1 rounded-md text-white "
          >
            {cancelText}
          </h1>
        </>
      )}
    </>
  );
};
