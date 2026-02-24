import SettingForm from "@/components/setting/GeneralSetting/SettingForm";

export default function SettingPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="page-title">General Settings</h1>
        <p className="page-description">Kelola pengaturan umum aplikasi Anda</p>
      </div>

      {/* Settings Form */}
      <SettingForm />
    </div>
  );
}
