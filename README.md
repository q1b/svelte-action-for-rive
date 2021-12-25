# How to use ?

- import it like

```js
import { rivePlayer } from "rive-svelte-action";
```

- Then use this function in your file

```ts
export let art;
async function getBuffer(filePath = "/animations/main.riv"): Promise<Blob> {
  const req: Request = new Request(filePath);
  const response: Response = await fetch(req);
  const buffer: Blob = await response.blob();
  return buffer;
}

let buffer = getBuffer(); // This is a promise
```

Now use this in your svelte file as

```js
{#await buffer}
	<!-- Any Html You want to show here -->
{:then buf}
	{#if art === 'First_ArtboardName'}
	  <canvas
        use:rivePlayer={{
          buf,
          'First_Artboard_Name',
          'stateMachine_Name'
        }}
        on:riveActive={
          hoverAnimation
        }
      ></canvas>
	{:else if art === 'Second_ArtboardName'}
      ...
    {/if}
{/await}
```

#### Did you see that hoverAnimation in previous snippet let's see what is that ?

```js
const hoverAnimation = (event) => {
  let r = event.detail;
  // You get reference to
  // current Rive Object of current artboard frame.
  r.play();
  let containerRef = event.target.parentElement;
  // Use javascript to make it interactive
  containerRef.onmouseenter = () => {
    r.stateMachineInputs("switch")[0].fire();
  };
  containerRef.onmouseleave = () => {
    r.stateMachineInputs("switch")[0].fire();
  };
};
```
