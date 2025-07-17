import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Heart, Activity, Users, Plus, Eye, AlertTriangle } from 'lucide-react';

interface Insurance {
  id: string;
  type: 'life' | 'health' | 'term';
  provider: string;
  policyNumber: string;
  coverageAmount: number;
  premium: number;
  frequency: 'monthly' | 'quarterly' | 'annually';
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'pending';
}

export const InsuranceDashboard = () => {
  const [insurances, setInsurances] = useState<Insurance[]>([
    {
      id: '1',
      type: 'life',
      provider: 'LIC India',
      policyNumber: 'LIC123456789',
      coverageAmount: 1000000,
      premium: 25000,
      frequency: 'annually',
      startDate: '2023-01-01',
      endDate: '2043-01-01',
      status: 'active'
    },
    {
      id: '2',
      type: 'health',
      provider: 'Star Health',
      policyNumber: 'SH987654321',
      coverageAmount: 500000,
      premium: 12000,
      frequency: 'annually',
      startDate: '2023-06-01',
      endDate: '2024-06-01',
      status: 'active'
    }
  ]);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newInsurance, setNewInsurance] = useState({
    type: 'life' as const,
    provider: '',
    policyNumber: '',
    coverageAmount: '',
    premium: '',
    frequency: 'annually' as const,
    startDate: '',
    endDate: ''
  });

  const getTypeIcon = (type: Insurance['type']) => {
    switch (type) {
      case 'life': return <Heart className="h-4 w-4" />;
      case 'health': return <Activity className="h-4 w-4" />;
      case 'term': return <Shield className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Insurance['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'expired': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
    }
  };

  const totalCoverage = insurances.reduce((sum, insurance) => sum + insurance.coverageAmount, 0);
  const totalPremiums = insurances.reduce((sum, insurance) => sum + insurance.premium, 0);

  const handleAddInsurance = () => {
    const insurance: Insurance = {
      id: Date.now().toString(),
      type: newInsurance.type,
      provider: newInsurance.provider,
      policyNumber: newInsurance.policyNumber,
      coverageAmount: parseFloat(newInsurance.coverageAmount),
      premium: parseFloat(newInsurance.premium),
      frequency: newInsurance.frequency,
      startDate: newInsurance.startDate,
      endDate: newInsurance.endDate,
      status: 'active'
    };
    
    setInsurances([...insurances, insurance]);
    setShowAddDialog(false);
    setNewInsurance({
      type: 'life',
      provider: '',
      policyNumber: '',
      coverageAmount: '',
      premium: '',
      frequency: 'annually',
      startDate: '',
      endDate: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Insurance Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track and manage your insurance policies
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Policy
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Insurance Policy</DialogTitle>
              <DialogDescription>
                Enter your policy details to track coverage and premiums
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="type">Insurance Type</Label>
                <Select value={newInsurance.type} onValueChange={(value: any) => setNewInsurance({...newInsurance, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="life">Life Insurance</SelectItem>
                    <SelectItem value="health">Health Insurance</SelectItem>
                    <SelectItem value="term">Term Insurance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="provider">Provider</Label>
                <Input
                  id="provider"
                  value={newInsurance.provider}
                  onChange={(e) => setNewInsurance({...newInsurance, provider: e.target.value})}
                  placeholder="Insurance company name"
                />
              </div>
              <div>
                <Label htmlFor="policyNumber">Policy Number</Label>
                <Input
                  id="policyNumber"
                  value={newInsurance.policyNumber}
                  onChange={(e) => setNewInsurance({...newInsurance, policyNumber: e.target.value})}
                  placeholder="Policy number"
                />
              </div>
              <div>
                <Label htmlFor="coverageAmount">Coverage Amount (₹)</Label>
                <Input
                  id="coverageAmount"
                  type="number"
                  value={newInsurance.coverageAmount}
                  onChange={(e) => setNewInsurance({...newInsurance, coverageAmount: e.target.value})}
                  placeholder="Coverage amount"
                />
              </div>
              <div>
                <Label htmlFor="premium">Premium (₹)</Label>
                <Input
                  id="premium"
                  type="number"
                  value={newInsurance.premium}
                  onChange={(e) => setNewInsurance({...newInsurance, premium: e.target.value})}
                  placeholder="Premium amount"
                />
              </div>
              <div>
                <Label htmlFor="frequency">Premium Frequency</Label>
                <Select value={newInsurance.frequency} onValueChange={(value: any) => setNewInsurance({...newInsurance, frequency: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newInsurance.startDate}
                    onChange={(e) => setNewInsurance({...newInsurance, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newInsurance.endDate}
                    onChange={(e) => setNewInsurance({...newInsurance, endDate: e.target.value})}
                  />
                </div>
              </div>
              <Button onClick={handleAddInsurance} className="w-full">
                Add Policy
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coverage</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(totalCoverage / 100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground">
              Across {insurances.length} policies
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Annual Premiums</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalPremiums.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total yearly cost
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insurances.filter(i => i.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Insurance Policies */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Policies</TabsTrigger>
          <TabsTrigger value="life">Life Insurance</TabsTrigger>
          <TabsTrigger value="health">Health Insurance</TabsTrigger>
          <TabsTrigger value="term">Term Insurance</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insurances.map((insurance) => (
              <Card key={insurance.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(insurance.type)}
                      <CardTitle className="text-lg">{insurance.provider}</CardTitle>
                    </div>
                    <Badge className={getStatusColor(insurance.status)}>
                      {insurance.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    Policy: {insurance.policyNumber}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Coverage</p>
                      <p className="text-lg font-semibold">₹{(insurance.coverageAmount / 100000).toFixed(1)}L</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Premium</p>
                      <p className="text-lg font-semibold">₹{insurance.premium.toLocaleString()}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Policy Term</p>
                    <p className="text-sm">
                      {new Date(insurance.startDate).toLocaleDateString()} - {new Date(insurance.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Claim
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {['life', 'health', 'term'].map((type) => (
          <TabsContent key={type} value={type} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insurances
                .filter((insurance) => insurance.type === type)
                .map((insurance) => (
                  <Card key={insurance.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(insurance.type)}
                          <CardTitle className="text-lg">{insurance.provider}</CardTitle>
                        </div>
                        <Badge className={getStatusColor(insurance.status)}>
                          {insurance.status}
                        </Badge>
                      </div>
                      <CardDescription>
                        Policy: {insurance.policyNumber}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Coverage</p>
                          <p className="text-lg font-semibold">₹{(insurance.coverageAmount / 100000).toFixed(1)}L</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Premium</p>
                          <p className="text-lg font-semibold">₹{insurance.premium.toLocaleString()}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Policy Term</p>
                        <p className="text-sm">
                          {new Date(insurance.startDate).toLocaleDateString()} - {new Date(insurance.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Claim
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};