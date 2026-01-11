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
      onError={() => {
        if (fallbackSrc && imgSrc !== fallbackSrc) {
          setImgSrc(fallbackSrc)
        }
      }}
    />
  )
}

export default ImageWithFallback
