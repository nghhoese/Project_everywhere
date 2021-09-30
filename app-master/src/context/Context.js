import React from 'react';
import {ScheduleProvider} from './ScheduleContext';
import {UserProvider} from './UserContext';

function Context(props) {
  return (
    <UserProvider>
      <ScheduleProvider>{props.children}</ScheduleProvider>
    </UserProvider>
  );
}

export default Context;
