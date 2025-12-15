import { useEffect } from "react";
import { useOrderTableStore } from "@/lib/stores/orderTableStore";
import { useColorSelectionStore } from "@/lib/stores/colorSelectionStore";
import { useApiStore } from "@/lib/stores/appStore";
import { profilColorsType } from "@/components/colors-selection/ProfileColorOptions";
import { companySettings } from "@/config";
import { bOption } from "@/api/utils";
import { toast } from "sonner";
import { submitOrders as submitOrdersApi } from "@/api/orders";

export const useOrders = () => {
  const colorSelectionStore = useColorSelectionStore();
  const { profilColors, colorSelectionState } = colorSelectionStore;

  const { selectedCategoryDetails, selectedbaseCategory } = useApiStore();
  const { orders, addOrder, updateOrder, deleteOrder } = useOrderTableStore();

  useEffect(() => {
    console.log("profilColorsc-useOrders", profilColors);
    console.log("colorSelectionStatec-useOrders", colorSelectionState);
    console.log("ordersc-useOrders", orders);
  });

  const submitOrders = async () => {
    // [
    //     {
    //         "selectedTrdpgroup": 1,

    //         "colorType": "2",
    //         "selectedColorCompany": 6892,
    //         "colorValue": "",
    //         "selectedManifacturer": "16",

    //         "colorManifacturerValue": {
    //             "ccCPOUDRAID": "9243",
    //             "sky": "521-SAHARA-CARAVAN"
    //         }
    //     },
    //     {
    //         "selectedTrdpgroup": 1,

    //         "colorType": "1",
    //         "selectedColorCompany": 6892,
    //         "colorValue": "",
    //         "selectedManifacturer": "17",

    //         "colorManifacturerValue": {
    //             "ccCPOUDRAID": "75200",
    //             "sky": "7021-RAL-GREY"
    //         }
    //     }
    // ]

    let orderData: any[] = [];

    if (profilColors === profilColorsType.DUAL_COLOR.colorType.toString()) {
      // [{Company: 20, BOption: 1, "TRDR":6462, "TRDBRANCH":1427, remarks: "remarks", comments: "comments", mtrl:10104, "QTY1":1, "price":456.4053, CCCPOUDRAID: 69411, CCCBAFIOID: 303, commentS1: "commentS1",
      //  JToken:{"ColorType1":1, "diastasi":1, "fora":"Δεξιά", "gemisi":1, "lamarina":2, "ColorType2":1,
      // "poudra2id":74908, "bafeio2id":303, "comments2":"comments2"}}]

      debugger;

      const orderDataFront = orders.map((order) => ({
        Company: companySettings.company,
        BOption: 1,
        TRDR: 6462,
        TRDBRANCH: 1427,
        remarks: "",
        comments: order.colorValue,
        mtrl: order.mtrl || "",
        QTY1: order.qty1,
        price: order.netamnt,
        CCCPOUDRAID:
          colorSelectionState[0]?.colorManifacturerValue?.ccCPOUDRAID,
        CCCBAFIOID: colorSelectionState[0].selectedColorCompany,
        commentS1: order.colorValue,
        JToken: {
          ColorType1: colorSelectionState[0].colorType,
          diastasi: order.dimension,
          fora: order.dimension.fora,
          gemisi: order.gemisi,
          lamarina: order.lamarina,
          ColorType2: colorSelectionState[1].colorType,
          poudra2id:
            colorSelectionState[1]?.colorManifacturerValue?.ccCPOUDRAID,
          bafeio2id: colorSelectionState[1]?.selectedColorCompany,
          comments2: colorSelectionState[1].colorValue,
        },
      }));
      orderData = orderDataFront;
    }
    if (profilColors === profilColorsType.COLOR.colorType.toString()) {
      const orderDataBack = orders.map((order) => ({
        Company: companySettings.company,
        BOption: 1,
        TRDR: 6462,
        TRDBRANCH: 1427,
        remarks: "",
        comments: order.colorValue,
        mtrl: order.mtrl || "",
        QTY1: order.qty1,
        price: order.netamnt,
        CCCPOUDRAID:
          colorSelectionState[0]?.colorManifacturerValue?.ccCPOUDRAID,
        CCCBAFIOID: colorSelectionState[0]?.selectedColorCompany,
        commentS1: order.colorValue,
        JToken: {
          ColorType1: colorSelectionState[0].colorType,
          diastasi: order.dimension,
          fora: order.dimension.fora,
          gemisi: order.gemisi,
          lamarina: order.lamarina,
        },
      }));
      orderData = orderDataBack;
    }

    console.log("orderDatac-useOrders", orderData);
    const response = await submitOrdersApi(orderData);
    if (response.response.ok) {
      toast.success("Orders submitted successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } else {
      toast.error("Failed to submit orders");
    }
  };

  return {
    orders,
    addOrder,
    updateOrder,
    deleteOrder,
    profilColors,
    submitOrders,
  };
};

// Final post json

// if dixromia

// Στέλνεις και Front και Back
// [{Company: 20, BOption: 1, "TRDR":6462, "TRDBRANCH":1427, remarks: "remarks", comments: "comments", mtrl:10104, "QTY1":1, "price":456.4053, CCCPOUDRAID: 69411, CCCBAFIOID: 303, commentS1: "commentS1", JToken:{"ColorType1":1, "diastasi":1, "fora":"Δεξιά", "gemisi":1, "lamarina":2, "ColorType2":1, "poudra2id":74908, "bafeio2id":303, "comments2":"comments2"}}]

// else

// Μόνο Front(γιατί το Back είναι ίδιο με το Front)
// [{Company: 20, BOption: 1, "TRDR":6462, "TRDBRANCH":1427, remarks: "remarks", comments: "comments", mtrl:10104, "QTY1":1, "price":456.4053, CCCPOUDRAID: 69411, CCCBAFIOID: 303, commentS1: "commentS1", JToken:{"ColorType1":1, "diastasi":1, "fora":"Δεξιά", "gemisi":1, "lamarina":2}}]

// Λευκό

// if dixromia

// if Front
// "ColorType1":4 CCCPOUDRAID:null
// or
// if Back
// "ColorType2":4 "poudra2id":null

// else

// "ColorType1":4 CCCPOUDRAID:null
