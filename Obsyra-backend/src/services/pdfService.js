const PDFDocument = require('pdfkit');

const generateInvoicePdf = async (orderData, userData) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            let pdfBuffer = Buffer.concat(buffers);
            resolve(pdfBuffer);
        });
        doc.on('error', reject);

        doc.fontSize(25).text('Factura de Compra', { align: 'center' });
        doc.moveDown();

        doc.fontSize(12).text(`Fecha: ${new Date(orderData.createdAt?._seconds * 1000 || Date.now()).toLocaleDateString()}`);
        doc.text(`Número de Pedido: ${orderData.orderId}`);
        doc.moveDown();

        doc.text(`Cliente: ${userData.displayName || userData.email || 'N/A'}`);
        doc.text(`Email: ${userData.email || 'N/A'}`);
        doc.moveDown();

        doc.fontSize(14).text('Detalles del Pedido:', { underline: true });
        doc.moveDown();

        const tableTop = doc.y;
        const itemX = 50;
        const qtyX = 300;
        const priceX = 380;
        const totalX = 470;

        doc.font('Helvetica-Bold').text('Producto', itemX, tableTop)
                                .text('Cantidad', qtyX, tableTop)
                                .text('Precio Unit.', priceX, tableTop)
                                .text('Total', totalX, tableTop);

        doc.font('Helvetica').lineCap('butt')
        .moveTo(itemX, tableTop + 20)
        .lineTo(doc.page.width - 50, tableTop + 20)
        .stroke();

        let currentY = tableTop + 35;

        orderData.items.forEach(item => {
            doc.text(item.name, itemX, currentY);
            doc.text(item.quantity.toString(), qtyX, currentY);
            doc.text(`$${item.price.toFixed(2)}`, priceX, currentY);
            doc.text(`$${(item.price * item.quantity).toFixed(2)}`, totalX, currentY);
            currentY += 20; 
        });
        doc.moveDown();

        doc.lineCap('butt')
        .moveTo(itemX, currentY)
        .lineTo(doc.page.width - 50, currentY)
        .stroke();
        doc.moveDown();

        doc.fontSize(16).text(`Total General: $${orderData.totalAmount ? orderData.totalAmount.toFixed(2) : '0.00'}`, { align: 'right' });
        doc.moveDown();

        if (orderData.shippingAddress) {
            doc.fontSize(12).text('Dirección de Envío:', { underline: true });
            doc.text(`${orderData.shippingAddress.line1 || ''}, ${orderData.shippingAddress.line2 || ''}`);
            doc.text(`${orderData.shippingAddress.city || ''}, ${orderData.shippingAddress.state || ''} ${orderData.shippingAddress.postal_code || ''}`);
            doc.text(`${orderData.shippingAddress.country || ''}`);
        }

        doc.fontSize(10).text('¡Gracias por tu confianza!', 50, doc.page.height - 50, { align: 'center' });

        doc.end();
    });
};

module.exports = { generateInvoicePdf };