import { api } from "./http";

export type Transporter = {
  id: string;
  displayName: string;
  document: string;
  phone: {
    digits: string;
  };
  address: {
    street: string;
    number: string;
    district: string;
    city: string;
    state: string;
  };
};

export type ChangeAddressRequest = {
  newAddress: {
    street: string;
    number: string;
    district: string;
    city: string;
    state: string;
  };
};

export type ChangePhoneRequest = {
  phoneBR: {
    digits: string;
  };
};

export type ChangeDisplayNameRequest = {
  newDisplayName: string;
};

export async function getMyTransporter() {
  const res = await api.get<Transporter>("/transporters/me");
  return res.data;
}

export async function changeMyTransporterAddress(payload: ChangeAddressRequest) {
  const res = await api.patch<Transporter>("/transporters/me/changeaddress", payload);
  return res.data;
}

export async function changeMyTransporterPhone(payload: ChangePhoneRequest) {
  const res = await api.patch<Transporter>("/transporters/me/changephone", payload);
  return res.data;
}

export async function changeMyTransporterDisplayName(payload: ChangeDisplayNameRequest) {
  const res = await api.patch<Transporter>("/transporters/me/changedisplayname", payload);
  return res.data;
}
