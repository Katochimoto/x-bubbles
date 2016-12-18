### Options

Settings you can declare the function via `options()` or via data attributes.

For example:

```html
<script>
function bubbleDeformation(node) {
  return node.innerText;
}
</script>
<div is="x-bubbles"
  data-separator="/[,]/"
  data-selection="off"
  data-class-bubble="bubble"
  data-bubble-deformation="bubbleDeformation">
  123,456,789
</div>
```

- `begining` - Regular expression to determine the rules for the formation of a bubble since the beginning of the input text.
- `bubbleCopy` - Conversion function list bablow in the text when copying.
- `bubbleDeformation` - The transformation function of the bubble in the text for editing.
- `bubbleFormation` - A function to convert text to bubble.
- `checkBubblePaste` - Check function of the ability to insert text automatically converted to the bubble.
- `classBubble` - Class of bubble.
- `disableControls` - Disabling controls navigation bubble.
- `draggable` - The ability to drag bubble.
- `ending` - Regular expression to determine the rules for the formation of dough from the end of the input text.
- `selection` - The ability to select bubble.
- `separator` - Regular expression to declare delimiters of bubbles.
- `separatorCond` - A function to check the conditions of formation of the bubble after you enter the delimiter.
- `tokenizer` - The function of the formation bubbles. Ignores `begining`, `ending` and `separator`.

### Events

- `before-remove` - Triggered before removing the bubble.
- `bubble-edit` - Triggered after the start of the edit bubble.
- `bubble-input` - Срабатывает в процессе ввода значения пузыря.
- `change` - Change the list of bubbles.
- `x-bubbles-ready` - Event readiness custom elements. Triggered on the window.

### Properties

- `items` - The list of bubbles.
- `inputValue` - Input value.

### Methods

- `options(string: name, [value]): *` - Changing and getting options.
- `setContent(string: data): boolean` - Set contents of the bubbles.
- `addBubble(string: bubbleText, [object: data]): boolean` - Add bubble.
- `removeBubble(HTMLElement: nodeBubble): boolean` - Remove bubble.
- `editBubble(HTMLElement: nodeBubble): boolean` - Edit bubble.
- `bubbling()` - Starting formation bablow.
