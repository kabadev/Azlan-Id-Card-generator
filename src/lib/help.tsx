// utils/codeGenerators.js
import JsBarcode from "jsbarcode";
import QRCode from "qrcode";
import jsPDF from "jspdf";
import { format } from "date-fns";
export const generateBarcode = (text: any) => {
  const canvas = document.createElement("canvas");
  JsBarcode(canvas, text, { format: "CODE128", displayValue: false });
  return <img src={canvas.toDataURL()} alt="Barcode" />;
};

export const generateQRCode = async (text: any) => {
  const dataUrl = await QRCode.toDataURL(text, {
    margin: 0,
    // color: {
    //   dark: "#000000",
    //   light: "#0000",
    // },
  });

  return dataUrl;
};

export const generateBarcodeUrl = (text: string) => {
  const canvas = document.createElement("canvas");
  JsBarcode(canvas, text, {
    format: "CODE128",
    height: 80,
    width: 4,
    background: "transparent",
  });
  return canvas.toDataURL("image/png");
};

export const generateCardFront = async (rider: any) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  const width = 1400;
  const height = 880;
  canvas.width = width;
  canvas.height = height;

  // Draw background image
  const background = new Image();
  background.crossOrigin = "anonymous";
  background.src = "/idcardfrontbg.jpg";
  await new Promise((resolve) => {
    background.onload = () => {
      ctx.drawImage(background, 0, 0, width, height);
      resolve(null);
    };
  });

  // Add title

  ctx.fillStyle = "black";
  ctx.font = "bold 40px Arial";
  ctx.fillText(rider?.surName?.toUpperCase(), 400, 330);

  ctx.fillStyle = "black";
  ctx.font = "bold 40px Arial";
  ctx.fillText(rider?.firstName?.toUpperCase(), 410, 444);

  // middle name
  if (rider?.middleName) {
    ctx.fillStyle = "black";
    ctx.font = "bold 40px Arial";
    ctx.fillText(rider?.middleName?.toUpperCase(), 410, 570);
  }

  // SEX

  ctx.fillStyle = "black";
  ctx.font = "bold 40px Arial";
  ctx.fillText(rider?.sex?.toUpperCase(), 410, 690);

  // DoB
  if (rider?.dateOfBirth) {
    ctx.fillStyle = "black";
    ctx.font = "bold 40px Arial";
    ctx.fillText(format(new Date(rider?.dateOfBirth), "dd/MM/yyyy"), 840, 450);
  }

  // Dir

  ctx.fillStyle = "black";
  ctx.font = "bold 30px Arial";
  ctx.fillText(rider?.district?.toUpperCase(), 405, 840);

  // park
  ctx.fillStyle = "black";
  ctx.font = "bold 40px Arial";
  ctx.fillText(rider?.park?.toUpperCase(), 840, 575);

  // Expir

  ctx.fillStyle = "black";
  ctx.font = "bold  40px Arial";
  ctx.fillText("DEC. 2025", 830, 840);

  // Add barcode ID text
  ctx.fillStyle = "black";
  ctx.font = "bold 40px Arial";
  ctx.fillText(rider?.id?.toUpperCase(), 830, 700);

  // Generate and draw QR code
  if (rider?.id || rider?.firstName || rider?.park) {
    const qrCodeData = await generateQRCode(rider?.id);
    const qrCode = new Image();
    qrCode.crossOrigin = "anonymous";
    qrCode.src = qrCodeData;
    await new Promise((resolve) => {
      qrCode.onload = () => {
        const qrSize = 170;
        ctx.drawImage(qrCode, 1150, 680, qrSize, qrSize);
        resolve(null);
      };
    });
  }

  if (rider?.photo) {
    // Add student's photo with aspect ratio preserved
    const photo = new Image();
    photo.crossOrigin = "anonymous";
    photo.src = rider.photo;
    await new Promise((resolve) => {
      photo.onload = () => {
        const x = 60; // X coordinate
        const y = 250; // Y coordinate
        const width = 300; // Width of the bounding box
        const height = 350; // Height of the bounding box
        const borderRadius = 20; // Radius for rounded corners

        // Calculate the scaling and positioning to simulate "object-fit: cover"
        const imageAspectRatio = photo.width / photo.height;
        const boxAspectRatio = width / height;
        let drawWidth, drawHeight, offsetX, offsetY;

        if (imageAspectRatio > boxAspectRatio) {
          // Image is wider than the box
          drawHeight = height;
          drawWidth = height * imageAspectRatio;
          offsetX = (width - drawWidth) / 2;
          offsetY = 0;
        } else {
          // Image is taller than or equal to the box
          drawWidth = width;
          drawHeight = width / imageAspectRatio;
          offsetX = 0;
          offsetY = 0;
        }

        ctx.save();

        // Create a rounded rectangle path
        ctx.beginPath();
        ctx.moveTo(x + borderRadius, y);
        ctx.lineTo(x + width - borderRadius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + borderRadius);
        ctx.lineTo(x + width, y + height - borderRadius);
        ctx.quadraticCurveTo(
          x + width,
          y + height,
          x + width - borderRadius,
          y + height
        );
        ctx.lineTo(x + borderRadius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - borderRadius);
        ctx.lineTo(x, y + borderRadius);
        ctx.quadraticCurveTo(x, y, x + borderRadius, y);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(photo, offsetX + x, offsetY + y, drawWidth, drawHeight);

        // Restore the original state
        ctx.restore();

        resolve(null);
      };
    });

    // Add watermark photo
    ctx.globalAlpha = 0.3;
    const watermarkWidth = 156;
    const watermarkHeight = 160;

    // Calculate the center of the watermark
    const centerX = 1200 + watermarkWidth / 2;
    const centerY = 220 + watermarkHeight / 2;
    const radius = watermarkWidth / 2;

    // Begin a new path and create a circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.closePath();

    // Set the clipping region to the circle
    ctx.clip();

    // Draw the watermark within the circular clip
    ctx.drawImage(photo, 1200, 220, watermarkWidth, watermarkHeight);

    ctx.globalAlpha = 1.0;
  }
  return canvas.toDataURL("image/png");
};
export const generateCardBack = async (student: any) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  const width = 1400;
  const height = 880;
  canvas.width = width;
  canvas.height = height;

  // Draw background
  const background = new Image();
  background.src = "/idback.jpg";
  await new Promise((resolve) => {
    background.onload = () => {
      ctx.drawImage(background, 0, 0, width, height);
      resolve(null);
    };
  });
  return canvas.toDataURL("image/png");
};

