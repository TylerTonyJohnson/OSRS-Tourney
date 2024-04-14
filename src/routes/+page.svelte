<script>
	import '../styles.css';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient.js';
	import {
		tournament,
		teams,
		challenges,
		messages,
		selectedTeam,
		isEditable
	} from '$lib/stores.js';
	import Team from '../lib/components/Team.svelte';
	import ChatBox from '../lib/components/ChatBox.svelte';

	const decrement = 1;
	const maxDecrement = 2;

	const outerThreshold = 8;
	const innerThreshold = 16;

	const outerRingIndeces = [1, 2, 3, 4, 5, 6, 10, 11, 15, 16, 20, 21, 22, 23, 24, 25];
	const innerRingIndeces = [7, 8, 9, 12, 13, 14, 17, 18, 19];
	const coreIndeces = [13];

	$: maxHealth = $challenges.reduce((sum, currentChallenge) => {
		return sum + currentChallenge.points;
	}, 0);

	$: currentTouchedChallenges = $challenges.filter(
		(challenge) => challenge.completed.length > 0
	).length;

	onMount(async () => {
		subscribeToTeams();
		subscribeToChallenges();
		subscribeToMessages();

		await Promise.all([getTeamData(), getChallengeData(), getMessageData()]);

		styleScrollbar();

		if ($teams.length > 0) {
			$selectedTeam = $teams[0];
		}
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

	function subscribeToTeams() {
		const subscription = supabase
			.channel('teams_channel')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'teams'
				},
				(payload) => {
					switch (payload.eventType) {
						case 'INSERT':
							console.log('new', payload.new);
							$teams = [...$teams, payload.new];
							break;
						case 'DELETE':
							console.log('old', payload.old);
							$teams = $teams.filter((journalData) => journalData.id !== payload.old.id);
							break;
					}
				}
			)
			.subscribe();
	}
	function subscribeToChallenges() {
		const subscription = supabase
			.channel('challenges_channel')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'challenges'
				},
				(payload) => {
					switch (payload.eventType) {
						case 'INSERT':
							console.log('new', payload.new);
							$challenges = [...$challenges, payload.new];
							break;
						case 'DELETE':
							console.log('old', payload.old);
							$challenges = $challenges.filter((journalData) => journalData.id !== payload.old.id);
							break;
						case 'UPDATE':
							getChallengeData();
					}
				}
			)
			.subscribe();
	}
	function subscribeToMessages() {
		const subscription = supabase
			.channel('messages_channel')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'messages'
				},
				(payload) => {
					switch (payload.eventType) {
						case 'INSERT':
							console.log('new', payload.new);
							$messages = [...$messages, payload.new];
							break;
						case 'DELETE':
							console.log('old', payload.old);
							$messages = $messages.filter((journalData) => journalData.id !== payload.old.id);
							break;
					}
				}
			)
			.subscribe();
	}

	async function getTeamData() {
		// Get Journals
		const { data, error } = await supabase.from('teams').select('*').eq('tournament', $tournament);
		if (error) {
			console.error('Error fetching teams', error);
			return {
				status: 500,
				error: 'Could not fetch teams'
			};
		} else {
			// console.log('teams', data);
		}
		$teams = data ?? [];
	}

	async function getChallengeData() {
		// Get Journals
		const { data, error } = await supabase
			.from('challenges')
			.select('*')
			.eq('tournament', $tournament);
		if (error) {
			console.error('Error fetching challenges', error);
			return {
				status: 500,
				error: 'Could not fetch challenges'
			};
		} else {
			// console.log('challenges', data);
		}
		$challenges = data ?? [];
	}

	async function getMessageData() {
		// Get Journals
		const { data, error } = await supabase
			.from('messages')
			.select('*')
			.eq('tournament', $tournament);
		if (error) {
			console.error('Error fetching messages', error);
			return {
				status: 500,
				error: 'Could not fetch messages'
			};
		} else {
			// console.log('messages', data);
		}
		$messages = data ?? [];
	}

	function selectTeam(team) {
		if ($selectedTeam !== team) $selectedTeam = team;
	}

	function updateChallenge(challenge) {
		const message = {
			type: 'notification',
			text: `Clan ${$selectedTeam.name} completed the challenge ${challenge.name}`
		};

		if (challenge.completed.includes($selectedTeam.id)) {
			console.log('need to remove');
			removeCompletedTeam(challenge, $selectedTeam);
			removeMessage(message);
		} else {
			console.log('need to add');
			addCompletedTeam(challenge, $selectedTeam);
			addMessage(message);
		}
	}

	async function addCompletedTeam(challenge, team) {
		console.log('adding team');
		// console.log(challenge, team);
		const { error } = await supabase
			.from('challenges')
			.update({
				completed: [...challenge.completed, team.id]
			})
			.eq('id', challenge.id);

		if (error) {
			console.error('Error updating challenge', error);
			return {
				status: 500,
				error: 'Could not update challenge'
			};
		}
	}

	async function removeCompletedTeam(challenge, team) {
		console.log('removing team');
		// console.log(challenge, team);

		const newCompleted = challenge.completed.filter((teamId) => teamId !== team.id);

		console.log(newCompleted);

		const { error } = await supabase
			.from('challenges')
			.update({
				completed: newCompleted
			})
			.eq('id', challenge.id);

		if (error) {
			console.error('Error updating challenge', error);
			return {
				status: 500,
				error: 'Could not update challenge'
			};
		}

		// challenge.completed.splice(challenge.completed.indexOf(team), 1);
		// $challenges = [...$challenges];
	}

	function addMessage(message) {
		if ($messages.includes(message)) return;
		$messages = [...$messages, message];
	}

	function removeMessage(message) {
		$messages = $messages.filter((existingMessage) => existingMessage.text !== message.text);
	}

	async function resetChallenges() {
		const { error } = await supabase
			.from('challenges')
			.update({ completed: [] })
			.eq('tournament', $tournament);

		getChallengeData();
	}
