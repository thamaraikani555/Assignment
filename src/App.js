import React from 'react';
import RoutesModule from './Routes';
import { Provider } from 'react-redux';
import ReduxStore from './store/store';

function App() {
  return (
    <div className="App">
      <Provider store={ReduxStore}>
          <RoutesModule />
      </Provider>        
    </div>
  );
}

export default App;
