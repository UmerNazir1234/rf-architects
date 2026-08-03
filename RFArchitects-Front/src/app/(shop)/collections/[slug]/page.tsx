import { collections } from '@/lib/collections'
import React from 'react'
import CollectionPage from './_components/CollectionPage'

// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
    return collections.map((collection) => ({
        slug: collection.slug,
    }))
}


const page = () => {
    return <CollectionPage />
}

export default page