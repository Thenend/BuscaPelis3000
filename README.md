# BuscaPelis 3000

Web para buscar películas y series (TMDB), ver sus notas de IMDb, Rotten Tomatoes y Metacritic (OMDb), saber en qué
plataformas están en España y organizarlas en **Favoritas**, **Pendientes**, **Vistas** (en series, por temporadas) y
**Descartadas**. También deja preguntar a la IA (Gemini) sobre lo que aparece en pantalla.

Es la aplicación que estaba en Gemini Canvas, ahora en una web propia: **GitHub Pages** (la página) y **Supabase** (las
cuentas y los datos), gratis los dos. Cada persona entra con su correo y tiene sus propias listas, que se ven igual desde
el ordenador, la tablet o el móvil, y se actualizan solas si cambias algo en otro dispositivo.

## Dirección
<https://thenend.github.io/BuscaPelis3000/>

## Cómo está montada
- **Supabase**: proyecto `buscapelis` (región West EU). La tabla y los permisos están en
  [`supabase/esquema.sql`](supabase/esquema.sql); se puede volver a ejecutar en el **SQL Editor** sin perder nada.
  En **Authentication → URL Configuration**, la **Site URL** y las **Redirect URLs** son la dirección de la web. En
  **Authentication → Sign In / Providers**, «Allow new users to sign up» está desactivado: nadie puede crearse una cuenta
  desde la web, así que solo entran los amigos a los que se la creas a mano (ver [Dar de alta a un amigo](#dar-de-alta-a-un-amigo)).
  Así nadie más gasta las consultas de la clave de OMDb.
- **GitHub Pages**: en **Settings → Pages → Source**, «GitHub Actions». Cada vez que cambia la rama `main`, la acción
  **Web** (pestaña **Actions**) publica la web en un par de minutos (también a mano: **Actions → Web → Run workflow**).
- **Notas de IMDb, Rotten Tomatoes y Metacritic**: la web las pide a la función `omdb` de Supabase
  ([`supabase/functions/omdb`](supabase/functions/omdb/index.ts)), que guarda la clave de OMDb como secreto
  (**Edge Functions → Secrets → `OMDB_API_KEY`**) y recuerda 30 días cada respuesta en la tabla `omdb_cache`, compartida
  entre todos. Así la clave no está en la página y cada obra gasta una sola consulta al mes.
- La dirección del proyecto de Supabase y su clave publicable están en `src/datos.js`: pueden estar en la página, porque
  sin una cuenta no dan acceso a nada. Si algún día cambian, se pueden poner las variables del repositorio
  `SUPABASE_URL` y `SUPABASE_ANON_KEY` (**Settings → Secrets and variables → Actions → Variables**), que mandan sobre las
  de `src/datos.js`. La clave **service_role** no se usa: no la copies en ningún sitio.

## Primeros pasos
### 1. Entrar
Abre la web y entra con el correo y la contraseña que te han dado. La primera vez te pide un nombre de usuario: es lo que
ven los demás en vez de tu correo, y se cambia pulsando en él (arriba a la derecha). Cambia también la contraseña
provisional con el botón **Contraseña**. Si la olvidas, pulsa **He olvidado la contraseña** y te llega un enlace al correo.

#### Dar de alta a un amigo
En Supabase, ve a **Authentication → Users → Add user → Create new user**, escribe su correo y una contraseña provisional,
marca **«Auto Confirm User»** y pulsa **Create user**. Pásale la dirección de la web, su correo y esa contraseña. Para
quitarle el acceso, borra su usuario en la misma lista (se borran también sus listas).

### 2. Traer tus datos de Gemini Canvas
1. En la aplicación de Gemini Canvas, pulsa **💾 Guardar Backup** (abajo del todo): descarga un archivo `.json`.
2. En la web nueva, pulsa **📂 Cargar Backup** y elige ese archivo. Se cargan tus listas, las temporadas vistas de cada
   serie y tus plataformas.

### 3. Compartir tu biblioteca (opcional)
Pulsa **👥 Compartir** (arriba a la derecha), escribe el nombre de usuario de la otra persona y marca qué
pestañas puede ver (**Favoritas**, **Pendientes**, **Vistas**; de películas y de series). Solo podrá mirarlas. Puedes
cambiar las pestañas o dejar de compartir cuando quieras. Lo que otros te comparten aparece en la pestaña **👥 Amigos**,
y en cualquier tarjeta se ve qué amigos la tienen en esas pestañas (p. ej. «👥 ana ❤️»).

### 4. Recomendar películas y series (opcional)
Pulsa **💌** en cualquier tarjeta, marca a quién se la recomiendas (o escribe su nombre de usuario) y añade una nota si
quieres. Lo que te recomiendan aparece en la pestaña **💌 Recomendadas**, con quién te lo recomendó y su nota; desde ahí
puedes pasarlo a Pendientes o quitarlo. Cuando te llega una recomendación nueva, al entrar sale un aviso arriba. En la
misma pestaña puedes ver todas las que te han recomendado (y quién) y las que has recomendado tú (y a quién); en
cualquier tarjeta se ve también «💌 Te la recomendó…» y «📤 Se la recomendaste a…».

### 5. La IA (opcional)
«Pregunta al IA» usa Gemini. Crea una clave gratis en <https://aistudio.google.com/apikey> y pégala en la web en
**🔑 Clave de IA** (arriba a la derecha). Se guarda solo en tu cuenta.

## Desarrollo
```
npm install
npm run dev      # modo de prueba: los datos se guardan solo en el navegador
npm run build
```
- `src/App.jsx`: la aplicación (la misma de Gemini Canvas, guardando en Supabase en vez de Firestore).
- `src/datos.js`: cuentas y guardado (Supabase, o el navegador en modo de prueba).
- `src/Entrada.jsx`, `src/ElegirNombre.jsx`, `src/BarraCuenta.jsx`: entrar, recuperar la contraseña, nombre de usuario,
  contraseña, clave de IA y salir.
- `src/componentes/`: las tarjetas, el selector de rangos y las ventanas (temporadas, ficha de OMDb, plataformas).
- `src/notas.js`: notas de OMDb ya consultadas, guardadas en el navegador.
- `src/componentes/CompartirModal.jsx`: la ventana de compartir la biblioteca.
- `src/componentes/RecomendarModal.jsx`: la ventana de recomendar una película o serie.
- `supabase/esquema.sql`: las tablas `preferencias`, `perfiles` (nombres de usuario), `compartidos`, `recomendaciones` y `omdb_cache`, sus permisos y las funciones que guardan
  cada cambio y las que comparten la biblioteca (cada persona solo recibe las pestañas que le han compartido).
