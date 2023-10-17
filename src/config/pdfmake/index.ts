import * as PdfPrinter from 'pdfmake';
import * as pdf from 'pdfmake';
import * as PdfPrinter from 'pdfmake';




const pdfMake = require('pdfmake/build/pdfmake');
const pdfFonts = require('pdfmake/build/vfs_fonts');
const PdfPrinter = require('pdfmake');

const COLORS = {
  black: '#000000',
  white: '#FFFFFF',
  gold: '#CBA45C',
};

const fonts = {
  Roboto: {
    normal: 'fonts/Roboto-Regular.ttf',
    bold: 'fonts/Roboto-Medium.ttf',
    italics: 'fonts/Roboto-Italic.ttf',
    bolditalics: 'fonts/Roboto-MediumItalic.ttf',
  },
};

const printer = new PdfPrinter(fonts);

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const styles = {
  background(currentPage, { width: w, height: h }) {
    return {
      canvas: [
        {
          type: 'rect',
          x: 0,
          y: 0,
          w,
          h,
          color: COLORS.white,
        },
      ],
    };
  },
  defaultStyle: {
    color: COLORS.black,
  },
  styles: {
    speakerName: {
      color: COLORS.black,
      fontWeight: 600,
      fontSize: 22,
      textTransform: 'uppercase',
      marginBottom: 5,
      bold: true,
      marginTop: 40,
    },
    speakerNameFirst: {
      color: COLORS.black,
      fontWeight: 600,
      fontSize: 22,
      textTransform: 'uppercase',
      marginBottom: 5,
      bold: true,
    },
    courseTitle: {
      textTransform: 'uppercase',
      color: COLORS.black,
      fontSize: 17,
      marginBottom: 30,
      bold: true,
    },
    lessonNumber: {
      fontSize: 17,
      fontFamily: 'Circe',
      marginBottom: 30,
      marginTop: 30,
      bold: true,
    },
    time: {
      fontSize: 15,
      marginBottom: 5,
    },
    text: {
      fontSize: 15,
      marginBottom: 20,
    },
  },
};

module.exports = {
  printer,
  pdfMake,
  styles,
};
