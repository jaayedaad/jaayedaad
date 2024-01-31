import { getUserByUsername } from "@/actions/getUserByUsernameAction";

async function PublicProfilePage({ params }: { params: { username: string } }) {
  const user = await getUserByUsername(params.username);
  const publicProfile = user?.preferences[0].publicProfile;

  return (
    <div className="mt-14 pt-6 px-12">
      {publicProfile ? (
        <div>{params.username}&apos;s public profile page</div>
      ) : (
        <div>This user hasn&apos;t made their profile public</div>
      )}
    </div>
  );
}

export default PublicProfilePage;
