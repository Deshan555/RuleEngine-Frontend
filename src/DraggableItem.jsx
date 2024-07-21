// DraggableItem.js
import React from 'react';
import { useDrag } from 'react-dnd';

const DraggableItem = ({ type, label }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: type,
    item: { label },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        padding: '8px',
        margin: '4px',
        backgroundColor: 'lightgrey',
        cursor: 'move',
      }}
    >
      {label}
    </div>
  );
};

export default DraggableItem;
