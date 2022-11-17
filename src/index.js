import { fromEvent } from "rxjs";
import { map, mergeAll, takeUntil} from "rxjs/operators";

const canvas = document.getElementById("reactive-canvas");

const cursorPosition = { x: 0, y: 0 };

const updateCursorPosition = (Event) => {
  cursorPosition.x = event.clientX - canvas.offsetLeft;
  cursorPosition.y = event.clientY - canvas.offsetTop;
};

const onMouseDown$ = fromEvent(canvas, "mousedown");

onMouseDown$.subscribe(updateCursorPosition);
const onMouseUp$ = fromEvent(canvas, "mouseup");

const onMouseMove$ = fromEvent(canvas, "mousemove").pipe(
  takeUntil(onMouseUp$)
);

onMouseDown$.subscribe();

const canvasContext = canvas.getContext("2d");

canvasContext.lineWidth = 8;
canvasContext.lineJoin = "round";
canvasContext.lineCap = "round";
canvasContext.strokeStyle = "white";

const paintSroke = (event) => {
  canvasContext.beginPath();
  canvasContext.moveTo(cursorPosition.x, cursorPosition.y);
  updateCursorPosition(event);
  canvasContext.lineTo(cursorPosition.x, cursorPosition.y);
  canvasContext.stroke();
  canvasContext.closePath();
};

const startPaint$ = onMouseDown$.pipe(
  map(() => onMouseMove$),
  mergeAll()
);

startPaint$.subscribe(paintSroke);

