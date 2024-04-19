<script>
	import { supabase } from '../supabaseClient';
	import { tournament, isEditable, messages } from '../stores';

	let timeLeft;
	let timingMessage = '';

	const completeMessage = {
		tournament: $tournament.id,
		text: 'Bingo Over',
		type: 'completion',
		sender: 'System'
	};

	$: {
		setInterval(() => {
			const timeNow = new Date();

			switch (true) {
				case timeNow < new Date($tournament.startTime):
					timingMessage = 'To Start';
					timeLeft = Math.abs(timeNow - new Date($tournament.startTime));
                    removeMessage(completeMessage);
					break;
				case timeNow > new Date($tournament.startTime) && timeNow < new Date($tournament.endTime):
					timingMessage = 'To End';
					timeLeft = Math.abs(timeNow - new Date($tournament.startTime));
                    removeMessage(completeMessage);
					break;
				case timeNow >= new Date($tournament.endTime):
					timingMessage = 'Bingo Over';
					timeLeft = 0;
					addMessage(completeMessage);
					break;
			}
		}, 1000);
	}

	$: daysLeft = `${Math.floor(timeLeft / (1000 * 60 * 60 * 24))}D`;
	$: hoursLeft = `${Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
		.toString()
		.padStart(2, '0')}`;
	$: minutesLeft = `${Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
		.toString()
		.padStart(2, '0')}`;
	$: secondsLeft = `${Math.floor((timeLeft % (1000 * 60)) / 1000)
		.toString()
		.padStart(2, '0')}`;

	async function addMessage(message) {
        console.log($messages.some((existingMessage) => message.text === existingMessage.text));

		if (!$isEditable) return;
		if ($messages.some((existingMessage) => message.text === existingMessage.text)) return;

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
</script>

<div class="frame" style="background-image: url('images/interface/Button Red.png')">
	{#if timeLeft > 0}
		<div class="line-1">
			<span class="days">{daysLeft}</span>
			<div class="time-container">
				<span class="time">{hoursLeft}</span>
				<span>:</span>
				<span class="time">{minutesLeft}</span>
				<span>:</span>
				<span class="time">{secondsLeft}</span>
			</div>
		</div>
	{/if}
	<div class="line-2">{timingMessage}</div>
</div>

<style>
	.frame {
		--scale: 1.25;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: calc(var(--scale) * 79px);
		height: calc(var(--scale) * 22px);
		background-size: cover;

		filter: drop-shadow(0 0 5px black);

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

	.days,
	.time-container {
		display: flex;
	}

	.time {
		width: 16px;
	}

	.time:nth-child(1) {
		text-align: end;
	}
	.time:nth-child(3) {
		text-align: center;
	}
	.time:nth-child(5) {
		text-align: start;
	}
</style>
