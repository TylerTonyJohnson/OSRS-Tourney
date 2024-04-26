<script>
	import { fade, fly, scale } from 'svelte/transition';
	import {
		rules,
		challenges,
		selectedTeam,
		isolatedTeam,
		completions,
		scores,
		isEditable
	} from '../stores.js';
	import Healthbar from './Healthbar.svelte';

	export let team;
	export let maxHealth;

	$: currentHealth = $scores.find((score) => score.team === team.id)?.points ?? 0;

	$: isWinning = $scores[0].points === currentHealth && currentHealth > 0;

	$: simpleName = team.name.replace("'", '');

	function selectTeam() {
		if (!$isEditable) return;
		// console.log('selecting team');
		$selectedTeam = team;
		$isolatedTeam = null;
	}

	function isolateTeam() {
		if (!$isEditable) return;
		console.log('isolating team');
		$isolatedTeam = team;
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<button
	class="team"
	class:selected={team === $selectedTeam}
	on:click={selectTeam}
	on:dblclick={isolateTeam}
	in:fly={{ x: -100, duration: 300 }}
	class:editable={$isEditable}
	disabled={!$isEditable}
	style="order: {team.number};"
>
	<div class="fade"></div>
	<div
		class="border"
		style="border-image: url('images/interface/Message Border.png') 8 / 8px repeat;"
	></div>
	<div class="content" style="background-image: url('images/interface/{simpleName}.png');">
		<img class="banner" src="images/interface/Banner {team.number}.png" alt="Asgarnia Banner" />
		<Healthbar {maxHealth} {currentHealth} />
		<div class="name-container">
			{#each team.name.split(' ') as word}
				<div class="name">{word}</div>
			{/each}
		</div>
	</div>
	{#if isWinning}
		<div class="crown-container" transition:scale>
			<img class="crown" src="images/Yellow Hat.png" alt="Crown" />
		</div>
	{/if}
</button>

<style>
	.team {
		--highlight: black;

		position: relative;
		display: flex;

		width: 240px;
		/* height: 90px; */
		height: 116px;
		background-size: cover;
		image-rendering: pixelated;
		/* overflow: hidden; */
		user-select: none;
		box-shadow: 0px 0px 10px 10px #0004;
		transition-property: all;
		transition-duration: 100ms;
		transition-timing-function: ease-out;
	}

	.fade {
		position: absolute;
		inset: 0;
		background-image: linear-gradient(to left, transparent, var(--highlight));
	}

	.banner {
		margin: 0 0.5rem;
		grid-area: banner;
		height: 50%;
		image-rendering: auto;
		margin-right: auto;
		/* background-color: green; */
	}

	.team:not(.editable) {
		cursor: inherit;
	}

	.team:hover.editable {
		--highlight: teal;
		/* background-image: linear-gradient(to right, transparent, white); */
		scale: 1.1;
	}

	.content {
		position: absolute;
		inset: 6px;
		display: grid;
		grid-template-columns: auto 1fr;
		grid-template-rows: auto 1fr;
		grid-template-areas:
			'banner healthbar'
			'banner name';
		background-size: auto 90%;
		background-repeat: no-repeat;
		background-position-x: 15%;
		background-position-y: 80%;
		/* grid-template-rows: 1fr 1fr; */
		/* align-items: center; */
		/* justify-content: space-between; */

		/* background-color: purple; */
		/* animation: flow 5s linear infinite; */
	}

	/* @keyframes flow {
		from {
			background-position-x: 0%;
		}
		to {
			background-position-x: 100%;
		}
	} */

	.name-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: end;

		grid-area: name;
		padding: 0 8px;
		/* background-color: blue; */
		/* overflow: hidden; */
	}

	.name {
		color: white;
		text-align: end;
		font-size: 32px;
		text-shadow: 2px 2px black;
		font-weight: lighter;
		/* border: 1px blue solid; */
	}

	.border {
		position: absolute;
		inset: 0;
	}

	.team.selected {
		background-color: teal;
		border: solid white 2px;
	}

	.crown-container {
		position: absolute;
		height: 40%;
		right: 1%;
		top: -22%;
		/* background-color: pink; */
	}

	.crown-container::before {
		content: '';
		position: absolute;
		inset: -50%;
		background-image: repeating-conic-gradient(
			transparent 0,
			hsl(60, 100%, 50%) 30deg,
			transparent 60deg
		);
		mask-image: radial-gradient(circle at center, black, transparent 60%);
		border-radius: 50%;
		animation:
			spin 10s linear infinite,
			pulse 2s linear infinite;
		z-index: 1;
	}

	.crown {
		position: relative;
		inset: 0;
		height: 100%;
		z-index: 2;
	}

	@keyframes spin {
		from {
			rotate: 0deg;
		}
		to {
			rotate: 360deg;
		}
	}

	@keyframes pulse {
		0% {
			scale: 1;
		}
		50% {
			scale: 1.2;
		}
		100% {
			scale: 1;
		}
	}
</style>
