import React, { memo } from 'react';


export interface IndexProps {

}

export const Index = memo(function IndexComponent({}: IndexProps) {
  return (
    <div>
      welcome to the index page
    </div>
  );
});
