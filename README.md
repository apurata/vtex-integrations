# aCuotaz VTEX Integration

Integración de la solución de pagos en cuotas **aCuotaz** para tiendas VTEX.

## ¿Qué es VTEX?

**VTEX** es una plataforma de comercio electrónico en la nube que permite crear y gestionar tiendas online escalables. Su arquitectura flexible facilita la integración de soluciones personalizadas como aCuotaz mediante un sistema de aplicaciones y bloques React.

## 📁 Estructura del Proyecto

```
vtex-integrations/
├── store-theme/                    # Tema VTEX (frontend React)
│   ├── store/blocks/              # Configuración de bloques UI
│   ├── manifest.json              # Dependencias del tema
│   └── styles/                    # Estilos CSS personalizados
├── vtex-framework-acuotaz-app/     # VTEX personalizada (acuotaz-plugin)
│   ├── react/                     # Componentes React
│   └── manifest.json              # Configuración de la app
└── vtex-apurata-legacy-app/        # Aplicación legacy (deprecada)
```

**Componentes principales:**
- **store-theme**: Controla la apariencia y experiencia del usuario mediante bloques React
- **vtex-framework-acuotaz-app**: Aplicación que permite incorporar componentes aCuotaz en el tema

## 🚀 Instalación y Configuración

> **Prerrequisito**: Conocimientos básicos del CLI de VTEX

### 1. Instalar el Plugin de aCuotaz

Tienes dos opciones para instalar el plugin:

**Opción A - VTEX App Store:**
1. Ve a la sección **APPS** en tu panel de administración VTEX
2. Accede a **Mis apps** → **No instaladas**
3. Busca "acuotaz plugin" y haz clic en **INSTALAR**

**Opción B - VTEX CLI:**
```bash
vtex install acuotaz.plugin@4.x
```

### 2. Configurar Dependencias del Tema

Después de instalar el plugin, debes integrarlo en tu tema:

En `store-theme/manifest.json`, agrega la dependencia:
```json
{
  "peerDependencies": {
    "acuotaz.plugin": "4.x"
  }
}
```

### 3. Configurar Bloques de aCuotaz

#### 🛍️ aCuotaz Addon (Página de Producto)

Este bloque muestra las opciones de pago en cuotas en la página de producto.

En `store/blocks/pdp/product.jsonc`:
```json
{
  "acuotaz-addon": {
    "props": {
      "clientId": "tu_client_id"
    }
  }
}
```

**¿Cómo funciona?**
- Se integra automáticamente con la información del producto
- Calcula las cuotas disponibles según el precio
- Se actualiza dinámicamente al cambiar variantes

#### 🎯 aCuotaz Headband (Banner Promocional)

El headband es un banner que promociona las opciones de pago en cuotas en toda la tienda.

**Configuración básica** - En `store/blocks/header/header.jsonc`:
```json
{
  "acuotaz-headband": {
    "props": {
      "clientId": "tu_client_id"
    }
  }
}
```

**Posicionamiento en Desktop**:
```json
{
  "header-layout.desktop": {
    "children": [
      "acuotaz-headband",
      "flex-layout.row#1-desktop",
      "flex-layout.row#2-desktop",
      "flex-layout.row#3-desktop"
    ]
  }
}
```

**Posicionamiento en Mobile**:
```json
{
  "header-layout.mobile": {
    "children": ["acuotaz-headband"]
  }
}
```

**Ubicaciones recomendadas:**
- **Desktop**: Al inicio del header (antes del menú principal)
- **Mobile**: Como primer elemento del header móvil
- Como primer elemento visible en la página
- En la parte superior del layout principal

**Características del headband:**
- **Interactivo**: Al hacer clic se abre una imagen promocional en modal
- **Responsive**: Se adapta automáticamente a móviles y desktop
- **Dinámico**: El contenido se obtiene del servidor de aCuotaz
- **Personalizable**: Se configura desde el panel de aCuotaz

## 🔧 Configuración de Entornos (Desarrollo vs Producción)

### IDs de Cliente

**Para Desarrollo Local:**
```json
{
  "acuotaz-headband": {
    "props": {
      "clientId": "vtex_test"
    }
  },
  "acuotaz-addon": {
    "props": {
      "clientId": "vtex_test"
    }
  }
}
```

**Para Producción:**
```json
{
  "acuotaz-headband": {
    "props": {
      "clientId": "b9bc03bbe7be4759983f3813493bc711"
    }
  },
  "acuotaz-addon": {
    "props": {
      "clientId": "b9bc03bbe7be4759983f3813493bc711"
    }
  }
}
```

### URLs del Servidor

**En el componente React** (`vtex-framework-acuotaz-app/react/AcuotazHeadBand.tsx`):

**Para Desarrollo Local:**
```typescript
const headers = {
  'Authorization': `Bearer ${clientId}`  // Para servidor de desarrollo local
};

fetch(
  `http://localhost:9000/pos/acuotaz-head-band`,  // Para servidor de desarrollo local
  {
    method: 'GET',
    headers,
  },
)
```

**Para Producción:**
```typescript
const headers = {
  'Client_id': clientId,  // Para servidor de producción
};

