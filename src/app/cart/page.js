"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import styles from "./cart.module.css";

export default function CartPage() {
  const { cart, totalItems, totalPrice, removeFromCart, updateQuantity } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  if (totalItems === 0) {
    return (
      <div className={styles.emptyCartContainer}>
        <div className={styles.emptyCart}>
          <div className={styles.emptyCartIcon}>🛒</div>
          <h2>Ваша корзина пуста</h2>
          <p>Добавьте товары в корзину, чтобы оформить заказ</p>
          <Link href="/catalog" className={styles.continueShopping}>
            Перейти в каталог
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cartPageContainer}>
      <h1 className={styles.cartPageTitle}>Корзина</h1>
      
      <div className={styles.cartContent}>
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
                  <div className={styles.noImage}>Нет фото</div>
                )}
              </div>
              <div className={styles.itemDetails}>
                <h3 className={styles.itemName}>{item.name}</h3>
                <p className={styles.itemPrice}>{formatPrice(item.price)}</p>
                <div className={styles.quantityControls}>
                  <button
                    className={styles.quantityButton}
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className={styles.quantity}>{item.quantity}</span>
                  <button
                    className={styles.quantityButton}
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
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
        
        <div className={styles.cartSummary}>
          <div className={styles.summaryRow}>
            <span>Товаров в корзине:</span>
            <span>{totalItems}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Итого:</span>
            <span className={styles.totalPrice}>{formatPrice(totalPrice)}</span>
          </div>
          <div className={styles.cartActions}>
            <Link href="/checkout" className={styles.checkoutButton}>
              Оформить заказ
            </Link>
            <Link href="/catalog" className={styles.continueButton}>
              Продолжить покупки
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 