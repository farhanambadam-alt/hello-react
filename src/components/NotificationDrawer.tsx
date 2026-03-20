import { Bell } from 'lucide-react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';

interface NotificationDrawerProps {
  open: boolean;
  onClose: () => void;
}

const notifications = [
  { id: '1', title: 'Booking Confirmed', desc: 'Your appointment at Luxe Hair Studio is confirmed for Mar 5.', time: '2h ago', unread: true },
  { id: '2', title: 'Special Offer', desc: 'Get 30% off on your next visit! Use code SAVE30.', time: '1d ago', unread: true },
  { id: '3', title: 'Review Reminder', desc: 'How was your experience at Urban Glow? Leave a review.', time: '3d ago', unread: false },
];

const NotificationDrawer = ({ open, onClose }: NotificationDrawerProps) => (
  <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
    <DrawerContent className="max-h-[80vh]">
      <DrawerHeader className="text-center pb-2">
        <DrawerTitle className="font-heading text-lg">Notifications</DrawerTitle>
      </DrawerHeader>
      <div className="px-5 pb-6 space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`rounded-2xl p-4 border ${
              n.unread ? 'bg-primary/5 border-primary/15' : 'bg-card border-border'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bell size={14} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading font-semibold text-[13px] text-foreground">{n.title}</h4>
                  {n.unread && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                </div>
                <p className="text-[12px] font-body text-muted-foreground mt-0.5 leading-relaxed">{n.desc}</p>
                <span className="text-[10px] font-body text-muted-foreground/60 mt-1 block">{n.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DrawerContent>
  </Drawer>
);

export default NotificationDrawer;
