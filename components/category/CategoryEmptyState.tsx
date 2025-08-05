import { Package } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function CategoryEmptyState() {
  return (
    <Card className="bg-gray-50 border-gray-200">
      <CardContent className="p-6 text-center">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="font-medium text-gray-900 mb-2">Δεν βρέθηκαν στοιχεία</h3>
        <p className="text-sm text-gray-600">
          Το API επέστρεψε δεδομένα αλλά δεν βρέθηκαν στοιχεία για αυτή την κατηγορία.
        </p>
      </CardContent>
    </Card>
  )
} 