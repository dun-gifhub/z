import React from 'react';
import {
  ShieldAlert,
  Shield,
  Lock,
  RotateCcw,
  Snowflake,
  Zap,
  Clock,
  Shuffle,
  Sparkles,
  Coins,
  Award,
  Flame,
  Eye,
  Feather,
  Swords,
  Crown,
  HelpCircle,
} from 'lucide-react';

interface RuneIconProps {
  icon: string;
  className?: string;
  size?: number;
  style?: React.CSSProperties;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string; size?: number; style?: React.CSSProperties }>> = {
  ShieldAlert,
  Shield,
  Lock,
  RotateCcw,
  Snowflake,
  Zap,
  Clock,
  Shuffle,
  Sparkles,
  Coins,
  Award,
  Flame,
  Eye,
  Feather,
  Swords,
  Crown,
};

export const RuneIcon: React.FC<RuneIconProps> = ({
  icon,
  className = 'w-6 h-6',
  size,
  style,
}) => {
  const IconComponent = ICON_MAP[icon] || HelpCircle;
  return <IconComponent className={className} size={size} style={style} />;
};
