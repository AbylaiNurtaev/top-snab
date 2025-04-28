import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import FormattedText from '@/components/FormattedText/FormattedText';
import styles from './ProductPage.module.css';

async function getProduct(slug) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${slug}`, {
    cache: 'no-store'
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className={styles.container}>
      <div className={styles.product}>
        <div className={styles.imageSection}>
          <div className={styles.mainImage}>
            <Image
              src={product.images[0] || '/placeholder.png'}
              alt={product.name}
              width={600}
              height={600}
              className={styles.image}
            />
          </div>
          {product.images.length > 1 && (
            <div className={styles.thumbnails}>
              {product.images.map((image, index) => (
                <div key={index} className={styles.thumbnail}>
                  <Image
                    src={image}
                    alt={`${product.name} - изображение ${index + 1}`}
                    width={100}
                    height={100}
                    className={styles.thumbnailImage}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className={styles.info}>
          <h1 className={styles.name}>{product.name}</h1>
          <div className={styles.price}>
            {product.price.toLocaleString('ru-RU')} ₽
          </div>
          
          <div className={styles.description}>
            <FormattedText content={product.description} />
          </div>
          
          <div className={styles.actions}>
            <button className={styles.addToCartButton}>
              Добавить в корзину
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 