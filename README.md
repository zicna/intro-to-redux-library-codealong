# Intro to Redux: Reading Data from State

## Objectives

- Use the `createStore()` method provided by the Redux library.

## Introduction

In the previous section, we used a **createStore()** method that we wrote, 
and passed a reducer to it. We used the **dispatch** method from the store 
to dispatch actions and update the state.

Now let's think about which part of our application would belong in the official
Redux library -- that is, which part of our codebase would be common to all
applications. Well, probably not the reducer as our reducers seem unique to each
React & Redux application. The reducers are unique because sometimes we have
reducers that would add or remove items, or add or remove users, or edit users,
etc. What these actions are and how the reducer manages the state is customized.
Thus, the reducer would not be part of the Redux library that other developers
would use to build their application.

The **createStore()**, method however is generic across Redux applications. It
always returns a store (given a reducer) that will have a dispatch method and a
getState method.

So from now on, we will import our **createStore()** method from the official
Redux library. Normally, to install Redux into a React application, you need to
install two packages, `redux` and `react-redux`, by running 
`npm install redux && npm install react-redux`. These are already included in 
this lesson's `package.json` file, so all you need to do is run 
`npm install && npm start` to get started.

In this code along, we'll be building a simple counter application that 
displays the value of the counter along with a button to increment it.

### Step 1: Setting Up The Store

First things first, we'll use Redux to initialize our store and pass it down to
our top-level container component.

Redux provides a function, `createStore()`, that, when invoked, returns an
instance of the Redux store for us. We want to import `createStore()` in our 
`src/index.js` file, where ReactDOM renders our application, and then use
that function to create the store.

```javascript
// ./src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux'; /* code change */
import counterReducer from './reducers/counterReducer.js';
import App from './App';
import './index.css';

const store = createStore(counterReducer); /* code change */

ReactDOM.render(<App />, document.getElementById('root'));
```

Now, with the above set up, let's pass `store` down to App as a prop so it 
can access the **Redux** store.

```javascript
// ./src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import counterReducer from './reducers/counterReducer.js';
import App from './App';
import './index.css';

const store = createStore(counterReducer);


ReactDOM.render(
    <App store={store} />  /* code change */,
  document.getElementById('root')
);
```

So, to recap, just like we did previously, we call our **createStore()** method
in `src/index.js`. We pass our **createStore()** method a reducer, and then we
pass our newly created store to our **App** component as a prop. You can find
the reducer in `./src/reducers/counterReducer.js`:

```javascript
// ./src/reducers/counterReducer.js

export default function counterReducer(
	state = {
		clicks: 0
	},
	action
) {
	switch (action.type) {
		case 'INCREASE_COUNT':
			return {
				clicks: state.clicks + 1
			}
		default:
			return state;
	}
}
```

Each time an action with type 'INCREASE_COUNT' is dispatched to the reducer, 
the value of the counter is incremented.

Instead of having all of our functions encapsulated in a closure within
`index.js` as we did while building our own Redux set up, we've now separated
out the reducer function, giving it a relevant name, `counterReducer`,
and let the Redux library take care of our `createStore` function. These two
pieces are both imported into `src/index.js` and used to create `store`.

Once we've created the store and passed it to the `App` component as a prop, 
we can access it using `this.props.store`:

```javascript
// ./src/App.js
import React, { Component } from 'react';
import './App.css';

class App extends Component {
	handleOnClick = () => {
		this.props.store.dispatch({
		  type: 'INCREASE_COUNT',
		});
	  }

	render() {
		const state = this.props.store.getState();
		return (
			<div className="App">
				<button onClick={this.handleOnClick}>Click</button>
				<p>{state.clicks}</p>
			</div>
		);
	}
}

export default App;
```

As you recall, the store contains two methods: `dispatch` and `getState`. We
use the `getState` method in our `render` method to get the current state so 
we can display it on the page. We also have an event handler that calls the 
`dispatch` method, passing in our action, when the button is clicked. 

