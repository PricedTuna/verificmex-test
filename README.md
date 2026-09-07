# Towa VerificaMex

API (NestJS) que actúa como intermediaria entre la aplicación de **Towa** y el servicio externo de validación de identidad **VerificaMex**.

## ¿Qué es este proyecto?

Este servicio expone endpoints HTTP que permiten a la aplicación frontend de Towa crear sesiones de verificación de identidad contra VerificaMex y recibir sus resultados de forma asíncrona. Es una capa de integración que evita exponer credenciales directamente al cliente y centraliza la persistencia de los resultados en **Supabase**.

## Funcionamiento general

1. El cliente solicita una nueva sesión de verificación al endpoint del backend.
2. El backend llama a la API de VerificaMex (`api.verificamex.com`) creando una sesión con validación de **INE**.
3. VerificaMex devuelve un `uuid` y una `verification_url` que el usuario usará para completar su verificación (captura del INE, OCR, etc.).
4. El backend guarda la sesión en la tabla `identifications` de Supabase.
5. Al terminar la verificación, VerificaMex notifica el resultado mediante un **webhook**.
6. El backend actualiza el estado de la identificación en Supabase con el nuevo estado y los datos (nombre) extraídos del OCR.

## Endpoints

| Método | Ruta                  | Descripción                                              |
| ------ | --------------------- | -------------------------------------------------------- |
| `POST` | `/verificamex`        | Crea una nueva sesión de verificación en VerificaMex.    |
| `POST` | `/verificamex/webhook`| Recibe la notificación asíncrona de VerificaMex.         |

La documentación interactiva (Swagger) está disponible en `/api`.

## Interacción con VerificaMex

- **Crear sesión**: `POST https://api.verificamex.com/identity/v3/identity/sessions` con autorización `Bearer <BEARER_TOKEN>`, indicando el tipo de validación (`validations: ["INE"]`), la `redirect_url` y el `webhook` al que VerificaMex notificará los resultados.
- **Webhook**: VerificaMex envía un payload con el estado de la verificación, el `id` de la sesión y datos de OCR (`ocr.ocr_frontal.nombre_completo`). El servicio actualiza el registro correspondiente en Supabase y solo persiste cambios cuando el estado realmente difiere del almacenado.

## Stack

- **Framework**: [NestJS](https://nestjs.com) (Node.js + TypeScript)
- **Base de datos / persistencia**: [Supabase](https://supabase.com)
- **Documentación**: Swagger
- **Gestor de paquetes**: Bun

## Configuración

```bash
$ bun install
```

Copia `.env.example` a `.env` y define las variables:

| Variable                  | Descripción                                          |
| ------------------------- | ---------------------------------------------------- |
| `BEARER_TOKEN`            | Token de autorización de la API de VerificaMex.      |
| `SUPABASE_URL`            | URL del proyecto de Supabase.                        |
| `SUPABASE_PUBLISHABLE_KEY`| Clave pública de Supabase.                           |
| `SUPABASE_SECRET_KEY`     | Clave secreta de Supabase (usada por el backend).    |
| `SUPABASE_JWKS_URL`       | URL de JWKS para validar tokens de Supabase.         |

## Compilar y ejecutar

```bash
# modo desarrollo
$ bun run start:dev

# modo producción
$ bun start:prod

# pruebas unitarias
$ bun run test

# pruebas e2e
$ bun run test:e2e
```

El servidor escucha por defecto en el puerto `8080` (o el definido en `PORT`).

## Estructura del código relacionado

- `src/verificamex/verificamex.service.ts` — lógica de llamadas a VerificaMex y manejo del webhook.
- `src/verificamex/verificamex.controller.ts` — endpoints `/verificamex` y `/verificamex/webhook`.
- `src/verificamex/identifications.repository.ts` — acceso a la tabla `identifications` en Supabase.
- `src/verificamex/dto/verification.dto.ts` — tipos del payload del webhook de VerificaMex.
- `src/supabase/supabase.module.ts` — inicialización del cliente de Supabase.