export const generateExCardFront = async (rider: any) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  const width = 880;
  const height = 1400;
  canvas.width = width;
  canvas.height = height;

  // Draw background image
  const background = new Image();
  background.crossOrigin = "anonymous";
  background.src = "/IdcardP.jpg";
  await new Promise((resolve) => {
    background.onload = () => {
      ctx.drawImage(background, 0, 0, width, height);
      resolve(null);
    };
  });

  // Add title

  ctx.fillStyle = "black";
  ctx.font = "bold 30px Arial";
  ctx.fillText(rider?.surName?.toUpperCase(), 35, 920);

  ctx.fillStyle = "black";
  ctx.font = "bold 30px Arial";
  ctx.fillText(rider?.firstName?.toUpperCase(), 430, 920);

  // middle name
  if (rider?.middleName) {
    ctx.fillStyle = "black";
    ctx.font = "bold 30px Arial";
    ctx.fillText(rider?.middleName?.toUpperCase(), 35, 1030);
  }

  // SEX

  ctx.fillStyle = "black";
  ctx.font = "bold 30px Arial";
  ctx.fillText(rider?.sex?.toUpperCase(), 430, 1020);

  // DoB
  if (rider?.dateOfBirth) {
    ctx.fillStyle = "black";
    ctx.font = "bold 30px Arial";
    ctx.fillText(format(new Date(rider?.dateOfBirth), "dd/MM/yyyy"), 430, 1125);
  }

  // Dir

  ctx.fillStyle = "black";
  ctx.font = "bold 30px Arial";
  ctx.fillText(rider?.designation?.toUpperCase(), 35, 1130);

  // park
  // ctx.fillStyle = "black";
  // ctx.font = "bold 30px Arial";
  // ctx.fillText(rider?.park?.toUpperCase(), 840, 575);

  // Expir

  ctx.fillStyle = "black";
  ctx.font = "bold  30px Arial";
  ctx.fillText("DEC. 2025", 40, 1240);

  // Add barcode ID text
  ctx.fillStyle = "black";
  ctx.font = "bold 30px Arial";
  ctx.fillText(rider?.id?.toUpperCase(), 430, 1240);

  // Generate and draw QR code
  if (rider?.id || rider?.firstName || rider?.park) {
    const qrCodeData = await generateQRCode(rider?.id);
    const qrCode = new Image();
    qrCode.crossOrigin = "anonymous";
    qrCode.src = qrCodeData;
    await new Promise((resolve) => {
      qrCode.onload = () => {
        const qrSize = 150;
        ctx.drawImage(qrCode, 680, 1100, qrSize, qrSize);
        resolve(null);
      };
    });
  }

  if (rider?.photo) {
    // Add student's photo with aspect ratio preserved
    const photo = new Image();
    photo.crossOrigin = "anonymous";
    photo.src = rider.photo;
    await new Promise((resolve) => {
      photo.onload = () => {
        const x = 310; // X coordinate
        const y = 460; // Y coordinate
        const width = 350; // Width of the bounding box
        const height = 350; // Height of the bounding box
        const borderRadius = 20; // Radius for rounded corners

        // Calculate the scaling and positioning to simulate "object-fit: cover"
        const imageAspectRatio = photo.width / photo.height;
        const boxAspectRatio = width / height;
        let drawWidth, drawHeight, offsetX, offsetY;

        if (imageAspectRatio > boxAspectRatio) {
          // Image is wider than the box
          drawHeight = height;
          drawWidth = height * imageAspectRatio;
          offsetX = (width - drawWidth) / 2;
          offsetY = 0;
        } else {
          // Image is taller than or equal to the box
          drawWidth = width;
          drawHeight = width / imageAspectRatio;
          offsetX = 0;
          offsetY = 0;
        }

        ctx.save();

        // Create a rounded rectangle path
        ctx.beginPath();
        ctx.moveTo(x + borderRadius, y);
        ctx.lineTo(x + width - borderRadius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + borderRadius);
        ctx.lineTo(x + width, y + height - borderRadius);
        ctx.quadraticCurveTo(
          x + width,
          y + height,
          x + width - borderRadius,
          y + height
        );
        ctx.lineTo(x + borderRadius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - borderRadius);
        ctx.lineTo(x, y + borderRadius);
        ctx.quadraticCurveTo(x, y, x + borderRadius, y);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(photo, offsetX + x, offsetY + y, drawWidth, drawHeight);

        // Restore the original state
        ctx.restore();

        resolve(null);
      };
    });

    // Add watermark photo
    ctx.globalAlpha = 0.3;
    const watermarkWidth = 156;
    const watermarkHeight = 160;

    // Calculate the center of the watermark
    const centerX = 60 + watermarkWidth / 2;
    const centerY = 420 + watermarkHeight / 2;
    const radius = watermarkWidth / 2;

    // Begin a new path and create a circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.closePath();

    // Set the clipping region to the circle
    ctx.clip();

    // Draw the watermark within the circular clip
    ctx.drawImage(photo, 60, 420, watermarkWidth, watermarkHeight);

    ctx.globalAlpha = 1.0;
  }
  return canvas.toDataURL("image/png");
};
export const generateExCardBack = async (student: any) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  const width = 1400;
  const height = 880;
  canvas.width = width;
  canvas.height = height;

  // Draw background
  const background = new Image();
  background.src = "/pback.jpg";
  await new Promise((resolve) => {
    background.onload = () => {
      ctx.drawImage(background, 0, 0, width, height);
      resolve(null);
    };
  });
  return canvas.toDataURL("image/png");
};

