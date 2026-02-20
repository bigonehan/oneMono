"use client";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Lenis, SlideUpText } from "@ui/motion";
import { Footer, Header } from "@ui/shadcn";
import { useEffect, useMemo, useState } from "react";

type UserTaskRow = {
  userName: string;
  userEmail: string;
  taskTitle: string;
  taskStatus: string;
};

const sections = [
  { id: "section-1", title: "Section 1", color: "section--one" },
  { id: "section-2", title: "Section 2", color: "section--two" },
  { id: "section-3", title: "Section 3", color: "section--three" },
  { id: "section-4", title: "Section 4", color: "section--four" },
  { id: "section-5", title: "Section 5", color: "section--five" },
];

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [rows, setRows] = useState<UserTaskRow[]>([]);
  const [seedCount, setSeedCount] = useState(1);

  const columns = useMemo(() => {
    const column = createColumnHelper<UserTaskRow>();
    return [
      column.accessor("userName", { header: "User" }),
      column.accessor("userEmail", { header: "Email" }),
      column.accessor("taskTitle", { header: "Task" }),
      column.accessor("taskStatus", { header: "Status" }),
    ];
  }, []);

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };

    rafId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const createUserTaskByMenu = async () => {
    const next = seedCount;
    const createdRows: UserTaskRow[] = [
      {
        userName: `User ${next}`,
        userEmail: `user${next}@example.com`,
        taskTitle: `Task ${next}-1`,
        taskStatus: "todo",
      },
      {
        userName: `User ${next}`,
        userEmail: `user${next}@example.com`,
        taskTitle: `Task ${next}-2`,
        taskStatus: "in-progress",
      },
    ];
    setSeedCount((count) => count + 1);
    setRows((prev) => [...prev, ...createdRows]);

    const tableSection = document.getElementById("table-section");
    if (tableSection) {
      tableSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="template-root">
      <Header
        onMenuClick={() => setIsMobileMenuOpen(true)}
        onTableClick={() => {
          void createUserTaskByMenu();
        }}
      />

      <div
        className={`mobile-overlay ${isMobileMenuOpen ? "is-open" : ""}`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden={!isMobileMenuOpen}
      />

      <aside className={`mobile-side-menu ${isMobileMenuOpen ? "is-open" : ""}`} aria-label="Mobile menu">
        <nav className="mobile-side-menu__nav">
          <a href="#section-1" onClick={() => setIsMobileMenuOpen(false)}>
            Blog
          </a>
          <a href="#section-2" onClick={() => setIsMobileMenuOpen(false)}>
            Profile
          </a>
        </nav>
      </aside>

      <main className="template-body">
        <section id="table-section" className="table-section">
          <h2>User + Task Table</h2>
          <p>Click Header `Table` to create user and related task rows.</p>
          <div className="table-shell">
            <table>
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td colSpan={4}>No rows yet. Use Header Table menu.</td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {sections.map((section) => (
          <section key={section.id} id={section.id} className={`section ${section.color}`}>
            <SlideUpText text={section.title} />
          </section>
        ))}
      </main>

      <Footer />
    </div>
  );
}
