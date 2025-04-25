
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Sample habit data
const habits = [
  { 
    id: 1, 
    name: 'Economizar para emergências', 
    target: 'R$50 por semana', 
    currentStreak: 3,
    bestStreak: 8,
    completedToday: false
  },
  { 
    id: 2, 
    name: 'Revisar gastos', 
    target: 'Diariamente', 
    currentStreak: 5,
    bestStreak: 14,
    completedToday: true
  },
  { 
    id: 3, 
    name: 'Sem compras impulsivas', 
    target: 'Toda semana', 
    currentStreak: 1,
    bestStreak: 3,
    completedToday: false
  },
];

const HabitTracker: React.FC = () => {
  // Demo state for UI interaction
  const [habitsState, setHabitsState] = React.useState(habits);

  const toggleHabitCompletion = (id: number) => {
    setHabitsState(prevHabits => 
      prevHabits.map(habit => 
        habit.id === id 
          ? { 
              ...habit, 
              completedToday: !habit.completedToday,
              currentStreak: !habit.completedToday ? habit.currentStreak + 1 : habit.currentStreak - 1
            }
          : habit
      )
    );
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Hábitos Financeiros</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {habitsState.map((habit) => (
            <div key={habit.id} className="border rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">{habit.name}</h4>
                  <p className="text-xs text-muted-foreground">{habit.target}</p>
                </div>
                <Button
                  size="sm"
                  variant={habit.completedToday ? "default" : "outline"}
                  className={`h-7 w-7 p-0 rounded-full ${habit.completedToday ? 'bg-orange-600 hover:bg-orange-700' : 'border-orange-200'}`}
                  onClick={() => toggleHabitCompletion(habit.id)}
                >
                  <Check size={14} />
                </Button>
              </div>
              <div className="flex gap-3 mt-2">
                <div className="bg-muted/50 rounded px-2 py-1 text-xs">
                  <span className="text-muted-foreground">Atual: </span>
                  <span className="font-medium">{habit.currentStreak} dias</span>
                </div>
                <div className="bg-muted/50 rounded px-2 py-1 text-xs">
                  <span className="text-muted-foreground">Recorde: </span>
                  <span className="font-medium">{habit.bestStreak} dias</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <a href="/dashboard/habits" className="text-sm text-orange-600 hover:underline">
            Gerenciar todos os hábitos
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default HabitTracker;
