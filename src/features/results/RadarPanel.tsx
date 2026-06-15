import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { AXES } from '../../data/axes';
import type { SessionResult } from '../../types';
import styles from './RadarPanel.module.css';

interface Props {
  result: SessionResult;
  nameA: string;
  nameB: string;
}

export function RadarPanel({ result, nameA, nameB }: Props) {
  const data = AXES.map((axis) => {
    const score = result.perAxis.find((p) => p.axis === axis.id);
    return {
      axis: axis.labelAr,
      [nameA]: score?.scoreA ?? 0,
      [nameB]: score?.scoreB ?? 0,
    };
  });

  return (
    <div className={`card ${styles.wrap}`}>
      <ResponsiveContainer width="100%" height={360}>
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid stroke="#d9d3c8" />
          <PolarAngleAxis
            dataKey="axis"
            tick={{ fill: '#1c2b2b', fontSize: 13, fontFamily: 'IBM Plex Sans Arabic' }}
          />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#8a948f', fontSize: 10 }} />
          <Radar
            name={nameA}
            dataKey={nameA}
            stroke="#0f3d3e"
            fill="#0f3d3e"
            fillOpacity={0.3}
          />
          {!result.isSolo && (
            <Radar
              name={nameB}
              dataKey={nameB}
              stroke="#c79a4b"
              fill="#c79a4b"
              fillOpacity={0.3}
            />
          )}
          <Legend wrapperStyle={{ fontFamily: 'IBM Plex Sans Arabic', paddingTop: 12 }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
