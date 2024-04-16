<script>
	import { challenges, selectedTeam, isolatedTeam, completions } from '../stores.js';
	import Healthbar from './Healthbar.svelte';

	export let team;
	export let maxHealth;

	$: currentHealth = 99;

	$: completedChallenges = $completions
		.filter((completion) => completion.team === team.id)
		.map((completion) => completion.challenge);

	function selectTeam() {
		// console.log('selecting team');
		$selectedTeam = team;
		$isolatedTeam = null;
	}

	function isolateTeam() {
		console.log('isolating team');
		$isolatedTeam = team;
	}

	function getCurrentHealth() {

		let totalPoints = 0;

		console.log(completedChallenges);

		completedChallenges.forEach((challenge) => {
			const sortedCompletions = $completions
				.filter((completion) => completion.challenge === challenge)
				.sort((a, b) => a.created_at - b.created_at);

			// console.log(sortedCompletions);

			const teamIndex = sortedCompletions.findIndex((completion) => completion.team === team.id);

			totalPoints += challenge.points - teamIndex;
		});

		return totalPoints;
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="team"
	class:selected={team === $selectedTeam}
	on:click={selectTeam}
	on:dblclick={getCurrentHealth}
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
</div>

<style>
	.team {
		position: relative;
		display: flex;

		width: 240px;
		height: 90px;
		background-size: cover;
		image-rendering: pixelated;
		overflow: hidden;
		user-select: none;
	}

	.fade {
		position: absolute;
		inset: 0;
		background-image: linear-gradient(to right, transparent, black);
	}

	.banner {
		grid-area: banner;
		height: 100%;
		image-rendering: pixelated;
		margin-right: auto;
		/* filter: blur(5px); */
	}

	.team:hover {
		background-color: black;
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
</style>
