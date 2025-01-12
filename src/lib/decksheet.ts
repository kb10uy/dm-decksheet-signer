interface Placement {
	x: number;
	y: number;
	fontSize: number;
}

interface SignaturePlacement {
	playerId: Placement;
	playerName: Placement;
	playerReading: Placement;
}

const ORIGINAL_PLACEMENT = {
	playerId: { x: 0.02, y: 0.91, fontSize: 0.045 },
	playerName: { x: 0.29, y: 0.903, fontSize: 0.0375 },
	playerReading: { x: 0.29, y: 0.855, fontSize: 0.017 }
} satisfies SignaturePlacement;

export interface Signature {
	playerId: string;
	playerName: string;
	playerReading: string;
}

export function drawDeckSheet(canvasContext: CanvasRenderingContext2D, signature: Signature): void {
	drawText(canvasContext, ORIGINAL_PLACEMENT.playerId, signature.playerId);
	drawText(canvasContext, ORIGINAL_PLACEMENT.playerName, signature.playerName);
	drawText(canvasContext, ORIGINAL_PLACEMENT.playerReading, signature.playerReading);
}

function drawText(
	canvasContext: CanvasRenderingContext2D,
	placement: Placement,
	text: string
): void {
	const canvasHeight = canvasContext.canvas.height;
	canvasContext.save();
	canvasContext.font = `${placement.fontSize * canvasHeight}px sans-serif`;
	canvasContext.fillText(text, placement.x * canvasHeight, placement.y * canvasHeight);
	canvasContext.restore();
}
