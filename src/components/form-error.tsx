import React from 'react';
//type of form eeror is Reac.Fc functional component
//errorMessage has any, so React.FC is believe that it has only children.
//create inerface

interface IformErrorProps {
  errorMessage: string;
}
export const FormError: React.FC<IformErrorProps> = ({errorMessage}) => {
  return <span className="font-medium text-red-500">{errorMessage}</span>
};