const now = new Date();
const timestamp =
  now.getFullYear() +
  "-" +
  (now.getMonth() + 1).toString().padStart(2, "0") +
  "-" +
  now.getDate().toString().padStart(2, "0") +
  "_" +
  now.getHours().toString().padStart(2, "0") +
  "-" +
  now.getMinutes().toString().padStart(2, "0") +
  "-" +
  now.getSeconds().toString().padStart(2, "0");

export const saveSingleIDCard = async (
  frontImage: string,
  backImage: string,
  name: string,
  type: string,
  frontPImage?: string,
  backPmage?: string
) => {
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "in",
    format: [3.375, 2.125],
  });

  // Add the front image to the first page
  pdf.addImage(frontImage!, "PNG", 0, 0, 3.375, 2.125);
  // pdf.addPage();
  // pdf.addImage(backImage, "PNG", 0, 0, 1400, 880);

  if (type !== "General") {
    pdf.addPage([3.375, 2.125], "l");
    pdf.addImage(
      frontPImage!,
      "PNG",
      3.375,
      -1.25,
      2.125,
      3.375,
      undefined,
      "NONE",
      90
    );
    // pdf.addPage([880, 1400], "p");
    // pdf.addImage(backPmage!, "PNG", 0, 0, 880, 1400);
  }
  // Save the PDF
  pdf.save(name + "ID_Card.pdf");
};

