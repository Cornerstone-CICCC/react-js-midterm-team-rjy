import { useState, type ChangeEvent, type FormEvent } from "react";

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

  return (
    <div className="admin">
      <h1>{formTitle}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Product name"
          />
        </div>
        <div>
          <label>Price</label>
          <input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            placeholder="Product price"
          />
        </div>
        <div>
          <label>Image URL</label>
          <input
            name="imageUrl"
            type="text"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="Product Image URL"
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Product description"
          />
        </div>
        <button type="submit">{submitLabel}</button>
      </form>
    </div>
  )
}

export default AdminProductForm