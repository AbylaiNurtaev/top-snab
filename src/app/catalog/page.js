"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './catalog.module.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { useCart } from "@/context/CartContext";

export default function CatalogPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { addToCart, cart } = useCart();

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

  // Функция для преобразования JSON-описания в HTML
  const convertDescriptionToHtml = (description) => {
    if (!description) return 'Описание отсутствует';
    
    try {
      // Пробуем распарсить как JSON
      const rawContent = JSON.parse(description);
      
      // Преобразуем rawContent в HTML
      let htmlContent = '';
      rawContent.blocks.forEach(block => {
        let text = block.text;
        
        // Применяем стили
        block.inlineStyleRanges.forEach(style => {
          const start = style.offset;
          const end = start + style.length;
          const styledText = text.substring(start, end);
          
          switch (style.style) {
            case 'BOLD':
              text = text.substring(0, start) + `<strong>${styledText}</strong>` + text.substring(end);
              break;
            case 'ITALIC':
              text = text.substring(0, start) + `<em>${styledText}</em>` + text.substring(end);
              break;
            case 'UNDERLINE':
              text = text.substring(0, start) + `<u>${styledText}</u>` + text.substring(end);
              break;
            case 'STRIKETHROUGH':
              text = text.substring(0, start) + `<s>${styledText}</s>` + text.substring(end);
              break;
            default:
              break;
          }
        });
        
        // Добавляем перенос строки после каждого блока
        htmlContent += text + '<br/>';
      });
      
      return htmlContent;
    } catch (e) {
      // Если не JSON, возвращаем как есть
      return description;
    }
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
                    <div 
                      className={styles.productDescription}
                      dangerouslySetInnerHTML={{ 
                        __html: convertDescriptionToHtml(product.description) 
                      }}
                    />
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
                        addToCart(product);
                      }}
                    >
                      {cart.find(item => item._id.toString() === product._id.toString())
                        ? 'В корзине'
                        : 'В корзину'}
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