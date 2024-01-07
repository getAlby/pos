import QRCode from "qrcode.react";
import { useEffect, useState } from "react";
import { Backbar } from "../../components/Backbar";

export function Share() {
  const [shareURI, setShareURI] = useState("");

  useEffect(() => {
    setShareURI(window.location.href.replace("/share", "/new"));
  }, []);

  return (
    <>
      <Backbar />
      <div className="flex flex-grow gap-5 flex-col justify-center items-center">
        Let your co-workers scan this QR code
        <QRCode value={shareURI} size={256} />
        or share this URI with them:
        <input
          type="text"
          value={shareURI}
          className="input input-bordered overflow-ellipsis w-full max-w-xs"
        />
      </div>
    </>
  );
}
