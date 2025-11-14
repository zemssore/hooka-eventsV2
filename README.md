# Hookah Events

Сайт кальянного кейтеринга для мероприятий в Москве и области.

## Требования

- Node.js 18 или выше
- pnpm (или npm)

## Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/zemssore/hooka-eventsV2.git
cd hooka-eventsV2
```

2. Создайте файл `.env.local` в корне проекта:
```bash
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

3. Установите зависимости:
```bash
pnpm install
```

## Запуск проекта

### Режим разработки

```bash
pnpm run dev
```

Сайт будет доступен по адресу http://localhost:3000

### Сборка для продакшена

```bash
pnpm run build
pnpm run start
```

## Структура проекта

- `app/` - страницы и API routes
- `components/` - React компоненты
- `data/` - JSON файлы с данными (кальяны, миксы, отзывы и т.д.)
- `public/` - статические файлы (изображения, PDF, модели)
- `lib/` - утилиты и вспомогательные функции

## Переменные окружения

Создайте файл `.env.local` в корне проекта:

```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

По умолчанию используются значения:
- Логин: `admin`
- Пароль: `admin123`

## Админ-панель

Админ-панель доступна по адресу `/admin`

Используйте логин и пароль из файла `.env.local`

В админ-панели можно управлять:
- Кальянами
- Миксами
- Отзывами
- Кейсами
- Брендами
- Персоналом

## Деплой на сервер

1. Соберите проект:
```bash
pnpm run build
```

2. На сервере клонируйте репозиторий и установите зависимости:
```bash
git clone https://github.com/zemssore/hooka-eventsV2.git
cd hooka-eventsV2
npm install --legacy-peer-deps
npm run build
```

3. Запустите через PM2:
```bash
npm install -g pm2
pm2 start .next/standalone/node_modules/next/dist/bin/next --name "hookah-events" -- start --port 3000
pm2 save
```

## Обновление на сервере

```bash
git pull origin main
npm install --legacy-peer-deps
npm run build
pm2 restart hookah-events
```

