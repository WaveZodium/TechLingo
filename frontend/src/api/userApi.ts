import api from "./api";

export async function deleteAccount() {
  await api.delete("/user/account");
}
