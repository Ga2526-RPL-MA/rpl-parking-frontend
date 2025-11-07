import Cookies from "universal-cookie";

const cookies = new Cookies();

// ✅ Get token
export function getToken() {
  const token = cookies.get("auth_token");
  console.log("[getToken] token:", token);
  return token;
}

// ✅ Set token
export const setToken = (token: string) => {
  cookies.set("auth_token", token, { path: "/" }); 
};

// ✅ Remove token
export const removeToken = () => cookies.remove("auth_token", { path: "/" });
