import { useState } from 'react';
import { Heart, HelpCircle, LogOut, ChevronRight, Edit3, Camera, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppHeader from '@/components/AppHeader';
import ScrollToTop from '@/components/ScrollToTop';

const menuItems = [
  { icon: Heart, label: 'Saved Salons', badge: '3' },
  { icon: HelpCircle, label: 'Help & Support' },
];

const ProfilePage = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [name, setName] = useState('Aarav Sharma');
  const [phone] = useState('+91 98765 43210');
  const [avatar, setAvatar] = useState(
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&h=240&fit=crop'
  );

  const [editName, setEditName] = useState(name);
  const [editAvatar, setEditAvatar] = useState(avatar);

  const openEdit = () => {
    setEditName(name);
    setEditAvatar(avatar);
    setDrawerOpen(true);
  };

  const handleSave = () => {
    setName(editName);
    setAvatar(editAvatar);
    setDrawerOpen(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setEditAvatar(url);
    }
  };

  const headerLeft = (
    <div className="flex items-center gap-3">
      <button
        onClick={() => window.appBack?.()}
        className="min-w-[48px] min-h-[48px] rounded-full bg-secondary flex items-center justify-center"
        aria-label="Go back"
      >
        <ArrowLeft size={18} className="text-foreground" />
      </button>
      <h1 className="font-heading font-bold text-xl text-foreground">Profile</h1>
    </div>
  );

  return (
    <div className="min-h-screen pb-safe">
      <AppHeader leftSlot={headerLeft} showLocation={false} showNotification={false} />

      {/* Profile card */}
      <div className="relative px-5 pt-8 pb-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4">
            <Avatar className="w-24 h-24 border-[3px] border-primary/20 shadow-lg">
              <AvatarImage src={avatar} alt="Profile" />
              <AvatarFallback className="text-2xl font-heading font-bold bg-primary/10 text-primary">
                {name.split(' ').map((n) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={openEdit}
              className="absolute bottom-0 right-0 w-8 h-8 min-w-[44px] min-h-[44px] -mr-2 -mb-2 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md active:scale-95 transition-transform"
              aria-label="Edit profile"
            >
              <Edit3 size={14} />
            </button>
          </div>
          <h2 className="font-heading font-bold text-xl text-foreground">{name}</h2>
          <p className="text-sm font-body text-muted-foreground mt-0.5">{phone}</p>
        </div>
      </div>

      {/* Menu */}
      <div className="px-5 space-y-2.5 max-w-7xl mx-auto">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className="w-full flex items-center gap-3.5 bg-card rounded-2xl p-4 card-shadow border border-border active:scale-[0.98] transition-transform min-h-[56px]"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center">
              <item.icon size={20} className="text-primary" />
            </div>
            <span className="flex-1 text-left font-heading font-medium text-[15px] text-foreground">{item.label}</span>
            {item.badge && (
              <span className="text-xs font-heading font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
            <ChevronRight size={18} className="text-muted-foreground/60" />
          </button>
        ))}

        <div className="pt-4">
          <button className="w-full flex items-center gap-3.5 bg-card rounded-2xl p-4 card-shadow border border-border active:scale-[0.98] transition-transform min-h-[56px]">
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <LogOut size={20} className="text-destructive" />
            </div>
            <span className="font-heading font-medium text-[15px] text-destructive">Logout</span>
          </button>
        </div>
      </div>

      {/* Edit Profile Drawer */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="text-center pb-2">
            <DrawerTitle className="font-heading text-lg">Edit Profile</DrawerTitle>
          </DrawerHeader>

          <div className="px-5 pb-4 space-y-6">
            <div className="flex flex-col items-center">
              <div className="relative">
                <Avatar className="w-28 h-28 border-[3px] border-primary/20 shadow-lg">
                  <AvatarImage src={editAvatar} alt="Profile" />
                  <AvatarFallback className="text-3xl font-heading font-bold bg-primary/10 text-primary">
                    {editName.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute bottom-1 right-1 w-9 h-9 min-w-[44px] min-h-[44px] -mr-2 -mb-2 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md cursor-pointer active:scale-95 transition-transform">
                  <Camera size={16} />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Tap camera to change photo</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-name" className="font-heading font-medium text-sm text-foreground">
                Full Name
              </Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="rounded-xl h-12 bg-card border-border font-body"
                placeholder="Enter your name"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-heading font-medium text-sm text-foreground">Phone Number</Label>
              <Input
                value={phone}
                disabled
                className="rounded-xl h-12 bg-muted border-border font-body text-muted-foreground"
              />
              <p className="text-[11px] text-muted-foreground">Phone number cannot be changed</p>
            </div>
          </div>

          <DrawerFooter className="pt-0">
            <Button
              onClick={handleSave}
              disabled={!editName.trim()}
              className="w-full rounded-xl h-12 font-heading font-semibold text-[15px]"
            >
              Save Changes
            </Button>
            <Button
              variant="ghost"
              onClick={() => setDrawerOpen(false)}
              className="w-full rounded-xl h-12 font-heading text-muted-foreground"
            >
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <ScrollToTop />
    </div>
  );
};

export default ProfilePage;
