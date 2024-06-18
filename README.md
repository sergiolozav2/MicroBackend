# Proyecto Micro - Backend

REST API para proyecto de transporte usando Fastify, Drizzle y PostgreSQL


## Como iniciar proyecto
- npm install
- docker compose up
- npm run dev

## Estructura de proyectos
- src/
 - db/
  - schemas.ts -> Contiene definición de tablas usando drizzle
  - startDatabase.ts -> Función para crear conexión a base de datos

- errors/
 - errors.ts -> Contiene errores comúnes para el usuario

- modules/
 - dominio/
  - dominio.routes.ts -> Define el nombre de la ruta, usa los esquemas de schema.ts y servicios de service.ts
  - dominio.schema.ts -> Define esquemas para Swagger usando Typebox y tipos de objetos para los servicios 
  - dominio.service.ts -> Define la lógica de la función, se usan funciones privadas para métodos internos
  - dominio.repository.ts -> Define todas las interacciones con la base de datos

- plugins/
 - config.ts -> Plugin que define esquema de variables de entorno de .env
 - db.ts -> Plugin que inicia una instancia global de db
 - jwt -> Plugin para usar funciones de JWT
 - prometheus.ts -> Plugin para definir envío de datos a instancia de prometheus
 - swagger.ts -> Plugin para configuración de swagger

- app.ts -> Define función para crear instancia de servidor
- index.ts -> Inicia el servidor