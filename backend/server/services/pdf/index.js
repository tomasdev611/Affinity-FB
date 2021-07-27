var PDFImage = require('pdf-image').PDFImage;

export class PdfToImageService {
  static async generateImageFromPDF(filePath, outputDirectory) {
    try {
      var pdfImage = new PDFImage(filePath, {
        graphicsMagick: true,
        combinedImage: true,
        outputDirectory,
        convertOptions: {
          '-compress': 'JPEG',
          '-density': '150x150'
        }
      });

      const imagePaths = await pdfImage.convertFile();
      return imagePaths;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

// PdfToImageService.generateImageFromPDF(
//   '/Volumes/WORK/Projects/RomanEspana/affapi/tmp/AS_Staff_Assignment_Sheet_2019.pdf'
// );
