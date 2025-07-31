import { ArrowLeft, Download, Eye, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface MainContentProps {
  category: string
}

export function MainContent({ category }: MainContentProps) {
  const categoryData = {
    "series-5000-7000": {
      title: "ΣΕΙΡΑ 5000/7000 ΠΡΕΣΑΡΙΣΤΑ",
      description: "Προϊόντα υψηλής ποιότητας για επαγγελματική χρήση",
      items: [
        "Επενδύσεις Θωρακισμένης Προφίλ",
        "Κάγκελο Ανοδειωμένο",
        "Αυλόγυρου/Αυλόπορτες",
        "Πέργκολα",
        "Τμήματα",
        "Ρολό",
        "Σίτα",
      ],
    },
    "series-6000": {
      title: "ΣΕΙΡΑ 6000 ΠΡΕΣΑΡΙΣΤΑ ΜΕ INOX",
      description: "Συνδυασμός αλουμινίου και ανοξείδωτου χάλυβα",
      items: ["Επενδύσεις Θωρακισμένης Προφίλ", "Κάγκελο Ανοδειωμένο", "Αυλόγυρου/Αυλόπορτες", "Πέργκολα", "Τμήματα"],
    },
  }

  const currentCategory = categoryData[category as keyof typeof categoryData] || categoryData["series-5000-7000"]

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Επιστροφή
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">{currentCategory.title}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Περιγραφή Κατηγορίας</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{currentCategory.description}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentCategory.items.map((item, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">{item}</h3>
                <Badge variant="secondary">Νέο</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Λεπτομερείς πληροφορίες και τεχνικά χαρακτηριστικά για {item.toLowerCase()}
              </p>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-1" />
                  Προβολή
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-1" />
                  Λήψη
                </Button>
                <Button size="sm" variant="outline">
                  <FileText className="h-4 w-4 mr-1" />
                  Τεχνικά
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
