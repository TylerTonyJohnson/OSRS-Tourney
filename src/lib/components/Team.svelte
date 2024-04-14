<script>
	import { selectedTeam } from '../stores.js';
	import Healthbar from './Healthbar.svelte';

	export let team;
	export let maxHealth;
	export let currentHealth;
</script>

<div class="team" class:selected={team === $selectedTeam} on:click={() => selectTeam(team)}>
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
		/* background-color: teal;
		border: solid white 2px; */
	}
</style>
