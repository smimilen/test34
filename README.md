# WStyling — Премиум детейлинг студия

## КАК ЗАГРУЗИТЬ В GITHUB И ОПУБЛИКОВАТЬ

### Шаг 1 — Создать репозиторий на GitHub
1. Зайдите на https://github.com
2. Нажмите зелёную кнопку **"New"** (или **"+"** → New repository)
3. Название: `wstyling-site` (запомните это название!)
4. Выберите **Public**
5. **НЕ** ставьте галочки на README/gitignore
6. Нажмите **"Create repository"**

### Шаг 2 — Открыть `vite.config.js`
В файле `vite.config.js` найдите строку:
```js
const REPO_NAME = 'wstyling-site'
```
Замените `wstyling-site` на точное название вашего репозитория.

### Шаг 3 — Включить GitHub Pages
1. В репозитории откройте **Settings** (шестерёнка)
2. Слева → **Pages**
3. В разделе "Source" выберите **GitHub Actions**
4. Нажмите Save

### Шаг 4 — Загрузить файлы (выберите ОДИН способ)

#### Способ А: через GitHub Desktop (САМЫЙ ПРОСТОЙ — без командной строки)
1. Скачайте **GitHub Desktop**: https://desktop.github.com
2. Войдите в свой аккаунт
3. **File → Add Local Repository** → укажите папку `wstyling-site`
4. Нажмите **"Publish repository"**
5. Готово!

#### Способ Б: через терминал
Откройте терминал В папке проекта (там где package.json):
```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/ВАШ_ЛОГИН/wstyling-site.git
git push -u origin main
```

### Шаг 5 — Ждать деплоя
- GitHub автоматически запустит сборку (2-3 минуты)
- Следите во вкладке **Actions** репозитория
- После завершения сайт будет на: `https://ВАШ_ЛОГИН.github.io/wstyling-site/`

---

## Локальный запуск (для разработки)
```bash
npm install
npm run dev
```
Откройте http://localhost:5173

## Технологии
- React 18 + Vite 5
- Three.js — 3D автомобиль (drag to rotate)
- GSAP ScrollTrigger — горизонтальный скролл, анимации
