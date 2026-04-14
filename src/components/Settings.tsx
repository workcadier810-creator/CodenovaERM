import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Building2, Phone, MapPin, Mail, Save } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

interface BusinessDetails {
  name: string;
  phone: string;
  address: string;
  email: string;
}

interface SettingsProps {
  details: BusinessDetails;
  onSave: (details: BusinessDetails) => void;
}

const Settings = ({ details, onSave }: SettingsProps) => {
  const [formData, setFormData] = useState(details);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    showSuccess("Business details updated successfully!");
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-3xl font-bold text-white">Business Identity</h2>
        <p className="text-gray-400 mt-1">Manage your company information for invoices and documents.</p>
      </header>

      <Card className="bg-[#1E1E1E] border-amber-900/20 shadow-xl">
        <CardHeader>
          <CardTitle className="text-amber-500 flex items-center gap-2">
            <Building2 size={20} />
            Company Profile
          </CardTitle>
          <CardDescription className="text-gray-400">
            These details will appear on all generated invoices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">Business Name</Label>
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
                <Label htmlFor="email" className="text-gray-300">Business Email</Label>
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
                <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
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
                <Label htmlFor="address" className="text-gray-300">Business Address</Label>
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
              <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-6 rounded-xl shadow-lg shadow-amber-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                <Save className="mr-2" size={20} />
                Save Business Identity
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;