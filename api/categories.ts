import { companySettings, domain } from "@/config";
import { getItems } from "./fetch";
import { bOption } from "./utils";
import { IGetItemPayload } from "./types";

export const fetchBaseCategories = async () => {
  const payload: IGetItemPayload = {
    Company:companySettings.company,
    BOption: bOption.getBaseCategories,
  };
  const response = await getItems(payload);
  return response;
}

export const fetchCategoryDetails = async (categoryId: string | number) => {
  const payload: IGetItemPayload = {
    Company: companySettings.company,
    BOption: bOption.getBaseCategories as number,
    JToken:{"Category":categoryId.toString()}
  };
  const response = await getItems(payload);
  return response;
}


export const fetchCategoriesProductColumns = async (baseCategory: string | number, series: string | number) => {
    try {
      const url = `${domain}/erpapi/panel/schema/columns?BaseCategory=${baseCategory}&Series=${series}`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching column schema:', error);
      throw error;
    }
  };

 // {Company: 20, BOption: 70, SearchValue:"P-80", JToken:{"Category":1, "Series":1, "Color":1}}
export const fetchCategoryProducts = async (baseCategory: string | number, lastId: string | number, searchValue: string) => {
  const payload: IGetItemPayload = {
    Company: companySettings.company,
    BOption: bOption.getBaseCategories,
    SearchValue: searchValue,
    JToken:{"Category":baseCategory.toString(), "Series":lastId.toString(), "Color":1}
  };
  const response = await getItems(payload);
  return response;
};