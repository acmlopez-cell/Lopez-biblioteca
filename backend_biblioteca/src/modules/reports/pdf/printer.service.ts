import { Injectable } from '@nestjs/common';
import pdfmake from 'pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { join } from 'path';

const fonts = {
  Roboto: {
    normal: join(process.cwd(), 'public/fonts/roboto/Roboto-Regular.ttf'),
    bold: join(process.cwd(), 'public/fonts/roboto/Roboto-Medium.ttf'),
    italics: join(process.cwd(), 'public/fonts/roboto/Roboto-Italic.ttf'),
    bolditalics: join(process.cwd(), 'public/fonts/roboto/Roboto-MediumItalic.ttf'),
  },
};

@Injectable()
export class PrinterService {
  constructor() {
    pdfmake.addFonts(fonts);
  }

  createPdf(docDefinition: TDocumentDefinitions) {
    return pdfmake.createPdf(docDefinition);
  }

  async createPdfBuffer(docDefinition: TDocumentDefinitions): Promise<Buffer> {
    return pdfmake.createPdf(docDefinition).getBuffer();
  }

  async createPdfStream(docDefinition: TDocumentDefinitions) {
    return pdfmake.createPdf(docDefinition).getStream();
  }
}
