<a id="readme-top"></a>

<p align="center">
  <img
    src="https://capsule-render.vercel.app/api?type=waving&color=0:0D1117,100:161B22&height=220&section=header&text=AGON&fontSize=82&fontColor=58A6FF&fontAlignY=38&desc=%E1%BC%80%CE%B3%CF%8E%CE%BD%20%C2%B7%20el%20certamen&descAlignY=60&descSize=19&animation=fadeIn"
    width="100%"
    alt="AGON"
  />
</p>

<p align="center">
  <img
    src="https://readme-typing-svg.demolab.com?font=Inter&weight=600&size=22&duration=3200&pause=850&color=58A6FF&center=true&vCenter=true&width=720&lines=Plataforma+para+gestionar+ligas+de+Haxball;Un+solo+bot.+Un+solo+proceso.;Del+modelo+al+dominio%2C+y+despu%C3%A9s+al+bot;Construido+para+durar%2C+dise%C3%B1ado+para+cambiar"
    alt="AGON"
  />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Stage-Draft-58A6FF?style=flat-square" alt="Stage: Draft"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma"/>
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/discord.js-5865F2?style=flat-square&logo=discord&logoColor=white" alt="discord.js"/>
  <img src="https://img.shields.io/badge/Vitest-6E9F18?style=flat-square&logo=vitest&logoColor=white" alt="Vitest"/>
  <img src="https://img.shields.io/badge/License-MIT-22c55e?style=flat-square" alt="MIT"/>
</p>

<br>

> **Construido para durar, diseñado para cambiar.**

AGON es un proyecto para llevar la administración de una liga de Haxball a un solo sistema:
jugadores, plantillas, fichajes, competencias, fixtures, eliminatorias, actas y estadísticas.

La idea no es hacer un bot lleno de comandos.

La idea es que **la liga tenga un modelo claro detrás**.

---

## 🏟️ La idea

Una liga virtual termina teniendo mucho más que partidos.

```text
Jugadores
    ↓
Plantillas
    ↓
Fichajes
    ↓
Competencias
    ↓
Fixtures
    ↓
Partidos
    ↓
Actas
    ↓
Estadísticas
    ↓
Historial
```

AGON se está diseñando para que todo eso pertenezca al mismo sistema y no a una colección de
datos, mensajes y cálculos separados.

Discord es el cliente previsto para esta primera etapa.

---

## 🧭 Diseñado alrededor de unas pocas ideas

<table>
  <tr>
    <td width="25%" align="center">
      <strong>🏛️ Multi-liga</strong><br>
      <sub>La liga es una entidad propia, separada del servidor de Discord.</sub>
    </td>
    <td width="25%" align="center">
      <strong>🧠 Dominio</strong><br>
      <sub>Las reglas importantes no dependen de Discord.</sub>
    </td>
    <td width="25%" align="center">
      <strong>⚔️ Tie</strong><br>
      <sub>Un cruce de eliminatoria tiene estado propio.</sub>
    </td>
    <td width="25%" align="center">
      <strong>📜 Historial</strong><br>
      <sub>Los hechos del partido se pueden reconstruir.</sub>
    </td>
  </tr>
</table>

---

## 🔧 Cómo encaja todo

```mermaid
flowchart LR
    D["Discord"] --> B["Bot"]
    B --> DOM["Domain"]
    DOM --> DB["Prisma"]
    DB --> PG[("PostgreSQL")]

    DOM --> F["Fixtures"]
    DOM --> T["Tables"]
    DOM --> K["Knockout"]
    DOM --> M["Transfers"]
```

El principio es sencillo:

> **Discord es la interfaz. El dominio es el cerebro.**

La lógica de fixtures, tablas, cruces y transferencias se plantea fuera de la capa del bot,
para poder probarla y reutilizarla sin depender de Discord.

---

## ⚔️ El problema de `Tie`

Una eliminatoria a ida y vuelta no son simplemente dos partidos.

Son un mismo enfrentamiento.

En sistemas anteriores, ese cruce se reconstruía a partir de partidos sueltos.
Ese enfoque terminaba haciendo que distintas partes del sistema interpretaran el estado de forma distinta.

AGON lo representa como una entidad propia:

