import React, { memo, useMemo, useState, useCallback } from "react";
import { Search, Filter, Check, PiggyBank } from "lucide-react";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Table, TableCard } from "@/components/application/table/table";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import { PaginationPageMinimalCenter } from "@/components/application/pagination/pagination";
import { BadgeWithIcon } from "@/components/base/badges/badges";
import { Transaction } from "@/types/dashboard";
import { EMPTY_STATE_CONFIG, DASHBOARD_CONSTANTS } from "@/constants/dashboard";
import { amountConversion } from "@/utils/amountConversion";

interface TransactionsTableProps {
  transactions: Transaction[];
  currentTransactions: Transaction[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onTransactionSelect?: (transaction: Transaction) => void;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = memo(
  ({
    transactions,
    currentTransactions,
    currentPage,
    totalPages,
    onPageChange,
    onTransactionSelect,
  }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredPage, setFilteredPage] = useState(1);

    // Filter out any invalid transactions to prevent rendering issues
    const validTransactions = useMemo(
      () =>
        transactions.filter(
          (transaction) =>
            transaction &&
            typeof transaction === "object" &&
            transaction.payment_date !== undefined
        ),
      [transactions]
    );

    // Filter transactions based on search query
    const filteredTransactions = useMemo(() => {
      if (!searchQuery.trim()) {
        return validTransactions;
      }

      const query = searchQuery.toLowerCase().trim();
      return validTransactions.filter((transaction) => {
        const searchableFields = [
          transaction.transaction_ref || "",
          transaction.customer_name || "",
          transaction.gateway || "",
          transaction.status || "",
          transaction.payment_date || "",
          transaction.amount?.toString() || "",
          transaction.currency || "",
        ];

        return searchableFields.some((field) =>
          field.toLowerCase().includes(query)
        );
      });
    }, [validTransactions, searchQuery]);

    // Calculate pagination for filtered results
    const filteredTotalPages = useMemo(
      () =>
        Math.ceil(
          filteredTransactions.length / DASHBOARD_CONSTANTS.ITEMS_PER_PAGE
        ),
      [filteredTransactions.length]
    );

    const paginatedFilteredTransactions = useMemo(() => {
      if (!searchQuery.trim()) {
        return [];
      }
      const startIndex =
        (filteredPage - 1) * DASHBOARD_CONSTANTS.ITEMS_PER_PAGE;
      const endIndex = startIndex + DASHBOARD_CONSTANTS.ITEMS_PER_PAGE;
      return filteredTransactions.slice(startIndex, endIndex);
    }, [filteredTransactions, filteredPage, searchQuery]);

    // Use filtered transactions if search is active, otherwise use props
    const displayTransactions = searchQuery.trim()
      ? paginatedFilteredTransactions
      : currentTransactions;

    const displayTotalPages = searchQuery.trim()
      ? filteredTotalPages
      : totalPages;

    const displayCurrentPage = searchQuery.trim() ? filteredPage : currentPage;

    const handleSearchChange = useCallback((value: string) => {
      setSearchQuery(value);
      // Reset to page 1 when search changes
      setFilteredPage(1);
    }, []);

    const handlePageChangeInternal = useCallback(
      (page: number) => {
        if (searchQuery.trim()) {
          setFilteredPage(page);
        } else {
          onPageChange(page);
        }
      },
      [searchQuery, onPageChange]
    );

    const hasTransactions = useMemo(
      () => validTransactions.length > 0,
      [validTransactions.length]
    );

    // Use filtered transactions count for badge if search is active
    const transactionsForBadge = searchQuery.trim()
      ? filteredTransactions
      : validTransactions;

    const transactionBadgeText = useMemo(
      () =>
        `${transactionsForBadge.length} Transaction${
          transactionsForBadge.length !== 1 ? "s" : ""
        }`,
      [transactionsForBadge.length]
    );

    // Ensure each transaction has a unique id for react-aria-components
    // Always include index to guarantee uniqueness even if transaction_ref is duplicated
    const transactionsWithIds = useMemo(
      () =>
        displayTransactions.map((transaction, index) => ({
          ...transaction,
          id: transaction.transaction_ref
            ? `transaction-${transaction.transaction_ref}-${index}`
            : `transaction-${transaction.payment_date || "no-date"}-${
                transaction.amount || "no-amount"
              }-${transaction.customer_id || "no-customer"}-${index}`,
        })),
      [displayTransactions]
    );

    return (
      <TableCard.Root className="max-w-[calc(100vw-2rem)] bg-white sm:max-w-full">
        <TableCard.Header
          title="Transactions"
          badge={transactionBadgeText}
          description="Keep track of your transactions."
          contentTrailing={
            hasTransactions && (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Input
                    icon={Search}
                    placeholder="Search transactions..."
                    className=""
                    // shortcut="⌘K"
                    aria-label="Search transactions"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
            )
          }
        />

        {hasTransactions ? (
          <>
            <Table
              aria-label="Transactions table with pagination"
              selectionMode="multiple"
              sortDescriptor={undefined}
              onSortChange={() => {}}
            >
              <Table.Header className="bg-gray-50">
                <Table.Head id="reference" label="Reference" isRowHeader />
                <Table.Head id="date" label="Date" />
                <Table.Head id="status" label="Status" />
                <Table.Head id="amount" label="Amount" />
                <Table.Head id="gateway" label="Gateway" />
              </Table.Header>

              <Table.Body items={transactionsWithIds}>
                {(item) => {
                  // Use the unique id we already generated for the key
                  // Remove the id property before passing to onTransactionSelect
                  const handleRowClick = () => {
                    if (onTransactionSelect) {
                      const { id, ...transaction } = item;
                      onTransactionSelect(transaction as Transaction);
                    }
                  };

                  return (
                    <Table.Row
                      key={item.id}
                      id={item.id}
                      aria-label={`Transaction ${
                        item.transaction_ref || "Unknown"
                      } for ${item.amount} on ${item.payment_date}`}
                      onClick={handleRowClick}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <Table.Cell>
                        <a href="/transactions">
                          <span className="font-medium hover:underline text-sm text-[#181D27]">
                            {item.customer_id || "N/A"}
                          </span>
                        </a>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-sm text-[#535862]">
                          {item.payment_date || "N/A"}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <BadgeWithIcon
                          type="pill-color"
                          color="success"
                          size="md"
                          iconLeading={Check}
                        >
                          {item.status || "Unknown"}
                        </BadgeWithIcon>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="font-medium text-sm text-[#535862]">
                          {typeof item.amount === "number"
                            ? amountConversion(item.amount, item.currency || "R")
                            : "N/A"}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-sm text-[#535862]">
                          {item.gateway || "N/A"}
                        </span>
                      </Table.Cell>
                    </Table.Row>
                  );
                }}
              </Table.Body>
            </Table>

            {/* Pagination */}
            {(searchQuery.trim()
              ? filteredTransactions.length > DASHBOARD_CONSTANTS.ITEMS_PER_PAGE
              : validTransactions.length >
                DASHBOARD_CONSTANTS.ITEMS_PER_PAGE) && (
              <PaginationPageMinimalCenter
                page={displayCurrentPage}
                total={displayTotalPages}
                onPageChange={handlePageChangeInternal}
                className="px-4 py-3 md:px-6 md:pt-3 md:pb-4"
              />
            )}
          </>
        ) : (
          <EmptyState size="md" className="py-16">
            <EmptyState.Header pattern="none">
              <div className="flex items-center">
                <img
                  src="Illustration.svg"
                  alt="No Transactions"
                  className="w-[152px] h-[118px]"
                />
              </div>
            </EmptyState.Header>
            <EmptyState.Content>
              <EmptyState.Title>{EMPTY_STATE_CONFIG.title}</EmptyState.Title>
              <EmptyState.Description>
                {EMPTY_STATE_CONFIG.description}
              </EmptyState.Description>
            </EmptyState.Content>
            <EmptyState.Footer>
              <Button color="primary" size="md" iconLeading={<PiggyBank />}>
                {EMPTY_STATE_CONFIG.buttonText}
              </Button>
            </EmptyState.Footer>
          </EmptyState>
        )}
      </TableCard.Root>
    );
  }
);
