import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import type { Product } from "../../types/product.types"
import { CiEdit, CiTrash } from "react-icons/ci"
import { IoIosAdd, IoIosArrowBack } from "react-icons/io"

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(true)
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const getProducts = async () => {
      try{
        const res = await fetch("http://localhost:3000/admin/products", {
          credentials: "include",
        })
        if(res.status === 403){
          navigate('/profile')
          return
        }
        if(!res.ok) throw new Error('Failed to fetch products.');

        const data = await res.json()
        setProducts(data)
      } catch(err) {
        console.error(err)
        return
      } finally {
        setLoading(false)
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

  const handleBack = () => {
    navigate('/profile')
  }

  if(loading) return <p>Loading...</p>

  return (
    <div className="text-slate-900 font-[Lora] md:mx-auto">
      <header className="border-b border-slate-200">
        <div className="flex justify-between p-4 md:max-w-4xl md:mx-auto">
          <button onClick={handleBack} className="hover:opacity-50 hover:cursor-pointer trnasition">
            <IoIosArrowBack />
          </button>
          <h1 className="font-medium text-lg">Manage Products</h1>
          <span className="w-4"></span>
        </div>
      </header>
      <ul className="mb-8 sm:flex sm:flex-wrap md:max-w-4xl md:mx-auto">
        {products.map((i) => (
          <li key={i._id} className="p-5 flex border-b border-slate-200 gap-3 sm:min-w-1/2">
            <div className="w-24 h-32 overflow-hidden rounded-md">
              <img src={i.imageUrl} alt={i.name} className="object-cover w-full h-full" />
            </div>
            <div className="flex flex-col justify-between w-57">
              <dl className="text-sm">
                <dt>{i.name}</dt>
                <dd className="mt-2">${i.price}</dd>
              </dl>
              <div className="ml-auto flex gap-2">
                <button onClick={() => navigate(`/admin/products/edit/${i._id}`)} className="border-2 border-slate-200 rounded-md p-2 hover:bg-[#4CD4711a] hover:cursor-pointer transition">
                  <CiEdit className="fill-[#4CD47199] size-6" />
                </button>
                <button onClick={() => handleDelete(i._id)} className="border-2 border-slate-200 rounded-md p-2 hover:bg-[#D3180C1a] hover:cursor-pointer transition">
                  <CiTrash className="fill-[#D3180C99] size-6" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <button onClick={() => navigate("/admin/products/new")} className="bg-slate-900 fixed bottom-5 right-5 z-10 size-12 rounded-full flex items-center justify-center">
        <IoIosAdd className="fill-white size-6" />
      </button>
    </div>
  )
}

export default AdminDashboard