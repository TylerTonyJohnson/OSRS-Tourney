<script>
    export let currentHealth = 99;
    export let maxHealth = 100;

    $: red = (1 - (currentHealth / maxHealth)) * 255;
    $: green = (currentHealth / maxHealth) * 255;
</script>

<div class='frame'>
	<img class='points-image' src="images/interface/Point Counter.png" alt='points' />
    <span class='points-value' style='color: rgb({red}, {green}, 0);'>{currentHealth}</span>
</div>

<style>
    .frame {
        position: relative;
        width: 57px;
        height: 34px;
    }

    .points-image {
        position: absolute;
        inset: 0;
        image-rendering: pixelated;
    }

    .points-value {
        position: absolute;
        width: 22px;
        height: 14px;
        left: 4px;
        top: 14px;
        text-align: center;
        text-shadow: 1px 1px black;
    }

</style>
