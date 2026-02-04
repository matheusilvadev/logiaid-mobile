import { api } from "./http";

export type Donor = {
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

export async function getMyDonor() {
  const res = await api.get<Donor>("/donors/me");
  return res.data;
}

export async function changeMyDonorAddress(payload: ChangeAddressRequest) {
  const res = await api.patch<Donor>("/donors/me/changeaddress", payload);
  return res.data;
}

export async function changeMyDonorPhone(payload: ChangePhoneRequest) {
  const res = await api.patch<Donor>("/donors/me/changephone", payload);
  return res.data;
}

export async function changeMyDonorDisplayName(payload: ChangeDisplayNameRequest) {
  const res = await api.patch<Donor>("/donors/me/changedisplayname", payload);
  return res.data;
}
