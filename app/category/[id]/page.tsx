"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Download, Eye, FileText, Loader2, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useCategoryDetails } from "@/lib/redux-hooks"
import { Header } from "@/components/header"
import { AppSidebar } from "@/components/AppSidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"


export default function CategoryDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const categoryId = params.id as string


  const { details, loading, error } = useCategoryDetails(categoryId)

  const handleBack = () => {
    router.push("/")
  }

  // Fallback mock data only used when API completely fails
  const fallbackItems = [
    {
      id: 1,
      name: "Επενδύσεις Θωρακισμένης Προφίλ",
      description: "Λεπτομερείς πληροφορίες και τεχνικά χαρακτηριστικά για επενδύσεις θωρακισμένων προφίλ",
      code: "EP-001",
      category: "Επενδύσεις",
    },
    {
      id: 2,
      name: "Κάγκελο Ανοδειωμένο",
      description: "Προϊόντα υψηλής ποιότητας για επαγγελματική χρήση - ανοδειωμένα κάγκελα αλουμινίου",
      code: "KA-002",
      category: "Κάγκελα",
    },
    {
      id: 3,
      name: "Αυλόγυρου/Αυλόπορτες",
      description: "Σύγχρονες λύσεις για αυλές και εισόδους - συστήματα αυλόπορτων",
      code: "AP-003",
      category: "Πόρτες",
    },
    {
      id: 4,
      name: "Πέργκολα",
      description: "Κατασκευές σκίασης και διακόσμησης - συστήματα πέργκολας αλουμινίου",
      code: "PG-004",
      category: "Σκίαση",
    },
    {
      id: 5,
      name: "Τμήματα",
      description: "Εξαρτήματα και ανταλλακτικά - διάφορα τμήματα και εξαρτήματα αλουμινίου",
      code: "TM-005",
      category: "Εξαρτήματα",
    },
    {
      id: 6,
      name: "Ρολό",
      description: "Συστήματα ρολών και σκίασης - ρολά αλουμινίου για παράθυρα και πόρτες",
      code: "RO-006",
      category: "Ρολά",
    },
    {
      id: 7,
      name: "Σίτα",
      description: "Προστατευτικά συστήματα από έντομα - σίτες αλουμινίου για παράθυρα",
      code: "SI-007",
      category: "Προστασία",
    },
  ]

  // Function to process API data and extract items
  const processApiData = (apiData: any) => {
    console.log("Processing API data:", apiData)

    // If apiData is an array, use it directly
    if (Array.isArray(apiData)) {
      return apiData
    }

    // If apiData has an items property, use that
    if (apiData && apiData.items && Array.isArray(apiData.items)) {
      return apiData.items
    }

    // If apiData has a data property, use that
    if (apiData && apiData.data && Array.isArray(apiData.data)) {
      return apiData.data
    }

    // If apiData has a results property, use that
    if (apiData && apiData.results && Array.isArray(apiData.results)) {
      return apiData.results
    }

    // If apiData is an object with properties, convert to array
    if (apiData && typeof apiData === "object") {
      // Check if it has numeric keys (like an object with array-like structure)
      const keys = Object.keys(apiData)
      const numericKeys = keys.filter((key) => !isNaN(Number(key)))

      if (numericKeys.length > 0) {
        return numericKeys.map((key) => apiData[key])
      }

      // Otherwise, treat the object itself as a single item
      return [apiData]
    }

    // Return empty array if no valid data structure found
    return []
  }

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Header />
          <main className="flex-1 p-6">
            <div className="space-y-6 max-w-7xl mx-auto px-4">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Επιστροφή
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">Φόρτωση κατηγορίας {categoryId}...</h1>
              </div>

              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                <span className="ml-2 text-gray-600">Φόρτωση λεπτομερειών κατηγορίας από ERP σύστημα...</span>
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
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  if (error) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Header />
          <main className="flex-1 p-6">
            <div className="space-y-6 max-w-7xl mx-auto px-4">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Επιστροφή
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">Σφάλμα κατηγορίας {categoryId}</h1>
              </div>

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

              {/* Show fallback items when API fails */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {fallbackItems.map((item: any, index: number) => (
                  <Card key={item.id || index} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Package className="h-5 w-5 text-gray-400" />
                          <h3 className="font-medium text-gray-900 text-sm md:text-base">{item.name}</h3>
                        </div>
                        <Badge variant="outline" className="text-xs bg-yellow-50">
                          Mock
                        </Badge>
                      </div>
                      <p className="text-xs md:text-sm text-gray-600 mb-4">{item.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" className="text-xs bg-transparent" disabled>
                          <Eye className="h-3 w-3 mr-1" />
                          Προβολή
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  // Process the actual API data
  const apiItems = processApiData(details)
  const categoryName = details?.name || details?.title || `Κατηγορία ${categoryId}`

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 p-6">
          <div className="space-y-6 max-w-7xl mx-auto px-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Επιστροφή
              </Button>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">{categoryName}</h1>
              <Badge variant="outline" className="text-xs">
                ID: {categoryId}
              </Badge>
            </div>

            {/* Display actual API data */}
            {apiItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {apiItems.map((item: any, index: number) => (
                  <Card key={item.id || item.ID || index} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Package className="h-5 w-5 text-green-600" />
                          <h3 className="font-medium text-gray-900 text-sm md:text-base">
                            {item.name || item.Name || item.title || item.Title || `Στοιχείο ${index + 1}`}
                          </h3>
                        </div>
                        <div className="flex items-center space-x-2">
                          {(item.code || item.Code) && (
                            <Badge variant="outline" className="text-xs">
                              {item.code || item.Code}
                            </Badge>
                          )}                
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-gray-50 border-gray-200">
                <CardContent className="p-6 text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">Δεν βρέθηκαν στοιχεία</h3>
                  <p className="text-sm text-gray-600">
                    Το API επέστρεψε δεδομένα αλλά δεν βρέθηκαν στοιχεία για αυτή την κατηγορία.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Debug information - shows in development */}
            {process.env.NODE_ENV === "development" && (
              <Card className="bg-gray-50 border-gray-200">
                <CardHeader>
                  <CardTitle className="text-sm">Debug Info (Development Only)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-xs">
                    <p>
                      <strong>Category ID:</strong> {categoryId}
                    </p>
                    <p>
                      <strong>API URL:</strong> https://www.alfaeorders.com:19443/erpapi/getitems/obj
                    </p>
                    <p>
                      <strong>Payload:</strong> {`{Company: 20, BOption: 70, id: ${categoryId}}`}
                    </p>
                    <p>
                      <strong>Items Found:</strong> {apiItems.length}
                    </p>
                    <p>
                      <strong>Data Type:</strong> {Array.isArray(details) ? "Array" : typeof details}
                    </p>
                  </div>
                  <details className="mt-4">
                    <summary className="cursor-pointer font-medium">Raw API Response</summary>
                    <pre className="text-xs text-gray-600 overflow-auto mt-2 p-2 bg-gray-100 rounded max-h-64">
                      {JSON.stringify(details, null, 2)}
                    </pre>
                  </details>
                  <details className="mt-2">
                    <summary className="cursor-pointer font-medium">Processed Items</summary>
                    <pre className="text-xs text-gray-600 overflow-auto mt-2 p-2 bg-gray-100 rounded max-h-64">
                      {JSON.stringify(apiItems, null, 2)}
                    </pre>
                  </details>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
