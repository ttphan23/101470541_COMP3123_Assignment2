import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getEmployee } from '../api/employees';

export default function EmployeeDetails() {
  const { id } = useParams();
  const nav = useNavigate();

  const { data: emp, isLoading, isError } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => getEmployee(id)
  });

  if (isLoading) return <Page><h3>Loading…</h3></Page>;
  if (isError || !emp) return <Page><h3>Employee not found.</h3></Page>;

  return (
    <Page>
      <div style={header}>
        <h2 style={{ margin: 0 }}>Employee Details</h2>
        <div>
          <Link to={`/employees/${emp._id}/edit`} style={btnPrimary}>Edit</Link>
          <button onClick={() => nav('/employees')} style={{ ...btnGhost, marginLeft: 8 }}>Back</button>
        </div>
      </div>

      <div style={card}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <div>
            {emp.profile_image_url ? (
              <img
                src={emp.profile_image_url}
                alt="profile"
                style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', border: '1px solid #eee' }}
              />
            ) : (
              <div style={avatarFallback}>No Image</div>
            )}
          </div>
          <div>
            <h3 style={{ margin: '0 0 4px' }}>
              {emp.first_name} {emp.last_name}
            </h3>
            <div style={{ color: '#666' }}>{emp.position} • {emp.department}</div>
          </div>
        </div>

        <hr style={hr} />

        <Info label="Email" value={emp.email} />
        <Info label="Salary" value={String(emp.salary)} />
        <Info label="Date of Joining" value={emp.date_of_joining ? new Date(emp.date_of_joining).toLocaleDateString() : '—'} />
        <Info label="Created" value={new Date(emp.createdAt).toLocaleString()} />
        <Info label="Updated" value={new Date(emp.updatedAt).toLocaleString()} />
        <Info label="ID" value={emp._id} />
      </div>
    </Page>
  );
}

function Info({ label, value }) {
  return (
    <div style={row}>
      <div style={labelStyle}>{label}</div>
      <div>{value || '—'}</div>
    </div>
  );
}

/* styles */
const Page = ({ children }) => (
  <div style={{ maxWidth: 900, margin: '24px auto', fontFamily: 'system-ui' }}>{children}</div>
);
const header = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 };
const card = { border: '1px solid #eaeaea', borderRadius: 10, padding: 16, background: '#fff' };
const hr = { margin: '16px 0', border: 0, borderTop: '1px solid #eee' };
const row = { display: 'grid', gridTemplateColumns: '180px 1fr', gap: 8, padding: '8px 0', borderBottom: '1px solid #f7f7f7' };
const labelStyle = { color: '#666', fontWeight: 600 };
const avatarFallback = {
  width: 96, height: 96, borderRadius: '50%', background: '#f3f3f3',
  display: 'grid', placeItems: 'center', color: '#999', border: '1px solid #eee'
};
const btnPrimary = { padding: '8px 12px', border: '1px solid #0a7', background: '#0a7', color: 'white', borderRadius: 8, textDecoration: 'none' };
const btnGhost = { padding: '8px 12px', border: '1px solid #ddd', background: 'white', color: '#333', borderRadius: 8, cursor: 'pointer' };
