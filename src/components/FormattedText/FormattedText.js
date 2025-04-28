import React from 'react';
import { draftToHtml } from '@/utils/draftToHtml';
import styles from './FormattedText.module.css';

const FormattedText = ({ content, className }) => {
  // Если контент пустой, возвращаем пустой div
  if (!content) {
    return <div className={`${styles.formattedText} ${className || ''}`} />;
  }

  // Если контент - обычный текст, просто оборачиваем его в параграф
  if (typeof content === 'string' && !content.startsWith('{')) {
    return (
      <div className={`${styles.formattedText} ${className || ''}`}>
        <p>{content}</p>
      </div>
    );
  }

  // Для JSON-контента используем draftToHtml
  const htmlContent = draftToHtml(content);

  return (
    <div 
      className={`${styles.formattedText} ${className || ''}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default FormattedText; 