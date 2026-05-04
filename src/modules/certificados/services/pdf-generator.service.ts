import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import * as QRCode from 'qrcode';

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
  qrDataURL?: string;
  outputPath: string;
}

@Injectable()
export class PdfGeneratorService {
  /**
   * Generar código QR como Data URL
   */
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

  /**
   * Convertir archivo local a Data URL base64
   */
  private convertirADataURL(rutaArchivo: string): string {
    if (!rutaArchivo) return '';

    // Si ya es una URL http/https o data URL, devolverla tal cual
    if (
      rutaArchivo.startsWith('http') ||
      rutaArchivo.startsWith('data:')
    ) {
      return rutaArchivo;
    }

    // Construir ruta absoluta desde la carpeta public
    const rutaAbsoluta = path.join(process.cwd(), 'public', rutaArchivo);

    console.log(`📁 Convirtiendo archivo: ${rutaAbsoluta}`);

    if (!fs.existsSync(rutaAbsoluta)) {
      console.error(`❌ Archivo no encontrado: ${rutaAbsoluta}`);
      return '';
    }

    try {
      const buffer = fs.readFileSync(rutaAbsoluta);
      const extension = path.extname(rutaAbsoluta).substring(1);
      const mimeType = this.obtenerMimeType(extension);
      const base64 = buffer.toString('base64');

      console.log(`✅ Archivo convertido (${buffer.length} bytes)`);
      return `data:${mimeType};base64,${base64}`;
    } catch (error) {
      console.error(`❌ Error al convertir archivo: ${error.message}`);
      return '';
    }
  }

  /**
   * Obtener MIME type por extensión
   */
  private obtenerMimeType(extension: string): string {
    const mimeTypes: Record<string, string> = {
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      gif: 'image/gif',
      svg: 'image/svg+xml',
      webp: 'image/webp',
    };

    return mimeTypes[extension.toLowerCase()] || 'image/png';
  }

