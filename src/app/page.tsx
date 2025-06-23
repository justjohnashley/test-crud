'use client'
import { useEffect, useState } from 'react'

type Product = {
  id: number
  name: string
  price: number
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [editing, setEditing] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const BACKEND = 'https://lightsalmon-hippopotamus-508199.hostingersite.com/api'

  const loadProducts = async () => {
    try {
      const res = await fetch(`${BACKEND}/getProduct.php`)
      if (!res.ok) throw new Error(`Error: ${res.status}`)
      type ProductResponse = {
        id: string | number
        name: string
        price: string | number
      }

      const data: ProductResponse[] = await res.json()
      setProducts(
        data.map(p => ({
          id: Number(p.id),
          name: p.name,
          price: Number(p.price),
        }))
      )

    } catch (err) {
      if (err instanceof Error) setError(err.message)
      else setError('Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handleSubmit = async () => {
    if (!name || !price) return

    const body = JSON.stringify({
      name,
      price: parseFloat(price),
      ...(editing && { id: editing.id }),
    })

    const url = editing
      ? `${BACKEND}/updateProduct.php`
      : `${BACKEND}/addProduct.php`

    await fetch(url, {
      method: 'POST', // ✅ Always use POST
      headers: { 'Content-Type': 'application/json' },
      body,
    })

    setName('')
    setPrice('')
    setEditing(null)
    loadProducts()
  }

  const handleDelete = async (id: number) => {
    await fetch(`${BACKEND}/deleteProduct.php`, {
      method: 'POST', // ✅ Use POST instead of DELETE
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })

    loadProducts()
  }

  const handleEdit = (product: Product) => {
    setEditing(product)
    setName(product.name)
    setPrice(product.price.toString())
  }

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📦 Product Manager</h1>

      {error && <p className="text-red-500">Error: {error}</p>}

      <div className="space-y-2 mb-4">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Product name"
          className="border p-2 w-full"
        />
        <input
          value={price}
          onChange={e => setPrice(e.target.value)}
          placeholder="Price"
          type="number"
          className="border p-2 w-full"
        />
        <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2">
          {editing ? 'Update' : 'Add'}
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <ul className="space-y-2">
          {products.map(p => (
            <li
              key={p.id}
              className="border p-3 flex justify-between items-center"
            >
              <span>{p.name}</span>
              <span>₱{p.price.toFixed(2)}</span>
              <div className="space-x-2">
                <button onClick={() => handleEdit(p)} className="text-blue-600">
                  Edit
                </button>
                <button onClick={() => handleDelete(p.id)} className="text-red-600">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
