"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import styles from './product.module.css';
import Link from 'next/link';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Товар не найден');
        }
        const data = await response.json();
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке товара:', error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className={styles.loading}>Загрузка товара...</div>;
  }

  if (!product) {
    return (
      <div className={styles.errorContainer}>
        <h2>Товар не найден</h2>
        <Link href="/catalog" className={styles.backLink}>
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.productContainer}>
      <Link href="/catalog" className={styles.backLink}>
        ← Вернуться в каталог
      </Link>
      
      <div className={styles.productContent}>
        <div className={styles.productGallery}>
          {product.images && product.images.length > 0 ? (
            <>
              <div className={styles.mainImageContainer}>
                <img 
                  src={product.images[activeImageIndex]} 
                  alt={product.name} 
                  className={styles.mainImage}
                />
              </div>
              
              {product.images.length > 1 && (
                <div className={styles.thumbnailsContainer}>
                  {product.images.map((image, index) => (
                    <div 
                      key={index} 
                      className={`${styles.thumbnail} ${index === activeImageIndex ? styles.active : ''}`}
                      onClick={() => setActiveImageIndex(index)}
                    >
                      <img src={image} alt={`${product.name} - изображение ${index + 1}`} />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className={styles.noImage}>Нет изображения</div>
          )}
        </div>
        
        <div className={styles.productDetails}>
          <h1 className={styles.productName}>{product.name}</h1>
          
          <div className={styles.productDescription}>
            <h2>Описание</h2>
            <p>{product.description}</p>
          </div>
          
          {product.specifications && product.specifications.length > 0 && (
            <div className={styles.productSpecifications}>
              <h2>Технические характеристики</h2>
              <ul>
                {product.specifications.map((spec, index) => (
                  <li key={index}>
                    <span className={styles.specName}>{spec.name}:</span>
                    <span className={styles.specValue}>{spec.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {product.components && product.components.length > 0 && (
            <div className={styles.productComponents}>
              <h2>Комплектация</h2>
              <ul>
                {product.components.map((component, index) => (
                  <li key={index}>{component}</li>
                ))}
              </ul>
            </div>
          )}
          
          {product.variants && product.variants.length > 0 && (
            <div className={styles.productVariants}>
              <h2>Варианты исполнения</h2>
              <ul>
                {product.variants.map((variant, index) => (
                  <li key={index}>{variant}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage; 