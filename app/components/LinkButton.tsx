"use client";
import NextLink from "next/link";
import { Button, type ButtonProps } from "@mui/material";

/** MUI Button that navigates client-side. Safe to use from server components. */
export default function LinkButton({ href, ...props }: ButtonProps & { href: string }) {
  return <Button component={NextLink} href={href} {...props} />;
}
