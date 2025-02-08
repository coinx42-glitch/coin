"use client";

import { useState } from "react";
import { Check, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Mock data for payments
const mockPayments = [
  {
    id: 1,
    user: "User1",
    amount: 500,
    status: "Pending",
    screenshot: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 2,
    user: "User2",
    amount: 750,
    status: "Pending",
    screenshot: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 3,
    user: "User3",
    amount: 1000,
    status: "Pending",
    screenshot: "/placeholder.svg?height=300&width=300",
  },
];

export default function ConfirmPayments() {
  const [payments, setPayments] = useState(mockPayments);

  const handleConfirm = (id: number, confirmedAmount: number) => {
    setPayments(
      payments.map((payment) =>
        payment.id === id
          ? { ...payment, status: "Confirmed", amount: confirmedAmount }
          : payment
      )
    );
  };

  const handleReject = (id: number) => {
    setPayments(
      payments.map((payment) =>
        payment.id === id ? { ...payment, status: "Rejected" } : payment
      )
    );
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Confirm Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Claimed Amount ($)</TableHead>
                  <TableHead>Confirm Amount ($)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Screenshot</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">
                      {payment.user}
                    </TableCell>
                    <TableCell>{payment.amount}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        placeholder="Confirm amount"
                        className="w-32"
                        defaultValue={payment.amount}
                        onChange={(e) =>
                          (payment.amount = Number(e.target.value))
                        }
                      />
                    </TableCell>
                    <TableCell>{payment.status}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-4 w-4" /> View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Payment Screenshot</DialogTitle>
                          </DialogHeader>
                          <div className="mt-4">
                            <img
                              src={payment.screenshot || "/placeholder.svg"}
                              alt={`Payment screenshot for ${payment.user}`}
                              width={300}
                              height={300}
                              className="rounded-md"
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell>
                      {payment.status === "Pending" && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() =>
                              handleConfirm(payment.id, payment.amount)
                            }
                          >
                            <Check className="mr-2 h-4 w-4" /> Confirm
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(payment.id)}
                          >
                            <X className="mr-2 h-4 w-4" /> Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="md:hidden space-y-6">
            {payments.map((payment) => (
              <Card key={payment.id}>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="font-medium">User:</div>
                    <div>{payment.user}</div>
                    <div className="font-medium">Claimed Amount:</div>
                    <div>${payment.amount}</div>
                    <div className="font-medium">Confirm Amount:</div>
                    <div>
                      <Input
                        type="number"
                        placeholder="Confirm amount"
                        defaultValue={payment.amount}
                        onChange={(e) =>
                          (payment.amount = Number(e.target.value))
                        }
                      />
                    </div>
                    <div className="font-medium">Status:</div>
                    <div>{payment.status}</div>
                    <div className="font-medium">Screenshot:</div>
                    <div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-4 w-4" /> View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Payment Screenshot</DialogTitle>
                          </DialogHeader>
                          <div className="mt-4">
                            <img
                              src={payment.screenshot || "/placeholder.svg"}
                              alt={`Payment screenshot for ${payment.user}`}
                              width={300}
                              height={300}
                              className="rounded-md"
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  {payment.status === "Pending" && (
                    <div className="flex space-x-2 mt-4">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() =>
                          handleConfirm(payment.id, payment.amount)
                        }
                      >
                        <Check className="mr-2 h-4 w-4" /> Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex-1"
                        onClick={() => handleReject(payment.id)}
                      >
                        <X className="mr-2 h-4 w-4" /> Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
