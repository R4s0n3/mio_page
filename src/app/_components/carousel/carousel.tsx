'use client'
import React from 'react'
import type { EmblaOptionsType } from 'embla-carousel'
import { DotButton, useDotButton } from './carousel-dot-button'
import {
  PrevButton,
  NextButton,
  usePrevNextButtons
} from './carousel-arrow-button'
import Image from 'next/image'
import Link from 'next/link'
import useEmblaCarousel from 'embla-carousel-react'
import type { ProductItemType } from '../merch-carousel'
import { priceToDisplay } from '@/server/util/functions'

type PropType = {
  slides: ProductItemType[]
  options?: EmblaOptionsType
}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options)

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi)

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  return (
    <section className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((slide,index) => (
            <div className="embla__slide group cursor-pointer text-headings transform-gpu flex-grow-0 flex-shrink-0 basis-full lg:basis-3/4 min-w-0 aspect-video relative overflow-hidden rounded border-2 border-secondary-800/20 bg-secondary-800/20" key={index}>
              <div className='absolute size-full rounded overflow-hidden z-20 group-hover:scale-105 transition duration-500'>
                <Image width={1920} quality={100} height={1080} src={slide.image ?? ""} alt="shirt" />
                </div>
              <div className="embla__slide__number p-8 pt-4 z-30 flex flex-col justify-between h-full relative" >
                <h2 className='text-5xl lg:text-9xl font-headline group-hover:text-accent transition duration-300 '>{slide.type}</h2>
              <div className='hidden lg:flex flex-col gap-5'>
                <h5 className='text-xl lg:text-3xl font-subhead'>{slide.name}</h5>
                <p className='w-full max-w-sm text-sm lg:text-lg font-text'>{slide.description}</p>
       
              </div>
              <div className='flex justify-between'>
                <h5 className='text-3xl font-subhead'>{priceToDisplay(slide.price ?? 0).toFixed(2)}€</h5>
                <Link className=' transition duration-300 text-3xl font-subhead group-hover:text-accent' href={`https://shop.miomideal.com/product/${slide.id}`}>Buy now</Link>
              </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="embla__controls">
        <div className="embla__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>

        <div className="embla__dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={'embla__dot'.concat(
                index === selectedIndex ? ' embla__dot--selected' : ''
              )}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default EmblaCarousel
