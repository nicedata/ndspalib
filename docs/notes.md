# Notes

## Event handlers

In a single page application, sections may be updated with content for which event listeners will be attached. When such a section is removed from the DOM, the previously attached event listeners, although no longer active, remain in somewhere in memory. When section replacement operations occur a lot, the browser may slow down.

This is why we are using a "Listener Tracker" which performs the following operations :

- register event listeners (and the element on which it is attached)
- remove event listeners when the element is no longer in the DOM

The Listener Tracker is executed on the whole page (the `document`)  every time a section is updated. We use the JavaScript `WeakRef()` objects to allow the garbage collector to do its job.

On controlled elements like dialogs and forms, we explicitly clean the used event handlers.

## Debugging

...





