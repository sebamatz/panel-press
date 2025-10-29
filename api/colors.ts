import { companySettings } from "@/config"
import { IGetItemPayload, IGetPricePayload } from "@/api/types"
import { getItems } from "@/api/fetch"
import { bOption } from "./utils"
export const fetchColorCompanies = async () => {
  const payload: IGetItemPayload = {
    Company: companySettings.company,
    BOption: bOption.getColorCompanies,
  }
  const response = await getItems(payload)
  return response
}

export const fetchColorTypes = async () => {
  interface response {
    id: number;
    name: string;
  }
  const payload: IGetItemPayload = {
    Company: companySettings.company,
    BOption: bOption.getColorTypes,
  }
  const response: response[] = await getItems(payload)
  return response
}

export const fetchColorManufacturers = async () => {
    interface response {
        id: number;
        code: string;
    }
  const payload: IGetItemPayload = {
    Company: companySettings.company,
    BOption: bOption.getColorManufacturers,
  }
  const response: response[] = await getItems(payload)
  return response
}

export const fetchColorsByManufacturer = async (payloadParams: any) => {
 
  const payload: IGetItemPayload = {
    Company: companySettings.company,
    BOption: bOption.getColors,
    id: payloadParams.selectedManifacturer,
    LastId: payloadParams.colorType,
  }
  const response = await getItems(payload)
  return response
}
// GetPrice
// Get with {Company: 20, BOption: 80, id: 480, LastId:10104, JToken:{"QTY":1, "UTBL03":1, "gemisi":1,"lamarina":2}} id = trdr, LastId = mtrl -- Return {"mtrl":480,"price":456,4053}

export const fetchColorPrice = async (payloadParams: any) => {

  const payload: IGetPricePayload = {
    Company: companySettings.company,
    BOption: bOption.getPrice,
  }
  const response = await getItems({...payload, ...payloadParams})
  return response
}