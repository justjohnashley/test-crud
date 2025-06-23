'use client'
import { useEffect, useState } from 'react'

type Product = { id: number; name: string; price: number }

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [editing, setEditing] = useState<Product | null>(null)

  const BACKEND = 'https://lightsalmon-hippopotamus-508199.hostingersite.com/api' // 🔁 CHANGE TO YOUR HOSTINGER DOMAIN

  const loadProducts = async () => {
    const res = await fetch(`${BACKEND}/getProducts.php`)
    const data = await res.json()
    setProducts(data)
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const addOrUpdateProduct = async () => {
    const body = JSON.stringify({ name, price: parseFloat(price), ...(editing && { id: editing.id }) })
    const url = editing ? `${BACKEND}/updateProduct.php` : `${BACKEND}/addProduct.php`
    const method = editing ? 'PUT' : 'POST'

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body,
    })
    setName('')
    setPrice('')
    setEditing(null)
    loadProducts()
  }

  const removeProduct = async (id: number) => {
    await fetch(`${BACKEND}/deleteProduct.php`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    loadProducts()
  }

  const startEdit = (p: Product) => {
    setEditing(p)
    setName(p.name)
    setPrice(String(p.price))
  }

  return (
    <main className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Product Manager</h1>

      <div className="mb-4 space-y-2">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="border w-full p-2" />
        <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" type="number" className="border w-full p-2" />
        <button onClick={addOrUpdateProduct} className="bg-blue-600 text-white px-4 py-2">
          {editing ? 'Update' : 'Add'}
        </button>
      </div>

      <ul className="space-y-2">
        {products.map(p => (
          <li key={p.id} className="border p-2 flex justify-between items-center">
            <span>{p.name} - ₱{p.price}</span>
            <div className="space-x-2">
              <button onClick={() => startEdit(p)} className="text-blue-600">Edit</button>
              <button onClick={() => removeProduct(p.id)} className="text-red-600">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}
