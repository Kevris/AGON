/**
 * Dominio de bracket / Tie — lógica pura, sin DB.
 *
 * Se apoya en generateKnockoutFirstRound / generateKnockoutNextRound de
 * fixtureGenerator.ts para el emparejamiento en sí, y agrega dos cosas
 * que faltaban ahí:
 *
 *   1. seedTeams() — decide el ORDEN en que los equipos entran al
 *      generador. Sin esto, la única opción obvia es pasarlos ordenados
 *      por id, y eso reproduce EXACTO el mismo bug que tuvimos en
 *      producción esta semana: "extremos contra extremos" sobre una
 *      lista ordenada por id es el mismo criterio que usa el método del
 *      círculo para la jornada 1 de una liga — con el mismo conjunto de
 *      equipos, salen los mismos cruces. Confirmado reproduciendo el bug
 *      real contra este generador antes de escribir el fix (ver
 *      tests/bracket.test.ts).
 *
 *   2. resolveTie() / buildNextRoundTies() — todo lo que en V3 vivía
 *      disperso en tres funciones ligeramente distintas
 *      (checkAndAdvanceCupTie, resolveCupTieManually, y la lógica del
 *      botón de plantilla) y se desincronizaron entre sí. Acá es una sola
 *      función pura: dado un Tie con sus Match, dice en qué estado está.
 *      Todo lo demás (el bot, la vista de bracket) LEE ese estado, no lo
 *      recalcula con su propio criterio.
 */

import { generateKnockoutFirstRound, generateKnockoutNextRound, KnockoutFixture } from "./fixtureGenerator";

// ── Siembra ──────────────────────────────────────────────────────────────

export type SeedingMode = "seed" | "aleatorio";

export interface SeedableTeam {
  teamId: number;
  /** null = sin siembra asignada. */
  seed: number | null;
}

