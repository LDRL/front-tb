import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import type { Content } from "pdfmake/build/pdfmake";
import { HeaderSale } from "../../models/sale.view.type";
import { Company } from "@/modules/auth/models/login.domain.type";

pdfMake.addVirtualFileSystem(pdfFonts);

const COLORS = {
    header: '#bcbebf',
    border: '#444',
    text: '#222',
    muted: '#666'
};

function money(value: number | string): string {
  return `Q ${Number(value).toFixed(2)}`;
}

export function generateQuotePdf(adaptedData: HeaderSale, paymentTypeName: string, company: Company): void {
    const { header, details } = adaptedData;

    const body: Content[][] = details.map((d) => [
        { text: d.product },
        { text: String(d.amount), alignment: 'center' },
        { text: money(d.cost), alignment: 'right' },
        { text: money(d.cost * d.amount), alignment: 'right' },
    ]);

    const date = header.date.format('DD/MM/YYYY HH:mm');

    const content: Content[] = [
        { text: company.name, alignment: 'center', fontSize: 16, bold: true, marginBottom: 2 },
        { text: company.address, alignment: 'center', fontSize: 10, color: COLORS.muted },
        { text: `Tel: ${company.phone}`, alignment: 'center', fontSize: 10, color: COLORS.muted, marginBottom: 14 },
        { text: `COTIZACIÓN No. ${header.id}`, alignment: 'center', fontSize: 13, bold: true, marginBottom: 12 },
        { text: `Fecha: ${date}`, fontSize: 10, marginBottom: 2 },
        { text: `Cliente: ${header.name ? header.name : 'Consumidor Final'}`, fontSize: 10, marginBottom: 2 },
        ...(header.nit ? [{ text: `NIT: ${header.nit}`, fontSize: 10, marginBottom: 2 }] : []),
        ...(header.address ? [{ text: `Direccion: ${header.address}`, fontSize: 10, marginBottom: 2 }] : []),
        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: COLORS.border }], margin: [0, 10, 0, 6] },
        {
            table: {
                headerRows: 1,
                widths: ['*', 'auto', 'auto', 'auto'],
                body: [
                    [
                        { text: 'Producto', bold: true, fillColor: COLORS.header },
                        { text: 'Cant', bold: true, alignment: 'center', fillColor: COLORS.header },
                        { text: 'Precio', bold: true, alignment: 'right', fillColor: COLORS.header },
                        { text: 'Total', bold: true, alignment: 'right', fillColor: COLORS.header },
                    ],
                    ...body,
                    [
                        { text: 'TOTAL', bold: true, colSpan: 3, alignment: 'right' },
                        '',
                        '',
                        { text: money(header.total), bold: true, alignment: 'right' },
                    ],
                ],
            },
            layout: {
                hLineWidth: (i, node) => (i === 0 || i === node.table.body.length ? 1 : 0.5),
                vLineWidth: () => 0,
                hLineColor: () => COLORS.border,
                paddingTop: () => 6,
                paddingBottom: () => 6,
            }
        },
        { text: `Tipo de pago: ${paymentTypeName ? paymentTypeName : '-'}`, fontSize: 10, margin: [0, 10, 0, 0] },
        { text: 'Gracias por su confianza', alignment: 'center', fontSize: 11, margin: [0, 18, 0, 0] },
    ];

    const docDefinition = {
        pageSize: 'LETTER' as const,
        pageMargins: [40, 40, 40, 40] as [number, number, number, number],
        defaultStyle: {
            font: 'Roboto',
            fontSize: 11,
            color: COLORS.text
        },
        content
    };

    pdfMake.createPdf(docDefinition).download(`Cotizacion_${header.id}.pdf`);
}