import { getCurrentUser } from "@/actions/getCurrentUser";
import Image from "next/image";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function Profile({ params }: { params: { username: string } }) {
  const userResponse = await getCurrentUser();

  return (
    <div className="my-6 px-6 w-full flex">
      <div className="min-w-[160px] mr-12">
        <div className="fixed">
          {userResponse && (
            <Image
              src={userResponse.userData.image!}
              alt="profile picture"
              width={160}
              height={160}
              className="rounded-md mb-2 border-2 border-spacing-2"
              priority
            />
          )}
          <h2 className="text-lg text-center">{params?.username}</h2>
          <div className="flex flex-col mt-8">
            <Button variant="ghost" className="justify-start" asChild>
              <Link href={`/dashboard/profile/${params.username}/settings`}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
