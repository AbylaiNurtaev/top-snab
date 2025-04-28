"use client";

import "./Header.scss";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems, toggleCart } = useCart();

  // Блокировка скролла при открытом меню
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`header ${isMenuOpen ? "menu-open" : ""}`}>
      <div className="container">
        <div className="header__logo">
          <Link href="/">
            <h1 style={{ color: "white", fontWeight: "bolder" }}>WARMM</h1>
          </Link>
        </div>

        <div className={`header__nav ${isMenuOpen ? "header__nav--open" : ""}`}>
          <ul className="header__nav-list">
            <li>
              <Link href="/catalog" onClick={() => setIsMenuOpen(false)}>
                Каталог
              </Link>
            </li>
            <li>
              <Link href="/promotions" onClick={() => setIsMenuOpen(false)}>
                Акции
              </Link>
            </li>
            <li>
              <Link href="/delivery" onClick={() => setIsMenuOpen(false)}>
                Оплата и доставка
              </Link>
            </li>
            <li>
              <Link href="/contacts" onClick={() => setIsMenuOpen(false)}>
                Контакты
              </Link>
            </li>
            <li>
              <Link href="/about" onClick={() => setIsMenuOpen(false)}>
                О нас
              </Link>
            </li>
          </ul>

          {/* Мобильные элементы в меню */}
          <div className="header__mobile-elements">
            <div className="header__contact">
              <a href="tel:+79214165320">+7 (921) 416-53-20</a>
              <a href="mailto:ma.warmmrus@gmail.com">ma.warmmrus@gmail.com</a>
            </div>
            <button className="header__btn">Я строитель</button>
            <div className="header__cart-container">
              <Link
                href="/cart"
                className="header__cart-link"
                onClick={() => setIsMenuOpen(false)}
              >
                <Image
                  src="/shopping-cart.svg"
                  alt="Корзина"
                  width={24}
                  height={24}
                />
                {totalItems > 0 && (
                  <span className="header__cart-count">{totalItems}</span>
                )}
                <span className="header__cart-text">Корзина</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="header__right">
          <div className="header__contact">
            <a href="tel:+79214165320">+7 (921) 416-53-20</a>
            <a href="mailto:ma.warmmrus@gmail.com">ma.warmmrus@gmail.com</a>
          </div>
          <button className="header__btn">Я строитель</button>
          <div className="header__cart-container">
            <Link href="/cart" className="header__cart-link">
              <Image
                src="/shopping-cart.svg"
                alt="Корзина"
                width={24}
                height={24}
              />
              {totalItems > 0 && (
                <span className="header__cart-count">{totalItems}</span>
              )}
            </Link>
            <button
              className="header__cart-toggle"
              onClick={toggleCart}
              aria-label="Открыть корзину"
            >
              <Image
                src="/shopping-cart.svg"
                alt="Корзина"
                width={24}
                height={24}
              />
              {totalItems > 0 && (
                <span className="header__cart-count">{totalItems}</span>
              )}
            </button>
          </div>
        </div>

        <button
          className={`header__burger ${
            isMenuOpen ? "header__burger--open" : ""
          }`}
          onClick={toggleMenu}
          aria-label="Открыть меню"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}
