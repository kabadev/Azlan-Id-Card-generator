// utils/codeGenerators.js
import JsBarcode from "jsbarcode";
import QRCode from "qrcode";
import jsPDF from "jspdf";

export const generateBarcode = (text: any) => {
  const canvas = document.createElement("canvas");
  JsBarcode(canvas, text, { format: "CODE128", displayValue: false });
  return <img src={canvas.toDataURL()} alt="Barcode" />;
};

export const generateQRCode = async (text: any) => {
  const dataUrl = await QRCode.toDataURL(text, {
    margin: 0,
    color: {
      dark: "#000000",
      light: "#0000",
    },
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
  background.src = "/frontbg.png";
  await new Promise((resolve) => {
    background.onload = () => {
      ctx.drawImage(background, 0, 0, width, height);
      resolve(null);
    };
  });

  // Add title
  ctx.fillStyle = "white";
  ctx.font = "bold 50px Arial";
  ctx.textAlign = "center";
  ctx.fillText("SIERRA LEONE COMMERCIAL BIKE RIDERS", width / 2, 80);

  ctx.font = "32px Arial";
  ctx.fillText("IDENTIFICATION CARD", width / 2, 140);

  // Add labels and details
  ctx.textAlign = "left";
  ctx.fillStyle = "#4B5563";
  ctx.font = "35px Arial";
  ctx.fillText("Surname:", 60, 280);

  ctx.fillStyle = "black";
  ctx.font = "bold 40px Arial";
  ctx.fillText(rider.surname, 60, 324);

  // middle name
  if (rider.middleName) {
    ctx.textAlign = "left";
    ctx.fillStyle = "#4B5563";
    ctx.font = "35px Arial";
    ctx.fillText("Middle name:", 500, 280);

    ctx.fillStyle = "black";
    ctx.font = "bold 40px Arial";
    ctx.fillText(rider.middleName, 500, 324);
  }

  // Sex
  ctx.fillStyle = "#4B5563";
  ctx.font = "32px Arial";
  ctx.fillText("First Name:", 60, 400);

  ctx.fillStyle = "black";
  ctx.font = "bold 40px Arial";
  ctx.fillText(rider.firstName, 60, 444);

  // SEX
  ctx.fillStyle = "#4B5563";
  ctx.font = "32px Arial";
  ctx.fillText("Sex", 60, 520);

  ctx.fillStyle = "black";
  ctx.font = "bold 40px Arial";
  ctx.fillText(rider.sex, 60, 564);

  // DoB
  ctx.textAlign = "left";
  ctx.fillStyle = "#4B5563";
  ctx.font = "35px Arial";
  ctx.fillText("Date of Birth:", 500, 520);

  ctx.fillStyle = "black";
  ctx.font = "bold 40px Arial";
  ctx.fillText(rider.dateOfBirth, 500, 564);

  // Dir
  ctx.textAlign = "left";
  ctx.fillStyle = "#4B5563";
  ctx.font = "35px Arial";
  ctx.fillText("District:", 60, 640);

  ctx.fillStyle = "black";
  ctx.font = "bold 40px Arial";
  ctx.fillText(rider.district, 60, 684);

  // park
  ctx.textAlign = "left";
  ctx.fillStyle = "#4B5563";
  ctx.font = "35px Arial";
  ctx.fillText("Park:", 500, 640);

  ctx.fillStyle = "black";
  ctx.font = "bold 40px Arial";
  ctx.fillText(rider.park, 500, 684);

  // Expir
  ctx.textAlign = "left";
  ctx.fillStyle = "#4B5563";
  ctx.font = "35px Arial";
  ctx.fillText("Date of Expiry:", 1000, 800);

  ctx.fillStyle = "black";
  ctx.font = "bold  40px Arial";
  ctx.fillText("10-11-2028", 1000, 844);

  // Add student's photo with aspect ratio preserved
  const photo = new Image();
  photo.src = rider.photo;
  await new Promise((resolve) => {
    photo.onload = () => {
      const maxPhotoWidth = 456;
      const maxPhotoHeight = 360;
      let photoWidth = photo.naturalWidth;
      let photoHeight = photo.naturalHeight;

      // Calculate scaled dimensions
      if (photoWidth > maxPhotoWidth || photoHeight > maxPhotoHeight) {
        const aspectRatio = photoWidth / photoHeight;
        if (photoWidth > maxPhotoWidth) {
          photoWidth = maxPhotoWidth;
          photoHeight = photoWidth / aspectRatio;
        }
        if (photoHeight > maxPhotoHeight) {
          photoHeight = maxPhotoHeight;
          photoWidth = photoHeight * aspectRatio;
        }
      }

      const photoX = 900 + (maxPhotoWidth - photoWidth) / 2;
      const photoY = 230 + (maxPhotoHeight - photoHeight) / 2;

      ctx.drawImage(photo, photoX, photoY, photoWidth, photoHeight);
      resolve(null);
    };
  });

  // Add watermark photo
  ctx.globalAlpha = 0.2;
  const watermarkWidth = 156;
  const watermarkHeight = 160;
  ctx.drawImage(photo, 500, 330, watermarkWidth, watermarkHeight);
  ctx.globalAlpha = 1.0;

  // Add registrar's signature
  // const signature = new Image();
  // signature.src = "/sign.png";
  // await new Promise((resolve) => {
  //   signature.onload = () => {
  //     ctx.drawImage(signature, 60, 730, 156, 160);
  //     resolve(null);
  //   };
  // });

  // ctx.fillStyle = "#4B5563";
  // ctx.font = "32px Arial";
  // ctx.fillText("Registrar", 60, 750);

  // Add barcode
  const barcode = new Image();
  barcode.src = generateBarcodeUrl(rider.id); // Function to generate the barcode URL
  await new Promise((resolve) => {
    barcode.onload = () => {
      const barcodeWidth = 300; // Adjust width as needed
      const barcodeHeight = 100; // Adjust height as needed
      ctx.drawImage(barcode, 980, 650, barcodeWidth, barcodeHeight);
      resolve(null);
    };
  });

  // Add barcode ID text
  ctx.fillStyle = "black";
  ctx.font = "40px Arial";
  ctx.fillText(`ID: ${rider.id}`, 950, 645);

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
  background.src = "/backbg1.png";
  await new Promise((resolve) => {
    background.onload = () => {
      ctx.drawImage(background, 0, 0, width, height);
      resolve(null);
    };
  });

  // Add top text
  ctx.fillStyle = "white";
  ctx.font = "40px Arial";
  ctx.textAlign = "center";
  ctx.fillText(
    "This ID Card is the property of Example University.",
    width / 2,
    150
  );
  ctx.fillText(
    "If found, please return or contact us on +23278-123-456",
    width / 2,
    200
  );

  // Generate and draw QR code
  const qrCodeData = await generateQRCode(student.id);
  const qrCode = new Image();
  qrCode.src = qrCodeData;
  await new Promise((resolve) => {
    qrCode.onload = () => {
      const qrSize = 300;
      ctx.drawImage(qrCode, width / 2 - qrSize / 2, 370, qrSize, qrSize);
      resolve(null);
    };
  });

  // Add barcode
  const barcode = new Image();
  barcode.src = generateBarcodeUrl(student.id);
  await new Promise((resolve) => {
    barcode.onload = () => {
      const barcodeWidth = 500;
      const barcodeHeight = 100;
      ctx.drawImage(
        barcode,
        width / 2 - barcodeWidth / 2,
        750,
        barcodeWidth,
        barcodeHeight
      );
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
  name: string
) => {
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [1400, 880],
  });

  // Add the front image to the first page
  pdf.addImage(frontImage, "PNG", 0, 0, 1400, 880);
  pdf.addPage();

  // Add the back image to the second page
  pdf.addImage(backImage, "PNG", 0, 0, 1400, 880);

  // Save the PDF
  pdf.save(name + "ID_Card.pdf");
};

export const saveBatchIDCards = async (
  idCards: { front: string; back: string }[]
) => {
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [1400, 880],
  });

  idCards.forEach((card, index) => {
    if (index !== 0) pdf.addPage();
    pdf.addImage(card.front, "PNG", 0, 0, 1400, 880);
    pdf.addPage();
    pdf.addImage(card.back, "PNG", 0, 0, 1400, 880);
  });

  pdf.save("Batch_ID_Cards_" + timestamp + ".pdf");
};

export const printSingleIDCard = async (
  frontImage: string,
  backImage: string
): Promise<void> => {
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [1400, 880],
  });

  pdf.addImage(frontImage, "PNG", 0, 0, 1400, 880);
  pdf.addPage();
  pdf.addImage(backImage, "PNG", 0, 0, 1400, 880);

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

export const printBatchIDCards = async (
  idCards: { front: string; back: string }[]
): Promise<void> => {
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [1400, 880],
  });

  idCards.forEach((card, index) => {
    if (index !== 0) pdf.addPage();
    pdf.addImage(card.front, "PNG", 0, 0, 1400, 880);
    pdf.addPage();
    pdf.addImage(card.back, "PNG", 0, 0, 1400, 880);
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
