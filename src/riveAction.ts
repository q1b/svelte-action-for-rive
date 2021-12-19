// import { Action } from './types';

import { Rive } from 'rive-js';

interface Params {
	filePath?: string;
	buffer: Blob;
	artboard: string;
	stateMachines: string;
}

// async function getBuffer(filePath = '/animations/main.riv'): Promise<Blob> {
//     const req: Request = new Request(filePath);
//     const response: Response = await fetch(req);
//     const buffer: Blob = await response.blob();
//     return buffer;
//   }

const readRiveFile = (buffer: Blob) => {
	const reader = new FileReader();

	return new Promise((resolve, reject) => {
		reader.onerror = () => {
			reader.abort();
			reject(new DOMException('Problem parsing input file.'));
		};

		reader.onload = () => {
			resolve(reader.result);
		};

		reader.readAsArrayBuffer(buffer);
	});
};

export function rivePlayer(node: HTMLCanvasElement, params: Params): any {
	readRiveFile(params.buffer).then((response) => {
		const dimensions = {
			width: 0,
			height: 0
		};
		const riveArrayBuffer = response;
		const rive = new Rive({
			canvas: node,
			...params,
			buffer: <ArrayBuffer>riveArrayBuffer,
			autoplay: false
		});
		function getCanvasDimensions() {
			const { width, height } =
				node.parentElement?.getBoundingClientRect() ?? new DOMRect(0, 0, 0, 0);

			if (rive && options.fitCanvasToArtboardHeight) {
				const { maxY, maxX } = rive.bounds;
				return { width, height: width * (maxY / maxX) };
			}
			return { width, height };
		}
		const options = {
			useDevicePixelRatio: true,
			fitCanvasToArtboardHeight: false
		};
		function updateBounds() {
			if (!node.parentElement) {
				return;
			}

			const { width, height } = getCanvasDimensions();
			const boundsChanged = width !== dimensions.width || height !== dimensions.height;
			if (node && rive && boundsChanged) {
				if (options.fitCanvasToArtboardHeight) {
					node.parentElement.style.height = height + 'px';
				}
				if (options.useDevicePixelRatio) {
					const dpr = window.devicePixelRatio || 1;
					node.width = dpr * width;
					node.height = dpr * height;
					node.style.width = width + 'px';
					node.style.height = height + 'px';
				} else {
					node.width = width;
					node.height = height;
				}
				dimensions.width = width;
				dimensions.height = height;

				// Updating the canvas width or height will clear the canvas, so call
				// startRendering() to redraw the current frame as the animation might
				// be paused and not advancing.
				rive.startRendering();
			}

			// Always resize to Canvas
			if (rive) {
				rive.resizeToCanvas();
			}
		}
		updateBounds();
		node.dispatchEvent(new CustomEvent('riveActive', { detail: rive }));
	});
}