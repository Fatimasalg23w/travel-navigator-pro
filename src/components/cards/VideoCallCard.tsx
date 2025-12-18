import React from 'react';
import { VideoCall } from '@/types';
import { categoryLabels, categoryColors } from '@/data/mockData';
import { Video, Clock, User, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface VideoCallCardProps {
  videoCall: VideoCall;
  onClick?: () => void;
}

const VideoCallCard: React.FC<VideoCallCardProps> = ({ videoCall, onClick }) => {
  const statusColors = {
    scheduled: 'bg-amber/20 text-amber border-amber/30',
    completed: 'bg-success/20 text-success border-success/30',
    cancelled: 'bg-destructive/20 text-destructive border-destructive/30',
  };

  const statusLabels = {
    scheduled: 'Programada',
    completed: 'Completada',
    cancelled: 'Cancelada',
  };

  return (
    <div 
      className="p-5 rounded-xl bg-card border border-border shadow-soft hover:shadow-elevated transition-all duration-300 cursor-pointer hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-warm flex items-center justify-center">
            <Video className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">{videoCall.clientName}</h4>
            <p className="text-sm text-muted-foreground">{videoCall.advisorName || 'Sin asignar'}</p>
          </div>
        </div>
        <span className={cn(
          "px-3 py-1 rounded-full text-xs font-medium border",
          statusColors[videoCall.status]
        )}>
          {statusLabels[videoCall.status]}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{format(videoCall.scheduledAt, "EEEE d 'de' MMMM, HH:mm", { locale: es })}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className={cn(
          "px-3 py-1 rounded-lg text-xs font-medium",
          categoryColors[videoCall.category]
        )}>
          {categoryLabels[videoCall.category]}
        </span>
        {videoCall.notes && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <MessageSquare className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCallCard;
