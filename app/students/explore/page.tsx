import Explore from "@/components/students/explore";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function ExplorePage() {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
        redirect("/forstudents");
    }

    const user = session.user as any;
    if (user.userType !== 'student') {
        redirect('/hostelmanager');
    }

    return (
        <>
            <Explore />
        </>
    )
}