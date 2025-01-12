<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<div class="app">
    <header>
        <nav>
            <h1>DM Deck-sheet Signer</h1>
        </nav>
    </header>
	<main>
		{@render children()}
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
