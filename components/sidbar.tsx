"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,MessageCircle,
  BookOpen,
  Briefcase,
  Code,Users,
  FileText,
    User as UserIcon, 
  Image,
  Settings,
  LogOut,  FolderKanban,  // For Projets
  Mail  // For Contact
} from "lucide-react";

export default function Sidebar({ isOpen, closeSidebar }: { isOpen: boolean, closeSidebar: () => void }) {
  const pathname = usePathname();

const navItems = [
  { href: "/admin", icon: Home, label: "Home" },
  { href: "/admin/education", icon: BookOpen, label: "Education" },
  { href: "/admin/services", icon: Briefcase, label: "Services" },
  { href: "/admin/skills", icon: Code, label: "Skills" },
  { href: "/admin/projets", icon: FolderKanban, label: "Projets" },
  { href: "/admin/about_me", icon: UserIcon, label: "About Me" },
  { href: "/admin/contact", icon: Mail, label: "Contact" },
  { href: "/admin/messages", icon: MessageCircle, label: "Messages" },
  { href: "/admin/cv", icon: FileText, label: "CV" },
  { href: "/admin/photo", icon: Image, label: "Photo" },
  { href: "/admin/visitors", icon: Users, label: "Visitors" } // added item
];
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
   <aside
  className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transform
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    transition-transform duration-300 ease-in-out z-50`}
>

        <div className="flex flex-col h-full">
          {/* Logo/Site Name */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Admin
            </h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center p-3 rounded-lg ${
                      pathname === item.href
                        ? "bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-blue-400"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                    onClick={closeSidebar}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Bottom section */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <ul className="space-y-2">
              <li>
                <Link
                  href="/admin/settings"
                  className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  onClick={closeSidebar}
                >
                  <Settings className="h-5 w-5 mr-3" />
                  <span>Settings</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/logout"
                  className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  onClick={closeSidebar}
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  <span>Logout</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
}