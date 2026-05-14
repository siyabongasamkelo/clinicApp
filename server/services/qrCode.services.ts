// services/QrService.ts
import QRCode from "qrcode";
import logger from "../utils/logger.js";

export class QrService {
  public static async generateClinicQr(clinicId: string): Promise<string> {
    const payload = `impilo://check-in/${clinicId}`;

    const options: QRCode.QRCodeToDataURLOptions = {
      errorCorrectionLevel: "H",
      margin: 1,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    };

    logger.info(`Qr code generated successfuly for clinic: ${clinicId}`);
    return await QRCode.toDataURL(payload, options);
  }
}
