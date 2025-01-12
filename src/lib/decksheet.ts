import * as PDFjs from 'pdfjs-dist';
PDFjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${PDFjs.version}/build/pdf.worker.min.mjs`;

export interface Signature {
	playerId: string;
	playerName: string;
	playerReading: string;
}

export async function drawDeckSheet(
	pdfCanvas: HTMLCanvasElement,
	pdfFile: File,
	signature: Signature
): Promise<void> {
	const bytes = await pdfFile.arrayBuffer();
	const pdf = await PDFjs.getDocument(bytes).promise;
	const pdfPage = await pdf.getPage(1);

	const viewport = pdfPage.getViewport({ scale: 4 });

	pdfCanvas.width = viewport.width;
	pdfCanvas.height = viewport.height;

	const canvasContext = pdfCanvas.getContext('2d')!;
	await pdfPage.render({ canvasContext, viewport }).promise;
	drawDeckSheetSignature(canvasContext, signature);
}

function drawDeckSheetSignature(
	canvasContext: CanvasRenderingContext2D,
	signature: Signature
): void {
	drawText(canvasContext, ORIGINAL_PLACEMENT.playerId, signature.playerId);
	drawText(canvasContext, ORIGINAL_PLACEMENT.playerName, signature.playerName);
	drawText(canvasContext, ORIGINAL_PLACEMENT.playerReading, signature.playerReading);
}

function drawText(
	canvasContext: CanvasRenderingContext2D,
	placement: Placement,
	text: string
): void {
	const canvasWidth = canvasContext.canvas.width;
	const canvasHeight = canvasContext.canvas.height;
	const baseX = placement.relativeX * canvasWidth;
	const baseY = placement.relativeY * canvasHeight;
	const maxFontHeight = placement.maxFontRelativeHeight * canvasHeight;
	const frameLimitWidth = placement.frameLimitRelativeWidth * canvasWidth;

	canvasContext.save();

	// 枠をはみ出す場合は入るようにフォントサイズを下げる
	canvasContext.font = `${maxFontHeight}px sans-serif`;
	const maxTextMetrics = canvasContext.measureText(text);
	const scaledFontHeight = maxFontHeight / Math.max(1.0, maxTextMetrics.width / frameLimitWidth);

	canvasContext.font = `${scaledFontHeight}px sans-serif`;
	canvasContext.textAlign = placement.alignment;
	canvasContext.textBaseline = 'middle';
	canvasContext.fillText(text, baseX, baseY);

	canvasContext.restore();
}

interface Placement {
	relativeX: number;
	relativeY: number;
	maxFontRelativeHeight: number;
	frameLimitRelativeWidth: number;
	alignment: CanvasTextAlign;
}

interface SignaturePlacement {
	playerId: Placement;
	playerName: Placement;
	playerReading: Placement;
}

const ORIGINAL_PLACEMENT = {
	playerId: {
		relativeX: 0.156,
		relativeY: 0.898,
		maxFontRelativeHeight: 0.045,
		frameLimitRelativeWidth: 0.29,
		alignment: 'center'
	},
	playerName: {
		relativeX: 0.40,
		relativeY: 0.895,
		maxFontRelativeHeight: 0.03,
		frameLimitRelativeWidth: 0.4,
		alignment: 'start'
	},
	playerReading: {
		relativeX: 0.40,
		relativeY: 0.85,
		maxFontRelativeHeight: 0.017,
		frameLimitRelativeWidth: 0.4,
		alignment: 'start'
	}
} satisfies SignaturePlacement;
