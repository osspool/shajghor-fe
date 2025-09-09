// api/user-data.js
"server-only";

import { handleApiRequest } from "./api-handler";

export const UserRole = {
  SUPER_ADMIN : 'super_admin',
  ADMIN : 'admin',
  SELLER : 'seller',
  CUSTOMER : 'customer',
} 

export const forgetPassApi = async (data) => {
  return handleApiRequest("POST", "/auth/forgot-password", {
    body: data,
  });
};

export const resetPassApi = async (data) => {
  console.log("resetPassApi", data);
  return handleApiRequest("POST", "/auth/reset-password", {
    body: data,
  });
};

export const getUser = async (email, token) => {
  const endpoint = `/users?email=${email}`;
  return handleApiRequest("GET", endpoint, { token });

};

export const getUserByPhone = async (phone, token) => {
  const endpoint = `/customers?phone=${phone}`;
  return handleApiRequest("GET", endpoint, { token });

};

export async function createUser(name, email, password, phone, address) {
  const endpoint = "/auth/register";
  return handleApiRequest("POST", endpoint, { body: { name, email, password, phone, address } });
}

export const getProfile = async (token) => {
  return handleApiRequest("GET", "/auth/profile", { token });
};

export const updateUser = async (token, userId, data) => {
  return handleApiRequest("PATCH", `/users/${userId}`, {
    token,
    body: data,
  });
};

export const updateBusinessInfo = async (token, userId, businessData) => {
  return handleApiRequest("PATCH", `/users/${userId}/business-info`, {
    token,
    body: businessData,
  });
};



