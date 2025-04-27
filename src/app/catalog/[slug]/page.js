"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './product.module.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer.jsx';

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${slug}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Ошибка при загрузке товара:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(value, 10));
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    // Здесь будет логика добавления в корзину
    console.log('Добавлено в корзину:', { product, quantity });
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className={styles.loading}>
          <div className={styles.loadingSpinner} />
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className={styles.error}>
          <h1>Товар не найден</h1>
          <Link href="/catalog" className={styles.backLink}>
            Вернуться в каталог
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.breadcrumbs}>
            <Link href="/" className={styles.breadcrumbLink}>Главная</Link>
            <span className={styles.separator}>/</span>
            <Link href="/catalog" className={styles.breadcrumbLink}>Каталог</Link>
            <span className={styles.separator}>/</span>
            <span className={styles.current}>{product.name}</span>
          </div>

          <div className={styles.product}>
            <div className={styles.gallery}>
              <div className={styles.mainImage}>
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name}
                    width={600}
                    height={600}
                    className={styles.image}
                  />
                ) : (
                  <div className={styles.noImage}>
                    Нет изображения
                  </div>
                )}
              </div>
              
              {product.images && product.images.length > 1 && (
                <div className={styles.thumbnails}>
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      className={`${styles.thumbnail} ${selectedImage === index ? styles.active : ''}`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} - изображение ${index + 1}`}
                        width={100}
                        height={100}
                        className={styles.thumbnailImage}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.info}>
              <h1 className={styles.title}>{product.name}</h1>
              
              <div className={styles.category}>
                Категория: {product.category?.name || 'Без категории'}
              </div>

              <div className={styles.price}>
                {new Intl.NumberFormat('ru-RU', {
                  style: 'currency',
                  currency: 'RUB'
                }).format(product.price)}
              </div>

              <div className={styles.stock}>
                <span className={`${styles.stockStatus} ${product.inStock ? styles.inStock : styles.outOfStock}`}>
                  {product.inStock ? 'В наличии' : 'Нет в наличии'}
                </span>
              </div>

              <div className={styles.description}>
                <h2 className={styles.descriptionTitle}>Описание</h2>
                <p>{product.description || 'Описание отсутствует'}</p>
              </div>

              {product.inStock && (
                <div className={styles.actions}>
                  <div className={styles.quantity}>
                    <button
                      className={styles.quantityButton}
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      className={styles.quantityInput}
                    />
                    <button
                      className={styles.quantityButton}
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= 10}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className={styles.addToCartButton}
                    onClick={handleAddToCart}
                  >
                    Добавить в корзину
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 