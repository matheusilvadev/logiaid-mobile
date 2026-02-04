import { jwtDecode } from "jwt-decode";
import { KEYCLOAK_BASE_URL, KEYCLOAK_CLIENT_ID, KEYCLOAK_REALM, UserRole } from "../config";

type KeycloakTokenResponse = {
  access_token: string;
  refresh_token: string;
  id_token?: string;
  expires_in: number;
};

type DecodedToken = {
  sub: string;
  preferred_username?: string;
  email?: string;
  realm_access?: {
    roles?: string[];
  };
};

export type AuthenticatedUser = {
  userIdFromKeycloak: string;
  username?: string;
  email?: string;
  roles: UserRole[];
};

export async function loginWithKeycloak(username: string, password: string) {
  const url = `${KEYCLOAK_BASE_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`;

  const body = new URLSearchParams({
    grant_type: "password",
    client_id: KEYCLOAK_CLIENT_ID,
    username,
    password,
  });

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    throw new Error("Credenciais inválidas");
  }

  const data = (await res.json()) as KeycloakTokenResponse;
  const decoded = jwtDecode<DecodedToken>(data.access_token);

  const roles = (decoded.realm_access?.roles || [])
    .filter((r): r is UserRole =>
      ["BENEFICIARY", "DONOR", "TRANSPORTER", "ADMIN"].includes(r)
    );

  const user: AuthenticatedUser = {
    userIdFromKeycloak: decoded.sub,
    username: decoded.preferred_username,
    email: decoded.email,
    roles,
  };

  return {
    tokens: data,
    user,
  };
}
