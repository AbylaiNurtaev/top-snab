"use client";

import "./Header.scss";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header__logo">
          <Image
            src="/images/logo.svg"
            alt="Logo"
            width={149}
            height={62}
            priority
          />
        </div>

        <div className={`header__nav ${isMenuOpen ? "header__nav--open" : ""}`}>
          <ul className="header__nav-list">
            <li>
              <a href="/catalog">Каталог</a>
            </li>
            <li>
              <a href="/promotions">Акции</a>
            </li>
            <li>
              <a href="/delivery">Оплата и доставка</a>
            </li>
            <li>
              <a href="/contacts">Контакты</a>
            </li>
            <li>
              <a href="/about">О нас</a>
            </li>
          </ul>
        </div>

        <div className="header__right">
          <div className="header__contact">
            <a href="tel:+79214165320">+7 (921) 416-53-20</a>
            <a href="mailto:ma.warmmrus@gmail.com">ma.warmmrus@gmail.com</a>
          </div>
          <button className="header__btn">Заказать звонок</button>
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
