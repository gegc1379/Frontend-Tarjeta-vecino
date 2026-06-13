# Frontend - Tarjeta Vecino 💳🏡

¡Bienvenido al repositorio del frontend del proyecto **Tarjeta Vecino**! Esta aplicación está diseñada para ofrecer una interfaz moderna, accesible y eficiente para que los ciudadanos gestionen sus beneficios, identidades locales y servicios municipales.

## 🚀 Características Principales

* **Portal Vecino:**
    * Interfaz pública responsiva con diseño adaptado a la identidad corporativa institucional.
    * Visualización interactiva (efecto *flip card* en CSS) de la Tarjeta Vecino Digital.
    * Consulta de vigencia y datos mediante RUT o número de tarjeta.
    * Integración de código QR dinámico para validación en comercios adheridos.
    * Módulos accesibles de "Mis Beneficios" y "Historial de Uso".
* **Portal Admin:**
    * Formulario de autenticación seguro para funcionarios municipales.
    * Campos optimizados para gestores de contraseñas y accesibilidad (`ARIA attributes`).
* **Accesibilidad Web (a11y):**
    * Herramientas integradas para aumento/reducción de texto y modo de alto contraste.
    * Estructura semántica optimizada para lectores de pantalla.

## 📁 Estructura del Proyecto

```text
├── css/
│   ├── munsan.css     # Estilos globales y del portal público
│   └── login.css      # Estilos específicos de la interfaz de autenticación
├── img/
│   └── imagen_0.png   # Logotipo oficial institucional
├── js/
│   ├── index.js       # Control global de la interfaz y accesibilidad
│   ├── tarjeta.js     # Lógica de consulta, volteo y renderizado de la tarjeta
│   ├── auth.js        # Manejo de sesiones y tokens del administrador
│   └── login.js       # Validación y captura del formulario de acceso
└── views/
    ├── index.html     # Portal principal y Dashboard del vecino
    └── login.html     # Formulario de inicio de sesión de administración
---

## 🎨 Especificaciones de Diseño (Design System)

Para mantener la consistencia visual de la plataforma, se han definido estrictamente la tipografía y la paleta de colores. Cualquier nuevo componente, vista o estilo debe respetar estos lineamientos.

### 🔤 Tipografía
* **Fuente Principal:** `Source Sans 3`
* **Familia alternativa:** `sans-serif`
* **Configuración CSS recomendada:**
```css
body {
font-family: 'Source Sans 3', sans-serif;
}
```

### 🎨 Paleta de Colores

| Color | Código Hex | Vista Previa | Uso Sugerido / Rol |
| :--- | :--- | :---: | :--- |
| **Azul Institucional** | `#072E6D` | ![#072E6D]() | Color primario, headers, botones principales y énfasis institucional. |
| **Amarillo Alerta** | `#FFC107` | ![#FFC107]() | Color secundario, estados de advertencia, destaques activos. |
| **Oro Municipal** | `#FCB600` | ![#FCB600]() | Acentos visuales, iconos destacados, botones secundarios. |
| **Gris Oliva / Neutro** | `#52594A` | ![#52594A]() | Textos secundarios, bordes, fondos atenuados o elementos desactivados. |
| **Blanco Pureza** | `#FFFFFF` | ![#FFFFFF]() | Fondos de contenedores, tarjetas, texto sobre fondo oscuro. |

---

## 🚀 Comenzando

Sigue estas instrucciones para clonar e instalar el proyecto en tu entorno local.

### Prerrequisitos

Asegúrate de tener instalado lo siguiente:
* [Node.js](https://nodejs.org/) (Versión recomendada LTS)
* [npm](https://www.npmjs.com/) o [Yarn](https://yarnpkg.com/)

### Instalación

1. **Clona el repositorio:**
```bash
git clone [https://github.com/gegc1379/Frontend-Tarjeta-vecino.git](https://github.com/gegc1379/Frontend-Tarjeta-vecino.git)
```
2. **Navega al directorio del proyecto:**
```bash
cd Frontend-Tarjeta-vecino
```
3. **Instala las dependencias:**
```bash
npm install
# o si usas yarn
yarn install
```

### Servidor de Desarrollo

Para levantar el entorno de desarrollo local corre el siguiente comando:
```bash
npm run dev
# o si usas yarn
yarn dev
