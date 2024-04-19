<script>
	import { teams } from '../stores';

	export let message = {
		sender: 'Unknown',
		text: 'Hello, World!'
	};
</script>

<div class="message">
	<div
		class="sender"
		class:yellow={$teams.some((team) => team.name === message.sender)}
		class:green={message.type === 'admin'}
        class:orange={message.sender === 'System'}
	>
		{message.sender}:
	</div>
	<div class="text" class:green={message.type === 'admin'}>{message.text}</div>
</div>

<style>
	.message {
		display: flex;
		gap: 0.5rem;
		color: white;
	}

	.sender {
		font-weight: bold;
	}

	.green {
		color: hsl(120, 100%, 50%);
	}

	.yellow {
		color: hsl(60, 100%, 50%);
	}

    .orange {
        color: hsl(30, 100%, 50%);
    }
</style>
