# Introduction

Built on top of the [@radix-ui/react-slot](https://www.radix-ui.com/primitives/docs/utilities/slot) library.

`react-bypass` is a simple utility React component that can be used as a composable approach to skip its first children and prevent it from rendering. Please note that `react-bypass` is meant to be an escape hatch and other approaches may be considered first. Its main use case is to be able to transform external JSX you may not have control of, received as children.

```tsx
<Bypass>
    <div>
        <span>Hello world</span>
    </div>
</Bypass>
```

renders

```tsx
<span>Hello world</span>
```

That is, `<div>` gets "_bypassed_".

It is especially useful in cases where you want to conditionally change a button's behavior in a composable way.

### Example: Display a "Log in" dialog on click when an user is not authorized

```tsx
import * as React from "react";
import { Dialog, DialogTrigger, DialogContent } from "@radix-ui/react-dialog";
import { Bypass } from "react-bypass";

const ProtectedAction = ({ children }) => {
    const { isLoggedIn } = useSession();

    // Allow regular action when user is logged in
    if (isLoggedIn) {
        return children;
    }

    // Bypass the button and replace it with a dialog trigger instead
    return (
        <Dialog>
            <DialogTrigger>
                <Bypass>{children}</Bypass>
            </DialogTrigger>
            <DialogContent>
                <SignUp />
            </DialogContent>
        </Dialog>
    );
};
```

```tsx
// Only allows uploads to start when user is logged in
// When not logged in, the dialog will replace it instead and `startUpload` won't be called
<ProtectedAction>
    <button onClick={startUpload}>
        <span>Click to upload files</span>
    </button>
</ProtectedAction>
// ^ Renders <DialogTrigger><span>...</span></DialogTrigger> if `isLoggedIn = false`
```

## Usage

To start using the library, install it to your project:

```bash
npm i react-bypass
```

```bash
pnpm add react-bypass
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
Set `disabled={true}` to disable its default behavior.

## About

Created in 2024, released under the MIT license.
