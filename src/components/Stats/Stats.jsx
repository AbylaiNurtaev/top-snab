"use client";

import { motion } from "framer-motion";
import { useCountAnimation } from "../../hooks/useCountAnimation";
import "./Stats.scss";

export default function Stats() {
  const [count150, ref150] = useCountAnimation(150, 2);
  const [count12, ref12] = useCountAnimation(12, 1.5);
  const [count450, ref450] = useCountAnimation(450, 2.5);

  return (
    <section className="stats">
      <div className="stats__content">
        <motion.div
          className="stats__left"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="stats__title">WARMM</h1>
          <h2 className="stats__subtitle">
            Комфорт. Надёжность. Будущее вашего дома.
          </h2>
          <p className="stats__description">
            Мы специализируемся на поставках инженерной сантехники и деталей
            трубопровода. Каждая позиция в наличии, каждый проект — с заботой о
            деталях.
          </p>
          <motion.button
            className="stats__cta-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            Заказать звонок
          </motion.button>
        </motion.div>

        <motion.div
          className="stats__right"
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="stats__number-item">
            <div className="stats__number-glow" />
            <div className="stats__number" ref={ref150}>
              <span>{count150}</span>
            </div>
            <p className="stats__label">позиций в наличии</p>
          </div>

          <div className="stats__number-item">
            <div className="stats__number-glow" />
            <div className="stats__number" ref={ref12}>
              <span>{count12}</span>
            </div>
            <p className="stats__label">лет опыта</p>
          </div>

          <div className="stats__number-item">
            <div className="stats__number-glow" />
            <div className="stats__number" ref={ref450}>
              <span>{count450}</span>
            </div>
            <p className="stats__label">успешных проектов</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
