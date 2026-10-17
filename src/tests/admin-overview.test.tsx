import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
vi.mock("@/components/layout/dashboard-shell", () => ({ DashboardShell: ({ children }: { children: React.ReactNode }) => <main>{children}</main> }));
import AdminDashboardPage from "@/app/(workspace)/admin/page";
afterEach(cleanup);

it("prioritizes academy applications with only four collapsed tool groups", () => {
  const { container } = render(<AdminDashboardPage />);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Administration");
  expect(screen.getByRole("link", { name: /Academy applications/ })).toHaveAttribute("href", "/admin/review-queues");
  expect(container.querySelectorAll("details")).toHaveLength(4);
  expect(container.querySelectorAll("details[open]")).toHaveLength(0);
  expect(container.querySelectorAll("a")).toHaveLength(20);
});

it("preserves every existing admin destination inside the grouped tools", () => {
  render(<AdminDashboardPage />);
  fireEvent.click(screen.getByText("People & academies"));
  const destinations = ["users", "roles", "permissions", "workspaces", "schools", "categories", "skills", "academies", "organizations", "enterprise", "instructor-applications", "review-queues", "courses", "finance", "payouts", "enrollments", "invitations", "feature-flags", "settings", "audit-logs"];
  for (const path of destinations) expect(document.querySelector(`a[href="/admin/${path}"]`)).not.toBeNull();
});
