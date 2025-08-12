"use client"

import { CardTitle } from "@/components/ui/card"

import { CardHeader } from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { Shield, Home, Lock, Flame, Layers, Fence, Package, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useGetBaseCategoriesQuery } from "@/lib/api"

// Icon mapping function
function getIconForCategory(categoryName: string) {
  const name = categoryName.toLowerCase()
  if (name.includes("πανελ") || name.includes("panel")) return Home
  if (name.includes("καγκελ") || name.includes("railing")) return Fence
  if (name.includes("θωρακ") || name.includes("armor")) return Shield
  if (name.includes("αποθηκ") || name.includes("storage")) return Lock
  if (name.includes("πυρ") || name.includes("fire")) return Flame
  if (name.includes("επενδ") || name.includes("clad")) return Layers
  return Package
}

// Color mapping function
function getColorForCategory(index: number) {
  const colors = [
    "bg-orange-500",
    "bg-blue-500",
    "bg-green-600",
    "bg-purple-500",
    "bg-red-600",
    "bg-lime-500",
    "bg-indigo-500",
    "bg-pink-500",
    "bg-teal-500",
    "bg-amber-500",
  ]
  return colors[index % colors.length]
}

export function DynamicProductGrid() {
  const { data: categories = [], isLoading: loading, error } = useGetBaseCategoriesQuery()
  const router = useRouter()

  const handleCategoryClick = (categoryId: string | number) => {
    router.push(`/category/${categoryId}`)
  }

  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="text-center mb-8 px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Καλώς ήρθατε στο Portal της Panel Press S.A
          </h1>
          <p className="text-gray-600 text-sm md:text-base">Φόρτωση κατηγοριών προϊόντων από ERP σύστημα...</p>
        </div>

        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          <span className="ml-2 text-gray-600">Φόρτωση δεδομένων από το ERP σύστημα...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="text-center mb-8 px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Καλώς ήρθατε στο Portal της Panel Press S.A
          </h1>
          <p className="text-gray-600 text-sm md:text-base">Σφάλμα φόρτωσης κατηγοριών</p>
        </div>

        <Alert className="mt-4 max-w-2xl mx-auto">
          <AlertDescription>
            <strong>Σφάλμα κατά τη φόρτωση των κατηγοριών:</strong> {error}
            <br />
            <br />
            <strong>API Call:</strong>
            <br />
            URL: https://www.alfaeorders.com:19443/erpapi/getitems/obj
            <br />
            Payload: {`{Company: 20, BOption: 70}`}
          </AlertDescription>
        </Alert>

        <Card className="bg-yellow-50 border-yellow-200 mx-4">
          <CardContent className="p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">Δεν είναι δυνατή η φόρτωση κατηγοριών</h3>
            <p className="text-sm text-yellow-700">
              Παρακαλώ ελέγξτε τη σύνδεση με το ERP σύστημα ή επικοινωνήστε με τον διαχειριστή.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="text-center mb-8 px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Καλώς ήρθατε στο Portal της Panel Press S.A
          </h1>
          <p className="text-gray-600 text-sm md:text-base">Δεν βρέθηκαν κατηγορίες</p>
        </div>

        <Card className="bg-gray-50 border-gray-200 mx-4">
          <CardContent className="p-6 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">Δεν βρέθηκαν κατηγορίες</h3>
            <p className="text-sm text-gray-600">Το API επέστρεψε επιτυχώς αλλά δεν βρέθηκαν κατηγορίες προϊόντων.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
  

      {/* API Success Info */}
      <Card className="bg-green-50 border-green-200 mx-4">
        <CardContent className="p-4">
          <h3 className="font-semibold text-green-800 mb-2">✅ Επιτυχής φόρτωση από ERP</h3>
          <p className="text-sm text-green-700">
            Φορτώθηκαν {categories.length} κατηγορίες από το API με payload: {`{Company: 20, BOption: 70}`}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-4">
        {categories.map((category, index) => {
          const IconComponent = getIconForCategory(category.name || "")
          const color = getColorForCategory(index)

          return (
            <Card
              key={category.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleCategoryClick(category.id)}
            >
              <CardContent className="p-4 md:p-6 text-center">
                <div
                  className={`w-12 h-12 md:w-16 md:h-16 ${color} rounded-lg flex items-center justify-center mx-auto mb-3 md:mb-4`}
                >
                  <IconComponent className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
                <h3 className="font-bold text-base md:text-lg mb-2">{category.name}</h3>
                {category.description && (
                  <p className="text-xs md:text-sm text-gray-600 mb-2">{category.description}</p>
                )}
                <div className="flex items-center justify-center space-x-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    ID: {category.id}
                  </Badge>
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                    API
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="mt-8 md:mt-12 bg-gradient-to-r from-green-50 to-lime-50 border border-green-200 rounded-lg p-4 md:p-6 mx-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <h3 className="font-bold text-lg md:text-xl text-green-800">🌟 Προωθημένο Προϊόν</h3>
          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium self-start">ΝΕΟ</span>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-start space-y-4 lg:space-y-0 lg:space-x-6">
          <img
            src="/placeholder.svg?height=120&width=180"
            alt="Προωθημένο Προϊόν - Πάνελ Αλουμινίου Premium"
            className="rounded-lg shadow-md w-full max-w-xs mx-auto lg:mx-0 lg:flex-shrink-0"
          />
          <div className="flex-1">
            <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
              Πάνελ Αλουμινίου Premium Series 7000
            </h4>
            <p className="text-gray-700 mb-3 text-sm md:text-base">
              Η νέα σειρά Premium 7000 προσφέρει εξαιρετική αντοχή και σύγχρονο design. Ιδανικό για σύγχρονες κατοικίες
              και επαγγελματικούς χώρους.
            </p>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs md:text-sm">Αντιδιαβρωτικό</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs md:text-sm">Ενεργειακή Απόδοση</span>
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs md:text-sm">
                10 Χρόνια Εγγύηση
              </span>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm md:text-base w-full sm:w-auto">
                Περισσότερες Πληροφορίες
              </button>
              <button className="border border-green-600 text-green-600 px-4 py-2 rounded-md hover:bg-green-50 transition-colors text-sm md:text-base w-full sm:w-auto">
                Ζητήστε Προσφορά
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
