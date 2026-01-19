import { useState, type ChangeEvent, type FormEvent } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export type ProductFormData = {
  name: string,
  price: number,
  imageUrl: string,
  description: string
}

type Props = {
  initialData: ProductFormData
  onSubmit: (data: ProductFormData) => Promise<void>
  formTitle: string
  submitLabel: string
}

const AdminProductForm = ({
  initialData,
  onSubmit,
  formTitle,
  submitLabel,
}: Props) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<ProductFormData>(initialData)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    setFormData((current) => ({
      ...current,
      [name]: name === "price" ? Number(value) : value
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const handleBack = () => {
    navigate('/admin')
  }

  return (
    <div className="text-slate-900">
      <header className="border-b border-slate-200">
        <div className="flex justify-between p-4 md:max-w-4xl md:mx-auto">
          <button onClick={handleBack} className="hover:opacity-50 hover:cursor-pointer trnasition">
            <IoIosArrowBack />
          </button>
          <h1 className="font-[Lora] font-medium text-lg">{formTitle}</h1>
          <span className="w-4"></span>
        </div>
      </header>
      <form onSubmit={handleSubmit} className="p-5 md:max-w-4xl md:mx-auto">
        <div>
          <label className="text-sm">Name</label>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Product name"
            className="w-full bg-slate-200 rounded-md p-3 mt-1 mb-3 border border-slate-200 outline-none focus:border-slate-900"
          />
        </div>
        <div>
          <label className="text-sm">Price</label>
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            placeholder="Product price"
            className="w-full bg-slate-200 rounded-md p-3 mt-1 mb-3 border border-slate-200 outline-none focus:border-slate-900"
          />
        </div>
        <div>
          <label className="text-sm">Image URL</label>
          <input
            name="imageUrl"
            type="text"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="Product Image URL"
            className="w-full bg-slate-200 rounded-md p-3 mt-1 mb-3 border border-slate-200 outline-none focus:border-slate-900"
          />
        </div>
        <div>
          <label className="text-sm">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Product description"
            className="w-full bg-slate-200 rounded-md p-3 mt-1 mb-8 border border-slate-200 outline-none focus:border-slate-900"
          />
        </div>
        <button type="submit" className="bg-slate-900 text-white rounded-md p-4 w-full hover:bg-slate-800 hover:cursor-pointer transition">{submitLabel}</button>
      </form>
    </div>
  )
}

export default AdminProductForm