import { Global, Module } from '@nestjs/common';
import { PdfController } from '@modules/reports/pdf/pdf.controller';
import { PdfService } from '@modules/reports/pdf/pdf.service';
import { PdfSql } from '@modules/reports/pdf/pdf.sql';
import { PrinterService } from '@modules/reports/pdf/printer.service';
import { coreProviders } from '@modules/core/core.provider';

@Global()
@Module({
  imports: [],
  controllers: [PdfController],
  providers: [...coreProviders, PdfService, PdfSql, PrinterService],
  exports: [PdfService],
})
export class PdfModule {}
