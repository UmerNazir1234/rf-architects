import React from 'react'
import ProductPage from './_components/ProductPage';
import { products } from '@/lib/products';

// Return a list of `params` to populate the [id] dynamic segment
export async function generateStaticParams() {
    return products.map((product) => ({
        id: product.id,
    }))
}

const page = () => {
    return <ProductPage />
}

export default page