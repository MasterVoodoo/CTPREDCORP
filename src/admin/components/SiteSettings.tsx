import { useState, useEffect } from 'react';
import { Settings, Save, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface Setting {
  id: number;
  setting_key: string;
  setting_value: string;
  setting_type: string;
  description: string;
  updated_at: string;
}

const SiteSettings = () => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/settings/admin/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch settings');

      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setMessage({ type: 'error', text: 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (key: string, currentValue: string) => {
    try {
      setSaving(true);
      const newValue = currentValue === 'true' ? false : true;
      
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/settings/${key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ value: newValue })
      });

      if (!response.ok) throw new Error('Failed to update setting');

      // Update local state
      setSettings(settings.map(s => 
        s.setting_key === key 
          ? { ...s, setting_value: newValue ? 'true' : 'false' }
          : s
      ));

      setMessage({ type: 'success', text: 'Setting updated successfully' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error updating setting:', error);
      setMessage({ type: 'error', text: 'Failed to update setting' });
    } finally {
      setSaving(false);
    }
  };

  const getSettingLabel = (key: string): string => {
    const labels: { [key: string]: string } = {
      'show_unit_prices': 'Show Unit Prices',
      'show_contact_info': 'Show Contact Information',
      'maintenance_mode': 'Maintenance Mode'
    };
    return labels[key] || key;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Site Settings</h2>
          <p className="text-gray-600 mt-1">Manage global website settings</p>
        </div>
        <Button
          onClick={fetchSettings}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Display Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {settings.map((setting) => (
              <div
                key={setting.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <Label
                    htmlFor={setting.setting_key}
                    className="text-base font-medium text-gray-900 cursor-pointer"
                  >
                    {getSettingLabel(setting.setting_key)}
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">
                    {setting.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Last updated: {new Date(setting.updated_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Switch
                    id={setting.setting_key}
                    checked={setting.setting_value === 'true'}
                    onCheckedChange={() => handleToggle(setting.setting_key, setting.setting_value)}
                    disabled={saving}
                    className="data-[state=checked]:bg-primary"
                  />
                  <span className={`text-sm font-medium ${
                    setting.setting_value === 'true' ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {setting.setting_value === 'true' ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">About Settings</h4>
              <p className="text-sm text-blue-800">
                These settings control what information is displayed on the public website. 
                Changes take effect immediately after toggling.
              </p>
              <ul className="mt-2 text-sm text-blue-800 space-y-1">
                <li>• <strong>Show Unit Prices:</strong> Controls whether prices are visible on unit listings and details pages</li>
                <li>• <strong>Show Contact Info:</strong> Controls visibility of contact information throughout the site</li>
                <li>• <strong>Maintenance Mode:</strong> Displays a maintenance message to visitors</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteSettings;
