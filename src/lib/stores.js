import { readable, writable } from "svelte/store";

export const tournament = readable('f1c04b40-4faa-43f9-b058-bfc1db35d388');
export const teams = writable([]);
export const challenges = writable([]);
export const completions = writable([]);
export const messages = writable([]);

export const selectedTeam = writable(null);
export const isolatedTeam = writable(null);
export const isEditable = writable(false);