Now, with this code in place, if you boot up the app you should see a button 
on the page, followed by a zero. Then, if you click on the button... nothing 
happens. So what's gone wrong here? Well, we've done the work necessary to
create the store and made it accessible to our app so the state is updated
when we click the button, but we haven't yet done all the work necessary to 
get our **React** and **Redux** libraries communicating with each other 
properly so the page re-renders once the state is updated. We'll tackle that 
in the next lesson. In the meantime, how do we know our is state getting 
updated? Let's get some feedback so we can find out.


#### Add Logging to Our Reducer

First, let's log our action and the new state. So we'll change the reducer as 
follows:

```javascript
// ./src/reducers/counterReducer

export default function counterReducer(
  state = {
    clicks: 0
  },
  action
) {
  console.log(action);
  switch (action.type) {
    case 'INCREASE_COUNT':
      console.log('Current state.clicks %s', state.clicks);
      console.log('Updating state.clicks to %s', state.clicks + 1);
      return {
        clicks: state.clicks + 1
      };

    default:
      console.log('Initial state.clicks: %s', state.clicks);
      return state;
  }
}
```

Ok, so this may look like a lot, but really all we're doing is adding some
logging behavior. At the top of the function, we are logging the action. After
the case statement, we are logging our current state first, followed by the 
value the state is being updated to. Under the default case statement, we
can just log the previous state because this state will be unchanged.

Now, refresh your app, and give it a shot. When the page loads, you should see 
the initial action being logged, along with the initial value of the counter, 0. 
This is coming from our default case. Then, when you click the button, you 
should see the `INCREASE_COUNT` action logged along with the current state and 
the state we are updating to. We know that we are dispatching actions because 
each time we click the button, we can see that the call to 
`this.props.store.dispatch({ type: 'INCREASE_COUNT' })` is hitting our reducer, 
and we can also see the value of the current state increasing each time. So 
things are happening.

#### Redux DevTools
There is this amazing piece of software that allows us to nicely view the state
of our store and each action that is dispatched. (In actuality, the software can 
do a lot more for us than that; you can read up on it here:
[redux-devtools-extension][devtools].) Ok, so let's get to incorporating the 
devtools. In fact, every time we use the Redux library going forward, we should 
make sure we incorporate devtools. Otherwise, you are flying blind.

First, just Google for Redux Devtools Chrome. You should find the Chrome extension 
for Redux. Please download it, and refresh Chrome. To verify that you have 
successfully installed the extension, go to your developer console in Google
Chrome (press command+shift+c to pull it up). In the top bar you will see a couple 
of arrows. Click those arrows, and if you see Redux in the dropdown, you have 
properly installed the Chrome extension. Step one is done.

Second, we need to tell our application to communicate with this extension.
Doing so is pretty easy. Let's change the arguments to our createStore method
to the following:

```javascript
// ./src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import counterReducer from './reducers/counterReducer';
import App from './App';
import './index.css';

const store = createStore(
  counterReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
); /* code change */

ReactDOM.render(
  <App store={store} />,
  document.getElementById('root')
);
```

Ok, notice that we are still passing through our reducer to the createStore
method. The second argument is accessing our browser to find a method called
`__REDUX_DEVTOOLS_EXTENSION__`. Now let's open the Redux Devtools (press 
command+shift+c, click on the arrows at the top right, and select the extension 
in the dropdown). You should see the initial action, `@@INIT` in the inspector. 
Now click on the tab that says state. You should see `{ clicks: 0 }`. If you do, 
it means that your app is now communicating with the devtool. Each time you click 
on the button in your application, you should see the action name 
(`INCREASE_COUNT`) and the updated state show up in the devtools.

Whew!

### Summary

In this lesson, we saw how to use the **createStore()** method. We saw that we
can rely on the Redux library to provide this method, and that we still need to
write our own reducer to tell the store what the new state should be given a
particular action. We saw that when using the **createStore()** method and
passing through a reducer, we are able to change the state just as we did
previously. We were able to see these changes by hooking our application up to 
a Chrome extension called Redux Devtools, and then providing the correct
configuration.

[devtools]: https://github.com/zalmoxisus/redux-devtools-extension
