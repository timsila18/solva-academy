import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
vi.mock("next/navigation", () => ({ usePathname: () => "/welcome" }));
import { WorkspaceNavigation } from "@/components/navigation/workspace-navigation";
afterEach(cleanup);

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
