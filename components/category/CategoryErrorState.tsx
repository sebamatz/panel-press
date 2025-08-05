import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { CategoryDetailsHeader } from "./CategoryDetailsHeader"

interface CategoryErrorStateProps {
  categoryId: string
  error: string
  onBack: () => void
}

export function CategoryErrorState({ categoryId, error, onBack }: CategoryErrorStateProps) {
  return (
    <>
      <CategoryDetailsHeader
        categoryId={categoryId}
        categoryName={`Σφάλμα κατηγορίας ${categoryId}`}
        onBack={onBack}
      />

      <Alert className="max-w-2xl mx-auto">
        <AlertDescription>
          <strong>Σφάλμα κατά τη φόρτωση των λεπτομερειών:</strong> {error}
          <br />
          <br />
          <strong>API Call:</strong>
          <br />
          URL: https://www.alfaeorders.com:19443/erpapi/getitems/obj
          <br />
          Payload: {`{Company: 20, BOption: 70, id: ${categoryId}}`}
        </AlertDescription>
      </Alert>

      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Εμφάνιση δεδομένων δοκιμής</h3>
          <p className="text-sm text-yellow-700">
            Λόγω σφάλματος API, εμφανίζονται δεδομένα δοκιμής για την κατηγορία.
          </p>
        </CardContent>
      </Card>
    </>
  )
} 