import React from 'react';
import Context from './context/Context';
import RouterComponent from './components/RouterComponent';

function App() {
  return (
    <Context>
      <RouterComponent/>
    </Context>
  );
}

export default App;
