import AdminProductForm, { type ProductFormData } from "./AdminProductForm"


const AdminProductNew = () => {
  const handleCreate = async (data: ProductFormData) => {
    await fetch("http://localhost:3000/admin/products", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
  }

  return (
    <AdminProductForm
      formTitle="Add new product"
      submitLabel="Add"
      initialData={{
        name: '',
        price: 0,
        imageUrl: '',
        description: '',
      }}
      onSubmit={handleCreate}
    />
  )
}

export default AdminProductNew