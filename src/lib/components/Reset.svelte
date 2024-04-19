<script>
	import { supabase } from '../supabaseClient';
	import { tournament, isResetting } from '../stores';
	import { fade } from 'svelte/transition';

	async function resetChallenges() {
		const { error } = await supabase.from('completions').delete().eq('tournament', $tournament.id);
		$isResetting = false;
		resetMessages();
		if (error) {
			console.error('Error resetting challenges', error);
			return {
				status: 500,
				error: 'Could not reset challenges'
			};
		}
	}

	async function resetMessages() {
		const { error } = await supabase.from('messages').delete().eq('tournament', $tournament.id);
		if (error) {
			console.error('Error resetting messages', error);
			return {
				status: 500,
				error: 'Could not reset messages'
			};
		}
	}

	function handleInput(event) {
		if (event.key === 'Escape') {
			exit();
		}
	}

	function exit() {
		$isResetting = false;
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="frame" on:click|self={exit} transition:fade={{ duration: 200 }}>
	<div class="card">
		<div class="message">
			Are you sure you want to reset this tournament? This cannot be undone.
		</div>
		<button class="button" on:click={resetChallenges}>Reset</button>
	</div>
</div>

<svelte:window on:keydown={handleInput} />

<style>
	.frame {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 1000;
		
	}

	.card {
		position: absolute;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		width: 20rem;
		/* height: 10rem; */
		padding: 1rem;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		border-radius: 1rem;
		color: #dc710c;
		font-size: larger;
		font-weight: bold;
		text-align: center;
		text-shadow: 2px 2px 0px black;
		border: solid 2px #9d8e4a;

		background-color: #252121;
	}

	.button {
		width: 8rem;
		height: 3rem;
		background-color: #161414;
		border: none;
		color: inherit;
		font-size: inherit;
		font-weight: inherit;
		text-shadow: inherit;
		border-radius: 1rem;
	}

	.button:hover {
		background-color: #9d8e4a;
	}
</style>
