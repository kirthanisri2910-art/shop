export const getSession = () => ({
  isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
  userRole: localStorage.getItem('userRole') || 'owner',
  userName: localStorage.getItem('userName') || '',
  shopName: localStorage.getItem('shopName') || '',
});

export const setSession = ({ userRole, userName, shopName, shopAddress = '', shopEmail = '' }) => {
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('userRole', userRole);
  localStorage.setItem('userName', userName);
  localStorage.setItem('shopName', shopName);
  localStorage.setItem('shopAddress', shopAddress);
  localStorage.setItem('shopEmail', shopEmail);
};

export const clearSession = () => {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userName');
  localStorage.removeItem('shopName');
};

export const getShops = () => JSON.parse(localStorage.getItem('shops') || '[]');
export const saveShops = (shops) => localStorage.setItem('shops', JSON.stringify(shops));

export const getManagers = () => JSON.parse(localStorage.getItem('managers') || '[]');
export const saveManagers = (managers) => localStorage.setItem('managers', JSON.stringify(managers));

export const getWorkers = () => JSON.parse(localStorage.getItem('workers') || '[]');
export const saveWorkers = (workers) => localStorage.setItem('workers', JSON.stringify(workers));
