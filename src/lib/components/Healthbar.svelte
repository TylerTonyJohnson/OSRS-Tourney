<script>
	export let currentHealth = 99;
	export let maxHealth = 100;

	$: percentHealth = currentHealth / maxHealth;

	$: colorAngle = percentHealth * 120;
</script>

<div class="frame">
	<img class="empty-orb" src="images/interface/Empty Orb.png" alt="points" />
	<img
		class="full-orb"
		style="--percentage: {(1 - percentHealth) * 100}%"
		src="images/interface/Full Orb.png"
		alt="points"
	/>
	<img class="heart" src="images/interface/Point Counter.png" alt="points" />
	<span class="points" style="color: hsl({colorAngle}, 100%, 50%);">{currentHealth}</span>
</div>

<style>
	.frame {
		position: relative;
		width: 57px;
		height: 34px;

		margin-left: auto;
		grid-area: healthbar;
	}

	.empty-orb,
	.full-orb,
	.heart {
		position: absolute;
		height: 100%;
		right: 0;
		image-rendering: pixelated;
	}

	.full-orb {
		clip-path: polygon(0 var(--percentage), 100% var(--percentage), 100% 100%, 0 100%);
	}

	.points {
		position: absolute;
		width: 22px;
		height: 14px;
		left: 4px;
		top: 14px;
		text-align: center;
		text-shadow: 1px 1px black;
		/* font-size: 20px; */
		/* font-weight: bold; */
	}
</style>
