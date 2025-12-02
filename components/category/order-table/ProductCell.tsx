import { memo, useCallback } from "react";
import { ProductDetailsList } from "../ProductDetailsList";
interface ProductCellComponentProps {
  field: string;
  value: any;
  onChange: (field: string, value: any) => void;
  onSelectionChange?: (value: any) => void;
}

const ProductCellComponent = memo<ProductCellComponentProps>(
  ({ field, onChange }) => {
    const handleSelectionChange = useCallback(
      (value: any) => {
        onChange(field, value);
      },
      [field, onChange]
    );

    return <ProductDetailsList onSelectionChange={handleSelectionChange} />;
  }
);

export default ProductCellComponent;
