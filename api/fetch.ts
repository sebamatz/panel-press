import { bOption } from "@/api/utils";
import {  domain } from "@/config";
import { companySettings } from "@/config"
import { putOrderMock } from "./mocks";

const groupBy = (keys: any) => (array: any) =>
  array.reduce((objectsByKeyValue: any, obj: any) => {
    const value = keys.map((key: any) => obj[key]).join("-");
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat({
      ...obj,
      generatedKey: value,
    });

    return objectsByKeyValue;
  }, {});

const constructApi = (url: string, params: any) => {
  const queryString = encodeURIComponent(JSON.stringify(params));
  return url + queryString;
};

export async function getData(url = "", params: any = {}, short = false) {
  const response = await fetch(constructApi(url, params));
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json(); // parses JSON response into native JavaScript objects
  const groupFincodeStatus = groupBy([
    "trndate",
    "fincode",
    "status",
    "comments",
  ]);
  return short ? groupFincodeStatus(data) : data;
}


export const fechGroups = async () => {
  const data = {
    BOption: 1,
    Company: 1,
  };

  const result = await getData(`${domain}/erpapi/getgroups?pars=`, data);
  return await result;
};

//GET /erpapi/getbranches/obj

export const searchBranches = async (searchValue: string) => {
  const data = {
    Company: companySettings.company,
    SearchValue: searchValue,
  };

  const result = await getData(`${domain}/erpapi/getbranches/obj?pars=`, data);
  console.log("getbranches", result);
  return result;
};

export const getbranches = async (afm: string) => {
  const data = {
    Company: companySettings.company,
    AFM: afm,
  };

  const result = await getData(`${domain}/erpapi/getbranches/obj?pars=`, data);
  console.log("getbranches", result);
  return result;
};

// Example POST method implementation:
export async function postData(url = "", data = putOrderMock) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "PUT", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
  }

  return { response, data: await response.json() }; // parses JSON response into native JavaScript objects
}

// /erpapi/putorder
//${domain}/erpapi/getorders/pdf?pars=%7B%22Company%22%3A1%2C%22Id%22%3A%22179631%22%7D//

// Submit orders to backend
export async function submitOrders(orders: any[]) {
  try {
    const response = await postData(`${domain}/erpapi/putorder`, orders)
    return response
  } catch (error) {
    console.error('Error submitting orders:', error)
    throw error
  }
}

export async function downloadPdf(payload: any, code) {
  try {
    const url = `${domain}/erpapi/getorders/pdf?pars=`;

    const response = await fetch(constructApi(url, { Company: 1, id: code }), {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const pdf = await response.json();
    const linkSource = `data:application/pdf;base64,${pdf}`;
    const downloadLink = document.createElement("a");
    const fileName = `${payload}.pdf`;
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  } catch (err: any) {
    throw new Error(err?.response?.data?.code || err.message);
  }
}

//curl -X GET --header 'Accept: application/json' 'https://alfaeorders.com:19580/erpapi/getitems/obj?pars=%7BCompany%3A%201%2C%20SearchValue%3A%20%222500%22%2C%20BOption%3A%201%2C%20AFM%3A%22%CE%A3%CE%A5%CE%A3%CE%A4%CE%97%CE%9C%CE%91%CE%A4%CE%91%20ALFA%22%7D'

// - Returns a list of Items matching the given BOption,AFM(as ΟΜΑΔΑ),SearchValue ---
// Required fields (Company:, BOption:, AFM:"")
// Here is a sample {Company: 1, SearchValue: "22500", BOption: 1, AFM:"ΣΥΣΤΗΜΑΤΑ ALFA"}.
// BOption: 1 = Άβαφο(Default), 2 = Λευκό, 3 = Χρώμα
// AFM(as ΟΜΑΔΑ(πχ Προφίλ, Γωνιά κλπ)
// SearchValue: > 4 ψηφίων...
// (Post params) and get Items to fill DropDownList ΚΩΔΙΚΟΣ
// Other sample for POUDRES
// BOption: 30 -> Get with {BOption: 30, Company: 1, AFM:""} Return {"ID": f.MTRMANFCTR, "Code": f.MANFCTRCODE}
// get list of MTRMANFCTR (WHERE ITEM.MTRGROUP = 11009 GROUPBY ITEM.MTRMANFCTR)
// BOption: 40 -> Get with {BOption: 40, Company: 1, AFM:""} Return {"ID": f.UTBL04, "NAME": f.f.U4NAME}
// get list of UTBL04 (WHERE ITEM.MTRGROUP = 11009 GROUPBY mx.UTBL04)
// BOption: 50 -> Get with {BOption: 50, Company: 1, SearchValue: "tes*", id: 16, LastId:1, AFM:""} id = MTRMANFCTR(ID), LastId = mx.UTBL04 result from previous get -- Return {"ccCPOUDRAID": f.MTRL, "SKU": f.SKU}
// get list of POUDRES ITEEXTRA.VARCHAR05 WHERE ITEM.MTRGROUP = 11009 AND ITEM.MTRMANFCTR
// BOption: 60 -> Get with {BOption: 60, Company: 1, AFM:""} Return {"CCCBAFEIOID": f.TRDR, "NAME": f.NAME}
// ΠΡΟΜΗΘΕΥΤΕΣ (ΕΞΩΤΕΡΙΚΑ ΒΑΦΕΙΑ) : επιλέξτε TRDR,NAME WHERE SUPPLIER.TRDPGROUP = 1
// Fields "ccCPOUDRAID": , "CCCBAFEIOID": must return for each line with post put /erpapi/putorder

export interface IGetItemPayload {
  Company: number;
  BOption: number;
  AFM?: string | null;
  SearchValue?: string;
  id?: any;
  LastId?: any;
  trdr?: any;
  trdbranch?: any;
  comments?: any;
  mtrl?: any;
  commentS1?: any;
  qtY1?: any;
  qtY2?: any;
}

export const getItems = async (payload: IGetItemPayload) => {
  const params = {
    ...payload,
  };
  const url = `${domain}/erpapi/getitems/obj?pars=`;
  try {
    const response = await fetch(constructApi(url, params));
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};