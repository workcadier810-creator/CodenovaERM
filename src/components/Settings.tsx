import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Building2, Phone, MapPin, Mail, Save, Upload, X, Image as ImageIcon, Shield, Lock, KeyRound, Eye, EyeOff } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

export interface BusinessDetails {
  name: string;
  phone: string;
  address: string;
  email: string;
  logo?: string; // Base64 string
}

interface SecuritySettings {
  password: string;
  hint: string;
  isEnabled: boolean;
}

interface SettingsProps {
  details: BusinessDetails;
  onSave: (details: BusinessDetails) => void;
  security: SecuritySettings;
  onSaveSecurity: (security: SecuritySettings) => void;
}

const Settings = ({ details, onSave, security, onSaveSecurity }: SettingsProps) => {
  const [formData, setFormData] = useState(details);
  const [securityData, setSecurityData] = useState(security);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    showSuccess("Business details updated successfully!");
  };

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (securityData.isEnabled && !securityData.password && !newPassword) {
      showError("Please set a password to enable protection.");
      return;
    }

    if (newPassword) {
      if (!/^\d+$/.test(newPassword)) {
        showError("Password must be numeric only.");
        return;
      }
      if (newPassword !== confirmPassword) {
        showError("Passwords do not match.");
        return;
      }
      onSaveSecurity({ ...securityData, password: newPassword });
      setNewPassword('');
      setConfirmPassword('');
    } else {
      onSaveSecurity(securityData);
    }
    
    showSuccess("Security settings updated!");
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setFormData({ ...formData, logo: undefined });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-2xl md:text-3xl font-bold text-white">System Settings</h2>
        <p className="text-sm md:text-base text-gray-400 mt-1">Manage your company profile and security preferences.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Logo & Security Toggle */}
        <div className="space-y-6 lg:col-span-1">
          <Card className="bg-[#1E1E1E] border-amber-900/20 shadow-xl">
            <CardHeader>
              <CardTitle className="text-amber-500 flex items-center gap-2 text-lg">
                <ImageIcon size={20} />
                Company Logo
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-6">
              <div className="relative group">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-2 border-dashed border-amber-900/30 bg-[#121212] flex items-center justify-center overflow-hidden transition-all group-hover:border-amber-500/50">
                  {formData.logo ? (
                    <img src={formData.logo} alt="Logo Preview" className="w-full h-full object-contain p-2" />
                  ) : (
                    <Upload className="text-gray-600 group-hover:text-amber-500 transition-colors" size={28} />
                  )}
                </div>
                {formData.logo && (
                  <button 
                    onClick={removeLogo}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
              <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="mt-6 border-amber-900/30 text-amber-500 hover:bg-amber-500/10 w-full py-6 rounded-xl">
                {formData.logo ? 'Change Logo' : 'Upload Logo'}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#1E1E1E] border-amber-900/20 shadow-xl">
            <CardHeader>
              <CardTitle className="text-amber-500 flex items-center gap-2 text-lg">
                <Shield size={20} />
                Access Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white">Password Protection</Label>
                  <p className="text-[10px] text-gray-500">Lock app behind numeric code</p>
                </div>
                <Switch 
                  checked={securityData.isEnabled}
                  onCheckedChange={(val) => setSecurityData({ ...securityData, isEnabled: val })}
                  className="data-[state=checked]:bg-amber-600"
                />
              </div>

              {securityData.isEnabled && (
                <form onSubmit={handleSecuritySubmit} className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="space-y-2">
                    <Label className="text-gray-400 text-xs">New Numeric Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 text-gray-600" size={16} />
                      <Input
                        type={showPasswords ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value.replace(/\D/g, ''))}
                        className="bg-[#121212] border-amber-900/30 pl-10 pr-10 text-white h-11"
                        placeholder="Enter numbers..."
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPasswords(!showPasswords)}
                        className="absolute right-3 top-3 text-gray-600 hover:text-amber-500"
                      >
                        {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-400 text-xs">Confirm Password</Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-3 text-gray-600" size={16} />
                      <Input
                        type={showPasswords ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value.replace(/\D/g, ''))}
                        className="bg-[#121212] border-amber-900/30 pl-10 text-white h-11"
                        placeholder="Repeat numbers..."
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-400 text-xs">Password Hint</Label>
                    <Input
                      value={securityData.hint}
                      onChange={(e) => setSecurityData({ ...securityData, hint: e.target.value })}
                      className="bg-[#121212] border-amber-900/30 text-white h-11"
                      placeholder="e.g. My birth year"
                    />
                  </div>

                  <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white py-6 rounded-xl shadow-lg shadow-amber-600/20">
                    Update Security
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Business Details */}
        <Card className="bg-[#1E1E1E] border-amber-900/20 shadow-xl lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-amber-500 flex items-center gap-2 text-lg">
              <Building2 size={20} />
              Company Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300 text-sm">Business Name</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 text-gray-500" size={18} />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-[#121212] border-amber-900/30 pl-10 text-white h-12"
                      placeholder="e.g. CodeNova Solutions"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300 text-sm">Business Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-500" size={18} />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-[#121212] border-amber-900/30 pl-10 text-white h-12"
                      placeholder="contact@codenova.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-300 text-sm">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 text-gray-500" size={18} />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-[#121212] border-amber-900/30 pl-10 text-white h-12"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-gray-300 text-sm">Business Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-500" size={18} />
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="bg-[#121212] border-amber-900/30 pl-10 text-white h-12"
                      placeholder="123 Tech Lane, Silicon Valley, CA"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-6 rounded-xl shadow-lg shadow-amber-600/20 w-full sm:w-auto">
                  <Save className="mr-2" size={20} />
                  Save Identity
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;