```text
Tie
│
├── teamA
├── teamB
├── round
├── status
│   ├── pending
│   ├── first_leg_done
│   └── resolved
├── winnerTeamId
└── resolution
```

Así, preguntas como:

```text
¿ya terminó la ida?
¿qué toca ahora?
¿quién avanza?
```

tienen un lugar claro donde resolverse.

---

## 🏆 Competencias

El modelo parte de una idea simple:

```text
Competition
├── round_robin
└── single_elimination
```

y `tier` permite representar distintas divisiones sin crear un modelo nuevo solo para decir
"Primera", "Segunda", etc.

Las reglas propias de una competición pueden vivir en:

```text
Competition.settings
```

para evitar convertir reglas de una liga concreta en constantes desperdigadas por el código.

AGON toma del fútbol real lo que ayuda a representar una competición —club, temporada, liga,
copa, ida y vuelta— y adapta lo demás al mundo de Haxball.

---

## 👤 Jugador, equipo y temporada

La identidad del jugador y su participación no son la misma cosa:

```text
Player
   │
   └── Participant
          │
          ├── Season
          ├── Modality
          └── Team
```

Esto permite conservar la identidad del jugador mientras su contexto competitivo cambia entre temporadas.

---

## 📐 Modelo

La jerarquía central es:

```text
League
  └── Modality
       └── Season
            ├── Team
            │    └── Participant → Player
            │
            └── Competition
                 ├── Match
                 │    └── MatchEvent
                 └── Tie
                      └── Match
```

Entre las entidades del primer borrador están:

`League` · `Modality` · `Season` · `Team` · `Player` · `Participant`
· `Competition` · `CompetitionParticipant` · `Tie` · `Match` · `MatchEvent`
· `PlayerStatProjection` · `ManualStatAdjustment` · `Award` · `AwardWinner`
· `CompetitionChampionRoster` · `TransferOffer` · `AuditLog`

---

## 🧠 Algunas decisiones detrás del modelo

**Un punto de verdad por pregunta.**  
Si el sistema necesita saber qué sucede en un cruce, no debería calcularlo de tres maneras diferentes.

**Reglas como datos.**  
Una regla específica de una competición debería poder cambiar sin convertirla en una constante global.

**Eventos antes que sobrescrituras.**  
Una corrección de un evento no debería eliminar silenciosamente lo que ocurrió antes.

**Cambiar barato importa.**  
AGON no intenta adivinar todo lo que una liga podría necesitar dentro de cinco años.
Primero tiene que funcionar bien con una liga real.

---

## 📊 Estado actual

AGON está en **fase de diseño y primer borrador**.

Ahora mismo, el foco está en:

```text
✅ Modelo de dominio
✅ Schema Prisma v1
✅ Diseño de competencias y eliminatorias
✅ Entidad Tie
⬜ Implementación del bot
⬜ Fixtures en código
⬜ Actas y estadísticas
⬜ Operación de una liga real
```

No hay todavía una aplicación terminada detrás de este README.

Este repositorio está construyendo la base sobre la que llegará.

---

## 🗺️ Próximo paso

```text
Schema
  ↓
Dominio
  ↓
Tests
  ↓
Bot
  ↓
Primera liga funcionando
```

Después vendrán las cosas que realmente merezcan ser agregadas.

---

## ⚙️ Stack

<p align="center">
  <img src="https://skillicons.dev/icons?i=ts,nodejs,prisma,postgres,discordjs,vitest,git,github&perline=8" alt="AGON stack"/>
</p>

| Parte         | Tecnología |
| ------------- | ---------- |
| Lenguaje      | TypeScript |
| Runtime       | Node.js    |
| Bot           | discord.js |
| ORM           | Prisma     |
| Base de datos | PostgreSQL |
| Tests         | Vitest     |

---

## 🤍

AGON nace para una comunidad que durante años ha tenido que resolver la administración de sus ligas
con herramientas que no fueron hechas específicamente para ello.

Esta es una forma de intentar hacerlo mejor.

<br>

<p align="center">
  <sub>Hecho con ❤️ para la comunidad de Haxball</sub>
</p>

<p align="center">
  <sub>agon · el certamen</sub>
</p>

<p align="center">
  <a href="#readme-top">↑ volver arriba</a>
</p>
