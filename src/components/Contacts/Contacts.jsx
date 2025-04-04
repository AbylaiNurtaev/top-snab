"use client";

import React from "react";
import styles from "./Contacts.module.css";

const Contacts = () => {
  return (
    <section className={styles.contacts}>
      <div className={styles.left}>
        <h2 className={styles.heading}>Контакты</h2>

        <div className={styles.infoBlock}>
          <h3 className={styles.label}>Наш адрес</h3>
          <p className={styles.text}>ул. Новорощинская д. 4, оф. 403-1</p>
        </div>

        <div className={styles.infoBlock}>
          <h3 className={styles.label}>Телефон</h3>
          <p className={styles.text}>+7 967 757-33-53</p>
        </div>

        <div className={styles.infoBlock}>
          <h3 className={styles.label}>Почта</h3>
          <p className={styles.text}>sale01@warmm.pro</p>
        </div>

        <div className={styles.infoBlock}>
          <h3 className={styles.label}>График работы</h3>
          <p className={styles.text}>
            Пн - Чт: 9.00 - 18.00 <br />
            Пт: 9.00 – 17.00 <br />
            Сб - Вс: выходные
          </p>
        </div>
      </div>

      <div className={styles.right}>
        <p className={styles.description}>
          Готовы к новым поставкам и партнёрству! Свяжитесь с нами, чтобы
          обсудить, как мы можем упростить и оптимизировать ваш проект
          инженерной сантехники или трубопровода. Расскажите о своих задачах —
          мы предложим надёжные решения и обеспечим качественные материалы для
          вашего объекта!
        </p>
        <div className={styles.mapWrapper}>
          <iframe
            src="https://yandex.kz/map-widget/v1/?ll=30.326738%2C59.884591&mode=search&ol=geo&ouri=ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgg1NzQ3MjE4ORJV0KDQvtGB0YHQuNGPLCDQodCw0L3QutGCLdCf0LXRgtC10YDQsdGD0YDQsywg0J3QvtCy0L7RgNC-0YnQuNC90YHQutCw0Y8g0YPQu9C40YbQsCwgNCIKDSid8kEV04lvQg%2C%2C&z=17.17"
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen
            style={{ border: 0 }}
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default Contacts;
