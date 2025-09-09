"use client";
import { useMemo, useState, useCallback } from "react";
import { useAdminTenant } from "@/contexts/AdminTenantContext";
import { UsersRound, Plus } from "lucide-react";
import HeaderSection from "@/components/custom/dashboard/header-section";
import { useEmployeeActions, useEmployees } from "@/hooks/query/useEmployees";
import { EmployeeSheet } from "@/components/platform/parlour/employee-sheet";
import { SheetWrapper } from "@/components/custom/ui/sheet-wrapper";
import { UserSearchForm } from "@/components/platform/user-search-form";
import { DataTable } from "@/components/custom/ui/data-table";
import { employeeColumns } from "./employee-columns";

export function StaffClient({ token }) {
  const { parlour } = useAdminTenant();

  const [isUserSearchOpen, setIsUserSearchOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  // no need of pagination as we will show all employees in one list
  const apiParams = useMemo(() => {
    return {
      page: 1,
      limit: 50,
      parlourId: parlour?._id,
    };
  }, [parlour?._id]);

  const { employees = [], pagination, isLoading } = useEmployees(token, apiParams, { public: false });
  const { deleteEmployee, isDeleting } = useEmployeeActions();

  const handleEdit = useCallback((item) => {
    setSelectedEmployee(item);
    setSelectedUser(null);
    setIsFormOpen(true);
  }, []);
  const handleDelete = useCallback(async (item) => {
    if (confirm("Delete employee?")) await deleteEmployee({ token, id: item._id });
  }, [deleteEmployee, token]);

  const handlePay = useCallback((item) => {
    console.log("Pay salary for:", item?._id, "Amount:", item?.salaryAmount, "Currency:", item?.salaryCurrency);
  }, []);

  const columns = useMemo(() => employeeColumns(handleEdit, handleDelete, handlePay), [handleEdit, handleDelete, handlePay]);

  const handleCreate = useCallback(() => {
    setSelectedEmployee(null);
    setSelectedUser(null);
    setIsUserSearchOpen(true);
  }, []);

  const handleUserSelected = useCallback((user) => {
    setSelectedUser(user);
    setIsUserSearchOpen(false);
    setIsFormOpen(true);
  }, []);

  const handleFormClose = useCallback(() => {
    setIsFormOpen(false);
    setSelectedEmployee(null);
    setSelectedUser(null);
  }, []);

  return (
    <div className="flex flex-col gap-2">
    <HeaderSection
      icon={UsersRound}
      title="Employees"
      variant="compact"
      description="Manage your parlour staff"
      actions={[
        {
          icon: Plus,
          text: "Add Employee",
          size: "sm",
          onClick: handleCreate,
        },
      ]}
    />

      <DataTable
        columns={columns}
        data={employees}
        isLoading={isLoading}
        className="h-[74dvh] rounded-lg"
      />
      <SheetWrapper
        open={isUserSearchOpen}
        onOpenChange={setIsUserSearchOpen}
        title="Select User"
        description="Search and select a user to create an employee profile"
        size="default"
      >
        <UserSearchForm
          token={token}
          onUserSelected={handleUserSelected}
          onCancel={() => setIsUserSearchOpen(false)}
        />
      </SheetWrapper>

      <EmployeeSheet
        token={token}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        organizationId={parlour?.organizationId}
        parlourId={parlour?._id}
        employee={selectedEmployee}
        user={selectedUser}
      />
    </div>
  );
}


