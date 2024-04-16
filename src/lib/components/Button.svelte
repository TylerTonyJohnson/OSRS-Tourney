<script>
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let name = 'RESET';

    function reset() {
        dispatch('reset');
    }

</script>

<button class='frame' on:click={reset} style="background-image: url('images/interface/Button.png')">
    <span class='name'>{name}</span>
</button>

<style>
    .frame {
        width: 56px;
        height: 22px;
        display: grid;
        place-items: center;
    }

    .name {
        color: white;
    }
</style>