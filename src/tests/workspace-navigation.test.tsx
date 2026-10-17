import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
const location = vi.hoisted(() => ({ pathname: "/welcome" }));
vi.mock("next/navigation", () => ({ usePathname: () => location.pathname }));
import { WorkspaceNavigation } from "@/components/navigation/workspace-navigation";
afterEach(() => { cleanup(); location.pathname = "/welcome"; });

it("keeps a new learner menu short and omits administrative tools", () => {
  render(<WorkspaceNavigation teaching={false} academy={false} organization={false} administrator={false} />);
  expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/welcome");
  expect(screen.getByRole("link", { name: "My learning" })).toHaveAttribute("href", "/learner");
  expect(screen.queryByText("Administration")).not.toBeInTheDocument();
  expect(screen.queryByText("My academy")).not.toBeInTheDocument();
  expect(screen.getAllByRole("link")).toHaveLength(5);
});

it("makes academy and admin sections available only for the supplied account capabilities", () => {
  render(<WorkspaceNavigation teaching academy organization={false} administrator />);
  expect(screen.getByText("My academy")).toBeInTheDocument();
  expect(screen.getByText("Administration")).toBeInTheDocument();
  expect(screen.queryByText("My organization")).not.toBeInTheDocument();
});

it("keeps the administration menu focused without mixing personal or teaching roles", () => {
  location.pathname = "/admin";
  render(<WorkspaceNavigation teaching academy organization administrator />);
  expect(screen.getByRole("navigation", { name: "Administration" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Applications" })).toHaveAttribute("href", "/admin/review-queues");
  expect(screen.queryByText("My learning")).not.toBeInTheDocument();
  expect(screen.queryByText("Teaching")).not.toBeInTheDocument();
  expect(screen.queryByText("My organization")).not.toBeInTheDocument();
  expect(screen.getByText("More").closest("details")).not.toHaveAttribute("open");
  expect(screen.getByRole("link", { name: "Overview" })).toHaveAttribute("aria-current", "page");
});

it("opens secondary navigation when one of its pages is selected", () => {
  location.pathname = "/admin/roles";
  render(<WorkspaceNavigation teaching={false} academy={false} organization={false} administrator />);
  expect(screen.getByText("More").closest("details")).toHaveAttribute("open");
  expect(screen.getByRole("link", { name: "Roles & access" })).toHaveAttribute("aria-current", "page");
});
