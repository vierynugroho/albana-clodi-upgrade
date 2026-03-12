"use client";

import { useState, memo, useCallback } from "react";
import { Button, IconButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Search,
  Edit,
  Trash2,
  Eye,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Users,
  MapPin,
} from "lucide-react";
import type { Customer } from "@/types";

interface CustomerTableProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (customerId: string) => void;
  onView: (customer: Customer) => void;
}

type CustomerCategory = Customer["category"];
type BadgeVariant =
  | "default"
  | "secondary"
  | "outline"
  | "success"
  | "warning"
  | "info"
  | "pink"
  | "purple";

const categoryConfig: Record<
  CustomerCategory,
  { label: string; variant: BadgeVariant; color: string }
> = {
  customer: {
    label: "Customer",
    variant: "outline",
    color: "text-muted-foreground",
  },
  reseller: { label: "Reseller", variant: "info", color: "text-info" },
  agen: { label: "Agen", variant: "purple", color: "text-purple" },
  member: { label: "Member", variant: "success", color: "text-success" },
  dropshipper: {
    label: "Dropshipper",
    variant: "warning",
    color: "text-warning",
  },
};

interface ToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterCategory: string;
  onFilterChange: (value: string) => void;
}

const Toolbar = memo(function Toolbar({
  searchQuery,
  onSearchChange,
  filterCategory,
  onFilterChange,
}: ToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-3">
        <Input
          placeholder="Cari customer..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-xs"
          leftIcon={<Search className="h-4 w-4" />}
        />

        <select
          value={filterCategory}
          onChange={(e) => onFilterChange(e.target.value)}
          className="h-10 rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">Semua Kategori</option>
          <option value="customer">Customer</option>
          <option value="reseller">Reseller</option>
          <option value="agen">Agen</option>
          <option value="member">Member</option>
          <option value="dropshipper">Dropshipper</option>
        </select>
      </div>
    </div>
  );
});

interface CustomerRowProps {
  customer: Customer;
  index: number;
  onView: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customerId: string) => void;
}

