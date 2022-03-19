import React from 'react';

// --- Contexto de navegação ---
import { NavigationContainer } from '@react-navigation/native'; 

import { StackRoutes } from './stack.routes';

export function Routes(){
  return (
    <NavigationContainer>
      <StackRoutes/>
    </NavigationContainer>
  );
}