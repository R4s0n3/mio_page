'use client'
import { api } from '@/trpc/react';
import EmblaCarousel from './carousel/carousel'
import "@/styles/carousel/style.css"
import LoadingSpinner from './loading-spinner';

export type ProductItemType = {
    type: string;
    description: string | null;
    id: string;
    name: string;
    image: string | null;
    price: number | null;
}

export default function MerchCarousel(){
    const {data:items, isLoading} = api.product.getMerch.useQuery()
    
    if(isLoading) return <LoadingSpinner />

    const madeItems = items?.map(i => ({
        id: i.id,
        description: i.description,
        name: i.name,
        type: i.type.name,
        image:i.image,
        price: i.price
    })) ?? []
    
    return <EmblaCarousel slides={madeItems} options={{}} />
}