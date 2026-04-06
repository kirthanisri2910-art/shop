export const getSession = () => ({
  isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
  userRole: localStorage.getItem("userRole") || "owner",
  shopName: localStorage.getItem("shopName") || "",
});