export const printSingleIDCard = async (
  frontImage: string,
  backImage: string,
  name: string,
  type: string,
  frontPImage?: string,
  backPmage?: string
) => {
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "in",
    format: [3.375, 2.125],
  });

  // Add the front image to the first page
  pdf.addImage(frontImage!, "PNG", 0, 0, 3.375, 2.125);
  // pdf.addPage();
  // pdf.addImage(backImage, "PNG", 0, 0, 1400, 880);

  if (type !== "General") {
    pdf.addPage([3.375, 2.125], "l");
    pdf.addImage(
      frontPImage!,
      "PNG",
      3.375,
      -1.25,
      2.125,
      3.375,
      undefined,
      "NONE",
      90
    );

    // pdf.addPage([880, 1400], "p");
    // pdf.addImage(backPmage!, "PNG", 0, 0, 880, 1400);
  }

  // Open PDF in a new tab and trigger print
  const pdfBlob = pdf.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const newWindow = window.open(pdfUrl);

  if (newWindow) {
    newWindow.onload = () => {
      newWindow.print();
      // printWindow.document.close();
      // printWindow.focus();
      // printWindow.print();
      // printWindow.close();
    };
  }
};
export const saveBatchIDCards = async (
  idCards: {
    front: string;
    back: string;
    type: string;
    frontP?: string;
    backP?: string;
  }[]
) => {
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "in",
    format: [3.375, 2.125],
  });

  idCards.forEach((card, index) => {
    if (card.type === "Executive") {
      pdf.addImage(
        card.frontP!,
        "PNG",
        3.375,
        -1.25,
        2.125,
        3.375,
        undefined,
        "NONE",
        90
      );
      // pdf.addPage([880, 1400], "portrait");
      // pdf.addImage(card.backP!, "PNG", 0, 0, 880, 1400);
    }
    pdf.addPage();
    pdf.addImage(card.front, "PNG", 0, 0, 3.375, 2.125);

    // pdf.addPage([1400, 880], "landscape");
    // pdf.addImage(card.back, "PNG", 0, 0, 1400, 880);
  });

  pdf.save("Batch_ID_Cards_" + timestamp + ".pdf");
};

export const printBatchIDCards = async (
  idCards: {
    front: string;
    back: string;
    type: string;
    frontP?: string;
    backP?: string;
  }[]
) => {
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "in",
    format: [3.375, 2.125],
  });

  idCards.forEach((card, index) => {
    if (card.type === "Executive") {
      pdf.addImage(
        card.frontP!,
        "PNG",
        3.375,
        -1.25,
        2.125,
        3.375,
        undefined,
        "NONE",
        90
      );
      // pdf.addPage([880, 1400], "portrait");
      // pdf.addImage(card.backP!, "PNG", 0, 0, 880, 1400);
    }
    pdf.addPage();
    pdf.addImage(card.front, "PNG", 0, 0, 3.375, 2.125);

    // pdf.addPage([1400, 880], "landscape");
    // pdf.addImage(card.back, "PNG", 0, 0, 1400, 880);
  });

  const pdfBlob = pdf.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const newWindow = window.open(pdfUrl);

  if (newWindow) {
    newWindow.onload = () => {
      newWindow.print();
    };
  }
};

export const resizeImage = (
  file: File,
  maxWidth: number,
  maxHeight: number
) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject("Could not get canvas context");
          return;
        }

        // Calculate new dimensions
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          } else {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to a base64 string
        resolve(canvas.toDataURL("image/png"));
      };

      img.onerror = (err) => reject(err);
    };

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};
export const dataURLtoBlob = (dataURL: string) => {
  const parts = dataURL.split(",");
  const mime = parts[0].match(/:(.*?);/)?.[1] || "";
  const binary = atob(parts[1]);
  const array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], { type: mime });
};
