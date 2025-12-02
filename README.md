# ishop

Простой мини-интернет-магазин на NestJS, Prisma, PostgreSQL, React, Redux Toolkit и TailwindCSS.

Возможности
Пользователь:
просмотр списка товаров
фильтрация товаров
добавление и удаление товаров из корзины
оформление заказа

Администратор
добавление товаров
редактирование товаров
удаление товаров

Технологии

Backend:

NestJS
Prisma
PostgreSQL
JWT (авторизация)

Frontend:
React
Redux Toolkit
TailwindCSS

Установка и запуск
1. Backend
cd backend
npm install

# миграции Prisma
npx prisma migrate dev

# запуск в режиме разработки
npm run start:dev


По умолчанию API доступно по адресу:
http://localhost:3000

2. Frontend
cd frontend
npm install

# запуск в режиме разработки
npm run dev

Frontend по умолчанию доступен по адресу:
http://localhost:5173

