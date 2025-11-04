  import { fetchBaseCategories, fetchCategoriesProductColumns } from "@/api/categories";
  import { fetchCategoryDetails } from "@/api/categories";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ApiState } from "./types";
import { processCategoriesResponse, processCategoryDetailsResponse } from "@/api/utils";

export const useApiStore = create<ApiState>()(
  devtools(
    (set, get) => ({
      // Initial state
      categories: [],
      categoriesLoading: false,
      categoriesError: null,

      categoryDetails: {},
      categoryDetailsLoading: {},
      categoryDetailsError: {},
      selectedCategoryDetails: null,
      setSelectedCategoryDetails: (details: string | number | null) =>
        set({ selectedCategoryDetails: details }),

      productDetails: {},
      productDetailsLoading: {},
      productDetailsError: {},

      columnSchemas: null,
      columnSchemasLoading: {},
      columnSchemasError: {},

      productDetailsList: {},
      productDetailsListLoading: {},
      productDetailsListError: {},

      // Actions
      fetchCategories: async () => {
        set({ categoriesLoading: true, categoriesError: null });
        const data = await fetchBaseCategories();
        const categories = processCategoriesResponse(data);
        set({ categories, categoriesLoading: false, categoriesError: null });
      },

      fetchCategoryDetails: async (categoryId: string | number) => {
        set((state) => ({
          categoryDetailsLoading: {
            ...state.categoryDetailsLoading,
            [categoryId]: true,
          },
          categoryDetailsError: {
            ...state.categoryDetailsError,
            [categoryId]: null,
          },
        }));

        const data = await fetchCategoryDetails(categoryId);
        const details = processCategoryDetailsResponse(data, categoryId);
        set((state) => ({
          categoryDetails: { ...state.categoryDetails, [categoryId]: details },
          selectedbaseCategory: categoryId,
          categoryDetailsLoading: {
            ...state.categoryDetailsLoading,
            [categoryId]: false,
          },
          categoryDetailsError: {
            ...state.categoryDetailsError,
            [categoryId]: null,
          },
        }));
      },

      fetchColumnSchema: async (
        baseCategory: string | number,
        series: string | number
      ) => {
        const key = `${baseCategory}-${series}`;

        set((state) => ({
          columnSchemasLoading: { ...state.columnSchemasLoading, [key]: true },
          columnSchemasError: { ...state.columnSchemasError, [key]: null },
        }));

        const data = await fetchCategoriesProductColumns(baseCategory, series);

        const parsedData = data.map((item: any) => ({
          ...item,
          values: item.values ? JSON.parse(item.values) : "",
        }));
        set((state) => ({
          columnSchemas: parsedData,
          columnSchemasLoading: { ...state.columnSchemasLoading, [key]: false },
          columnSchemasError: { ...state.columnSchemasError, [key]: null },
        }));
      },



      clearErrors: () => {
        set({
          categoriesError: null,
          categoryDetailsError: {},
          productDetailsError: {},
          columnSchemasError: {},
          productDetailsListError: {},
        });
      },
    }),
    {
      name: "api-store",
    }
  )
);






