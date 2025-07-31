import { Shield, Home, Lock, Flame, Layers, Fence } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function ProductGrid() {
  const products = [
    {
      id: "aluminum-panels",
      title: "ΠΑΝΕΛ ΑΛΟΥΜΙΝΙΟΥ",
      subtitle: "ΘΩΡΑΚΙΣΜΕΝΕΣ ΠΟΡΤΕΣ",
      icon: Home,
      color: "bg-orange-500",
      description: "Πάνελ αλουμινίου υψηλής ποιότητας",
    },
    {
      id: "aluminum-railings",
      title: "ΚΑΓΚΕΛΑ ΑΛΟΥΜΙΝΙΟΥ",
      subtitle: "ΣΥΝΕΠΙΠΕΔΕΣ ΘΩΡΑΚΙΣΜΕΝΕΣ ΠΟΡΤΕΣ",
      icon: Fence,
      color: "bg-blue-500",
      description: "Κάγκελα αλουμινίου για ασφάλεια",
    },
    {
      id: "armored-doors",
      title: "ΘΩΡΑΚΙΣΜΕΝΕΣ ΠΟΡΤΕΣ",
      subtitle: "ΣΥΝΕΠΙΠΕΔΕΣ ΠΟΡΤΕΣ ΑΠΟΘΗΚΗΣ ΑΣΦΑΛΕΙΑΣ",
      icon: Shield,
      color: "bg-green-600",
      description: "Θωρακισμένες πόρτες ασφαλείας",
    },
    {
      id: "storage-doors",
      title: "ΑΠΟΘΗΚΗΣ ΠΟΡΤΕΣ",
      subtitle: "ΣΥΝΕΠΙΠΕΔΕΣ ΠΟΡΤΕΣ ΑΣΦΑΛΕΙΑΣ",
      icon: Lock,
      color: "bg-purple-500",
      description: "Πόρτες αποθήκης και ασφαλείας",
    },
    {
      id: "fire-doors",
      title: "ΠΥΡΑΣΦΑΛΕΙΑΣ ΠΟΡΤΕΣ",
      subtitle: "ΣΥΝΕΠΙΠΕΔΕΣ ΠΟΡΤΕΣ ΚΥΡΙΑΣ ΕΙΣΟΔΟΥ ΜΕ PANEL(ΠΑΝΕΛ)",
      icon: Flame,
      color: "bg-red-600",
      description: "Πόρτες πυρασφάλειας",
    },
    {
      id: "cladding",
      title: "ΕΠΕΝΔΥΣΕΙΣ ΘΩΡΑΚΙΣΜΕΝΗΣ ΠΡΟΦΙΛ",
      subtitle: "",
      icon: Layers,
      color: "bg-lime-500",
      description: "Επενδύσεις θωρακισμένων προφίλ",
    },
  ]

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="text-center mb-8 px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Καλώς ήρθατε στο Portal της Panel Press S.A
        </h1>
        <p className="text-gray-600 text-sm md:text-base">Επιλέξτε κατηγορία προϊόντων για να συνεχίσετε</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-4">
        {products.map((product) => {
          const IconComponent = product.icon
          return (
            <Card key={product.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-4 md:p-6 text-center">
                <div
                  className={`w-12 h-12 md:w-16 md:h-16 ${product.color} rounded-lg flex items-center justify-center mx-auto mb-3 md:mb-4`}
                >
                  <IconComponent className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
                <h3 className="font-bold text-base md:text-lg mb-2">{product.title}</h3>
                {product.subtitle && (
                  <p className="text-xs md:text-sm text-red-600 font-medium mb-2">{product.subtitle}</p>
                )}
                <p className="text-gray-600 text-xs md:text-sm">{product.description}</p>
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