const CustomerRow = memo(function CustomerRow({
  customer,
  index,
  onView,
  onEdit,
  onDelete,
}: CustomerRowProps) {
  const config = categoryConfig[customer.category];

  return (
    <tr
      className="border-b transition-colors hover:bg-muted/50 group animate-fade-in"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div
            className={`h-10 w-10 rounded-xl flex items-center justify-center ${config.variant === "info"
              ? "bg-info/10"
              : config.variant === "purple"
                ? "bg-purple/10"
                : config.variant === "success"
                  ? "bg-success/10"
                  : config.variant === "warning"
                    ? "bg-warning/10"
                    : "bg-muted"
              }`}
          >
            <Users className={`h-5 w-5 ${config.color}`} />
          </div>
          <div>
            <p className="font-semibold text-sm">{customer.name}</p>
            <p className="text-xs text-muted-foreground">{customer.email}</p>
          </div>
        </div>
      </td>
      <td className="p-4">
        <Badge variant={config.variant} dot>
          {config.label}
        </Badge>
      </td>
      <td className="p-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-3.5 w-3.5 text-success" />
            <span>{customer.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Mail className="h-3 w-3" />
            <span className="truncate max-w-[150px]">{customer.email}</span>
          </div>
        </div>
      </td>
      <td className="p-4">
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-pink mt-0.5" />
          <div>
            <p className="text-sm font-medium">{customer.city}</p>
            <p className="text-xs text-muted-foreground">{customer.province}</p>
          </div>
        </div>
      </td>
      <td className="p-4">
        {/* <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"> */}
        <div className="flex items-center gap-1 transition-opacity">
          <IconButton color="info" size="sm" onClick={() => onView(customer)}>
            <Eye className="h-4 w-4" />
          </IconButton>
          <IconButton
            color="warning"
            size="sm"
            onClick={() => onEdit(customer)}
          >
            <Edit className="h-4 w-4" />
          </IconButton>
          <IconButton
            color="destructive"
            size="sm"
            onClick={() => onDelete(customer.id)}
          >
            <Trash2 className="h-4 w-4" />
          </IconButton>
        </div>
      </td>
    </tr>
  );
});

// Mobile card view for customers
const CustomerMobileCard = memo(function CustomerMobileCard({
  customer,
  index,
  onView,
  onEdit,
  onDelete,
}: CustomerRowProps) {
  const config = categoryConfig[customer.category];

  return (
    <div
      className="p-4 border-b last:border-b-0 animate-fade-in"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div className="flex items-start gap-3">
        <div
          className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center ${config.variant === "info"
            ? "bg-info/10"
            : config.variant === "purple"
              ? "bg-purple/10"
              : config.variant === "success"
                ? "bg-success/10"
                : config.variant === "warning"
                  ? "bg-warning/10"
                  : "bg-muted"
            }`}
        >
          <Users className={`h-5 w-5 ${config.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">{customer.name}</p>
              <p className="text-xs text-muted-foreground truncate">{customer.email}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <IconButton color="info" size="sm" onClick={() => onView(customer)}>
                <Eye className="h-4 w-4" />
              </IconButton>
              <IconButton color="warning" size="sm" onClick={() => onEdit(customer)}>
                <Edit className="h-4 w-4" />
              </IconButton>
              <IconButton color="destructive" size="sm" onClick={() => onDelete(customer.id)}>
                <Trash2 className="h-4 w-4" />
              </IconButton>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge variant={config.variant} dot>{config.label}</Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Phone className="h-3 w-3 text-success" />
              <span>{customer.phone}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 text-pink shrink-0" />
            <span className="truncate">{customer.city}, {customer.province}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

const Pagination = memo(function Pagination({
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  totalItems,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 border-t bg-muted/20">
      <p className="text-sm text-muted-foreground">
        Menampilkan{" "}
        <span className="font-semibold text-foreground">
          {startIndex + 1} - {Math.min(endIndex, totalItems)}
        </span>{" "}
        dari <span className="font-semibold text-foreground">{totalItems}</span>{" "}
        customer
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(
          (page) => (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          )
        )}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
});

export function CustomerTable({
  customers,
  onEdit,
  onDelete,
  onView,
}: CustomerTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || customer.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return (
    <div className="space-y-4">
      <Toolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterCategory={filterCategory}
        onFilterChange={setFilterCategory}
      />

      <Card className="overflow-hidden">
        {/* Mobile Card Layout */}
        <div className="md:hidden">
          {paginatedCustomers.length === 0 ? (
            <div className="p-8 text-center">
              <div className="py-12">
                <div className="h-16 w-16 rounded-2xl bg-pink/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-pink" />
                </div>
                <p className="text-base font-semibold">Tidak ada customer</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchQuery ? "Coba ubah kata kunci pencarian" : "Belum ada customer yang tersedia"}
                </p>
              </div>
            </div>
          ) : (
            paginatedCustomers.map((customer, index) => (
              <CustomerMobileCard
                key={customer.id}
                customer={customer}
                index={index}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </div>

        {/* Desktop Table Layout */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="p-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Customer</th>
                <th className="p-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Kategori</th>
                <th className="p-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Kontak</th>
                <th className="p-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Lokasi</th>
                <th className="p-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide w-32">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center">
                    <div className="py-12">
                      <div className="h-16 w-16 rounded-2xl bg-pink/10 flex items-center justify-center mx-auto mb-4">
                        <Users className="h-8 w-8 text-pink" />
                      </div>
                      <p className="text-base font-semibold">Tidak ada customer</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {searchQuery ? "Coba ubah kata kunci pencarian" : "Belum ada customer yang tersedia"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedCustomers.map((customer, index) => (
                  <CustomerRow
                    key={customer.id}
                    customer={customer}
                    index={index}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={filteredCustomers.length}
            onPageChange={handlePageChange}
          />
        )}
      </Card>
    </div>
  );
}
