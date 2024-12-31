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

interface Worker {
  _id: string;
  name: string;
  email: string;
}

type CompanyStore = {
  companies: Company[];
  defaultCompany: Company;
  loading: boolean;
  categories: Categories[];
  workers: Worker[];

  setCompany: (company: Company) => void;
  setCompanies: (companies: Company[]) => void;
  pushCompany: (company: Company) => void;
  setCategories: (categories: Categories[]) => void;
  setWorkers: (workers: Worker[]) => void;
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
      defaultCompany: initialStateCompany,
      loading: false,
      categories: [],
      workers: [],

      setCompany: (company: Company) => set({ defaultCompany: company }),
      setCompanies: (companies: Company[]) => set({ companies }),
      pushCompany: (company: Company) => {
        const companies = get().companies;
        set({ companies: [...companies, company] });
      },
      setCategories: (categories: Categories[]) => set({ categories }),
      setWorkers: (workers: Worker[]) => set({ workers }),
    }),
    {
      name: "companies",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
