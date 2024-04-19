<script>
	import { fade, scale } from 'svelte/transition';
	import { supabase } from '../supabaseClient.js';
	import {
		rules,
		teams,
		completions,
		tournament,
		selectedTeam,
		isolatedTeam,
		messages,
		isEditable
	} from '../stores';

	export let challenge;
	export let isActive = false;

	const decrement = 1;
	const maxDecrement = 2;

	$: currentCompletions = $completions.filter(
		(completion) => completion.challenge === challenge.id
	);

	$: isGray = currentCompletions.length >= $rules.maxTeams;

	$: points =
		challenge.points -
		(challenge.type === 'main' ? Math.min(currentCompletions.length, maxDecrement) : 0) * decrement;

	function completeChallenge() {
		if (!$isEditable) return;
		const message = {
			tournament: $tournament.id,
			text: `Completed the challenge ${challenge.name}`,
			type: 'completion',
			sender: $selectedTeam.name
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
		if (!$isEditable) return;
		const { error } = await supabase.from('completions').insert({
			tournament: $tournament.id,
			challenge: challenge.id,
			team: team.id
		});

		if (error) {
			console.error('Error adding challenge', error);
			return {
				status: 500,
				error: 'Could not add challenge'
			};
		}
	}

	async function removeCompletion(team) {
		if (!$isEditable) return;
		// console.log('removing team');

		const { error } = await supabase
			.from('completions')
			.delete()
			.eq('team', team.id)
			.eq('challenge', challenge.id);

		if (error) {
			console.error('Error remove completion', error);
			return {
				status: 500,
				error: 'Could not remove completion'
			};
		}
	}

	async function addMessage(message) {
		if (!$isEditable) return;
		if ($messages.includes(message)) return;

		const { error } = await supabase.from('messages').insert(message);

		if (error) {
			console.error('Error adding message', error);
			return {
				status: 500,
				error: 'Could not add message'
			};
		}
	}

	async function removeMessage(message) {
		if (!$isEditable) return;

		const { error } = await supabase.from('messages').delete().eq('text', message.text);

		if (error) {
			console.error('Error removing message', error);
			return {
				status: 500,
				error: 'Could not remove message'
			};
		}
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<button
	class="challenge"
	on:click={() => completeChallenge(challenge)}
	style="order: {challenge.order};"
	class:active={isActive}
	in:scale
	class:gray={isGray}
	class:editable={$isEditable}
	disabled={!$isEditable || !isActive}
>
	{#if isActive}
		<div
			class="face front"
			style="border-image: url('images/interface/Message Border.png') 8 / 4px repeat;"
			out:fade={{ delay: 200 }}
		>
			<!-- svelte-ignore a11y-missing-attribute -->
			<img
				class="challenge-icon"
				src="images/challenge-icons/{challenge.name}.png"
				class:gray={isGray}
			/>

			<div class="name">{challenge.name}</div>
			<div class="points">{points}</div>
			<div class="completions">
				{#each currentCompletions as completion}
					{@const teamName = $teams.find((team) => team.id === completion.team).name}
					<div class="completion" transition:scale>
						<!-- svelte-ignore a11y-missing-attribute -->
						<img class="icon" src="images/interface/Banner {teamName}.png" />
					</div>
				{/each}
			</div>
		</div>
	{:else}
		<div
			class="face back"
			style="border-image: url('images/interface/Message Border.png') 8 / 4px repeat;"
			out:fade={{ delay: 200 }}
		>
			{#if challenge.order === 13}
				<img class="icon blur" src="images/challenge-icons/Hidden 4.png" alt="Hidden" />
			{:else}
				<img class="icon blur" src="images/challenge-icons/Hidden 3.png" alt="Hidden" />
			{/if}
			<!-- <div class="points">?</div> -->
		</div>
	{/if}
</button>

<style>
	.challenge {
		position: relative;
		width: 100px;
		height: 100px;
		transform-style: preserve-3d;
		transition:
			scale 0.15s ease-out,
			rotate 0.25s ease-out,
			background-color 0.15s ease-out;

		font-size: medium;
		color: yellow;
		text-shadow: 1px 1px 0px black;
		text-align: center;
		box-shadow: 0px 0px 10px 10px #0004;
		/* backdrop-filter: blur(10px); */

		transition-property: scale, background-color, backdrop-filter, transform;
		transition-duration: 0.15s;
		transition-timing-function: ease-out;
		/* padding: 0.25rem; */
	}

	.face {
		position: absolute;
		inset: 0;
		padding: 0.25rem;
		backface-visibility: hidden;

		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
	}

	.front {
		backdrop-filter: blur(10px);
	}

	.back {
		transform: rotateY(180deg);
		/* background-color: #0009; */
		background-image: radial-gradient(transparent, black);
		/* filter: grayscale(100%); */
	}

	.challenge:not(.editable), .challenge:not(.active) {
		cursor: inherit;
	}

	.challenge:hover.active.editable {
		background-color: teal;
		scale: 1.1;
	}

	.challenge.gray {
		backdrop-filter: blur(10px) grayscale(100%);
		color: white;
	}

	.challenge-icon {
		position: absolute;
		inset: 0;
		filter: drop-shadow(5px 5px 5px #000);
	}

	.challenge-icon.gray {
		filter: grayscale(100%);
	}

	.face > .name {
		position: absolute;
		margin: 0.25rem auto;
		/* background-color: teal; */
		left: 50%;
		top: 0%;
		translate: -50% 0%;
		width: 100%;
	}

	.face > .points {
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

	.challenge:not(.active) {
		/* visibility: hidden; */
		transform: rotateY(180deg);
		/* backface-visibility: hidden; */
		/* filter: blur(20px); */

		/* border: solid black 2px; */
	}

	.blur {
		/* filter: blur(1px); */
	}

	.isolated {
		scale: 2;
	}
</style>
