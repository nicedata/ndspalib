# Environments

In single page applications (SPA), only specific sections (or zones) of the page are loaded or updated. During theses processes (load or update), the application state may change. The question is : how can the various sections be informed of an application state change ?

A first answer could be the use of contexts. But contexts only change the visibility of sections and they are not able to carry values.

A second answer is to use an environment, represented by a a list of key-value pairs, to feed the backend with important values (*e.g.* a user id, an order id, etc... ). The backend then may update document sections where this value is needed.

## Implementation

We implemented environment handling via the `nd-env` attribute on HTML elements. For example : 

```html
<p>
	In this paragraph, the <span nd-env="key_name" class="text-danger border">text in red</span>
    will be replaced by the environment variable named '<b>key_name</b>'.
</p>		
```

## Scenario

- The frontend (web server) sends a user name to the backend :
  `app.set_env('username', 'Martin')`
- The backend stores the `{key: 'username', value: 'Martin'}` 
- The backend updates the document replacing all element having `nd-env="username"` with the value `Martin`

## Conclusion

The use of global variables like Flasks `g` is no longer needed. The use of the `ne-env` attribute allows dynamic updates on static pages.

