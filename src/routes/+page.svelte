<script lang="ts">
	import { onMount } from 'svelte';
	import * as PDFjs from 'pdfjs-dist';
	import { drawDeckSheet, type Signature } from '$lib/decksheet';

	PDFjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${PDFjs.version}/build/pdf.worker.min.mjs`;

	let file: File;
	let pngData: string | null = null;
	let pdfCanvas: HTMLCanvasElement;
	let canvasContext: CanvasRenderingContext2D;

	onMount(() => {
		pdfCanvas = document.querySelector('#pdfCanvas') as HTMLCanvasElement;
		canvasContext = pdfCanvas.getContext('2d')!;
	});

	function onUploadChange(e: Event): void {
		const target = e.target as HTMLInputElement;
		if (target.files !== null && target.files.length > 0) {
			file = target.files[0];
		}
	}

	async function handleFileUpload(): Promise<void> {
		if (!file) return;

		const bytes = await file.bytes();
		const pdf = await PDFjs.getDocument(bytes).promise;
		const pdfPage = await pdf.getPage(1);

		const viewport = pdfPage.getViewport({ scale: 4 });

		pdfCanvas.width = viewport.width;
		pdfCanvas.height = viewport.height;

		await pdfPage.render({ canvasContext, viewport }).promise;

		drawDeckSheet(canvasContext, {
			playerId: '118156',
			playerName: '/*詩結*/',
			playerReading: 'しゆ'
		} satisfies Signature);
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="contgainer mx-auto">
	<div class="container mx-auto px-4">
		<label class="mb-2 block text-sm font-medium text-gray-900 dark:text-white" for="pdfFile"
			>Upload file</label
		>
		<input
			class="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400"
			id="pdfFile"
			name="pdfFile"
			type="file"
            on:change={onUploadChange}
		/>
	</div>
	<button on:click={handleFileUpload}>Convert to PNG</button>

	<canvas id="pdfCanvas"></canvas>

	{#if pngData}
		<h2>Converted PNG:</h2>
		<img src={pngData} alt="Converted PNG" />
		<a href={pngData} download="page.png">Download PNG</a>
	{/if}
</section>

<style>
	canvas#pdfCanvas {
		width: 600px;
		max-width: 100%;
	}
</style>
