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
		/* background-color: teal; */
	}

	.empty-orb,
	.full-orb,
	.heart {
		position: absolute;
		height: 110%;
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
		left: 0px;
		top: 16px;
		text-align: center;
		text-shadow: 1px 1px black, 0px 0px 2px black;
		/* background-color: white; */
		line-height: 16px;
		font-size: 20px;
		/* font-weight: bold; */
	}
</style>
