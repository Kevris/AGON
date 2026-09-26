# AGON

**ἀγών · el certamen**

Una plataforma para llevar cualquier liga de Haxball de principio a fin: plantillas, mercado, competencias y estadísticas, desde un solo bot.

---

## Cómo funciona

AGON gestiona inscripciones, plantillas, fichajes, competencias y premios desde un único bot de Discord. Está construida multi-liga desde el modelo: añadir una segunda liga mañana es insertar una fila, no reescribir el sistema.

Toma del fútbol real lo que ayuda a modelar una competencia y descarta lo que no aplica a una liga virtual. No hay estadios ni árbitros con carnet. La identidad del jugador vive en Discord.

**League** · `slug + discordGuildId`
La liga. Techo de todo el sistema. Hoy una fila, mañana una por comunidad.

**Modality** · `Futsal x4 · Real Soccer`
Cada modalidad lleva sus propias temporadas, no al revés.

**Team** · `persistente`
El club sobrevive al cambio de temporada; el plantel se ficha aparte.

**Competition** · `format + tier`
Liga o copa según el formato; el tier resuelve las divisiones.

**Tie** · `nuevo en v1`
El cruce a ida y vuelta como una sola entidad, no dos partidos sueltos.

**MatchEvent** · `inmutable`
El acta del partido. Corregir un gol inserta un evento nuevo, nunca borra el anterior.

---

## Por qué Tie importa

En la versión anterior, el cruce no existía como entidad. Se reconstruía al vuelo cada vez que alguien lo necesitaba, en tres lugares distintos del bot, y se calculaba mal las tres veces.

El bracket aparecía vacío al generarse. La vuelta se creaba antes que la ida. El botón de plantilla mostraba la ronda equivocada. Tres síntomas, una misma causa: nadie era dueño del estado del cruce.

```
Tie
├── id
├── round_id
├── team_a_id, team_b_id
├── status        → pending | first_leg_done | resolved
├── winner_team_id
└── resolution    → normal | walkover | manual
```

Con Tie como fila real en la base de datos, ese estado vive en un solo sitio:

```sql
SELECT * FROM ties WHERE status != 'resolved' ORDER BY round LIMIT 1;
```

El bracket, el anuncio y el siguiente paso consultan ese estado. No lo recalculan.

---

## Un proceso, no un enjambre

La versión anterior colapsó bajo su propio peso. Tres clientes imaginarios pedían JWT, un servicio de autenticación y una capa de roles con alcance. Con un solo cliente real — el bot — nada de eso hace falta todavía.

```
agon/
├── src/
│   ├── bot/       discord.js — comandos y eventos.
│   │              Lo único que sabe que existe Discord.
│   ├── domain/    Bracket, tabla, transferencias.
│   │              Cero imports de discord.js.
│   └── db/        Prisma sobre Postgres gestionado.
├── prisma/
│   └── schema.prisma
├── tests/         Vitest sobre src/domain
└── package.json
```

El bot llama al dominio como funciones normales de TypeScript, en el mismo proceso. Sin HTTP de por medio: el único cliente es el propio bot.

|             |                                                                           |
| ----------- | ------------------------------------------------------------------------- |
| **26 → 20** | modelos del schema tras recortar lo que resolvía un cliente que no existe |
| **1**       | proceso desplegado                                                        |
| **0**       | JWT, roles con scope o segundo servicio que operar                        |

---

## Cuatro reglas

**Dominio separado del bot.** La lógica de bracket, tabla y transferencias no sabe que existe Discord. Se puede probar sin levantar el bot.

**Un solo punto de verdad.** Cada pregunta se responde en un solo lugar, no en tres funciones ligeramente distintas.

**Reglas como datos.** Wildcards, tiempos de espera y desempates son configuración por competencia, no constantes en el código.

**Diseñar para cambiar.** Ningún plan sobrevive al primer uso real. Se dejan costuras baratas donde algo puede crecer.

---

## Stack

PostgreSQL gestionado en Supabase o Neon. Prisma como ORM. discord.js para el bot. Vitest para los tests de dominio. Un VPS pequeño con pm2, o un host de bots.

Sin Docker. Sin orquestador. Un solo proceso Node.

---

## Estado

**Schema v1** — modelo completo en Prisma: liga, competencia, cruce, partido, mercado y auditoría.

**Dominio puro** — generación de fixtures, tabla de posiciones y avance de cruces. Lógica probada, sin Discord de por medio.

**Bot de Discord** — comandos de staff, jugadores y directores técnicos. Único cliente de esta versión.

**Sitio de presentación** — la web con datos reales de la liga sigue pospuesta hasta que el bot exista.

---

## Código

[github.com/Kevris/AGON](https://github.com/Kevris/AGON)

AGON — en desarrollo.