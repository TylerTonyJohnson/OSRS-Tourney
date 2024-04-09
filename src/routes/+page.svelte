<script>
	import '../styles.css';
	import challengeDataDefault from '$lib/challenges.json';
	import { onMount } from 'svelte';
	import Healthbar from '../lib/components/Healthbar.svelte';

	let teams, challenges, messages;

	let challengeData;

	let selectedTeam;

	onMount(() => {
		load();

		selectedTeam = teams[0];
	});

	function load() {
		const localData = JSON.parse(localStorage.getItem('OSRS-Tourney-Data'));
		if (localData) {
			challengeData = localData;
		} else {
			challengeData = challengeDataDefault;
		}

		({ teams, challenges, messages } = challengeData);
	}

	function save() {
		const saveData = JSON.stringify(challengeData);
		localStorage.setItem('OSRS-Tourney-Data', saveData);
	}

	function reset() {
		challengeData = challengeDataDefault;
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
		challenge.completed = [...challenge.completed, teamName];
	}

	function removeCompletedTeam(challenge, teamName) {
		challenge.completed = challenge.completed.filter((existingTeam) => existingTeam !== teamName);
	}

	function addMessage(message) {
		if (messages.includes(message)) return;
		messages = [...messages, message];
	}

	function removeMessage(message) {
		messages = messages.filter((existingMessage) => existingMessage.text !== message.text);
	}
</script>

<div class="frame">
	{#if challengeData}
		<!-- TEAMS -->
		<div class="teams">
			{#each teams as team}
				<div class="team" class:selected={team === selectedTeam} on:click={() => selectTeam(team)}>
					<Healthbar />
					<div class="name">{team.name}</div>
				</div>
			{/each}
		</div>
		<!-- CHALLENGES -->
		<div class="challenges">
			{#each challenges as challenge}
				<div class="challenge" on:click={() => updateChallenge(challenge)}>
					<div class="name">{challenge.name}</div>
					<div class="points">{challenge.value}</div>
				</div>
			{/each}
		</div>
		<!-- EVENTS -->
		<div class="messages-container">
			<div class="messages">
				{#each [...messages].reverse() as message}
					<div class="message">{message.text}</div>
				{/each}
			</div>
			<div class="input-container">
				<span class="input-name">Fensail</span>
				<div class="input"></div>
			</div>
		</div>
	{/if}
	<div class="button-container">
		<button class="save" on:click={save}>SAVE</button>
		<button class="reset" on:click={reset}>RESET</button>
	</div>
</div>

<style>
	.frame {
		width: 100vw;
		height: 100vh;
		display: flex;
		align-items: center;
		flex-direction: column;
		background-color: darkolivegreen;
		padding: 1rem;
		gap: 1rem;
		scrollbar-gutter: stable;
	}
	.challenges {
		display: grid;
		grid-template-columns: repeat(5, auto);
		grid-template-rows: repeat(5, auto);
		gap: 4px;
	}

	.challenge {
		width: 100px;
		height: 100px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 0.25rem;
		align-items: center;
		background-color: #0004;
		/* border: solid green 1px; */
		font-size: larger;
		color: white;
		text-align: center;
	}

	.challenge:hover {
		background-color: blue;
	}

	.teams {
		display: flex;
	}

	.team {
		display: flex;
		/* justify-content: center; */
		align-items: center;
		padding: 1rem;
		gap: 1rem;
		border: solid orange 1px;
		background-color: purple;
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

	.points {
		color: lightcoral;
		text-align: center;
	}

	.button-container {
		display: flex;
	}

	.messages-container {
		/* box-sizing: content-box; */
		display: flex;
		flex-direction: column;
		padding: 12px;
		width: 518px;
		height: 144px;
		border-image: url('Message Border.png') 8 / 16px repeat;
		background-image: url('Message Background.png');
		background-size: 100%;
		image-rendering: pixelated;
		font-size: 14px;
		line-height: 12.5px;
	}

	.messages {
		width: 100%;
		padding: 4px 4px;
		/* height: calc(8/9 * 100%); */
		/* background-color: teal; */
		overflow: auto;
		box-shadow: inset 2px 2px 4px 0px #0008;
	}

	::-webkit-scrollbar {
		/* height: 12px; */
		width: 16px;
		background: #000;
	}

	::-webkit-scrollbar-thumb {
        background: url('Scroll Bar.png');
        background-size: cover;
        image-rendering: pixelated;
        background-repeat: no-repeat;
	}

	/* ::-webkit-scrollbar-corner {
		background: #000;
	} */

    ::-webkit-scrollbar-button:single-button:vertical:decrement {
        background: url('Scroll Bar Up.png');
        width: 16px;
        height: 16px;
        background-size: cover;
        image-rendering: pixelated;
        background-repeat: no-repeat;
    }
    ::-webkit-scrollbar-button:single-button:vertical:increment {
        width: 16px;
        height: 16px;
        background: url('Scroll Bar Down.png');
        background-size: cover;
        image-rendering: pixelated;
        background-repeat: no-repeat;
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
