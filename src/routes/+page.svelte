<script>
	import '../styles.css';
	import { onMount } from 'svelte';
	import tourneyDataDefault from '$lib/tourneyData.json';
	import Healthbar from '../lib/components/Healthbar.svelte';
	import { teams, challenges, messages } from '$lib/stores.js';

	let tourneyData;

	const decrement = 1;
	const maxDecrement = 2;

	$: maxHealth = $challenges.reduce((sum, currentChallenge) => {
		return sum + currentChallenge.value;
	}, 0);

	let selectedTeam;

	onMount(() => {
		load();

		selectedTeam = $teams[0];
		styleScrollbar();
	});

	function styleScrollbar() {
		const style = document.createElement('style');
		style.textContent = `
			::-webkit-scrollbar {
				/* height: 12px; */
				width: 16px;
				background: #000;
			}

			::-webkit-scrollbar-thumb {
				background: url('images/interface/Scroll Bar.png');
				border-radius: 4px;
				border: solid black 1px;
				background-size: contain;
				image-rendering: pixelated;
				background-repeat: repeat;
			}

			::-webkit-scrollbar-track {
				background: url('images/interface/Scroll Bar Track.png');
				background-size: contain;
				image-rendering: pixelated;
				background-repeat: repeat;
			}

			::-webkit-scrollbar-button:single-button:vertical:decrement {
				background: url('images/interface/Scroll Bar Up.png');
				width: 16px;
				height: 16px;
				background-size: cover;
				image-rendering: pixelated;
				background-repeat: no-repeat;
			}
			::-webkit-scrollbar-button:single-button:vertical:increment {
				width: 16px;
				height: 16px;
				background: url('images/interface/Scroll Bar Down.png');
				background-size: cover;
				image-rendering: pixelated;
				background-repeat: no-repeat;
			}
		`;
		document.head.appendChild(style);
	}

	function load() {
		const localData = JSON.parse(localStorage.getItem('OSRS-Tourney-Data'));
		if (localData) {
			tourneyData = localData;
		} else {
			tourneyData = tourneyDataDefault;
		}

		$teams = tourneyData.teams;
		$challenges = tourneyData.challenges;
		$messages = tourneyData.messages;
	}

	function save() {
		const saveData = JSON.stringify(tourneyData);
		localStorage.setItem('OSRS-Tourney-Data', saveData);
	}

	function reset() {
		tourneyData = tourneyDataDefault;
	}

	function selectTeam(team) {
		if (selectedTeam !== team) selectedTeam = team;
	}

	function updateChallenge(challenge) {
		const message = {
			type: 'notification',
			text: `Clan ${selectedTeam.name} completed the challenge ${challenge.name}`
		};

		if (challenge.completed.includes(selectedTeam.name)) {
			removeCompletedTeam(challenge, selectedTeam.name);
			removeMessage(message);
		} else {
			addCompletedTeam(challenge, selectedTeam.name);
			addMessage(message);
		}
	}

	function addCompletedTeam(challenge, teamName) {
		challenge.completed.push(teamName);
		$challenges = [...$challenges];
	}

	function removeCompletedTeam(challenge, teamName) {
		challenge.completed.splice(challenge.completed.indexOf(teamName), 1);
		$challenges = [...$challenges];
	}

	function addMessage(message) {
		if ($messages.includes(message)) return;
		$messages = [...$messages, message];
	}

	function removeMessage(message) {
		$messages = $messages.filter((existingMessage) => existingMessage.text !== message.text);
	}
</script>

