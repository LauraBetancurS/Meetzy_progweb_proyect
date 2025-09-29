import type { PromoBannerProps } from '../../../types/ui'
import './PromoBanner.css'

export default function PromoBanner({ imageUrl, title = 'Meetzy', subtitle = 'Plan fast. Vibe together.', className = '' }: PromoBannerProps) {
  return (
    <div className={`promo ${className}`}>
      <img src={imageUrl} alt={title} className="promo__img" />
      <div className="promo__overlay">
        <div className="promo__title">{title}</div>
        <div className="promo__subtitle">{subtitle}</div>
      </div>
    </div>
  )
}
