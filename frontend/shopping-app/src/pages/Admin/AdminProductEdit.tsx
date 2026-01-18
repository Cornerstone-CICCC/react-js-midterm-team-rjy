import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import AdminProductForm, { type ProductFormData } from "./AdminProductForm"

const AdminProductEdit = () => {
  const navigate = useNavigate()

  const { id } = useParams()
  const [product, setProduct] = useState<ProductFormData | null>(null)

  useEffect(() => {
    fetch(`http://localhost:3000/admin/products/${id}`, {
      credentials: "include",
    })
    .then((res) => res.json())
    .then(setProduct)
  }, [id])

  const handleUpdate = async (data: ProductFormData) => {
    try{
      const res = await fetch(`http://localhost:3000/admin/products/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(data),
      })
      if(!res.ok) throw new Error("Failed to update product.")
      navigate("/admin")
    } catch(err) {
      console.error(err)
      alert('Failed to update product.')
    }
  }

  if(!product) return <p>Loading...</p>

  return (
    <AdminProductForm
      formTitle="Update product"
      submitLabel="Update"
      initialData={{
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        description: product.description
      }}
      onSubmit={handleUpdate}
    />
  )
}

export default AdminProductEdit