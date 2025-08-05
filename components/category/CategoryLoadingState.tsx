import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { CategoryDetailsHeader } from "./CategoryDetailsHeader"

interface CategoryLoadingStateProps {
  categoryId: string
  onBack: () => void
}

export function CategoryLoadingState({ categoryId, onBack }: CategoryLoadingStateProps) {
  return (
    <>
      <CategoryDetailsHeader
        categoryId={categoryId}
        categoryName={`Φόρτωση κατηγορίας ${categoryId}...`}
        onBack={onBack}
      />

      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <span className="ml-2 text-gray-600">
          Φόρτωση λεπτομερειών κατηγορίας από ERP σύστημα...
        </span>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h3 className="font-semibold text-blue-800 mb-2">API Call Info</h3>
          <p className="text-sm text-blue-700">
            <strong>Endpoint:</strong> https://www.alfaeorders.com:19443/erpapi/getitems/obj
          </p>
          <p className="text-sm text-blue-700">
            <strong>Payload:</strong> {`{Company: 20, BOption: 70, id: ${categoryId}}`}
          </p>
        </CardContent>
      </Card>
    </>
  )
} 