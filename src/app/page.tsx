'use client'
import { useEffect, useState } from 'react'

type Product = {
  id: number
  name: string
  price: number
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const BACKEND = 'https://lightsalmon-hippopotamus-508199.hostingersite.com/api'

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch(`${BACKEND}/getProduct.php`)
        if (!res.ok) throw new Error(`Error: ${res.status}`)
        const data = await res.json()
        setProducts(data)
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('Unknown error')
        }
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📦 Product List</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Failed: {error}</p>}

      {!loading && products.length === 0 && <p>No products found.</p>}

      <ul className="space-y-2">
        {products.map(product => (
          <li key={product.id} className="border p-3 flex justify-between items-center">
            <span>{product.name}</span>
            <span className="font-bold">₱{Number(product.price).toFixed(2)}</span>

          </li>
        ))}
      </ul>
    </main>
  )
}
