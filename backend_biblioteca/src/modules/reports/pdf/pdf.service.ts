import { Inject, Injectable } from '@nestjs/common';
import { PrinterService } from './printer.service';
import { ConfigType } from '@nestjs/config';
import { envConfig } from '@config';
import { PdfSql } from '@modules/reports/pdf/pdf.sql';
import { registrationApplicationReport } from './templates/registration-application.report';

@Injectable()
export class PdfService {
  constructor(
    private readonly pdfSql: PdfSql,
    private readonly printerService: PrinterService,
    @Inject(envConfig.KEY) private configService: ConfigType<typeof envConfig>,
  ) {}

  async generateRegistration({
    type = 'buffer',
    studentId,
  }: {
    type?: string;
    studentId: string;
  }): Promise<Buffer> {
    const data: any = await this.pdfSql.findLatestRegistrationByStudent(studentId);

    try {
      if (type === 'buffer')
        return this.printerService.createPdfBuffer(registrationApplicationReport(data));
      else return await this.printerService.createPdfBuffer(registrationApplicationReport(data));
    } catch (error) {
      console.log(error);
      throw new Error();
    }
  }
}
