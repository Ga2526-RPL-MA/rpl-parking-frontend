import Cookies from "universal-cookie";

const cookies = new Cookies();

export const getToken = (): string => cookies.get("@nexttemplate/token"); // Change with your token name

export const setToken = (token: string) => {
  cookies.set("@nexttemplate/token", token, { path: "/" }); // Change with your token name
};

export const removeToken = () =>
  cookies.remove("@nexttemplate/token", { path: "/" }); // Change with your token name
