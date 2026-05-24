import Link from "next/link";
import React from "react";
import ArrowIcon from "./ArrowIcon";

interface CommonLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href?: string;
    inverse?: boolean;
    className?: string;
    iconClassName?: string;
    iconSize?: number;
}

export default function CommonLink({
    children,
    href = "/collections/all",
    inverse = false,
    className = "",
    iconClassName = "",
    iconSize=16,
    ...props
}: CommonLinkProps) {
    return (

        <Link
            href={href}
            {...props}
            className={`inline-flex items-center gap-2 border rounded-pill  pl-4 pr-1 py-1 text-sm duration-400 transition-all group ${inverse ? "text-white bg-[#3b3b3b] hover:bg-white hover:text-textPrimary" : "bg-white hover:text-white hover:bg-[#3b3b3b] text-textPrimary"} ${className}`}
        >
            {children} <div className={`${inverse ? "bg-white group-hover:bg-textPrimary" : "bg-textPrimary group-hover:bg-white"} rounded-full ml-auto mr-0 p-2 flex items-center justify-center ${iconClassName}`}>
                <ArrowIcon className={`${inverse ? "text-textPrimary group-hover:text-white" : "text-white group-hover:text-textPrimary"}`} size={iconSize} />
            </div>
        </Link>
    );
}
