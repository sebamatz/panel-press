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
 * Triggers the browser print dialog
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

  // Just trigger print
  window.print();
}
