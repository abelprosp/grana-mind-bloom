
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// Demo data
const data = [
  { name: 'Moradia', value: 35 },
  { name: 'Alimentação', value: 25 },
  { name: 'Transporte', value: 15 },
  { name: 'Lazer', value: 10 },
  { name: 'Educação', value: 8 },
  { name: 'Outros', value: 7 },
];

const COLORS = ['#FF6B00', '#FFA940', '#FFD2B3', '#FFB989', '#FFA055', '#FF8722'];

const ExpensesByCategory: React.FC = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Gastos por Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Percentual']} 
                itemStyle={{ color: '#000' }}
              />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpensesByCategory;
