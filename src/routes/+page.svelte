<script>
	import '../styles.css';
	import tourneyDataDefault from '$lib/tourneyData.json';
	import { onMount } from 'svelte';
	import Healthbar from '../lib/components/Healthbar.svelte';
    // import {image} from '/images/Zuk.png';

	let tourneyData;

	let teams = [];
	let challenges = [];
	let messages = [];

	$: maxHealth = challenges.reduce((sum, currentChallenge) => {
		return sum + currentChallenge.value;
	}, 0);

	let selectedTeam;

	onMount(() => {
		load();

		selectedTeam = teams[0];
	});

	function load() {
		const localData = JSON.parse(localStorage.getItem('OSRS-Tourney-Data'));
		if (localData) {
			tourneyData = localData;
		} else {
			tourneyData = tourneyDataDefault;
		}

		({ teams, challenges, messages } = tourneyData);
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

	function getTeamHealth(teamName) {
		const completedChallenges = challenges.filter((challenge) =>
			challenge.completed.includes(teamName)
		);
		const totalHealth = completedChallenges.reduce((sum, challenge) => sum + challenge.value, 0);
		return totalHealth;
	}
</script>

<div class="frame" style="background-image: url('images/Zuk.png')">
	{#if tourneyData}
		<!-- TEAMS -->
		<div class="teams">
			{#each teams as team}
				{@const currentHealth = getTeamHealth(team.name)}
				<div class="team" class:selected={team === selectedTeam} on:click={() => selectTeam(team)}>
                    <img class='hat' src="images/{team.icon}"/>
                    <Healthbar {maxHealth} {currentHealth} />
					<div class="name">{team.name}</div>
				</div>
			{/each}
		</div>
		<!-- CHALLENGES -->
		<div class="challenges">
			{#each challenges as challenge}
                {@const frank = console.log(challenge) }
				<div class="challenge" on:click={() => updateChallenge(challenge)}>
                    <img class='challenge-icon' src="images/challenge-icons/{challenge.icon}" />
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
		max-width: 100vw;
		height: 100vh;
		display: flex;
		align-items: center;
		flex-direction: column;
		/* background-color: darkolivegreen; */
		/* background-image: url('images/Inferno.png'); */
		/* background-image: url('images/Zuk.png'); */
        background-size: cover;
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

	.challenges {
		display: grid;
		grid-template-columns: repeat(5, auto);
		grid-template-rows: repeat(5, auto);
		gap: 4px;
        /* backdrop-filter: brightness(0.75); */
        padding: 2rem;
        
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
        backdrop-filter: blur(40px);
        border: solid yellow 1px;
		/* border: solid green 1px; */
		font-size: medium;
		color: yellow;
		text-align: center;
        /* box-shadow: 0px 0px 10px 10px #FFF4; */
		/* filter: blur(4px); */
	}

	.challenge:hover {
		background-color: blue;
        cursor: url('images/interface/Scimitar.png'), auto;
	}

    .challenge-icon {
        position: absolute;
    }

    .challenge > .name {
        position: absolute;
        /* background-color: teal; */
        left: 50%;
        top: 0%;
        translate: -50% 0%;
    }

    .challenge > .points {
        position: absolute;
        /* background-color: purple; */
        left: 50%;
        top: 50%;
        translate: -50% -50%;
    }

	.teams {
		display: flex;
        gap: 1rem;
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
		flex-direction: column;
		justify-content: space-between;
		padding: 12px;
		width: 518px;
		height: 144px;
		border-image: url('images/interface/Message Border.png') 8 / 16px repeat;
		background-image: url('images/interface/Message Background.png');
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
