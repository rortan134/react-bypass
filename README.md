# Introduction

`react-bypass` is a simple utility React component that can be used as a composable approach to skip its first children and prevent it from rendering. Please note that `react-bypass` is meant to be an escape hatch and other approaches may be considered first. Its main use case is to be able to transform external JSX you may not have control of, received as the children.

```tsx
<Bypass>
    <div>
        <span>Hello world</span>
    </div>
</Bypass>
```

becomes

```tsx
// <Bypass>
     <span>Hello world</span>
// </Bypass>
```

# Usage

To start using the library, install it to your project:

```bash
npm i react-bypass
```

```tsx
import { Bypass } from "react-bypass";

// ...

function Title() {
    return (
        <Bypass>
            <div>
                <h1>My Awesome Title</h1>
            </div>
        </Bypass>
    );
}

/**
* Output:
*
* <h1>My Awesome Title</h1>
**/
```

The `<Bypass>` component itself doesn't render anything. Any prop passed onto it will be forwarded down to its children.
Set `disabled={true}` to disable its component's default behavior.

# About

Inspired and built on top of the [@radix-ui/react-slot](https://www.radix-ui.com/primitives/docs/utilities/slot) library.

Created in 2024, released under the MIT license.  