function shuffle(ids: number[]): number[] {
  const out = [...ids];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Devuelve los teamId en el orden en que deben entrar a
 * generateKnockoutFirstRound.
 *
 * Modo "aleatorio": sorteo directo.
 *
 * Modo "seed": ordena por siembra ascendente. Si NADIE tiene siembra
 * asignada, sortea igual que en modo aleatorio — no hay ningún criterio
 * real para ordenar, y desempatar por teamId reproduce el bug descrito
 * arriba. Con siembra mixta (algunos sí, otros no), los sin siembra van
 * al final, en orden aleatorio entre ellos (no por id).
 */
export function seedTeams(teams: SeedableTeam[], mode: SeedingMode): number[] {
  if (mode === "aleatorio") return shuffle(teams.map((t) => t.teamId));

  if (teams.every((t) => t.seed === null)) {
    return shuffle(teams.map((t) => t.teamId));
  }

  const seeded = teams.filter((t) => t.seed !== null).sort((a, b) => a.seed! - b.seed!);
  const unseeded = shuffle(teams.filter((t) => t.seed === null).map((t) => t.teamId));

  return [...seeded.map((t) => t.teamId), ...unseeded];
}

// ── Armado de rondas ─────────────────────────────────────────────────────

export { generateKnockoutFirstRound, generateKnockoutNextRound };
export type { KnockoutFixture };

/**
 * A partir de un KnockoutFixture (un cruce con su slot), arma los datos
 * para crear un Tie + sus Match. `legs` según si la ronda es a partido
 * único o ida y vuelta (Competition.settings de la ronda correspondiente).
 */
export interface TiePlan {
  slot: number;
  teamAId: number;
  teamBId: number;
  legs: Array<{ leg: "single" | "first" | "second"; homeTeamId: number; awayTeamId: number }>;
}

export function planTie(fixture: KnockoutFixture, doubleLeg: boolean): TiePlan {
  return {
    slot: fixture.slot,
    teamAId: fixture.homeTeamId,
    teamBId: fixture.awayTeamId,
    legs: doubleLeg
      ? [
          { leg: "first", homeTeamId: fixture.homeTeamId, awayTeamId: fixture.awayTeamId },
          { leg: "second", homeTeamId: fixture.awayTeamId, awayTeamId: fixture.homeTeamId },
        ]
      : [{ leg: "single", homeTeamId: fixture.homeTeamId, awayTeamId: fixture.awayTeamId }],
  };
}

// ── Resolución de un Tie ─────────────────────────────────────────────────

export type TieMatchStatus = "pending" | "in_progress" | "confirmed" | "voided";

export interface TieMatchInput {
  leg: "single" | "first" | "second";
  status: TieMatchStatus;
  homeTeamId: number;
  awayTeamId: number;
  homeScore: number | null;
  awayScore: number | null;
}

export interface TieResolutionResult {
  status: "pending" | "first_leg_done" | "resolved";
  /** Suma del agregado a favor de teamA (para mostrar "3 — 2" en el bracket). */
  aggregateA: number | null;
  aggregateB: number | null;
  winnerTeamId: number | null;
  /** true si el agregado quedó empatado y hace falta resolverlo a mano
   *  (sin gol de visitante ni penales en el sistema). */
  needsManualResolution: boolean;
}

/**
 * Único lugar que decide el estado de un cruce. Todo lo demás (bracket
 * visual, "qué toca anunciar ahora", si ya se puede crear la vuelta) lee
 * este resultado — no vuelve a calcular nada por su cuenta.
 */
export function resolveTie(teamAId: number, teamBId: number, matches: TieMatchInput[]): TieResolutionResult {
  const confirmed = matches.filter((m) => m.status === "confirmed");

  if (confirmed.length === 0) {
    return { status: "pending", aggregateA: null, aggregateB: null, winnerTeamId: null, needsManualResolution: false };
  }

  let aggA = 0;
  let aggB = 0;
  for (const m of confirmed) {
    const scoreA = m.homeTeamId === teamAId ? m.homeScore ?? 0 : m.awayScore ?? 0;
    const scoreB = m.homeTeamId === teamBId ? m.homeScore ?? 0 : m.awayScore ?? 0;
    aggA += scoreA;
    aggB += scoreB;
  }

  const totalLegs = matches.filter((m) => m.status !== "voided").length;
  const allLegsConfirmed = confirmed.length === totalLegs && totalLegs > 0;

  if (!allLegsConfirmed) {
    return { status: "first_leg_done", aggregateA: aggA, aggregateB: aggB, winnerTeamId: null, needsManualResolution: false };
  }

  if (aggA === aggB) {
    return { status: "first_leg_done", aggregateA: aggA, aggregateB: aggB, winnerTeamId: null, needsManualResolution: true };
  }

  return {
    status: "resolved",
    aggregateA: aggA,
    aggregateB: aggB,
    winnerTeamId: aggA > aggB ? teamAId : teamBId,
    needsManualResolution: false,
  };
}

// ── "¿Qué toca ahora?" — una sola vez, no tres ──────────────────────────

export interface RoundTieSummary {
  round: number;
  tieId: number;
  resolution: TieResolutionResult;
}

export type NextCupAction =
  | { kind: "create_first_round"; teams: SeedableTeam[] }
  | { kind: "create_ties"; round: number; fixtures: KnockoutFixture[] }
  | { kind: "await_results"; round: number; pendingTieIds: number[] }
  | { kind: "resolve_manually"; round: number; tieIds: number[] }
  | { kind: "champion"; teamId: number }
  | { kind: "idle" };

/**
 * Dado el estado de todas las rondas ya jugadas de una copa, decide qué
 * sigue. Reemplaza checkAndAdvanceCupTie/resolveCupTieManually/el cálculo
 * del botón de plantilla de V3 — los tres hacían esta misma pregunta con
 * criterios ligeramente distintos entre sí, y eso fue lo que causó los
 * bugs de la sesión de auditoría.
 */
export function nextCupAction(roundsPlayed: RoundTieSummary[][]): NextCupAction {
  if (roundsPlayed.length === 0) return { kind: "idle" }; // el llamador decide si corresponde create_first_round

  const lastRound = roundsPlayed[roundsPlayed.length - 1];

  const needingManual = lastRound.filter((t) => t.resolution.needsManualResolution).map((t) => t.tieId);
  if (needingManual.length > 0) {
    return { kind: "resolve_manually", round: lastRound[0].round, tieIds: needingManual };
  }

  const pending = lastRound.filter((t) => t.resolution.status !== "resolved").map((t) => t.tieId);
  if (pending.length > 0) {
    return { kind: "await_results", round: lastRound[0].round, pendingTieIds: pending };
  }

  // Toda la última ronda está resuelta.
  if (lastRound.length === 1) {
    return { kind: "champion", teamId: lastRound[0].resolution.winnerTeamId! };
  }

  const winnersInOrder = lastRound.map((t) => t.resolution.winnerTeamId!);
  const fixtures = generateKnockoutNextRound(lastRound[0].round, winnersInOrder);
  return { kind: "create_ties", round: lastRound[0].round + 1, fixtures };
}
