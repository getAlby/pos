import QRCode from "qrcode.react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function Share() {
  const [shareURI, setShareURI] = useState("");

  useEffect(() => {
    setShareURI(window.location.href.replace("/share", "/new"));
  }, [window.location]);

  return (
    <div className="flex gap-5 flex-col justify-center items-center">
      Let your co-workers scan this QR code
      <QRCode value={shareURI} size={256} />
      or share this URI with them:
      <input type="text" value={shareURI} className="input w-full max-w-xs" />
      <Link className="btn btn-primary w-full" to="../new">
        Back
      </Link>
    </div>
  );
}
