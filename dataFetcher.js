const isElectron = !!window.electron;

// Fetch Users
export const fetchUsers = async () => {
  if (isElectron) {
    return await window.electron.invoke("list-all-users");
  }
  return [
    { uid: "1", displayName: "John Doe", email: "john.doe@example.com", passwordHash: "hashed_password_1" },
    { uid: "2", displayName: "Jane Smith", email: "jane.smith@example.com", passwordHash: "hashed_password_2" },
  ];
};

// Fetch User Role
export const fetchUserRole = async (uid) => {
  if (isElectron) {
    return await window.electron.invoke("list-user-role", uid);
  }
  return "User";
};

// Fetch Products
export const fetchProducts = async () => {
  if (isElectron) {
    return await window.electron.invoke("list-all-products");
  }
  return [
    { id: "101", name: "Product A", quantity: 100, msrp: 200, description: "Sample Product A" },
    { id: "102", name: "Product B", quantity: 50, msrp: 300, description: "Sample Product B" },
  ];
};

// Add Product
export const addProduct = async (productData) => {
  if (isElectron) {
    return await window.electron.invoke("add-product", productData);
  }
  // Mock success response for web
  console.log("Mock add product:", productData);
  return { success: true, id: "103" };
};