<div class="frame" style="background-image: url('images/Zuk.png')">
	{#if tourneyData}
		<!-- TITLE -->
		<h1 class="title">OSRS Tourney</h1>

		<!-- SETTINGS -->
		<div class="settings">
			<button class="hamburger-button"><span class="material-symbols-outlined"> menu </span></button
			>
		</div>

		<!-- TEAMS -->
		<div class="teams">
			<div class="label">TEAMS</div>
			{#each $teams as team}
				{@const currentHealth = $challenges
					.filter((challenge) => challenge.completed.includes(team.name))
					.reduce(
						(sum, challenge) =>
							sum +
							challenge.value -
							Math.min(challenge.completed.indexOf(team.name), maxDecrement),
						0
					)}
				<div class="team" class:selected={team === selectedTeam} on:click={() => selectTeam(team)}>
					<img class="hat" src="images/{team.icon}" />
					<Healthbar {maxHealth} {currentHealth} />
					<div class="name">{team.name}</div>
				</div>
			{/each}
		</div>
		<!-- CHALLENGES -->
		<div class="challenges-container">
			<div class="label">MAIN CHALLENGES</div>
			<div class="challenges">
				{#each $challenges.filter((challenge) => challenge.type === 'main') as challenge}
					{@const points =
						challenge.value - Math.min(challenge.completed.length, maxDecrement) * decrement}
					<div class="challenge" on:click={() => updateChallenge(challenge)}>
						<img class="challenge-icon" src="images/challenge-icons/{challenge.icon}" />
						<div class="name">{challenge.name}</div>
						<div class="points">{points}</div>
						<div class="completed-teams">
							{#each challenge.completed as teamName}
								{@const icon = $teams.find((team) => team.name === teamName).icon}
								<div class="completed-team">
									<img class="team-icon" src="images/{icon}" />
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
		<div class="bonus-challenges-container">
			<div class="label">BONUS</div>
			<div class="bonus-challenges">
				{#each $challenges.filter((challenge) => challenge.type === 'bonus') as challenge}
					<div class="challenge" on:click={() => updateChallenge(challenge)}>
						<img class="challenge-icon" src="images/challenge-icons/{challenge.icon}" />
						<div class="name">{challenge.name}</div>
						<div class="points">{challenge.value}</div>
						<div class="completed-teams">
							{#each challenge.completed as teamName}
								{@const icon = $teams.find((team) => team.name === teamName).icon}
								<div class="completed-team">
									<img class="team-icon" src="images/{icon}" />
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
		<!-- EVENTS -->
		<div
			class="messages-container"
			style="border-image: url('images/interface/Message Border.png') 8 / 16px repeat; 
				background-image: url('images/interface/Message Background.png');"
		>
			<div class="messages">
				{#each [...$messages].reverse() as message}
					<div class="message">{message.text}</div>
				{/each}
			</div>
			<div class="input-container">
				<span class="input-name">Fensail</span>
				<div class="input"></div>
			</div>
			<div class="button-container">
				<button class="save" on:click={save}>SAVE</button>
				<button class="reset" on:click={reset}>RESET</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.frame {
		/* position: fixed; */
		/* max-width: 100vw;
		height: 100vh; */
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		grid-template-rows: auto auto 1fr;
		grid-template-areas:
			'.     title      settings'
			'teams challenges bonus'
			'.     messages   .';
		/* align-items: center; */
		/* flex-direction: column; */
		/* background-color: darkolivegreen; */
		/* background-image: url('images/Inferno.png'); */
		/* background-image: url('images/Zuk.png'); */
		background-size: cover;
		/* background-repeat: repeat; */
		background-position: 50% 50%;
		/* animation: flow 5s linear infinite; */
		padding: 1rem;
		gap: 1rem;
		/* scrollbar-gutter: stable; */
	}

	@keyframes flow {
		0% {
			background-position: 0% 0%;
		}
		100% {
			background-position: 0% 100%;
		}
	}

	.title {
		grid-area: title;
		text-align: center;
		font-family: 'Earth Theory', sans-serif;
		font-size: 5rem;
		color: yellow;
		text-shadow: 0px 0px 10px black;
		/* text-decoration: underline; */
		/* background-image: linear-gradient(to right, transparent, black, transparent), linear-gradient( to bottom, transparent, black, transparent); */
	}

	.label {
		font-family: 'Earth Theory', sans-serif;
		color: white;
		text-shadow: 0px 0px 10px black;
		text-align: center;
		font-size: 2rem;
	}

	.settings {
		grid-area: settings;
		display: flex;
		justify-content: end;
		align-items: start;
	}

	.hamburger-button {
		background-color: transparent;
		/* aspect-ratio: 1 / 1; */
		border-radius: 50%;
		width: 3rem;
		height: 3rem;
		/* border: none; */
		border: solid white 1px;
		color: white;
		font-size: 2rem;
	}

	.hamburger-button:hover {
		background-color: black;
		/* cursor: url({cursorImage}), auto; */
		scale: 1.1;
	}

	.challenges-container {
		display: grid;
		grid-area: challenges;
	}

	.challenges {
		display: grid;
		/* grid-area: challenges; */
		margin: 1rem auto;
		grid-template-columns: repeat(5, auto);
		grid-template-rows: repeat(5, auto);
		/* grid-auto-rows: min-content;
		grid-auto-columns: min-content; */
		gap: 4px;
		/* backdrop-filter: brightness(0.75); */
		/* padding: 2rem; */
	}

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
		border: solid yellow 1px;
		/* border: solid green 1px; */
		font-size: medium;
		color: yellow;
		text-align: center;
		/* box-shadow: 0px 0px 10px 10px #FFF4; */
		/* filter: blur(4px); */
		transition-property: scale, background-color;
		transition-duration: 0.15s;
		transition-timing-function: ease-out;
	}

	.challenge:hover {
		background-color: black;
		cursor: url('images/interface/Scimitar.png'), auto;
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

	.completed-teams {
		position: absolute;
		padding: 4px;
		width: 100%;
		grid-template-columns: repeat(4, 1fr);
		display: grid;
		gap: 4px;
		bottom: 0;
	}

	.completed-team {
		/* width: 10px;
		height: 10px; */
		aspect-ratio: 1 / 1;
		/* background-color: yellow; */
	}

	.team-icon {
		width: 100%;
		border: solid white 1px;
		border-radius: 50%;
		background-color: black;
	}

	.bonus-challenges-container {
		display: flex;
		flex-direction: column;
		/* gap: 4px; */
		/* justify-content: start; */
		/* align-items: start; */
		margin: auto auto auto 1rem;
		grid-area: bonus;
		/* grid-template-rows: 1fr auto 1fr; */
		/* background-color: red; */
	}

	.bonus-challenges {
		display: grid;
		gap: 4px;
	}

	.teams {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		grid-area: teams;
		/* overflow-y: auto; */
		/* overflow-x: visible; */
	}

	.team {
		position: relative;
		display: flex;
		/* justify-content: center; */
		align-items: center;
		padding: 0.5rem;
		gap: 1rem;
		border: solid orange 1px;
		background-color: purple;
	}

	.team:hover {
		background-color: black;
		cursor: url('images/interface/Scimitar.png'), auto;
		scale: 1.1;
	}

	.team.selected {
		background-color: teal;
		border: solid white 2px;
	}

	.team > .color {
		/* background-size: cover; */
	}

	.team > .name {
		color: white;
		text-align: center;
		font-size: x-large;
	}

	.hat {
		position: absolute;
		width: calc(86px / 2);
		height: calc(74px / 2);
		z-index: 2;
		left: 0;
		top: 0;
		translate: -1.25rem -1.25rem;
		rotate: -30deg;
	}

	.button-container {
		display: flex;
	}

	.messages-container {
		/* box-sizing: content-box; */
		display: flex;
		grid-area: messages;
		flex-direction: column;
		justify-content: space-between;
		padding: 12px;
		width: 518px;
		height: 144px;
		background-size: 100%;
		image-rendering: pixelated;
		font-size: 14px;
		line-height: 12.5px;
	}

	.messages {
		width: 100%;
		padding: 4px 4px;
		height: 100%;
		/* background-color: teal; */
		overflow-y: scroll;
		box-shadow: inset 2px 2px 4px 0px #0008;
	}

	.input-container {
		display: flex;
		/* justify-content: center; */
		align-items: center;
		height: 16px;
		border-top: solid 2px rgba(128, 118, 96, 1);
	}

	.input-name {
		padding: 2px 4px;
	}

	.input {
		background-color: teal;
	}
</style>
