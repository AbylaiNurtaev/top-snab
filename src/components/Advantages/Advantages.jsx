"use client";

import React from "react";
import { motion } from "framer-motion";
import styles from "./Advantages.module.css";

const advantages = [
  {
    title: "Высокое качество",
    description: "Мы являемся официальными представителями марок WARMM, ICMA",
    icon: "/images/image1.svg",
  },
  {
    title: "Оперативность",
    description:
      "Наш центральный офис находится в Санкт-Петербурге, поэтому мы обеспечиваем оперативную доставку нашим клиентам",
    icon: "/images/image2.svg",
  },
  {
    title: "Хорошая поддержка",
    description:
      "Благодаря эксклюзивным контрактам мы предлагаем нашим партнерам лучшие условия сотрудничества.",
    icon: "/images/image3.svg",
  },
  {
    title: "Эффективные услуги",
    description:
      "Работая с нами, Вы приобретаете уверенность в гарантированно добросовестном и взаимовыгодном сотрудничестве.",
    icon: "/images/image4.svg",
  },
  {
    title: "Индивидуальный подход",
    description:
      "Динамично развивающийся рынок и растущие потребности наших клиентов стимулируют нас к развитию и расширению ассортимента.",
    icon: "/images/image5.svg",
  },
  {
    title: "Уникальный опыт",
    description:
      "Специализация Top-Snab основывается на работе с производственными предприятиями, а также со строительными и оптовыми компаниями.",
    icon: "/images/image6.svg",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
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
            <div
              className={styles.icon}
              style={{ backgroundImage: `url(${advantage.icon})` }}
            />
            <h3 className={styles.title}>{advantage.title}</h3>
            <p className={styles.description}>{advantage.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Advantages;
