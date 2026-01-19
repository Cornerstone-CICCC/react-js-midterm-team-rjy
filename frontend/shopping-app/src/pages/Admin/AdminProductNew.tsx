import { useNavigate } from "react-router-dom"
import AdminProductForm, { type ProductFormData } from "./AdminProductForm"

const AdminProductNew = () => {
  const navigate = useNavigate()

  const handleCreate = async (data: ProductFormData) => {
    try{
      const res = await fetch("http://localhost:3000/admin/products", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if(!res.ok) throw new Error("Failed to create new product.")
      navigate("/admin")
    } catch(err) {
      console.error(err)
      alert('Failed to create new product.')
    }
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