import { getUserProfile } from "@/app/actions/profile";
import ProfileForm from "./profile-form"; // Client Component ayırıyoruz

export default async function ProfilePage() {
  const user = await getUserProfile();

  if (!user) {
    return <div>Oturum açmanız gerekiyor.</div>;
  }

  // Tarihleri string'e çevirerek client component'e geçmek daha güvenli (Serialization uyarısı almamak için)
  const plainUser = {
    ...user,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Profil Ayarları</h1>
        <p className="text-muted-foreground">
          Kişisel bilgilerinizi ve hesap tercihlerinizi buradan yönetebilirsiniz.
        </p>
      </div>
      <ProfileForm user={plainUser} />
    </div>
  );
}