# XState: Complete getting started guide
This repository contains all the code for the course [XState: Complete Getting Started Guide](https://www.typeonce.dev/course/xstate-complete-getting-started-guide).

The app is implemented using typescript. You can get started by forking/cloning the repository and installing the dependencies:

```sh
pnpm install
```

***

## Course content

[`xstate`](https://xstate.js.org/) is the last state management library you will ever need.

`xstate` leverages [state charts](https://stately.ai/docs/state-machines-and-statecharts) to model UI state:
- json-like object to describe states and transitions
- Define functions to execute between transitions (`actions`)
- Orchestrate async effects with the [actor model](https://stately.ai/docs/actor-model) (`actors`)
- Powerful typescript support
- Framework agnostic

## Course content

The course starts from the classic way of handling state and effects using `useState` and `useEffect`. We learn why this model is flawed and what problem it introduces.

We then refactor the same logic using `xstate`. This allows to understand the state chart model and how to refactor plain react code to use `xstate`.

The rest of the course will present different example of UI state implemented using `xstate`. Each module will introduce new features of `xstate` to show how we can build even complex use cases with ease.


### How the course is organized

The course is organized in small self-contained lessons. Each lesson introduces 1 single new concept.
