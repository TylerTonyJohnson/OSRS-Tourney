<script>
	import { messages } from '../stores';
	import { createEventDispatcher } from 'svelte';
	import { isEditable } from '../stores';
	import Button from './Button.svelte';
	import { fly } from 'svelte/transition';

	let input = '';
	let inputElement;

	const dispatch = createEventDispatcher();

	const secretWord = 'helmet';

	function reset() {
		dispatch('reset');
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
				break;
			case input !== secretWord:
				console.log('not entering');
				$isEditable = false;
				break;
		}

		input = '';
	}
</script>

<svelte:window on:keydown={handleInput} />

<div class="menu" in:fly={{ y: 1000, duration: 1000 }}>
	<div
		class="chat-box"
		style="border-image: url('images/interface/Message Border.png') 8 / 16px repeat;"
	>
		<div class="messages">
			{#each $messages as message}
				<div class="message white text">{message.text}</div>
			{/each}
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
				size="1"
				bind:value={input}
				bind:this={inputElement}
			/>

			{#if true}
				<span class="blue text">*</span>
			{/if}
		</div>
	</div>
	<div class="buttons">
		<Button on:reset={reset} />
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
		/* justify-content: space-between; */
		padding: 12px;
		/* width: 518px;
		height: 144px; */
		/* background-size: 100%; */
		image-rendering: pixelated;
		font-size: 14px;
		line-height: 12.5px;
		/* backdrop-filter: blur(8px); */
		background-color: #000b;
	}

	.icon {
		height: 90%;
		padding: 1px;
	}

	.messages {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		padding: 4px 4px;
		width: 100%;
		height: 8rem;
		/* height: 100%; */
		/* background-color: teal; */
		overflow-y: scroll;
		box-shadow: inset 2px 2px 4px 0px #0008;
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
		max-width: 100%;
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
	}

	/* REUSABLE */
	.text {
		/* text-shadow: 1px 1px black; */
	}

	.white {
		color: white;
	}

	.blue {
		color: blue;
	}
</style>
