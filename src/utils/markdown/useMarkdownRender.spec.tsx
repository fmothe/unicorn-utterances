import { useMarkdownRenderer } from "utils/markdown/useMarkdownRenderer";
import { useMarkdownRendererProps } from "utils/markdown/MarkdownRenderer/types";
import { fireEvent, render, screen } from "@testing-library/react";

const Comp = ({ props }: { props: useMarkdownRendererProps }) => {
  const result = useMarkdownRenderer(props);
  return <>{result}</>;
};

test("tabs should render", () => {
  localStorage.setItem("tabs-selection", "");
  render(
    <Comp
      props={{
        serverPath: [],
        markdownHTML: `
<tabs>
  <tab-list>
    <tab data-tabname="header">Header</tab>
    <tab data-tabname="header2">Header2</tab>
  </tab-list>
  <tab-panel data-tabname="header">Hello</tab-panel>
  <tab-panel data-tabname="header2">Goodbye</tab-panel>
</tabs>
    `,
      }}
    />
  );

  expect(screen.getByText("Header")).toBeInTheDocument();
  expect(screen.getByText("Hello")).toBeInTheDocument();
  expect(screen.queryByText("Goodbye")).not.toBeInTheDocument();
  fireEvent.click(screen.getByText("Header2"));
  expect(screen.queryByText("Hello")).not.toBeInTheDocument();
  expect(screen.getByText("Goodbye")).toBeInTheDocument();
});

test("tabs should persist", () => {
  localStorage.setItem("tabs-selection", "");
  const comp = (
    <Comp
      props={{
        serverPath: [],
        markdownHTML: `
<tabs>
  <tab-list>
    <tab data-tabname="header">Header</tab>
    <tab data-tabname="header2">Header2</tab>
  </tab-list>
  <tab-panel data-tabname="header">Hello</tab-panel>
  <tab-panel data-tabname="header2">Goodbye</tab-panel>
</tabs>
    `,
      }}
    />
  );
  const { rerender } = render(comp);

  expect(screen.getByText("Hello")).toBeInTheDocument();
  fireEvent.click(screen.getByText("Header2"));
  expect(screen.queryByText("Hello")).not.toBeInTheDocument();
  expect(screen.getByText("Goodbye")).toBeInTheDocument();

  rerender(comp);
  expect(screen.queryByText("Hello")).not.toBeInTheDocument();
  expect(screen.getByText("Goodbye")).toBeInTheDocument();
});

test("tabs should sync values", () => {
  localStorage.setItem("tabs-selection", "");
  render(
    <Comp
      props={{
        serverPath: [],
        markdownHTML: `
<tabs>
  <tab-list>
    <tab data-tabname="header">Header</tab>
    <tab data-tabname="header2">Header2</tab>
  </tab-list>
  <tab-panel data-tabname="header">Hello</tab-panel>
  <tab-panel data-tabname="header2">Goodbye</tab-panel>
</tabs>

<tabs>
  <tab-list>
    <tab data-tabname="header">Header</tab>
    <tab data-tabname="header2">Header2</tab>
  </tab-list>
  <tab-panel data-tabname="header">Hello2</tab-panel>
  <tab-panel data-tabname="header2">Goodbye2</tab-panel>
</tabs>
    `,
      }}
    />
  );

  expect(screen.getAllByText("Header").length).toBe(2);
  expect(screen.getByText("Hello")).toBeInTheDocument();
  expect(screen.getByText("Hello2")).toBeInTheDocument();
  expect(screen.queryByText("Goodbye")).not.toBeInTheDocument();
  expect(screen.queryByText("Goodbye2")).not.toBeInTheDocument();
  fireEvent.click(screen.getAllByText("Header2")[0]);
  expect(screen.queryByText("Hello")).not.toBeInTheDocument();
  expect(screen.queryByText("Hello2")).not.toBeInTheDocument();
  expect(screen.getByText("Goodbye")).toBeInTheDocument();
  expect(screen.getByText("Goodbye2")).toBeInTheDocument();
});
