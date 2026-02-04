import { api } from "./http";

export type DonationStatus =
  | "CREATED"
  | "WAITING_TRANSPORT"
  | "IN_TRANSIT"
  | "DELIVERED"
  | string;

export type Donation = {
  id: string;
  demandId: string;
  donorId: string;
  status: DonationStatus;
};

export type CreateDonationRequest = {
  demandId: string;
  street: string;
  number: string;
  district: string;
  city: string;
  state: string;
};

export async function createDonation(payload: CreateDonationRequest) {
  const res = await api.post<Donation>("/donations", payload);
  return res.data;
}

export async function getDonationById(id: string) {
  const res = await api.get<Donation>(`/donations/${id}`);
  return res.data;
}

export async function getDonationsByDonor(donorId: string) {
  const res = await api.get<Donation[]>(`/donations/donor/${donorId}`);
  return res.data;
}

