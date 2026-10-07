type ImgProps = {
  readonly src: string;
  readonly alt: string;
  readonly className?: string;
  /** Imagem acima da dobra (LCP): carrega já, com prioridade alta. */
  readonly priority?: boolean;
  readonly sizes?: string;
};

export function Img({ src, alt, className = "", priority = false, sizes }: ImgProps) {
  return (
    <img
      src={src}
      alt={alt}
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      className={className}
    />
  );
}
