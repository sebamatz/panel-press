import { OrderRow } from '@/lib/stores/orderTableStore';
import { ColumnSchema } from '@/api/types';
import { ColorSelectionState } from '@/lib/stores/types';

interface GeneratePDFOptions {
  orders: OrderRow[];
  columnSchemas: ColumnSchema[];
  categoryName?: string;
  seriesName?: string;
  categoryImageUrl?: string;
  colorSelection?: Partial<ColorSelectionState>;
}

/**
 * Formats a value for display
 */
function formatValue(value: any): string {
  if (value === null || value === undefined) return '';
  
  if (typeof value === 'object') {
    if (value.name) return value.name;
    if (value.webName) return value.webName;
    if (value.sku) return value.sku;
    if (value.CODE) return value.CODE;
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
 * Formats color selection information for display
 */
function formatColorSelection(colorSelection?: Partial<ColorSelectionState>): string {
  if (!colorSelection) return '';
  
  let html = '<div style="margin-bottom: 20px; padding: 15px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 5px;">';
  html += '<h3 style="font-size: 14px; font-weight: bold; margin-bottom: 10px; color: #333;">Επιλογή χρώματος</h3>';
  
  const profilColors = colorSelection.profilColors;
  if (profilColors) {
    let colorOption = '';
    if (profilColors === '1') colorOption = 'Λευκό';
    else if (profilColors === '2') colorOption = 'Χρώμα';
    else if (profilColors === '3') colorOption = 'Δυχρωμία';
    
    if (colorOption) {
      html += `<div style="margin-bottom: 8px;"><strong>Επιλογή:</strong> ${colorOption}</div>`;
    }
  }
  
  const colorSelectionState = colorSelection.colorSelectionState || [];
  const colorCompanies = colorSelection.colorCompanies || [];
  const colorTypes = colorSelection.colorTypes || [];
  
  colorSelectionState.forEach((item, index) => {
    if (!item) return;
    
    const isSecondary = index === 1;
    const title = isSecondary ? 'Πίσω πλευρά' : 'Μροστά πλευρά';
    
    html += `<div style="margin-top: 15px; padding: 10px; background-color: white; border-left: 3px solid #428BCA;">`;
    html += `<strong style="font-size: 12px;">${title}</strong>`;
    
    if (item.selectedColorCompany !== null && item.selectedColorCompany !== undefined) {
      const company = colorCompanies.find((c: any) => 
        c.trdr === item.selectedColorCompany || c.id === item.selectedColorCompany
      );
      if (company) {
        const companyName = (company as any).name || (company as any).code || '';
        html += `<div style="margin-top: 5px; font-size: 11px;"><strong>Επιλογή Βαφείου:</strong> ${companyName}</div>`;
      }
    }
    
    if (item.selectedTrdpgroup === 1) {
      if (item.colorType) {
        const colorType = colorTypes.find(ct => ct.id.toString() === item.colorType || ct.name === item.colorType);
        if (colorType) {
          html += `<div style="margin-top: 5px; font-size: 11px;"><strong>Τύπος Χρώματος:</strong> ${colorType.name}</div>`;
        } else if (item.colorType) {
          html += `<div style="margin-top: 5px; font-size: 11px;"><strong>Τύπος Χρώματος:</strong> ${item.colorType}</div>`;
        }
      }
      
      if (item.selectedManifacturer) {
        html += `<div style="margin-top: 5px; font-size: 11px;"><strong>Επιλογή Κατασκευαστή:</strong> ${item.selectedManifacturer}</div>`;
      }
      
      if (item.colorValue) {
        html += `<div style="margin-top: 5px; font-size: 11px;"><strong>Επιλογή Χρώματος:</strong> ${item.colorValue}</div>`;
      }
    } else {
      if (item.colorValue) {
        html += `<div style="margin-top: 5px; font-size: 11px;"><strong>Κωδικός Χρώματος:</strong> ${item.colorValue}</div>`;
      }
    }
    
    html += `</div>`;
  });
  
  html += '</div>';
  return html;
}

/**
 * Creates print HTML content
 */
function createPrintHTML(
  orders: OrderRow[],
  columnSchemas: ColumnSchema[],
  hasPriceColumn: boolean,
  totalAmount: number,
  categoryName: string,
  seriesName: string,
  categoryImageUrl?: string,
  colorSelection?: Partial<ColorSelectionState>
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
  
  let html = '<div style="padding: 20px; font-family: Arial, sans-serif;">';
  
  // Header
  html += '<div style="display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 20px;">';
  if (categoryImageUrl) {
    html += `<img src="${categoryImageUrl}" alt="${seriesName || categoryName}" style="max-width: 150px; max-height: 150px; object-fit: contain;" />`;
  }
  html += '<div style="text-align: center;">';
  html += '<h1 style="font-size: 18px; margin: 0 0 10px 0;">Πίνακας Παραγγελιών</h1>';
  if (categoryName || seriesName) {
    html += '<div style="font-size: 12px;">';
    if (seriesName) html += `Σειρά: ${seriesName}`;
    if (categoryName && seriesName) html += ' | ';
    if (categoryName) html += `Κατηγορία: ${categoryName}`;
    html += '</div>';
  }
  html += '</div></div>';
  
  html += `<div style="font-size: 10px; margin-bottom: 15px;">Ημερομηνία: ${dateStr}</div>`;
  
  // Color selection
  if (colorSelection) {
    html += formatColorSelection(colorSelection);
  }
  
  // Table
  html += '<table style="width: 100%; border-collapse: collapse; font-size: 10px; margin-bottom: 20px;">';
  html += '<thead><tr style="background-color: #428BCA; color: white;">';
  headers.forEach(header => {
    html += `<th style="border: 1px solid #ddd; padding: 8px; text-align: left; font-weight: bold;">${header}</th>`;
  });
  html += '</tr></thead><tbody>';
  
  orders.forEach((order, index) => {
    html += `<tr style="background-color: ${index % 2 === 0 ? '#ffffff' : '#f5f5f5'};">`;
    
    visibleColumns.forEach((col) => {
      const value = order[col.field];
      const displayValue = formatValue(value);
      const imgUrl = value?.imgUrl || value?.ImgUrl || value?.imageUrl;
      html += '<td style="border: 1px solid #ddd; padding: 6px;">';
      if (imgUrl) {
        html += `<img src="${imgUrl}" style="width: 50px; height: 50px; object-fit: contain; margin-right: 8px; vertical-align: middle;" />`;
      }
      html += displayValue;
      html += '</td>';
    });
    
    if (hasPriceColumn) {
      const price = parseFloat(order.netamnt?.toString() || '0') || 0;
      const quantity = parseFloat(order.qty1?.toString() || order.quantity1?.toString() || '0') || 0;
      const rowTotal = price * quantity;
      html += `<td style="border: 1px solid #ddd; padding: 6px; text-align: right;">${rowTotal.toFixed(2)} €</td>`;
    }
    
    html += '</tr>';
  });
  
  if (hasPriceColumn && totalAmount > 0) {
    html += `<tr style="background-color: #f0f0f0; font-weight: bold;">`;
    html += `<td colspan="${headers.length - 1}" style="border: 1px solid #ddd; padding: 8px;"></td>`;
    html += `<td style="border: 1px solid #ddd; padding: 8px; text-align: right;">Σύνολο: ${totalAmount.toFixed(2)} €</td>`;
    html += '</tr>';
  }
  
  html += '</tbody></table>';
  
  if (hasPriceColumn && totalAmount > 0) {
    html += `<div style="text-align: center; font-size: 12px; font-weight: bold; margin-top: 15px;">`;
    html += `Συνολικό Ποσό: ${totalAmount.toFixed(2)} € (χωρίς ΦΠΑ)`;
    html += '</div>';
  }
  
  html += '</div>';
  return html;
}

/**
 * Generates print dialog for order data
 */
export async function generateOrderPDF({ 
  orders, 
  columnSchemas, 
  categoryName = '',
  seriesName = '',
  categoryImageUrl,
  colorSelection 
}: GeneratePDFOptions): Promise<void> {
  if (orders.length === 0) {
    alert('Δεν υπάρχουν παραγγελίες για εκτύπωση');
    return;
  }

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
  
  // Remove existing print container if any
  const existingContainer = document.getElementById('print-order-container');
  if (existingContainer) {
    existingContainer.remove();
  }
  
  // Remove existing print styles if any
  const existingStyles = document.getElementById('print-order-styles');
  if (existingStyles) {
    existingStyles.remove();
  }
  
  // Create print container
  const printContainer = document.createElement('div');
  printContainer.id = 'print-order-container';
  printContainer.innerHTML = createPrintHTML(
    orders, 
    columnSchemas, 
    hasPriceColumn, 
    totalAmount, 
    categoryName, 
    seriesName, 
    categoryImageUrl, 
    colorSelection
  );
  document.body.appendChild(printContainer);
  
  // Add print styles
  const style = document.createElement('style');
  style.id = 'print-order-styles';
  style.textContent = `
    @media print {
      @page {
        size: A4;
        margin: 15mm;
      }
      
      body * {
        visibility: hidden;
      }
      
      #print-order-container,
      #print-order-container * {
        visibility: visible;
      }
      
      #print-order-container {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
      }
      
      #print-order-container table tbody tr {
        page-break-inside: avoid;
        break-inside: avoid;
      }
      
      #print-order-container thead {
        display: table-header-group;
      }
    }
    
    @media screen {
      #print-order-container {
        display: none;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Wait a moment for rendering, then print
  setTimeout(() => {
    window.print();
  }, 100);
}
