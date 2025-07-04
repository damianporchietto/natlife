# NatLife - Aplicación de Seguimiento de Nutrición

## Requisitos Previos

- Node.js (v14 o superior)
- npm o yarn
- Docker (opcional, para ejecución en contenedor)
- MongoDB (se ejecuta automáticamente en Docker)
TEST
## Estructura del Proyecto

```
natlife_fs_react/
├── client/          # Frontend React
├── server/          # Backend Node.js/Express
└── docker/          # Archivos de configuración Docker
```

## Desarrollo Local

### 1. Configuración del Backend

```bash
# Navegar al directorio del servidor
cd server

# Instalar dependencias
npm install

# Crear archivo .env con las variables necesarias
cp .env.example .env

# Iniciar el servidor en modo desarrollo
npm run dev
```

### 2. Configuración del Frontend

```bash
# En una nueva terminal, navegar al directorio del cliente
cd client

# Instalar dependencias
npm install

# Iniciar la aplicación React
npm start
```

## Ejecución con Docker

### Construir y Ejecutar con Docker

```bash
# Construir la imagen
docker build -t natlife-app .

# Ejecutar el contenedor
docker run -p 5000:5000 \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/natlife \
  -e JWT_SECRET=tu_secreto_jwt \
  natlife-app
```

El proceso de construcción:
1. Construye el frontend React
2. Copia los archivos estáticos al servidor
3. Ejecuta las pruebas del servidor
4. Inicia el servidor en modo producción

La aplicación estará disponible en:
- http://localhost:5000 (servidor + frontend servido estáticamente)

## Variables de Entorno

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/natlife
JWT_SECRET=tu_secreto_jwt
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
```

## Scripts Disponibles

### Backend
```bash
npm run dev        # Inicia el servidor en modo desarrollo
npm run test       # Ejecuta las pruebas
npm run build      # Construye para producción
npm start         # Inicia en modo producción
```

### Frontend
```bash
npm start         # Inicia la aplicación en modo desarrollo
npm run build     # Construye para producción
npm test         # Ejecuta las pruebas
```

## Pruebas

### Backend
```bash
cd server
npm test
```

### Frontend
```bash
cd client
npm test
```

## Solución de Problemas

1. **Error de conexión a MongoDB**
   - Verificar que MongoDB esté ejecutándose
   - Comprobar la URI de conexión en .env
   - En Docker, asegurarse de usar `host.docker.internal` para conectar a MongoDB local

2. **Error de CORS**
   - Verificar que las URLs en las variables de entorno sean correctas
   - Comprobar la configuración CORS en el backend

3. **Error de autenticación**
   - Verificar que JWT_SECRET esté configurado correctamente
   - Comprobar que los tokens se estén enviando en el header Authorization

4. **Error en la construcción de Docker**
   - Verificar que todas las dependencias estén correctamente especificadas
   - Comprobar que los tests pasen localmente antes de construir

## Contribución

1. Fork el repositorio
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles. 