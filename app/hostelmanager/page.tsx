import GetStarted from "@/components/hostelmanager/get-started";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function Page() {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
        redirect("/forhostelowners");
    }

    const user = session.user as any;
    if (user.userType !== 'hostel_manager') {
        redirect('/students');
    }

    return (
        <>
            <GetStarted user={user} />
        </>
    )
}