XBubbles custom element

[![Build Status][build]][build-link] [![NPM version][version]][version-link] [![Dependency Status][dependency]][dependency-link] [![devDependency Status][dev-dependency]][dev-dependency-link] [![Code Climate][climate]][climate-link] [![Test Coverage][coverage]][coverage-link] [![Inline docs][inch]][inch-link]

XBubbles provides a simple way to create set of editable elements.

All you need to do is create an element set and specify the necessary conditions.

```html
<div is="x-bubbles">
123,456,789
</div>
```

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
- `bubbling()` - Starting formation bubbles.



[build]: https://travis-ci.org/Katochimoto/x-bubbles.svg?branch=master
[build-link]: https://travis-ci.org/Katochimoto/x-bubbles
[version]: https://badge.fury.io/js/x-bubbles.svg
[version-link]: http://badge.fury.io/js/x-bubbles
[dependency]: https://david-dm.org/Katochimoto/x-bubbles.svg
[dependency-link]: https://david-dm.org/Katochimoto/x-bubbles
[dev-dependency]: https://david-dm.org/Katochimoto/x-bubbles/dev-status.svg
[dev-dependency-link]: https://david-dm.org/Katochimoto/x-bubbles#info=devDependencies
[climate]: https://codeclimate.com/github/Katochimoto/x-bubbles/badges/gpa.svg
[climate-link]: https://codeclimate.com/github/Katochimoto/x-bubbles
[coverage]: https://codeclimate.com/github/Katochimoto/x-bubbles/badges/coverage.svg
[coverage-link]: https://codeclimate.com/github/Katochimoto/x-bubbles
[inch]: https://inch-ci.org/github/Katochimoto/x-bubbles.svg?branch=master
[inch-link]: https://inch-ci.org/github/Katochimoto/x-bubbles
