import { api } from "./http";

export type DemandStatus =
  | "PENDING"
  | "ACCEPTED"
  | "CANCELED"
  | "FULFILLED"
  | string;

export type DonationDemandItem = {
  id?: string;
  category: string;
  description: string;
  quantity: number;
};

export type DonationDemand = {
  id: string;
  beneficiaryId: string;
  status: DemandStatus;
  notes?: string;
  items: DonationDemandItem[];
};

export type CreateDemandRequest = {
  beneficiaryId?: string | null;
  deliveryLocation: {
    street: string;
    number: string;
    district: string;
    city: string;
    state: string;
  };
  items: DonationDemandItem[];
  notes?: string;
};

export async function createDemand(payload: CreateDemandRequest) {
  const res = await api.post<DonationDemand>("/demands", payload);
  return res.data;
}

export async function getDemandsByBeneficiary(beneficiaryId: string) {
  const res = await api.get<DonationDemand[]>(`/demands/beneficiary/${beneficiaryId}/`);
  return res.data;
}

export async function getAllDemands() {
  const res = await api.get<DonationDemand[]>("/demands");
  return res.data;
}

export async function getDemandById(id: string) {
  const res = await api.get<DonationDemand>(`/demands/${id}`);
  return res.data;
}

export async function markDemandAccepted(id: string) {
  const res = await api.patch<DonationDemand>(`/demands/${id}/accepted`);
  return res.data;
}

export async function markDemandCanceled(id: string) {
  const res = await api.patch<DonationDemand>(`/demands/${id}/canceled`);
  return res.data;
}

export async function markDemandFulfilled(id: string) {
  const res = await api.patch<DonationDemand>(`/demands/${id}/fulfilled`);
  return res.data;
}
