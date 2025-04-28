"use client";

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import styles from './Cart.module.css';

export default function Cart() {
  const { cart, isOpen, totalItems, totalPrice, removeFromCart, updateQuantity, toggleCart } = useCart();
  const cartRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        toggleCart();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, toggleCart]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB'
    }).format(price);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.cartOverlay}>
      <div className={styles.cartContainer} ref={cartRef}>
        <div className={styles.cartHeader}>
          <h2 className={styles.cartTitle}>Корзина</h2>
          <button className={styles.closeButton} onClick={toggleCart}>×</button>
        </div>

        {cart.length === 0 ? (
          <div className={styles.emptyCart}>
            <div className={styles.emptyCartIcon}>🛒</div>
            <p>Ваша корзина пуста</p>
            <Link href="/catalog" className={styles.continueShopping} onClick={toggleCart}>
              Перейти к покупкам
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.cartItems}>
              {cart.map((item) => (
                <div key={item._id} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    {item.images && item.images.length > 0 ? (
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        width={80}
                        height={80}
                        className={styles.image}
                      />
                    ) : (
                      <div className={styles.noImage}>Нет изображения</div>
                    )}
                  </div>
                  <div className={styles.itemDetails}>
                    <h3 className={styles.itemName}>{item.name}</h3>
                    <p className={styles.itemPrice}>{formatPrice(item.price)}</p>
                    <div className={styles.quantityControls}>
                      <button
                        className={styles.quantityButton}
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        aria-label="Уменьшить количество"
                      >
                        -
                      </button>
                      <span className={styles.quantity}>{item.quantity}</span>
                      <button
                        className={styles.quantityButton}
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        aria-label="Увеличить количество"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    className={styles.removeButton}
                    onClick={() => removeFromCart(item._id)}
                    aria-label="Удалить товар"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className={styles.cartFooter}>
              <div className={styles.cartSummary}>
                <div className={styles.summaryRow}>
                  <span>Товаров:</span>
                  <span>{totalItems}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Итого:</span>
                  <span className={styles.totalPrice}>{formatPrice(totalPrice)}</span>
                </div>
              </div>
              <div className={styles.cartActions}>
                <Link href="/checkout" className={styles.checkoutButton} onClick={toggleCart}>
                  Оформить заказ
                </Link>
                <button className={styles.continueButton} onClick={toggleCart}>
                  Продолжить покупки
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 