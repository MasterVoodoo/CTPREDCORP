import AdminPageComponent from '../../components/AdminPage';

interface AdminPageProps {
  onBack: () => void;
}

export default function AdminPage({ onBack }: AdminPageProps) {
  return <AdminPageComponent onBack={onBack} />;
}