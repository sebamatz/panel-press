import { getDomain } from "./fetch";
// submitOrders: async () => {
//     const state = get()
//     if (state.orders.length === 0) {
//       set({ submitError: 'No orders to submit' })
//       return
//     }

//     set({ isSubmitting: true, submitError: null })

//     try {
//       // Transform orders to API format
//       const apiOrders = state.orders.map(order => ({
//         Company: companySettings.company,
//         bOption: 0,
//         trdr: 3975, // Default trader ID - should be dynamic
//         trdbranch: 125, // Default branch ID - should be dynamic
//         comments: order.comments || '',
//         mtrl: order.product?.SKU || order.product?.sku || 10069, // Product SKU or default
//         commentS1: order.color || '',
//         qtY1: order.quantity1 || 0,
//         qtY2: order.quantity2 || 0,
//         // Add other fields as needed
//         ...order
//       }))

//       const response = await submitOrders(apiOrders)

//       if (response.response.ok) {
//         // Clear orders on successful submission
//         state.clearOrders()
//         set({ isSubmitting: false, submitError: null })
//       } else {
//         throw new Error('Failed to submit orders')
//       }
//     } catch (error) {
//       console.error('Error submitting orders:', error)
//       set({
//         isSubmitting: false,
//         submitError: error instanceof Error ? error.message : 'Failed to submit orders'
//       })
//     }
//   },
//curl -X PUT --header 'Content-Type: application/json' --header 'Accept: application/json' -d '[{Company: 10, BOption: 1, trdr: 3975, trdbranch: 125, remarks: "remarks", comments: "comments", mtrl: 10152, "SKU": "SKU", "UTBL04" : 1, CCCPOUDRAID: 69411, CCCBAFIOID: 303, commentS1: "commentS1", qtY1: 4.29, qtY2: 2}]' 'https://www.alfaeorders.com:19443/erpapi/putorder'

export const submitOrders = async (orders: any[]) => {
  try {
    const response = await fetch(`${getDomain()}/erpapi/putorder`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(orders),
    });
    return { response, data: await response.json() };
  } catch (error) {
    console.error("Error submitting orders:", error);
    throw error;
  }
};
