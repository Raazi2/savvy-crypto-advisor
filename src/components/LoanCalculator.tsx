import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calculator, TrendingUp, Calendar, IndianRupee, BarChart3 } from 'lucide-react';

interface LoanData {
  loanAmount: number;
  interestRate: number;
  loanTenure: number;
  emi: number;
  totalInterestPayable: number;
  totalPayment: number;
}

interface AmortizationSchedule {
  period: number;
  beginningBalance: number;
  emi: number;
  interest: number;
  principal: number;
  endingBalance: number;
}

const LoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState<number>(100000);
  const [interestRate, setInterestRate] = useState<number>(10);
  const [loanTenure, setLoanTenure] = useState<number>(12);
  const [loanData, setLoanData] = useState<LoanData | null>(null);
  const [amortizationSchedule, setAmortizationSchedule] = useState<AmortizationSchedule[]>([]);

  useEffect(() => {
    calculateLoan();
  }, [loanAmount, interestRate, loanTenure]);

  const calculateLoan = () => {
    const monthlyInterestRate = interestRate / 12 / 100;
    const numberOfPayments = loanTenure;
    const emi =
      (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    const totalInterestPayable = emi * numberOfPayments - loanAmount;
    const totalPayment = loanAmount + totalInterestPayable;

    setLoanData({
      loanAmount,
      interestRate,
      loanTenure,
      emi,
      totalInterestPayable,
      totalPayment,
    });

    generateAmortizationSchedule(loanAmount, interestRate, loanTenure, emi);
  };

  const generateAmortizationSchedule = (
    loanAmount: number,
    interestRate: number,
    loanTenure: number,
    emi: number
  ) => {
    let currentBalance = loanAmount;
    const schedule: AmortizationSchedule[] = [];
    let totalInterest = 0;

    for (let i = 1; i <= loanTenure; i++) {
      const interest = currentBalance * (interestRate / 12 / 100);
      const principal = emi - interest;
      const endingBalance = currentBalance - principal;

      totalInterest += interest;

      schedule.push({
        period: i,
        beginningBalance: currentBalance,
        emi: emi,
        interest: interest,
        principal: principal,
        endingBalance: endingBalance > 0 ? endingBalance : 0,
      });

      currentBalance = endingBalance > 0 ? endingBalance : 0;
    }

    setAmortizationSchedule(schedule);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const pieChartData = [
    { name: 'Principal', value: loanAmount },
    { name: 'Interest', value: loanData?.totalInterestPayable || 0 },
  ];

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Loan EMI Calculator</CardTitle>
          <CardDescription>Calculate your EMI and view amortization schedule</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="loanAmount">Loan Amount (₹)</Label>
              <Input
                type="number"
                id="loanAmount"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="interestRate">Interest Rate (%)</Label>
              <Input
                type="number"
                id="interestRate"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="loanTenure">Loan Tenure (Months)</Label>
              <Input
                type="number"
                id="loanTenure"
                value={loanTenure}
                onChange={(e) => setLoanTenure(Number(e.target.value))}
              />
            </div>
          </div>

          {loanData && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Loan Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>EMI (₹)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">₹{loanData.emi.toFixed(0)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Total Interest Payable (₹)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">₹{loanData.totalInterestPayable.toFixed(0)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Total Payment (₹)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">₹{loanData.totalPayment.toFixed(0)}</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {loanData && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Loan Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`₹${typeof value === 'number' ? value.toFixed(0) : value}`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {amortizationSchedule.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Amortization Schedule</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead>Beginning Balance (₹)</TableHead>
                      <TableHead>EMI (₹)</TableHead>
                      <TableHead>Interest (₹)</TableHead>
                      <TableHead>Principal (₹)</TableHead>
                      <TableHead>Ending Balance (₹)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {amortizationSchedule.map((item) => (
                      <TableRow key={item.period}>
                        <TableCell>{item.period}</TableCell>
                        <TableCell>₹{item.beginningBalance.toFixed(0)}</TableCell>
                        <TableCell>₹{item.emi.toFixed(0)}</TableCell>
                        <TableCell>₹{item.interest.toFixed(0)}</TableCell>
                        <TableCell>₹{item.principal.toFixed(0)}</TableCell>
                        <TableCell>₹{item.endingBalance.toFixed(0)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanCalculator;
