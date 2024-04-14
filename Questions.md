 - 1 The diff between `Component` and `PureComponent` is that `PureComponent`  
   implements `shouldComponentUpdate` which is an instance method in React class components.  
   This built-in method does a shallow comparison of the props and state of the component.  
   If we would need manual control over the update of the component, we would use `Component`  
   and implement `shouldComponentUpdate` ourselves.  
   New style components (functional components) can use `React.memo` to achieve the same effect.
   <br /><br />

 - 2 If a component uses context, it will always re-render when the context changes.  
   ignoring the return of `shouldComponentUpdate`.  
   This applies to functional components that are using React.memo as well.
   <br /><br />

 - 3 Passing data from child to parent can be done via callback functions (e.g: `onClick`).  
   Another way might be by using a state management library where children can push information that the parent would listen to.  
   Yet another way would be by dispatching a native event for which a parent might have a listener attached to.
   <br /><br />


- 4 Preventing components from re-rendering can be done by using `React.memo` for functional components  
  or by using `shouldComponentUpdate` or extending `PureComponent` for class components.  
  From parent perspective the props sent into the child component should be memoized.
  <br /><br />


- 5 A `Fragment` is a built-in component in React that allows returning children without the need to wrap them in a container.  
   It helps with composability allowing creating a bigger component by putting together smaller components  
   without adding un-needed nodes to the DOM.
   <br /><br />


- 6 The HOC pattern is a way to extend the functionality of a component.  
  It consists in wrapping a component inside another component which can receive new props.  
  This is done with a function that receives the original component and returns a wrapper.  
  The wrapper picks up the props that it is interested in and forwards down the rest to the original component.
  Another name to the HOC pattern is the decorator pattern.  
  The decorator pattern is about wrapping a function in another function which might result in a chain of functions.
  In Python decorators are a built-in feature of the language.  
  In JavaScript decorators are a proposal for the language.  
  A different way to extend the functionality of a component in React is by using `render props` pattern.  
  It consists in passing a function (mostly `children` as a function prop) to the higher component.  
  The higher component will expose its state to the function that is passed in which will return the wrapped component  
  that can consume the state provided.  
  An example of HOC is `connect` from `react-redux` which connects a component to the store.  
  `React.memo` is a builtin HOC that memoizes the component.
  <br /><br />

- 7 In promises exceptions are handled with `.catch` method  
  while in async/await exceptions are handled with `try/catch` blocks  
  the same as in synchronous code.
  <br /><br />

- 8 setState is used in class components.  
  It can take an `object` or a `function` as first argument and a `callback` as a second argument.  
  The `object` will be merged with the current state.
  The `function` receives current state and should return a new derived state.
  The `callback` can be used when we need to do something after the state has been updated.  
  Calling setState multiple times in the same frame will batch the updates, the downside being  
  that the updated state will not be visible until the next render.  
  This is where the `callback` is useful.  
  As an alternative to the callback we can use `componentDidUpdate` lifecycle method.
  <br /><br />

- 9 If there would be a standard way to migrate class components to functional components,  
  there would be a tool to do that.   
  However, the migration must be done manually knowing a few relationships between class components and hooks.  
  The `useState` hook would replace the state of the class component.  
  The `useEffect` hook would replace the lifecycle methods.  
  The `useContext` hook would replace the old ways of using context.  
  The `useRef` hook would replace the instance variables and the previous `React.createRef`.  
  The `useMemo` hook would replace the `shouldComponentUpdate` method.  
  The `useEffect` and `useLayoutEffect` hook would replace the `componentDidMount`, `componentDidUpdate` and `componentWillUnmount`.    
  <br /><br />

- 10 Styling components can be done by using classNames and imported CSS or SCSS files  
  or CSS-in-JS libraries or inline styles.
  Inline styles should not be abused.
  <br /><br />

- 11 HTML string coming from server can be handled either by using `dangerouslySetInnerHTML`  
  if we trust that the string has been sanitised at server side, or by using a `Markdown` library.
  <br /><br />
