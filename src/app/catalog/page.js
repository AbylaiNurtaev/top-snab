"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './catalog.module.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';

export default function CatalogPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategory(category);
    }
    fetchData();
  }, [searchParams]);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories')
      ]);
      
      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();
      
      console.log('Полученные данные:', { productsData, categoriesData });
      
      // Проверяем, что productsData.products является массивом
      setProducts(Array.isArray(productsData.products) ? productsData.products : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
      setProducts([]);
      setCategories([]);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    
    if (categoryId) {
      router.push(`/catalog?category=${categoryId}`);
    } else {
      router.push('/catalog');
    }
  };

  const filteredProducts = Array.isArray(products) ? products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || product.categoryId === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }) : [];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB'
    }).format(price);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className={styles.loading}>
          <div className={styles.loadingSpinner} />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className={styles.catalogContainer}>
        <div className={styles.catalogContent}>
          <div className={styles.catalogHeader}>
            <h1 className={styles.catalogTitle}>Каталог товаров</h1>
            <p className={styles.catalogDescription}>
              Ознакомьтесь с нашим широким ассортиментом качественных товаров по доступным ценам
            </p>
          </div>

          <div className={styles.filterSection}>
            <input
              type="text"
              placeholder="Поиск товаров..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={handleSearch}
            />
            <select
              className={styles.categorySelect}
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="">Все категории</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.productsGrid}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <Link href={`/catalog/${product.slug}`} key={product._id} className={styles.productCard}>
                  <div className={styles.imageContainer}>
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={300}
                        height={300}
                        className={styles.productImage}
                      />
                    ) : (
                      <div className={styles.noImage}>
                        Нет изображения
                      </div>
                    )}
                    <div className={`${styles.stockStatus} ${product.inStock ? styles.inStock : styles.outOfStock}`}>
                      {product.inStock ? 'В наличии' : 'Нет в наличии'}
                    </div>
                  </div>
                  <div className={styles.productInfo}>
                    <div className={styles.productCategory}>
                      {categories.find(c => c._id === product.categoryId)?.name || 'Без категории'}
                    </div>
                    <h2 className={styles.productName}>{product.name}</h2>
                    <p className={styles.productDescription}>
                      {product.description || 'Описание отсутствует'}
                    </p>
                  </div>
                  <div className={styles.productFooter}>
                    <div className={styles.productPrice}>
                      {formatPrice(product.price)}
                    </div>
                    <button 
                      className={styles.addToCartButton}
                      disabled={!product.inStock}
                      onClick={(e) => {
                        e.preventDefault();
                        // Здесь будет логика добавления в корзину
                      }}
                    >
                      В корзину
                    </button>
                  </div>
                </Link>
              ))
            ) : (
              <div className={styles.noProducts}>
                Товары не найдены
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 