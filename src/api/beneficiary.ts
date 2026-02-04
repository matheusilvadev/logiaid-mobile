import { api } from "./http";

export type Beneficiary = {
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

export async function getMyBeneficiary() {
  const res = await api.get<Beneficiary>("/beneficiaries/me");
  return res.data;
}

export async function changeMyBeneficiaryAddress(payload: ChangeAddressRequest) {
  const res = await api.patch<Beneficiary>("/beneficiaries/me/changeaddress", payload);
  return res.data;
}

export async function changeMyBeneficiaryPhone(payload: ChangePhoneRequest) {
  const res = await api.patch<Beneficiary>("/beneficiaries/me/changephone", payload);
  return res.data;
}

export async function changeMyBeneficiaryDisplayName(payload: ChangeDisplayNameRequest) {
  const res = await api.patch<Beneficiary>("/beneficiaries/me/changedisplayname", payload);
  return res.data;
}
