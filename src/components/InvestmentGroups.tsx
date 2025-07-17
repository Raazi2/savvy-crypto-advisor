import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, TrendingUp, MessageSquare, Plus, Crown, Star, Award } from 'lucide-react';

interface InvestmentGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  totalPortfolioValue: number;
  performance: number;
  category: 'stocks' | 'crypto' | 'mutual-funds' | 'mixed';
  privacy: 'public' | 'private';
  createdBy: string;
  joinedDate: string;
  role: 'admin' | 'member';
}

interface GroupMember {
  id: string;
  name: string;
  portfolioValue: number;
  performance: number;
  joinDate: string;
  role: 'admin' | 'member';
  level: number;
}

export const InvestmentGroups = () => {
  const [groups, setGroups] = useState<InvestmentGroup[]>([
    {
      id: '1',
      name: 'Tech Stock Enthusiasts',
      description: 'Group focused on technology sector investments and discussions',
      memberCount: 156,
      totalPortfolioValue: 45000000,
      performance: 12.5,
      category: 'stocks',
      privacy: 'public',
      createdBy: 'John Trader',
      joinedDate: '2024-01-15',
      role: 'member'
    },
    {
      id: '2',
      name: 'Crypto Pioneers',
      description: 'Early adopters sharing crypto investment strategies',
      memberCount: 89,
      totalPortfolioValue: 25000000,
      performance: 8.3,
      category: 'crypto',
      privacy: 'public',
      createdBy: 'Sarah Crypto',
      joinedDate: '2024-02-01',
      role: 'admin'
    }
  ]);

  const [members] = useState<GroupMember[]>([
    {
      id: '1',
      name: 'John Trader',
      portfolioValue: 2500000,
      performance: 15.2,
      joinDate: '2024-01-10',
      role: 'admin',
      level: 8
    },
    {
      id: '2',
      name: 'Sarah Investor',
      portfolioValue: 1800000,
      performance: 11.7,
      joinDate: '2024-01-15',
      role: 'member',
      level: 6
    },
    {
      id: '3',
      name: 'Mike Analyst',
      portfolioValue: 3200000,
      performance: 9.4,
      joinDate: '2024-01-20',
      role: 'member',
      level: 7
    }
  ]);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    category: 'stocks' as const,
    privacy: 'public' as const
  });

  const getCategoryColor = (category: InvestmentGroup['category']) => {
    switch (category) {
      case 'stocks': return 'bg-blue-500';
      case 'crypto': return 'bg-orange-500';
      case 'mutual-funds': return 'bg-green-500';
      case 'mixed': return 'bg-purple-500';
    }
  };

  const getPerformanceColor = (performance: number) => {
    return performance >= 0 ? 'text-green-500' : 'text-red-500';
  };

  const getRoleIcon = (role: string) => {
    return role === 'admin' ? <Crown className="h-4 w-4 text-yellow-500" /> : <Star className="h-4 w-4 text-blue-500" />;
  };

  const handleCreateGroup = () => {
    const group: InvestmentGroup = {
      id: Date.now().toString(),
      name: newGroup.name,
      description: newGroup.description,
      memberCount: 1,
      totalPortfolioValue: 0,
      performance: 0,
      category: newGroup.category,
      privacy: newGroup.privacy,
      createdBy: 'You',
      joinedDate: new Date().toISOString().split('T')[0],
      role: 'admin'
    };
    
    setGroups([...groups, group]);
    setShowCreateDialog(false);
    setNewGroup({
      name: '',
      description: '',
      category: 'stocks',
      privacy: 'public'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Investment Groups
          </h1>
          <p className="text-muted-foreground">
            Join communities, share strategies, and learn from fellow investors
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Investment Group</DialogTitle>
              <DialogDescription>
                Start a new investment community focused on your interests
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="groupName">Group Name</Label>
                <Input
                  id="groupName"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                  placeholder="e.g., Value Investors Club"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                  placeholder="Describe the group's focus and goals"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={newGroup.category}
                  onChange={(e) => setNewGroup({...newGroup, category: e.target.value as any})}
                >
                  <option value="stocks">Stocks</option>
                  <option value="crypto">Cryptocurrency</option>
                  <option value="mutual-funds">Mutual Funds</option>
                  <option value="mixed">Mixed Investments</option>
                </select>
              </div>
              <div>
                <Label htmlFor="privacy">Privacy</Label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={newGroup.privacy}
                  onChange={(e) => setNewGroup({...newGroup, privacy: e.target.value as any})}
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
              <Button onClick={handleCreateGroup} className="w-full">
                Create Group
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Groups</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{groups.length}</div>
            <p className="text-xs text-muted-foreground">
              Groups joined
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{groups.reduce((sum, group) => sum + group.memberCount, 0)}</div>
            <p className="text-xs text-muted-foreground">
              Across all groups
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              +{(groups.reduce((sum, group) => sum + group.performance, 0) / groups.length).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Groups</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{groups.filter(g => g.role === 'admin').length}</div>
            <p className="text-xs text-muted-foreground">
              Groups you manage
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="my-groups" className="space-y-4">
        <TabsList>
          <TabsTrigger value="my-groups">My Groups</TabsTrigger>
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="my-groups" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groups.map((group) => (
              <Card key={group.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                      {getRoleIcon(group.role)}
                    </div>
                    <div className="flex space-x-2">
                      <Badge className={getCategoryColor(group.category)}>
                        {group.category}
                      </Badge>
                      <Badge variant="outline">
                        {group.privacy}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>{group.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Members</p>
                      <p className="text-lg font-semibold">{group.memberCount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Portfolio</p>
                      <p className="text-lg font-semibold">₹{(group.totalPortfolioValue / 10000000).toFixed(1)}Cr</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Performance</p>
                      <p className={`text-lg font-semibold ${getPerformanceColor(group.performance)}`}>
                        {group.performance >= 0 ? '+' : ''}{group.performance}%
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Joined: {new Date(group.joinedDate).toLocaleDateString()}</p>
                    <p className="text-sm text-muted-foreground">Created by: {group.createdBy}</p>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Discussions
                    </Button>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    {group.role === 'admin' && (
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="discover" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'ESG Investors', members: 234, performance: 7.8, category: 'stocks' as const },
              { name: 'DeFi Explorers', members: 167, performance: 15.2, category: 'crypto' as const },
              { name: 'Dividend Hunters', members: 312, performance: 5.4, category: 'stocks' as const },
              { name: 'SIP Champions', members: 445, performance: 9.1, category: 'mutual-funds' as const },
              { name: 'Growth Stocks Club', members: 189, performance: 13.6, category: 'stocks' as const },
              { name: 'Options Traders', members: 98, performance: 18.9, category: 'mixed' as const }
            ].map((group, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    <Badge className={getCategoryColor(group.category)}>
                      {group.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Members</p>
                      <p className="text-lg font-semibold">{group.members}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Performance</p>
                      <p className={`text-lg font-semibold ${getPerformanceColor(group.performance)}`}>
                        +{group.performance}%
                      </p>
                    </div>
                  </div>
                  <Button className="w-full">
                    Join Group
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Group Performance Leaderboard</CardTitle>
              <CardDescription>Top performing members across all groups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {members
                  .sort((a, b) => b.performance - a.performance)
                  .map((member, index) => (
                    <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {index < 3 && (
                            <Award className={`h-5 w-5 ${
                              index === 0 ? 'text-yellow-500' : 
                              index === 1 ? 'text-gray-500' : 'text-orange-500'
                            }`} />
                          )}
                          <span className="font-semibold">#{index + 1}</span>
                        </div>
                        <Avatar>
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <div className="flex items-center space-x-2">
                            {getRoleIcon(member.role)}
                            <span className="text-sm text-muted-foreground">Level {member.level}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-semibold ${getPerformanceColor(member.performance)}`}>
                          +{member.performance}%
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ₹{(member.portfolioValue / 100000).toFixed(1)}L
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};