import { Controller, Get, Header, ParseUUIDPipe, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PdfService } from '@modules/reports/pdf/pdf.service';
import { PublicRoute } from '@auth/decorators';
import { Response } from 'express';

@ApiTags('Internal PDF Reports')
@Controller('reports/pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @PublicRoute()
  @Header('Content-Type', 'application/pdf')
  @Get('registration')
  async generateRegistration(@Res() response: Response, @Query('studentId') studentId: string) {
    const pdfBuffer = await this.pdfService.generateRegistration({
      type: 'pdf',
      studentId,
    });

    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader('Content-Disposition', 'inline; filename="registration-report.pdf"');
    response.setHeader('Content-Length', pdfBuffer.length);

    response.end(pdfBuffer);
  }
}
