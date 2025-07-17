import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Users, Shield, AlertTriangle, Plus, Eye, Download, CheckCircle } from 'lucide-react';

interface Will {
  id: string;
  title: string;
  createdDate: string;
  lastUpdated: string;
  status: 'draft' | 'completed' | 'notarized';
  executor: string;
  beneficiaries: string[];
  assets: Asset[];
}

interface Asset {
  id: string;
  type: 'property' | 'bank' | 'investment' | 'insurance' | 'jewelry' | 'other';
  name: string;
  description: string;
  estimatedValue: number;
  beneficiary: string;
  share: number;
}

interface Beneficiary {
  id: string;
  name: string;
  relationship: string;
  address: string;
  phone: string;
  email: string;
}

export const EstatePlanning = () => {
  const [wills, setWills] = useState<Will[]>([
    {
      id: '1',
      title: 'Primary Will',
      createdDate: '2024-01-15',
      lastUpdated: '2024-01-20',
      status: 'draft',
      executor: 'John Smith',
      beneficiaries: ['Spouse', 'Child 1', 'Child 2'],
      assets: [
        {
          id: '1',
          type: 'property',
          name: 'Primary Residence',
          description: '3BHK Apartment in Mumbai',
          estimatedValue: 15000000,
          beneficiary: 'Spouse',
          share: 100
        },
        {
          id: '2',
          type: 'bank',
          name: 'HDFC Savings Account',
          description: 'Primary savings account',
          estimatedValue: 2500000,
          beneficiary: 'Spouse',
          share: 60
        }
      ]
    }
  ]);

  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([
    {
      id: '1',
      name: 'Jane Doe',
      relationship: 'Spouse',
      address: '123 Main Street, Mumbai',
      phone: '+91 9876543210',
      email: 'jane@example.com'
    },
    {
      id: '2',
      name: 'Alex Doe',
      relationship: 'Child',
      address: '123 Main Street, Mumbai',
      phone: '+91 9876543211',
      email: 'alex@example.com'
    }
  ]);

  const [showAddWillDialog, setShowAddWillDialog] = useState(false);
  const [showAddBeneficiaryDialog, setShowAddBeneficiaryDialog] = useState(false);
  const [showAddAssetDialog, setShowAddAssetDialog] = useState(false);
  const [selectedWill, setSelectedWill] = useState<Will | null>(null);

  const [newWill, setNewWill] = useState({
    title: '',
    executor: ''
  });

  const [newBeneficiary, setNewBeneficiary] = useState({
    name: '',
    relationship: '',
    address: '',
    phone: '',
    email: ''
  });

  const [newAsset, setNewAsset] = useState({
    type: 'property' as const,
    name: '',
    description: '',
    estimatedValue: '',
    beneficiary: '',
    share: ''
  });

  const getStatusColor = (status: Will['status']) => {
    switch (status) {
      case 'draft': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      case 'notarized': return 'bg-green-500';
    }
  };

  const getAssetIcon = (type: Asset['type']) => {
    switch (type) {
      case 'property': return '🏠';
      case 'bank': return '🏦';
      case 'investment': return '📈';
      case 'insurance': return '🛡️';
      case 'jewelry': return '💎';
      case 'other': return '📄';
    }
  };

  const totalEstateValue = wills.reduce((total, will) => 
    total + will.assets.reduce((assetTotal, asset) => assetTotal + asset.estimatedValue, 0), 0
  );

  const completionPercentage = (wills.filter(w => w.status === 'notarized').length / Math.max(wills.length, 1)) * 100;

  const handleAddWill = () => {
    const will: Will = {
      id: Date.now().toString(),
      title: newWill.title,
      createdDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      status: 'draft',
      executor: newWill.executor,
      beneficiaries: [],
      assets: []
    };
    
    setWills([...wills, will]);
    setShowAddWillDialog(false);
    setNewWill({ title: '', executor: '' });
  };

  const handleAddBeneficiary = () => {
    const beneficiary: Beneficiary = {
      id: Date.now().toString(),
      ...newBeneficiary
    };
    
    setBeneficiaries([...beneficiaries, beneficiary]);
    setShowAddBeneficiaryDialog(false);
    setNewBeneficiary({
      name: '',
      relationship: '',
      address: '',
      phone: '',
      email: ''
    });
  };

  const handleAddAsset = () => {
    if (!selectedWill) return;
    
    const asset: Asset = {
      id: Date.now().toString(),
      type: newAsset.type,
      name: newAsset.name,
      description: newAsset.description,
      estimatedValue: parseFloat(newAsset.estimatedValue),
      beneficiary: newAsset.beneficiary,
      share: parseFloat(newAsset.share)
    };
    
    const updatedWills = wills.map(will => 
      will.id === selectedWill.id 
        ? { ...will, assets: [...will.assets, asset] }
        : will
    );
    
    setWills(updatedWills);
    setShowAddAssetDialog(false);
    setNewAsset({
      type: 'property',
      name: '',
      description: '',
      estimatedValue: '',
      beneficiary: '',
      share: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Estate Planning
          </h1>
          <p className="text-muted-foreground">
            Manage your will, beneficiaries, and inheritance planning
          </p>
        </div>
        <div className="space-x-2">
          <Dialog open={showAddWillDialog} onOpenChange={setShowAddWillDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Will
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Will</DialogTitle>
                <DialogDescription>
                  Start creating your will document
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Will Title</Label>
                  <Input
                    id="title"
                    value={newWill.title}
                    onChange={(e) => setNewWill({...newWill, title: e.target.value})}
                    placeholder="e.g., Primary Will, Business Will"
                  />
                </div>
                <div>
                  <Label htmlFor="executor">Executor Name</Label>
                  <Input
                    id="executor"
                    value={newWill.executor}
                    onChange={(e) => setNewWill({...newWill, executor: e.target.value})}
                    placeholder="Person who will execute the will"
                  />
                </div>
                <Button onClick={handleAddWill} className="w-full">
                  Create Will
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showAddBeneficiaryDialog} onOpenChange={setShowAddBeneficiaryDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Beneficiary
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Beneficiary</DialogTitle>
                <DialogDescription>
                  Add a person who will inherit your assets
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="beneficiaryName">Full Name</Label>
                  <Input
                    id="beneficiaryName"
                    value={newBeneficiary.name}
                    onChange={(e) => setNewBeneficiary({...newBeneficiary, name: e.target.value})}
                    placeholder="Beneficiary's full name"
                  />
                </div>
                <div>
                  <Label htmlFor="relationship">Relationship</Label>
                  <Input
                    id="relationship"
                    value={newBeneficiary.relationship}
                    onChange={(e) => setNewBeneficiary({...newBeneficiary, relationship: e.target.value})}
                    placeholder="e.g., Spouse, Child, Parent"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={newBeneficiary.address}
                    onChange={(e) => setNewBeneficiary({...newBeneficiary, address: e.target.value})}
                    placeholder="Complete address"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={newBeneficiary.phone}
                    onChange={(e) => setNewBeneficiary({...newBeneficiary, phone: e.target.value})}
                    placeholder="+91 9876543210"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newBeneficiary.email}
                    onChange={(e) => setNewBeneficiary({...newBeneficiary, email: e.target.value})}
                    placeholder="email@example.com"
                  />
                </div>
                <Button onClick={handleAddBeneficiary} className="w-full">
                  Add Beneficiary
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Estate Value</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(totalEstateValue / 10000000).toFixed(1)}Cr</div>
            <p className="text-xs text-muted-foreground">
              Across all assets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Wills</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wills.length}</div>
            <p className="text-xs text-muted-foreground">
              Total will documents
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Beneficiaries</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{beneficiaries.length}</div>
            <p className="text-xs text-muted-foreground">
              Registered beneficiaries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionPercentage.toFixed(0)}%</div>
            <Progress value={completionPercentage} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="wills" className="space-y-4">
        <TabsList>
          <TabsTrigger value="wills">Wills</TabsTrigger>
          <TabsTrigger value="beneficiaries">Beneficiaries</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="wills" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wills.map((will) => (
              <Card key={will.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{will.title}</CardTitle>
                    <Badge className={getStatusColor(will.status)}>
                      {will.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    Executor: {will.executor}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Created</p>
                      <p className="text-sm font-medium">{new Date(will.createdDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Last Updated</p>
                      <p className="text-sm font-medium">{new Date(will.lastUpdated).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Assets</p>
                    <p className="text-lg font-semibold">
                      ₹{(will.assets.reduce((sum, asset) => sum + asset.estimatedValue, 0) / 100000).toFixed(1)}L
                    </p>
                    <p className="text-xs text-muted-foreground">{will.assets.length} items</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Beneficiaries</p>
                    <div className="flex flex-wrap gap-1">
                      {will.beneficiaries.map((beneficiary, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {beneficiary}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedWill(will);
                        setShowAddAssetDialog(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Asset
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="beneficiaries" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {beneficiaries.map((beneficiary) => (
              <Card key={beneficiary.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{beneficiary.name}</CardTitle>
                  <CardDescription>{beneficiary.relationship}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="text-sm">{beneficiary.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contact</p>
                    <p className="text-sm">{beneficiary.phone}</p>
                    <p className="text-sm">{beneficiary.email}</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Edit Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="assets" className="space-y-4">
          {wills.map((will) => (
            <Card key={will.id}>
              <CardHeader>
                <CardTitle>{will.title} - Assets</CardTitle>
                <CardDescription>
                  Total Value: ₹{(will.assets.reduce((sum, asset) => sum + asset.estimatedValue, 0) / 100000).toFixed(1)}L
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {will.assets.map((asset) => (
                    <div key={asset.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getAssetIcon(asset.type)}</span>
                        <div>
                          <p className="font-medium">{asset.name}</p>
                          <p className="text-sm text-muted-foreground">{asset.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {asset.share}% to {asset.beneficiary}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{(asset.estimatedValue / 100000).toFixed(1)}L</p>
                        <Badge variant="outline" className="text-xs">
                          {asset.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Simple Will', description: 'Basic will template for individuals', complexity: 'Beginner' },
              { name: 'Family Will', description: 'Comprehensive family estate planning', complexity: 'Intermediate' },
              { name: 'Business Will', description: 'Will template for business owners', complexity: 'Advanced' },
              { name: 'Trust Will', description: 'Will with trust establishment', complexity: 'Advanced' }
            ].map((template, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Badge variant="outline">{template.complexity}</Badge>
                  <Button className="w-full">
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Asset Dialog */}
      <Dialog open={showAddAssetDialog} onOpenChange={setShowAddAssetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Asset</DialogTitle>
            <DialogDescription>
              Add an asset to {selectedWill?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="assetType">Asset Type</Label>
              <Select value={newAsset.type} onValueChange={(value: any) => setNewAsset({...newAsset, type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="property">Property</SelectItem>
                  <SelectItem value="bank">Bank Account</SelectItem>
                  <SelectItem value="investment">Investment</SelectItem>
                  <SelectItem value="insurance">Insurance</SelectItem>
                  <SelectItem value="jewelry">Jewelry</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="assetName">Asset Name</Label>
              <Input
                id="assetName"
                value={newAsset.name}
                onChange={(e) => setNewAsset({...newAsset, name: e.target.value})}
                placeholder="Name of the asset"
              />
            </div>
            <div>
              <Label htmlFor="assetDescription">Description</Label>
              <Textarea
                id="assetDescription"
                value={newAsset.description}
                onChange={(e) => setNewAsset({...newAsset, description: e.target.value})}
                placeholder="Detailed description"
              />
            </div>
            <div>
              <Label htmlFor="assetValue">Estimated Value (₹)</Label>
              <Input
                id="assetValue"
                type="number"
                value={newAsset.estimatedValue}
                onChange={(e) => setNewAsset({...newAsset, estimatedValue: e.target.value})}
                placeholder="Current market value"
              />
            </div>
            <div>
              <Label htmlFor="assetBeneficiary">Beneficiary</Label>
              <Input
                id="assetBeneficiary"
                value={newAsset.beneficiary}
                onChange={(e) => setNewAsset({...newAsset, beneficiary: e.target.value})}
                placeholder="Who will inherit this asset"
              />
            </div>
            <div>
              <Label htmlFor="assetShare">Share (%)</Label>
              <Input
                id="assetShare"
                type="number"
                value={newAsset.share}
                onChange={(e) => setNewAsset({...newAsset, share: e.target.value})}
                placeholder="Percentage share"
              />
            </div>
            <Button onClick={handleAddAsset} className="w-full">
              Add Asset
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};