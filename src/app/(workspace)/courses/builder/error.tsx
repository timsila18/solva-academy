"use client";
import Link from "next/link";
import {Button} from "@/components/ui/button";
export default function StudioError({reset}:{reset:()=>void}){
 return <section className="mx-auto max-w-xl space-y-5 px-6 py-16"><h1 className="text-2xl font-semibold">Course Studio could not load</h1><p className="text-muted-foreground">Check your connection and try again. Your saved course has not been changed.</p><div className="flex items-center gap-5"><Button onClick={reset}>Try again</Button><Link href="/instructor/courses" className="text-sm text-primary">My courses</Link></div></section>;
}