</script>

<div
	class="frame"
	style="background-image: url('images/Wide Background.jpg');
	cursor: url('images/interface/Scimitar.png'), auto;"
>
	{#if $teams && $challenges && $messages}
		<!-- TITLE -->
		<!-- <h1 class="title">OSRS Tourney</h1> -->

		<!-- SETTINGS -->
		<div class:blue={$isEditable} class="settings">
			<button class="hamburger-button"><span class="material-symbols-outlined"> menu </span></button
			>
		</div>

		<!-- TEAMS -->
		<div class="teams">
			<div class="label">TEAMS</div>
			{#each $teams as team}
				{@const currentHealth = $challenges
					.filter((challenge) => challenge.completed.includes(team.id))
					.reduce(
						(sum, challenge) =>
							sum + challenge.points - Math.min(challenge.completed.indexOf(team.id), maxDecrement),
						0
					)}
				<Team {team} {currentHealth} {maxHealth} />
			{/each}
		</div>
		<!-- CHALLENGES -->
		<div class="challenges-container">
			<div class="label">MAIN CHALLENGES</div>
			<div class="challenges">
				{#each $challenges.filter((challenge) => challenge.type === 'main') as challenge}
					{@const points =
						challenge.points - Math.min(challenge.completed.length, maxDecrement) * decrement}
					<div
						class="challenge"
						on:click={() => updateChallenge(challenge)}
						style="order: {challenge.order};"
						class:hidden={(innerRingIndeces.includes(challenge.order) &&
							currentTouchedChallenges < outerThreshold) ||
							(coreIndeces.includes(challenge.order) && currentTouchedChallenges < innerThreshold)}
					>
						<img class="challenge-icon" src="images/challenge-icons/{challenge.name}.png" />
						<div class="name">{challenge.name}</div>
						<div class="points">{points}</div>
						<div class="completed-teams">
							{#each challenge.completed as teamId}
								{@const icon = $teams.find((team) => team.id === teamId).icon}
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
					{@const points =
						challenge.points - Math.min(challenge.completed.length, maxDecrement) * decrement}
					<div
						class="challenge"
						on:click={() => updateChallenge(challenge)}
						style="order: {challenge.order};"
					>
						<img class="challenge-icon" src="images/challenge-icons/{challenge.name}.png" />
						<div class="name">{challenge.name}</div>
						<div class="points">{points}</div>
						<div class="completed-teams">
							{#each challenge.completed as teamId}
								{@const icon = $teams.find((team) => team.id === teamId).icon}
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
		<ChatBox on:reset={resetChallenges} />
	{:else}
		<div class="loading">Loading...</div>
	{/if}
</div>

<style>
	.frame {
		/* position: fixed; */
		/* max-width: 100vw; */
		min-height: 100vh;
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		grid-template-rows: auto auto auto;
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
		/* background-position: 50% 50%; */
		/* background-position: -15rem; */
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
		/* font-family: 'Earth Theory', sans-serif; */
		font-family: 'Metroid-Prime-Font', sans-serif;
		color: yellow;
		text-shadow: 6px 6px 0px black;
		text-align: center;
		font-size: 2rem;
		margin: 0 auto;
		/* width: 240px; */
		/* width: 100%; */
		/* width: 14rem; */
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
		/* box-shadow: 4px 4px 10px 10px #0004;	 */
		border: solid black 2px;
		/* overflow:hidden; */
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
		padding: 1rem 0;
		display: grid;
		gap: 4px;
	}

	.teams {
		display: flex;
		flex-direction: column;
		justify-content: start;
		align-items: end;
		gap: 1rem;
		grid-area: teams;
		/* background-color: blue; */
		/* overflow-y: auto; */
		/* overflow-x: visible; */
	}

	/* .team {
		position: relative;
		display: flex;
		align-items: center;
		padding: 0.5rem;
		gap: 1rem;
		border: solid orange 1px;
		background-color: purple;
	}

	.team:hover {
		background-color: black;
		scale: 1.1;
	}

	.team.selected {
		background-color: teal;
		border: solid white 2px;
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
	} */

	/* .button-container {
		display: flex;
	}

	.messages-container {
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
		overflow-y: scroll;
		box-shadow: inset 2px 2px 4px 0px #0008;
	}

	.input-container {
		display: flex;
		align-items: center;
		height: 16px;
		border-top: solid 2px rgba(128, 118, 96, 1);
	}

	.input-name {
		padding: 2px 4px;
	}

	.input {
		background-color: teal;
	} */

	.loading {
		font-size: 2rem;
		color: white;
		text-shadow: 0px 0px 10px black;
		margin: auto;
	}

	.hidden {
		/* visibility: hidden; */
		filter: blur(20px);

		/* border: solid black 2px; */
	}

	.blue {
		background-color: blue;
	}
</style>
