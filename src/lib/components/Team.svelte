<script>
	import { fade, fly, scale } from 'svelte/transition';
	import {
		rules,
		challenges,
		selectedTeam,
		isolatedTeam,
		completions,
		scores,
		winningTeam
	} from '../stores.js';
	import Healthbar from './Healthbar.svelte';

	export let team;
	export let maxHealth;

	$: currentHealth = $scores.find((score) => score.team === team.id)?.points ?? 0;

	$: isWinning = $scores[0].points === currentHealth && currentHealth > 0;

	$: console.log(isWinning);

	function selectTeam() {
		// console.log('selecting team');
		$selectedTeam = team;
		$isolatedTeam = null;
	}

	function isolateTeam() {
		console.log('isolating team');
		$isolatedTeam = team;
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="team"
	class:selected={team === $selectedTeam}
	on:click={selectTeam}
	on:dblclick={isolateTeam}
	in:fly={{ x: -100, duration: 300 }}
>
	<div class="fade"></div>
	<div
		class="border"
		style="border-image: url('images/interface/Message Border.png') 8 / 8px repeat;"
	></div>
	<div class="content">
		<img class="banner" src="images/interface/Banner {team.name}.png" alt="Asgarnia Banner" />
		<Healthbar {maxHealth} {currentHealth} />
		<div class="name">{team.name}</div>
	</div>
	{#if isWinning}
		<div class="crown-container" transition:scale>
			<img class="crown" src="images/Yellow Hat.png" alt="Crown" />
		</div>
	{/if}
</div>

<style>
	.team {
		--highlight: black;

		position: relative;
		display: flex;

		width: 240px;
		height: 90px;
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
		background-image: linear-gradient(to right, transparent, var(--highlight));
	}

	.banner {
		grid-area: banner;
		height: 100%;
		image-rendering: auto;
		margin-right: auto;
	}

	.team:hover {
		--highlight: teal;
		/* background-image: linear-gradient(to right, transparent, white); */
		scale: 1.1;
	}

	.content {
		position: absolute;
		inset: 10px;
		display: grid;
		grid-template-areas:
			'banner healthbar'
			'banner name';
		grid-template-rows: 1fr 1fr;
		align-items: center;
	}

	.name {
		grid-area: name;
		color: white;
		/* margin-left: auto; */
		margin-right: 4px;
		text-align: end;
		font-size: 32px;
		/* letter-spacing: 1px; */
		text-shadow: 2px 2px black;
		font-weight: lighter;
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
		right: 5%;
		top: -18%;
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
