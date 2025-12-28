import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Github } from "lucide-react";

interface HeatmapProps {
  dailyActivity: Array<{ date: string; count: number; points: number }>;
  className?: string;
}

export function GitHubHeatmap({ dailyActivity, className = "" }: HeatmapProps) {
  const activityMap = new Map(dailyActivity.map(day => [day.date, day]));

  const generateDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      if (!dateStr) continue;
      
      const activity = activityMap.get(dateStr);
      
      days.push({
        date: dateStr,
        count: activity?.count || 0,
        points: activity?.points || 0,
        dayOfWeek: date.getDay(),
        isToday: i === 0
      });
    }
    
    return days;
  };

  const days = generateDays();

  const maxActivity = Math.max(...dailyActivity.map(d => d.points), 1);

  const getContributionLevel = (points: number) => {
    if (points === 0) return 0;
    const intensity = points / maxActivity;
    if (intensity <= 0.25) return 1;
    if (intensity <= 0.5) return 2;
    if (intensity <= 0.75) return 3;
    return 4;
  };

  const getContributionColor = (level: number) => {
    const colors = [
      'bg-gray-100 dark:bg-gray-800', // level 0
      'bg-green-200 dark:bg-green-900', // level 1
      'bg-green-300 dark:bg-green-700', // level 2
      'bg-green-400 dark:bg-green-600', // level 3
      'bg-green-500 dark:bg-green-500'  // level 4
    ];
    return colors[level];
  };

  // Group days into weeks (starting from Sunday)
  const weeks: Array<Array<typeof days[0]>> = [];
  let currentWeek: Array<typeof days[0]> = [];

  // Add empty days at the beginning if the first day is not Sunday
  const firstDay = days[0];
  if (firstDay && firstDay.dayOfWeek !== 0) {
    for (let i = 0; i < firstDay.dayOfWeek; i++) {
      currentWeek.push({
        date: '',
        count: 0,
        points: 0,
        dayOfWeek: i,
        isToday: false
      });
    }
  }

  days.forEach((day) => {
    currentWeek.push(day);
    
    if (day.dayOfWeek === 6 || day === days[days.length - 1]) {
      // Fill remaining slots if needed
      while (currentWeek.length < 7 && day === days[days.length - 1]) {
        currentWeek.push({
          date: '',
          count: 0,
          points: 0,
          dayOfWeek: currentWeek.length,
          isToday: false
        });
      }
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Get month labels for the timeline
  const getMonthPositions = (): Array<{ month: string; position: number }> => {
    const positions: Array<{ month: string; position: number }> = [];
    let currentMonth = -1;
    let lastPosition = -60; 
    
    weeks.forEach((week, weekIndex) => {
      const firstDayOfWeek = week.find(day => day.date);
      if (firstDayOfWeek && firstDayOfWeek.date) {
        const date = new Date(firstDayOfWeek.date);
        const month = date.getMonth();
        const position = weekIndex * 16; // 16px per week (including gap)
        
        if (month !== currentMonth && position > lastPosition + 40) { // 40px minimum spacing
          positions.push({
            month: monthLabels[month] || '',
            position: position
          });
          currentMonth = month;
          lastPosition = position;
        }
      }
    });
    
    return positions;
  };

  const monthPositions = getMonthPositions();
  const totalContributions = dailyActivity.reduce((sum, day) => sum + day.count, 0);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Github className="w-5 h-5" />
          Contribution Activity
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {totalContributions} contributions in the last year
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Month labels */}
          <div className="relative h-4">
            {monthPositions.map((pos, i) => (
              <div
                key={i}
                className="absolute text-xs text-muted-foreground"
                style={{ left: `${pos.position}px` }}
              >
                {pos.month}
              </div>
            ))}
          </div>
          
          {/* Day labels and heatmap */}
          <div className="flex gap-1">
            {/* Day labels */}
            <div className="flex flex-col gap-1 text-xs text-muted-foreground w-8">
              <div className="h-3"></div> {/* Spacer for month labels */}
              {dayLabels.map((label, i) => (
                <div key={i} className={`h-3 leading-3 ${i % 2 === 0 ? '' : 'opacity-0'}`}>
                  {i % 2 === 0 ? label : ''}
                </div>
              ))}
            </div>
            
            {/* Heatmap grid */}
            <div className="flex gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => {
                    const level = day.date ? getContributionLevel(day.points) : 0;
                    const isEmpty = !day.date;
                    
                    return (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className={`w-3 h-3 rounded-sm border border-gray-200 dark:border-gray-700 ${
                          isEmpty 
                            ? 'bg-transparent border-transparent' 
                            : getContributionColor(level)
                        } ${day.isToday ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
                        title={day.date ? 
                          `${day.count} contributions on ${new Date(day.date).toLocaleDateString()}` : 
                          ''
                        }
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Less</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map(level => (
                <div
                  key={level}
                  className={`w-3 h-3 rounded-sm border border-gray-200 dark:border-gray-700 ${getContributionColor(level)}`}
                />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}