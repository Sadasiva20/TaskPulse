"use client";

import { useState } from 'react';
import { Card, Button } from '@heroui/react';
import { motion } from 'framer-motion';

interface CardType {
  id: string;
  title: string;
}

interface ColumnType {
  id: string;
  name: string;
  cards: CardType[];
}

const columns = [
  { id: 'todo', name: 'To Do', cards: [] },
  { id: 'in-progress', name: 'In Progress', cards: [] },
  { id: 'done', name: 'Done', cards: [] },
];

export default function KanbanBoard() {
  const [kanbanData, setKanbanData] = useState<ColumnType[]>(columns);

  const moveCard = (cardId: string, targetColumnId: string) => {
    setKanbanData((prevData: ColumnType[]) => {
      const newData = [...prevData];
      let movedCard: CardType | undefined;
      newData.forEach((column) => {
        const cardIndex = column.cards.findIndex((card) => card.id === cardId);
        if (cardIndex !== -1) {
          movedCard = column.cards[cardIndex];
          column.cards.splice(cardIndex, 1);
        }
      });

      const targetColumn = newData.find((column) => column.id === targetColumnId);
      if (targetColumn && movedCard) {
        targetColumn.cards.push(movedCard);
      }

      return newData;
    });
  };

  return (
    <div className="flex space-x-4 overflow-x-auto">
      {kanbanData.map((column) => (
        <div key={column.id} className="w-1/3 p-4 border rounded-lg shadow-lg bg-white">
          <h2 className="text-xl font-semibold mb-4 text-center">{column.name}</h2>
          <div className="space-y-4">
            {column.cards.map((card) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                drag
                onPointerDown={(event: React.PointerEvent<HTMLDivElement>) => {
                  event.currentTarget.setPointerCapture(event.pointerId);
                  event.currentTarget.dataset.cardId = card.id; // Set the card id for dragging
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const cardId = e.dataTransfer.getData('cardId');
                  moveCard(cardId, column.id);
                }}
              >
                <Card className="p-4 bg-blue-100 shadow-md rounded-lg cursor-pointer hover:bg-blue-200">
                  {card.title}
                </Card>
              </motion.div>
            ))}
            <Button
              onClick={() =>
                setKanbanData((prevData) => {
                  const newData = [...prevData];
                  const newCard = { id: `${Date.now()}`, title: 'New Task' };
                  const targetColumn = newData.find((col) => col.id === column.id);
                  if (targetColumn) {
                    targetColumn.cards.push(newCard);
                  }
                  return newData;
                })
              }
              className="mt-4 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Add Card
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
