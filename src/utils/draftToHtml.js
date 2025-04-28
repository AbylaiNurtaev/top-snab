import { convertFromRaw, EditorState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';

export const draftToHtml = (draftJson) => {
  try {
    if (!draftJson) return '';
    
    // Если переданная строка не является JSON, возвращаем её как есть
    if (typeof draftJson === 'string' && !draftJson.startsWith('{')) {
      return draftJson;
    }

    // Парсим JSON если он передан как строка
    const contentState = typeof draftJson === 'string' 
      ? convertFromRaw(JSON.parse(draftJson))
      : convertFromRaw(draftJson);

    // Конвертируем в HTML
    return stateToHTML(contentState);
  } catch (error) {
    console.error('Ошибка при конвертации Draft.js в HTML:', error);
    return draftJson || '';
  }
}; 