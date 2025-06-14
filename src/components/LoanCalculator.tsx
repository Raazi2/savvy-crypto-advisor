
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, TrendingUp, PieChart, BarChart3, DollarSign, Calendar, Percent } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';

interface LoanCalculation {
  emi: number;
  totalPayment: number;
  totalInterest: number;
  monthlyBreakdown: Array<{
    month: number;
    principal: number;
    interest: number;
    balance: number;
    emi: number;
  }>;
}

const LoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);
  const [loanType, setLoanType] = useState("home");
  const [calculation, setCalculation] = useState<LoanCalculation | null>(null);
  const [compareLoans, setCompareLoans] = useState([
    { name: "Loan 1", amount: 500000, rate: 8.5, tenure: 20 },
    { name: "Loan 2", amount: 500000, rate: 9.0, tenure: 20 },
    { name: "Loan 3", amount: 500000, rate: 8.0, tenure: 25 },
  ]);

  const calculateEMI = (principal: number, rate: number, tenure: number): LoanCalculation => {
    const monthlyRate = rate / 12 / 100;
    const totalMonths = tenure * 12;
    
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                (Math.pow(1 + monthlyRate, totalMonths) - 1);
    
    const totalPayment = emi * totalMonths;
    const totalInterest = totalPayment - principal;
    
    // Calculate amortization schedule
    const monthlyBreakdown = [];
    let remainingBalance = principal;
    
    for (let month = 1; month <= totalMonths; month++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = emi - interestPayment;
      remainingBalance -= principalPayment;
      
      monthlyBreakdown.push({
        month,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, remainingBalance),
        emi
      });
    }
    
    return {
      emi,
      totalPayment,
      totalInterest,
      monthlyBreakdown
    };
  };

  useEffect(() => {
    const result = calculateEMI(loanAmount, interestRate, loanTenure);
    setCalculation(result);
  }, [loanAmount, interestRate, loanTenure]);

  const getLoanTypeDetails = (type: string) => {
    const details = {
      home: { name: "Home Loan", icon: "🏠", description: "Lowest interest rates, longest tenure" },
      car: { name: "Car Loan", icon: "🚗", description: "Quick approval, competitive rates" },
      personal: { name: "Personal Loan", icon: "💼", description: "No collateral, flexible usage" },
      education: { name: "Education Loan", icon: "🎓", description: "Study abroad friendly" }
    };
    return details[type as keyof typeof details] || details.home;
  };

  const comparisonData = compareLoans.map(loan => {
    const calc = calculateEMI(loan.amount, loan.rate, loan.tenure);
    return {
      name: loan.name,
      emi: Math.round(calc.emi),
      totalInterest: Math.round(calc.totalInterest),
      totalPayment: Math.round(calc.totalPayment)
    };
  });

  const pieChartData = calculation ? [
    { name: 'Principal', value: loanAmount, color: '#3b82f6' },
    { name: 'Interest', value: Math.round(calculation.totalInterest), color: '#ef4444' }
  ] : [];

  const amortizationChartData = calculation ? 
    calculation.monthlyBreakdown
      .filter((_, index) => index % 12 === 0) // Show yearly data
      .map(item => ({
        year: Math.ceil(item.month / 12),
        principal: Math.round(item.principal),
        interest: Math.round(item.interest),
        balance: Math.round(item.balance)
      })) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
          <Calculator className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Loan Calculator
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Calculate EMI, compare loans, and analyze payment schedules
          </p>
        </div>
      </div>

      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calculator">EMI Calculator</TabsTrigger>
          <TabsTrigger value="comparison">Compare Loans</TabsTrigger>
          <TabsTrigger value="amortization">Amortization</TabsTrigger>
          <TabsTrigger value="analysis">Rate Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span>Loan Details</span>
                </CardTitle>
                <CardDescription>Enter your loan requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="loanType">Loan Type</Label>
                  <Select value={loanType} onValueChange={setLoanType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home">🏠 Home Loan</SelectItem>
                      <SelectItem value="car">🚗 Car Loan</SelectItem>
                      <SelectItem value="personal">💼 Personal Loan</SelectItem>
                      <SelectItem value="education">🎓 Education Loan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="loanAmount">Loan Amount (₹)</Label>
                  <Input
                    id="loanAmount"
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    placeholder="Enter loan amount"
                  />
                </div>

                <div>
                  <Label htmlFor="interestRate">Interest Rate (% per annum)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    placeholder="Enter interest rate"
                  />
                </div>

                <div>
                  <Label htmlFor="loanTenure">Loan Tenure (years)</Label>
                  <Input
                    id="loanTenure"
                    type="number"
                    value={loanTenure}
                    onChange={(e) => setLoanTenure(Number(e.target.value))}
                    placeholder="Enter loan tenure"
                  />
                </div>

                <div className="pt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl">{getLoanTypeDetails(loanType).icon}</span>
                    <h3 className="font-semibold">{getLoanTypeDetails(loanType).name}</h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {getLoanTypeDetails(loanType).description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>EMI Calculation</span>
                </CardTitle>
                <CardDescription>Your monthly payment details</CardDescription>
              </CardHeader>
              <CardContent>
                {calculation && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-green-600 dark:text-green-400">Monthly EMI</span>
                          <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                          ₹{calculation.emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </p>
                      </div>

                      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-blue-600 dark:text-blue-400">Total Payment</span>
                          <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                          ₹{calculation.totalPayment.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </p>
                      </div>

                      <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950 dark:to-pink-950 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-red-600 dark:text-red-400">Total Interest</span>
                          <Percent className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </div>
                        <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                          ₹{calculation.totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </p>
                      </div>
                    </div>

                    {/* Pie Chart */}
                    <div className="h-64">
                      <h4 className="text-sm font-medium mb-2">Payment Breakdown</h4>
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            dataKey="value"
                          >
                            {pieChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`} />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Loan Comparison</span>
              </CardTitle>
              <CardDescription>Compare different loan options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {comparisonData.map((loan, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">{loan.name}</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>EMI:</span>
                          <span className="font-medium">₹{loan.emi.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Interest:</span>
                          <span className="font-medium">₹{loan.totalInterest.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Payment:</span>
                          <span className="font-medium">₹{loan.totalPayment.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="h-80">
                  <h4 className="text-sm font-medium mb-2">EMI Comparison</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`} />
                      <Bar dataKey="emi" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="amortization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="w-5 h-5" />
                <span>Amortization Schedule</span>
              </CardTitle>
              <CardDescription>Principal vs Interest payment over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={amortizationChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
                    <YAxis />
                    <Tooltip formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`} />
                    <Line type="monotone" dataKey="principal" stroke="#10b981" name="Principal" />
                    <Line type="monotone" dataKey="interest" stroke="#ef4444" name="Interest" />
                    <Line type="monotone" dataKey="balance" stroke="#3b82f6" name="Outstanding Balance" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {calculation && (
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0">
                      <tr>
                        <th className="p-2 text-left">Month</th>
                        <th className="p-2 text-right">EMI</th>
                        <th className="p-2 text-right">Principal</th>
                        <th className="p-2 text-right">Interest</th>
                        <th className="p-2 text-right">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculation.monthlyBreakdown.slice(0, 60).map((row, index) => (
                        <tr key={index} className="border-b border-slate-100 dark:border-slate-800">
                          <td className="p-2">{row.month}</td>
                          <td className="p-2 text-right">₹{row.emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                          <td className="p-2 text-right">₹{row.principal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                          <td className="p-2 text-right">₹{row.interest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                          <td className="p-2 text-right">₹{row.balance.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {calculation.monthlyBreakdown.length > 60 && (
                    <p className="text-center text-sm text-slate-500 mt-4">
                      Showing first 60 months. Total tenure: {loanTenure * 12} months
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Interest Rate Impact Analysis</span>
              </CardTitle>
              <CardDescription>See how interest rate changes affect your EMI</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[6, 7, 8, 9, 10, 11, 12].map(rate => {
                      const calc = calculateEMI(loanAmount, rate, loanTenure);
                      return {
                        rate: `${rate}%`,
                        emi: Math.round(calc.emi),
                        totalInterest: Math.round(calc.totalInterest)
                      };
                    })}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="rate" />
                      <YAxis />
                      <Tooltip formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`} />
                      <Line type="monotone" dataKey="emi" stroke="#3b82f6" name="EMI" />
                      <Line type="monotone" dataKey="totalInterest" stroke="#ef4444" name="Total Interest" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { rate: 7.5, label: "Best Rate" },
                    { rate: 8.5, label: "Current Rate" },
                    { rate: 9.5, label: "Market Rate" },
                    { rate: 10.5, label: "High Rate" }
                  ].map(({ rate, label }) => {
                    const calc = calculateEMI(loanAmount, rate, loanTenure);
                    return (
                      <div key={rate} className="p-3 border rounded-lg">
                        <div className="text-xs text-slate-500 mb-1">{label}</div>
                        <div className="font-semibold text-sm">{rate}%</div>
                        <div className="text-xs">₹{calc.emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export { LoanCalculator };
