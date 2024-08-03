import Link from "next/link";
import { Calendar } from "iconsax-react";

export interface BreadcrumbItem {
  label: string;
  href?: string | null;
}

const Breadcrumb = ({ items }: { items: BreadcrumbItem[] }) => {
  return (
    <nav
      aria-label="breadcrumb"
      className="flex items-center space-x-2 text-sm text-gray-600 m-4"
    >
      <Link href="/" className="hover:underline">
        <Calendar size={24} variant="Bulk" className={`${"text-zinc-700"}`} />
      </Link>
      <span className="mx-2">/</span>
      {items?.map((crumb, index) => (
        <span key={index} className="flex items-center">
          {index !== 0 && <span className="mx-2">/</span>}
          {crumb.href ? (
            crumb.href !== null && (
              <Link href={crumb.href} className="hover:underline">
                {crumb.label}
              </Link>
            )
          ) : (
            <span>{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumb;
