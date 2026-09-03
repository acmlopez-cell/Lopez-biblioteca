import { Content, StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';
import { backgroundDefault } from './layouts/background_default';

export const registrationApplicationReport = (data: any): TDocumentDefinitions => {
  return {
    pageOrientation: 'portrait',
    pageSize: 'A4',
    pageMargins: [40, 120, 40, 60],

    content: [
      buildHeader(),
      buildStudentInformation(data),
      buildSubjectsTable(data),
      buildFooterInfo(),
    ],

    background: backgroundDefault(),
    styles: styles,
  };
};

export const styles: StyleDictionary = {
  headerDate: {
    fontSize: 10,
    alignment: 'right',
    margin: [0, 0, 0, 20],
  },
  title: {
    fontSize: 14,
    bold: true,
    alignment: 'center',
    margin: [0, 0, 0, 20],
  },
  infoText: {
    fontSize: 11,
    margin: [0, 3, 0, 3],
  },
  boldText: {
    bold: true,
  },
  tableHeader: {
    fontSize: 9,
    bold: true,
    fillColor: '#E5E7EB',
    alignment: 'center',
    margin: [10, 5, 10, 5],
  },
  tableText: {
    fontSize: 9,
    alignment: 'center',
    margin: [10, 5, 10, 5],
  },
  noteText: {
    fontSize: 9,
    bold: true,
    margin: [0, 30, 0, 10],
  },
  footerContact: {
    fontSize: 9,
    alignment: 'center',
    color: '#4B5563',
    margin: [0, 10, 0, 0],
  }
};

const buildHeader = (): Content => {
  const dateOptions: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
  const formattedDate = new Date().toLocaleDateString('es-ES', dateOptions);

  return {
    stack: [
      {
        text: `Quito, ${formattedDate}`,
        style: 'headerDate',
      },
      {
        text: 'REPORTE DE MATRÍCULA',
        style: 'title',
      },
    ],
  };
};

const buildStudentInformation = (data: any): Content => {
  const student = data.registration?.student?.user || {};
  const career = data.registration?.career || {};
  const period = data.registration?.schoolPeriod || {};

  return {
    stack: [
      {
        text: [
          { text: 'Nombre: ', style: 'boldText' },
          `${student.name || ''} ${student.lastname || ''}`
        ],
        style: 'infoText'
      },
      {
        text: [
          { text: 'Cedula: ', style: 'boldText' },
          `${student.identification || ''}`
        ],
        style: 'infoText'
      },
      {
        text: [
          { text: 'Carrera: ', style: 'boldText' },
          `${career.name || ''}` 
        ],
        style: 'infoText'
      },
      {
        text: [
          { text: 'Ciclo: ', style: 'boldText' },
          `${period.name || ''}`
        ],
        style: 'infoText',
        margin: [0, 0, 0, 20] 
      },
    ],
  };
};

const buildSubjectsTable = (data: any): Content => {
  const details = data.registration?.enrollmentDetails || [];
  const enrollment = data.registration;

  return {
    table: {
      headerRows: 1,
      widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto'],
      body: [
        [
          { text: 'Código', style: 'tableHeader' },
          { text: 'Asignatura', style: 'tableHeader' },
          { text: 'Nivel', style: 'tableHeader' },
          { text: 'Num. Matr.', style: 'tableHeader' },
          { text: 'Paralelo', style: 'tableHeader' },
          { text: 'Horario', style: 'tableHeader' },
          { text: 'Estado', style: 'tableHeader' },
        ],
        ...details.map((detail: any) => [
          { text: detail.subject?.code, style: 'tableText' }, 
          { text: detail.subject?.name, style: 'tableText' },
          { text: enrollment.academicPeriod?.name , style: 'tableText' },
          { text: detail.number.toString(), style: 'tableText' },
          { text: enrollment.parallel?.name, style: 'tableText' }, 
          { text: enrollment.workday?.name , style: 'tableText' }, 
          { text: enrollment.enrollmentStates?.[0]?.state?.name, style: 'tableText' },
        ]),
      ],
    },
    layout: 'lightHorizontalLines', 
  };
};

const buildFooterInfo = (): Content => ({
  stack: [
    {
      text: 'NOTA: ESTE DOCUMENTO ES ÚNICAMENTE INFORMATIVO, NO TIENE NINGUNA VALIDEZ LEGAL',
      style: 'noteText',
    },
    {
      text: 'Dir. García Moreno S4-35 y Ambato, TELF: +593 99 550 6245 MAIL: yavirac@yavirac.edu.ec\nwww.yavirac.edu.ec / @yavirac.edu.ec',
      style: 'footerContact',
    },
  ],
});