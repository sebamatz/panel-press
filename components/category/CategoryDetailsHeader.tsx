import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface CategoryDetailsHeaderProps {
  categoryId: string
  categoryName: string
  onBack: () => void
}

export function CategoryDetailsHeader({ 
  categoryId, 
  categoryName, 
  onBack 
}: CategoryDetailsHeaderProps) {
  return (
    <div className="flex items-center space-x-4">
      <Button variant="ghost" size="sm" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Επιστροφή
      </Button>
      <h1 className="text-xl md:text-2xl font-bold text-gray-900">{categoryName}</h1>
    </div>
  )
} 