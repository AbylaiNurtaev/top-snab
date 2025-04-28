import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import FormattedText from '../FormattedText/FormattedText';
import styles from './ProductCard.module.css';

const ProductCard = ({ product }) => {
  const { addToCart, cart } = useCart();
  const cartItem = cart.find(item => item._id.toString() === product._id.toString());
  const quantity = cartItem ? cartItem.quantity : 0;
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  const handleIncrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleDecrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity > 1) {
      addToCart(product, -1);
    }
  };

  return (
    <div className={styles.card}>
      <Link href={`/products/${product.slug}`} className={styles.imageContainer}>
        <Image
          src={product.images[0] || '/placeholder.png'}
          alt={product.name}
          width={300}
          height={300}
          className={styles.image}
        />
      </Link>
      <div className={styles.content}>
        <Link href={`/products/${product.slug}`} className={styles.title}>
          {product.name}
        </Link>
        <div className={styles.description}>
          <FormattedText content={product.description} />
        </div>
        <div className={styles.footer}>
          <div className={styles.price}>
            {product.price.toLocaleString('ru-RU')} ₽
          </div>
          <Link href={`/products/${product.slug}`} className={styles.button}>
            Подробнее
          </Link>
        </div>
      </div>
      
      <div className={styles.actions}>
        {quantity > 0 ? (
          <div className={styles.quantityControls}>
            <button 
              className={styles.quantityButton}
              onClick={handleDecrement}
              aria-label="Уменьшить количество"
            >
              -
            </button>
            <span className={styles.quantity}>{quantity}</span>
            <button 
              className={styles.quantityButton}
              onClick={handleIncrement}
              aria-label="Увеличить количество"
            >
              +
            </button>
          </div>
        ) : (
          <button 
            className={`${styles.addButton} ${isAdding ? styles.adding : ''}`}
            onClick={handleAddToCart}
            disabled={isAdding}
          >
            {isAdding ? 'В корзине' : 'В корзину'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard; 