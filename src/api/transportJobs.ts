import { api } from "./http";

export type TransportStatus =
  | "ASSIGNED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "DELIVERED"
  | string;

export type TransportJob = {
  id: string;
  donationId: string;
  transporterId: string;
  status: TransportStatus;
  assignedAt: string;
  pickedUpAt?: string | null;
  deliveredAt?: string | null;
  updatedAt: string;
};

export type CreateTransportJobRequest = {
  donationId: string;
  transporterId?: string;
};

export async function createTransportJob(payload: CreateTransportJobRequest) {
  const res = await api.post<TransportJob>("/transportjob", payload);
  return res.data;
}

export async function getTransportJobById(id: string) {
  const res = await api.get<TransportJob>(`/transportjob/${id}`);
  return res.data;
}


export async function getTransportJobsByTransporter(transporterId: string) {
  const res = await api.get<TransportJob[]>(`/transportjob/transporter/${transporterId}`);
  return res.data;
}

export async function markTransportJobInTransit(id: string) {
  const res = await api.patch<TransportJob>(`/transportjob/${id}/intransit`);
  return res.data;
}

export async function markTransportJobDelivered(id: string) {
  const res = await api.patch<TransportJob>(`/transportjob/${id}/delivered`);
  return res.data;
}
