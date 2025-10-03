import { Package } from "lucide-react";
import { Combobox, SeriesComboboxProps } from "./ui/combobox";

export function SeriesCombobox({ products, title, ...props }: SeriesComboboxProps) {
    return (
      <Combobox
        items={products}
        icon={<Package className="h-5 w-5" />}
        placeholder="Επιλέξτε ένα προϊόν..."
        searchPlaceholder="Αναζήτηση προϊόντων..."
        emptyMessage="Δεν βρέθηκαν προϊόντα."
        showBadge={true}
        badgeText="Νέο"
        title={title}
        showTitle={true}
        badgeCount={products.length}
        badgeLabel="προϊόντα διαθέσιμα"
        {...props}
      />
    )
  }