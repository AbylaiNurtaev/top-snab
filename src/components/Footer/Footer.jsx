"use client";

import React from "react";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.separator}></div>

      <div className={styles.container}>
        <div className={styles.column}>
          <p className={styles.subtle}>Связаться с нами</p>
          <h2 className={styles.title}>Интересует надёжная поставка?</h2>
          <p className={styles.description}>
            Мы будем рады обсудить возможности сотрудничества и предложить
            решения, полностью соответствующие вашим техническим задачам и
            срокам.
          </p>
          <p className={styles.copyright}>
            Top-Snab - поставщик инженерной сантехники
            <br />© 2025
          </p>
        </div>

        <div className={styles.column}>
          <p className={styles.subtle}>Разделы</p>
          <ul className={styles.links}>
            <li>О компании</li>
            <li>Доставка</li>
            <li>Каталог</li>
            <li>Отзывы</li>
            <li>Акции</li>
            <li>Контакты</li>
          </ul>
        </div>

        <div className={styles.column}>
          <p className={styles.subtle}>Контакты</p>
          <p className={styles.contact}>+7 (921) 111-87-58</p>
          <p className={styles.contact}>sale01@warmm.pro</p>
          <p className={styles.contact}>
            г. Санкт-Петербург
            <br />
            ул. Новорощинская д. 4, оф. 403-1
          </p>
          <img src="/images/logo.svg" alt="Логотип" className={styles.logo} />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
