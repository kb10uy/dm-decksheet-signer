<script lang="ts">
	import { onMount } from 'svelte';

	import { drawDeckSheet, type Signature } from '$lib/decksheet';
	import { Heading, Dropzone } from 'flowbite-svelte';

	let files: File[] = [];
	let pdfCanvas: HTMLCanvasElement;

	onMount(() => {
		pdfCanvas = document.querySelector('#pdfCanvas') as HTMLCanvasElement;
	});

	function onDropzoneDropped(event: DragEvent): void {
		event.preventDefault();
		if (!event.dataTransfer || !event.dataTransfer.items) return;

		files = [...event.dataTransfer.files];
	}

	function onDropzoneDragover(event: DragEvent): void {
		event.preventDefault();
	}

	function onDropzoneChanged(event: Event): void {
		const target = event.target as HTMLInputElement;
		const inputFiles = target.files!;
		if (inputFiles.length == 0) return;

		files = [...files, inputFiles[0]];
	}

	async function handleFileUpload(): Promise<void> {
		if (!files) return;

		drawDeckSheet(pdfCanvas, files[0], {
			playerId: '118156',
			playerName: '/*詩結*/',
			playerReading: 'しゆ'
		} satisfies Signature);
	}
</script>

<svelte:head>
	<title>DM Deck-sheet Signer</title>
	<meta name="description" content="デュエマのデッキシートに名前とか入れるやつ" />
</svelte:head>

<header class="text-center">
	<Heading tag="h1" class="mb-4 py-4" customSize="text-3xl font-bold md:text-4xl lg:text-5xl"
		>DM Deck-sheet Signer</Heading
	>
</header>
<main>
	<section class="container mx-auto">
		<Dropzone
			id="dropzone"
			on:drop={onDropzoneDropped}
			on:dragover={onDropzoneDragover}
			on:change={onDropzoneChanged}
		>
			{#if files.length === 0}
				<p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
					<span class="font-semibold">Click to upload</span> or drag and drop
				</p>
				<p class="text-xs text-gray-500 dark:text-gray-400">
					SVG, PNG, JPG or GIF (MAX. 800x400px)
				</p>
			{:else}
				<p>OK</p>
			{/if}
		</Dropzone>
		<button on:click={handleFileUpload}>Convert to PNG</button>
	</section>

	<canvas id="pdfCanvas"></canvas>
</main>

<style>
	canvas#pdfCanvas {
		width: 600px;
		max-width: 100%;
	}
</style>
