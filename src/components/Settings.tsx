import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Building2, Phone, MapPin, Mail, Save, Upload, X, Image as ImageIcon } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

export interface BusinessDetails {
  name: string;
  phone: string;
  address: string;
  email: string;
  logo?: string; // Base64 string
}

interface SettingsProps {
  details: BusinessDetails;
  onSave: (details: BusinessDetails) => void;
}

const Settings = ({ details, onSave }: SettingsProps) => {
  const [formData, setFormData] = useState(details);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    showSuccess("Business details updated successfully!");
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
        <h2 className="text-2xl md:text-3xl font-bold text-white">Business Identity</h2>
        <p className="text-sm md:text-base text-gray-400 mt-1">Manage your company information and branding.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Logo Upload Card */}
        <Card className="bg-[#1E1E1E] border-amber-900/20 shadow-xl lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-amber-500 flex items-center gap-2 text-lg">
              <ImageIcon size={20} />
              Company Logo
            </CardTitle>
            <CardDescription className="text-gray-400 text-xs">
              Upload your brand icon for documents.
            </CardDescription>
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
            
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleLogoUpload}
              accept="image/*"
              className="hidden" 
            />
            
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              className="mt-6 border-amber-900/30 text-amber-500 hover:bg-amber-500/10 w-full py-6 rounded-xl"
            >
              {formData.logo ? 'Change Logo' : 'Upload Logo'}
            </Button>
            <p className="text-[10px] text-gray-500 mt-3 text-center">Recommended: Square PNG or SVG</p>
          </CardContent>
        </Card>

        {/* Details Card */}
        <Card className="bg-[#1E1E1E] border-amber-900/20 shadow-xl lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-amber-500 flex items-center gap-2 text-lg">
              <Building2 size={20} />
              Company Profile
            </CardTitle>
            <CardDescription className="text-gray-400 text-xs">
              These details will appear on all generated invoices.
            </CardDescription>
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
                      className="bg-[#121212] border-amber-900/30 pl-10 focus:border-amber-500 focus:ring-amber-500/20 text-white"
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
                      className="bg-[#121212] border-amber-900/30 pl-10 focus:border-amber-500 focus:ring-amber-500/20 text-white"
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
                      className="bg-[#121212] border-amber-900/30 pl-10 focus:border-amber-500 focus:ring-amber-500/20 text-white"
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
                      className="bg-[#121212] border-amber-900/30 pl-10 focus:border-amber-500 focus:ring-amber-500/20 text-white"
                      placeholder="123 Tech Lane, Silicon Valley, CA"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-6 rounded-xl shadow-lg shadow-amber-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto">
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