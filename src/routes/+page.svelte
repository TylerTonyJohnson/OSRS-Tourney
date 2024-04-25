<script>
	import '../styles.css';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient.js';
	import {
		tournament,
		teams,
		challenges,
		completions,
		scores,
		messages,
		selectedTeam,
		isolatedTeam,
		isEditable
	} from '$lib/stores.js';
	import Team from '../lib/components/Team.svelte';
	import ChatBox from '../lib/components/ChatBox.svelte';
	import Challenge from '../lib/components/Challenge.svelte';
	import domtoimage from 'dom-to-image';

	const outerThreshold = 8;
	const innerThreshold = 16;

	const outerRingIndeces = [1, 2, 3, 4, 5, 6, 10, 11, 15, 16, 20, 21, 22, 23, 24, 25];
	const innerRingIndeces = [7, 8, 9, 12, 14, 17, 18, 19];
	const coreIndeces = [13];

	let frameElement;

	$: maxHealth = $challenges.reduce((sum, currentChallenge) => {
		return sum + currentChallenge.points;
	}, 0);

	$: currentTouchedChallenges = $challenges.filter(
		(challenge) =>
			$completions.find((completion) => completion.challenge === challenge.id) &&
			challenge.type === 'main'
	).length;

	$: {
		if ($tournament) {
			switch (true) {
				case currentTouchedChallenges < outerThreshold:
					removeMessage({
						tournament: $tournament.id,
						text: 'Outer Ring Unlocked',
						type: 'notification',
						sender: 'System'
					});
					removeMessage({
						tournament: $tournament.id,
						text: 'Inner Ring Unlocked',
						type: 'notification',
						sender: 'System'
					});
					break;
				case currentTouchedChallenges >= outerThreshold &&
					currentTouchedChallenges < innerThreshold:
					addMessage({
						tournament: $tournament.id,
						text: 'Outer Ring Unlocked',
						type: 'notification',
						sender: 'System'
					});
					removeMessage({
						tournament: $tournament.id,
						text: 'Inner Ring Unlocked',
						type: 'notification',
						sender: 'System'
					});
					break;
				case currentTouchedChallenges >= innerThreshold:
					addMessage({
						tournament: $tournament.id,
						text: 'Inner Ring Unlocked',
						type: 'notification',
						sender: 'System'
					});
			}
		}
	}

	$: {
		if ($isEditable) {
			$selectedTeam = $teams[0];
		} else {
			$selectedTeam = null;
		}
	}

	onMount(async () => {
		subscribeToTournament();
		subscribeToTeams();
		subscribeToChallenges();
		subscribeToCompletions();
		subscribeToMessages();

		await getTournamentData()
			.then(() => getTeamData())
			.then(() => getChallengeData())
			.then(() => getCompletionData())
			.then(() => getMessageData())
			// .then(() => getImageData())
			.then(() => {
				styleScrollbar();

				if (JSON.parse(localStorage.getItem('tournKey')) === $tournament.secret) {
					$isEditable = true;
				} else {
					$isEditable = false;
				}
				if ($messages.length < 1) {
					addMessage({
						tournament: $tournament.id,
						text: 'Welcome to the tournament!',
						type: 'notification',
						sender: 'System'
					});
				}
			})
			.catch((error) => {
				console.error('An error occurred:', error);
			});
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

	function subscribeToTournament() {
		const subscription = supabase
			.channel('tournament_channel')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'tournaments'
				},
				(payload) => {
					console.log('payload', payload);
					switch (payload.eventType) {
						case 'UPDATE':
							$tournament = payload.new;
							break;
					}
				}
			)
			.subscribe();
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
						// getChallengeData();
					}
				}
			)
			.subscribe();
	}

	function subscribeToCompletions() {
		const subscription = supabase
			.channel('completions_channel')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'completions'
				},
				(payload) => {
					switch (payload.eventType) {
						case 'INSERT':
							$completions = [...$completions, payload.new];
							break;
						case 'DELETE':
							$completions = $completions.filter((completion) => completion.id !== payload.old.id);
							break;
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
							$messages = [...$messages, payload.new];
							break;
						case 'DELETE':
							$messages = $messages.filter((message) => message.id !== payload.old.id);
							break;
					}
				}
			)
			.subscribe();
	}

	async function getTournamentData() {
		// Get Journals
		const { data, error } = await supabase
			.from('tournaments')
			.select('*')
			.eq('id', 'f1c04b40-4faa-43f9-b058-bfc1db35d388');
		if (error) {
			console.error('Error fetching tournament', error);
			return {
				status: 500,
				error: 'Could not fetch tournament'
			};
		} else {
			// console.log('data', data);
		}
		$tournament = data[0];
	}

	async function getTeamData() {
		// Get Journals
		const { data, error } = await supabase
			.from('teams')
			.select('*')
			.eq('tournament', $tournament.id);
		if (error) {
			console.error('Error fetching teams', error);
			return {
				status: 500,
				error: 'Could not fetch teams'
			};
		} else {
			// console.log('data', data);
		}
		$teams = data ?? [];
	}

	async function getChallengeData() {
		// Get Journals
		const { data, error } = await supabase
			.from('challenges')
			.select('*')
			.eq('tournament', $tournament.id);
		if (error) {
			console.error('Error fetching challenges', error);
			return {
				status: 500,
				error: 'Could not fetch challenges'
			};
		} else {
			// console.log('data', data);
		}
		$challenges = data ?? [];
	}

	async function getCompletionData() {
		const { data, error } = await supabase
			.from('completions')
			.select('*')
			.eq('tournament', $tournament.id);
		if (error) {
			console.error('Error fetching completions', error);
			return {
				status: 500,
				error: 'Could not fetch completions'
			};
		} else {
			// console.log('data', data);
		}
		$completions = data ?? [];
	}

	async function getMessageData() {
		// Get Journals
		const { data, error } = await supabase
			.from('messages')
			.select('*')
			.eq('tournament', $tournament.id);
		if (error) {
			console.error('Error fetching messages', error);
			return {
				status: 500,
				error: 'Could not fetch messages'
			};
		} else {
			// console.log('data', data);
		}
		$messages = data ?? [];
	}

	async function getImageData() {
		const { data, error } = await supabase.storage.from('Challenge Icons').download('images');
		if (error) {
			console.error('Error fetching images', error);
			return {
				status: 500,
				error: 'Could not fetch images'
			};
		} else {
			console.log('data', data);
		}
	}

	async function addMessage(message) {
		if (!$isEditable) return;
		if ($messages.find((existingMessage) => message.text === existingMessage.text)) return;

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

	async function snap() {
		// alert('snapping');
		domtoimage
			.toPng(frameElement)
			.then(function (dataUrl) {
				let link = document.createElement('a');
				link.download = 'my-image-name.png';
				link.href = dataUrl;
				document.body.appendChild(link); // Append to body to avoid issues with some browsers
				link.click();
				document.body.removeChild(link); // Clean up
			})
			.catch(function (error) {
				console.error('oops, something went wrong!', error);
			});
	}

	function logout() {
		$isEditable = false;
		localStorage.removeItem('tournKey');
	}
</script>

<div
	class="frame"
	bind:this={frameElement}
	style="background-image: linear-gradient(to top right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%), url('images/Wide Background.jpg');
	cursor: url('images/interface/Scimitar.png'), auto;"
>
	{#if $tournament && $teams && $challenges && $messages && $completions}
		<!-- TITLE -->
		<div class="titles">
			<h1 class="title">{$tournament.name}</h1>
			{#if $isEditable}
				<h1 class="editing">{$tournament.name}</h1>
			{/if}
		</div>

		<!-- SETTINGS -->
		<!-- <div class="settings">
			<button class="hamburger-button"><span class="material-symbols-outlined"> menu </span></button
			>
		</div> -->

		<!-- TEAMS -->
		<div class="teams">
			<div class="label">TEAMS</div>
			{#each $teams as team (team.id)}
				<Team {team} {maxHealth} />
			{/each}
		</div>
		<!-- CHALLENGES -->
		<div class="challenges-container">
			<!-- <div class="label">MAIN CHALLENGES</div> -->
			<div class="challenges">
				{#each $challenges.filter((challenge) => challenge.type === 'main') as challenge (challenge.order)}
					{@const isActive =
						$tournament.isRevealed &&
						(outerRingIndeces.includes(challenge.order) ||
							(innerRingIndeces.includes(challenge.order) &&
								currentTouchedChallenges >= outerThreshold) ||
							(coreIndeces.includes(challenge.order) &&
								currentTouchedChallenges >= innerThreshold))}
					<Challenge {challenge} {isActive} />
				{/each}
			</div>
		</div>
		<div class="bonus-challenges-container">
			<div class="label">BONUS</div>
			<div class="bonus-challenges">
				{#each $challenges.filter((challenge) => challenge.type === 'bonus') as challenge (challenge.order)}
					<Challenge {challenge} isActive={$tournament.isRevealed} />
				{/each}
			</div>
		</div>
		<!-- EVENTS -->
		<ChatBox on:snap={snap} on:logout={logout} />
	{:else}
		<div class="loading">Loading...</div>
	{/if}
</div>

<style>
	.frame {
		min-height: 100vh;
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		grid-template-rows: auto auto auto;
		grid-template-areas:
			'.     title      settings'
			'teams challenges bonus'
			'.     messages   .';

		background-size: cover;
		background-blend-mode: saturation;
		padding: 1rem;
		gap: 1rem;
		overflow-x: hidden;
	}

	@keyframes flow {
		0% {
			background-position: 0% 0%;
		}
		100% {
			background-position: 0% -100%;
		}
	}

	.titles {
		position: relative;
		grid-area: title;
	}

	.title {
		text-align: center;
		font-family: 'Runescape', sans-serif;
		font-size: 5rem;
		color: yellow;
		font-weight: bolder;
		/* text-shadow: 0px 0px 50px yellow; */
	}

	.editing {
		position: absolute;
		inset: 0;
		text-align: center;
		font-family: 'Runescape', sans-serif;
		font-size: 5rem;
		color: white;
		font-weight: lighter;
		text-shadow: 0px 0px 50px yellow;
		animation: pulse 2s infinite;
	}

	.editing::before {
		content: 'Editing';
		position: absolute;
		font-size: 2rem;
		left: 50%;
		top: 75%;
		translate: -50% 0%;
	}

	@keyframes pulse {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
		100% {
			opacity: 1;
		}
	}

	.label {
		/* font-family: 'Earth Theory', sans-serif; */
		/* font-family: 'Metroid-Prime-Font', sans-serif; */
		font-family: 'Runescape', sans-serif;
		color: white;
		text-shadow: 3px 3px 0px black;
		text-align: center;
		font-size: 2rem;
		margin: 0 auto;
		max-width: 240px;
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
		margin: auto auto;
		grid-template-columns: repeat(5, 1fr);
		grid-template-rows: repeat(5, 1fr);
		/* grid-auto-rows: min-content;
		grid-auto-columns: min-content; */
		gap: 4px;
		/* backdrop-filter: brightness(0.75); */
		/* padding: 2rem; */
		perspective: 100rem;
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
		margin-left: auto;
		/* background-color: blue; */
		/* overflow-y: auto; */
		/* overflow-x: visible; */
	}

	.loading {
		font-size: 2rem;
		color: white;
		text-shadow: 0px 0px 10px black;
		margin: auto;
	}

	.blue {
		background-color: blue;
	}
</style>
