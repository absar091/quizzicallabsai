import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function addWatermarkToPdf(pdfBytes: Uint8Array, userPlan: string): Promise<Uint8Array> {
  // Only add watermark for free users
  if (userPlan === 'Pro') {
    return pdfBytes;
  }

  try {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const watermarkText = 'Generated with Quizzicallabs AI - Free Version';
    const fontSize = 10;
    const textColor = rgb(0.7, 0.7, 0.7); // Light gray

    pages.forEach((page) => {
      const { width, height } = page.getSize();
      
      // Add watermark at bottom center
      page.drawText(watermarkText, {
        x: (width - font.widthOfTextAtSize(watermarkText, fontSize)) / 2,
        y: 20,
        size: fontSize,
        font: font,
        color: textColor,
      });

      // Add diagonal watermark in center (light)
      page.drawText('QUIZZICALLABS AI - FREE', {
        x: width / 2 - 100,
        y: height / 2,
        size: 24,
        font: font,
        color: rgb(0.9, 0.9, 0.9), // Very light gray
        rotate: { angle: Math.PI / 6 }, // 30 degrees
      });
    });

    return await pdfDoc.save();
  } catch (error) {
    console.error('Error adding watermark:', error);
    // Return original PDF if watermarking fails
    return pdfBytes;
  }
}

export function shouldAddWatermark(userPlan: string): boolean {
  return userPlan !== 'Pro';
}