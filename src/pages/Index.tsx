import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import CRM, { Customer } from '@/components/CRM';
import Inventory, { InventoryItem } from '@/components/Inventory';
import Invoicing, { Invoice } from '@/components/Invoicing';
import Settings, { BusinessDetails } from '@/components/Settings';
import LockScreen from '@/components/LockScreen';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const Index = () => {
  const [activeTab, setActiveTab] = useState('crm');
  const [isUnlocked, setIsUnlocked] = useState(false);
  
  // Persistent State
  const [businessDetails, setBusinessDetails] = useLocalStorage<BusinessDetails>('codenova_business', {
    name: '',
    phone: '',
    address: '',
    email: '',
    logo: ''
  });

  const [securitySettings, setSecuritySettings] = useLocalStorage('codenova_security', {
    password: '',
    hint: '',
    isEnabled: false
  });
  
  const [customers, setCustomers] = useLocalStorage<Customer[]>('codenova_customers', []);
  const [inventory, setInventory] = useLocalStorage<InventoryItem[]>('codenova_inventory', []);
  const [invoices, setInvoices] = useLocalStorage<Invoice[]>('codenova_invoices', []);

  // If no password is set, consider it unlocked
  useEffect(() => {
    if (!securitySettings.isEnabled || !securitySettings.password) {
      setIsUnlocked(true);
    }
  }, [securitySettings]);

  const renderContent = () => {
    switch (activeTab) {
      case 'crm':
        return <CRM customers={customers} onUpdate={setCustomers} />;
      case 'inventory':
        return <Inventory items={inventory} onUpdate={setInventory} />;
      case 'invoicing':
        return (
          <Invoicing 
            inventory={inventory} 
            invoices={invoices} 
            businessDetails={businessDetails}
            onUpdateInventory={setInventory}
            onSaveInvoice={(inv) => setInvoices([inv, ...invoices])}
          />
        );
      case 'settings':
        return (
          <Settings 
            details={businessDetails} 
            onSave={setBusinessDetails}
            security={securitySettings}
            onSaveSecurity={setSecuritySettings}
          />
        );
      default:
        return <CRM customers={customers} onUpdate={setCustomers} />;
    }
  };

  if (!isUnlocked) {
    return (
      <LockScreen 
        correctPassword={securitySettings.password} 
        hint={securitySettings.hint}
        onUnlock={() => setIsUnlocked(true)} 
      />
    );
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default Index;