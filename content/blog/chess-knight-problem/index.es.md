---
{
  title: "El problema del caballo de ajedrez: una solución rápida y sucia en JavaScript",
  description: "Presento una solución rápida y sucia a una pregunta habitual en las entrevistas en la que la solución no es ni mucho menos tan completa como puede parecer en un principio.",
  published: "2020-04-29T12:27:06.284Z",
  authors: ["thodges314"],
  tags: ["javascript", "computer science", "interviewing"],
  attached: [],
  license: "cc-by-4",
}
---

He aquí un problema clásico de la informática que se dice que aparece de varias formas en las entrevistas de programación: dado un tablero de ajedrez de 8 x 8, una casilla inicial seleccionada y una casilla final seleccionada, ¿Cuál es el número mínimo de movimientos legales necesarios para que una pieza de caballero vaya desde la casilla inicial a la final? Tenga en cuenta que esto _no_ es lo mismo que el Recorrido del caballero, que es un problema mucho más complicado en el que tratamos de encontrar un camino alrededor del tablero tal que el caballo toque cada casilla una vez sin repetirse. 

Para conocer el contexto - un caballo de ajedrez se mueve en forma de L: dos hacia arriba y uno hacia la derecha, dos hacia la izquierda y uno hacia arriba, y así sucesivamente. El caballo salta desde su posición inicial hasta su posición final.

Esto es un diagrama mostrando todos los movimientos posible para un caballo:

![Una lista de posibles movimientos para un caballo centrado en un tablero de ajedrez, siguiendo el patrón L mencionado anteriormente](./knight-moves-0.png)

La marca roja de arriba es un punto de partida arbitrario, y las marcas verdes son todos los lugares posibles a los que puede saltar el caballero desde ese punto.

# Método de solución {#solution-method}

A primera vista, esto puede parecer un extraño algoritmo de navegación en un laberiton con reglas complejas, e inspira cualquier cantidad de pensamientos sobre el número de iteraciones posibles, cómo decidir si un movimiento es constructivo o no, etc.

Afortunadamente, nuestra solución es mucho más sencilla, de tal manera que pude elaborar una en JavaScript en una sola tarde después de dcidirme a investigar este problema.

Si, en el diagrama anterior, empezamos en el espacio rojo, todos los espacios verdes son lugares a los que podemos ir en un solo movimiento. Vamos a etiquetar el punto de partida '0', y los lugares que podemos ir en un movimiento con '1'.
![Posibles movimientos para un caballo centrado en un tablero de ajedrez con la ubicación inicial poblada por un 0 y los posibles movimientos poblados por 1s.](./knight-moves-1.png)

Vamos a elegir uno de esos puntos y ver todos los lugares a los que podemos ir desde allí. Cualquier lugar al que podamos llegar desde este punto es un lugar al que podemos llegar en dos movimientos desde nuestro punto de partida. Vamos a etiquetarlos con "2".
![La misma imagen que la anterior, pero con uno de los 1s resaltados, y los posibles desplazamientos desde allí poblados por 2s.  En el espacio inicial, vemos tanto un 0 como un 2.](./knight-moves-2.png)

Observe que nuestra casilla inicial está doblemente ocupada. Podemos llegar a este lugar en cero movimientos o en dos movimientos. Sin embargo, queremos saber el _menor_ número de movimientos posibles para llegar a este lugar. Cero es menos que dos, así que ocuparemos este espacio con un "0". Quitaré el "2" y rellenaré los lugares restantes que podemos alcanzar en dos movimientos como aquellos que están a un movimiento de distancia de las otras casillas "1":
![Todas las casillas etiquetadas para 0, 1 o 2 movimientos sin superposición, según las imágenes anteriores.  Hay algunas casillas en blanco.](./knight-moves-3.png)

Así que, ahora mimso, enemos etiquetadas todas las casillas a las que podemos llegar en cero, uno o dos movimientos. Si quieres, puedes completar tres movimientos y posiblemente cuatro si es necesario para llenar todas las casillas. Recuerda dar prioridad al número más bajo en las casillas ya ocupadas

Si alguna de las casillas etiquetadas es el destino deseado, entonces sabemos el número mínimo de movimientos necesarios para llegar a esa casilla. Por lo tanto, todo lo que tenemos que hacer es empezar con nuestra casilla inicial y repetir este proceso hasta que por casualidad llenemos nuestro destino final con un número. El número de esa casilla será el número mínimo de movimientos necesarios para llegar a ese lugar.

