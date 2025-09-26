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