  /**
   * Generar certificado PDF
   */
  async generarCertificadoPDF(params: ParametrosPDF): Promise<void> {
    const {
      plantillaFondo,
      logoEmpresa,
      logos,
      firmas,
      datos,
      codigo,
      outputPath,
    } = params;

    let browser: puppeteer.Browser | null = null;

    try {
      // Generar QR code
      let qrDataURL = params.qrDataURL;
      if (!qrDataURL) {
        qrDataURL = await this.generarQR(codigo);
      }

      // Lanzar navegador
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();

      // Configurar viewport para A4 landscape
      await page.setViewport({
        width: 1122, // A4 landscape en píxeles a 96 DPI
        height: 794,
      });

      // Procesar texto del cuerpo con variables
      let cuerpoFinal = datos.cuerpo
        .replace(/\{nombre\}/gi, datos.nombre)
        .replace(/\{curso\}/gi, datos.curso)
        .replace(/\{fecha\}/gi, datos.fecha)
        .replace(/\{horas\}/gi, datos.horas || '');

      // Limitar longitud del texto
      const MAX_CARACTERES = 300;
      const esTextoLargo = cuerpoFinal.length > 200;

      if (cuerpoFinal.length > MAX_CARACTERES) {
        cuerpoFinal = cuerpoFinal.substring(0, MAX_CARACTERES) + '...';
      }

      const claseTexto = esTextoLargo ? 'cuerpo texto-largo' : 'cuerpo';

      // Convertir imágenes a Data URLs
      const fondoDataURL = this.convertirADataURL(plantillaFondo);
      const logoDataURL = logoEmpresa ? this.convertirADataURL(logoEmpresa) : '';

      // Convertir logos a Data URLs
      const logosDataURL: { url: string; posicion: 1 | 2 | 3 }[] = [];
      if (logos && logos.length > 0) {
        for (const logo of logos) {
          const logoBase64 = this.convertirADataURL(logo.url);
          if (logoBase64) {
            logosDataURL.push({ url: logoBase64, posicion: logo.posicion });
          }
        }
      }

      // Convertir firmas a Data URLs
      const firmasDataURL: { nombre: string; cargo: string; url: string }[] = [];
      if (firmas && firmas.length > 0) {
        for (const firma of firmas) {
          const firmaBase64 = this.convertirADataURL(firma.firmaUrl);
          if (firmaBase64) {
            firmasDataURL.push({
              nombre: firma.nombre,
              cargo: firma.cargo,
              url: firmaBase64,
            });
          }
        }
      }

      // Generar HTML del certificado
      const html = this.generarHTMLCertificado({
        fondoDataURL,
        logoDataURL,
        logosDataURL,
        firmasDataURL,
        datos,
        cuerpoFinal,
        claseTexto,
        codigo,
        qrDataURL,
      });

      // Cargar contenido HTML
      await page.setContent(html, { waitUntil: 'networkidle0' });

      // Asegurar que el directorio de salida existe
      const directorioSalida = path.dirname(outputPath);
      if (!fs.existsSync(directorioSalida)) {
        fs.mkdirSync(directorioSalida, { recursive: true });
      }

      // Generar PDF
      await page.pdf({
        path: outputPath,
        format: 'A4',
        landscape: true,
        printBackground: true,
        margin: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
      });

      console.log(`✅ PDF generado exitosamente: ${outputPath}`);
    } catch (error) {
      console.error('❌ Error al generar PDF:', error);
      throw error;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  /**
   * Generar HTML del certificado
   */
  private generarHTMLCertificado(params: {
    fondoDataURL: string;
    logoDataURL: string;
    logosDataURL: { url: string; posicion: 1 | 2 | 3 }[];
    firmasDataURL: { nombre: string; cargo: string; url: string }[];
    datos: DatosPDF;
    cuerpoFinal: string;
    claseTexto: string;
    codigo: string;
    qrDataURL: string;
  }): string {
    const {
      fondoDataURL,
      logoDataURL,
      logosDataURL,
      firmasDataURL,
      datos,
      cuerpoFinal,
      claseTexto,
      codigo,
      qrDataURL,
    } = params;

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      width: 297mm;
      height: 210mm;
      position: relative;
      font-family: 'Arial', 'Helvetica', sans-serif;
      overflow: hidden;
    }

    .fondo {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: 0;
    }

    .contenido {
      position: relative;
      z-index: 1;
      width: 100%;
      height: 100%;
      padding: 35px 80px 30px 80px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .logo-izquierda {
      position: absolute;
      top: 20px;
      left: 60px;
      width: 180px;
      height: 120px;
      object-fit: contain;
    }

    .logo-derecha {
      position: absolute;
      top: 20px;
      right: 60px;
      width: 180px;
      height: 120px;
      object-fit: contain;
    }

    .logo-centro {
      position: absolute;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      width: 180px;
      height: 120px;
      object-fit: contain;
    }

    .centro {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 40px 100px 0 100px;
      margin-top: -10px;
    }

    .titulo {
      font-size: 32px;
      font-weight: bold;
      color: #1a365d;
      margin-bottom: 20px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }

    .nombre {
      font-size: 42px;
      font-weight: bold;
      color: #0f172a;
      margin: 15px 0 20px 0;
      font-family: 'Georgia', 'Times New Roman', serif;
      line-height: 1.2;
      max-width: 900px;
    }

    .cuerpo {
      font-size: 20px;
      color: #475569;
      line-height: 1.6;
      max-width: 880px;
      margin: 15px 0 20px 0;
    }

    .cuerpo.texto-largo {
      font-size: 18px;
      line-height: 1.5;
    }

    .curso {
      font-size: 22px;
      font-style: italic;
      color: #1e40af;
      margin: 15px 0 0 0;
      font-family: 'Georgia', 'Times New Roman', serif;
      line-height: 1.3;
      max-width: 800px;
    }

    .pie {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding: 0 50px;
      margin-bottom: 10px;
    }

    .datos {
      font-size: 16px;
      color: #64748b;
      line-height: 1.4;
    }

    .qr-container {
      position: absolute;
      bottom: 40px;
      right: 70px;
      text-align: center;
    }

    .qr {
      width: 100px;
      height: 100px;
      margin-bottom: 6px;
    }

    .codigo {
      font-size: 9px;
      color: #94a3b8;
      font-family: 'Courier New', monospace;
      word-break: break-all;
      max-width: 110px;
    }

    .footer-text {
      position: absolute;
      bottom: 10px;
      left: 0;
      right: 0;
      text-align: center;
      font-size: 10px;
      color: #9ca3af;
    }

    .firmas-container {
      position: absolute;
      bottom: 75px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      justify-content: center;
      gap: 100px;
      width: 90%;
      max-width: 800px;
    }

    /* 1 firma: centrada */
    .firmas-container.firmas-1 {
      max-width: 200px;
    }

    /* 2 firmas: espaciadas */
    .firmas-container.firmas-2 {
      justify-content: space-between;
      max-width: 500px;
      gap: 150px;
    }

    /* 3 firmas: distribuidas */
    .firmas-container.firmas-3 {
      justify-content: space-between;
      max-width: 750px;
      gap: 80px;
    }

    .firma-item {
      text-align: center;
      flex: 0 0 auto;
      width: 180px;
    }

    .firma-imagen {
      width: 160px;
      height: 60px;
      object-fit: contain;
      object-position: center bottom;
      margin-bottom: -12px;
      display: block;
      margin-left: auto;
      margin-right: auto;
    }

    .firma-linea {
      border-top: 1.5px solid #475569;
      width: 100%;
      margin-bottom: 3px;
    }

    .firma-nombre {
      font-size: 11px;
      font-weight: bold;
      color: #1e293b;
      margin-bottom: 2px;
    }

    .firma-cargo {
      font-size: 9px;
      color: #64748b;
      font-style: italic;
    }
  </style>
</head>
<body>
  ${fondoDataURL ? `<img src="${fondoDataURL}" class="fondo" alt="Fondo">` : ''}

  <div class="contenido">
    ${logoDataURL ? `<img src="${logoDataURL}" class="logo" alt="Logo">` : ''}
    ${logosDataURL
      .map((logo) => {
        const clase =
          logo.posicion === 1
            ? 'logo-izquierda'
            : logo.posicion === 2
            ? 'logo-derecha'
            : 'logo-centro';
        return `<img src="${logo.url}" class="${clase}" alt="Logo ${logo.posicion}">`;
      })
      .join('')}

    <div class="centro">
      <div class="titulo">${datos.titulo}</div>
      <div class="nombre">${datos.nombre}</div>
      <div class="${claseTexto}">${cuerpoFinal}</div>
      <div class="curso">"${datos.curso}"</div>
    </div>

    <div class="pie">
      <div class="datos">
        <div>Fecha: ${datos.fecha}</div>
        ${datos.horas ? `<div>Duración: ${datos.horas} horas</div>` : ''}
      </div>
    </div>

    <div class="qr-container">
      <img src="${qrDataURL}" class="qr" alt="QR">
      <div class="codigo">${codigo}</div>
    </div>

    ${
      firmasDataURL.length > 0
        ? `
    <div class="firmas-container firmas-${firmasDataURL.length}">
      ${firmasDataURL
        .map(
          (firma) => `
        <div class="firma-item">
          <img src="${firma.url}" class="firma-imagen" alt="Firma ${firma.nombre}">
          <div class="firma-linea"></div>
          <div class="firma-nombre">${firma.nombre}</div>
          <div class="firma-cargo">${firma.cargo}</div>
        </div>
      `,
        )
        .join('')}
    </div>
    `
        : ''
    }

    <div class="footer-text">
      Certificado generado por SYNAP - Sistema de Certificación
    </div>
  </div>
</body>
</html>
    `;
  }
}
