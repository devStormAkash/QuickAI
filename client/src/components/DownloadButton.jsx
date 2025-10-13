import { DownloadIcon } from "lucide-react";

export const  DownloadButton = ({ url, filename = "aiimage.jpg" }) =>{
  // Convert URL to force download via Cloudinary
  const getDownloadUrl = (url) => {
    // Insert fl_attachment after /upload/
    return url.replace("/upload/", "/upload/fl_attachment/");
  };

  return (
    <a href={getDownloadUrl(url)} download={filename}>
      <DownloadIcon />
    </a>
  );
}

