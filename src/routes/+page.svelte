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

	$: maxHealth = $challenges.reduce((sum, currentChallenge) => {
		return sum + currentChallenge.points;
	}, 0);

	$: currentTouchedChallenges = $challenges.filter((challenge) =>
		$completions.find((completion) => completion.challenge === challenge.id)
	).length;

	onMount(async () => {
		subscribeToTeams();
		subscribeToChallenges();
		subscribeToCompletions();
		subscribeToMessages();

		await Promise.all([getTeamData(), getChallengeData(), getCompletionData(), getMessageData()]);

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
		}
		$challenges = data ?? [];
	}

	async function getCompletionData() {
		const { data, error } = await supabase
			.from('completions')
			.select('*')
			.eq('tournament', $tournament);
		if (error) {
			console.error('Error fetching completions', error);
			return {
				status: 500,
				error: 'Could not fetch completions'
			};
		} else {
		}
		$completions = data ?? [];
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
		}
		$messages = data ?? [];
	}

	async function resetChallenges() {
		const { error } = await supabase.from('completions').delete().eq('tournament', $tournament);
	}
</script>

<div
	class="frame"
	style="background-image: linear-gradient(to top right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%), url('images/Wide Background.jpg');
	cursor: url('images/interface/Scimitar.png'), auto;"
>
	{#if $teams && $challenges && $messages && $completions}
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
			{#each $teams as team (team.id)}
				<Team {team} {maxHealth} />
			{/each}
		</div>
		<!-- CHALLENGES -->
		<div class="challenges-container">
			<div class="label">MAIN CHALLENGES</div>
			<div class="challenges">
				{#each $challenges.filter((challenge) => challenge.type === 'main') as challenge (challenge.order)}
					<Challenge {challenge} {currentTouchedChallenges} />
				{/each}
			</div>
		</div>
		<div class="bonus-challenges-container">
			<div class="label">BONUS</div>
			<div class="bonus-challenges">
				{#each $challenges.filter((challenge) => challenge.type === 'bonus') as challenge (challenge.order)}
					<Challenge {challenge} {currentTouchedChallenges} />
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
		/* font-family: 'Metroid-Prime-Font', sans-serif; */
		font-family: 'Runescape', sans-serif;
		color: white;
		text-shadow: 3px 3px 0px black;
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
