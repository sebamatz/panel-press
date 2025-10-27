// customer schema

export interface Customer {
  company: 1;
  afm: string;
  trdr: number; // if this is the customer id
  trdbranch: number; // if company has multiple branches, this is the branch id
  code: string;
  name: string;
  address: string;
  district: string;
  city: string;
  phonE1: string;
}

export type panelCompanySettings = {
  company: 20;
};

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

export interface IBranch {
  trdbranch: number;
  branchcode: string;
  branchname: string;
  address: string;
  district: string;
  city: string;
  phonE1: string;
}

export interface IGetBranchesResponse {
  trdr: number;
  trdrname: string;
  afm: string;
  pricezone: string | null;
  sourceDB: string;
  branches: IBranch[];
}

export interface IBOption {
  [key: string]: number;
}

export interface CategoryItem {
  id: string | number;
  name: string;
  description?: string;
  parentId?: string;
  level?: number;
  [key: string]: any;
}

export interface CategoryDetails {
  id: string | number;
  name: string;
  description?: string;
  items?: any[];
  specifications?: any[];
  images?: string[];
  [key: string]: any;
}

export interface ProductDetails {
  id: string | number;
  name: string;
  description?: string;
  specifications?: any[];
  images?: string[];
  price?: number;
  code?: string;
  category?: string;
  [key: string]: any;
}

export interface ColumnSchema {
  baseCategory: number;
  colType: string;
  columnId: number;
  editable: boolean;
  field: string;
  priority: number;
  series: number;
  title: string;
  values: any;
  [key: string]: any;
}
