'use client'
import { useState } from 'react'
import { 
  Bell, 
  Shield, 
  CreditCard, 
  Globe, 
  Eye,
  Trash2,
  Download,
  UserX,
  Mail,
  Smartphone,
  Key,
  Database,
  Palette,
  Clock
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account')
  const [settings, setSettings] = useState({
    // Account Settings
    emailNotifications: true,
    marketingEmails: false,
    orderUpdates: true,
    priceAlerts: true,
    pushNotifications: true,
    
    // Privacy Settings
    profileVisibility: 'public',
    showOnlineStatus: true,
    allowTagging: false,
    dataSharing: true,
    
    // Security Settings
    twoFactorAuth: false,
    loginAlerts: true,
    deviceManagement: true,
    sessionTimeout: 30,
    
    // Payment Settings
    savePaymentMethods: true,
    autoRenewSubscriptions: false,
    defaultCurrency: 'KES',
    
    // Display Settings
    theme: 'system',
    language: 'en',
    timezone: 'Africa/Nairobi',
    dateFormat: 'DD/MM/YYYY',
    
    // Data Settings
    downloadData: false,
    autoDeleteData: false,
    deleteAfterMonths: 12,
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleDownloadData = () => {
    // Simulate data download
    console.log('Downloading user data...')
  }

  const handleDeleteAccount = () => {
    // Handle account deletion
    console.log('Deleting account...')
  }

  const securityLogs = [
    { id: 1, device: 'Chrome on Windows', location: 'Nairobi, Kenya', time: 'Today, 10:30 AM', ip: '192.168.1.1' },
    { id: 2, device: 'Safari on iPhone', location: 'Nairobi, Kenya', time: 'Yesterday, 2:15 PM', ip: '192.168.1.2' },
    { id: 3, device: 'Firefox on Mac', location: 'Mombasa, Kenya', time: 'Jan 12, 9:45 AM', ip: '192.168.1.3' },
  ]

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-600">Manage your account preferences and security</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        {/* Tab Navigation */}
        <TabsList className="grid grid-cols-2 md:grid-cols-6">
          <TabsTrigger value="account">
            <Bell className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="privacy">
            <Eye className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Privacy</span>
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="payment">
            <CreditCard className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Payment</span>
          </TabsTrigger>
          <TabsTrigger value="display">
            <Palette className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Display</span>
          </TabsTrigger>
          <TabsTrigger value="data">
            <Database className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Data</span>
          </TabsTrigger>
        </TabsList>

        {/* Notification Settings */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified about your account activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing-emails">Marketing Emails</Label>
                    <p className="text-sm text-gray-500">Receive promotional emails and offers</p>
                  </div>
                  <Switch
                    id="marketing-emails"
                    checked={settings.marketingEmails}
                    onCheckedChange={(checked) => handleSettingChange('marketingEmails', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="order-updates">Order Updates</Label>
                    <p className="text-sm text-gray-500">Get notified about order status changes</p>
                  </div>
                  <Switch
                    id="order-updates"
                    checked={settings.orderUpdates}
                    onCheckedChange={(checked) => handleSettingChange('orderUpdates', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="price-alerts">Price Drop Alerts</Label>
                    <p className="text-sm text-gray-500">Get notified when watched items go on sale</p>
                  </div>
                  <Switch
                    id="price-alerts"
                    checked={settings.priceAlerts}
                    onCheckedChange={(checked) => handleSettingChange('priceAlerts', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-gray-500">Receive push notifications on your device</p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email Preferences</CardTitle>
              <CardDescription>Manage your email subscription preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Newsletter</p>
                    <p className="text-sm text-gray-600">Weekly updates and featured products</p>
                  </div>
                  <Badge variant="outline">Subscribed</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Product Recommendations</p>
                    <p className="text-sm text-gray-600">Personalized product suggestions</p>
                  </div>
                  <Badge variant="outline">Subscribed</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Seller Updates</p>
                    <p className="text-sm text-gray-600">Updates from sellers you follow</p>
                  </div>
                  <Badge variant="secondary">Unsubscribed</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Control your privacy and data sharing preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="profile-visibility">Profile Visibility</Label>
                  <Select 
                    value={settings.profileVisibility} 
                    onValueChange={(value) => handleSettingChange('profileVisibility', value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - Anyone can see your profile</SelectItem>
                      <SelectItem value="friends">Friends Only - Only your connections can see</SelectItem>
                      <SelectItem value="private">Private - Only you can see your profile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="show-online">Show Online Status</Label>
                    <p className="text-sm text-gray-500">Let others see when you're online</p>
                  </div>
                  <Switch
                    id="show-online"
                    checked={settings.showOnlineStatus}
                    onCheckedChange={(checked) => handleSettingChange('showOnlineStatus', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allow-tagging">Allow Tagging</Label>
                    <p className="text-sm text-gray-500">Allow others to tag you in posts and reviews</p>
                  </div>
                  <Switch
                    id="allow-tagging"
                    checked={settings.allowTagging}
                    onCheckedChange={(checked) => handleSettingChange('allowTagging', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="data-sharing">Data Sharing for Analytics</Label>
                    <p className="text-sm text-gray-500">Share anonymous data to improve our services</p>
                  </div>
                  <Switch
                    id="data-sharing"
                    checked={settings.dataSharing}
                    onCheckedChange={(checked) => handleSettingChange('dataSharing', checked)}
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Eye className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Privacy Tips</h4>
                    <ul className="mt-2 text-sm text-blue-800 space-y-1">
                      <li>• Regularly review your privacy settings</li>
                      <li>• Be cautious about sharing personal information</li>
                      <li>• Use strong, unique passwords</li>
                      <li>• Enable two-factor authentication for extra security</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Connected Accounts</CardTitle>
              <CardDescription>Manage accounts connected to SOKO</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Google</p>
                      <p className="text-sm text-gray-600">Connected for authentication</p>
                    </div>
                  </div>
                  <Badge variant="outline">Connected</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-black rounded-lg">
                      <Smartphone className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Apple</p>
                      <p className="text-sm text-gray-600">Not connected</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security and access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {settings.twoFactorAuth ? (
                      <Badge className="bg-green-500">Enabled</Badge>
                    ) : (
                      <Badge variant="outline">Disabled</Badge>
                    )}
                    <Switch
                      id="two-factor"
                      checked={settings.twoFactorAuth}
                      onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="login-alerts">Login Alerts</Label>
                    <p className="text-sm text-gray-500">Get notified of new logins to your account</p>
                  </div>
                  <Switch
                    id="login-alerts"
                    checked={settings.loginAlerts}
                    onCheckedChange={(checked) => handleSettingChange('loginAlerts', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="device-management">Device Management</Label>
                    <p className="text-sm text-gray-500">Review and manage devices signed into your account</p>
                  </div>
                  <Switch
                    id="device-management"
                    checked={settings.deviceManagement}
                    onCheckedChange={(checked) => handleSettingChange('deviceManagement', checked)}
                  />
                </div>

                <Separator />

                <div>
                  <Label htmlFor="session-timeout">Session Timeout</Label>
                  <Select 
                    value={settings.sessionTimeout.toString()} 
                    onValueChange={(value) => handleSettingChange('sessionTimeout', parseInt(value))}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select timeout duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="0">Never (not recommended)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Change Password */}
              <div className="pt-6 border-t">
                <h3 className="font-semibold mb-4">Change Password</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" className="mt-2" />
                  </div>
                  <Button>
                    <Key className="h-4 w-4 mr-2" />
                    Update Password
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Logs */}
          <Card>
            <CardHeader>
              <CardTitle>Security Logs</CardTitle>
              <CardDescription>Recent login activity on your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{log.device}</p>
                        {log.id === 1 && (
                          <Badge className="bg-green-500">Current</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{log.location}</p>
                      <p className="text-sm text-gray-500">{log.time} • IP: {log.ip}</p>
                    </div>
                    {log.id !== 1 && (
                      <Button variant="ghost" size="sm">Revoke</Button>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline">View All Activity</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>Manage your payment preferences and methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="save-payments">Save Payment Methods</Label>
                    <p className="text-sm text-gray-500">Store payment methods for faster checkout</p>
                  </div>
                  <Switch
                    id="save-payments"
                    checked={settings.savePaymentMethods}
                    onCheckedChange={(checked) => handleSettingChange('savePaymentMethods', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-renew">Auto-Renew Subscriptions</Label>
                    <p className="text-sm text-gray-500">Automatically renew subscription services</p>
                  </div>
                  <Switch
                    id="auto-renew"
                    checked={settings.autoRenewSubscriptions}
                    onCheckedChange={(checked) => handleSettingChange('autoRenewSubscriptions', checked)}
                  />
                </div>

                <Separator />

                <div>
                  <Label htmlFor="default-currency">Default Currency</Label>
                  <Select 
                    value={settings.defaultCurrency} 
                    onValueChange={(value) => handleSettingChange('defaultCurrency', value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KES">Kenyan Shilling (KES)</SelectItem>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="pt-6 border-t">
                <h3 className="font-semibold mb-4">Saved Payment Methods</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Visa ending in 4242</p>
                        <p className="text-sm text-gray-600">Expires 12/25</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500">Default</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <CreditCard className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">Mastercard ending in 8888</p>
                        <p className="text-sm text-gray-600">Expires 08/24</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Set as Default</Button>
                  </div>
                  <Button variant="outline" className="w-full">
                    Add Payment Method
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Billing History */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Billing History</CardTitle>
                  <CardDescription>Your recent transactions and invoices</CardDescription>
                </div>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Order #ORD-78945</p>
                    <p className="text-sm text-gray-600">January 15, 2024</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">$249.99</p>
                    <Badge variant="outline" className="mt-1">Paid</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Order #ORD-78946</p>
                    <p className="text-sm text-gray-600">January 10, 2024</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">$89.99</p>
                    <Badge variant="outline" className="mt-1">Paid</Badge>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <Button variant="ghost">View All Transactions</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Display Settings */}
        <TabsContent value="display" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
              <CardDescription>Customize how SOKO looks and feels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <Select 
                    value={settings.theme} 
                    onValueChange={(value) => handleSettingChange('theme', value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System Default</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select 
                    value={settings.language} 
                    onValueChange={(value) => handleSettingChange('language', value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="sw">Swahili</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select 
                    value={settings.timezone} 
                    onValueChange={(value) => handleSettingChange('timezone', value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Nairobi">Africa/Nairobi (EAT)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">America/New York (EST)</SelectItem>
                      <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div>
                  <Label htmlFor="date-format">Date Format</Label>
                  <Select 
                    value={settings.dateFormat} 
                    onValueChange={(value) => handleSettingChange('dateFormat', value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Display Preview */}
              <div className="pt-6 border-t">
                <h3 className="font-semibold mb-4">Preview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4 text-center">
                    <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Palette className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="font-medium">Theme</p>
                    <p className="text-sm text-gray-600 capitalize">{settings.theme}</p>
                  </div>
                  <div className="border rounded-lg p-4 text-center">
                    <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Globe className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="font-medium">Language</p>
                    <p className="text-sm text-gray-600">
                      {settings.language === 'en' ? 'English' : 
                       settings.language === 'sw' ? 'Swahili' : 'French'}
                    </p>
                  </div>
                  <div className="border rounded-lg p-4 text-center">
                    <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Clock className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="font-medium">Timezone</p>
                    <p className="text-sm text-gray-600">{settings.timezone.split('/')[1]}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Accessibility */}
          <Card>
            <CardHeader>
              <CardTitle>Accessibility</CardTitle>
              <CardDescription>Make SOKO easier to use</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="high-contrast">High Contrast Mode</Label>
                    <p className="text-sm text-gray-500">Increase color contrast for better visibility</p>
                  </div>
                  <Switch id="high-contrast" checked={false} onCheckedChange={function (checked: boolean): void {
                                      throw new Error('Function not implemented.')
                                  } } />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="reduce-motion">Reduce Motion</Label>
                    <p className="text-sm text-gray-500">Minimize animations and transitions</p>
                  </div>
                  <Switch id="reduce-motion" checked={false} onCheckedChange={function (checked: boolean): void {
                                      throw new Error('Function not implemented.')
                                  } } />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="larger-text">Larger Text</Label>
                    <p className="text-sm text-gray-500">Increase font size across the platform</p>
                  </div>
                  <Switch id="larger-text" checked={false} onCheckedChange={function (checked: boolean): void {
                                      throw new Error('Function not implemented.')
                                  } } />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Settings */}
        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Control your data and privacy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="download-data">Request Data Download</Label>
                    <p className="text-sm text-gray-500">Download a copy of your personal data</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {settings.downloadData ? (
                      <Badge className="bg-blue-500">Processing</Badge>
                    ) : (
                      <Button variant="outline" onClick={handleDownloadData}>
                        <Download className="h-4 w-4 mr-2" />
                        Request
                      </Button>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-delete">Auto-Delete Data</Label>
                    <p className="text-sm text-gray-500">Automatically delete old data after period</p>
                  </div>
                  <Switch
                    id="auto-delete"
                    checked={settings.autoDeleteData}
                    onCheckedChange={(checked) => handleSettingChange('autoDeleteData', checked)}
                  />
                </div>

                {settings.autoDeleteData && (
                  <>
                    <Separator />
                    <div>
                      <Label htmlFor="delete-after">Delete Data After</Label>
                      <Select 
                        value={settings.deleteAfterMonths.toString()} 
                        onValueChange={(value) => handleSettingChange('deleteAfterMonths', parseInt(value))}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 months</SelectItem>
                          <SelectItem value="6">6 months</SelectItem>
                          <SelectItem value="12">12 months</SelectItem>
                          <SelectItem value="24">24 months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>

              {/* Data Statistics */}
              <div className="pt-6 border-t">
                <h3 className="font-semibold mb-4">Your Data</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-gray-600">Orders</p>
                    <p className="text-2xl font-bold">24</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-gray-600">Reviews</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-gray-600">Messages</p>
                    <p className="text-2xl font-bold">48</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Deletion */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-700">Account Deletion</CardTitle>
              <CardDescription>Permanently delete your account and all associated data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Trash2 className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-900">Warning</h4>
                      <p className="text-sm text-red-800 mt-1">
                        This action cannot be undone. All your data including orders, reviews, 
                        messages, and account information will be permanently deleted.
                      </p>
                    </div>
                  </div>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <UserX className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Account</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete your account? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="confirm-delete" className="h-4 w-4" />
                        <Label htmlFor="confirm-delete" className="text-sm">
                          I understand this will permanently delete all my data
                        </Label>
                      </div>
                      <Input placeholder="Type 'DELETE' to confirm" />
                    </div>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button variant="destructive" onClick={handleDeleteAccount}>
                        Delete Account
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Changes Button */}
      <div className="fixed bottom-6 right-6">
        <Button size="lg" className="shadow-lg">
          Save Changes
        </Button>
      </div>
    </div>
  )
}

// Switch component for settings
function Switch({ id, checked, onCheckedChange }: { id: string, checked: boolean, onCheckedChange: (checked: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      id={id}
      onClick={() => onCheckedChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-primary' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}