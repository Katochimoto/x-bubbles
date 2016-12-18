### Options

Settings you can declare the function via `options()` or via data attributes.

For example:

```js
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


For more details see [GitHub Flavored Markdown](https://guides.github.com/features/mastering-markdown/).

### Jekyll Themes

Your Pages site will use the layout and styles from the Jekyll theme you have selected in your [repository settings](https://github.com/Katochimoto/x-bubbles/settings). The name of this theme is saved in the Jekyll `_config.yml` configuration file.

### Support or Contact

Having trouble with Pages? Check out our [documentation](https://help.github.com/categories/github-pages-basics/) or [contact support](https://github.com/contact) and we’ll help you sort it out.
