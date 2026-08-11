import React from 'react';
import { X, Bell, Sparkles, CheckCircle2, ShieldAlert, Check } from 'lucide-react';
import { SiteNotification } from '../types';
import { StorageService } from '../services/storage';

interface NotificationsDrawerProps {
  notifications: SiteNotification[];
  onClose: () => void;
  onRefresh: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  notifications,
  onClose,
  onRefresh
}) => {
  const handleMarkAllRead = () => {
    StorageService.markAllNotificationsRead();
    onRefresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm">
      <div 
        className="w-full max-w-sm bg-slate-900 border-l border-slate-800 h-full p-5 flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-extrabold text-white">Notificações</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllRead}
              className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-2 py-1 rounded-lg"
              title="Marcar todas como lidas"
            >
              <Check className="w-3.5 h-3.5 inline mr-1" />
              Lidas
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
          {notifications.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-10">Nenhuma notificação no momento.</p>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  notif.read ? 'bg-slate-950/40 border-slate-800/60 opacity-70' : 'bg-slate-950 border-blue-500/40 shadow-lg shadow-blue-500/5'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                    {notif.type === 'new_game' && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                    {notif.type === 'link_fixed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    {notif.type === 'system' && <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />}
                    {notif.title}
                  </span>
                  <span className="text-[9px] text-slate-500">{new Date(notif.date).toLocaleDateString('pt-BR')}</span>
                </div>
                <p className="text-xs text-slate-300">{notif.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
