import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface Company {
  _id: string;
  name: string;
  logo?: string;
  type: string;
}

interface Categories {
  _id: string;
  name: string;
}

type CompanyStore = {
  companies: Company[];
  defaultCompany: Company;
  loading: boolean;
  categories: Categories[];

  setCompany: (company: Company) => void;
  setCompanies: (companies: Company[]) => void;
  pushCompany: (company: Company) => void;
  setCategories: (categories: Categories[]) => void;
};

const initialStateCompany: Company | null = {
  _id: "",
  name: "",
  logo: "",
  type: "",
};

export const useCompanyStore = create<CompanyStore>()(
  persist(
    (set, get) => ({
      companies: [],
      defaultCompany: null || initialStateCompany,
      loading: false,
      categories: [],

      setCompany: (company: Company) => set({ defaultCompany: company }),
      setCompanies: (companies: Company[]) => set({ companies }),
      pushCompany: (company: Company) => {
        const companies = get().companies;
        set({ companies: [...companies, company] });
      },
      setCategories: (categories: Categories[]) => set({ categories }),
    }),
    {
      name: "companies",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
