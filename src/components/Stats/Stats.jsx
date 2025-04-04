"use client";

import { motion } from "framer-motion";
import { useCountAnimation } from "../../hooks/useCountAnimation";
import "./Stats.scss";

export default function Stats() {
  const [count150, ref150] = useCountAnimation(150, 2);
  const [count12, ref12] = useCountAnimation(12, 1.5);
  const [count450, ref450] = useCountAnimation(450, 2.5);

  return (
    <div className="stats">
      <div className="stats__top">
        <motion.h1
          className="stats__title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Top-Snab
        </motion.h1>
        <div className="stats__info">
          <motion.h2
            className="stats__subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Вы выбираете комфорт и долговечность!
          </motion.h2>
          <motion.p
            className="stats__description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Идеально подходит для монтажа в жилых и коммерческих помещениях,
            обеспечивая комфортный микроклимат даже в самых холодных регионах.
          </motion.p>
        </div>
      </div>

      <div className="stats__numbers">
        <motion.div
          className="stats__number-item"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <motion.div
            className="stats__number"
            ref={ref150}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {count150}
            </motion.span>
          </motion.div>
          <p className="stats__label">
            позиций инженерной сантехники в наличии
          </p>
        </motion.div>

        <motion.div
          className="stats__number-item"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <motion.div
            className="stats__number"
            ref={ref12}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {count12}
            </motion.span>
          </motion.div>

          <p className="stats__label">лет на рынке поставок</p>
        </motion.div>

        <motion.div
          className="stats__number-item"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <motion.div
            className="stats__number"
            ref={ref450}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {count450}
            </motion.span>
          </motion.div>
          <p className="stats__label">успешно выполненных проектов</p>
        </motion.div>
      </div>
    </div>
  );
}