# Ejecución de JavaScript {#js-execution}

Así que, vamos a empezar. He hecho esto en CodePen, y no he construido una interfaz para ello, pero eso sería un paso bastante fácil. Podríamos hacer todo tipo de animaciones en D3js, etc, pero eso no es para este articulo del blog.

Para empezar, vamos a definir un array de dos dimensiones para que sea nuestro tablero de ajedrez:

```javascript
const board = [];
for (let i = 0; i < 8; i++) {
	board[i] = [];
}
```

Eso es todo. Todo lo que necesitamos es un array bidimensional de 8x8. No he definido explícitamente el número de entradas en ninguna de las dimensiones del array porque esa es una de las idiosincrasias de JavaScript. (Sería posible decir algo como `let board = Array(8);` pero no está claro cuánto beneficiará eso al rendimiento aquí. JavaScript es famoso por no tener las mismas optimizaciones de gestión de memoria que lenguajes como FORTRAN - también hay que tener en cuenta que no he necesitado prepoblar el array con valores nulos, como tendría que hacer con muchos otros lenguajes).

Hagamos una función para añadir un movimiento al tablero. Necesitamos ver si la ubicación está dentro del rango y no está ocupada por otro número antes de añadir ese movimiento:

```javascript
const addMove = (x, y, level) => {
	if (x >= 0 && x <= 7 && y >= 0 && y <= 7 && board[x][y] == null) {
		board[x][y] = level;
	}
};
```

Te habrás dado cuenta de que he comprobado si `board[x][y] == null`, en lugar de simplemente `!board[x][y]`. Esto se debe a que `0` es una entrada potencial para una de las casillas (nuestra casilla de mirada) y `0` es falsa.

Llamemos a esto desde otra función que, para cualquier ubicación dada, intente sumar todos los movimientos para los que se puede llegar desde esa ubicación:

```javascript
const addAllMoves = (x, y, level) => {
	addMove(x + 1, y + 2, level);
	addMove(x + 2, y + 1, level);
	addMove(x + 2, y - 1, level);
	addMove(x + 1, y - 2, level);
	addMove(x - 1, y - 2, level);
	addMove(x - 2, y - 1, level);
	addMove(x - 2, y + 1, level);
	addMove(x - 1, y + 2, level);
};
```

Puede haber una manera de hacer esto sistemáticamente, pero para lo que yo estaba haciendo, era más fácil hacerlo a mano. Fíjate en que no tuvimos que comprobar los movimientos válidos porque eso lo hace `addMove()`.

Ahora, hagamos una función para escanear el tablero, buscar todas las casillas ocupadas por un número dado, y llamar a `addAllMoves()` para cada espacio ocupado:

```javascript
const addAllPossible = (level) => {
	for (let i = 0; i < 8; i++) {
		for (let j = 0; j < 8; j++) {
			if (board[i][j] === level) {
				addAllMoves(i, j, level + 1);
			}
		}
	}
};
```

Espero que puedas predecir a dónde va esto. Vamos a hacer una función maestra para unir todo esto:

```javascript
const findPath = (startX, startY, endX, endY) => {
	addMove(startX, startY, 0);
	let index = 0;
	do {
		addAllPossible(index++);
	} while (board[endX][endY] == null);
	return board[endX][endY];
};
```

Por último: Voy a probar esta función con algunos de los puntos que hemos etiquetado en el diagrama anterior. Etiquetando las columnas de izquierda a derecha y las filas de principio a fin, partimos de `[3,3]`. Uno de los puntos que podemos conseguir en un movimiento es `[2,1]`.

```javascript
console.log(findPath(3, 3, 2, 1));
```

He conseguido correctamente el 1.

Uno de los puntos a los que podemos llegar en 2 movimientos es \[4,6\].

```javascript
console.log(findPath(3, 3, 4, 6));
```

Obtuve correctamente 2.

Si quieres probar esto por ti mismo, [aquí está mi proyecto de CodePen](https://codepen.io/thodges314/pen/ZEbJzPX). Amplía el panel de JavaScript y abre la consola en la parte inferior de la página para probarlo.

![Imagen de la interfaz de CodePen con el panel de JavaScript y el panel de la consola expandido](./display-knight.png)
