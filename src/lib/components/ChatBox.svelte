<script>
	import { supabase } from '../supabaseClient';
	import { messages } from '../stores';
	import { createEventDispatcher } from 'svelte';
	import { isEditable, isResetting, isDancing, tournament } from '../stores';
	import { fly } from 'svelte/transition';
	import Countdown from './Countdown.svelte';
	import Message from './Message.svelte';
	import { Sound, sound } from 'svelte-sound';
	import Reset from './Reset.svelte';

	let input = '';
	let inputElement;
	let isPlaying = false;

	const dispatch = createEventDispatcher();

	let music = new Sound('/music/Inferno.ogg');

	const secretWord = 'helmet';

	function reset() {
		$isResetting = true;
	}

	function snap() {
		dispatch('snap');
	}

	function toggleMusic() {
		if (!music) {
			music = new Sound('/music/Inferno.ogg');
		}

		if (music.howl.playing()) {
			music.howl.pause();
			isPlaying = false;
		} else {
			music.howl.play();
			isPlaying = true;
		}
	}

	async function addMessage(message) {
		if (!$isEditable) return;
		if ($messages.includes(message)) return;

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

	function handleInput(event) {
		if (event.key !== 'Enter') return;

		switch (true) {
			case inputElement !== document.activeElement:
				console.log('focusing');
				inputElement.focus();
				break;
			case input === secretWord:
				console.log('entering');
				$isEditable = true;
				localStorage.setItem('tournKey', JSON.stringify($tournament.id));
				break;
			case input !== secretWord && $isEditable === true:
				console.log('something here');
				addMessage({ sender: 'Fensail', text: input, tournament: $tournament.id, type: 'admin' });
				break;
			case input !== secretWord && $isEditable === false:
				console.log('nothing here');
				break;
		}

		input = '';
	}

	function logout() {
		dispatch('logout');
	}

	function toggleDance() {
		$isDancing = !$isDancing;
	}

	async function toggleReveal() {
		const { error } = await supabase
			.from('tournaments')
			.update({ isRevealed: !$tournament.isRevealed })
			.eq('id', $tournament.id);
		if (error) {
			console.error('Error toggling reveal', error);
			return {
				status: 500,
				error: 'Could not toggle reveal'
			};
		}
	}
</script>

<svelte:window on:keydown={handleInput} />

{#if $isResetting}
	<Reset />
{/if}

<div class="menu" in:fly={{ y: 1000, duration: 1000 }}>
	<div
		class="chat-box"
		style="border-image: url('images/interface/Message Border.png') 8 / 16px repeat;"
	>
		<div class="messages-container">
			<div class="messages">
				{#each $messages as message}
					<Message {message} />
				{/each}
			</div>
			{#if $isDancing}
				<img class="dance" src="images/Dance.gif" alt="Dance" />
			{/if}
		</div>
		<div class="input-container">
			<img class="icon" src="images/interface/Chat Helmet.png" alt="Ironman" />
			<span class="input-name white text">Fensail:</span>

			<input
				on:focus={() => {
					console.log('focusing');
				}}
				on:blur={() => {
					console.log('blurring');
				}}
				class="input white text"
				type="text"
				bind:value={input}
				bind:this={inputElement}
			/>
		</div>
	</div>
	<div class="buttons">
		<!-- REVEAL -->
		<button
			class="button"
			on:click={toggleReveal}
			disabled={!$isEditable}
			style="background-image: url('images/interface/Button Brown.png')"
		>
			<div class="line-1">
				<span class="name">Reveal</span>
			</div>
			<div class="line-2">
				{#if $tournament.isRevealed}
					<span class="on">On</span>
				{:else}
					<span class="off">Off</span>
				{/if}
			</div>
		</button>

		<!-- SNAP -->
		<button
			class="button"
			on:click={snap}
			style="background-image: url('images/interface/Button Brown.png')"
		>
			<div class="line-1">
				<span class="name">Snap</span>
			</div>
		</button>
		<!-- MUSIC -->
		<button
			class="button"
			on:click={toggleMusic}
			style="background-image: url('images/interface/Button Brown.png')"
		>
			<div class="line-1">
				<span class="name">Music</span>
			</div>
			<div class="line-2">
				{#if isPlaying}
					<span class="on">On</span>
				{:else}
					<span class="off">Off</span>
				{/if}
			</div>
		</button>

		<!-- DANCE -->
		<button
			class="button"
			on:click={toggleDance}
			style="background-image: url('images/interface/Button Brown.png')"
		>
			<div class="line-1">
				<span class="name">Vibe</span>
			</div>
			<div class="line-2">
				{#if $isDancing}
					<span class="on">On</span>
				{:else}
					<span class="off">Off</span>
				{/if}
			</div>
		</button>
		<!-- RESET -->
		<button
			class="button"
			on:click={reset}
			disabled={!$isEditable}
			style="background-image: url('images/interface/Button Brown.png')"
		>
			<div class="line-1">
				<span class="name">Reset</span>
			</div>
		</button>
		<!-- LOGOUT -->
		<button
			class="button"
			on:click={logout}
			disabled={!$isEditable}
			style="background-image: url('images/interface/Button Brown.png')"
		>
			<div class="line-1">
				<span class="name">Logout</span>
			</div>
		</button>

		<!-- COUNTDOWN -->
		<Countdown />
	</div>
</div>

<style>
	.menu {
		grid-area: messages;
	}

	.chat-box {
		/* box-sizing: content-box; */
		display: flex;

		flex-direction: column;
		height: 9rem;
		justify-content: space-between;
		padding: 12px;
		/* width: 518px;
		height: 144px; */
		/* background-size: 100%; */
		image-rendering: pixelated;
		font-size: 14px;
		line-height: 12.5px;
		/* backdrop-filter: blur(8px); */
		background-color: #000b;
		box-shadow: 0 0 10px black;
	}

	.icon {
		height: 90%;
		padding: 1px;
	}

	.messages-container {
		position: relative;
		display: flex;
		flex-direction: column-reverse;
		height: 8rem;
		overflow-y: scroll;
		/* background-color: teal; */

		box-shadow: inset 2px 2px 4px 0px #0008;
	}

	.messages {
		/* display: flex; */
		/* flex-direction: column; */
		/* justify-content: flex-end; */
		padding: 4px 4px;
		width: 100%;
		/* background-color: pink; */
	}

	.message {
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
		/* min-width: 0px; */
		width: 100%;
		background-color: transparent;
		border: none;
		outline: none;
		color: white;
		caret-color: white;
		font-family: 'RuneScape', sans-serif;
		text-shadow: 2px 2px black;
	}

	.buttons {
		display: flex;
		justify-content: space-between;
		/* padding: 4px; */
	}

	.button {
		--scale: 1.25;

		width: calc(var(--scale) * 56px);
		height: calc(var(--scale) * 22px);
		background-size: cover;
		filter: drop-shadow(0 0 5px black);
		display: grid;
		place-items: center;

		font-family: 'RuneScape-small', sans-serif;
		color: white;
		font-size: large;
		text-shadow: 2px 2px 0px black;
		/* font-weight: bold; */
	}

	.button:hover {
		scale: 1.1;
		filter: brightness(1.2);
	}

	.name {
		font-family: 'RuneScape-small', sans-serif;
		color: white;
		font-size: large;
		text-shadow: 2px 2px 0px black;
	}

	.line-1 {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
	}

	.line-2 {
		color: hsl(120, 100%, 50%);
	}

	.dance {
		position: absolute;
		/* width: 5rem; */
		height: 6rem;
		right: 0;
		bottom: 0%;
	}

	/* REUSABLE */
	.on {
		color: hsl(120, 100%, 50%);
	}

	.off {
		color: hsl(0, 100%, 50%);
	}

	.text {
		/* text-shadow: 1px 1px black; */
	}

	.red {
		color: red;
	}

	.green {
		color: green;
	}

	.white {
		color: white;
	}

	.blue {
		color: blue;
	}
</style>
