import EmblaCarousel from './carousel/carousel'
import "@/styles/carousel/style.css"

export type ProductItemType = {
    type: string;
    description: string | null;
    id: string;
    name: string;
    image: string | null;
    price: number | null;
}

type MerchCarouselProps = {
    items: ProductItemType[]
}

export default function MerchCarousel(props:MerchCarouselProps){
    return <EmblaCarousel slides={props.items} options={{}} />
}