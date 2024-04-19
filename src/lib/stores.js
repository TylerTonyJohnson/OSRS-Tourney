import { derived, readable, writable } from 'svelte/store';

export const tournament = writable();
export const teams = writable([]);
export const challenges = writable([]);
export const completions = writable([]);
export const messages = writable([]);

export const rules = readable({
	maxTeams: 4,
	maxChallenges: 25,
	pointDecrement: 1,
	maxPointDecrement: 2
});

export const selectedTeam = writable(null);
export const isolatedTeam = writable(null);
export const isEditable = writable(false);
export const isResetting = writable(false);
export const isDancing = writable(false);

export const scores = derived(
	[teams, challenges, completions, rules],
	([$teams, $challenges, $completions, $rules]) => {
		return $teams
			.map((team) => {
				return {
					team: team.id,
					points: $completions
						.filter((completion) => completion.team === team.id)
						.map((completion) => completion.challenge)
						.map((challenge) => {
							return (
								$challenges.find((otherChallenge) => otherChallenge.id === challenge).points -
								$rules.pointDecrement *
									($challenges.find((otherChallenge) => otherChallenge.id === challenge).type ===
									'main'
										? 1
										: 0) *
									Math.min(
										$completions
											.filter((completion) => completion.challenge === challenge)
											.sort((a, b) => a.created_at - b.created_at)
											.findIndex((completion) => completion.team === team.id),
										$rules.maxPointDecrement
									)
							);
						})
						.reduce((sum, points) => sum + points, 0)
				};
			})
			.sort((a, b) => b.points - a.points);
	}
);