fetch(
  `https://apurata.com/pos/acuotaz-head-band`,  // Para servidor de producción
  {
    method: 'GET',
    headers,
  },
)
```

### Cambios Necesarios para Cambiar de Entorno

1. **Cambiar Client ID** en `store-theme/store/blocks/header/header.jsonc`:
   - Desarrollo: `"clientId": "vtex_test"`
   - Producción: `"clientId": "b9bc03bbe7be4759983f3813493bc711"`

2. **Cambiar URL del servidor** en `vtex-framework-acuotaz-app/react/AcuotazHeadBand.tsx`:
   - Desarrollo: `http://localhost:9000`
   - Producción: `https://apurata.com`

3. **Cambiar header de autorización**:
   - Desarrollo: `'Authorization': 'Bearer ${clientId}'`
   - Producción: `'Client_id': clientId`

### Scripts de Cambio Automático

Para facilitar el cambio entre entornos, puedes crear scripts:

**Para Desarrollo:**
```bash
# Cambiar a desarrollo
sed -i 's/https:\/\/apurata.com/http:\/\/localhost:9000/g' vtex-framework-acuotaz-app/react/AcuotazHeadBand.tsx
sed -i 's/"clientId": "b9bc03bbe7be4759983f3813493bc711"/"clientId": "vtex_test"/g' store-theme/store/blocks/header/header.jsonc
```

**Para Producción:**
```bash
# Cambiar a producción
sed -i 's/http:\/\/localhost:9000/https:\/\/apurata.com/g' vtex-framework-acuotaz-app/react/AcuotazHeadBand.tsx
sed -i 's/"clientId": "vtex_test"/"clientId": "b9bc03bbe7be4759983f3813493bc711"/g' store-theme/store/blocks/header/header.jsonc
```

## ⚙️ Componentes Disponibles

### aCuotaz Addon
- **Propósito**: Mostrar opciones de pago en cuotas en PDP
- **Ubicación**: Página de producto
- **Funcionalidad**: 
  - Calcula cuotas automáticamente
  - Se integra con el carrito de VTEX
  - Muestra información de financiamiento

### aCuotaz Headband  
- **Propósito**: Banner promocional para toda la tienda
- **Ubicación**: Header (desktop y mobile)
- **Funcionalidad**:
  - Promociona opciones de pago
  - Modal con información detallada
  - Contenido gestionado remotamente
  - **Responsive**: Se adapta automáticamente a móviles

## 🔧 Requisitos Técnicos

- Conocimientos básicos de VTEX CLI
- Acceso al admin de VTEX
- Client ID proporcionado por aCuotaz
- Tema VTEX configurado
- Servidor local para desarrollo (puerto 9000)

## 👨‍💻 Para Desarrolladores de Apurata

Si eres desarrollador de Apurata y necesitas trabajar con este repositorio, sigue estos pasos para configurar tu entorno de desarrollo:

### 1. Clonar el Repositorio
```bash
git clone https://github.com/tu-repo/vtex-integrations.git
cd vtex-integrations
```

### 2. Crear Workspace de Desarrollo
**⚠️ IMPORTANTE**: Nunca trabajar directamente en master. Crea tu propio workspace:
```bash
vtex use tu-nombre-dev
# Ejemplo: vtex use juan-acuotaz-dev
```

### 4. Instalar Dependencias
Sigue las instrucciones de instalación del plugin mencionadas anteriormente:
```bash
vtex install acuotaz.plugin@4.x
```

### 5. Eliminar Store Theme Default
Si tienes un tema por defecto instalado, desinstálalo primero:
```bash
vtex uninstall store-theme
```

### 6. Vincular Plugin aCuotaz
Navega al directorio del plugin y vincúlalo:
```bash
cd vtex-framework-acuotaz-app
vtex link
```

### 7. Vincular Store Theme
En otra terminal, navega al store theme y vincúlalo:
```bash
cd store-theme
vtex link
```

### 8. Verificar la Instalación
Una vez vinculados ambos componentes:
- El plugin estará disponible como `acuotaz.plugin@4.x`
- El tema se aplicará automáticamente a tu workspace
- Los bloques `acuotaz-addon` y `acuotaz-headband` estarán disponibles
- El headband aparecerá tanto en desktop como en mobile

> **Nota**: Asegúrate de estar en el workspace correcto antes de hacer los links. Usa `vtex whoami` para verificar.

### 9. Probar en Mobile
Para probar el headband en mobile:
1. Abre las herramientas de desarrollador del navegador
2. Activa el modo responsive
3. Selecciona un dispositivo móvil (iPhone, Android, etc.)
4. Verifica que el headband aparezca correctamente


¿Necesitas ayuda? Contacta al equipo de soporte de aCuotaz.

