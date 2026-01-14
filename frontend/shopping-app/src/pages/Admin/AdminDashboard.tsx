import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import type { Product } from "../../types/product.types"

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const getProducts = async () => {
      try{
        const res = await fetch("http://localhost:3000/admin/products", {
          credentials: "include",
        })
        if(!res.ok){
          throw new Error('Failed to fetch products.')
        }
        const data = await res.json()
        setProducts(data)
      } catch(err) {
        console.error(err)
        return
      }
    }

    getProducts()
  }, [])

  const handleDelete = async (id: string) => {
    if(!confirm("Are you sure to delete product?")) return

    await fetch(`http://localhost:3000/admin/products/${id}`, {
      method: "DELETE",
      credentials: "include",
    })

    setProducts((prev) => prev.filter((p) => p._id !== id))
  } 

  return (
    <div className="admin">
      <h1>Admin Products List</h1>
      <ul>
        {products.map((i) => (
          <li key={i._id}>
            {i.name}
            <img src={i.imageUrl} alt={i.name} />
            <button onClick={() => navigate(`/admin/products/edit/${i._id}`)}>Edit</button>
            <button onClick={() => handleDelete(i._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AdminDashboard