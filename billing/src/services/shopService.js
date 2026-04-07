export const getShopInfo = () => ({
  shopName: localStorage.getItem('shopName') || 'My Shop',
  shopAddress: localStorage.getItem('shopAddress') || '',
  shopPhone: localStorage.getItem('shopPhone') || '',
  shopGST: localStorage.getItem('shopGST') || '',
});

export const saveShopInfo = ({ shopName, shopAddress, shopPhone, shopGST }) => {
  localStorage.setItem('shopName', shopName);
  localStorage.setItem('shopAddress', shopAddress);
  localStorage.setItem('shopPhone', shopPhone);
  localStorage.setItem('shopGST', shopGST);
};
