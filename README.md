## Cómo correr el proyecto

## Para empezar...

En la raíz del proyecto se ejecuta lo siguiente:

### `npm install`

Para instalar las librerías y luego:

### `npm start`

## Funcionamiento

Se pedirá una imagen del plato petri y un archivo csv correspondiente a la foto. Se pondrán circulos donde el algoritmo haya detectado un grupo de bacterias.
Se pueden mover, escalar, crear y eliminar estos círculos. Para eliminarlos se usa la tecla "suprimir" y para crearlos se hace "clic derecho" en un punto en la foto.
Se puede hacer zoom a la imagen con la rueda del ratón y para movilizarse se usa la combinación de teclas "Alt"+"clic izquierdo".
Cuando se hayan hecho los cambios necesarios, se puede presionar el botón encontrado al final de la página para generar un json con la información de los círculos.
Si se desea escoger otro par de archivos se hace clic en el botón encontrado al final para borrar los anteriores.

### Toolbar/Barra de herramientas

Se presentan 5 botones, en orden de arriba a abajo:

- Botón de desplazar: Si se presiona se podrá desplazar por el canvas con el clic izquierdo, si se lo presiona de nuevo se desactivará. Recuerde que el acceso rápido de esta funcionalidad es mantener presionado la tecla `Alt`.
- Botón de borrar: Si se presiona se borrarán todos los círculos seleccionados, el acceso rápido de este botón es presionar la tecla `Suprimir/Del`.
- Botón de añadir: Si se presiona, ahora con un clic izquierdo se añadirá un círculo en el lugar donde se hizo el clic. Si se presiona de nuevo se desactivará. El acceso rápido es haciendo `clic derecho`.
- Botón de zoom in: Si se presiona se hará zoom. El acceso rápido es usando la `rueda del ratón`.
- Botón de zoom out: Si se presiona se alejará el zoom. El acceso rápido es usando la `rueda del ratón`.

## Herramientas utilizadas en el proyecto

Se usó el framework `ReactJS` en conjunto con las librerías `Papaparse` y `FabricJS`. Además, se usó el arte gratis de `FontAwesome`.
