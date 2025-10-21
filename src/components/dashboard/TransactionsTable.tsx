import React, { memo, useMemo } from 'react';
import { Search, Filter, Check, PiggyBank } from 'lucide-react';
import { Button } from '@/components/base/buttons/button';
import { Input } from '@/components/base/input/input';
import { Table, TableCard } from '@/components/application/table/table';
import { EmptyState } from '@/components/application/empty-state/empty-state';
import { PaginationPageMinimalCenter } from '@/components/application/pagination/pagination';
import { BadgeWithIcon } from '@/components/base/badges/badges';
import { Transaction } from '@/types/dashboard';
import { EMPTY_STATE_CONFIG, DASHBOARD_CONSTANTS } from '@/constants/dashboard';

interface TransactionsTableProps {
  transactions: Transaction[];
  currentTransactions: Transaction[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = memo(({
  transactions,
  currentTransactions,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const hasTransactions = useMemo(() => transactions.length > 0, [transactions.length]);
  
  const transactionBadgeText = useMemo(() => 
    `${transactions.length} Transaction${transactions.length !== 1 ? "s" : ""}`,
    [transactions.length]
  );

  return (
    <TableCard.Root className="max-w-[calc(100vw-2rem)] bg-white sm:max-w-full">
      <TableCard.Header
        title="Transactions"
        badge={transactionBadgeText}
        description="Keep track of your transactions."
        contentTrailing={
          currentTransactions.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="relative">
                <Input
                  icon={Search}
                  placeholder="Search"
                  className=""
                  shortcut="⌘K"
                  aria-label="Search transactions"
                />
              </div>
              <Button
                color="secondary"
                size="md"
                iconTrailing={<Filter className="w-4 h-4" />}
              >
                <span>Filters</span>
              </Button>
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

            <Table.Body items={currentTransactions}>
              {(item) => (
                <Table.Row 
                  key={item.transaction_ref} 
                  id={item.transaction_ref}
                  aria-label={`Transaction ${item.transaction_ref} for ${item.amount} on ${item.payment_date}`}
                >
                  <Table.Cell>
                    <span className="font-medium text-sm text-[#181D27]">
                      {item.transaction_ref}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-sm text-[#535862]">
                      {item.payment_date}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <BadgeWithIcon
                      type="pill-color"
                      color="success"
                      size="md"
                      iconLeading={Check}
                    >
                      {item.status}
                    </BadgeWithIcon>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="font-medium text-sm text-[#535862]">
                      {item.amount}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-sm text-[#535862]">
                      {item.gateway}
                    </span>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>

          {/* Pagination */}
          {transactions.length > DASHBOARD_CONSTANTS.ITEMS_PER_PAGE && (
            <PaginationPageMinimalCenter
              page={currentPage}
              total={totalPages}
              onPageChange={onPageChange}
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
            <EmptyState.Title>
              {EMPTY_STATE_CONFIG.title}
            </EmptyState.Title>
            <EmptyState.Description>
              {EMPTY_STATE_CONFIG.description}
            </EmptyState.Description>
          </EmptyState.Content>
          <EmptyState.Footer>
            <Button
              color="primary"
              size="md"
              iconLeading={<PiggyBank />}
            >
              {EMPTY_STATE_CONFIG.buttonText}
            </Button>
          </EmptyState.Footer>
        </EmptyState>
      )}
    </TableCard.Root>
  );
});
