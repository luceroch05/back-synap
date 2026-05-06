import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as QRCode from 'qrcode';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const PDFDocument = require('pdfkit');

export interface DatosPDF {
  titulo: string;
  nombre: string;
  curso: string;
  fecha: string;
  horas?: string;
  cuerpo: string;
}

export interface LogoPDF {
  url: string;
  posicion: 1 | 2 | 3; // 1: Izquierda, 2: Derecha, 3: Centro
}

export interface FirmaPDF {
  nombre: string;
  cargo: string;
  firmaUrl: string;
}

export interface ParametrosPDF {
  plantillaFondo: string;
  logoEmpresa?: string;
  logos?: LogoPDF[];
  firmas?: FirmaPDF[];
  datos: DatosPDF;
  codigo: string;
  codigoTexto?: string;
  qrDataURL?: string;
  outputPath: string;
}

// Escala: el viewport HTML era 1122px x 794px mapeado a A4 landscape (841.89 x 595.28 pt)
// 1px CSS = 0.75pt
const PX = 0.75;

@Injectable()
export class PdfGeneratorService {
  async generarQR(texto: string): Promise<string> {
    try {
      return await QRCode.toDataURL(texto, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        width: 200,
      });
    } catch (error) {
      console.error('Error al generar QR:', error);
      throw error;
    }
  }

  private convertirABuffer(rutaOUrl: string): Buffer | null {
    if (!rutaOUrl) return null;

    if (rutaOUrl.startsWith('data:')) {
      const parts = rutaOUrl.split(',');
      if (parts.length < 2) return null;
      return Buffer.from(parts[1], 'base64');
    }

    if (rutaOUrl.startsWith('http')) return null;

    const rutaAbsoluta = path.join(process.cwd(), 'public', rutaOUrl);
    if (!fs.existsSync(rutaAbsoluta)) {
      console.error(`❌ Archivo no encontrado: ${rutaAbsoluta}`);
      return null;
    }

    try {
      return fs.readFileSync(rutaAbsoluta);
    } catch (error) {
      console.error(`❌ Error al leer archivo: ${error.message}`);
      return null;
    }
  }

  async generarCertificadoPDF(params: ParametrosPDF): Promise<void> {
    const { plantillaFondo, logos, firmas, datos, codigo, codigoTexto, outputPath } = params;
    const codigoMostrar = codigoTexto ?? codigo;

    const directorioSalida = path.dirname(outputPath);
    if (!fs.existsSync(directorioSalida)) {
      fs.mkdirSync(directorioSalida, { recursive: true });
    }

    let qrDataURL = params.qrDataURL;
    if (!qrDataURL) {
      qrDataURL = await this.generarQR(codigo);
    }

    let cuerpoFinal = datos.cuerpo
      .replace(/\{nombre\}/gi, datos.nombre)
      .replace(/\{curso\}/gi, datos.curso)
      .replace(/\{fecha\}/gi, datos.fecha)
      .replace(/\{horas\}/gi, datos.horas || '');

    if (cuerpoFinal.length > 300) {
      cuerpoFinal = cuerpoFinal.substring(0, 300) + '...';
    }

    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          layout: 'landscape',
          margin: 0,
          info: { Title: datos.titulo, Author: 'SYNAP' },
        });

        const writeStream = fs.createWriteStream(outputPath);
        doc.pipe(writeStream);

        // A4 landscape en puntos (72 dpi)
        const W = 841.89;
        const H = 595.28;

        // ── FONDO ──────────────────────────────────────────────────────
        const fondoBuffer = this.convertirABuffer(plantillaFondo);
        if (fondoBuffer) {
          doc.image(fondoBuffer, 0, 0, { width: W, height: H });
        }

        // ── LOGOS (absolutos: top:20px, left/right:60px, 180x120px) ───
        // CSS: top:20px→15pt, w:180px→135pt, h:120px→90pt
        const LOGO_W = 180 * PX;  // 135pt
        const LOGO_H = 120 * PX;  // 90pt
        const LOGO_Y = 20 * PX;   // 15pt
        const LOGO_SIDE = 60 * PX; // 45pt desde los bordes

        if (logos && logos.length > 0) {
          for (const logo of logos) {
            const buf = this.convertirABuffer(logo.url);
            if (!buf) continue;
            let x: number;
            if (logo.posicion === 1) x = LOGO_SIDE;
            else if (logo.posicion === 2) x = W - LOGO_W - LOGO_SIDE;
            else x = (W - LOGO_W) / 2;
            doc.image(buf, x, LOGO_Y, { fit: [LOGO_W, LOGO_H] });
          }
        }

        // ── CONTENIDO CENTRAL ─────────────────────────────────────────
        // El "centro" CSS es flex con justify-content:center en el área:
        //   y desde ~49pt hasta ~531pt (disponible: ~482pt)
        // Calculamos alturas reales para centrar verticalmente

        // Font sizes: CSS px * 0.75
        const tituloSize = 32 * PX;   // 24pt
        const nombreSize = 42 * PX;   // 31.5pt
        const esTextoLargo = cuerpoFinal.length > 200;
        const cuerpoSize = (esTextoLargo ? 18 : 20) * PX; // 13.5pt o 15pt
        const cursoSize = 22 * PX;    // 16.5pt

        // Ancho disponible para textos (contenido padding 80px + centro padding 100px = 180px cada lado)
        const textWidth = W - 2 * (80 + 100) * PX; // ~570pt

        // Calcular alturas de cada bloque
        doc.font('Helvetica-Bold').fontSize(tituloSize);
        const tituloH = doc.heightOfString(datos.titulo, { width: textWidth });

        doc.font('Times-Roman').fontSize(nombreSize);
        const nombreH = doc.heightOfString(datos.nombre, { width: textWidth, lineGap: 2 });

        doc.font('Helvetica').fontSize(cuerpoSize);
        const cuerpoH = doc.heightOfString(cuerpoFinal, { width: textWidth, lineGap: 4 });

        doc.font('Times-Italic').fontSize(cursoSize);
        const cursoStr = `"${datos.curso}"`;
        const cursoH = doc.heightOfString(cursoStr, { width: textWidth, lineGap: 2 });

        // Márgenes entre elementos (CSS margins convertidos)
        const mTituloBottom = 20 * PX;  // 15pt
        const mNombreTop = 15 * PX;     // 11.25pt
        const mNombreBottom = 20 * PX;  // 15pt
        const mCuerpoTop = 15 * PX;     // 11.25pt
        const mCuerpoBottom = 20 * PX;  // 15pt
        const mCursoTop = 15 * PX;      // 11.25pt

        const blockHeight =
          tituloH + mTituloBottom +
          mNombreTop + nombreH + mNombreBottom +
          mCuerpoTop + cuerpoH + mCuerpoBottom +
          mCursoTop + cursoH;

        // Área vertical disponible para el centro
        const centroAreaTop = (35 - 10 + 40) * PX;  // 48.75pt
        const centroAreaBottom = H - (22.5 + 42);    // ~531pt
        const centroAreaH = centroAreaBottom - centroAreaTop; // ~482pt

        // Y de inicio del bloque de texto (centrado verticalmente)
        let currentY = centroAreaTop + (centroAreaH - blockHeight) / 2;
        if (currentY < centroAreaTop) currentY = centroAreaTop;

        const textX = (80 + 100) * PX; // ~135pt desde el borde

        // Título
        doc.font('Helvetica-Bold')
          .fontSize(tituloSize)
          .fillColor('#1a365d')
          .text(datos.titulo, textX, currentY, { width: textWidth, align: 'center', characterSpacing: 1.1 });
        currentY += tituloH + mTituloBottom;

        // Nombre
        currentY += mNombreTop;
        doc.font('Times-Roman')
          .fontSize(nombreSize)
          .fillColor('#0f172a')
          .text(datos.nombre, textX, currentY, { width: textWidth, align: 'center', lineGap: 2 });
        currentY += nombreH + mNombreBottom;

        // Cuerpo
        currentY += mCuerpoTop;
        doc.font('Helvetica')
          .fontSize(cuerpoSize)
          .fillColor('#475569')
          .text(cuerpoFinal, textX, currentY, { width: textWidth, align: 'center', lineGap: 4 });
        currentY += cuerpoH + mCuerpoBottom;

        // Curso
        currentY += mCursoTop;
        doc.font('Times-Italic')
          .fontSize(cursoSize)
          .fillColor('#1e40af')
          .text(cursoStr, textX, currentY, { width: textWidth, align: 'center', lineGap: 2 });

        // ── PIE: FECHA Y HORAS ────────────────────────────────────────
        // CSS: .pie padding 0 50px, margin-bottom 10px, align flex-end
        // .datos font-size 16px, color #64748b
        const pieX = (80 + 50) * PX;   // contenido padding + pie padding = 97.5pt
        const pieSize = 16 * PX;        // 12pt
        const pieY = H - (22.5 + 10 * PX + pieSize * 1.4 * 2); // ~537pt
        doc.font('Helvetica')
          .fontSize(pieSize)
          .fillColor('#64748b')
          .text(`Fecha: ${datos.fecha}`, pieX, pieY);
        if (datos.horas) {
          doc.text(`Duración: ${datos.horas} horas`, pieX, pieY + pieSize * 1.4);
        }

        // ── QR (absoluto: bottom:40px, right:70px, 100x100px) ─────────
        const QR_SIZE = 100 * PX;       // 75pt
        const qrX = W - 70 * PX - QR_SIZE;  // ~714pt
        const qrY2 = H - 40 * PX - QR_SIZE; // ~490pt
        const qrBuffer = this.convertirABuffer(qrDataURL);
        if (qrBuffer) {
          doc.image(qrBuffer, qrX, qrY2, { width: QR_SIZE, height: QR_SIZE });
        }
        // Código bajo el QR
        doc.font('Courier')
          .fontSize(9 * PX)
          .fillColor('#94a3b8')
          .text(codigoMostrar, qrX - 4, qrY2 + QR_SIZE + 6 * PX, {
            width: QR_SIZE + 10 * PX,
            align: 'center',
          });

        // ── FIRMAS (absoluto: bottom:75px) ────────────────────────────
        // firma-item width 180px→135pt, firma-imagen 160x60px→120x45pt
        if (firmas && firmas.length > 0) {
          const SIG_ITEM_W = 180 * PX;   // 135pt
          const SIG_IMG_W = 160 * PX;    // 120pt
          const SIG_IMG_H = 60 * PX;     // 45pt
          const SIG_OVERLAP = 12 * PX;   // margin-bottom -12px de la imagen
          const sigBottom = 75 * PX;     // 56.25pt desde abajo

          // gaps según cantidad de firmas (CSS)
          let gap: number;
          if (firmas.length === 1) gap = 0;
          else if (firmas.length === 2) gap = 150 * PX; // 112.5pt
          else gap = 80 * PX;                            // 60pt

          const totalW = firmas.length * SIG_ITEM_W + (firmas.length - 1) * gap;

          // Altura total del bloque firma
          const lineH = 1.5;
          const nameSize = 11 * PX;    // ~8pt
          const cargoSize = 9 * PX;    // ~6.75pt
          const firmaBlockH = SIG_IMG_H - SIG_OVERLAP + lineH + 3 + nameSize * 1.3 + cargoSize * 1.3;

          const firmasTopY = H - sigBottom - firmaBlockH;
          let sigX = (W - totalW) / 2;

          for (const firma of firmas) {
            const firmaBuffer = this.convertirABuffer(firma.firmaUrl);
            const imgX = sigX + (SIG_ITEM_W - SIG_IMG_W) / 2;
            if (firmaBuffer) {
              doc.image(firmaBuffer, imgX, firmasTopY, { fit: [SIG_IMG_W, SIG_IMG_H] });
            }

            // Línea separadora
            const lineY = firmasTopY + SIG_IMG_H - SIG_OVERLAP;
            doc.moveTo(sigX, lineY)
              .lineTo(sigX + SIG_ITEM_W, lineY)
              .strokeColor('#475569')
              .lineWidth(1.5)
              .stroke();

            // Nombre
            doc.font('Helvetica-Bold')
              .fontSize(nameSize)
              .fillColor('#1e293b')
              .text(firma.nombre, sigX, lineY + 3, { width: SIG_ITEM_W, align: 'center' });

            // Cargo
            doc.font('Helvetica-Oblique')
              .fontSize(cargoSize)
              .fillColor('#64748b')
              .text(firma.cargo, sigX, lineY + 3 + nameSize * 1.3, { width: SIG_ITEM_W, align: 'center' });

            sigX += SIG_ITEM_W + gap;
          }
        }

        // ── FOOTER TEXT (absoluto: bottom:10px) ──────────────────────
        doc.font('Helvetica')
          .fontSize(10 * PX)
          .fillColor('#9ca3af')
          .text('Certificado generado por SYNAP - Sistema de Certificación', 0, H - 10 * PX - 10, {
            width: W,
            align: 'center',
          });

        doc.end();

        writeStream.on('finish', () => {
          console.log(`✅ PDF generado: ${outputPath}`);
          resolve();
        });
        writeStream.on('error', reject);
      } catch (error) {
        console.error('❌ Error al generar PDF:', error);
        reject(error);
      }
    });
  }
}
