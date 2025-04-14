"use client";

import React from "react";
import { motion } from "framer-motion";
import styles from "./Advantages.module.css";

const advantages = [
  {
    title: "Высокое качество",
    description: "Официальные представители марок WARMM, ICMA.",
    icon: "/images/advantage1.png",
  },
  {
    title: "Оперативность",
    description: "Офис в СПБ. Быстрая доставка клиентам.",
    icon: "/images/advantage2.png",
  },
  {
    title: "Хорошая поддержка",
    description: "Предлагаем лучшие условия сотрудничества.",
    icon: "/images/advantage3.png",
  },
  {
    title: "Эффективные услуги",
    description: "Честность, выгода и надёжность.",
    icon: "/images/advantage4.png",
  },
  {
    title: "Индивидуальный подход",
    description: "Адаптация под клиента и расширение ассортимента.",
    icon: "/images/advantage5.png",
  },
  {
    title: "Уникальный опыт",
    description: "Работа с производственными и строительными компаниями.",
    icon: "/images/advantage6.png",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

const Advantages = () => {
  return (
    <section className={styles.container}>
      <h2 className={styles.sectionTitle}>Наши преимущества</h2>

      <div className={styles.grid}>
        {advantages.map((advantage, index) => (
          <motion.div
            key={index}
            className={styles.card}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={index}
          >
            <div className={styles.iconWrapper}>
              <img src={advantage.icon} alt={advantage.title} />
            </div>
            <h3 className={styles.cardTitle}>{advantage.title}</h3>
            <p className={styles.cardDescription}>{advantage.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Advantages;
