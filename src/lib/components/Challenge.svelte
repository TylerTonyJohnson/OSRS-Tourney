<script>
	import { teams, completions, tournament, selectedTeam, messages } from '../stores';
	import { scale } from 'svelte/transition';
	import { supabase } from '../supabaseClient.js';
	export let challenge;
	export let currentTouchedChallenges;

	const outerThreshold = 8;
	const innerThreshold = 16;

	const decrement = 1;
	const maxDecrement = 2;

	const outerRingIndeces = [1, 2, 3, 4, 5, 6, 10, 11, 15, 16, 20, 21, 22, 23, 24, 25];
	const innerRingIndeces = [7, 8, 9, 12, 13, 14, 17, 18, 19];
	const coreIndeces = [13];

	$: currentCompletions = $completions.filter(
		(completion) => completion.challenge === challenge.id
	);

	$: points = challenge.points - Math.min(currentCompletions.length, maxDecrement) * decrement;

	function completeChallenge() {
		const message = {
			type: 'notification',
			text: `Clan ${$selectedTeam.name} completed the challenge ${challenge.name}`
		};

		if (currentCompletions.some((completion) => completion.team === $selectedTeam.id)) {
			// console.log('need to remove');
			removeCompletion($selectedTeam);
			removeMessage(message);
		} else {
			// console.log('need to add');
			addCompletion($selectedTeam);
			addMessage(message);
		}
	}

	async function addCompletion(team) {
		// console.log('adding team');
		// console.log(challenge, team);
		const { error } = await supabase.from('completions').insert({
			tournament: $tournament,
			challenge: challenge.id,
			team: team.id,
		});

		if (error) {
			console.error('Error updating challenge', error);
			return {
				status: 500,
				error: 'Could not update challenge'
			};
		}
	}

	async function removeCompletion(team) {
		// console.log('removing team');

		const { error } = await supabase
			.from('completions')
			.delete()
			.eq('team', team.id)
			.eq('challenge', challenge.id);

		if (error) {
			console.error('Error updating completion', error);
			return {
				status: 500,
				error: 'Could not update completion'
			};
		}
	}

	function addMessage(message) {
		if ($messages.includes(message)) return;
		$messages = [...$messages, message];
	}

	function removeMessage(message) {
		$messages = $messages.filter((existingMessage) => existingMessage.text !== message.text);
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="challenge"
	on:click={() => completeChallenge(challenge)}
	style="order: {challenge.order}; border-image: url('images/interface/Message Border.png') 8 / 4px repeat;"
	class:hidden={(innerRingIndeces.includes(challenge.order) &&
		currentTouchedChallenges < outerThreshold) ||
		(coreIndeces.includes(challenge.order) && currentTouchedChallenges < innerThreshold)}
	in:scale
>
	<!-- svelte-ignore a11y-missing-attribute -->
	<img class="challenge-icon" src="images/challenge-icons/{challenge.name}.png" />
	<div class="name">{challenge.name}</div>
	<div class="points">{points}</div>
	<div class="completions">
		{#each currentCompletions as completion}
			{@const teamName = $teams.find((team) => team.id === completion.team).name}
			<div class="completion">
				<!-- svelte-ignore a11y-missing-attribute -->
				<img class="icon" src="images/interface/Banner {teamName}.png" />
			</div>
		{/each}
	</div>
</div>

<style>
	.challenge {
		position: relative;
		width: 100px;
		height: 100px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 0.25rem;
		align-items: center;
		/* background-color: #0006; */
		backdrop-filter: blur(20px);
		/* box-shadow: 4px 4px 10px 10px #0004;	 */
		border: solid black 2px;
		/* overflow:hidden; */
		font-size: medium;
		color: yellow;
		text-align: center;
		box-shadow: 0px 0px 10px 10px #0004;
		/* filter: blur(4px); */
		transition-property: scale, background-color;
		transition-duration: 0.15s;
		transition-timing-function: ease-out;
	}

	.challenge:hover {
		background-color: black;
		scale: 1.1;
	}

	.challenge-icon {
		position: absolute;
		filter: drop-shadow(5px 5px 5px #000);
	}

	.challenge > .name {
		position: absolute;
		/* background-color: teal; */
		left: 50%;
		top: 0%;
		translate: -50% 0%;
		width: 100%;
	}

	.challenge > .points {
		position: absolute;
		/* aspect-ratio: 1 / 1; */
		background: radial-gradient(black 20%, transparent 75%);
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		font-size: 2rem;
		width: 2rem;
		text-shadow: 0px 0px 5px black;
		text-align: center;
		color: white;
	}

	.completions {
		position: absolute;
		width: 100%;
		grid-template-columns: repeat(4, 1fr);
		display: grid;
		bottom: 0;
	}

	.completion {
		position: relative;
		/* width: 10px;
		height: 10px; */
		aspect-ratio: 1 / 1;
		/* background-color: yellow; */
	}

	.icon {
		filter: drop-shadow(2px 2px 4px #000);
		width: 100%;
		/* border: solid white 1px; */
		/* border-radius: 50%; */
		/* background-color: black; */
	}

	.hidden {
		visibility: hidden;
		/* filter: blur(20px); */

		/* border: solid black 2px; */
	}
</style>
