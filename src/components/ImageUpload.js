import { useState } from 'react';
import styles from './ImageUpload.module.css';

export default function ImageUpload({ onImageUploaded }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Пожалуйста, выберите изображение');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Ошибка при загрузке изображения');
      }

      const data = await response.json();
      onImageUploaded(data.url);
      
      // Очищаем состояние после успешной загрузки
      setFile(null);
      setPreview('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className={styles.input}
        disabled={loading}
      />
      
      {preview && (
        <div className={styles.preview}>
          <img src={preview} alt="Предпросмотр" />
        </div>
      )}

      {error && <p className={styles.error}>{error}</p>}
      {loading && <p className={styles.loading}>Загрузка...</p>}

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className={styles.button}
      >
        {loading ? 'Загрузка...' : 'Загрузить'}
      </button>
    </div>
  );
} 