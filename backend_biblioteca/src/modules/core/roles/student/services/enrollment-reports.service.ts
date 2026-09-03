import { Injectable, Res } from '@nestjs/common';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { EnrollmentSqlService } from './enrollment-sql.service';
// import PDFDocument from 'pdfkit-table-ts';
const { PDFDocument } = require('pdfkit-table-ts');
// const blobStream = require('blob-stream');
@Injectable()
export class EnrollmentReportsService {
  private imageHeaderPath = './resources/images/reports/header.png';
  private imageFooterPath = `./resources/images/reports/footer.png`;
  private background = `./resources/images/reports/background_v.png`;
  private imageHeaderWidth = 110;
  private imageHeaderHeight = 80;

  constructor(private readonly enrollmentSqlService: EnrollmentSqlService) {}

  //report application
  async generateEnrollmentApplication(@Res() res: Response, id: string) {
    const enrollment = await this.enrollmentSqlService.findEnrollmentCertificateByEnrollment(id);

    const doc = new PDFDocument({
      size: 'A4',
      bufferPages: true,
      align: 'center',
    });

    doc.pipe(res);
    const textX = 50;
    const textY = 80;
    const textW = 500;

    // Tamaño de la página
    const width = doc.page.width;
    const height = doc.page.height;

    // Dibujar como fondo
    doc.image(this.background, 0, 0, {
      width: width,
      height: height,
    });

    const text = `Nombre: ${enrollment.student.user.name} ${enrollment.student.user.lastname}; Cedula: ${enrollment.student.user.identification}; Carrera: ${enrollment.career.name}; Ciclo: ${enrollment.schoolPeriod.name}.`;
    const currentDate = new Date();
    const day = format(currentDate, 'd', { locale: es }); // Formato numérico del día
    const formattedDate = format(currentDate, "dd 'de' MMMM 'de' yyyy", { locale: es });
    const fechaCompleta = `${formattedDate.replace('dd', day)}`;
    //Inicio del Documento
    doc.image(this.imageHeaderPath, 35, 20, {
      align: 'center',
      width: this.imageHeaderWidth,
      height: this.imageHeaderHeight,
    });

    doc.moveDown();
    doc.font('Times-Roman');
    doc.fontSize(11);
    doc.text(`Quito, ${fechaCompleta}`, textX + 320);
    doc.moveDown(2);
    doc
      .font('Helvetica-Bold')
      .fontSize(18)
      .text('REPORTE DE MATRÍCULA', textX + 100);
    doc.moveDown();

    doc.font('Times-Roman');
    doc.fontSize(11);
    doc.lineGap(7);
    doc.text(
      `Nombre: ${enrollment.student.user.name} ${enrollment.student.user.lastname}`,
      textX,
      textY + 80,
    );
    doc.text(`Cedula: ${enrollment.student.user.identification}`, textX, textY + 95);
    doc.text(`Carrera: ${enrollment.career.name}`, textX, textY + 110);
    doc.text(`Ciclo: ${enrollment.schoolPeriod.name}`, textX, textY + 125);
    doc.moveDown(2);

    const rows: (string | number)[][] = [];

    enrollment.enrollmentDetails.forEach((enrollmentDetail) => {
      const list = [
        enrollmentDetail.subject.code,
        enrollmentDetail.subject.name,
        enrollmentDetail.subject.academicPeriod.name,
        enrollmentDetail.number,
        enrollmentDetail.parallel.name,
        enrollmentDetail.workday.name,
        enrollmentDetail.enrollmentDetailStates[0].state.name,
      ];
      rows.push(list);
    });

    const table = {
      headers: ['Código', 'Asignatura', 'Nivel', 'Num.', 'Paralelo', 'Horario', 'Estado'],
      rows: rows,
    };

    await doc.table(table, { align: 'center', columnsSize: [60, 220, 60, 30, 40, 50] });

    doc.moveDown();
    doc.font('Times-Roman');
    doc.fontSize(11);
    doc.text(
      `NOTA: ESTE DOCUMENTO ES ÚNICAMENTE INFORMATIVO, NO TIENE NINGUNA VALIDEZ LEGAL`,
      textX,
      textY + 560,
    );

    //Footer: Add page number
    const oldBottomMargin = doc.page.margins.bottom;
    doc.page.margins.bottom = 0; //Dumb: Have to remove bottom margin in order to write into it

    doc
      .fontSize('6')
      .text(
        `Dir. García Moreno S4-35 y Ambato, TELF: +593 99 550 6245 MAIL: yavirac@yavirac.edu.ec`,
        50,
        doc.page.height - oldBottomMargin / 2 - 20,
        {
          align: 'center',
        },
      );

    doc.end();
  }
}
