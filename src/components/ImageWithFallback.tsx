import { useState, memo } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

const ImageWithFallback = memo(({ fallbackSrc = '/placeholder.svg', onError, ...props }: ImageWithFallbackProps) => {
  const [errored, setErrored] = useState(false);

  return (
    <img
      {...props}
      src={errored ? fallbackSrc : props.src}
      onError={(e) => {
        if (!errored) {
          setErrored(true);
          (e.target as HTMLImageElement).src = fallbackSrc;
        }
        onError?.(e);
      }}
    />
  );
});
ImageWithFallback.displayName = 'ImageWithFallback';

export default ImageWithFallback;
