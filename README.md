# Gorilla Forest VR — prototipo WebXR

## Qué incluye
- Escenario 3D low-poly de bosque.
- Avatar de gorila con manos visibles.
- Controles de teclado/ratón y controles táctiles.
- Botón ENTER VR mediante WebXR.
- Servidor WebSocket sencillo para sincronizar posición y nombre entre jugadores.

## Requisitos
- Node.js 18 o superior.
- Navegador compatible con WebXR para entrar en VR.
- Para WebXR en Quest, el sitio debe servirse por HTTPS (localhost suele ser una excepción solo para pruebas locales).

## Ejecutar en PC
1. Instala Node.js.
2. Abre una terminal en esta carpeta.
3. Ejecuta `npm install`.
4. Ejecuta `npm start`.
5. Abre `http://localhost:3000`.

## Probar en Quest y tablet
Sube el proyecto a un hosting que permita ejecutar Node.js y WebSocket, y que proporcione HTTPS/WSS. Abre la URL HTTPS en el navegador de Quest 2, pulsa ENTER VR y permite el acceso.

## Importante
Esto es un prototipo inicial, no un juego terminado. La sincronización es básica y no incluye cuentas, matchmaking, moderación, guardado ni protección contra trampas. El movimiento de VR es una aproximación experimental basada en movimiento de controladores; todavía no implementa la física completa de empuje y colisión de Gorilla Locomotion. Para que todos jueguen juntos, todos deben abrir la misma URL alojada en el mismo servidor.
