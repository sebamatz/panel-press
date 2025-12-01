import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { OrderRow } from '@/lib/stores/orderTableStore';
import { ColumnSchema } from '@/api/types';

interface GeneratePDFOptions {
  orders: OrderRow[];
  columnSchemas: ColumnSchema[];
  categoryName?: string;
  seriesName?: string;
}

/**
 * Formats a value for display in PDF
 */
function formatValue(value: any): string {
  if (value === null || value === undefined) return '';
  
  if (typeof value === 'object') {
    // Handle product objects
    if (value.name) return value.name;
    if (value.webName) return value.webName;
    if (value.sku) return value.sku;
    if (value.CODE) return value.CODE;
    // Handle dimension objects
    if (value.UTBL03) return value.UTBL03.toString();
    return JSON.stringify(value);
  }
  
  return String(value);
}

/**
 * Gets the display title for a column
 */
function getColumnTitle(column: ColumnSchema): string {
  return column.title || column.field.toUpperCase();
}

/**
 * Creates an HTML table element for rendering with Greek support
 */
function createTableHTML(
  orders: OrderRow[],
  columnSchemas: ColumnSchema[],
  hasPriceColumn: boolean,
  totalAmount: number,
  categoryName: string,
  seriesName: string
): string {
  const visibleColumns = columnSchemas.filter(
    col => col.field !== 'sku' && col.field !== 'actions'
  );
  
  const headers = visibleColumns.map(col => getColumnTitle(col));
  if (hasPriceColumn) {
    headers.push('Σύνολο');
  }
  
  const now = new Date();
  const dateStr = now.toLocaleDateString('el-GR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  let html = `
    <div style="font-family: 'Roboto', Arial, sans-serif; padding: 20px; background: white;">
      <h1 style="text-align: center; font-size: 18px; margin-bottom: 10px;">Πίνακας Παραγγελιών</h1>
  `;
  
  if (categoryName || seriesName) {
    html += `<div style="text-align: center; font-size: 12px; margin-bottom: 10px;">`;
    if (seriesName) html += `Σειρά: ${seriesName}`;
    if (categoryName && seriesName) html += ' | ';
    if (categoryName) html += `Κατηγορία: ${categoryName}`;
    html += `</div>`;
  }
  
  html += `<div style="font-size: 10px; margin-bottom: 15px;">Ημερομηνία: ${dateStr}</div>`;
  
  html += `
      <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
        <thead>
          <tr style="background-color: #428BCA; color: white;">
  `;
  
  headers.forEach(header => {
    html += `<th style="border: 1px solid #ddd; padding: 8px; text-align: left; font-weight: bold;">${header}</th>`;
  });
  
  html += `
          </tr>
        </thead>
        <tbody>
  `;
  
  orders.forEach((order, index) => {
    const bgColor = index % 2 === 0 ? '#ffffff' : '#f5f5f5';
    html += `<tr style="background-color: ${bgColor};">`;
    
    visibleColumns.forEach((col) => {
      const value = order[col.field];
      const displayValue = formatValue(value);
      // Escape HTML to prevent XSS and ensure proper rendering
      const escapedValue = displayValue
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
      html += `<td style="border: 1px solid #ddd; padding: 6px;">${escapedValue}</td>`;
    });
    
    if (hasPriceColumn) {
      const price = parseFloat(order.netamnt?.toString() || '0') || 0;
      const quantity = parseFloat(order.qty1?.toString() || order.quantity1?.toString() || '0') || 0;
      const rowTotal = price * quantity;
      html += `<td style="border: 1px solid #ddd; padding: 6px; text-align: right;">${rowTotal.toFixed(2)} €</td>`;
    }
    
    html += `</tr>`;
  });
  
  if (hasPriceColumn && totalAmount > 0) {
    html += `
          <tr style="background-color: #f0f0f0; font-weight: bold;">
            <td colspan="${headers.length - 1}" style="border: 1px solid #ddd; padding: 8px;"></td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">Σύνολο: ${totalAmount.toFixed(2)} €</td>
          </tr>
    `;
  }
  
  html += `
        </tbody>
      </table>
  `;
  
  if (hasPriceColumn && totalAmount > 0) {
    html += `
      <div style="text-align: center; font-size: 12px; font-weight: bold; margin-top: 15px;">
        Συνολικό Ποσό: ${totalAmount.toFixed(2)} € (χωρίς ΦΠΑ)
      </div>
    `;
  }
  
  html += `</div>`;
  
  return html;
}

/**
 * Generates a PDF document from order data
 */
export async function generateOrderPDF({ 
  orders, 
  columnSchemas, 
  categoryName = '',
  seriesName = '' 
}: GeneratePDFOptions): Promise<void> {
  if (orders.length === 0) {
    alert('Δεν υπάρχουν παραγγελίες για εξαγωγή σε PDF');
    return;
  }

  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const now = new Date();
  
  // Calculate totals
  const visibleColumns = columnSchemas.filter(
    col => col.field !== 'sku' && col.field !== 'actions'
  );
  const hasPriceColumn = visibleColumns.some(col => col.field === 'netamnt');
  let totalAmount = 0;
  
  if (hasPriceColumn) {
    orders.forEach((order) => {
      const price = parseFloat(order.netamnt?.toString() || '0') || 0;
      const quantity = parseFloat(order.qty1?.toString() || order.quantity1?.toString() || '0') || 0;
      totalAmount += price * quantity;
    });
  }
  
  // Create a temporary container for the table
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.width = '800px'; // A4 width in pixels at 96 DPI
  container.innerHTML = createTableHTML(orders, columnSchemas, hasPriceColumn, totalAmount, categoryName, seriesName);
  document.body.appendChild(container);
  
  try {
    // Convert table to canvas with Greek character support
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });
    
    // Remove temporary container
    document.body.removeChild(container);
    
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = pageWidth - (margin * 2);
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Add table image starting from top
    let yPosition = 10;
    let remainingHeight = imgHeight;
    const pageHeight = doc.internal.pageSize.getHeight();
    const maxHeight = pageHeight - yPosition - 30; // Leave space for footer
    
    if (remainingHeight <= maxHeight) {
      // Table fits on one page
      doc.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
      yPosition += imgHeight + 10;
    } else {
      // Table needs multiple pages
      let sourceY = 0;
      const sourceHeight = canvas.height;
      const sourceWidth = canvas.width;
      
      while (remainingHeight > 0) {
        const heightToAdd = Math.min(maxHeight, remainingHeight);
        const sourceYEnd = sourceY + (heightToAdd / imgHeight) * sourceHeight;
        
        // Create a temporary canvas for this page
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = sourceWidth;
        pageCanvas.height = sourceYEnd - sourceY;
        const ctx = pageCanvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(canvas, 0, sourceY, sourceWidth, sourceYEnd - sourceY, 0, 0, sourceWidth, sourceYEnd - sourceY);
          const pageImgData = pageCanvas.toDataURL('image/png');
          doc.addImage(pageImgData, 'PNG', margin, yPosition, imgWidth, heightToAdd);
        }
        
        remainingHeight -= heightToAdd;
        sourceY = sourceYEnd;
        
        if (remainingHeight > 0) {
          doc.addPage();
          yPosition = 20;
        }
      }
    }
    
    // Add page numbers (footer is already in the image)
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Σελίδα ${i} από ${pageCount}`,
        pageWidth - margin,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'right' }
      );
    }
    
    // Generate filename
    const timestamp = now.toISOString().split('T')[0];
    const filename = `Παραγγελία_${timestamp}.pdf`;
    
    // Save PDF
    doc.save(filename);
  } catch (error) {
    // Remove container if still exists
    if (container.parentNode) {
      document.body.removeChild(container);
    }
    console.error('Error generating PDF:', error);
    throw error;
  }
}

