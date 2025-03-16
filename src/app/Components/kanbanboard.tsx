"use client";

import { useState } from 'react';
import { Card, Button } from "@heroui/react";
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

  const handleCardTitleChange = (cardId: string, newTitle: string) => {
    setKanbanData((prevData) => {
      const newData = [...prevData];
      newData.forEach((column) => {
        const card = column.cards.find((card) => card.id === cardId);
        if (card) {
          card.title = newTitle; // Update the card title
        }
      });
      return newData;
    });
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900">
      <title>TaskPulse</title>
      {/* Top Navigation Bar */}
      <nav className="bg-gray-800 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">TaskPulse</h1>
          <div className="flex space-x-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              Settings
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              Profile
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 min-h-screen p-4">
          <div className="space-y-4">
            <div className="text-white">
              <h2 className="text-xl font-semibold mb-2">Dashboard</h2>
              <ul className="space-y-2">
                <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">Overview</li>
                <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">Analytics</li>
                <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">Reports</li>
              </ul>
            </div>
            
            <div className="text-white">
              <h2 className="text-xl font-semibold mb-2">Projects</h2>
              <ul className="space-y-2">
                <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">Active</li>
                <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">Archived</li>
                <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">+ New Project</li>
              </ul>
            </div>

            <div className="text-white">
              <h2 className="text-xl font-semibold mb-2">Team</h2>
              <ul className="space-y-2">
                <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">Members</li>
                <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">Calendar</li>
                <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">Messages</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Main Kanban Area */}
        <div className="flex-1 p-8">
          <div className="flex flex-col items-center space-y-4 p-6 border-4 border-solid border-blue-800 rounded-lg">
            <h1 className="text-3xl font-bold text-center text-white mb-6">TaskPulse</h1>
            <div className="border-left"/>
            <div/>
            
            <div className="flex space-x-4 overflow-x-auto">
              {kanbanData.map((column) => (
                <div key={column.id} className="w-2/3 p-4 border rounded-lg shadow-lg bg-white">
                  <h2 className="text-l font-semibold text-black mb-4 text-center">{column.name}</h2>
                  <div>
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
                          <input
                            type="text"
                            value={card.title}
                            onChange={(e) => handleCardTitleChange(card.id, e.target.value)}
                            className="w-full p-2 bg-blue-100 text-gray-800 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                          />
                        </Card>
                      </motion.div>
                    ))}
                    <Button
                      onPress={() =>
                        setKanbanData((prevData) => {
                          const newData = [...prevData];
                          const newCard = { 
                            id: `${Date.now()}`, 
                            title: 'New Task',
                            onDelete: () => {
                              setKanbanData((prevData) => {
                                const newData = [...prevData];
                                const targetColumn = newData.find((col) => col.id === column.id);
                                if (targetColumn) {
                                  targetColumn.cards = targetColumn.cards.filter(c => c.id !== newCard.id);
                                }
                                return newData;
                              });
                            }
                          };
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
          </div>
        </div>
      </div>
    </div>
  );
}