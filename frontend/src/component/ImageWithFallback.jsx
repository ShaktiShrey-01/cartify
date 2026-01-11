import React, { useState } from 'react'

const ImageWithFallback = ({
  src,
  fallbackSrc,
  alt,
  className,
  loading = 'lazy',
  decoding = 'async',
}) => {
  const [imgSrc, setImgSrc] = useState(src)

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      loading={loading}
      decoding={decoding}
      onError={(e) => {
        if (fallbackSrc && imgSrc !== fallbackSrc) {
          // Helpful console warning in case of image decode/fetch issues
          if (typeof window !== 'undefined') {
            // eslint-disable-next-line no-console
            console.warn('Image failed, using fallback:', { alt, src: imgSrc, fallbackSrc })
          }
          setImgSrc(fallbackSrc)
        }
      }}
    />
  )
}

export default ImageWithFallback
