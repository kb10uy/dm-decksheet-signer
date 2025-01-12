<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { Heading, Dropzone, Label, Input, GradientButton } from 'flowbite-svelte';

	import { drawDeckSheet, type Signature } from '$lib/decksheet';
	import { playerPreference } from '$lib/persistence';

	let file: File | null = null;
	let pdfCanvas: HTMLCanvasElement;

	onMount(() => {
		pdfCanvas = document.querySelector('#pdfCanvas') as HTMLCanvasElement;
	});

	function onDropzoneDropped(event: DragEvent): void {
		event.preventDefault();
		if (!event.dataTransfer || !event.dataTransfer.items) return;

		file = event.dataTransfer.files[0];
	}

	function onDropzoneDragover(event: DragEvent): void {
		event.preventDefault();
	}

	function onDropzoneChanged(event: Event): void {
		const target = event.target as HTMLInputElement;
		const inputFiles = target.files!;
		if (inputFiles.length == 0) return;

		file = inputFiles[0];
	}

	function onCanvasBlobGenerated(blob: Blob | null): void {
		if (!blob) {
			alert('画像を生成できませんでした');
			return;
		}

		const blobUrl = URL.createObjectURL(blob);
		const downloadLink = document.createElement('a');
		downloadLink.href = blobUrl;
		downloadLink.download = `${file!.name}-${get(playerPreference).id}.png`;
		downloadLink.click();

		document.removeChild(downloadLink);
		URL.revokeObjectURL(blobUrl);
	}

	async function generateAndDownload(): Promise<void> {
		if (!file) return;

		const pp = get(playerPreference);
		await drawDeckSheet(pdfCanvas, file, {
			playerId: pp.id,
			playerName: pp.name,
			playerReading: pp.reading
		} satisfies Signature);

		pdfCanvas.toBlob(onCanvasBlobGenerated);
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
	<section class="container mx-auto px-4">
		<div class="grid grid-cols-2 gap-4">
			<div class="col-span-2">
				<Label for="playerId" class="mb-1">プレイヤー ID</Label>
				<Input
					size="lg"
					type="text"
					inputmode="numeric"
					id="playerId"
					placeholder="999999"
					bind:value={$playerPreference.id}
				/>
			</div>
			<div class="col-span-2 md:col-span-1">
				<Label for="playerName" class="mb-1">プレイヤー名</Label>
				<Input
					type="text"
					id="playerName"
					placeholder="正義星帝"
					bind:value={$playerPreference.name}
				/>
			</div>
			<div class="col-span-2 md:col-span-1">
				<Label for="playerReading" class="mb-1">プレイヤー名 読み</Label>
				<Input
					type="text"
					id="playerReading"
					placeholder="スティルジャスティス・ティルジエンド"
					bind:value={$playerPreference.reading}
				/>
			</div>
		</div>
		<Dropzone
			id="dropzone"
			class="my-6 h-20"
			accept="application/pdf"
			on:drop={onDropzoneDropped}
			on:dragover={onDropzoneDragover}
			on:change={onDropzoneChanged}
		>
			{#if file}
				<p class="text-gray-500 dark:text-gray-400">{file.name}</p>
			{:else}
				<p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
					デッキシートの PDF ファイルをアップロード
				</p>
				<p class="text-xs text-gray-500 dark:text-gray-400">
					ここをクリックするかドラッグ&ドロップ
				</p>
			{/if}
		</Dropzone>
		<GradientButton class="w-full" color="cyanToBlue" on:click={generateAndDownload}>
			生成してダウンロード
		</GradientButton>
	</section>

	<section class="container mx-auto my-8 px-4">
		<canvas id="pdfCanvas" class="w-full"></canvas>
	</section>
</main>

<style>
</style>
