import { HeaderSale } from "../../models/sale.view.type";
import { Company } from "@/modules/auth/models/login.domain.type";

const TICKET_WIDTH_PX = 302;

function escapeHtml(value: string | number): string {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export function generateTicket(adaptedData: HeaderSale, paymentTypeName: string, company: Company): void {
    const { header, details } = adaptedData;

    const rows = details.map((d) => {
        const lineTotal = d.cost * d.amount;
        return `
            <tr>
                <td>${escapeHtml(d.product)}</td>
                <td class="center">${d.amount}</td>
                <td class="right">${d.cost}</td>
                <td class="right">${lineTotal.toFixed(2)}</td>
            </tr>`;
    }).join('');

    const date = header.date.format('DD/MM/YYYY HH:mm');

    const ticketHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Ticket ${header.id}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @page { margin: 0; }
        @media print {
            body { width: ${TICKET_WIDTH_PX}px; }
        }
        body {
            font-family: 'Courier New', Courier, monospace;
            font-size: 11px;
            width: ${TICKET_WIDTH_PX}px;
            color: #000;
            padding: 8px;
        }
        h2 { text-align: center; font-size: 14px; margin-bottom: 4px; }
        p.center { text-align: center; }
        .divider {
            border-top: 1px dashed #000;
            margin: 6px 0;
        }
        table { width: 100%; border-collapse: collapse; }
        th { border-bottom: 1px solid #000; text-align: left; }
        td, th { padding: 2px 0; vertical-align: top; }
        .right { text-align: right; }
        .center { text-align: center; }
        .label { font-weight: bold; }
        .footer { text-align: center; margin-top: 8px; font-size: 11px; }
        .mt { margin-top: 4px; }
    </style>
</head>
<body>
    <h2>${escapeHtml(company.name)}</h2>
    <p class="center">${escapeHtml(company.address)}</p>
    <p class="center">Tel: ${escapeHtml(company.phone)}</p>
    <div class="divider"></div>
    <h2>Ticket de Venta</h2>
    <div class="divider"></div>
    <p>Venta No.: ${escapeHtml(header.id)}</p>
    <p>Fecha: ${escapeHtml(date)}</p>
    <p>Cliente: ${header.name ? escapeHtml(header.name) : 'Consumidor Final'}</p>
    ${header.nit ? `<p>NIT: ${escapeHtml(header.nit)}</p>` : ''}
    ${header.address ? `<p>Direccion: ${escapeHtml(header.address)}</p>` : ''}
    <div class="divider"></div>
    <table>
        <thead>
            <tr>
                <th>Producto</th>
                <th class="center">Cant</th>
                <th class="right">Precio</th>
                <th class="right">Total</th>
            </tr>
        </thead>
        <tbody>
            ${rows}
        </tbody>
    </table>
    <div class="divider"></div>
    <table>
        <tbody>
            <tr>
                <td class="label">TOTAL</td>
                <td class="right label">Q ${header.total}</td>
            </tr>
        </tbody>
    </table>
    <p class="mt">Tipo de pago: ${paymentTypeName ? escapeHtml(paymentTypeName) : '-'}</p>
    <div class="divider"></div>
    <p class="footer">Gracias por su compra</p>
    <script>
        window.onload = function () {
            window.focus();
            setTimeout(function () { window.print(); }, 300);
        };
    </script>
</body>
</html>`;

    const printWindow = window.open('', '_blank', `width=${TICKET_WIDTH_PX + 120},height=600`);
    if (!printWindow) {
        return;
    }
    printWindow.document.open();
    printWindow.document.write(ticketHtml);
    printWindow.document.close();
}